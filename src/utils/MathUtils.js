export const getDecimalScale = (num) => {
    const decimalPart = num.toString().split(".")[1];
    return decimalPart ? Math.pow(10, -decimalPart.length) : 1;
};

export const getStepSize = (min, max) => {
    return Math.min(getDecimalScale(min), getDecimalScale(max));
};