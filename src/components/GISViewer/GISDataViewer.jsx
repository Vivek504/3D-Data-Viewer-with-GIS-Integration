import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAppContext } from '../../contexts/AppContext';
import { TABS } from '../../constants/Tabs';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GEOMETRY_TYPE_LABELS, GEOMETRY_TYPES, LAYER_TYPES } from "../../constants/Geometry";
import FeatureDetailsPopup from './FeatureDetails/FeatureDetailsPopup';
import { useGISViewerContext } from '../../contexts/GISViewerContext';
import { MAP_STYLE_URLS } from '../../constants/MapStyles';
import MapSearch from './MapSearch/MapSearch';
import { filterGeoJSONByGeometryType, filterGeoJSONDataBySearchText } from '../../utils/GeoJSONFilterUtils';
import ErrorMessageDialog from '../shared/ErrorMessageDialog';
import { FILE_MESSAGES, GIS_DATA_VIEWER_MESSAGES } from '../../constants/ErrorMessages';
import { addLogs } from '../../utils/LogUtils';
import { LOG_TYPES } from '../../constants/LogTypes';
import { SYSTEM_FEEDBACK, USER_ACTIONS } from '../../constants/LogsMessages';

export default function GISDataViewer() {
    const { fileUploads, fileDetails, setLogs } = useAppContext();
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const {
        mapStyle,
        searchText, setSearchText,
        filteredGeometryTypes, setFilteredGeometryTypes,
        pointColor, lineColor, polygonColor,
        filteredData, setFilteredData
    } = useGISViewerContext();
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErroMessage] = useState();

    // Function to add point markers on the map
    const addPointMarkers = (geojsonData) => {
        const map = mapRef.current;
        if (!map) return;

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        geojsonData.features.forEach(feature => {
            if (feature.geometry.type === GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.POINT]) {
                // Create a new marker element
                const el = document.createElement('div');
                el.className = 'marker';
                el.style.width = '25px';
                el.style.height = '35px';
                el.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg width="25" height="35" viewBox="0 0 25 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 21.875 12.5 35 12.5 35C12.5 35 25 21.875 25 12.5C25 5.59644 19.4036 0 12.5 0ZM12.5 17C10.0147 17 8 14.9853 8 12.5C8 10.0147 10.0147 8 12.5 8C14.9853 8 17 10.0147 17 12.5C17 14.9853 14.9853 17 12.5 17Z" fill="${encodeURIComponent(pointColor)}"/></svg>')`;
                el.style.backgroundSize = '100%';
                el.style.cursor = 'pointer';

                // Event listener for when the marker is clicked
                el.addEventListener('click', () => {
                    setSelectedFeature(feature);
                });

                // Create the marker on the map
                const marker = new mapboxgl.Marker(el)
                    .setLngLat(feature.geometry.coordinates)
                    .addTo(map);

                markersRef.current.push(marker);
            }
        });
    };

    // Function to get GeoJSON data from fileUploads
    const getGeoJsonData = () => {
        const file = fileUploads[TABS.GIS_VIEWER];
        if (!file || !fileDetails[TABS.GIS_VIEWER]) return;

        return fileDetails[TABS.GIS_VIEWER].fileContent;
    }

    // Function to update filtered data by search text
    const updateFilteredDataBySearchText = (searchText) => {
        const geojsonData = getGeoJsonData();
        if (geojsonData) {
            const filteredDataByGeometryType = filterGeoJSONByGeometryType(geojsonData, filteredGeometryTypes);
            if (filteredDataByGeometryType) {
                setFilteredData(filterGeoJSONDataBySearchText(filteredDataByGeometryType, searchText));
            }
        }
    }

    // Function to update filtered data by geometry type
    const updateFilteredDataByGeometryType = () => {
        const geojsonData = getGeoJsonData();
        if (geojsonData) {
            setFilteredData(filterGeoJSONByGeometryType(geojsonData, filteredGeometryTypes));
        }
    }

    // Function to update the data layers on the map
    const updateDataLayers = () => {
        try {
            const map = mapRef.current;
            if (!map) return;

            if (!filteredData) return;

            // Update the source data for GIS data
            if (map.getSource("gis-data")) {
                map.getSource("gis-data").setData(filteredData);
            }
            else {
                map.addSource("gis-data", {
                    type: "geojson",
                    data: filteredData
                });
            }

            // Show error if no data is found
            if (filteredData.features.length === 0) {
                setShowErrorMessageDialog(true);
                setErroMessage(GIS_DATA_VIEWER_MESSAGES.NO_DATA_FOUND);
            }

            // Add point markers for the data
            addPointMarkers(filteredData);

            // Add line and polygon layers
            [GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.LINE_STRING], GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.POLYGON]].forEach(type => {
                const layerId = `${type}-layer`;
                if (!map.getLayer(layerId)) {
                    map.addLayer({
                        id: layerId,
                        type: type === GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.LINE_STRING] ? LAYER_TYPES.LINE : LAYER_TYPES.FILL,
                        source: "gis-data",
                        paint: type === GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.LINE_STRING]
                            ? { "line-width": 3, "line-color": lineColor }
                            : { "fill-color": polygonColor, "fill-opacity": 0.5 },
                        filter: ["==", ["geometry-type"], type]
                    });

                    // Event listener for layer clicks
                    map.on("click", layerId, (e) => {
                        const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
                        if (features.length > 0) {
                            setSelectedFeature(features[0]);
                        }
                    });
                }
            });

            // Fit map bounds to the data
            const bounds = new mapboxgl.LngLatBounds();

            filteredData.features.forEach((feature) => {
                if (feature.geometry.type === GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.POINT]) {
                    bounds.extend(feature.geometry.coordinates);
                }
                else if (feature.geometry.type === GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.LINE_STRING]) {
                    feature.geometry.coordinates.forEach(coord => {
                        if (Array.isArray(coord) && coord.length >= 2) {
                            bounds.extend(coord);
                        }
                    });
                }
                else if (feature.geometry.type === GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.POLYGON]) {
                    feature.geometry.coordinates.forEach(ring => {
                        ring.forEach(coord => {
                            if (Array.isArray(coord) && coord.length >= 2) {
                                bounds.extend(coord);
                            }
                        });
                    });
                }
            });

            if (!bounds.isEmpty()) {
                map.fitBounds(bounds, { padding: 50, maxZoom: 7 });
            }
        }
        catch (error) {
            setShowErrorMessageDialog(true);
            setErroMessage(FILE_MESSAGES.INVALID_FILE);
        }
    };

    // Function to update layer colors
    const updateLayerColors = () => {
        const map = mapRef.current;
        if (!map) return;

        if (map.getLayer(GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.LINE_STRING] + "-layer")) {
            map.setPaintProperty(GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.LINE_STRING] + "-layer", "line-color", lineColor);
        }

        if (map.getLayer(GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.POLYGON] + "-layer")) {
            map.setPaintProperty(GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.POLYGON] + "-layer", "fill-color", polygonColor);
        }

        // Update the point marker colors
        markersRef.current.forEach(marker => {
            const el = marker.getElement();
            el.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg width="25" height="35" viewBox="0 0 25 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 21.875 12.5 35 12.5 35C12.5 35 25 21.875 25 12.5C25 5.59644 19.4036 0 12.5 0ZM12.5 17C10.0147 17 8 14.9853 8 12.5C8 10.0147 10.0147 8 12.5 8C14.9853 8 17 10.0147 17 12.5C17 14.9853 14.9853 17 12.5 17Z" fill="${encodeURIComponent(pointColor)}"/></svg>')`;
        });
    };

    // Initialize the Mapbox map and set up layers
    useEffect(() => {
        const file = fileUploads[TABS.GIS_VIEWER];
        if (!file || !fileDetails[TABS.GIS_VIEWER]) return;

        const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        if (!mapboxToken) return;

        mapboxgl.accessToken = mapboxToken;
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: MAP_STYLE_URLS[mapStyle],
            center: [-106.3468, 56.1304],
            zoom: 7,
        });

        const map = mapRef.current;
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.on("load", () => {
            const geojsonData = getGeoJsonData();
            if (geojsonData) {
                setFilteredData(geojsonData);
                addLogs(LOG_TYPES.SYSTEM, SYSTEM_FEEDBACK.DISPLAYED_MAP, setLogs);
            }
        });

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
            map.remove();
        };
    }, [fileUploads, fileDetails]);

    // Update map style when mapStyle changes
    useEffect(() => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
            mapRef.current.setStyle(MAP_STYLE_URLS[mapStyle]);
            mapRef.current.once("styledata", updateDataLayers);
            addLogs(LOG_TYPES.USER, USER_ACTIONS.APPLIED_MAP_STYLE_FILTER, setLogs);
        }
    }, [mapStyle]);

    // Update filtered data based on search text
    useEffect(() => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
            updateFilteredDataBySearchText(searchText);
            addLogs(LOG_TYPES.USER, USER_ACTIONS.SEARCHED_GIS_DATA, setLogs);
        }
    }, [searchText]);

    // Update filtered data based on geometry type
    useEffect(() => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
            updateFilteredDataByGeometryType();
            addLogs(LOG_TYPES.USER, USER_ACTIONS.APPLIED_GEOMETRY_TYPE_FILTER, setLogs);
        }
    }, [filteredGeometryTypes]);

    // Update map layers when filtered data changes
    useEffect(() => {
        if (filteredData) {
            if (mapRef.current && mapRef.current.isStyleLoaded()) {
                updateDataLayers();
            }
        }
    }, [filteredData]);

    // Update layer colors when point, line, or polygon color changes
    useEffect(() => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
            updateLayerColors();
        }
    }, [pointColor, lineColor, polygonColor]);

    return (
        <div className="w-full h-full relative">
            <MapSearch
                searchText={searchText} setSearchText={setSearchText}
                filteredGeometryTypes={filteredGeometryTypes} setFilteredGeometryTypes={setFilteredGeometryTypes}
            />

            <div ref={mapContainerRef} className="w-full h-full" />

            {selectedFeature && (
                <FeatureDetailsPopup
                    feature={selectedFeature}
                    onClose={() => setSelectedFeature(null)}
                />
            )}

            {showErrorMessageDialog && (
                <ErrorMessageDialog
                    message={errorMessage}
                    onClose={() => setShowErrorMessageDialog(false)}
                />
            )}
        </div>
    );
}
