import { useState } from 'react';

function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onCreate({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} data-testid="task-form">
      <h2 className="task-form__title">Nueva tarea</h2>

      {error && (
        <p className="task-form__error" role="alert">
          {error}
        </p>
      )}

      <input
        className="task-form__input"
        type="text"
        placeholder="Título *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        aria-label="Título de la tarea"
      />

      <textarea
        className="task-form__textarea"
        placeholder="Descripción — el agente IA la usará para sugerir subtareas y clasificar la tarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
        rows={3}
        aria-label="Descripción de la tarea"
      />

      <button
        className="btn btn--primary"
        type="submit"
        disabled={loading || !title.trim()}
      >
        {loading ? 'Creando…' : '+ Crear tarea'}
      </button>
    </form>
  );
}

export default TaskForm;
