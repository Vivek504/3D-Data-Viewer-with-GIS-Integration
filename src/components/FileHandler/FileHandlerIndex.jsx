import React, { useState } from 'react'
import FileUpload from './FileUpload'
import FileDetails from './FileDetails'

export default function FileHandlerIndex({ activeTab, fileUploads, setFileUploads }) {
    const [fileDetails, setFileDetails] = useState(null);

    return (
        <div className="w-full">
            {fileUploads[activeTab] ?
                <FileDetails fileDetails={fileDetails} />
                :
                <FileUpload activeTab={activeTab} setFileUploads={setFileUploads} setFileDetails={setFileDetails} />
            }
        </div>
    )
}