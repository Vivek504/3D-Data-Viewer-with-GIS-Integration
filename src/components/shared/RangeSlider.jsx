import React from "react";

export default function RangeSlider({ label, min, max, step, value, onChange }) {
    return (
        <div className="w-full max-w-md mx-auto">
            <label className="text-sm text-gray-500">{label}</label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}
