import React, { useState, useEffect } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';
import { GEOMETRY_TYPES, GEOMETRY_TYPE_LABELS } from '../../../constants/Geometry';

export default function MapSearch({ searchText, setSearchText, filteredGeometryTypes, setFilteredGeometryTypes }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tempSearchText, setTempSearchText] = useState(searchText || "");

    useEffect(() => {
        setTempSearchText(searchText || "");
    }, [searchText]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

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

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleTypeToggle = (typeValue) => {
        setFilteredGeometryTypes(prev => ({
            ...prev,
            [typeValue]: !prev[typeValue]
        }));
    };

    const handleSelectAll = () => {
        const areAllSelected = Object.values(filteredGeometryTypes).every(v => v);
        const newValue = !areAllSelected;
        const updatedTypes = Object.values(GEOMETRY_TYPES).reduce((acc, type) => ({
            ...acc,
            [type]: newValue
        }), {});
        setFilteredGeometryTypes(updatedTypes);
    };

    const areAllSelected = Object.values(filteredGeometryTypes).every(v => v);

    return (
        <div className="absolute top-4 left-4 z-10 search-container">
            <div className={`flex items-center bg-white rounded-lg shadow-md transition-all duration-300 overflow-visible ${isExpanded ? 'w-72' : 'w-10'}`}>
                <button
                    onClick={handleSearchClick}
                    className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg"
                    aria-label="Toggle search"
                >
                    <Search className="w-6 h-6 text-gray-600" />
                </button>

                {isExpanded && (
                    <div className="flex items-center min-w-0 pr-1 flex-1">
                        <input
                            id="map-search-input"
                            type="text"
                            value={tempSearchText}
                            onChange={(e) => setTempSearchText(e.target.value)}
                            className="flex-1 min-w-0 px-2 py-1 outline-none bg-transparent text-gray-700"
                            placeholder="Search GIS data..."
                        />

                        <div className="flex-shrink-0 flex items-center">
                            <button
                                onClick={toggleDropdown}
                                className="p-1.5 hover:bg-gray-100 rounded-lg"
                                aria-label="Toggle geometry types"
                            >
                                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {tempSearchText && (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isDropdownOpen && isExpanded && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-2">
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                                type="checkbox"
                                checked={areAllSelected}
                                onChange={handleSelectAll}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Select All</span>
                        </label>

                        <div className="h-px bg-gray-200 my-1" />

                        {Object.values(GEOMETRY_TYPES).map((typeValue) => (
                            <label
                                key={typeValue}
                                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={filteredGeometryTypes[typeValue]}
                                    onChange={() => handleTypeToggle(typeValue)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    {GEOMETRY_TYPE_LABELS[typeValue]}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}