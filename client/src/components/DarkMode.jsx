import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-4 rounded-full transition-transform transform hover:scale-105 shadow-lg focus:outline-none flex items-center justify-center 
                ${darkMode ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-teal-500'}
                `}
            >
                {darkMode ? (
                    <SunIcon className="h-6 w-6 text-white animate-pulse" />
                ) : (
                    <MoonIcon className="h-6 w-6 text-white animate-pulse" />
                )}
            </button>
        </div>
    );
};

export default DarkModeToggle;
