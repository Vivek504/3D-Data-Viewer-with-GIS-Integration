import { TABS } from "./Tabs";

export const FILE_TYPES = Object.freeze({
    XYZ: '.xyz',
    PCD: '.pcd',
    GEOJSON: '.geojson'
})

export const FILE_TYPES_BY_TAB = Object.freeze({
    [TABS.THREED_DATA_VIEWER]: [FILE_TYPES.XYZ, FILE_TYPES.PCD],
    [TABS.GIS_VIEWER]: [FILE_TYPES.GEOJSON]
});