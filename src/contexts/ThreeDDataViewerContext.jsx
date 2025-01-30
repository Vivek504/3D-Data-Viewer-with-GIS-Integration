import React, { createContext, useContext, useState } from 'react'
import { TABS } from '../constants/Tabs';

const ThreeDDataViewerContext = createContext();

export const useThreeDDataViewerContext = () => useContext(ThreeDDataViewerContext);

export const ThreeDDataViewerContextProvider = ({ children }) => {
    const [pointSize, setPointSize] = useState();
    const [fileDetails, setFileDetails] = useState({
        [TABS.THREED_DATA_VIEWER]: null,
        [TABS.GIS_VIEWER]: null,
    });
    const [colorRanges, setColorRanges] = useState([]);
    const [appliedColorMapping, setAppliedColorMapping] = useState(false);

    return (
        <ThreeDDataViewerContext.Provider value={{ pointSize, setPointSize, fileDetails, setFileDetails, colorRanges, setColorRanges, appliedColorMapping, setAppliedColorMapping }}>
            {children}
        </ThreeDDataViewerContext.Provider>
    )
};