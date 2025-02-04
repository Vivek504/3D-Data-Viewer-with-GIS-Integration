import React from 'react';
import { X, MapPin } from 'lucide-react';
import RenderPropertyValue from './RenderPropertyValue';
import { DATA_TYPES } from '../../../constants/DataTypes';

export default function FeatureDetailsPopup({ feature, onClose }) {
    if (!feature) return null;

    // Format coordinates to a readable string
    const formatCoordinates = (coordinates) => {
        if (typeof coordinates[0] === DATA_TYPES.NUMBER) {
            return `[${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`;
        }

        if (Array.isArray(coordinates[0])) {
            return coordinates
                .flat(Infinity)
                .reduce((acc, _, i, arr) => {
                    if (i % 2 === 0) {
                        acc.push(`[${arr[i].toFixed(4)}, ${arr[i + 1].toFixed(4)}]`);
                    }
                    return acc;
                }, [])
                .join(', ');
        }
        return '';
    };

    return (
        <div className="absolute bottom-4 right-4 z-50 w-1/2 h-1/2 p-2">
            <div className="h-full shadow-lg bg-white rounded-lg overflow-auto border border-gray-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <MapPin className="text-blue-500" size={24} />
                        <h3 className="font-semibold text-lg">Feature Details</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 space-y-4 overflow-auto h-full">
                    {/* Display coordinates */}
                    <div>
                        <label className="text-sm font-medium text-gray-500">Coordinates</label>
                        <p className="text-gray-900 font-mono text-sm mt-1">
                            {formatCoordinates(feature.geometry.coordinates)}
                        </p>
                    </div>
                    {/* Display properties */}
                    <div>
                        <label className="text-sm font-medium text-gray-500">Properties</label>
                        <div className="bg-gray-50 rounded-md p-3 mt-1">
                            {Object.entries(feature.properties).map(([key, value]) => (
                                <div key={key} className="py-1">
                                    <label className="text-xs font-medium text-gray-500 break-words whitespace-pre-wrap">{key}</label>
                                    <div className="mt-1">
                                        <RenderPropertyValue value={value} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
