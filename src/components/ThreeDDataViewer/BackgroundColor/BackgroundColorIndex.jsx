import React from 'react'
import { useThreeDDataViewerContext } from '../../../contexts/ThreeDDataViewerContext'
import ColorPicker from '../../shared/ColorPicker'
import { SCENE_BACKGROUND_COLORS } from '../../../constants/ThreeDViewerColors';
import { addLogs } from '../../../utils/LogUtils';
import { LOG_TYPES } from '../../../constants/LogTypes';
import { USER_ACTIONS } from '../../../constants/LogsMessages';
import { useAppContext } from '../../../contexts/AppContext';

export default function BackgroundColorIndex() {
    const { setLogs } = useAppContext();
    const { backgroundColor, setBackgroundColor } = useThreeDDataViewerContext();

    const handleLog = () => {
        addLogs(LOG_TYPES.USER, USER_ACTIONS.CHANGED_BACKGROUND_COLOR, setLogs);
    }

    return (
        <div>
            <ColorPicker
                label="Background Color"
                color={backgroundColor}
                setColor={setBackgroundColor}
                defaultColor={SCENE_BACKGROUND_COLORS.DEFAULT}
                handleLog={handleLog}
            />
        </div>
    )
}
