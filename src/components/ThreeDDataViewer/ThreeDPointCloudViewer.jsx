import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import * as THREE from 'three';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';
import { XYZLoader } from 'three/examples/jsm/loaders/XYZLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TABS } from '../../constants/Tabs';
import { FILE_TYPES } from '../../constants/FileTypes';
import { useThreeDDataViewerContext } from '../../contexts/ThreeDDataViewerContext';
import { POINT_CLOUD_COLORS } from '../../constants/ThreeDViewerColors';
import { addLogs } from '../../utils/LogUtils';
import { LOG_TYPES } from '../../constants/LogTypes';
import { SYSTEM_FEEDBACK, USER_ACTIONS } from '../../constants/LogsMessages';

export default function ThreeDPointCloudViewer() {
    const { fileUploads, setLogs } = useAppContext();
    const containerRef = useRef(null);
    const {
        pointSize,
        setPointSize,
        colorRanges,
        applyColorMapping,
        resetColorMapping,
        setResetColorMapping,
        altitudeRanges,
        backgroundColor
    } = useThreeDDataViewerContext();

    // References to store three.js objects and original data
    const loadedObjectRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const originalColorsRef = useRef(null);
    const originalGeometryRef = useRef(null);

    // Log when a 3D object has been loaded and displayed
    useEffect(() => {
        if (loadedObjectRef) {
            addLogs(LOG_TYPES.SYSTEM, SYSTEM_FEEDBACK.DISPLAYED_3D_DATA, setLogs);
        }
    }, [loadedObjectRef]);

    useEffect(() => {
        // Get the file for the 3D data viewer tab
        const file = fileUploads[TABS.THREED_DATA_VIEWER];
        if (!file) return;

        // Initialize scene, camera and renderer
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);
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

        // Set up orbit controls for camera interaction
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const reader = new FileReader();

        reader.onload = (event) => {
            let loadedObject;

            // Parse PCD files using PCDLoader
            if (file.name.endsWith(FILE_TYPES.PCD)) {
                const loader = new PCDLoader();
                loadedObject = loader.parse(event.target.result);

                // Save original colors if available
                if (loadedObject.material && loadedObject.material.vertexColors) {
                    const colorsAttribute = loadedObject.geometry.getAttribute('color');
                    if (colorsAttribute) {
                        originalColorsRef.current = colorsAttribute.array.slice();
                    }
                }
            }
            // Parse XYZ files using XYZLoader
            else if (file.name.endsWith(FILE_TYPES.XYZ)) {
                const loader = new XYZLoader();
                const geometry = loader.parse(event.target.result);
                const material = new THREE.PointsMaterial({ size: 0.005, vertexColors: false, color: POINT_CLOUD_COLORS.DEFAULT });
                loadedObject = new THREE.Points(geometry, material);
            }

            if (loadedObject) {
                // Set point size if available and store the original geometry
                if (loadedObject.material && loadedObject.material.size) {
                    if (!pointSize) {
                        setPointSize(loadedObject.material.size);
                    }
                }
                loadedObject.frustumCulled = false;
                originalGeometryRef.current = loadedObject.geometry.clone();

                // Apply color mapping if enabled
                if (applyColorMapping) {
                    applyColorMappingOnObject(loadedObject);
                }

                scene.add(loadedObject);
                loadedObjectRef.current = loadedObject;

                // Apply point size filter if necessary
                if (pointSize && loadedObjectRef.current.material && loadedObjectRef.current.material.size != pointSize) {
                    applyPointSizeFilter();
                }

                // Apply altitude filter if ranges are defined
                if (altitudeRanges) {
                    applyAltitudeFilter();
                }

                // Adjust camera to fit the loaded object
                fitCameraToObject(camera, controls, loadedObject, renderer);
            }
        };

        // Read file as ArrayBuffer for PCD or as text for XYZ files
        if (file.name.endsWith(FILE_TYPES.PCD)) {
            reader.readAsArrayBuffer(file);
        }
        else if (file.name.endsWith(FILE_TYPES.XYZ)) {
            reader.readAsText(file);
        }

        // Animation loop for rendering
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
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

        // Adjust camera position and parameters to fit the object
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

        // Cleanup function on component unmount or file change
        return () => {
            window.removeEventListener('resize', handleResize);

            if (renderer) {
                renderer.dispose();
            }

            // Dispose all geometries and materials in the scene
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

            originalColorsRef.current = null;
            originalGeometryRef.current = null;
        };
    }, [fileUploads[TABS.THREED_DATA_VIEWER]]);

    // Update point size of the loaded object
    const applyPointSizeFilter = () => {
        addLogs(LOG_TYPES.USER, USER_ACTIONS.ADJUSTED_POINT_SIZE, setLogs);
        if (loadedObjectRef.current && pointSize) {
            if (loadedObjectRef.current.material && loadedObjectRef.current.material.size != pointSize) {
                loadedObjectRef.current.material.size = pointSize;
                loadedObjectRef.current.material.needsUpdate = true;

                if (rendererRef.current && sceneRef.current && cameraRef.current) {
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                }
            }
        }
    };

    // Apply color mapping based on altitude to the object's geometry
    const applyColorMappingOnObject = (object) => {
        if (!object.geometry || !object.geometry.attributes.position) return;

        const positions = object.geometry.attributes.position.array;
        const colors = new Float32Array((positions.length / 3) * 3);
        const color = new THREE.Color();

        // Loop through each point and assign color based on altitude
        for (let i = 0; i < positions.length; i += 3) {
            const altitude = positions[i + 1];
            let assignedColor = POINT_CLOUD_COLORS.DEFAULT;

            for (const range of colorRanges) {
                if (altitude >= range.from && altitude <= range.to) {
                    assignedColor = range.color;
                    break;
                }
            }

            color.set(assignedColor);

            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        object.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        object.material.vertexColors = true;
        object.material.needsUpdate = true;

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
    };

    // Filter the geometry based on altitude ranges
    const applyAltitudeFilter = () => {
        if (!loadedObjectRef.current || !originalGeometryRef.current) return;

        const filteredGeometry = originalGeometryRef.current.clone();
        const positions = filteredGeometry.attributes.position.array;
        const totalPoints = positions.length / 3;

        const indices = [];

        // Identify points within the specified altitude ranges
        for (let i = 0; i < totalPoints; i++) {
            const y = positions[i * 3 + 1];
            for (const range of altitudeRanges) {
                if (y >= range.from && y <= range.to) {
                    indices.push(i);
                    break;
                }
            }
        }

        if (indices.length === 0) {
            return;
        }

        const filteredPositions = new Float32Array(indices.length * 3);
        let filteredColors = null;

        if (originalColorsRef.current) {
            filteredColors = new Float32Array(indices.length * 3);
        }

        // Build new geometry with filtered points
        for (let i = 0; i < indices.length; i++) {
            const index = indices[i];
            filteredPositions.set(
                [
                    positions[index * 3],
                    positions[index * 3 + 1],
                    positions[index * 3 + 2]
                ],
                i * 3
            );

            if (originalColorsRef.current) {
                filteredColors.set(
                    [
                        originalColorsRef.current[index * 3],
                        originalColorsRef.current[index * 3 + 1],
                        originalColorsRef.current[index * 3 + 2]
                    ],
                    i * 3
                );
            }
        }

        filteredGeometry.setAttribute('position', new THREE.BufferAttribute(filteredPositions, 3));

        if (filteredColors) {
            filteredGeometry.setAttribute('color', new THREE.BufferAttribute(filteredColors, 3));
        }

        // Replace geometry of the loaded object
        loadedObjectRef.current.geometry.dispose();
        loadedObjectRef.current.geometry = filteredGeometry;

        if (applyColorMapping) {
            applyColorMappingOnObject(loadedObjectRef.current);
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
    };

    // Update point size when the pointSize state changes
    useEffect(() => {
        if (loadedObjectRef.current && pointSize && loadedObjectRef.current.material && loadedObjectRef.current.material.size != pointSize) {
            applyPointSizeFilter();
        }
    }, [pointSize, applyPointSizeFilter]);

    // Update color mapping when toggled or when color ranges change
    useEffect(() => {
        if (loadedObjectRef.current) {
            if (applyColorMapping) {
                applyColorMappingOnObject(loadedObjectRef.current);
            }
            else {
                // Reset to original colors if available, otherwise use default
                if (loadedObjectRef.current.material.vertexColors) {
                    if (originalColorsRef.current) {
                        const colors = new Float32Array(originalColorsRef.current.length);
                        colors.set(originalColorsRef.current);
                        loadedObjectRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                        loadedObjectRef.current.material.vertexColors = true;
                    }
                    else {
                        loadedObjectRef.current.material.vertexColors = false;
                        loadedObjectRef.current.material.color.set(POINT_CLOUD_COLORS.DEFAULT);
                    }
                    loadedObjectRef.current.material.needsUpdate = true;
                }
                else {
                    loadedObjectRef.current.material.color.set(POINT_CLOUD_COLORS.DEFAULT);
                    loadedObjectRef.current.material.needsUpdate = true;
                }
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        }
    }, [applyColorMapping, colorRanges]);

    // Reset color mapping if the reset flag is enabled
    useEffect(() => {
        if (resetColorMapping) {
            if (loadedObjectRef.current) {
                if (originalColorsRef.current) {
                    const colors = new Float32Array(originalColorsRef.current.length);
                    colors.set(originalColorsRef.current);
                    loadedObjectRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                    loadedObjectRef.current.material.vertexColors = true;
                }
                else {
                    loadedObjectRef.current.material.vertexColors = false;
                    loadedObjectRef.current.material.color.set(POINT_CLOUD_COLORS.DEFAULT);
                }
                loadedObjectRef.current.material.needsUpdate = true;

                if (rendererRef.current && sceneRef.current && cameraRef.current) {
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                }

                if (setResetColorMapping) {
                    setResetColorMapping(false);
                }
            }
        }
    }, [resetColorMapping, setResetColorMapping]);

    // Re-apply altitude filter when altitude ranges change
    useEffect(() => {
        applyAltitudeFilter();
    }, [altitudeRanges]);

    // Update scene background color when it changes
    useEffect(() => {
        if (sceneRef.current) {
            sceneRef.current.background = new THREE.Color(backgroundColor);
            if (rendererRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        }
    }, [backgroundColor]);

    return <div ref={containerRef} className="w-full h-full" />;
}
