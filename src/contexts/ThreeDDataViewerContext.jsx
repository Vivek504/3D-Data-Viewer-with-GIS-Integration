import React, { createContext, useContext, useState } from 'react'

const ThreeDDataViewerContext = createContext();

export const useThreeDDataViewerContext = () => useContext(ThreeDDataViewerContext);

export const ThreeDDataViewerContextProvider = ({ children }) => {
    const [pointSize, setPointSize] = useState();

    return (
        <ThreeDDataViewerContext.Provider value={{ pointSize, setPointSize }}>
            {children}
        </ThreeDDataViewerContext.Provider>
    )
};