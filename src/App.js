import React, { useState, useEffect, useRef } from 'react';
import CalendarView from './components/CalendarView';
import TaskManagement from './components/TaskManagement';
import { format } from 'date-fns';
import './App.css'; // <--- 添加这一行来导入CSS样式

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTaskView, setShowTaskView] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('timeAppTasks');
    return saved ? JSON.parse(saved) : [];
  });

  const clickTimeout = useRef(null);
  const lastClickedDate = useRef(null);

  // 点击/双击日期逻辑
  const handleDateInteraction = (date) => {
    clearTimeout(clickTimeout.current);
    const lastStr = lastClickedDate.current
      ? format(lastClickedDate.current, 'yyyy-MM-dd')
      : null;
    const nowStr = format(date, 'yyyy-MM-dd');

    if (lastStr === nowStr) {
      setCurrentDate(date);
      setShowTaskView(true);
      lastClickedDate.current = null;
    } else {
      lastClickedDate.current = date;
      clickTimeout.current = setTimeout(() => {
        setCurrentDate(date);
        lastClickedDate.current = null;
      }, 300);
    }
  };

  useEffect(() => {
    localStorage.setItem('timeAppTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleCreateTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
      date: format(currentDate, 'yyyy-MM-dd'),
      isCompleted: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleTaskMove = (taskId, newQuadrant) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, quadrant: newQuadrant } : t))
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleToggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  };

  const getCurrentDateTasks = () => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    return tasks.filter((t) => t.date === dateStr);
  };

  return (
    <div className="App">
      <h1>时间管理应用</h1>
      {showTaskView ? (
        <TaskManagement
          date={currentDate}
          tasks={getCurrentDateTasks()}
          allTasks={tasks}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onTaskMove={handleTaskMove}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleTaskCompletion}
          onBack={() => setShowTaskView(false)}
        />
      ) : (
        <CalendarView
          currentDate={currentDate}
          tasks={tasks}
          onDateInteraction={handleDateInteraction}
        />
      )}
    </div>
  );
}

export default App;
