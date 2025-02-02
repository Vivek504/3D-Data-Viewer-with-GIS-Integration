export const getDecimalPart = (num) => {
    const decimalPartStr = num.toString().split(".")[1];
    return decimalPartStr ? decimalPartStr : "0";
};

export const getMinValueForDecimalScale = (num) => {
    const decimalPart = getDecimalPart(num);
    return decimalPart ? formatNumber(Math.pow(10, -decimalPart.length), decimalPart.length) : 1;
};

export const getMaxValueForDecimalScale = (num) => {
    const scale = getMinValueForDecimalScale(num);
    return formatNumber(scale * 9, getDecimalPart(scale).length);
};

export const generateMinDecimalScale = (scale) => {
    return formatNumber(Math.pow(10, -scale), scale);
};

export const generateMaxDecimalScale = (scale) => {
    return formatNumber(Math.pow(10, -scale) * 9, scale);
};

export const getStepSizeForNum = (num) => {
    return getMinValueForDecimalScale(num);
};

export const getStepSizeForRange = (min, max) => {
    return Math.min(getMinValueForDecimalScale(min), getMinValueForDecimalScale(max));
};

export const formatNumber = (num, decimalPartLength) => {
    return parseFloat(num.toFixed(decimalPartLength));
};