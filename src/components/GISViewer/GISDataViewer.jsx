import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAppContext } from '../../contexts/AppContext';
import { TABS } from '../../constants/Tabs';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GEOMETRY_TYPE_LABELS, GEOMETRY_TYPES } from "../../constants/Geometry";
import FeatureDetailsPopup from './FeatureDetails/FeatureDetailsPopup';
import { useGISViewerContext } from '../../contexts/GISViewerContext';
import { MAP_STYLE_URLS } from '../../constants/MapStyles';
import MapSearch from './MapSearch/MapSearch';
import { filterGeoJSONByDate, filterGeoJSONByGeometryType, filterGeoJSONDataBySearchText, getMinMaxDate } from '../../utils/GeoJSONFilterUtils';
import ErrorMessageDialog from '../shared/ErrorMessageDialog';
import { FILE_MESSAGES, GIS_DATA_VIEWER_MESSAGES } from '../../constants/ErrorMessages';
import { addLogs } from '../../utils/LogUtils';
import { LOG_TYPES } from '../../constants/LogTypes';
import { SYSTEM_FEEDBACK, USER_ACTIONS } from '../../constants/LogsMessages';
import TimeSeriesControl from './TimeSeriesAnimation/TimeSeriesControl';
import { GIS_SETTINGS } from '../../constants/GISSettings';

