import { DATA_TYPES } from '../constants/DataTypes';
import { GEOMETRY_TYPE_LABELS } from '../constants/Geometry';

export function filterGeoJSONDataBySearchText(geojsonData, searchText) {
    if (!searchText || searchText.trim() === "") {
        return geojsonData; // Return original data if searchText is empty
    }

    const lowerSearch = searchText.toLowerCase();

    const searchInObject = (obj) => {
        return Object.entries(obj).some(([key, val]) => {
            if (key.toLowerCase().includes(lowerSearch)) {
                return true; // Match found in key
            }

            if (val && typeof val === DATA_TYPES.OBJECT) {
                return searchInObject(val); // Recursively search in nested objects
            }

            if (typeof val === DATA_TYPES.NUMBER && !isNaN(lowerSearch)) {
                return Number(val) === Number(lowerSearch); // Match found in numeric value
            }

            return val !== null && val.toString().toLowerCase().includes(lowerSearch); // Match found in string value
        });
    };

    const filteredFeatures = geojsonData.features.filter(feature => {
        return searchInObject(feature.properties); // Filter features based on properties
    });

    return { ...geojsonData, features: filteredFeatures }; // Return filtered GeoJSON data
}

export function filterGeoJSONByGeometryType(geojsonData, filteredGeometryTypes) {
    const filteredFeatures = geojsonData.features.filter(feature => {
        const geometryType = feature.geometry.type;
        return Object.entries(GEOMETRY_TYPE_LABELS).some(([key, label]) =>
            filteredGeometryTypes[key] && label === geometryType // Match geometry type with selected filters
        );
    });

    return { ...geojsonData, features: filteredFeatures }; // Return filtered GeoJSON data
}

export function getMinMaxDate(geojsonData) {
    const dates = geojsonData.features.map(feature => new Date(feature.properties.timestamp)); // Extract timestamps and convert to Date objects

    const minDate = new Date(Math.min(...dates)); // Get the earliest date
    const maxDate = new Date(Math.max(...dates)); // Get the latest date

    return { minDate, maxDate };
}

export function filterGeoJSONByDate(geojsonData, selectedDate) {
    const targetTimestamp = new Date(selectedDate).getTime();

    // Filter features based on the timestamp
    const filteredFeatures = geojsonData.features.filter(feature => {
        if(!feature.properties.timestamp){
            return false;
        }
        const featureTimestamp = new Date(feature.properties.timestamp).getTime();
        return featureTimestamp === targetTimestamp;
    });

    // Return a new GeoJSON object with the filtered features
    return {
        ...geojsonData,
        features: filteredFeatures
    };
}