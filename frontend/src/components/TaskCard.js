import { useState } from 'react';

const CATEGORY_STYLES = {
  personal:  { label: 'Personal',  color: '#7c3aed' },
  trabajo:   { label: 'Trabajo',   color: '#2563eb' },
  urgente:   { label: 'Urgente',   color: '#dc2626' },
  estudio:   { label: 'Estudio',   color: '#0891b2' },
  hogar:     { label: 'Hogar',     color: '#16a34a' },
};

function getCategoryStyle(cat) {
  if (!cat) return null;
  return CATEGORY_STYLES[cat.toLowerCase()] || { label: cat, color: '#6b7280' };
}

function TaskCard({ task, onComplete, onAnalyze }) {
  const [completing, setCompleting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const isCompleted = task.status === 'completed';
  const hasAiData = task.category || (task.subtasks && task.subtasks.length > 0);
  const categoryStyle = getCategoryStyle(task.category);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await onComplete(task.id);
    } finally {
      setCompleting(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAiOpen(true);
    try {
      await onAnalyze(task.id);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleAi = () => {
    if (hasAiData) {
      setAiOpen((prev) => !prev);
    } else {
      handleAnalyze();
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

        <button
          className="btn btn--ai"
          onClick={toggleAi}
          disabled={analyzing}
          aria-label={hasAiData ? 'Ver análisis de IA' : 'Analizar con IA'}
        >
          {analyzing
            ? 'Analizando…'
            : hasAiData
            ? aiOpen
              ? '▲ Ocultar IA'
              : '▼ Ver análisis IA'
            : '✨ Analizar con IA'}
        </button>
      </div>

      {aiOpen && (
        <div className="task-card__ai" aria-label="Resultados de análisis IA">
          {analyzing ? (
            <div className="ai-loading">
              <span className="ai-spinner" aria-hidden="true" />
              Analizando con IA…
            </div>
          ) : (
            <>
              {categoryStyle && (
                <div className="ai-section">
                  <span className="ai-label">Categoría detectada</span>
                  <span
                    className="ai-value"
                    style={{ color: categoryStyle.color }}
                  >
                    {categoryStyle.label}
                  </span>
                </div>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="ai-section">
                  <span className="ai-label">Subtareas sugeridas</span>
                  <ul className="ai-subtasks">
                    {task.subtasks.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </article>
  );
}

export default TaskCard;
