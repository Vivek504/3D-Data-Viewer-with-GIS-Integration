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

            if (val && val instanceof Object) {
                return searchInObject(val);
            }

            if (val && !isNaN(val) && !isNaN(lowerSearch)) {
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
