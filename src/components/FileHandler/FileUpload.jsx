import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import { FILE_TYPES, FILE_TYPES_BY_TAB } from '../../constants/FileTypes'
import { FILE_DROP_MESSAGES } from '../../constants/FileDropMessages'
import { parseXYZFile, parsePCDFile } from '../../utils/PointCloudParserUtils'
import { parseGeoJSONFile } from '../../utils/GISParserUtils'
import ErrorMessageDialog from '../shared/ErrorMessageDialog'
import { addLogs } from '../../utils/LogUtils'
import { LOG_TYPES } from '../../constants/LogTypes'
import { USER_ACTIONS } from '../../constants/LogsMessages'

export default function FileUpload({ activeTab, updateFileUploads, updateFileDetails, setLogs }) {
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);

    // Handles file selection and parsing
    const onFileUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                if (file.name.endsWith(FILE_TYPES.XYZ)) {
                    addLogs(LOG_TYPES.USER, USER_ACTIONS.UPLOADED_XYZ_FILE, setLogs);
                    updateFileDetails(await parseXYZFile(file));
                    updateFileUploads(file);
                }
                else if (file.name.endsWith(FILE_TYPES.PCD)) {
                    addLogs(LOG_TYPES.USER, USER_ACTIONS.UPLOADED_PCD_FILE, setLogs);
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
            addLogs(LOG_TYPES.USER, USER_ACTIONS.UPLOADED_INVALID_FILE, setLogs);
            setShowErrorMessageDialog(true); // Show error dialog
        }
    };

    // Closes error message dialog
    const handleCloseMessageDialog = () => {
        setShowErrorMessageDialog(false);
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
            {showErrorMessageDialog && (
                <ErrorMessageDialog
                    message="Please upload a valid file."
                    onClose={handleCloseMessageDialog}
                />
            )}
        </div>
    )
}
