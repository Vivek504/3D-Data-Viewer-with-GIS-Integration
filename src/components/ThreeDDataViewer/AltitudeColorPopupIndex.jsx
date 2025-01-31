import React, { useEffect, useState } from 'react'
import { useThreeDDataViewerContext } from '../../contexts/ThreeDDataViewerContext';
import AltitudeColorPopup from '../ThreeDDataViewer/AltitudeColorPopup';
import { Palette } from 'lucide-react';
import { TABS } from '../../constants/Tabs';
import { POINT_CLOUD_COLORS } from '../../constants/ThreeDViewerColors';
import { useAppContext } from '../../contexts/AppContext';

export default function AltitudeColorPopupIndex() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { fileDetails } = useAppContext();
    const { colorRanges, setColorRanges, setApplyColorMapping, setResetColorMapping } = useThreeDDataViewerContext();

    const resetColorRanges = () => {
        setColorRanges([{
            id: 1,
            from: fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.min.y.toFixed(3),
            to: fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.max.y.toFixed(3),
            color: POINT_CLOUD_COLORS.DEFAULT
        }]);
    }

    const onResetColorMapping = () => {
        setResetColorMapping(true);
        resetColorRanges();
    }

    useEffect(() => {
        if (colorRanges.length === 0) {
            resetColorRanges();
        }
    }, []);

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
                    setApplyColorMapping={setApplyColorMapping}
                    onClose={() => setIsPopupOpen(false)}
                    onResetColorMapping={onResetColorMapping}
                />
            )}
        </div>
    )
}
