import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { User, Terminal } from 'lucide-react';
import { LOG_TYPES } from '../../constants/LogTypes';

export default function LogsViewer() {
    const { logs } = useAppContext();
    const logsEndRef = useRef(null);

    useEffect(() => {
        // Auto-scroll to the latest log entry when logs update
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        // Log viewer container with scrolling and styling
        <div className="h-40 border-t bg-gray-900 overflow-y-auto p-3 space-y-1.5">
            {logs.map((log, index) => (
                <div
                    key={index}
                    className="flex items-center space-x-2 group hover:bg-gray-800 rounded px-2 py-1 transition-colors"
                >
                    {/* Timestamp display */}
                    <span className="text-xs text-gray-500">{log.time}</span>

                    {/* Icon representation based on log type */}
                    {log.type === LOG_TYPES.USER ? (
                        <div className="bg-blue-500/10 rounded-full p-1">
                            <User className="h-3 w-3 text-blue-400" />
                        </div>
                    ) : (
                        <div className="bg-green-500/10 rounded-full p-1">
                            <Terminal className="h-3 w-3 text-green-400" />
                        </div>
                    )}

                    {/* Log message display with conditional text color */}
                    <span className={`text-xs ${log.type === LOG_TYPES.USER ? 'text-blue-300' : 'text-green-300'}`}>
                        {log.message}
                    </span>
                </div>
            ))}

            {/* Reference element for automatic scrolling */}
            <div ref={logsEndRef} />
        </div>
    );
}
