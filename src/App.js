import React, { useEffect, useState, useRef } from 'react';
import { db } from './firebase';
import {
  ref,
  onValue,
  push,
  remove,
  update,
} from 'firebase/database';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimeout = useRef(null);
  const [sortAlpha, setSortAlpha] = useState(false);

  // Получение списка дел из Firebase
  useEffect(() => {
    setLoading(true);
    const todosRef = ref(db, 'todos');
    const unsubscribe = onValue(
      todosRef,
      (snapshot) => {
        const data = snapshot.val();
        const todosArr = data
          ? Object.entries(data).map(([id, todo]) => ({ id, ...todo }))
          : [];
        setTodos(todosArr);
        setLoading(false);
      },
      (err) => {
        setError('Ошибка загрузки данных');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Debounce для поиска
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  // Добавление нового дела
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      await push(ref(db, 'todos'), { title: newTodo, completed: false });
      setNewTodo('');
    } catch (e) {
      setError('Ошибка добавления');
    }
  };

  // Удаление дела
  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `todos/${id}`));
    } catch (e) {
      setError('Ошибка удаления');
    }
  };

  // Начать редактирование
  const handleEditStart = (id, title) => {
    setEditId(id);
    setEditText(title);
  };

  // Сохранить редактирование
  const handleEditSave = async (id) => {
    if (!editText.trim()) return;
    try {
      await update(ref(db, `todos/${id}`), { title: editText });
      setEditId(null);
      setEditText('');
    } catch (e) {
      setError('Ошибка редактирования');
    }
  };

  // Поиск и сортировка
  const filteredTodos = todos
    .filter(todo => todo.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
    .sort((a, b) => {
      if (!sortAlpha) return 0;
      return a.title.localeCompare(b.title, 'ru', { sensitivity: 'base' });
    });

  return (
    <div className="todo-app">
      <h1>Список дел</h1>
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          placeholder="Новое дело..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
        <button type="submit">Добавить</button>
      </form>
      <div className="todo-controls">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={() => setSortAlpha(s => !s)}>
          {sortAlpha ? 'Обычный порядок' : 'Сортировать А-Я'}
        </button>
      </div>
      {loading && <p>Загрузка...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {editId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <button onClick={() => handleEditSave(todo.id)}>Сохранить</button>
                <button onClick={() => setEditId(null)}>Отмена</button>
              </>
            ) : (
              <>
                {todo.title}
                <button onClick={() => handleEditStart(todo.id, todo.title)}>Редактировать</button>
                <button onClick={() => handleDelete(todo.id)}>Удалить</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
