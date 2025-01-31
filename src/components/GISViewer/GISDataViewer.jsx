import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAppContext } from '../../contexts/AppContext';
import { TABS } from '../../constants/Tabs';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function GISDataViewer() {
    const { fileUploads, fileDetails } = useAppContext();
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        console.log('Loading the map...');
        const file = fileUploads[TABS.GIS_VIEWER];

        if (!file || !fileDetails[TABS.GIS_VIEWER]) return;

        const geojsonData = fileDetails[TABS.GIS_VIEWER].fileContent;
        console.log(geojsonData)
        const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        if (!mapboxToken) {
            console.error("Mapbox token is missing. Check .env.development.local");
            return;
        }

        mapboxgl.accessToken = mapboxToken;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [-106.3468, 56.1304],
            zoom: 4,
        });

        const map = mapRef.current;
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.on("load", () => {
            map.addSource("gis-data", {
                type: "geojson",
                data: geojsonData
            });

            const layerStyles = {
                Point: {
                    id: "point-layer",
                    type: "circle",
                    paint: { "circle-radius": 6, "circle-color": "#FF5733" }
                },
                LineString: {
                    id: "line-layer",
                    type: "line",
                    paint: { "line-width": 2, "line-color": "#335BFF" }
                },
                Polygon: {
                    id: "polygon-layer",
                    type: "fill",
                    paint: { "fill-color": "#33FF57", "fill-opacity": 0.5 }
                }
            };

            Object.entries(layerStyles).forEach(([type, style]) => {
                if (geojsonData.features.some((feature) => feature.geometry.type === type)) {
                    map.addLayer({
                        id: style.id,
                        type: style.type,
                        source: "gis-data",
                        paint: style.paint,
                        filter: ["==", ["geometry-type"], type]
                    });
                }
            });

            const handleFeatureClick = (e, geometryType) => {
                if (e.features.length > 0) {
                    const feature = e.features[0];
                    let coordinates;

                    switch (geometryType) {
                        case "Point":
                            coordinates = feature.geometry.coordinates;
                            break;
                        case "LineString":
                            coordinates = feature.geometry.coordinates;
                            break;
                        case "Polygon":
                            coordinates = feature.geometry.coordinates.flat();
                            break;
                        default:
                            coordinates = feature.geometry.coordinates;
                    }

                    setMetadata({
                        geometryType,
                        coordinates,
                        properties: feature.properties || {},
                    });
                }
            };

            map.on("click", "point-layer", (e) => handleFeatureClick(e, "Point"));
            map.on("click", "line-layer", (e) => handleFeatureClick(e, "LineString"));
            map.on("click", "polygon-layer", (e) => handleFeatureClick(e, "Polygon"));

            ["point-layer", "line-layer", "polygon-layer"].forEach((layer) => {
                map.on("mouseenter", layer, () => {
                    map.getCanvas().style.cursor = "pointer";
                });
                map.on("mouseleave", layer, () => {
                    map.getCanvas().style.cursor = "";
                });
            });

            const bounds = new mapboxgl.LngLatBounds();
            geojsonData.features.forEach((feature) => {
                if (feature.geometry.type === "Point") {
                    bounds.extend(feature.geometry.coordinates);
                } else if (["LineString", "Polygon"].includes(feature.geometry.type)) {
                    feature.geometry.coordinates.flat().forEach(coord => bounds.extend(coord));
                }
            });

            if (!bounds.isEmpty()) {
                map.fitBounds(bounds, { padding: 50 });
            }
        });

        return () => map.remove();
    }, [fileUploads[TABS.GIS_VIEWER], fileDetails[TABS.GIS_VIEWER]]);

    const formatCoordinate = (coord) => coord.map(num => Number(num).toFixed(3)).join(", ");

    const renderCoordinates = (coords) => {
        if (!Array.isArray(coords[0])) {
            return <span>{formatCoordinate(coords)}</span>;
        }

        return (
            <ul className="list-disc list-inside">
                {coords.map((coord, index) => (
                    Array.isArray(coord[0])
                        ? <li key={index}>
                            <strong>Ring {index + 1}:</strong>
                            <ul className="list-disc list-inside ml-4">
                                {coord.map((c, i) => (
                                    <li key={i}>{formatCoordinate(c)}</li>
                                ))}
                            </ul>
                        </li>
                        : <li key={index}>{formatCoordinate(coord)}</li>
                ))}
            </ul>
        );
    };

    const renderProperties = (props) => {
        return (
            <ul className="list-disc list-inside">
                {Object.entries(props).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {typeof value === 'object' && value !== null ? renderProperties(value) : String(value)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="w-full h-full relative">
            <div ref={mapContainerRef} className="w-full h-full" />

            {metadata && (
                <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-xs overflow-auto z-50">
                    <h3 className="text-lg font-semibold">Feature Info</h3>
                    <p className="text-gray-700 text-sm">
                        <strong>Geometry Type:</strong> {metadata.geometryType}
                    </p>
                    <div className="text-gray-700 text-sm mb-2">
                        <strong>Coordinates:</strong>
                        <div className="ml-4">
                            {renderCoordinates(metadata.coordinates)}
                        </div>
                    </div>
                    {Object.keys(metadata.properties).length > 0 && (
                        <div className="mt-2">
                            <strong>Properties:</strong>
                            <div className="ml-4">
                                {renderProperties(metadata.properties)}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setMetadata(null)}
                        className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}
