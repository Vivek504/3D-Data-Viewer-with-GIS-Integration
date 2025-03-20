import { X } from 'lucide-react';
import React from 'react';

export default function PointCoordinateDisplay({ clickedPoint, clickedPosition, handleClose }) {
    return (
        <div>
            {/* Positioned coordinate tooltip */}
            {clickedPoint && clickedPosition && (
                <div
                    className="absolute bg-slate-800 text-white text-xs rounded px-2 py-1 shadow-md z-10"
                    style={{
                        left: `${clickedPosition.x}px`,
                        top: `${clickedPosition.y}px`,
                        transform: 'translate(-50%, -100%)',
                        marginTop: '-8px'
                    }}
                >
                    <div className="flex items-center">
                        <span className="mr-2 font-mono">
                            x:{clickedPoint.x.toFixed(3)} y:{clickedPoint.y.toFixed(3)} z:{clickedPoint.z.toFixed(3)}
                        </span>
                        <button
                            onClick={handleClose}
                            className="text-slate-300 hover:text-white ml-1"
                            aria-label="Close"
                        >
                            <X size={12} />
                        </button>
                    </div>
                    {/* Tooltip arrow */}
                    <div
                        className="absolute w-2 h-2 bg-slate-800 rotate-45"
                        style={{
                            left: '50%',
                            bottom: '-4px',
                            marginLeft: '-4px'
                        }}
                    ></div>
                </div>
            )}
        </div>
    )
}