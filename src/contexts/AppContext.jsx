import React, { createContext, useContext, useState } from 'react';
import { TABS } from '../constants/Tabs';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState(TABS.THREED_DATA_VIEWER);
    const [fileUploads, setFileUploads] = useState({
        [TABS.THREED_DATA_VIEWER]: null,
        [TABS.GIS_VIEWER]: null
    });

    return (
        <AppContext.Provider value={{ activeTab, setActiveTab, fileUploads, setFileUploads }}>
            {children}
        </AppContext.Provider>
    );
};