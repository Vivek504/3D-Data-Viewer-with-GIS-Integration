import React, { useEffect, useState } from 'react'
import { useThreeDDataViewerContext } from '../../../contexts/ThreeDDataViewerContext';
import { useAppContext } from '../../../contexts/AppContext';
import { TABS } from '../../../constants/Tabs';
import { Sliders } from 'lucide-react';
import AltitudeRangeFilterPopup from './AltitudeRangeFilterPopup';

export default function AltitudeRangeFilter() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { fileDetails } = useAppContext();
    const { altitudeRanges, setAltitudeRanges } = useThreeDDataViewerContext();

    const resetAltitudeRanges = () => {
        setAltitudeRanges([{
            id: 1,
            from: parseFloat(fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.min.y.toFixed(3)),
            to: parseFloat(fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.max.y.toFixed(3))
        }]);
    };

    const onResetAltitudeRanges = () => {
        resetAltitudeRanges();
    }

    useEffect(() => {
        if (altitudeRanges.length === 0) {
            resetAltitudeRanges();
        }
    }, [])


    return (
        <div className="w-full">
            <button
                onClick={() => setIsPopupOpen(true)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white font-medium rounded-md py-2 px-4 hover:bg-blue-600 transition"
            >
                <Sliders className="w-5 h-5" />
                <span>Altitude Range Filter</span>
            </button>
            {isPopupOpen && (
                <AltitudeRangeFilterPopup
                    min={parseFloat(fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.min.y.toFixed(3))}
                    max={parseFloat(fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.max.y.toFixed(3))}
                    altitudeRanges={altitudeRanges}
                    setAltitudeRanges={setAltitudeRanges}
                    onClose={() => setIsPopupOpen(false)}
                    onResetAltitudeRanges={onResetAltitudeRanges}
                />
            )}
        </div>
    )
}
