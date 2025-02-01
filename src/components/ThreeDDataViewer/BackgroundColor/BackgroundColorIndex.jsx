import React from 'react'
import { useThreeDDataViewerContext } from '../../../contexts/ThreeDDataViewerContext'
import ColorPicker from '../../shared/ColorPicker'
import { SCENE_BACKGROUND_COLORS } from '../../../constants/ThreeDViewerColors';

export default function BackgroundColorIndex() {
    const { backgroundColor, setBackgroundColor } = useThreeDDataViewerContext();

    return (
        <div>
            <ColorPicker label="Background Color" color={backgroundColor} setColor={setBackgroundColor} defaultColor={SCENE_BACKGROUND_COLORS.DEFAULT} />
        </div>
    )
}
