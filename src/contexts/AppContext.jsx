import React, { createContext, useContext, useState } from 'react';
import { TABS } from '../constants/Tabs';

// Creating a context to manage global application state
const AppContext = createContext();

// Custom hook to access the AppContext
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    // State to manage the currently active tab
    const [activeTab, setActiveTab] = useState(TABS.THREED_DATA_VIEWER);

    // State to manage uploaded files for different tabs
    const [fileUploads, setFileUploads] = useState({
        [TABS.THREED_DATA_VIEWER]: null, // Stores uploaded file for 3D Viewer tab
        [TABS.GIS_VIEWER]: null // Stores uploaded file for GIS Viewer tab
    });

    return (
        // Providing state and state-modifying functions to child components
        <AppContext.Provider value={{ activeTab, setActiveTab, fileUploads, setFileUploads }}>
            {children}
        </AppContext.Provider>
    );
};