import React, { createContext, useContext, useState } from 'react'
import { SCENE_BACKGROUND_COLORS } from '../constants/ThreeDViewerColors';

const ThreeDDataViewerContext = createContext();

export const useThreeDDataViewerContext = () => useContext(ThreeDDataViewerContext);

export const ThreeDDataViewerContextProvider = ({ children }) => {
    const [pointSize, setPointSize] = useState();

    const [colorRanges, setColorRanges] = useState([]);
    const [applyColorMapping, setApplyColorMapping] = useState(false);
    const [resetColorMapping, setResetColorMapping] = useState(false);

    const [altitudeRanges, setAltitudeRanges] = useState([]);

    const [backgroundColor, setBackgroundColor] = useState(SCENE_BACKGROUND_COLORS.DEFAULT);

    const resetThreeDContext = () => {
        setPointSize();

        setColorRanges([]);
        setApplyColorMapping(false);
        setResetColorMapping(false);

        setAltitudeRanges([]);

        setBackgroundColor(SCENE_BACKGROUND_COLORS.DEFAULT);
    }

    return (
        <ThreeDDataViewerContext.Provider value={{
            pointSize, setPointSize,
            colorRanges, setColorRanges,
            applyColorMapping, setApplyColorMapping,
            resetColorMapping, setResetColorMapping,
            altitudeRanges, setAltitudeRanges,
            backgroundColor, setBackgroundColor,
            resetThreeDContext
        }}>
            {children}
        </ThreeDDataViewerContext.Provider>
    )
};