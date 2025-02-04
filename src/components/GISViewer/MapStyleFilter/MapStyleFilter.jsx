import React from "react";
import { useGISViewerContext } from "../../../contexts/GISViewerContext";
import { MAP_STYLE_DROPDOWN_NAMES } from "../../../constants/MapStyles";
import Dropdown from "../../shared/Dropdown";

export default function MapStyleFilter() {
    const { mapStyle, setMapStyle } = useGISViewerContext();

    return (
        <div className="w-full max-w-xs">
            <Dropdown
                label="Select Map Style"
                selectedElement={mapStyle}  // Current selected map style
                setSelectedElement={setMapStyle}  // Function to update map style
                list={MAP_STYLE_DROPDOWN_NAMES}  // List of available map styles
            />
        </div>
    )
}
