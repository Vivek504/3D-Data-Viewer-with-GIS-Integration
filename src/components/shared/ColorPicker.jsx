import React from 'react';

export default function ColorPicker({ label, color, setColor }) {
    return (
        <div className="relative w-full max-w-xs">
            <label className="text-xs text-gray-500">{label}</label>
            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="block w-full h-8 rounded cursor-pointer mt-2 border border-gray-300"
            />
        </div>
    );
}
