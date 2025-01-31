import React, { createContext, useContext, useState } from 'react'

const ThreeDDataViewerContext = createContext();

export const useThreeDDataViewerContext = () => useContext(ThreeDDataViewerContext);

export const ThreeDDataViewerContextProvider = ({ children }) => {
    const [pointSize, setPointSize] = useState();

    const [colorRanges, setColorRanges] = useState([]);
    const [applyColorMapping, setApplyColorMapping] = useState(false);
    const [resetColorMapping, setResetColorMapping] = useState(false);

    const [altitudeRanges, setAltitudeRanges] = useState([]);

    return (
        <ThreeDDataViewerContext.Provider value={{
            pointSize, setPointSize,
            colorRanges, setColorRanges,
            applyColorMapping, setApplyColorMapping,
            resetColorMapping, setResetColorMapping,
            altitudeRanges, setAltitudeRanges
        }}>
            {children}
        </ThreeDDataViewerContext.Provider>
    )
};