// Constant for geometry types
export const GEOMETRY_TYPES = Object.freeze({
    POINT: 0,
    LINE_STRING: 1,
    POLYGON: 2
});

// Labels corresponding to geometry types
export const GEOMETRY_TYPE_LABELS = Object.freeze({
    [GEOMETRY_TYPES.POINT]: "Point",
    [GEOMETRY_TYPES.LINE_STRING]: "LineString",
    [GEOMETRY_TYPES.POLYGON]: "Polygon"
});

// Constant for layer types
export const LAYER_TYPES = Object.freeze({
    LINE: "line",
    FILL: "fill"
});
