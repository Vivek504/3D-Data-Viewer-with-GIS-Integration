import { useState, useRef, useEffect } from "react";

export default function Dropdown({ label, selectedElement, setSelectedElement, list }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Closes dropdown if clicked outside
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-xs" ref={dropdownRef}>
            {/* Dropdown label */}
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>

            {/* Button to toggle dropdown */}
            <button
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                {list[selectedElement] || "Select an option"}
            </button>

            {/* Dropdown list */}
            {isOpen && (
                <ul className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
                    {Object.entries(list).map(([key, value]) => (
                        <li
                            key={key}
                            className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                            onClick={() => {
                                setSelectedElement(Number(key));
                                setIsOpen(false);
                            }}
                        >
                            {value}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
