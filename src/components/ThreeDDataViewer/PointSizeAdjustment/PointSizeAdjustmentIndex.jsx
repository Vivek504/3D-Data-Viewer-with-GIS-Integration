import React, { useEffect, useState } from 'react';
import { useThreeDDataViewerContext } from '../../../contexts/ThreeDDataViewerContext';
import { getStepSizeForNum, formatNumber, getMaxValueForDecimalScale, getDecimalPart, getMinValueForDecimalScale, generateMinDecimalScale, generateMaxDecimalScale } from '../../../utils/MathUtils';
import RangeSlider from '../../shared/RangeSlider';

export default function PointSizeAdjustmentIndex() {
    const { pointSize, setPointSize } = useThreeDDataViewerContext();
    const [inputValue, setInputValue] = useState(formatNumber(pointSize, getDecimalPart(pointSize).length));

    // Handles manual input value changes
    const handleInputChange = (event) => {
        let inputStr = event.target.value;

        // Allow only numeric input with optional decimal point
        if (!/^\d*\.?\d*$/.test(inputStr)) {
            return;
        }

        // Remove leading zeros
        inputStr = inputStr.replace(/^0+(\d)/, '$1');

        setInputValue(inputStr);

        const value = parseFloat(inputStr);
        if (!isNaN(value) && value > 0) {
            setPointSize(formatNumber(value, getDecimalPart(value).length));
        }
    };

    // Handles incrementing the point size
    const handleIncrement = () => {
        let newPointSize;
        const decimalPart = getDecimalPart(pointSize);

        if (pointSize === getMaxValueForDecimalScale(pointSize)) {
            newPointSize = generateMinDecimalScale(decimalPart.length - 1);
        }
        else {
            const stepSize = getStepSizeForNum(pointSize);
            newPointSize = formatNumber(pointSize + stepSize, decimalPart.length);
        }

        setPointSize(newPointSize);
        setInputValue(newPointSize.toString());
    };

    // Handles decrementing the point size
    const handleDecrement = () => {
        let newPointSize;
        const decimalPart = getDecimalPart(pointSize);

        if (pointSize === getMinValueForDecimalScale(pointSize)) {
            newPointSize = generateMaxDecimalScale(decimalPart.length + 1);
        }
        else {
            const stepSize = getStepSizeForNum(pointSize);
            newPointSize = formatNumber(pointSize - stepSize, decimalPart.length);
        }

        setPointSize(newPointSize);
        setInputValue(newPointSize.toString());
    };

    // Handles slider value changes
    const handleSliderChange = (event) => {
        const value = parseFloat(event.target.value);
        setPointSize(value);
        setInputValue(value.toString());
    };

    // Syncs input value when point size updates externally
    useEffect(() => {
        setInputValue(formatNumber(pointSize, getDecimalPart(pointSize).length).toString());
    }, [pointSize]);

    return (
        <div className="bg-gray-50 p-2 rounded-lg shadow-sm min-w-0">
            <div className="flex flex-col space-y-2 min-w-0">
                {/* Label for point size adjustment */}
                <label className="text-gray-700 font-medium text-sm">
                    Point Size
                </label>
                <div className="flex items-center min-w-0 space-x-2">
                    {/* Decrement button */}
                    <button
                        onClick={handleDecrement}
                        className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-200">
                        -
                    </button>

                    {/* Numeric input for manual adjustment */}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        inputMode="decimal"
                        pattern="^\d*\.?\d*$"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    />

                    {/* Increment button */}
                    <button
                        onClick={handleIncrement}
                        className="px-2 py-1 border rounded-md text-gray-600 hover:bg-gray-200">
                        +
                    </button>
                </div>

                {/* Range slider for point size adjustment */}
                <RangeSlider
                    min={getMinValueForDecimalScale(pointSize)}
                    max={getMaxValueForDecimalScale(pointSize)}
                    step={getMinValueForDecimalScale(pointSize)}
                    value={pointSize}
                    onChange={handleSliderChange}
                />
            </div>
        </div>
    );
}
