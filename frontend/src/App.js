import { useState, useEffect, useCallback } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/Login';
import { fetchTasks, createTask, updateTask } from './api/tasks';
import { getToken, logout } from './api/auth';

function App() {
  const [token, setToken]     = useState(() => getToken());
  const [tasks, setTasks]     = useState([]);
  const [filter, setFilter]   = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Escucha expiración de sesión desde cualquier llamada a la API
  useEffect(() => {
    const handleExpired = () => setToken(null);
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadTasks();
  }, [token, loadTasks]);

  const handleLogin = (newToken) => setToken(newToken);

  const handleLogout = () => {
    logout();
    setToken(null);
    setTasks([]);
  };

  const handleCreate = async (taskData) => {
    // El backend ya ejecuta la IA y devuelve la tarea con category y subtasks
    const newTask = await createTask(taskData);
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleComplete = async (id) => {
    const updated = await updateTask(id, { status: 'completed' });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="app-header__inner">
            <h1 className="app-header__logo">Task Manager</h1>
            <button className="btn btn--logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="app-error" role="alert">
              <span>{error}</span>
              <button className="btn btn--ghost" onClick={loadTasks}>
                Reintentar
              </button>
            </div>
          )}

          <TaskForm onCreate={handleCreate} />

          <TaskList
            tasks={tasks}
            filter={filter}
            onFilterChange={setFilter}
            onComplete={handleComplete}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
