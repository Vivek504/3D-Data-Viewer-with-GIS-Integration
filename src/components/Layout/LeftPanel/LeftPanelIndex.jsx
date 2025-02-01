import React from 'react';
import FileHandlerIndex from '../../FileHandler/FileHandlerIndex';
import { useAppContext } from '../../../contexts/AppContext';
import { TABS } from '../../../constants/Tabs';
import { useThreeDDataViewerContext } from '../../../contexts/ThreeDDataViewerContext';
import ThreeDFilters from './ThreeDFilters';

export default function LeftPanelIndex() {
    const { activeTab, fileUploads } = useAppContext();
    const { pointSize } = useThreeDDataViewerContext();

    return (
        <div className="bg-gray-50 h-full w-full p-3 flex flex-col space-y-4 overflow-auto">
            {/* File handler section */}
            <FileHandlerIndex />

            {activeTab === TABS.THREED_DATA_VIEWER && fileUploads[activeTab] && pointSize && <ThreeDFilters />}
        </div>
    )
}
