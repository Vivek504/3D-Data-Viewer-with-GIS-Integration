import React, { useState } from 'react'
import FileUpload from './FileUpload'
import FileDetails from './FileDetails'
import { useAppContext } from '../../contexts/AppContext';

export default function FileHandlerIndex() {
    const { activeTab, fileUploads, setFileUploads } = useAppContext();
    const [fileDetails, setFileDetails] = useState(null);

    const onRefresh = () => {
        setFileUploads((prev) => ({
            ...prev,
            [activeTab]: null,
        }));
    }

    return (
        <div className="w-full">
            {fileUploads[activeTab] ?
                <FileDetails fileDetails={fileDetails} onRefresh={onRefresh} />
                :
                <FileUpload setFileDetails={setFileDetails} />
            }
        </div>
    )
}