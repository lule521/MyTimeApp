// src/components/TaskManagement.js
import React, { useState } from 'react';
import TimeAxis from './TimeAxis';
import QuadrantGrid from './QuadrantGrid';
import TaskEditor from './TaskEditor';
import { format } from 'date-fns';

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
  const [editingTask, setEditingTask] = useState(null); // null | object

  // 统一的编辑器入口，可以是空对象{}（新建），或完整任务对象（编辑）
  const handleOpenEditor = (task = {}) => {
    // 如果是新建任务，则传入一个空对象
    // 如果是编辑，则传入完整的 task 对象
    // 如果是从时间轴创建，则传入一个包含 startHour 和 duration 的部分对象
    setEditingTask(task);
  };

  const handleCloseEditor = () => {
    setEditingTask(null);
  };

  // 从 24 小时 TimeAxis 拖选时间段后触发
  const handleCreateTaskFromTime = (timeRange) => {
    // 准备一个包含默认时间的新任务对象，然后打开编辑器
    handleOpenEditor({
      startHour: timeRange.startHour,
      duration: timeRange.duration
    });
  };

  const handleSaveTask = (taskData) => {
    // editingTask.id 存在，说明是编辑模式
    if (taskData.id) {
      onUpdateTask(taskData);
    } else {
      // id 不存在，说明是创建新任务
      onCreateTask(taskData);
    }
    handleCloseEditor();
  };

  const handleDeleteAndClose = (taskId) => {
    onDeleteTask(taskId);
    handleCloseEditor();
  };

  return (
    <div className="task-management">
      <div className="toolbar">
        <button onClick={onBack}>返回日历</button>
        <h3>{format(date, 'yyyy-MM-dd')}</h3>
        <button onClick={() => handleOpenEditor({})}>+ 创建新任务</button>
      </div>

      <div className="task-layout">
        {/* 左边 24 小时视图 */}
        <div className="time-axis-container">
          <TimeAxis
            tasks={tasks}
            onTaskClick={handleOpenEditor} // 点击任务块也能编辑
            onToggleComplete={onToggleComplete}
            onCreateRange={handleCreateTaskFromTime} // 正确传递创建回调
          />
        </div>

        {/* 右边 四象限视图 */}
        <div className="quadrant-container">
          <QuadrantGrid
            tasks={tasks}
            onTaskMove={onTaskMove}
            onTaskClick={handleOpenEditor} // 修复：传递点击回调
            onToggleComplete={onToggleComplete}
          />
        </div>
      </div>

      {/* 任务编辑弹窗 */}
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