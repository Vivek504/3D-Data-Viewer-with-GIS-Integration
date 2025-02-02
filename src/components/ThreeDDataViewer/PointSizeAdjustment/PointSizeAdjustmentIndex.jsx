import React, { useEffect, useState } from 'react';
import { useThreeDDataViewerContext } from '../../../contexts/ThreeDDataViewerContext';
import { getStepSizeForNum, formatNumber, getMaxValueForDecimalScale, getDecimalPart, getMinValueForDecimalScale, generateMinDecimalScale, generateMaxDecimalScale } from '../../../utils/MathUtils';
import RangeSlider from '../../shared/RangeSlider';

export default function PointSizeAdjustment() {
    const { pointSize, setPointSize } = useThreeDDataViewerContext();
    const [inputValue, setInputValue] = useState(formatNumber(pointSize, getDecimalPart(pointSize).length));

    const handleInputChange = (event) => {
        let inputStr = event.target.value;

        if (!/^\d*\.?\d*$/.test(inputStr)) {
            return;
        }

        inputStr = inputStr.replace(/^0+(\d)/, '$1');

        setInputValue(inputStr);

        const value = parseFloat(inputStr);
        if (!isNaN(value) && value > 0) {
            setPointSize(formatNumber(value, getDecimalPart(value).length));
        }
    };

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

    const handleSliderChange = (event) => {
        const value = parseFloat(event.target.value);
        setPointSize(value);
        setInputValue(value.toString());
    };

    useEffect(() => {
        setInputValue(formatNumber(pointSize, getDecimalPart(pointSize).length).toString());
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
