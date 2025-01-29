import React, { useState } from 'react'
import LeftPanelIndex from './LeftPanel/LeftPanelIndex'
import CenterPanelIndex from './CenterPanel/CenterPanelIndex'
import BottomPanelIndex from './BottomPanel/BottomPanelIndex'
import { Tabs } from '../../constants/Tabs'

export default function LayoutIndex() {
    const [activeTab, setActiveTab] = useState(Tabs.THREED_DATA_VIEWER);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    }

    return (
        <div className="flex flex-col h-screen w-screen p-4">
            <div className="flex flex-row h-4/5 gap-4">
                <div className="w-1/4">
                    <LeftPanelIndex />
                </div>
                <div className="w-3/4">
                    <CenterPanelIndex activeTab={activeTab} handleTabClick={handleTabClick} />
                </div>
            </div>

            <div className="h-1/5 mt-4">
                <BottomPanelIndex />
            </div>
        </div>
    )
}