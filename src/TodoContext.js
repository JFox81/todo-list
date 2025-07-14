import React, { createContext, useState, useEffect } from 'react';

export const TodoContext = createContext();

const API_URL = 'http://localhost:3000/todos';

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [search, setSearch] = useState('');
  const [sortAlpha, setSortAlpha] = useState(false);

  // Получение списка дел
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setTodos);
  }, []);

  // Добавление
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo, completed: false }),
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  // Удаление
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t.id !== id));
  };

  // Редактирование
  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editText }),
    });
    setTodos(todos.map(t => t.id === id ? { ...t, title: editText } : t));
    setEditId(null);
    setEditText('');
  };

  // Фильтрация и сортировка
  const filtered = todos
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAlpha ? a.title.localeCompare(b.title, 'ru') : 0);

  return (
    <TodoContext.Provider value={{
      todos,
      newTodo,
      setNewTodo,
      editId,
      setEditId,
      editText,
      setEditText,
      search,
      setSearch,
      sortAlpha,
      setSortAlpha,
      filtered,
      handleAdd,
      handleDelete,
      handleEdit
    }}>
      {children}
    </TodoContext.Provider>
  );
} 