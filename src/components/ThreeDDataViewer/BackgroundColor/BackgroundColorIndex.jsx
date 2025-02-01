import React from 'react'
import { useThreeDDataViewerContext } from '../../../contexts/ThreeDDataViewerContext'
import ColorPicker from '../../shared/ColorPicker'

export default function BackgroundColorIndex() {
    const { backgroundColor, setBackgroundColor } = useThreeDDataViewerContext();

    return (
        <div>
            <ColorPicker label="Background Color" color={backgroundColor} setColor={setBackgroundColor} />
        </div>
    )
}
