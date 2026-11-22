import { useState, useEffect } from 'react';

const STORAGE_KEY = 'tt_recruit_tasks';

const loadTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Task list kept in the browser's localStorage, so the app needs no backend or account.
export const useLocalTasks = () => {
  const [tasks, setTasks] = useState(loadTasks);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage can be blocked (private mode); the list still works for this session.
    }
  }, [tasks]);

  const makeTask = (text) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    completed: false,
    createdAt: Date.now(),
  });

  const addTasks = (texts) => setTasks((prev) => [...prev, ...texts.map(makeTask)]);
  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return { tasks, addTasks, toggleTask, deleteTask };
};
