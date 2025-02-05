// Constants for GIS settings
export const GIS_SETTINGS = Object.freeze({
    LAYER: Object.freeze({
        SOURCE: Object.freeze({
            ID: "gis-data",
            TYPE: "geojson"
        })
    }),
    MAP_BOUNDS: Object.freeze({
        PADDING: 50,
        MAX_ZOOM: 7
    }),
    COORDINATES: Object.freeze({
        CENTER: Object.freeze({
            LONG: -80.526,
            LAT: 43.464
        }),
        DECIMAL_POINTS: 3
    }),
    GEOMETRY: Object.freeze({
        POINT: Object.freeze({
            CIRCLE: Object.freeze({
                RADIUS: 6,
                STROKE_WIDTH: 1,
                STROKE_COLOR: "#ffffff"
            })
        }),
        LINE: Object.freeze({
            WIDTH: 3
        }),
        POLYGON: Object.freeze({
            OPACITY: 0.5
        })
    })
});