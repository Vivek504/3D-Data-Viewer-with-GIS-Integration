import React from 'react'
import LeftPanelIndex from './LeftPanel/LeftPanelIndex'
import CenterPanelIndex from './CenterPanel/CenterPanelIndex'
import BottomPanelIndex from './BottomPanel/BottomPanelIndex'

export default function LayoutIndex() {
    return (
        <div className="flex flex-col h-screen w-screen p-4">
            {/* Top section with Left and Center Panels */}
            <div className="flex flex-row h-4/5 gap-4">
                <div className="w-1/4">
                    <LeftPanelIndex />
                </div>
                <div className="w-3/4">
                    <CenterPanelIndex />
                </div>
            </div>

            {/* Bottom panel taking remaining 20% height */}
            <div className="h-1/5 mt-4">
                <BottomPanelIndex />
            </div>
        </div>
    )
}