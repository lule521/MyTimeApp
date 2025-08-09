// src/components/TaskManagement.js
import React, { useState, useEffect } from 'react';
import TimeAxis from './TimeAxis';
import QuadrantGrid from './QuadrantGrid';
import TaskEditor from './TaskEditor';
import { format } from 'date-fns';

export default function TaskManagement({ 
  date, 
  tasks, 
  allTasks,
  onCreateTask, 
  onUpdateTask,
  onTaskMove, 
  onDeleteTask,
  onBack 
}) {
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [newTaskData, setNewTaskData] = useState(null);

  // 修复：当有新任务数据时自动打开编辑器
  useEffect(() => {
    if (newTaskData) {
      setEditingTask(newTaskData);
    }
  }, [newTaskData]);

  // 打开任务编辑器
  const openTaskEditor = (task = null) => {
    setEditingTask(task || {
      id: Date.now(),
      content: '',
      date: format(date, 'yyyy-MM-dd'),
      startHour: selectedTimeRange?.startHour || 9,
      duration: selectedTimeRange?.duration || 1,
      quadrant: 'important-urgent'
    });
  };

  // 保存任务
  const handleSaveTask = (task) => {
    if (allTasks.some(t => t.id === task.id)) {
      onUpdateTask(task);
    } else {
      onCreateTask(task);
    }
    setEditingTask(null);
    setNewTaskData(null);
    setSelectedTimeRange(null);
  };

  // 处理创建新任务
  const handleCreateNewTask = () => {
    if (!selectedTimeRange) return;
    
    const newTask = {
      id: Date.now(),
      content: '新任务',
      date: format(date, 'yyyy-MM-dd'),
      ...selectedTimeRange,
      quadrant: 'important-urgent'
    };
    
    setNewTaskData(newTask);
  };

  return (
    <div className="task-management-view">
      <button onClick={onBack} className="back-button">
        &larr; 返回日历
      </button>
      
      <h2>{format(date, 'yyyy年MM月dd日')} 任务管理</h2>
      
      <div className="view-container">
        <div className="time-axis-section">
          <h3>24小时时间轴</h3>
          <TimeAxis 
            tasks={tasks}
            onSelectTime={setSelectedTimeRange}
            onTaskClick={openTaskEditor}
          />
          
          {selectedTimeRange && !editingTask && (
            <div className="time-range-preview">
              <p>已选择时间段: {selectedTimeRange.startHour}:00 - {selectedTimeRange.startHour + selectedTimeRange.duration}:00</p>
              <button 
                className="create-task-btn"
                onClick={handleCreateNewTask}
              >
                创建任务
              </button>
            </div>
          )}
        </div>
        
        <div className="quadrant-section">
          <h3>四象限任务管理</h3>
          <QuadrantGrid 
            tasks={tasks} 
            onTaskMove={onTaskMove}
            onTaskClick={openTaskEditor}
          />
        </div>
      </div>
      
      {editingTask && (
        <TaskEditor 
          task={editingTask} 
          onSave={handleSaveTask} 
          onDelete={onDeleteTask}
          onCancel={() => {
            setEditingTask(null);
            setNewTaskData(null);
          }}
        />
      )}
    </div>
  );
}