import React, { useState } from 'react'
import FileUpload from './FileUpload'
import FileDetails from './FileDetails'
import { useAppContext } from '../../contexts/AppContext';

export default function FileHandlerIndex() {
    const { activeTab, fileUploads, setFileUploads, fileDetails, setFileDetails } = useAppContext();

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