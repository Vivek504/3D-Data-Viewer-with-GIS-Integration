import { getLocalTimestamp } from '../utils/DateTimeUtils';

// Function to add a new log entry with a timestamp
export const addLogs = (type, message, setLogs) => {
    setLogs(prevLogs => [
        ...prevLogs,
        {
            time: getLocalTimestamp(), // Capture current local time in 24-hour format
            type, // Log type
            message // Log message content
        }
    ]);
};