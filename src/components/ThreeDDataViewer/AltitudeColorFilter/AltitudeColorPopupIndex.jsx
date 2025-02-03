import React, { useEffect, useRef, useState } from 'react';
import { useThreeDDataViewerContext } from '../../../contexts/ThreeDDataViewerContext';
import AltitudeColorPopup from './AltitudeColorPopup';
import { Palette } from 'lucide-react';
import { TABS } from '../../../constants/Tabs';
import { POINT_CLOUD_COLORS } from '../../../constants/ThreeDViewerColors';
import { useAppContext } from '../../../contexts/AppContext';
import { addLogs } from '../../../utils/LogUtils';
import { LOG_TYPES } from '../../../constants/LogTypes';
import { USER_ACTIONS } from '../../../constants/LogsMessages';
import { getDecimalPrecisionLength } from '../../../utils/MathUtils';

export default function AltitudeColorPopupIndex() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { fileDetails, setLogs } = useAppContext();
    const { colorRanges, setColorRanges, setApplyColorMapping, setResetColorMapping } = useThreeDDataViewerContext();
    const initialColorRangesRef = useRef(null);

    const minAltitude = fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.min.y;
    const maxAltitude = fileDetails[TABS.THREED_DATA_VIEWER].boundingBox.max.y;

    // Resets color ranges to default values
    const resetColorRanges = () => {
        setColorRanges([{
            id: 1,
            from: parseFloat(minAltitude.toFixed(getDecimalPrecisionLength(minAltitude))),
            to: parseFloat(maxAltitude.toFixed(getDecimalPrecisionLength(maxAltitude))),
            color: POINT_CLOUD_COLORS.DEFAULT
        }]);
    };

    // Resets color mapping and updates state
    const onResetColorMapping = () => {
        resetColorRanges();
        setResetColorMapping(true);
    };

    // Opens the popup and stores initial color ranges
    const handleOpenPopup = () => {
        initialColorRangesRef.current = JSON.stringify(colorRanges);
        setIsPopupOpen(true);
    };

    // Closes the popup and logs changes if any modifications were made
    const handleClosePopup = () => {
        setIsPopupOpen(false);

        if (initialColorRangesRef.current !== JSON.stringify(colorRanges)) {
            addLogs(LOG_TYPES.USER, USER_ACTIONS.APPLIED_COLOR_FILTER_BY_ALTITUDE, setLogs);
        }
    };

    useEffect(() => {
        if (colorRanges.length === 0) {
            resetColorRanges();
        }
    }, []);

    return (
        <div className="w-full">
            {/* Button to open the altitude color mapping popup */}
            <button
                onClick={handleOpenPopup}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white font-medium rounded-md py-2 px-4 hover:bg-blue-600 transition"
            >
                <Palette className="w-5 h-5" />
                <span>Color by Altitude</span>
            </button>

            {/* Render altitude color popup when open */}
            {isPopupOpen && (
                <AltitudeColorPopup
                    min={parseFloat(minAltitude.toFixed(getDecimalPrecisionLength(minAltitude)))}
                    max={parseFloat(maxAltitude.toFixed(getDecimalPrecisionLength(maxAltitude)))}
                    colorRanges={colorRanges}
                    setColorRanges={setColorRanges}
                    setApplyColorMapping={setApplyColorMapping}
                    onClose={handleClosePopup}
                    onResetColorMapping={onResetColorMapping}
                />
            )}
        </div>
    );
}
