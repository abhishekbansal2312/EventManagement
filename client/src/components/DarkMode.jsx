import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/solid'; // Use any icons you like

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
    return (
        <div className="fixed bottom-4 right-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-indigo-500 text-white rounded-full shadow-lg focus:outline-none">
                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
        </div>
    );
};

export default DarkModeToggle;
