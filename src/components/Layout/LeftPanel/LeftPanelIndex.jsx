import React from 'react';
import FileHandlerIndex from '../../FileHandler/FileHandlerIndex';
import { useAppContext } from '../../../contexts/AppContext';
import { TABS } from '../../../constants/Tabs';
import { useThreeDDataViewerContext } from '../../../contexts/ThreeDDataViewerContext';
import ThreeDFilters from './ThreeDFilters';
import GISFilters from './GISFilters';

export default function LeftPanelIndex() {
    const { activeTab, fileUploads } = useAppContext();
    const { pointSize } = useThreeDDataViewerContext();

    return (
        <div className="bg-gray-50 h-full w-full p-3 flex flex-col space-y-4 overflow-auto">
            {/* File handler section */}
            <FileHandlerIndex />

            {/* Display 3D filters only when a file is uploaded and point size is available */}
            {activeTab === TABS.THREED_DATA_VIEWER && fileUploads[activeTab] && pointSize && <ThreeDFilters />}

            {/* Display GIS filters only when a file is uploaded */}
            {activeTab === TABS.GIS_VIEWER && fileUploads[activeTab] && <GISFilters />}
        </div>
    );
}
