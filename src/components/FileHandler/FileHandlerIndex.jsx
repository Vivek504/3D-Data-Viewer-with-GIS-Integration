import React, { useState } from 'react'
import FileUpload from './FileUpload'
import FileDetails from './FileDetails'
import { useAppContext } from '../../contexts/AppContext';
import { TABS } from '../../constants/Tabs';

export default function FileHandlerIndex() {
    const { activeTab, fileUploads, setFileUploads } = useAppContext();
    const [fileDetails, setFileDetails] = useState({
        [TABS.THREED_DATA_VIEWER]: null,
        [TABS.GIS_VIEWER]: null,
    });

    const updateFileUploads = (file) => {
        setFileUploads((prev) => ({
            ...prev,
            [activeTab]: file
        }));
    }

    const updateFileDetails = (data) => {
        setFileDetails((prev) => ({
            ...prev,
            [activeTab]: data
        }));
    }

    const onRefresh = () => {
        updateFileUploads(null);
        updateFileDetails(null);
    }

    return (
        <div className="w-full">
            {fileUploads[activeTab] && fileDetails[activeTab] ?
                <FileDetails fileDetailsData={fileDetails[activeTab]} onRefresh={onRefresh} />
                :
                <FileUpload updateFileUploads={updateFileUploads} updateFileDetails={updateFileDetails} />
            }
        </div>
    )
}