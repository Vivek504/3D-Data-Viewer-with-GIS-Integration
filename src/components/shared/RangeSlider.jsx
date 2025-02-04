import React from "react";

export default function RangeSlider({ min, max, step, value, onChange }) {
    return (
        <div className="w-full max-w-md mx-auto">
            {/* Range input slider */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="w-full block bg-blue-200 rounded-lg appearance-none cursor-pointer h-1.5"
            />
        </div>
    );
}
