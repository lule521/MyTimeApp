import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ currentDate, tasks, onDateInteraction }) {

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const dateStr = format(date, 'yyyy-MM-dd');
    const tasksForDay = tasks.filter(task => format(task.startTime, 'yyyy-MM-dd') === dateStr);

    if (tasksForDay.length === 0) {
      return null;
    }

    const allTasksCompleted = tasksForDay.every(task => task.isCompleted);

    return <div className={`task-dot ${allTasksCompleted ? 'green' : 'red'}`} />;
  };

  return (
    <div className="calendar-view">
      <Calendar
        value={currentDate}
        onChange={onDateInteraction}
        tileContent={tileContent}
      />
    </div>
  );
}