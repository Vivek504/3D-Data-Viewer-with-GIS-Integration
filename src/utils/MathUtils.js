export const getDecimalScale = (num) => {
    const decimalPart = num.toString().split(".")[1];
    return decimalPart ? Math.pow(10, -decimalPart.length) : 1;
};

export const getStepSizeForNum = (num) => {
    return getDecimalScale(num);
};

export const getStepSizeForRange = (min, max) => {
    return Math.min(getDecimalScale(min), getDecimalScale(max));
};

export const formatNumber = (value) => {
    return parseFloat(value.toFixed(10));
};