import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { User, Terminal } from 'lucide-react';

export default function LogsViewer() {
    const { logs } = useAppContext();
    const logsEndRef = useRef(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="h-40 border-t bg-gray-900 overflow-y-auto p-3 space-y-1.5">
            {logs.map((log, index) => (
                <div
                    key={index}
                    className="flex items-center space-x-2 group hover:bg-gray-800 rounded px-2 py-1 transition-colors"
                >
                    <span className="text-xs text-gray-500">{log.time}</span>
                    {log.type === 'user' ? (
                        <div className="bg-blue-500/10 rounded-full p-1">
                            <User className="h-3 w-3 text-blue-400" />
                        </div>
                    ) : (
                        <div className="bg-green-500/10 rounded-full p-1">
                            <Terminal className="h-3 w-3 text-green-400" />
                        </div>
                    )}
                    <span className={`text-xs ${log.type === 'user' ? 'text-blue-300' : 'text-green-300'}`}>
                        {log.message}
                    </span>
                </div>
            ))}
            <div ref={logsEndRef} />
        </div>
    );
}
