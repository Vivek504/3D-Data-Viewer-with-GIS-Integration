// Extracts the decimal part of a number as a string
export const getDecimalPart = (num) => {
    const decimalPartStr = num.toString().split(".")[1];
    return decimalPartStr ? decimalPartStr : "0";
};

// Returns the smallest step size based on the number's decimal precision
export const getMinValueForDecimalScale = (num) => {
    const decimalPart = getDecimalPart(num);
    return decimalPart ? formatNumber(Math.pow(10, -decimalPart.length), decimalPart.length) : 1;
};

// Returns the maximum step value for a given decimal scale
export const getMaxValueForDecimalScale = (num) => {
    const scale = getMinValueForDecimalScale(num);
    return formatNumber(scale * 9, getDecimalPart(scale).length);
};

// Generates the minimum value for a given decimal scale
export const generateMinDecimalScale = (scale) => {
    return formatNumber(Math.pow(10, -scale), scale);
};

// Generates the maximum value for a given decimal scale
export const generateMaxDecimalScale = (scale) => {
    return formatNumber(Math.pow(10, -scale) * 9, scale);
};

// Returns the step size for a given number based on its decimal precision
export const getStepSizeForNum = (num) => {
    return getMinValueForDecimalScale(num);
};

// Determines the smallest step size for a range
export const getStepSizeForRange = (min, max) => {
    return Math.min(getMinValueForDecimalScale(min), getMinValueForDecimalScale(max));
};

// Formats a number with a specified decimal precision
export const formatNumber = (num, decimalPartLength) => {
    return parseFloat(num.toFixed(decimalPartLength));
};

// Determines the decimal precision length, including leading zeros in the decimal part
export const getDecimalPrecisionLength = (num) => {
    const numStr = num.toString();
    const decimalPart = numStr.split(".")[1] || "";

    let leadingZeros = 0;
    for (const char of decimalPart) {
        if (char === "0") {
            leadingZeros++;
        }
        else {
            break;
        }
    }

    // Ensure precision length accounts for leading zeros and at least three significant figures
    const totalLength = leadingZeros + 3;
    return totalLength;
};