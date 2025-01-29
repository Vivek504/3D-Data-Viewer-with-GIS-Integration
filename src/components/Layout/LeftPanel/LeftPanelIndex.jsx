import React from 'react'
import FileHandlerIndex from '../../FileHandler/FileHandlerIndex'

export default function LeftPanelIndex() {    
    return (
        <div className="bg-gray-50 h-full w-full p-3">
            <div className="flex justify-between items-center">
                <FileHandlerIndex />
            </div>
        </div>
    )
}
