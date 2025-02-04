import React, { createContext, useContext, useState } from 'react';
import { MAP_STYLES } from '../constants/MapStyles';
import { GEOMETRY_TYPE_COLOR } from '../constants/GISViewerColors';
import { GEOMETRY_TYPES } from '../constants/Geometry';

const GISViewerContext = createContext();

export const useGISViewerContext = () => useContext(GISViewerContext);

export const GISViewerContextProvider = ({ children }) => {
    const [mapStyle, setMapStyle] = useState(MAP_STYLES.STREETS);

    const [searchText, setSearchText] = useState();
    const [filteredGeometryTypes, setFilteredGeometryTypes] = useState(
        Object.fromEntries(Object.values(GEOMETRY_TYPES).map(type => [type, true]))
    );

    const [pointColor, setPointColor] = useState(GEOMETRY_TYPE_COLOR.POINT.DEFAULT);
    const [lineColor, setLineColor] = useState(GEOMETRY_TYPE_COLOR.LINE.DEFAULT);
    const [polygonColor, setPolygonColor] = useState(GEOMETRY_TYPE_COLOR.POLYGON.DEFAULT);

    const [filteredData, setFilteredData] = useState();

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