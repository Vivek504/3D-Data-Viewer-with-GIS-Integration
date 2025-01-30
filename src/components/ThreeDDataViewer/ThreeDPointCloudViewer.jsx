import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import * as THREE from 'three';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';
import { XYZLoader } from 'three/examples/jsm/loaders/XYZLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TABS } from '../../constants/Tabs';
import { FILE_TYPES } from '../../constants/FileTypes';
import { useThreeDDataViewerContext } from '../../contexts/ThreeDDataViewerContext';

export default function ThreeDPointCloudViewer() {
    const { fileUploads } = useAppContext();
    const containerRef = useRef(null);
    const { pointSize, setPointSize } = useThreeDDataViewerContext();

    const loadedObjectRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        const file = fileUploads[TABS.THREED_DATA_VIEWER];
        if (!file) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111827);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const reader = new FileReader();

        reader.onload = (event) => {
            let loadedObject;

            if (file.name.endsWith(FILE_TYPES.PCD)) {
                const loader = new PCDLoader();
                loadedObject = loader.parse(event.target.result);
            }
            else if (file.name.endsWith(FILE_TYPES.XYZ)) {
                const loader = new XYZLoader();
                const geometry = loader.parse(event.target.result);
                const material = new THREE.PointsMaterial({ size: 0.005, color: 0xffffff });
                loadedObject = new THREE.Points(geometry, material);
            }

            if (loadedObject) {
                if (loadedObject.material && loadedObject.material.size) {
                    setPointSize(loadedObject.material.size)
                }
                loadedObject.frustumCulled = false;
                scene.add(loadedObject);
                loadedObjectRef.current = loadedObject;
                fitCameraToObject(camera, controls, loadedObject, renderer);
            }
        };

        if (file.name.endsWith(FILE_TYPES.PCD)) {
            reader.readAsArrayBuffer(file);
        }
        else if (file.name.endsWith(FILE_TYPES.XYZ)) {
            reader.readAsText(file);
        }

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth;
                const height = containerRef.current.clientHeight;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', handleResize);

        const fitCameraToObject = (camera, controls, object, renderer, offset = 1.25) => {
            const boundingBox = new THREE.Box3().setFromObject(object);

            const center = boundingBox.getCenter(new THREE.Vector3());
            const size = boundingBox.getSize(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;

            camera.position.set(center.x, center.y, cameraZ);
            camera.near = maxDim / 100;
            camera.far = maxDim * 100;
            camera.updateProjectionMatrix();

            if (controls) {
                controls.target.copy(center);
                controls.update();
            }

            renderer.render(scene, camera);
        };

        return () => {
            window.removeEventListener('resize', handleResize);

            if (renderer) {
                renderer.dispose();
            }

            if (scene) {
                scene.traverse((object) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach((material) => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }

            while (containerRef.current && containerRef.current.firstChild) {
                containerRef.current.removeChild(containerRef.current.firstChild);
            }
        };
    }, [fileUploads[TABS.THREED_DATA_VIEWER]]);

    useEffect(() => {
        if (loadedObjectRef.current) {
            if (loadedObjectRef.current.material) {
                loadedObjectRef.current.material.size = pointSize;
                loadedObjectRef.current.material.needsUpdate = true;
            }
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        }
    }, [pointSize]);

    return <div ref={containerRef} className="w-full h-full" />;
}
