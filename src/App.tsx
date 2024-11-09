import React, { useState } from 'react';
import WeekdayDateRangePicker from './component/WeekdayDateRangePicker';
import './component/WeekdayDateRangePicker.css';

const App: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<[string, string] | null>(null);
  const [weekends, setWeekends] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const predefinedRanges = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
  ];

  const handleDateRangeChange = (range: [string, string] | null, weekendDates: string[]) => {
    setSelectedRange(range);
    setWeekends(weekendDates);
    setIsCalendarOpen(false); // Close the calendar after selection
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  return (
    <div className="app-container">
      <h1>Weekday Date Range Picker</h1>

      <input
        type="text"
        readOnly
        value={selectedRange ? `${selectedRange[0]} to ${selectedRange[1]}` : 'Select date range'}
        onClick={toggleCalendar}
        className="date-input"
      />

      {isCalendarOpen && (
        <WeekdayDateRangePicker
          onChange={handleDateRangeChange}
          predefinedRanges={predefinedRanges}
          selectedRange={selectedRange} // Pass selected range to highlight it when reopening
        />
      )}

      {weekends.length > 0 && (
        <div className="weekend-dates">
          <h3>Weekend Dates in Selected Range:</h3>
          <ul>
            {weekends.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
