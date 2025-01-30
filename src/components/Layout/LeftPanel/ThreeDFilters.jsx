import React from 'react'
import PointSizeAdjustment from '../../ThreeDDataViewer/PointSizeAdjustment';
import AltitudeColorPopupIndex from '../../ThreeDDataViewer/AltitudeColorPopupIndex';

export default function ThreeDFilters() {
    return (
        <div className="space-y-4">
            <PointSizeAdjustment />
            <AltitudeColorPopupIndex />
        </div>
    )
}
