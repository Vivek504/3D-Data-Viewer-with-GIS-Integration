import { X } from 'lucide-react';
import React from 'react';

export default function ErrorMessageDialog({ message, onClose }) {
    return (
        // Overlay background with blur effect
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-md p-6 w-full max-w-sm shadow-md text-center relative">
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    aria-label="Close dialog"
                >
                    <X size={20} className="text-gray-500" />
                </button>
                <p className="text-red-500 mt-2">{message}</p>
            </div>
        </div>
    );
}
