import React from 'react'
import { Upload } from 'lucide-react'
import { Tabs } from '../../constants/Tabs'

export default function FileHandlerIndex({ fileUploads, activeTab }) {
    return (
        <div className="w-full">
            {fileUploads[activeTab] ?
                <h3 className="font-medium text-m">
                    File Details
                </h3>
                :
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full flex flex-col justify-center items-center flex-grow">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        {activeTab === Tabs.THREED_DATA_VIEWER ? 'Drop .xyz or .pcd file here' : 'Drop GeoJSON file here'}
                    </p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full max-w-xs">
                        Select File
                    </button>
                </div>
            }
        </div>
    )
}