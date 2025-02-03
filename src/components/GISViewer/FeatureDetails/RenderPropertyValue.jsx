import React from 'react';
import { DATA_TYPES } from '../../../constants/DataTypes';

export default function RenderPropertyValue({ value }) {
    let parsedValue;

    try {
        parsedValue = typeof value === DATA_TYPES.STRING ? JSON.parse(value) : value;
    } catch (error) {
        parsedValue = value;
    }

    if (parsedValue && typeof parsedValue === "object") {
        if (Array.isArray(parsedValue)) {
            return (
                <div className="ml-4 border-l border-gray-200 pl-2">
                    {parsedValue.map((item, index) => (
                        <div key={index} className="mb-1">
                            <RenderPropertyValue value={item} />
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="ml-4 border-l border-gray-200 pl-2">
                {Object.entries(parsedValue).map(([subKey, subValue]) => (
                    <div key={subKey} className="mb-1">
                        <span className="font-medium text-sm text-gray-600">{subKey}: </span>
                        <RenderPropertyValue value={subValue} />
                    </div>
                ))}
            </div>
        );
    }

    return <span className="text-gray-900 text-sm">{parsedValue?.toString()}</span>;
}
