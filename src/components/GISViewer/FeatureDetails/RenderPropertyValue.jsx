import React from 'react';
import { DATA_TYPES } from '../../../constants/DataTypes';

export default function RenderPropertyValue({ value }) {
    let parsedValue;

    // Attempt to parse the value if it's a string
    try {
        parsedValue = typeof value === DATA_TYPES.STRING ? JSON.parse(value) : value;
    } catch (error) {
        parsedValue = value;
    }

    // If the value is an object, handle different structures
    if (parsedValue && typeof parsedValue === DATA_TYPES.OBJECT) {
        if (Array.isArray(parsedValue)) {
            // If the value is an array, render each item
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

        // If the value is an object, render each key-value pair
        return (
            <div className="ml-4 border-l border-gray-200 pl-2">
                {Object.entries(parsedValue).map(([subKey, subValue]) => (
                    <div key={subKey} className="mb-1">
                        <span className="font-medium text-sm text-gray-600 break-words whitespace-pre-wrap">{subKey}: </span>
                        <RenderPropertyValue value={subValue} />
                    </div>
                ))}
            </div>
        );
    }

    // Function to check if a string is a valid URL
    const isURL = (str) => {
        return typeof str === "string" && /^(https?:\/\/[^\s]+)$/.test(str);
    };

    // If the value is a URL, render it as a clickable link
    if (isURL(parsedValue)) {
        return (
            <a
                href={parsedValue}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-words"
            >
                {parsedValue}
            </a>
        );
    }

    // If the value is a primitive, render it as a string
    return (
        <span className="text-gray-900 text-sm break-words whitespace-pre-wrap">
            {parsedValue?.toString()}
        </span>
    );
}
