import React from 'react'
import MapStyleFilter from '../../GISViewer/MapStyleFilter/MapStyleFilter'
import ColorFilter from '../../GISViewer/ColorFilter/ColorFilter'
import { SettingSectionTitle } from './SettingSectionTitle'

export default function GISFilters() {
    return (
        <div className="space-y-4">
            {/* Section title */}
            <SettingSectionTitle title="Style Setting" />

            {/* Filter components for GIS visualization */}
            <MapStyleFilter />
            <ColorFilter />
        </div>
    )
}
