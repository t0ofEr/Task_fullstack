import { useState } from 'react';

const CATEGORY_STYLES = {
  personal: { label: 'Personal', color: '#7c3aed' },
  trabajo:  { label: 'Trabajo',  color: '#2563eb' },
  urgente:  { label: 'Urgente',  color: '#dc2626' },
  salud:    { label: 'Salud',    color: '#16a34a' },
};

function getCategoryStyle(cat) {
  if (!cat) return null;
  return CATEGORY_STYLES[cat.toLowerCase()] || { label: cat, color: '#6b7280' };
}

function TaskCard({ task, onComplete }) {
  const [completing, setCompleting] = useState(false);
  const [subtasksOpen, setSubtasksOpen] = useState(false);

  const isCompleted = task.status === 'completed';
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const categoryStyle = getCategoryStyle(task.category);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await onComplete(task.id);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <article
      className={`task-card${isCompleted ? ' task-card--completed' : ''}`}
      data-testid="task-card"
    >
      <div className="task-card__header">
        <div className="task-card__meta">
          <span className={`badge badge--status badge--${task.status}`}>
            {isCompleted ? 'Completada' : 'Pendiente'}
          </span>
          {categoryStyle && (
            <span
              className="badge badge--category"
              style={{ backgroundColor: categoryStyle.color }}
            >
              {categoryStyle.label}
            </span>
          )}
        </div>

        <h3 className="task-card__title">{task.title}</h3>

        {task.description && (
          <p className="task-card__description">{task.description}</p>
        )}
      </div>

      <div className="task-card__actions">
        {!isCompleted && (
          <button
            className="btn btn--success"
            onClick={handleComplete}
            disabled={completing}
            aria-label="Marcar como completada"
          >
            {completing ? '…' : '✓ Completar'}
          </button>
        )}

        {hasSubtasks && (
          <button
            className="btn btn--ai"
            onClick={() => setSubtasksOpen((o) => !o)}
            aria-label="Ver subtareas sugeridas"
          >
            {subtasksOpen
              ? '▲ Ocultar subtareas'
              : `▼ Subtareas (${task.subtasks.length})`}
          </button>
        )}
      </div>

      {subtasksOpen && hasSubtasks && (
        <div className="task-card__ai" aria-label="Subtareas sugeridas por IA">
          <div className="ai-section">
            <span className="ai-label">Subtareas sugeridas por IA</span>
            <ul className="ai-subtasks">
              {task.subtasks.map((sub) => (
                <li key={sub.id} className={sub.status === 'completed' ? 'subtask--done' : ''}>
                  {sub.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

export default TaskCard;
