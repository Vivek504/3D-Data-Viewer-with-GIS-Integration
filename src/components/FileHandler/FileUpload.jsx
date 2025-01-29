import React from 'react'
import { Upload } from 'lucide-react'
import { FILE_TYPES, FILE_TYPES_BY_TAB } from '../../constants/FileTypes'
import { FILE_DROP_MESSAGES } from '../../constants/FileDropMessages'
import { parseXYZFile, parsePCDFile } from '../../utils/PointCloudParser'
import { useAppContext } from '../../contexts/AppContext'

export default function FileUpload({ setFileDetails }) {
    const { activeTab, setFileUploads } = useAppContext();

    const onFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileUploads((prev) => ({
                ...prev,
                [activeTab]: file,
            }));
            
            if(file.name.endsWith(FILE_TYPES.XYZ)){
                setFileDetails(await parseXYZFile(file));
            }
            else if(file.name.endsWith(FILE_TYPES.PCD)){
                setFileDetails(await parsePCDFile(file));
            }
        }
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full flex flex-col justify-center items-center flex-grow">
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
                {FILE_DROP_MESSAGES[activeTab]}
            </p>
            <input
                type="file"
                accept={FILE_TYPES_BY_TAB[activeTab]}
                className="hidden"
                id="file-upload"
                onChange={onFileUpload}
            />
            <label htmlFor="file-upload" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full max-w-xs cursor-pointer">
                Select File
            </label>
        </div>
    )
}
