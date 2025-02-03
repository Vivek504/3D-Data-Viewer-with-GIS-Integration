import { DATA_TYPES } from '../constants/DataTypes';

export function filterGeoJSONData(geojsonData, searchText) {
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

            if (val && typeof val === DATA_TYPES.NUMBER && typeof val === DATA_TYPES.NUMBER) {
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
