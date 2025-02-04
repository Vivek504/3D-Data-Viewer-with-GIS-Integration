import React from 'react';
import PointSizeAdjustmentIndex from '../../ThreeDDataViewer/PointSizeAdjustment/PointSizeAdjustmentIndex';
import AltitudeColorPopupIndex from '../../ThreeDDataViewer/AltitudeColorFilter/AltitudeColorPopupIndex';
import AltitudeRangeFilterIndex from '../../ThreeDDataViewer/AltitudeRangeFilter/AltitudeRangeFilterIndex';
import BackgroundColorIndex from '../../ThreeDDataViewer/BackgroundColor/BackgroundColorIndex';
import { SettingSectionTitle } from './SettingSectionTitle';

export default function ThreeDFilters() {
    return (
        <div className="space-y-4">
            {/* Section title */}
            <SettingSectionTitle title="Style Setting" />

            {/* Filter components for 3D visualization */}
            <PointSizeAdjustmentIndex />
            <AltitudeColorPopupIndex />
            <AltitudeRangeFilterIndex />
            <BackgroundColorIndex />
        </div>
    );
}
