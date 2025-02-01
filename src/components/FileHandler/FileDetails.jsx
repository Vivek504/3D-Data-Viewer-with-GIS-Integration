import React, { useState } from 'react'
import { FileText, RefreshCcw } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog';

export default function FileDetails({ fileDetailsData, onRefresh }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Show confirmation dialog when refresh icon is clicked
    const handleRefreshClick = () => {
        setShowConfirmDialog(true);
    };

    // Confirm refresh: close dialog and trigger onRefresh
    const handleConfirm = () => {
        setShowConfirmDialog(false);
        onRefresh();
    };

    // Cancel refresh action
    const handleCancel = () => {
        setShowConfirmDialog(false);
    };

    return (
        <div>
            {/* Header section with title and refresh button */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <h3 className="font-medium text-m">
                        File Details
                    </h3>
                </div>
                <RefreshCcw className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-700" onClick={handleRefreshClick} />
            </div>

            {/* Display file details if available */}
            {fileDetailsData && (
                <div className="text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Filename:</span>
                        <span className="font-medium">{fileDetailsData.filename}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Size:</span>
                        <span className="font-medium">{(fileDetailsData.fileSize / (1024)).toFixed(2)} KB</span>
                    </div>
                    {fileDetailsData.numPoints &&
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-500">Points:</span>
                            <span className="font-medium">{fileDetailsData.numPoints.toLocaleString()}</span>
                        </div>
                    }
                    {fileDetailsData.boundingBox &&
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-500">Dimensions:</span>
                            <span className="font-medium">
                                {fileDetailsData.boundingBox.width.toFixed(2)} x {fileDetailsData.boundingBox.height.toFixed(2)} x {fileDetailsData.boundingBox.depth.toFixed(2)} units
                            </span>
                        </div>
                    }
                </div>
            )}

            {/* Confirmation dialog for reuploading */}
            {showConfirmDialog && (
                <ConfirmDialog
                    message="Are you sure you want to reupload the file?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    )
}