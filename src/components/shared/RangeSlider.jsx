import React from "react";

export default function RangeSlider({ min, max, step, value, onChange }) {
    return (
        <div className="w-full max-w-md mx-auto">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="w-full block bg-gray-300 rounded-lg"
            />
        </div>
    );
}
