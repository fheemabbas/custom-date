import React, { useState } from 'react';
import './WeekdayDateRangePicker.css';

interface DateRangePickerProps {
    onChange: (selectedRange: [string, string] | null, weekends: string[]) => void;
    predefinedRanges?: { label: string; days: number }[];
    selectedRange?: [string, string] | null; // New prop to receive the previously selected range
}

const WeekdayDateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, predefinedRanges = [], selectedRange }) => {
    const [startDate, setStartDate] = useState<Date | null>(selectedRange ? new Date(selectedRange[0]) : null);
    const [endDate, setEndDate] = useState<Date | null>(selectedRange ? new Date(selectedRange[1]) : null);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    const isWeekday = (date: Date) => date.getDay() !== 0 && date.getDay() !== 6;

    // Generate calendar days
    const generateCalendarDays = () => {
        const days: (Date | null)[] = [];
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const firstDayIndex = firstDayOfMonth.getDay();

        for (let i = 0; i < firstDayIndex; i++) days.push(null);

        for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
            days.push(new Date(day));
        }

        return days;
    };
    function formatDate(date: Date, format: string): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };

        if (format === 'YYYY-MM-DD') {
            options.year = 'numeric';
            options.month = '2-digit';
            options.day = '2-digit';
        } else if (format === 'DD/MM/YYYY') {
            options.day = '2-digit';
            options.month = '2-digit';
            options.year = 'numeric';
        } else if (format === 'MM/DD/YYYY') {
            options.month = '2-digit';
            options.day = '2-digit';
            options.year = 'numeric';
        }
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }
    const handleDateClick = (date: Date) => {
        if (!isWeekday(date)) return;

        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (startDate && !endDate && date > startDate) {
            setEndDate(date);
            notifyChange(startDate, date);
        }
    };

    const handleMouseEnter = (date: Date) => {
        if (startDate && !endDate) {
            setHoverDate(date); // Track the hover date to show the range
        }
    };

    const handleMouseLeave = () => {
        setHoverDate(null); // Clear the hover date when the mouse leaves
    };

    const notifyChange = (start: Date, end: Date) => {
        const selectedRange: [string, string] = [

            formatDate(new Date(start), 'YYYY-MM-DD'),
            formatDate(new Date(end), 'YYYY-MM-DD')
        ];

        const weekendDates: string[] = [];
        for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
            if (!isWeekday(day)) {
                weekendDates.push(formatDate(new Date(day), 'YYYY-MM-DD'));
            }
        }
        onChange(selectedRange, weekendDates);
    };

    const handleYearChange = (increment: boolean) => {
        setCurrentYear(prev => (increment ? prev + 1 : prev - 1));
    };

    const handleMonthChange = (increment: boolean) => {
        setCurrentMonth(prev => {
            let newMonth = increment ? prev + 1 : prev - 1;
            if (newMonth > 11) {
                newMonth = 0;
                handleYearChange(true);
            } else if (newMonth < 0) {
                newMonth = 11;
                handleYearChange(false);
            }
            return newMonth;
        });
    };

    const isInHoverRange = (date: Date) => {
        return startDate && !endDate && hoverDate && date >= startDate && date <= hoverDate;
    };

    const isInSelectedRange = (date: Date) => {
        return startDate && endDate && date >= startDate && date <= endDate;
    };

    // Handle predefined range selection
    const handlePredefinedRange = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);

        setStartDate(start);
        setEndDate(end);
        notifyChange(start, end);
    };

    return (
        <div className="calendar-container">
            <div className="navigation">
                <button onClick={() => handleYearChange(false)}>Previous Year</button>
                <span>{currentYear}</span>
                <button onClick={() => handleYearChange(true)}>Next Year</button>
            </div>
            <div className="navigation">
                <button onClick={() => handleMonthChange(false)}>Previous Month</button>
                <span>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })}</span>
                <button onClick={() => handleMonthChange(true)}>Next Month</button>
            </div>

            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="day-header">{day}</div>
                ))}
                {generateCalendarDays().map((day, index) => (
                    <button
                        key={index}
                        onClick={() => day && handleDateClick(day)}
                        onMouseEnter={() => day && handleMouseEnter(day)}
                        onMouseLeave={handleMouseLeave}
                        className={`day-cell ${day && isWeekday(day) ? 'weekday' : 'weekend'} ${day && isInSelectedRange(day) ? 'selected' : ''
                            } ${day && isInHoverRange(day) ? 'hovered' : ''}`}
                        disabled={!day || !isWeekday(day)}
                    >
                        {day ? day.getDate() : ''}
                    </button>
                ))}
            </div>

            {predefinedRanges.length > 0 && (
                <div className="predefined-ranges">
                    <h4>Quick Select Ranges:</h4>
                    {predefinedRanges.map((range, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePredefinedRange(range.days)}
                            className="predefined-range-button"
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeekdayDateRangePicker;
