import React from "react"
import { Plus, X, Trash2 } from "lucide-react"
import { getStepSize } from "../../../utils/MathUtils"

export default function AltitudeRangeFilterPopup({ min, max, altitudeRanges, setAltitudeRanges, onClose, onResetAltitudeRanges }) {
    const stepSize = getStepSize(min, max);

    const addAltitudeRange = () => {
        const lastRange = altitudeRanges[altitudeRanges.length - 1];
        setAltitudeRanges([
            ...altitudeRanges,
            {
                id: altitudeRanges.length + 1,
                from: lastRange.to + stepSize >= max ? max : lastRange.to + stepSize,
                to: max,
            },
        ]);
    };

    const updateAltitudeRange = (index, key, value) => {
        const updatedRanges = altitudeRanges.map((range, i) => (i === index ? { ...range, [key]: value } : range));
        setAltitudeRanges(updatedRanges);
    };

    const removeAltitudeRange = (index) => {
        if (altitudeRanges.length === 1) return;
        const updatedRanges = altitudeRanges.filter((_, i) => i !== index);
        setAltitudeRanges(updatedRanges);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-lg">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h3 className="font-semibold text-gray-800">Altitude Range Filter</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-3">
                        {altitudeRanges.map((range, index) => (
                            <div key={range.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded">
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">From</label>
                                        <input
                                            type="number"
                                            value={range.from}
                                            step={stepSize}
                                            onChange={(e) => updateAltitudeRange(index, "from", parseFloat(e.target.value))}
                                            className="w-full text-sm p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">To</label>
                                        <input
                                            type="number"
                                            value={range.to}
                                            step={stepSize}
                                            onChange={(e) => updateAltitudeRange(index, "to", parseFloat(e.target.value))}
                                            className="w-full text-sm p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeAltitudeRange(index)}
                                    disabled={altitudeRanges.length === 1}
                                    className={`transition-colors ${altitudeRanges.length === 1 ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:text-red-600"}`}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addAltitudeRange}
                        className="mt-4 w-full flex items-center justify-center space-x-2 rounded-md py-2 px-4 transition bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Range</span>
                    </button>
                </div>

                <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        Close
                    </button>
                    <button onClick={onResetAltitudeRanges} className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                        Reset Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
