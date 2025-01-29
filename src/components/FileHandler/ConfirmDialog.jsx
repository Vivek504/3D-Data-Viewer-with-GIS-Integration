import React from 'react';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white rounded-md p-6 w-96 shadow-md">
                <p className="text-gray-800 mb-4">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}