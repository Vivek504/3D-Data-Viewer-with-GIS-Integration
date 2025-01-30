import React, { createContext, useContext, useState } from 'react'
import { TABS } from '../constants/Tabs';

const ThreeDDataViewerContext = createContext();

export const useThreeDDataViewerContext = () => useContext(ThreeDDataViewerContext);

export const ThreeDDataViewerContextProvider = ({ children }) => {
    const [pointSize, setPointSize] = useState();
    
    const [colorRanges, setColorRanges] = useState([]);
    const [appliedColorMapping, setAppliedColorMapping] = useState(false);

    return (
        <ThreeDDataViewerContext.Provider value={{ pointSize, setPointSize, colorRanges, setColorRanges, appliedColorMapping, setAppliedColorMapping }}>
            {children}
        </ThreeDDataViewerContext.Provider>
    )
};