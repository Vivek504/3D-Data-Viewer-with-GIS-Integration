import React, { createContext, useContext, useState } from 'react';
import { MAP_STYLES } from '../constants/MapStyles';
import { GEOMETRY_TYPE_COLOR } from '../constants/GISViewerColors';

const GISViewerContext = createContext();

export const useGISViewerContext = () => useContext(GISViewerContext);

export const GISViewerContextProvider = ({ children }) => {
    const [mapStyle, setMapStyle] = useState(MAP_STYLES.STREETS);

    const [searchText, setSearchText] = useState();

    const [pointColor, setPointColor] = useState(GEOMETRY_TYPE_COLOR.POINT.DEFAULT);
    const [lineColor, setLineColor] = useState(GEOMETRY_TYPE_COLOR.LINE.DEFAULT);
    const [polygonColor, setPolygonColor] = useState(GEOMETRY_TYPE_COLOR.POLYGON.DEFAULT);

    return (
        <GISViewerContext.Provider value={{
            mapStyle, setMapStyle,
            searchText, setSearchText,
            pointColor, setPointColor,
            lineColor, setLineColor,
            polygonColor, setPolygonColor
        }}>
            {children}
        </GISViewerContext.Provider>
    )
};