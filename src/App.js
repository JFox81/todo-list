import React, { useContext } from 'react';
import { TodoProvider, TodoContext } from './TodoContext';

function AppContent() {
  const {
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
  } = useContext(TodoContext);

  return (
    <div className="todo-app">
      <h1>Список дел</h1>
      <form onSubmit={handleAdd}>
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Новое дело..."
        />
        <button type="submit">Добавить</button>
      </form>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Поиск..."
      />
      <button onClick={() => setSortAlpha(s => !s)}>
        {sortAlpha ? 'Обычный порядок' : 'Сортировать А-Я'}
      </button>
      <ul>
        {filtered.map(todo => (
          <li key={todo.id}>
            {editId === todo.id ? (
              <>
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <button onClick={() => handleEdit(todo.id)}>Сохранить</button>
                <button onClick={() => setEditId(null)}>Отмена</button>
              </>
            ) : (
              <>
                {todo.title}
                <button onClick={() => { setEditId(todo.id); setEditText(todo.title); }}>Редактировать</button>
                <button onClick={() => handleDelete(todo.id)}>Удалить</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
}

export default App;
