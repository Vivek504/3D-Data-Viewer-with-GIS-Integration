import React from 'react';
import { TABS } from '../../../constants/Tabs';
import { Box, Map, Maximize2 } from 'lucide-react';
import { useAppContext } from '../../../contexts/AppContext';
import ThreeDDataViewerIndex from '../../ThreeDDataViewer/ThreeDDataViewerIndex';
import GISViewerIndex from '../../GISViewer/GISViewerIndex';
import { addLogs } from '../../../utils/LogUtils';
import { LOG_TYPES } from '../../../constants/LogTypes';
import { USER_ACTIONS } from '../../../constants/LogsMessages';

export default function CenterPanelIndex() {
    const { activeTab, setActiveTab, fileUploads, setLogs } = useAppContext();

    // Handles tab switching and logs the action
    const handleTabClick = (tab) => {
        addLogs(LOG_TYPES.USER, USER_ACTIONS.SWITCHED_TAB, setLogs);
        setActiveTab(tab);
    };

    return (
        <div className="flex-1 flex flex-col h-full w-full">
            {/* Tabs for switching between 3D Data Viewer and GIS Viewer */}
            <div className="border-b-white bg-white px-4">
                <div className="flex space-x-4">
                    <button
                        className={`py-3 px-4 text-sm flex items-center gap-2
                            ${activeTab === TABS.THREED_DATA_VIEWER
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleTabClick(TABS.THREED_DATA_VIEWER)}
                    >
                        <Box className="w-4 h-4" />
                        <span>3D Data Viewer</span>
                    </button>
                    <button
                        className={`py-3 px-4 text-sm flex items-center gap-2
                            ${activeTab === TABS.GIS_VIEWER
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleTabClick(TABS.GIS_VIEWER)}
                    >
                        <Map className="w-4 h-4" />
                        GIS Viewer
                    </button>
                </div>
            </div>

            {/* Content area where the appropriate viewer is displayed */}
            <div className="flex-1 bg-gray-50">
                <div className="h-full text-gray-400 bg-white shadow-sm border-gray flex items-center justify-center">
                    {!fileUploads[activeTab] ? (
                        // Display message when no file is uploaded
                        <div className="text-gray-400">
                            <Maximize2 className="h-16 w-16 mx-auto mb-4" />
                            <p>Upload a file to begin visualization</p>
                        </div>
                    ) : (
                        // Render the appropriate viewer based on the active tab
                        activeTab === TABS.THREED_DATA_VIEWER ? <ThreeDDataViewerIndex /> : <GISViewerIndex />
                    )}
                </div>
            </div>
        </div>
    );
}
