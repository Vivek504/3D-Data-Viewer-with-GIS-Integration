import React, { createContext, useContext, useState } from 'react';
import { MAP_STYLES } from '../constants/MapStyles';
import { GEOMETRY_TYPE_COLOR } from '../constants/GISViewerColors';
import { GEOMETRY_TYPES } from '../constants/Geometry';

// Create context for GIS Viewer
const GISViewerContext = createContext();

// Custom hook to access GISViewerContext
export const useGISViewerContext = () => useContext(GISViewerContext);

export const GISViewerContextProvider = ({ children }) => {
    // State for managing map style
    const [mapStyle, setMapStyle] = useState(MAP_STYLES.STREETS);

    // State for managing search text
    const [searchText, setSearchText] = useState();

    // State for tracking which geometry types are filtered (initialized to all true)
    const [filteredGeometryTypes, setFilteredGeometryTypes] = useState(
        Object.fromEntries(Object.values(GEOMETRY_TYPES).map(type => [type, true]))
    );

    // State for managing colors of different geometry types
    const [pointColor, setPointColor] = useState(GEOMETRY_TYPE_COLOR.POINT.DEFAULT);
    const [lineColor, setLineColor] = useState(GEOMETRY_TYPE_COLOR.LINE.DEFAULT);
    const [polygonColor, setPolygonColor] = useState(GEOMETRY_TYPE_COLOR.POLYGON.DEFAULT);

    // State for storing filtered data
    const [filteredData, setFilteredData] = useState();

    // Function to reset all GIS context states to their default values
    const resetGISContext = () => {
        setMapStyle(MAP_STYLES.STREETS);
        setSearchText();
        setFilteredGeometryTypes(Object.fromEntries(Object.values(GEOMETRY_TYPES).map(type => [type, true])));
        setPointColor(GEOMETRY_TYPE_COLOR.POINT.DEFAULT);
        setLineColor(GEOMETRY_TYPE_COLOR.LINE.DEFAULT);
        setPolygonColor(GEOMETRY_TYPE_COLOR.POLYGON.DEFAULT);
        setFilteredData();
    }

    return (
        <GISViewerContext.Provider value={{
            mapStyle, setMapStyle,
            searchText, setSearchText,
            filteredGeometryTypes, setFilteredGeometryTypes,
            pointColor, setPointColor,
            lineColor, setLineColor,
            polygonColor, setPolygonColor,
            filteredData, setFilteredData,
            resetGISContext
        }}>
            {children}
        </GISViewerContext.Provider>
    )
};
