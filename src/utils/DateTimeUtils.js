// Returns the current local time in HH:MM:SS format (12-hour format)
export const getLocalTimestamp = () => {
    return new Date().toLocaleTimeString('en-US', { hour12: true });
};