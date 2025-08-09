// 24小时时间轴
// src/components/TimeAxis.js
import React, { useState, useCallback } from 'react';

export default function TimeAxis({ tasks, onSelectTime, onTaskClick }) {
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(null);
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // 处理鼠标按下事件（开始拖拽）
  const handleMouseDown = (hour) => {
    setDragging(true);
    setDragStart(hour);
    setCurrentSelection({ startHour: hour, duration: 1 });
  };
  
  // 处理鼠标移动事件（拖拽中）
  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hourHeight = rect.height / 24;
    const hoverHour = Math.floor(y / hourHeight);
    
    if (hoverHour >= dragStart) {
      setCurrentSelection({
        startHour: dragStart,
        duration: hoverHour - dragStart + 1
      });
    }
  }, [dragging, dragStart]);
  
  // 处理鼠标释放事件（结束拖拽）
  const handleMouseUp = () => {
    if (dragging && currentSelection && currentSelection.duration > 0) {
      onSelectTime(currentSelection);
      setDragging(false);
    }
  };
  
  // 检查某个时间段是否有任务
  const hasTaskAtHour = (hour) => {
    return tasks.some(task => 
      hour >= task.startHour && hour < task.startHour + task.duration
    );
  };

  return (
    <div 
      className="time-axis"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {hours.map(hour => (
        <div 
          key={hour} 
          className={`hour-block ${hasTaskAtHour(hour) ? 'has-task' : ''}`}
          onMouseDown={() => handleMouseDown(hour)}
        >
          <span className="hour-label">{hour}:00</span>
          
          {/* 显示已有任务 */}
          {tasks
            .filter(task => task.startHour === hour)
            .map(task => (
              <div 
                key={task.id}
                className="task-block"
                style={{ height: `${task.duration * 60}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick(task);
                }}
              >
                <div className="task-content">{task.content}</div>
                <div className="task-time">
                  {task.startHour}:00 - {task.startHour + task.duration}:00
                </div>
              </div>
            ))}
          
          {/* 显示当前选择的时间段 */}
          {currentSelection?.startHour === hour && (
            <div 
              className="time-block" 
              style={{ height: `${currentSelection.duration * 60}px` }}
            >
              <div className="time-label">
                {currentSelection.startHour}:00 - {currentSelection.startHour + currentSelection.duration}:00
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}