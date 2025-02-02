import React from 'react'
import ColorPicker from '../../shared/ColorPicker'
import { useGISViewerContext } from '../../../contexts/GISViewerContext'
import { GEOMETRY_TYPE_COLOR } from '../../../constants/GISViewerColors';

export default function ColorFilter() {
    const { pointColor, setPointColor, lineColor, setLineColor, polygonColor, setPolygonColor } = useGISViewerContext();
    return (
        <div className="space-y-4">
            <ColorPicker label="Point Color" color={pointColor} setColor={setPointColor} defaultColor={GEOMETRY_TYPE_COLOR.POINT.DEFAULT} />
            <ColorPicker label="Line Color" color={lineColor} setColor={setLineColor} defaultColor={GEOMETRY_TYPE_COLOR.LINE.DEFAULT} />
            <ColorPicker label="Polygon Color" color={polygonColor} setColor={setPolygonColor} defaultColor={GEOMETRY_TYPE_COLOR.POLYGON.DEFAULT} />
        </div>
    )
}
