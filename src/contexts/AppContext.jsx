import React, { createContext, useContext, useState } from 'react';
import { TABS } from '../constants/Tabs';
import { LOG_TYPES } from '../constants/LogTypes';
import { SYSTEM_FEEDBACK } from '../constants/LogsMessages';
import { getLocalTimestamp } from '../utils/DateTimeUtils';

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

    // State to manage the file details for different tabs
    const [fileDetails, setFileDetails] = useState({
        [TABS.THREED_DATA_VIEWER]: null,
        [TABS.GIS_VIEWER]: null,
    });

    // State to manage the logs of user actions and system feedback
    const [logs, setLogs] = useState([{
        time: getLocalTimestamp(),
        type: LOG_TYPES.SYSTEM,
        message: SYSTEM_FEEDBACK.WAITING_FOR_FILE_UPLOAD
    }]);

    return (
        // Providing state and state-modifying functions to child components
        <AppContext.Provider value={{
            activeTab, setActiveTab,
            fileUploads, setFileUploads,
            fileDetails, setFileDetails,
            logs, setLogs
        }}>
            {children}
        </AppContext.Provider>
    );
};