// src/components/TimeAxis.js
import React, { useState, useRef, useEffect, useCallback } from 'react';

const HOUR_HEIGHT = 60; // px 每小时高度（和 CSS 保持一致）

function HourBlock({ hour, isSelecting, onMouseDown, onMouseEnter }) {
  return (
    <div
      className={`hour-block ${isSelecting ? 'selecting' : ''}`}
      onMouseDown={(e) => onMouseDown(hour, e)}
      onMouseEnter={() => onMouseEnter(hour)}
      data-hour={hour}
    >
      <span className="hour-label">{hour}:00</span>
    </div>
  );
}

export default function TimeAxis({ tasks = [], onCreateRange, onTaskClick, onToggleComplete }) {
  const [selection, setSelection] = useState({ start: null, end: null });
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  
  const isDragging = useRef(false);
  const axisRef = useRef(null);
  
  const handleMouseDown = (hour, e) => {
    e.preventDefault();
    isDragging.current = true;
    setSelection({ start: hour, end: hour });
    setShowCreateButton(false); // 开始新的拖拽时，隐藏旧的按钮
  };

  const handleMouseEnter = (hour) => {
    if (isDragging.current) {
      setSelection(prev => ({ ...prev, end: hour }));
    }
  };
  
  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (selection.start === null || selection.end === null) return;
    
    const startHour = Math.min(selection.start, selection.end);
    const endHour = Math.max(selection.start, selection.end);
    
    // 计算按钮位置
    const axisRect = axisRef.current.getBoundingClientRect();
    const top = (endHour * HOUR_HEIGHT) + (HOUR_HEIGHT / 2) - 15; // 按钮半高
    const left = '100px'; // 固定在时间轴标签右侧
    
    setButtonPosition({ top, left });
    setShowCreateButton(true);
    
  }, [selection.start, selection.end]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
        if(isDragging.current) {
            handleMouseUp();
        }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleMouseUp]);
  
  const handleCreateButtonClick = () => {
    if (selection.start === null) return;
    
    const startHour = Math.min(selection.start, selection.end);
    const endHour = Math.max(selection.start, selection.end);
    const duration = endHour - startHour + 1;
    
    if (onCreateRange) {
      onCreateRange({ startHour, duration });
    }
    
    // 重置状态
    setShowCreateButton(false);
    setSelection({ start: null, end: null });
  };
  
  const isHourSelected = (hour) => {
    if (selection.start === null || selection.end === null) return false;
    const start = Math.min(selection.start, selection.end);
    const end = Math.max(selection.start, selection.end);
    return hour >= start && hour <= end;
  };

  return (
    <div className="time-axis" ref={axisRef} onMouseLeave={handleMouseUp}>
      {/* 小时行 */}
      {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
        <HourBlock
          key={hour}
          hour={hour}
          isSelecting={isHourSelected(hour)}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
        />
      ))}

      {/* 已创建的任务块 */}
      {tasks.map((task) => {
        const top = task.startHour * HOUR_HEIGHT;
        const height = Math.max(30, (task.duration || 1) * HOUR_HEIGHT - 2); // -2 for border
        return (
          <div
            key={task.id}
            className={`task-block ${task.isCompleted ? 'completed' : ''}`}
            style={{
              top: `${top}px`,
              height: `${height}px`,
            }}
            onClick={() => onTaskClick && onTaskClick(task)}
          >
            <div className="task-content">
              <input
                type="checkbox"
                checked={!!task.isCompleted}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete && onToggleComplete(task.id);
                }}
                readOnly
                style={{ marginRight: '8px' }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.content}</span>
            </div>
          </div>
        );
      })}

      {/* 创建任务按钮 */}
      {showCreateButton && (
        <button
          className="create-task-btn"
          style={{
            position: 'absolute',
            top: `${buttonPosition.top}px`,
            left: buttonPosition.left,
            transform: 'translateX(10px)', // 从时间块旁边弹出
            zIndex: 100
          }}
          onClick={handleCreateButtonClick}
        >
          创建任务
        </button>
      )}
    </div>
  );
}