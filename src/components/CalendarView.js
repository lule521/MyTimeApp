
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

// Calendar component
export default function CalendarView({ currentDate, tasks, onDateInteraction }) {
  const taskDates = new Set(tasks.map(task => task.date));
  
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasTask = taskDates.has(dateStr);
    return hasTask ? <div className="task-dot" /> : null;
  };

  return (
    <div className="calendar-container">
      <Calendar 
        value={currentDate}
        onClickDay={onDateInteraction}  // Triggering the passed function when a day is clicked
        tileContent={tileContent}
        tileClassName={({ date, view }) => 
          view === 'month' && date.toDateString() === new Date().toDateString() 
            ? 'highlight' 
            : ''
        }
      />
    </div>
  );
}
