import React, { useState, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';

export default function MapSearch({ searchText, setSearchText }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [tempSearchText, setTempSearchText] = useState(searchText || "");

    useEffect(() => {
        setTempSearchText(searchText || "");
    }, [searchText]);

    const handleSearchClick = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setTimeout(() => {
                document.getElementById('map-search-input')?.focus();
            }, 100);
        }
    };

    const handleClear = () => {
        setTempSearchText('');
        setSearchText('');
        setIsExpanded(false);
    };

    const handleConfirmSearch = () => {
        setSearchText(tempSearchText);
    };

    return (
        <div className="absolute top-4 left-4 z-10">
            <div className={`flex items-center bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden ${isExpanded ? 'w-72' : 'w-10'}`}>
                <button
                    onClick={handleSearchClick}
                    className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg"
                    aria-label="Toggle search"
                >
                    <Search className="w-6 h-6 text-gray-600" />
                </button>

                {isExpanded && (
                    <div className="flex items-center min-w-0 pr-1">
                        <input
                            id="map-search-input"
                            type="text"
                            value={tempSearchText}
                            onChange={(e) => setTempSearchText(e.target.value)}
                            className="flex-1 min-w-0 px-2 py-1 outline-none bg-transparent text-gray-700"
                            placeholder="Search GIS data..."
                        />

                        {tempSearchText && (
                            <div className="flex-shrink-0 flex items-center">
                                <button
                                    onClick={handleConfirmSearch}
                                    className="p-1.5 hover:bg-green-100 rounded-lg text-green-600"
                                    aria-label="Confirm search"
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                
                                <button
                                    onClick={handleClear}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                                    aria-label="Clear search"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}