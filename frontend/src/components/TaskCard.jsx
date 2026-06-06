import { PRIORITY_COLORS, STATUS_COLORS } from '../utils/constants';
import { Pencil, Trash2, Calendar } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : null;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  return (
    <div className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggle(task)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                task.status === 'completed'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:border-primary'
              }`}
            >
              {task.status === 'completed' && (
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <div className="space-y-1">
              <h3
                className={`font-medium leading-tight ${
                  task.status === 'completed'
                    ? 'line-through text-muted-foreground'
                    : ''
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    PRIORITY_COLORS[task.priority]
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    STATUS_COLORS[task.status]
                  }`}
                >
                  {task.status}
                </span>
                {task.dueDate && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      isOverdue
                        ? 'text-destructive font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.dueDate)}
                    {isOverdue && ' (Overdue)'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => onEdit(task)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground/60 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
