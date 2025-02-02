import { TABS } from "./Tabs";

// Messages displayed in the file drop area based on the active tab
export const FILE_DROP_MESSAGES = Object.freeze({
    [TABS.THREED_DATA_VIEWER]: 'Drop .xyz or .pcd file here',
    [TABS.GIS_VIEWER]: 'Drop .geojson or .json file here',
});