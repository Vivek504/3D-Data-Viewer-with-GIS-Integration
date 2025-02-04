import React, { useState } from 'react'
import FileUpload from './FileUpload'
import FileDetails from './FileDetails'
import { useAppContext } from '../../contexts/AppContext';
import { useThreeDDataViewerContext } from '../../contexts/ThreeDDataViewerContext';
import { TABS } from '../../constants/Tabs';
import { useGISViewerContext } from '../../contexts/GISViewerContext';

export default function FileHandlerIndex() {
    const { activeTab, fileUploads, setFileUploads, fileDetails, setFileDetails, resetAppContext } = useAppContext();

    const { resetThreeDContext } = useThreeDDataViewerContext();

    const { resetGISContext } = useGISViewerContext();

    // Updates the file upload state based on the active tab
    const updateFileUploads = (file) => {
        setFileUploads((prev) => ({
            ...prev,
            [activeTab]: file
        }));
    }

    // Updates the file details state based on the active tab
    const updateFileDetails = (data) => {
        setFileDetails((prev) => ({
            ...prev,
            [activeTab]: data
        }));
    }

    // Reset contexts on refresh
    const onRefresh = () => {
        resetAppContext();
        if (activeTab === TABS.THREED_DATA_VIEWER) {
            resetThreeDContext();
        }
        else {
            resetGISContext();
        }
    }

    return (
        <div className="w-full">
            {/* Show FileDetails if a file is uploaded, otherwise show FileUpload */}
            {fileUploads[activeTab] && fileDetails[activeTab] ?
                <div>
                    <FileDetails fileDetailsData={fileDetails[activeTab]} onRefresh={onRefresh} />
                    <div className="p-3 border-b border-gray-400">
                    </div>
                </div>
                :
                <FileUpload updateFileUploads={updateFileUploads} updateFileDetails={updateFileDetails} />
            }
        </div>
    )
}