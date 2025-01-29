import React, { useState } from 'react'
import FileUpload from './FileUpload'
import FileDetails from './FileDetails'
import { useAppContext } from '../../contexts/AppContext';
import { TABS } from '../../constants/Tabs';

export default function FileHandlerIndex() {
    // Access global state for active tab and uploaded files
    const { activeTab, fileUploads, setFileUploads } = useAppContext();

    // Local state to store file details per tab
    const [fileDetails, setFileDetails] = useState({
        [TABS.THREED_DATA_VIEWER]: null,
        [TABS.GIS_VIEWER]: null,
    });

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

    // Resets file uploads and file details on refresh
    const onRefresh = () => {
        updateFileUploads(null);
        updateFileDetails(null);
    }

    return (
        <div className="w-full">
            {/* Show FileDetails if a file is uploaded, otherwise show FileUpload */}
            {fileUploads[activeTab] && fileDetails[activeTab] ?
                <FileDetails fileDetailsData={fileDetails[activeTab]} onRefresh={onRefresh} />
                :
                <FileUpload updateFileUploads={updateFileUploads} updateFileDetails={updateFileDetails} />
            }
        </div>
    )
}