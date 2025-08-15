import React, { useState, useRef, useEffect, useCallback } from 'react';
import { format, getMinutes, getHours, differenceInMinutes, startOfDay, addMinutes, isBefore } from 'date-fns';


const MINUTE_HEIGHT = 1;
const HOUR_HEIGHT = 60 * MINUTE_HEIGHT;

export default function TimeAxis({ tasks = [], onCreateRange, onTaskClick, onToggleComplete }) {
  const [selection, setSelection] = useState({ start: null, end: null });
  const [showCreateButton, setButtonInfo] = useState({ show: false, top: 0, left: '100px' });
  const [isDragging, setIsDragging] = useState(false); // 使用 state 来触发 useEffect
  const axisRef = useRef(null);
  const today = startOfDay(new Date());

  const calculateTimeFromY = (y) => {
    if (!axisRef.current) return today;
    const axisRect = axisRef.current.getBoundingClientRect();
    const topOffset = y - axisRect.top;
    const minutes = Math.round(topOffset / MINUTE_HEIGHT);
    return addMinutes(today, Math.max(0, minutes));
  };

  // ✅ 核心修改：使用 useEffect 来管理全局事件监听
  useEffect(() => {
    const handleMouseMove = (e) => {
      const time = calculateTimeFromY(e.clientY);
      setSelection(prev => ({ ...prev, end: time }));
    };

    const handleMouseUp = () => {
      setIsDragging(false); // 停止拖拽
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // 清理函数：当组件卸载或 isDragging 变化时，移除监听器
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]); // 这个 effect 只在 isDragging 状态改变时运行

  // ✅ 核心修改：这个 effect 专门处理拖拽结束后的逻辑
  useEffect(() => {
    // 当 isDragging 从 true 变为 false 时，意味着拖拽刚刚结束
    if (!isDragging && selection.start) {
      if (selection.end) {
        const [startTime, endTime] = isBefore(selection.start, selection.end) 
            ? [selection.start, selection.end] 
            : [selection.end, selection.start];
        
        if (differenceInMinutes(endTime, startTime) > 5) {
          const buttonTop = (getHours(endTime) * HOUR_HEIGHT) + getMinutes(endTime) * MINUTE_HEIGHT;
          setButtonInfo({ show: true, top: buttonTop, left: '100px' });
        } else {
          setSelection({ start: null, end: null });
        }
      } else {
        setSelection({ start: null, end: null });
      }
    }
  }, [isDragging]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setButtonInfo({ show: false, top: 0, left: '100px' });
    const time = calculateTimeFromY(e.clientY);
    setSelection({ start: time, end: time });
    setIsDragging(true); // 开始拖拽
  };
  
  const handleCreateButtonClick = () => {
    const [startTime, endTime] = isBefore(selection.start, selection.end) ? [selection.start, selection.end] : [selection.end, selection.start];
    if (onCreateRange) {
      onCreateRange({ startTime, endTime });
    }
    setButtonInfo({ show: false, top: 0, left: '100px' });
    setSelection({ start: null, end: null });
  };
  
  const getHighlightStyle = () => {
    if (!selection.start || !selection.end) return { display: 'none' };
    const [start, end] = isBefore(selection.start, selection.end) ? [selection.start, selection.end] : [selection.end, selection.start];
    const top = differenceInMinutes(start, today) * MINUTE_HEIGHT;
    const height = differenceInMinutes(end, start) * MINUTE_HEIGHT;
    return { top: `${top}px`, height: `${height}px` };
  };

  return (
    <div className="time-axis" ref={axisRef} onMouseDown={handleMouseDown}>
      {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
        <div key={hour} className="hour-block" style={{ height: HOUR_HEIGHT }}>
          <span className="hour-label">{hour}:00</span>
        </div>
      ))}
      
      {selection.start && selection.end && (
        <div className="selection-highlight" style={getHighlightStyle()} />
      )}

      {tasks.map((task) => {
        const top = differenceInMinutes(task.startTime, startOfDay(task.startTime)) * MINUTE_HEIGHT;
        const height = Math.max(1, differenceInMinutes(task.endTime, task.startTime) * MINUTE_HEIGHT - 2);
        return (
          <div
            key={task.id}
            className={`task-block ${task.isCompleted ? 'completed' : ''}`}
            style={{ top: `${top}px`, height: `${height}px` }}
            onClick={() => onTaskClick && onTaskClick(task)}
          >
            <div className="task-content">
              <input type="checkbox" checked={!!task.isCompleted} onClick={(e) => { e.stopPropagation(); onToggleComplete && onToggleComplete(task.id); }} readOnly style={{ marginRight: '8px' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {format(task.startTime, 'HH:mm')} - {format(task.endTime, 'HH:mm')} {task.content}
              </span>
            </div>
          </div>
        );
      })}

      {showCreateButton.show && (
        <button
          className="create-task-btn btn-timeaxis-create"
          style={{
            position: 'absolute',
            top: `${showCreateButton.top}px`,
            left: showCreateButton.left,
            transform: 'translateY(-50%) translateX(10px)',
            zIndex: 100
          }}
          onClick={handleCreateButtonClick}
          onMouseDown={(e) => e.stopPropagation()}
        >
          创建任务
        </button>
      )}
    </div>
  );
}