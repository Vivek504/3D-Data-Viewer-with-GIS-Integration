import React from 'react'
import FileHandlerIndex from '../../FileHandler/FileHandlerIndex'

export default function LeftPanelIndex({ fileUploads, activeTab }) {
    return (
        <div className="bg-gray-50 h-full w-full p-3">
            <div className="flex justify-between items-center">
                <FileHandlerIndex fileUploads={fileUploads} activeTab={activeTab} />                
            </div>
        </div>
    )
}
