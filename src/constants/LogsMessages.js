// System feedback messages for logging in the application
export const SYSTEM_FEEDBACK = Object.freeze({
    AWAITING_FILE_UPLOAD: 'waiting for user to upload a file',
    DISPLAYED_3D_DATA: '3D data successfully loaded on the screen',
    DISPLAYED_MAP: 'Map successfully loaded on the screen',
    APPLIED_FILTER_BY_DATE: 'applied filter by date',
});

// User actions for logging in the application
export const USER_ACTIONS = Object.freeze({
    UPLOADED_PCD_FILE: 'uploaded a .pcd file',
    UPLOADED_XYZ_FILE: 'uploaded a .xyz file',
    UPLOADED_INVALID_FILE: 'attempted to upload an invalid file',
    SWITCHED_TAB: 'switched tabs',
    ADJUSTED_POINT_SIZE: 'adjusted point size filter',
    CHANGED_BACKGROUND_COLOR: 'changed background color',
    APPLIED_COLOR_FILTER_BY_ALTITUDE: 'applied color filter by altitude',
    APPLIED_ALTITUDE_RANGE_FILTER: 'applied altitude range filter',
    SEARCHED_GIS_DATA: 'searched GIS data',
    APPLIED_GEOMETRY_TYPE_FILTER: 'applied geometry type filter',
    APPLIED_MAP_STYLE_FILTER: 'applied map style filter',
    APPLIED_GEOMETRY_COLOR_FILTER: 'applied geometry color filter',    
    STARTED_TIME_SERIES_ANIMATION: 'started time series animation',
    STOPPED_TIME_SERIES_ANIMATION: 'stopped time series animation'
});