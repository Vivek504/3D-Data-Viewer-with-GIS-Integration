export function filterGeoJSONData(geojsonData, searchText) {
    if (!searchText || searchText.trim() === "") {
        return geojsonData;
    }
    const lowerSearch = searchText.toLowerCase();
    const filteredFeatures = geojsonData.features.filter(feature => {

        return Object.values(feature.properties).some(val => {
            return val !== null && val.toString().toLowerCase().includes(lowerSearch);
        });
    });
    return { ...geojsonData, features: filteredFeatures };
}