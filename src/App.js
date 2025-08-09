// import React from 'react';
// import CalendarView from './components/CalendarView';

// function App() {
//   return (
//     <div className="App">
//       <h1>时间管理应用</h1>
//       <CalendarView />
//     </div>
//   );
// }
// src/App.js
import React, { useState, useEffect } from 'react';
import CalendarView from './components/CalendarView';
import TaskManagement from './components/TaskManagement';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { format } from 'date-fns';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTaskView, setShowTaskView] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('timeAppTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  // 保存任务到本地存储
  useEffect(() => {
    localStorage.setItem('timeAppTasks', JSON.stringify(tasks));
  }, [tasks]);

  // 处理日期单击
  const handleDateClick = (date) => {
    setCurrentDate(date);
  };
  
  // 处理日期双击
  const handleDoubleClick = (date) => {
    setCurrentDate(date);
    setShowTaskView(true);
  };

  // 创建新任务 - 修复：直接打开编辑器
  const handleCreateTask = (timeRange) => {
    const newTask = {
      id: Date.now(),
      content: '新任务',
      date: format(currentDate, 'yyyy-MM-dd'),
      ...timeRange,
      quadrant: 'important-urgent'
    };
    
    setTasks([...tasks, newTask]);
    return newTask; // 返回新任务用于打开编辑器
  };

  // 更新任务
  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  // 移动任务到不同象限 - 修复：正确更新状态
  const handleTaskMove = (taskId, newQuadrant) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, quadrant: newQuadrant} : task
    ));
  };

  // 删除任务
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // 获取当前日期的任务
  const getCurrentDateTasks = () => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    return tasks.filter(task => task.date === dateStr);
  };

  return (
    <div className="App">
      <h1>时间管理应用</h1>
      
      {showTaskView ? (
        <DndProvider backend={HTML5Backend}>
          <TaskManagement 
            date={currentDate} 
            tasks={getCurrentDateTasks()}
            allTasks={tasks}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onTaskMove={handleTaskMove}
            onDeleteTask={handleDeleteTask}
            onBack={() => setShowTaskView(false)}
          />
        </DndProvider>
      ) : (
        <CalendarView 
          currentDate={currentDate} 
          tasks={tasks}
          onDateChange={handleDateClick}
          onDoubleClick={handleDoubleClick}
        />
      )}
    </div>
  );
}

export default App;