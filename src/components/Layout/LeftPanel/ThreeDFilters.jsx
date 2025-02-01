import React from 'react';
import { Settings } from 'lucide-react';
import PointSizeAdjustmentIndex from '../../ThreeDDataViewer/PointSizeAdjustment/PointSizeAdjustmentIndex';
import AltitudeColorPopupIndex from '../../ThreeDDataViewer/AltitudeColorFilter/AltitudeColorPopupIndex';
import AltitudeRangeFilterIndex from '../../ThreeDDataViewer/AltitudeRangeFilter/AltitudeRangeFilterIndex';
import BackgroundColorIndex from '../../ThreeDDataViewer/BackgroundColor/BackgroundColorIndex';

export default function ThreeDFilters() {
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <h2 className="font-medium text-m">Style Setting</h2>
            </div>

            <PointSizeAdjustmentIndex />
            <AltitudeColorPopupIndex />
            <AltitudeRangeFilterIndex />
            <BackgroundColorIndex />
        </div>
    );
}

