import React from 'react'
import LeftPanelIndex from './LeftPanel/LeftPanelIndex'
import CenterPanelIndex from './CenterPanel/CenterPanelIndex'
import BottomPanelIndex from './BottomPanel/BottomPanelIndex'
import { ThreeDDataViewerContextProvider } from '../../contexts/ThreeDDataViewerContext'
import { GISViewerContextProvider } from '../../contexts/GISViewerContext'

export default function LayoutIndex() {
    return (
        <div className="flex flex-row h-screen w-screen p-4 gap-4">
            <ThreeDDataViewerContextProvider>
                <GISViewerContextProvider>
                    {/* Left Section: Left Panel (4/5 height) & Bottom Panel (1/5 height) */}
                    <div className="flex flex-col w-1/4 h-full">
                        <div className="h-4/5">
                            <LeftPanelIndex />
                        </div>
                        <div className="h-1/5 mt-4">
                            <BottomPanelIndex />
                        </div>
                    </div>

                    {/* Center Panel taking 3/4 width and full height */}
                    <div className="w-3/4 h-full">
                        <CenterPanelIndex />
                    </div>
                </GISViewerContextProvider>
            </ThreeDDataViewerContextProvider>
        </div>
    )
}
