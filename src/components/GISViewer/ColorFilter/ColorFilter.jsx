import React from 'react'
import ColorPicker from '../../shared/ColorPicker'
import { useGISViewerContext } from '../../../contexts/GISViewerContext'
import { GEOMETRY_TYPE_COLOR } from '../../../constants/GISViewerColors';
import { USER_ACTIONS } from '../../../constants/LogsMessages';
import { addLogs } from '../../../utils/LogUtils';
import { LOG_TYPES } from '../../../constants/LogTypes';
import { useAppContext } from '../../../contexts/AppContext';

export default function ColorFilter() {
    const { setLogs } = useAppContext();

    const { pointColor, setPointColor, lineColor, setLineColor, polygonColor, setPolygonColor } = useGISViewerContext();

    const handleLog = () => {
        addLogs(LOG_TYPES.USER, USER_ACTIONS.APPLIED_GEOMETRY_COLOR_FILTER, setLogs);
    }

    return (
        <div className="space-y-4">
            <ColorPicker label="Point Color" color={pointColor} setColor={setPointColor} defaultColor={GEOMETRY_TYPE_COLOR.POINT.DEFAULT} handleLog={handleLog} />
            <ColorPicker label="Line Color" color={lineColor} setColor={setLineColor} defaultColor={GEOMETRY_TYPE_COLOR.LINE.DEFAULT} handleLog={handleLog} />
            <ColorPicker label="Polygon Color" color={polygonColor} setColor={setPolygonColor} defaultColor={GEOMETRY_TYPE_COLOR.POLYGON.DEFAULT} handleLog={handleLog} />
        </div>
    )
}
