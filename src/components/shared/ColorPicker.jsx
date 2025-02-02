import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export default function ColorPicker({ label, color, setColor, defaultColor, handleLog }) {
    const [tempColor] = useState(color);

    const checkChangeInColor = () => {
        if (tempColor != color) {
            handleLog();
        }
    };

    return (
        <div className="relative w-full max-w-xs">
            <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">{label}</label>
                <button
                    onClick={() => {
                        setColor(defaultColor);
                        checkChangeInColor();
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Reset to default color"
                >
                    <RotateCcw className="h-4 w-4 text-gray-700" />
                </button>
            </div>
            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                onBlur={checkChangeInColor}
                className="block w-full h-8 rounded cursor-pointer mt-2 border border-gray-300"
            />
        </div>
    );
}