import { getLocalTimestamp } from '../utils/DateTimeUtils';

export const addLogs = (type, message, setLogs) => {
    setLogs(prevLogs => [
        ...prevLogs,
        {
            time: getLocalTimestamp(),
            type,
            message
        }
    ]);
};