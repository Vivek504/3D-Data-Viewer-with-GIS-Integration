import React, { useEffect, useState } from 'react';
import { useThreeDDataViewerContext } from '../../contexts/ThreeDDataViewerContext';

export default function PointSizeAdjustment() {
    const { pointSize, setPointSize } = useThreeDDataViewerContext();
    const [inputValue, setInputValue] = useState(formatNumber(pointSize));

    const calculateStepSize = (value) => {
        const magnitude = Math.floor(Math.log10(value));
        return parseFloat((Math.pow(10, magnitude - 1)).toFixed(10));
    };

    function formatNumber(value) {
        return parseFloat(value.toFixed(10));
    }

    const handleInputChange = (event) => {
        let inputStr = event.target.value;

        if (!/^\d*\.?\d*$/.test(inputStr)) {
            return;
        }

        inputStr = inputStr.replace(/^0+(\d)/, '$1');

        setInputValue(inputStr);

        const value = parseFloat(inputStr);
        if (!isNaN(value) && value > 0) {
            setPointSize(formatNumber(value));
        }
    };

    const handleIncrement = () => {
        const newPointSize = formatNumber(pointSize + calculateStepSize(pointSize));
        setPointSize(newPointSize);
        setInputValue(newPointSize.toString());
    };

    const handleDecrement = () => {
        const newPointSize = formatNumber(Math.max(0.0000001, pointSize - calculateStepSize(pointSize)));
        setPointSize(newPointSize);
        setInputValue(newPointSize.toString());
    };

    useEffect(() => {
        setInputValue(formatNumber(pointSize).toString());
    }, [pointSize]);

    return (
        <div className="bg-gray-50 p-2 rounded-lg shadow-sm min-w-0">
            <div className="flex flex-col space-y-2 min-w-0">
                <label className="text-gray-700 font-medium text-sm">
                    Point Size
                </label>
                <div className="flex items-center min-w-0 space-x-2">
                    <button 
                        onClick={handleDecrement} 
                        className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-200">
                        -
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        inputMode="decimal"
                        pattern="^\d*\.?\d*$"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    />
                    <button 
                        onClick={handleIncrement} 
                        className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-200">
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}