export default function GISDataViewer() {
    const { activeTab, fileUploads, fileDetails, setLogs } = useAppContext();
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

    const [minDate, setMinDate] = useState();
    const [maxDate, setMaxDate] = useState();
    const [selectedDate, setSelectedDate] = useState();
    const [isTimeBoxVisible, setIsTimeBoxVisible] = useState(false);

    // Function to add point markers on the map
    const addPointMarkers = (geojsonData) => {
        const map = mapRef.current;
        if (!map || !geojsonData) return;

        const type = GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.POINT];
        const layerId = `${type}-layer`;

        // Add circle layer for points
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: "circle",
                source: GIS_SETTINGS.LAYER.SOURCE.ID,
                paint: {
                    "circle-radius": GIS_SETTINGS.GEOMETRY.POINT.CIRCLE.RADIUS,
                    "circle-color": pointColor,
                    "circle-stroke-width": GIS_SETTINGS.GEOMETRY.POINT.CIRCLE.STROKE_WIDTH,
                    "circle-stroke-color": GIS_SETTINGS.GEOMETRY.POINT.CIRCLE.STROKE_COLOR
                },
                filter: ["==", ["geometry-type"], type]
            });

            // Add interactivity: hover effect
            map.on("mouseenter", layerId, () => {
                map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", layerId, () => {
                map.getCanvas().style.cursor = "";
            });

            // Click event to select feature
            map.on("click", layerId, (e) => {
                const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
                if (features.length > 0) {
                    setSelectedFeature(features[0]);
                }
            });
        }
    };

    // Function to add line and polygon
    const addLineAndPolygon = () => {
        const map = mapRef.current;
        if (!map) return;

        [GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.LINE_STRING], GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.POLYGON]].forEach(type => {
            const layerId = `${type}-layer`;
            if (!map.getLayer(layerId)) {
                map.addLayer({
                    id: layerId,
                    type: type === GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.LINE_STRING] ? "line" : "fill",
                    source: GIS_SETTINGS.LAYER.SOURCE.ID,
                    paint: type === GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.LINE_STRING]
                        ? { "line-width": GIS_SETTINGS.GEOMETRY.LINE.WIDTH, "line-color": lineColor }
                        : { "fill-color": polygonColor, "fill-opacity": GIS_SETTINGS.GEOMETRY.POLYGON.OPACITY },
                    filter: ["==", ["geometry-type"], type]
                });

                // Add hover effect to change cursor
                map.on("mouseenter", layerId, () => {
                    map.getCanvas().style.cursor = "pointer";
                });

                map.on("mouseleave", layerId, () => {
                    map.getCanvas().style.cursor = "";
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
    }

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

    // Function to update filtered data by date
    const updatedFilteredDataByDate = () => {
        const geojsonData = getGeoJsonData();
        if (geojsonData && selectedDate) {
            setFilteredData(filterGeoJSONByDate(geojsonData, selectedDate));
        }
    }

    // Function to update the data layers on the map
    const updateDataLayers = () => {
        try {
            const map = mapRef.current;
            if (!map) return;

            if (!filteredData) return;

            // Update the source data for GIS data
            if (map.getSource(GIS_SETTINGS.LAYER.SOURCE.ID)) {
                map.getSource(GIS_SETTINGS.LAYER.SOURCE.ID).setData(filteredData);
            }
            else {
                map.addSource(GIS_SETTINGS.LAYER.SOURCE.ID, {
                    type: GIS_SETTINGS.LAYER.SOURCE.TYPE,
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
            addLineAndPolygon();

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
                map.fitBounds(bounds, { padding: GIS_SETTINGS.MAP_BOUNDS.PADDING, maxZoom: GIS_SETTINGS.MAP_BOUNDS.MAX_ZOOM });
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

        const lineStringLayerId = GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.LINE_STRING] + "-layer";
        if (map.getLayer(lineStringLayerId)) {
            map.setPaintProperty(lineStringLayerId, "line-color", lineColor);
        }

        const polygonLayerId = GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.POLYGON] + "-layer";
        if (map.getLayer(polygonLayerId)) {
            map.setPaintProperty(polygonLayerId, "fill-color", polygonColor);
        }

        const pointLayerId = GEOMETRY_TYPE_LABELS[GEOMETRY_TYPES.POINT] + "-layer";
        if (map.getLayer(pointLayerId)) {
            map.setPaintProperty(pointLayerId, "circle-color", pointColor);
        }
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
            center: [GIS_SETTINGS.COORDINATES.CENTER.LONG, GIS_SETTINGS.COORDINATES.CENTER.LAT],
            zoom: GIS_SETTINGS.MAP_BOUNDS.MAX_ZOOM,
        });

        const map = mapRef.current;
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.on("load", () => {
            const geojsonData = getGeoJsonData();
            if (geojsonData) {
                setFilteredData(geojsonData);
                const minMaxDate = getMinMaxDate(geojsonData);
                if (minMaxDate && minMaxDate.minDate && minMaxDate.minDate) {
                    setMinDate(minMaxDate.minDate);
                    setMaxDate(minMaxDate.maxDate);
                    setSelectedDate(minMaxDate.minDate);
                }
                addLogs(LOG_TYPES.SYSTEM, SYSTEM_FEEDBACK.DISPLAYED_MAP, setLogs);
            }
        });

        return () => {
            setFilteredData();
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
            map.remove();
        };
    }, [activeTab, fileUploads, fileDetails]);

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

    // Update selected date if the time series animation is enabled
    useEffect(() => {
        if (isTimeBoxVisible && selectedDate && mapRef.current && mapRef.current.isStyleLoaded()) {
            updatedFilteredDataByDate();
            addLogs(LOG_TYPES.SYSTEM, SYSTEM_FEEDBACK.APPLIED_FILTER_BY_DATE, setLogs);
        }
    }, [isTimeBoxVisible, selectedDate]);

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

    // Function to handle time series icon click
    const handleTimeSeriesIconClick = () => {
        // Function to check if a date is valid
        const isValidDate = (date) => {
            return date && !isNaN(new Date(date).getTime());
        };

        // Check if both dates are valid
        if (!isValidDate(minDate) || !isValidDate(maxDate)) {
            setShowErrorMessageDialog(true);
            setErroMessage(GIS_DATA_VIEWER_MESSAGES.TIMESTAMP_FORMAT_REQUIRED);
            return;
        }

        if (isTimeBoxVisible) {
            const geojsonData = getGeoJsonData();
            setFilteredData(geojsonData);
        }

        setIsTimeBoxVisible(!isTimeBoxVisible);
    };

    return (
        <div className="w-full h-full relative">
            <MapSearch
                searchText={searchText} setSearchText={setSearchText}
                filteredGeometryTypes={filteredGeometryTypes} setFilteredGeometryTypes={setFilteredGeometryTypes}
            />

            <div ref={mapContainerRef} className="w-full h-full" />

            {minDate && maxDate && selectedDate && (
                // use Time Series Control here
                <TimeSeriesControl
                    minDate={minDate}
                    maxDate={maxDate}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    isTimeBoxVisible={isTimeBoxVisible}
                    handleIconClick={handleTimeSeriesIconClick}
                    setLogs={setLogs}
                />
            )}

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
