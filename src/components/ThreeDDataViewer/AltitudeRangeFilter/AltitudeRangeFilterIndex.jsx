import React, { useEffect, useRef, useState } from 'react'
import { useThreeDDataViewerContext } from '../../../contexts/ThreeDDataViewerContext';
import { useAppContext } from '../../../contexts/AppContext';
import { TABS } from '../../../constants/Tabs';
import { Sliders } from 'lucide-react';
import AltitudeRangeFilterPopup from './AltitudeRangeFilterPopup';
import { LOG_TYPES } from '../../../constants/LogTypes';
import { addLogs } from '../../../utils/LogUtils';
import { USER_ACTIONS } from '../../../constants/LogsMessages';
import { getDecimalPrecisionLength } from '../../../utils/MathUtils';

export default function AltitudeRangeFilter() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { fileDetails, setLogs } = useAppContext();
    const { altitudeRanges, setAltitudeRanges } = useThreeDDataViewerContext();
    const initialAltitudeRangesRef = useRef(null);

    const minAltitude = fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.min.y;
    const maxAltitude = fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.max.y;

    const resetAltitudeRanges = () => {
        setAltitudeRanges([{
            id: 1,
            from: parseFloat(minAltitude.toFixed(getDecimalPrecisionLength(minAltitude))),
            to: parseFloat(maxAltitude.toFixed(getDecimalPrecisionLength(maxAltitude)))
        }]);
    };

    const onResetAltitudeRanges = () => {
        resetAltitudeRanges();
    };

    const handleOpenPopup = () => {
        initialAltitudeRangesRef.current = JSON.stringify(altitudeRanges);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);

        if (initialAltitudeRangesRef.current !== JSON.stringify(altitudeRanges)) {
            addLogs(LOG_TYPES.USER, USER_ACTIONS.APPLIED_ALTITUDE_RANGE_FILTER, setLogs);
        }
    };

    useEffect(() => {
        if (altitudeRanges.length === 0) {
            resetAltitudeRanges();
        }
    }, [])


    return (
        <div className="w-full">
            <button
                onClick={handleOpenPopup}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white font-medium rounded-md py-2 px-4 hover:bg-blue-600 transition"
            >
                <Sliders className="w-5 h-5" />
                <span>Altitude Range Filter</span>
            </button>
            {isPopupOpen && (
                <AltitudeRangeFilterPopup
                    min={parseFloat(minAltitude.toFixed(getDecimalPrecisionLength(minAltitude)))}
                    max={parseFloat(maxAltitude.toFixed(getDecimalPrecisionLength(maxAltitude)))}
                    altitudeRanges={altitudeRanges}
                    setAltitudeRanges={setAltitudeRanges}
                    onClose={handleClosePopup}
                    onResetAltitudeRanges={onResetAltitudeRanges}
                />
            )}
        </div>
    )
}
