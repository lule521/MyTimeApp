// 四象限网格
// src/components/QuadrantGrid.js
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const QUADRANTS = [
  { id: 'important-urgent', title: '重要紧急' },
  { id: 'important-noturgent', title: '重要不紧急' },
  { id: 'notimportant-urgent', title: '不重要紧急' },
  { id: 'notimportant-noturgent', title: '不重要不紧急' }
];

export default function QuadrantGrid({ tasks, onTaskMove, onTaskClick }) {
  return (
    <div className="quadrant-grid">
      {QUADRANTS.map(quadrant => (
        <div 
          key={quadrant.id} 
          className={`quadrant quadrant-${quadrant.id}`}
        >
          <h4>{quadrant.title}</h4>
          <div className="tasks-container">
            {tasks
              .filter(task => task.quadrant === quadrant.id)
              .map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onMove={onTaskMove}
                  onClick={onTaskClick}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskItem({ task, onMove, onClick }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, quadrant: task.quadrant },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  // 为每个象限创建单独的放置目标
  const [, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => {
      if (onMove && item.id !== task.id) {
        onMove(item.id, task.quadrant);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div 
      ref={drag}
      className="task-item"
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}
      onClick={() => onClick(task)}
    >
      <div ref={drop} className="drop-target">
        {task.content}
        <div className="task-time">
          {task.startHour}:00 - {task.startHour + task.duration}:00
        </div>
      </div>
    </div>
  );
}