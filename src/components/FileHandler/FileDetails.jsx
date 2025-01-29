import React, { useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog';

export default function FileDetails({ fileDetailsData, onRefresh }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleRefreshClick = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirm = () => {
        setShowConfirmDialog(false);
        onRefresh();
    };

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-m">
                    File Details
                </h3>
                <RefreshCcw className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-700" onClick={handleRefreshClick} />
            </div>
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
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Points:</span>
                        <span className="font-medium">{fileDetailsData.numPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Dimensions:</span>
                        <span className="font-medium">
                            {fileDetailsData.boundingBox.width.toFixed(2)} x {fileDetailsData.boundingBox.height.toFixed(2)} x {fileDetailsData.boundingBox.depth.toFixed(2)} units
                        </span>
                    </div>
                </div>
            )}
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