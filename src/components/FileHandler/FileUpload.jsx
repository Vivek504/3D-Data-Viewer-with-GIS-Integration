import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import { FILE_TYPES, FILE_TYPES_BY_TAB } from '../../constants/FileTypes'
import { FILE_DROP_MESSAGES } from '../../constants/FileDropMessages'
import { parseXYZFile, parsePCDFile } from '../../utils/PointCloudParser'
import { parseGeoJSONFile } from '../../utils/GISParser'
import { useAppContext } from '../../contexts/AppContext'
import MessageDialog from './MessageDialog'

export default function FileUpload({ updateFileUploads, updateFileDetails }) {
    const { activeTab } = useAppContext();
    const [showMessageDialog, setShowMessageDialog] = useState(false);

    // Handles file selection and parsing
    const onFileUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                if (file.name.endsWith(FILE_TYPES.XYZ)) {
                    updateFileDetails(await parseXYZFile(file));
                    updateFileUploads(file);
                }
                else if (file.name.endsWith(FILE_TYPES.PCD)) {
                    updateFileDetails(await parsePCDFile(file));
                    updateFileUploads(file);
                }
                else if (file.name.endsWith(FILE_TYPES.GEOJSON) || file.name.endsWith(FILE_TYPES.JSON)) {
                    updateFileDetails(await parseGeoJSONFile(file));
                    updateFileUploads(file);
                }
                else {
                    throw new Error("Invalid file"); // Trigger error for unsupported file
                }
            }
            else {
                throw new Error("Invalid file"); // Handle empty file selection
            }
        }
        catch (error) {
            setShowMessageDialog(true); // Show error dialog
        }
    };

    // Closes error message dialog
    const handleCloseMessageDialog = () => {
        setShowMessageDialog(false);
    };

    return (
        // File upload container with drag-and-drop styling
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full flex flex-col justify-center items-center flex-grow">
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
                {FILE_DROP_MESSAGES[activeTab]}
            </p>

            {/* File input */}
            <input
                type="file"
                accept={FILE_TYPES_BY_TAB[activeTab]}
                className="hidden"
                id="file-upload"
                onChange={onFileUpload}
            />

            {/* Custom styled label acting as a file select button */}
            <label htmlFor="file-upload" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full max-w-xs cursor-pointer">
                Select File
            </label>

            {/* Error message popup if invalid file is uploaded */}
            {showMessageDialog && (
                <MessageDialog
                    message="Please upload a valid file."
                    onClose={handleCloseMessageDialog}
                />
            )}
        </div>
    )
}
