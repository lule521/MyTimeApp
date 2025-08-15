import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { format } from 'date-fns';

const QUADRANTS = [
  { id: 'important-urgent', title: '重要 & 紧急' },
  { id: 'important-noturgent', title: '重要 & 不紧急' },
  { id: 'notimportant-urgent', title: '不重要 & 紧急' },
  { id: 'notimportant-noturgent', title: '不重要 & 不紧急' },
];

export default function QuadrantGrid({ tasks = [], onTaskMove, onTaskClick, onToggleComplete }) {
  return (
    <div className="quadrant-container">
      {QUADRANTS.map((q) => (
        <QuadrantColumn
          key={q.id}
          quadrant={q}
          tasks={tasks.filter((t) => t.quadrant === q.id)}
          onTaskMove={onTaskMove}
          onTaskClick={onTaskClick}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

function QuadrantColumn({ quadrant, tasks, onTaskMove, onTaskClick, onToggleComplete }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => {
      if (item.id && item.quadrant !== quadrant.id) {
        onTaskMove(item.id, quadrant.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }), [quadrant.id, onTaskMove]);

  return (
    <div ref={drop} className={`quadrant ${quadrant.id} ${isOver && canDrop ? 'accepting-drop' : ''}`}>
      <h4>{quadrant.title}</h4>
      <div className="tasks-container">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} onToggleComplete={onToggleComplete} />
        ))}
        {tasks.length === 0 && <div style={{textAlign: 'center', color: '#aaa', marginTop: '20px'}}>暂无任务</div>}
      </div>
    </div>
  );
}

function TaskCard({ task, onClick, onToggleComplete }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, quadrant: task.quadrant },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() })
  }), [task.id, task.quadrant]);

  const taskItemClasses = [
    'task-item',
    task.isCompleted ? 'completed' : '',
    isDragging ? 'dragging' : ''
  ].join(' ').trim();

  return (
    <div
      ref={drag}
      className={`task-item ${task.quadrant} ${task.isCompleted ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={() => onClick && onClick(task)}
    >
        <input
          type="checkbox"
          checked={!!task.isCompleted}
          onClick={(e) => { e.stopPropagation(); onToggleComplete && onToggleComplete(task.id); }}
          readOnly
          style={{ marginRight: '8px' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="title">{task.content}</div>
          <div className="meta">
            {format(task.startTime, 'HH:mm')} - {format(task.endTime, 'HH:mm')}
          </div>
        </div>
    </div>
  );
}