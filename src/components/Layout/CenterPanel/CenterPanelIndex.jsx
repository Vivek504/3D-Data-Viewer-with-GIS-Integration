import React from 'react'
import { TABS } from '../../../constants/Tabs'
import { Box, Map, Maximize2 } from 'lucide-react'
import { useAppContext } from '../../../contexts/AppContext';
import ThreeDDataViewerIndex from '../../ThreeDDataViewer/ThreeDDataViewerIndex';
import GISViewerIndex from '../../GISViewer/GISViewerIndex';

export default function CenterPanelIndex() {
    const { activeTab, setActiveTab, fileUploads } = useAppContext();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex-1 flex flex-col h-full w-full">
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

            <div className="flex-1 bg-gray-50 p-4">
                <div className="h-full text-gray-400 bg-white rounded-lg shadow-sm border-gray flex items-center justify-center">
                    {!fileUploads[activeTab] ? (
                        <div className="text-gray-400">
                            <Maximize2 className="h-16 w-16 mx-auto mb-4" />
                            <p>Upload a file to begin visualization</p>
                        </div>
                    ) : (
                        activeTab === TABS.THREED_DATA_VIEWER ? <ThreeDDataViewerIndex /> : <GISViewerIndex />
                    )}
                </div>
            </div>
        </div>
    )
}
