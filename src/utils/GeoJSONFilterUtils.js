import { DATA_TYPES } from '../constants/DataTypes';
import { GEOMETRY_TYPE_LABELS } from '../constants/Geometry';

export function filterGeoJSONDataBySearchText(geojsonData, searchText) {
    if (!searchText || searchText.trim() === "") {
        return geojsonData;
    }

    const lowerSearch = searchText.toLowerCase();

    const searchInObject = (obj) => {
        return Object.entries(obj).some(([key, val]) => {
            if (key.toLowerCase().includes(lowerSearch)) {
                return true;
            }

            if (val && typeof val === DATA_TYPES.OBJECT) {
                return searchInObject(val);
            }
            
            if (typeof val === DATA_TYPES.NUMBER && !isNaN(lowerSearch)) {
                return Number(val) === Number(lowerSearch);
            }

            return val !== null && val.toString().toLowerCase().includes(lowerSearch);
        });
    };

    const filteredFeatures = geojsonData.features.filter(feature => {
        return searchInObject(feature.properties);
    });

    return { ...geojsonData, features: filteredFeatures };
}

export function filterGeoJSONByGeometryType(geojsonData, filteredGeometryTypes) {
    const filteredFeatures = geojsonData.features.filter(feature => {
        const geometryType = feature.geometry.type;
        return Object.entries(GEOMETRY_TYPE_LABELS).some(([key, label]) =>
            filteredGeometryTypes[key] && label === geometryType
        );
    });

    return { ...geojsonData, features: filteredFeatures };
}