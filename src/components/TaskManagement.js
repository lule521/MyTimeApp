import React, { useState } from 'react';
import TimeAxis from './TimeAxis';
import QuadrantGrid from './QuadrantGrid';
import TaskEditor from './TaskEditor';
import { format } from 'date-fns';
import { Button } from '@mui/material';

export default function TaskManagement({
  date,
  tasks,
  onCreateTask,
  onUpdateTask,
  onTaskMove,
  onDeleteTask,
  onToggleComplete,
  onBack
}) {
  const [editingTask, setEditingTask] = useState(null);

  const handleOpenEditor = (task = {}) => {
    setEditingTask(task);
  };

  const handleCloseEditor = () => {
    setEditingTask(null);
  };

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      onUpdateTask(taskData);
    } else {
      onCreateTask(taskData);
    }
    handleCloseEditor();
  };

  const handleDeleteAndClose = (taskId) => {
    onDeleteTask(taskId);
    handleCloseEditor();
  };
  
  const handleCreateTaskFromTime = (timeRange) => {
    handleOpenEditor({
      startTime: timeRange.startTime,
      endTime: timeRange.endTime
    });
  };

  return (
    <div className="task-management">
      <div className="toolbar">
        <Button className="btn-back" onClick={onBack}>返回日历</Button>
        <h3>{format(date, 'yyyy-MM-dd')}</h3>
        <Button className="btn-create" variant="contained" onClick={() => handleOpenEditor({})}>+ 创建新任务</Button>
      </div>

      <div className="task-layout">
        <div className="time-axis-container">
          <TimeAxis
            tasks={tasks}
            onTaskClick={handleOpenEditor}
            onToggleComplete={onToggleComplete}
            onCreateRange={handleCreateTaskFromTime}
          />
        </div>

        <div className="quadrant-container">
          <QuadrantGrid
            tasks={tasks}
            onTaskMove={onTaskMove}
            onTaskClick={handleOpenEditor}
            onToggleComplete={onToggleComplete}
          />
        </div>
      </div>

      {editingTask && (
        <TaskEditor
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCloseEditor}
          onDelete={handleDeleteAndClose}
        />
      )}
    </div>
  );
}