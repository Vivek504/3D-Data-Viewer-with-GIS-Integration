import React from 'react'
import PointSizeAdjustmentIndex from '../../ThreeDDataViewer/PointSizeAdjustment/PointSizeAdjustmentIndex';
import AltitudeColorPopupIndex from '../../ThreeDDataViewer/AltitudeColorFilter/AltitudeColorPopupIndex';

export default function ThreeDFilters() {
    return (
        <div className="space-y-4">
            <PointSizeAdjustmentIndex />
            <AltitudeColorPopupIndex />
        </div>
    )
}
