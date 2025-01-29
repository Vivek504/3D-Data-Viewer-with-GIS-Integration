import React from 'react'

export default function FileDetails({ fileDetails }) {
    return (
        <div>
            <h3 className="font-medium text-m mb-4">
                File Details
            </h3>
            {fileDetails && (
                <div className="text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Filename:</span>
                        <span className="font-medium">{fileDetails.filename}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Size:</span>
                        <span className="font-medium">{(fileDetails.fileSize / (1024)).toFixed(2)} KB</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Points:</span>
                        <span className="font-medium">{fileDetails.numPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Dimensions:</span>
                        <span className="font-medium">
                            {fileDetails.boundingBox.width.toFixed(2)} x {fileDetails.boundingBox.height.toFixed(2)} x {fileDetails.boundingBox.depth.toFixed(2)} units
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}