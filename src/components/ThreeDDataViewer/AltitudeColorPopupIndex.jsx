import React, { useEffect, useState } from 'react'
import { useThreeDDataViewerContext } from '../../contexts/ThreeDDataViewerContext';
import AltitudeColorPopup from '../ThreeDDataViewer/AltitudeColorPopup';
import { Palette } from 'lucide-react';
import { TABS } from '../../constants/Tabs';
import { POINT_CLOUD_COLORS } from '../../constants/ThreeDViewerColors';

export default function AltitudeColorPopupIndex() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const { fileDetails, colorRanges, setColorRanges, setAppliedColorMapping } = useThreeDDataViewerContext();

    useEffect(() => {
        if (colorRanges.length === 0) {
            setColorRanges([{
                id: 1,
                from: fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.min.y.toFixed(3),
                to: fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.max.y.toFixed(3),
                color: POINT_CLOUD_COLORS.DEFAULT
            }]);
        }
    }, [])

    return (
        <div className="w-full">
            <button
                onClick={() => setIsPopupOpen(true)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white font-medium rounded-md py-2 px-4 hover:bg-blue-600 transition"
            >
                <Palette className="w-5 h-5" />
                <span>Color by Altitude</span>
            </button>
            {isPopupOpen && (
                <AltitudeColorPopup
                    min={fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.min.y.toFixed(3)}
                    max={fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.max.y.toFixed(3)}
                    colorRanges={colorRanges}
                    setColorRanges={setColorRanges}
                    setAppliedColorMapping={setAppliedColorMapping}
                    onClose={() => setIsPopupOpen(false)}
                />
            )}
        </div>
    )
}
