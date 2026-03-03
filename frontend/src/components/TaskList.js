import TaskCard from './TaskCard';

const FILTERS = [
  { value: '',          label: 'Todas'       },
  { value: 'pending',   label: 'Pendientes'  },
  { value: 'completed', label: 'Completadas' },
];

function TaskList({ tasks, filter, onFilterChange, onComplete, loading }) {
  const visible = filter
    ? tasks.filter((t) => t.status === filter)
    : tasks;

  const pendingCount   = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const emptyMessage = {
    '':          'No hay tareas todavía. ¡Crea la primera arriba!',
    pending:     'No hay tareas pendientes. ¡Todo al día! 🎉',
    completed:   'Aún no hay tareas completadas.',
  }[filter];

  return (
    <section className="task-list">
      <div className="task-list__header">
        <div className="task-list__title-row">
          <h2>
            Tareas
            <span className="task-count">{visible.length}</span>
          </h2>
          <div className="task-list__summary">
            <span className="summary-chip summary-chip--pending">{pendingCount} pendientes</span>
            <span className="summary-chip summary-chip--completed">{completedCount} completadas</span>
          </div>
        </div>

        <div className="filters" role="group" aria-label="Filtrar tareas">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-btn${filter === f.value ? ' filter-btn--active' : ''}`}
              onClick={() => onFilterChange(f.value)}
              aria-pressed={filter === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="task-list__loading" aria-live="polite">
          Cargando tareas…
        </div>
      ) : visible.length === 0 ? (
        <div className="task-list__empty" aria-live="polite">
          {emptyMessage}
        </div>
      ) : (
        <div className="task-list__grid">
          {visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;
