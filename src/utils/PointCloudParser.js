import * as THREE from 'three'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import { XYZLoader } from 'three/examples/jsm/loaders/XYZLoader'

export const parseXYZFile = async (file) => {
    const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });

    const xyzLoader = new XYZLoader();
    const geometry = xyzLoader.parse(text);

    const bbox = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
    const size = bbox.getSize(new THREE.Vector3());

    return {
        filename: file.name,
        fileSize: file.size,
        numPoints: geometry.attributes.position.count,
        boundingBox: {
            min: bbox.min,
            max: bbox.max,
            width: size.x,
            height: size.y,
            depth: size.z,
        },
    };
};

export const parsePCDFile = (file) => {
    return new Promise((resolve, reject) => {
        const loader = new PCDLoader();
        const reader = new FileReader();

        reader.onload = (event) => {
            const content = event.target.result;
            const pointCloud = loader.parse(content);

            const bbox = new THREE.Box3().setFromObject(pointCloud);
            const size = bbox.getSize(new THREE.Vector3());

            resolve({
                filename: file.name,
                fileSize: file.size,
                numPoints: pointCloud.geometry.attributes.position.count,
                boundingBox: {
                    min: bbox.min,
                    max: bbox.max,
                    width: size.x,
                    height: size.y,
                    depth: size.z,
                },
            });
        };

        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};