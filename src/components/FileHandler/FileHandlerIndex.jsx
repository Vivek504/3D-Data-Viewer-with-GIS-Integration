import React from 'react'
import FileUpload from './FileUpload'

export default function FileHandlerIndex({ activeTab, fileUploads, setFileUploads }) {
    return (
        <div className="w-full">
            {fileUploads[activeTab] ?
                <h3 className="font-medium text-m">
                    File Details
                </h3>
                :
                <FileUpload activeTab={activeTab} setFileUploads={setFileUploads} />
            }
        </div>
    )
}