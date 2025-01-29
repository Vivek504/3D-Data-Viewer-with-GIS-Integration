import React, { useState } from 'react'
import FileUpload from './FileUpload'
import FileDetails from './FileDetails'
import { useAppContext } from '../../contexts/AppContext';

export default function FileHandlerIndex() {
    const { activeTab, fileUploads } = useAppContext();
    const [fileDetails, setFileDetails] = useState(null);

    return (
        <div className="w-full">
            {fileUploads[activeTab] ?
                <FileDetails fileDetails={fileDetails} />
                :
                <FileUpload setFileDetails={setFileDetails} />
            }
        </div>
    )
}