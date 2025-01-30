import { TABS } from "./Tabs";

// Supported file extensions for different file types
export const FILE_TYPES = Object.freeze({
    XYZ: '.xyz',
    PCD: '.pcd',
    GEOJSON: '.geojson',
    JSON: '.json'
})

// Mapping of allowed file types per tab
export const FILE_TYPES_BY_TAB = Object.freeze({
    [TABS.THREED_DATA_VIEWER]: [FILE_TYPES.XYZ, FILE_TYPES.PCD], // 3D Data Viewer supports XYZ & PCD files
    [TABS.GIS_VIEWER]: [FILE_TYPES.GEOJSON, FILE_TYPES.JSON] // GIS Viewer supports GeoJSON files
});