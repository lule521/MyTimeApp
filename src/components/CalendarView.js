// 日历组件
// import React from 'react';


// export default function CalendarView() {
//   return <div>日历组件将显示在这里</div>;
// }
// src/components/CalendarView.js
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

export default function CalendarView({ currentDate, tasks, onDateChange, onDoubleClick }) {
  // 获取有任务的日期
  const taskDates = [...new Set(tasks.map(task => task.date))];
  
  // 自定义日期内容
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasTask = taskDates.includes(dateStr);
    
    return (
      <div 
        className="tile-content"
        onClick={() => onDateChange(date)}
        onDoubleClick={() => onDoubleClick(date)}
      >
        {hasTask && <div className="task-dot" />}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <Calendar 
        value={currentDate}
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