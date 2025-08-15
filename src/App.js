import React, { useState, useEffect } from 'react';
import CalendarView from './components/CalendarView';
import TaskManagement from './components/TaskManagement';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase/config';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTaskView, setShowTaskView] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        try {
          const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const userTasks = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            startTime: doc.data().startTime.toDate(), // 将Firebase的时间戳转回Date对象
            endTime: doc.data().endTime.toDate(),
          }));
          setTasks(userTasks);
        } catch (e) {
          console.error("Error fetching tasks: ", e);
        }
      } else {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [user]);

  const handleCreateTask = async (taskData) => {
    if (!user) return;
    const newTask = {
      ...taskData,
      userId: user.uid,
      isCompleted: false,
      date: format(taskData.startTime, 'yyyy-MM-dd'),
    };
    try {
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setTasks((prev) => [...prev, { ...newTask, id: docRef.id }]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    if (!user) return;
    try {
      const taskRef = doc(db, 'tasks', updatedTask.id);
      await updateDoc(taskRef, updatedTask);
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };
  
  const handleTaskMove = async (taskId, newQuadrant) => {
    if (!user) return;
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { quadrant: newQuadrant });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, quadrant: newQuadrant } : t))
      );
    } catch (e) {
      console.error("Error moving task: ", e);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleToggleTaskCompletion = async (taskId) => {
    if (!user) return;
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;
    const newCompletionStatus = !taskToUpdate.isCompleted;
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { isCompleted: newCompletionStatus });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, isCompleted: newCompletionStatus } : t
        )
      );
    } catch (e) {
      console.error("Error toggling completion: ", e);
    }
  };
  
  const getCurrentDateTasks = () => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    return tasks.filter((t) => format(t.startTime, 'yyyy-MM-dd') === dateStr);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const mainApp = (
    <div className="App">
      <div className="main-header">
        <h1>时间管理应用</h1>
        <button className="btn-logout" onClick={handleLogout}>退出登录</button>
      </div>
      {showTaskView ? (
        <TaskManagement
          date={currentDate}
          tasks={getCurrentDateTasks()}
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
          onDateInteraction={(date) => {
            setCurrentDate(date);
            setShowTaskView(true);
          }}
        />
      )}
    </div>
  );


  if (loading) {
    return <div className="loading-screen">加载中...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/" element={user ? mainApp : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;