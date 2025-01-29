import React from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { Maximize2 } from 'lucide-react';

export default function ThreeDDataViewerIndex() {
    const { activeTab, fileUploads } = useAppContext();

    return (
        <div className="bg-gray-50 h-full w-full flex items-center justify-center">
            {!fileUploads[activeTab] ? (
                <div className="text-gray-400">
                    <Maximize2 className="h-16 w-16 mx-auto mb-4" />
                    <p>Upload a file to begin visualization</p>
                </div>
            ) : (
                <div className="text-gray-600">
                    [3D Point Cloud Viewer]
                </div>
            )}
        </div>
    )
}
