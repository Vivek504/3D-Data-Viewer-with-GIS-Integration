import React, { useEffect, useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { POINT_CLOUD_COLORS } from "../../../constants/ThreeDViewerColors";
import { getStepSizeForRange } from "../../../utils/MathUtils";

export default function AltitudeColorPopup({ min, max, onClose, colorRanges, setColorRanges, onResetColorMapping }) {
    const stepSize = getStepSizeForRange(min, max);
    const [segments, setSegments] = useState([]);

    useEffect(() => {
        if (!colorRanges.length) return;

        // Sort color ranges by altitude and create segments for visualization
        const sortedColorRanges = [...colorRanges].sort((a, b) => a.from - b.from);

        let newSegments = [];
        let currentPos = min;

        for (let i = 0; i < sortedColorRanges.length; i++) {
            const range = sortedColorRanges[i];

            // Add gaps if there are missing ranges
            if (currentPos < range.from) {
                newSegments.push({
                    id: `gap-${currentPos}-${range.from}`,
                    from: currentPos,
                    to: range.from,
                    color: POINT_CLOUD_COLORS.DEFAULT,
                });
            }

            newSegments.push({
                id: range.id,
                from: range.from,
                to: range.to,
                color: range.color,
            });

            currentPos = range.to;
        }

        // Fill remaining range with default color
        if (currentPos < max) {
            newSegments.push({
                id: `gap-${currentPos}-${max}`,
                from: currentPos,
                to: max,
                color: POINT_CLOUD_COLORS.DEFAULT,
            });
        }

        setSegments(newSegments);
    }, [min, max, colorRanges]);

    // Adds a new color range segment
    const addColorRange = () => {
        const lastColorRange = colorRanges[colorRanges.length - 1];
        setColorRanges([
            ...colorRanges,
            {
                id: colorRanges.length + 1,
                from: lastColorRange.to + stepSize >= max ? max : lastColorRange.to + stepSize,
                to: max,
                color: POINT_CLOUD_COLORS.DEFAULT,
            },
        ]);
    };

    // Updates a specific color range
    const updateColorRange = (index, key, value) => {
        const updatedColorRanges = colorRanges.map((colorRange, i) =>
            i === index ? { ...colorRange, [key]: value } : colorRange
        );
        setColorRanges(updatedColorRanges);
    };

    // Removes a color range unless it's the last one
    const removeColorRange = (index) => {
        if (colorRanges.length === 1) {
            return;
        }

        const updatedColorRanges = colorRanges.filter((_, i) => i !== index);
        setColorRanges(updatedColorRanges);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-lg">
                {/* Header section with title and close button */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h3 className="font-semibold text-gray-800">Altitude Color Ranges</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Color range input section */}
                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-3">
                        {colorRanges.map((colorRange, index) => (
                            <div
                                key={colorRange.id}
                                className="flex items-center space-x-3 bg-gray-50 p-3 rounded"
                            >
                                {/* Color picker input */}
                                <input
                                    type="color"
                                    value={colorRange.color}
                                    onChange={(e) =>
                                        updateColorRange(index, "color", e.target.value)
                                    }
                                    className="w-8 h-8 rounded cursor-pointer"
                                />

                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    {/* "From" input */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            From
                                        </label>
                                        <input
                                            type="number"
                                            value={colorRange.from}
                                            step={stepSize}
                                            onChange={(e) =>
                                                updateColorRange(index, "from", parseFloat(e.target.value))
                                            }
                                            className="w-full text-sm p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    {/* "To" input */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            To
                                        </label>
                                        <input
                                            type="number"
                                            value={colorRange.to}
                                            step={stepSize}
                                            onChange={(e) =>
                                                updateColorRange(index, "to", parseFloat(e.target.value))
                                            }
                                            className="w-full text-sm p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                                {/* Remove range button */}
                                <button
                                    onClick={() => removeColorRange(index)}
                                    disabled={colorRanges.length === 1}
                                    className={`transition-colors ${colorRanges.length === 1
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-red-500 hover:text-red-600"}`}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add new color range button */}
                    <button
                        onClick={addColorRange}
                        className="mt-4 w-full flex items-center justify-center space-x-2 rounded-md py-2 px-4 transition bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Range</span>
                    </button>

                    {/* Color range preview section */}
                    <div className="mt-6 space-y-2">
                        <label className="block text-sm font-medium">Color Range Preview</label>
                        <div className="h-6 rounded-md overflow-hidden flex border border-gray-300">
                            {segments.map((segment) => {
                                const width =
                                    ((segment.to - segment.from) / (max - min)) * 100;
                                return (
                                    <div
                                        key={segment.id}
                                        style={{
                                            width: `${width}%`,
                                            backgroundColor: segment.color,
                                            position: "relative",
                                        }}
                                        className={`h-full border ${segment.color === POINT_CLOUD_COLORS.DEFAULT
                                            ? "border-gray-300"
                                            : "border-transparent"
                                            }`}
                                    ></div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-500">{colorRanges[0]?.from}</span>
                            <span className="text-xs text-gray-500">
                                {colorRanges[colorRanges.length - 1]?.to}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={onResetColorMapping}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                        Reset Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
