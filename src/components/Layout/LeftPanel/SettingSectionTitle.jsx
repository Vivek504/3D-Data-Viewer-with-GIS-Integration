import React from 'react';
import { Settings } from 'lucide-react';

export function SettingSectionTitle({ title }) {
    return (
        <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <h2 className="font-medium text-m">{title}</h2>
        </div>
    );
}
