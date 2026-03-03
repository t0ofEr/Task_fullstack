import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import TaskList from './components/TaskList';

// ─── TaskForm ─────────────────────────────────────────────────────

describe('TaskForm', () => {
  test('renders title input and submit button', () => {
    render(<TaskForm onCreate={jest.fn()} />);
    expect(screen.getByPlaceholderText(/título/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear tarea/i })).toBeInTheDocument();
  });

  test('submit button is disabled when title is empty', () => {
    render(<TaskForm onCreate={jest.fn()} />);
    expect(screen.getByRole('button', { name: /crear tarea/i })).toBeDisabled();
  });

  test('shows validation error when form is submitted with empty title', async () => {
    render(<TaskForm onCreate={jest.fn()} />);
    fireEvent.submit(screen.getByTestId('task-form'));
    expect(await screen.findByRole('alert')).toHaveTextContent(/título/i);
  });

  test('calls onCreate with title and description on valid submit', async () => {
    const onCreate = jest.fn().mockResolvedValue({});
    render(<TaskForm onCreate={onCreate} />);

    await userEvent.type(screen.getByPlaceholderText(/título/i), 'Nueva tarea');
    await userEvent.type(screen.getByPlaceholderText(/descripción/i), 'Una descripción');
    await userEvent.click(screen.getByRole('button', { name: /crear tarea/i }));

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        title: 'Nueva tarea',
        description: 'Una descripción',
      });
    });
  });

  test('clears fields after successful creation', async () => {
    const onCreate = jest.fn().mockResolvedValue({});
    render(<TaskForm onCreate={onCreate} />);

    const titleInput = screen.getByPlaceholderText(/título/i);
    await userEvent.type(titleInput, 'Tarea a limpiar');
    await userEvent.click(screen.getByRole('button', { name: /crear tarea/i }));

    await waitFor(() => expect(titleInput).toHaveValue(''));
  });
});

// ─── TaskCard ─────────────────────────────────────────────────────

const pendingTask = {
  id: 1,
  title: 'Revisar PR',
  description: 'Revisar el pull request del equipo',
  status: 'pending',
  category: null,
  subtasks: [],
};

const completedTask = { ...pendingTask, id: 2, status: 'completed' };

describe('TaskCard', () => {
  test('renders task title and description', () => {
    render(<TaskCard task={pendingTask} onComplete={jest.fn()} />);
    expect(screen.getByText('Revisar PR')).toBeInTheDocument();
    expect(screen.getByText('Revisar el pull request del equipo')).toBeInTheDocument();
  });

  test('shows "Pendiente" badge for pending tasks', () => {
    render(<TaskCard task={pendingTask} onComplete={jest.fn()} />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  test('shows "Completada" badge for completed tasks', () => {
    render(<TaskCard task={completedTask} onComplete={jest.fn()} />);
    expect(screen.getByText('Completada')).toBeInTheDocument();
  });

  test('renders complete button only for pending tasks', () => {
    const { rerender } = render(
      <TaskCard task={pendingTask} onComplete={jest.fn()} />
    );
    expect(screen.getByText(/completar/i)).toBeInTheDocument();

    rerender(<TaskCard task={completedTask} onComplete={jest.fn()} />);
    expect(screen.queryByText(/completar/i)).not.toBeInTheDocument();
  });

  test('calls onComplete with task id when complete button is clicked', async () => {
    const onComplete = jest.fn().mockResolvedValue({});
    render(<TaskCard task={pendingTask} onComplete={onComplete} />);

    await userEvent.click(screen.getByText(/completar/i));
    expect(onComplete).toHaveBeenCalledWith(pendingTask.id);
  });

  test('shows category badge when task has category', () => {
    const taskWithCategory = { ...pendingTask, category: 'Trabajo' };
    render(<TaskCard task={taskWithCategory} onComplete={jest.fn()} />);
    expect(screen.getByText('Trabajo')).toBeInTheDocument();
  });

  test('shows subtasks button and expands list when task has subtasks', async () => {
    const taskWithSubtasks = {
      ...pendingTask,
      category: 'Trabajo',
      subtasks: [
        { id: 10, title: 'Revisar código', status: 'pending' },
        { id: 11, title: 'Dejar comentarios', status: 'pending' },
      ],
    };
    render(<TaskCard task={taskWithSubtasks} onComplete={jest.fn()} />);

    // El botón de subtareas debe estar visible
    const btn = screen.getByText(/subtareas \(2\)/i);
    expect(btn).toBeInTheDocument();

    // Al hacer click se expanden
    await userEvent.click(btn);
    expect(screen.getByText('Revisar código')).toBeInTheDocument();
    expect(screen.getByText('Dejar comentarios')).toBeInTheDocument();
  });
});

// ─── TaskList ─────────────────────────────────────────────────────

const sampleTasks = [
  { id: 1, title: 'Tarea pendiente',  description: '', status: 'pending',   category: null, subtasks: [] },
  { id: 2, title: 'Tarea completada', description: '', status: 'completed', category: null, subtasks: [] },
];

describe('TaskList', () => {
  const defaultProps = {
    tasks: sampleTasks,
    filter: '',
    onFilterChange: jest.fn(),
    onComplete: jest.fn(),
    loading: false,
  };

  test('renders all tasks when filter is empty', () => {
    render(<TaskList {...defaultProps} />);
    expect(screen.getAllByTestId('task-card')).toHaveLength(2);
  });

  test('shows only pending tasks when filter is "pending"', () => {
    render(<TaskList {...defaultProps} filter="pending" />);
    expect(screen.getAllByTestId('task-card')).toHaveLength(1);
    expect(screen.getByText('Tarea pendiente')).toBeInTheDocument();
  });

  test('shows only completed tasks when filter is "completed"', () => {
    render(<TaskList {...defaultProps} filter="completed" />);
    expect(screen.getAllByTestId('task-card')).toHaveLength(1);
    expect(screen.getByText('Tarea completada')).toBeInTheDocument();
  });

  test('shows empty message when no tasks exist', () => {
    render(<TaskList {...defaultProps} tasks={[]} filter="" />);
    expect(screen.getByText(/no hay tareas todavía/i)).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<TaskList {...defaultProps} loading={true} tasks={[]} />);
    expect(screen.getByText(/cargando tareas/i)).toBeInTheDocument();
  });

  test('calls onFilterChange when a filter button is clicked', async () => {
    const onFilterChange = jest.fn();
    render(<TaskList {...defaultProps} onFilterChange={onFilterChange} />);

    await userEvent.click(screen.getByRole('button', { name: /pendientes/i }));
    expect(onFilterChange).toHaveBeenCalledWith('pending');
  });
});
