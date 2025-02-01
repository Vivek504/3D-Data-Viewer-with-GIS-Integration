import React, { createContext, useContext, useState } from 'react';
import { MAP_STYLES } from '../constants/MapStyles';

const GISViewerContext = createContext();

export const useGISViewerContext = () => useContext(GISViewerContext);

export const GISViewerContextProvider = ({ children }) => {
    const [mapStyle, setMapStyle] = useState(MAP_STYLES.STREETS);

    return (
        <GISViewerContext.Provider value={{
            mapStyle, setMapStyle
        }}>
            {children}
        </GISViewerContext.Provider>
    )
};