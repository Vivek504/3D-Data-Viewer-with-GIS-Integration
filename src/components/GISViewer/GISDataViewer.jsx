import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAppContext } from '../../contexts/AppContext';
import { TABS } from '../../constants/Tabs';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GEOMETRY_TYPES, LAYER_TYPES } from "../../constants/Geometry";
import FeatureDetailsPopup from './FeatureDetailsPopup';

export default function GISDataViewer() {
    const { fileUploads, fileDetails } = useAppContext();
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const [selectedFeature, setSelectedFeature] = useState(null);

    useEffect(() => {
        console.log('Loading the map...');
        const file = fileUploads[TABS.GIS_VIEWER];

        if (!file || !fileDetails[TABS.GIS_VIEWER]) return;

        const geojsonData = fileDetails[TABS.GIS_VIEWER].fileContent;
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

            geojsonData.features.forEach(feature => {
                if (feature.geometry.type === "Point") {
                    const el = document.createElement('div');
                    el.className = 'marker';
                    el.style.width = '25px';
                    el.style.height = '35px';
                    el.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg width="25" height="35" viewBox="0 0 25 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 21.875 12.5 35 12.5 35C12.5 35 25 21.875 25 12.5C25 5.59644 19.4036 0 12.5 0ZM12.5 17C10.0147 17 8 14.9853 8 12.5C8 10.0147 10.0147 8 12.5 8C14.9853 8 17 10.0147 17 12.5C17 14.9853 14.9853 17 12.5 17Z" fill="%23FF5733"/></svg>')`;
                    el.style.backgroundSize = '100%';
                    el.style.cursor = 'pointer';

                    el.addEventListener('click', () => {
                        setSelectedFeature(feature);
                    });

                    const marker = new mapboxgl.Marker(el)
                        .setLngLat(feature.geometry.coordinates)
                        .addTo(map);

                    markersRef.current.push(marker);
                }
            });

            [GEOMETRY_TYPES.LINE_STRING, GEOMETRY_TYPES.POLYGON].forEach(type => {
                if (geojsonData.features.some(feature => feature.geometry.type === type)) {
                    const layerId = `${type}-layer`;
                    map.addLayer({
                        id: layerId,
                        type: type === GEOMETRY_TYPES.LINE_STRING ? LAYER_TYPES.LINE : LAYER_TYPES.FILL,
                        source: "gis-data",
                        paint: type === GEOMETRY_TYPES.LINE_STRING ? { "line-width": 2, "line-color": "#335BFF" } : { "fill-color": "#33FF57", "fill-opacity": 0.5 },
                        filter: ["==", ["geometry-type"], type]
                    });

                    map.on("click", layerId, (e) => {
                        const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
                        if (features.length > 0) {
                            setSelectedFeature(features[0]);
                        }
                    });

                }
            });

            const bounds = new mapboxgl.LngLatBounds();
            geojsonData.features.forEach((feature) => {
                if (feature.geometry.type === GEOMETRY_TYPES.POINT) {
                    bounds.extend(feature.geometry.coordinates);
                }
                else if ([GEOMETRY_TYPES.LINE_STRING, GEOMETRY_TYPES.POLYGON].includes(feature.geometry.type)) {
                    feature.geometry.coordinates.flat().forEach(coord => bounds.extend(coord));
                }
            });

            if (!bounds.isEmpty()) {
                map.fitBounds(bounds, { padding: 50 });
            }
        });

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
            map.remove();
        };
    }, [fileUploads[TABS.GIS_VIEWER], fileDetails[TABS.GIS_VIEWER]]);

    return (
        <div className="w-full h-full relative">
            <div ref={mapContainerRef} className="w-full h-full" />
            {selectedFeature && (
                <FeatureDetailsPopup
                    feature={selectedFeature}
                    onClose={() => setSelectedFeature(null)}
                />
            )}
        </div>
    );
}