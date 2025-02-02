import React from 'react'
import MapStyleFilter from '../../GISViewer/MapStyleFilter/MapStyleFilter'
import { Settings } from 'lucide-react'
import ColorFilter from '../../GISViewer/ColorFilter/ColorFilter'

export default function GISFilters() {
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <h2 className="font-medium text-m">Style Setting</h2>
            </div>

            <MapStyleFilter />
            <ColorFilter />
        </div>
    )
}
