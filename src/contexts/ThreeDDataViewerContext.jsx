import React, { createContext, useContext, useState } from 'react';
import { SCENE_BACKGROUND_COLORS } from '../constants/ThreeDViewerColors';

// Create a context for managing 3D Data Viewer state
const ThreeDDataViewerContext = createContext();

// Custom hook for consuming the ThreeDDataViewerContext
export const useThreeDDataViewerContext = () => useContext(ThreeDDataViewerContext);

export const ThreeDDataViewerContextProvider = ({ children }) => {
    // State for managing the size of 3D points in the viewer
    const [pointSize, setPointSize] = useState();

    // States for handling color mapping in the 3D viewer
    const [colorRanges, setColorRanges] = useState([]);
    const [applyColorMapping, setApplyColorMapping] = useState(false);
    const [resetColorMapping, setResetColorMapping] = useState(false);

    // State for managing altitude-based ranges
    const [altitudeRanges, setAltitudeRanges] = useState([]);

    // State for handling the 3D scene background color
    const [backgroundColor, setBackgroundColor] = useState(SCENE_BACKGROUND_COLORS.DEFAULT);

    // Function to reset all context states to default values
    const resetThreeDContext = () => {
        setPointSize();

        setColorRanges([]);
        setApplyColorMapping(false);
        setResetColorMapping(false);

        setAltitudeRanges([]);

        setBackgroundColor(SCENE_BACKGROUND_COLORS.DEFAULT);
    };

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
    );
};