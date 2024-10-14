import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CalendarComponent = ({ darkMode }) => {
    const navigate = useNavigate();
    
    const [currentDate, setCurrentDate] = useState(new Date());

    const getMonthName = (date) => date.toLocaleString('default', { month: 'long' });
    const getYear = (date) => date.getFullYear();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const days = Array.from({ length: endOfMonth.getDate() }, (_, i) => i + 1);

        const startDay = startOfMonth.getDay();
        const blankDays = Array.from({ length: startDay }, () => '');

        return { blankDays, days };
    };

    const { blankDays, days } = getDaysInMonth(currentDate);

    const handleDateClick = (day) => {
        // Create the full date string
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        navigate(`/add-event/${formattedDate}`);
    };

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    return (
        <div className={`calendar p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={handlePrevMonth}
                    className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    Prev
                </button>
                <h2 className="text-xl font-bold">{`${getMonthName(currentDate)} ${getYear(currentDate)}`}</h2>
                <button
                    onClick={handleNextMonth}
                    className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    Next
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
                {daysOfWeek.map(day => (
                    <div key={day} className="text-center font-bold">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {blankDays.map((_, index) => (
                    <div key={`blank-${index}`} className="p-2"></div>
                ))}
                {days.map(day => (
                    <div
                        key={day}
                        className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-center"
                        onClick={() => handleDateClick(day)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#2d3748' : '#e2e8f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarComponent;
