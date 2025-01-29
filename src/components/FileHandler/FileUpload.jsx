import React from 'react'
import { Upload } from 'lucide-react'
import { Tabs } from '../../constants/Tabs'
import { FileTypes } from '../../constants/FileTypes'

export default function FileUpload({ activeTab, setFileUploads }) {
    const onFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileUploads((prev) => ({
                ...prev,
                [activeTab]: file,
            }));
        }
    }

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full flex flex-col justify-center items-center flex-grow">
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
                {activeTab === Tabs.THREED_DATA_VIEWER ? 'Drop .xyz or .pcd file here' : 'Drop GeoJSON file here'}
            </p>
            <input
                type="file"
                accept={FileTypes[activeTab]}
                className="hidden"
                id="file-upload"
                onChange={onFileUpload}
            />
            <label htmlFor="file-upload" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full max-w-xs cursor-pointer">
                Select File
            </label>
        </div>
    )
}
