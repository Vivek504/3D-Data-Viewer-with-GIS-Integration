import React, { useEffect, useState } from 'react';
import { Clock, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { addLogs } from '../../../utils/LogUtils';
import { LOG_TYPES } from '../../../constants/LogTypes';
import { USER_ACTIONS } from '../../../constants/LogsMessages';

export default function TimeSeriesControl({ minDate, maxDate, selectedDate, setSelectedDate, isTimeBoxVisible, handleIconClick, setLogs }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);

    // Effect to handle automatic date increment when animation is playing
    useEffect(() => {
        let intervalId;

        if (isPlaying) {
            intervalId = setInterval(() => {
                setSelectedDate(prevDate => {
                    const newDate = new Date(prevDate);
                    newDate.setDate(newDate.getDate() + 1);
                    // Loop back to minDate if newDate exceeds maxDate
                    return newDate > maxDate ? minDate : newDate;
                });
            }, 1000 / speed); // Adjust interval based on speed
        }

        // Clear the interval when animation stops or dependencies change
        return () => clearInterval(intervalId);
    }, [isPlaying, speed, minDate, maxDate, setSelectedDate]);

    // Handle play state and speed updates
    const onPlayStateChange = (isPlaying, speed) => {
        setIsPlaying(isPlaying);
        setSpeed(speed);
    };

    // Handle timeline range slider changes
    const handleRangeChange = (e) => {
        const days = Number(e.target.value);
        const newDate = new Date(minDate);
        newDate.setDate(minDate.getDate() + days);
        setSelectedDate(newDate);
    };

    // Toggle play/pause state and log the action
    const togglePlay = () => {
        const newPlayState = !isPlaying;
        if (newPlayState) {
            addLogs(LOG_TYPES.USER, USER_ACTIONS.STARTED_TIME_SERIES_ANIMATION, setLogs);
        } else {
            addLogs(LOG_TYPES.USER, USER_ACTIONS.STOPPED_TIME_SERIES_ANIMATION, setLogs);
        }
        setIsPlaying(newPlayState);
        onPlayStateChange(newPlayState, speed);
    };

    // Handle speed selection changes
    const handleSpeedChange = (e) => {
        const newSpeed = Number(e.target.value);
        setSpeed(newSpeed);
        if (isPlaying) {
            onPlayStateChange(true, newSpeed); // Restart interval with new speed if currently playing
        }
    };

    // Calculate total number of days between minDate and maxDate
    const totalDays = Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24));

    // Calculate the current day position on the timeline
    const currentDay = Math.floor((selectedDate - minDate) / (1000 * 60 * 60 * 24));

    return (
        <div className="absolute bottom-8 left-4 z-10">
            {/* Button to toggle the visibility of the time animation controls */}
            <button
                onClick={handleIconClick}
                className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Time animation controls"
            >
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Time Animation</span>
                {isTimeBoxVisible ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                )}
            </button>

            {/* Time animation control panel */}
            {isTimeBoxVisible && (
                <div className="absolute bottom-14 left-0 bg-white rounded-lg shadow-xl p-4 w-80 space-y-4">
                    <div className="flex items-center justify-between">
                        {/* Play/Pause button */}
                        <button
                            onClick={togglePlay}
                            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            {isPlaying ? (
                                <>
                                    <Pause className="w-4 h-4" />
                                    <span>Pause</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    <span>Play</span>
                                </>
                            )}
                        </button>

                        {/* Speed control dropdown */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Speed:</span>
                            <select
                                value={speed}
                                onChange={handleSpeedChange}
                                className="bg-gray-100 rounded-md px-2 py-1 text-sm"
                            >
                                <option value={0.5}>0.5x</option>
                                <option value={1}>1x</option>
                                <option value={2}>2x</option>
                                <option value={4}>4x</option>
                            </select>
                        </div>
                    </div>

                    {/* Timeline range slider */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            Timeline
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={totalDays}
                            value={currentDay}
                            onChange={handleRangeChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{minDate.toLocaleDateString()}</span>
                            <span>{maxDate.toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Display current selected date */}
                    <div className="text-center py-1 px-3 bg-gray-50 rounded-md">
                        <span className="text-sm font-medium text-gray-700">
                            Current Time: {selectedDate.toLocaleDateString()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
