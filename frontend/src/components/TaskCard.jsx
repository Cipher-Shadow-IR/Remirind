import { Pencil, Trash2, Calendar, Check } from 'lucide-react';

const priorityStyles = {
  low: 'border-[#d4ccbd] text-[#514d44] bg-[#f7f4ec]',
  medium: 'border-[#8b713a]/60 text-[#68501f] bg-[#8b713a]/10',
  high: 'border-[#8b2b2b]/50 text-[#8b2b2b] bg-[#8b2b2b]/10',
};

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
    <div className="group relative rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-5 shadow-[0_1px_2px_rgba(41,39,31,0.04)] transition-colors hover:border-[#8b713a]/80">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggle(task)}
              aria-label={task.status === 'completed' ? 'Mark task pending' : 'Mark task completed'}
              className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border transition-colors ${
                task.status === 'completed'
                  ? 'border-[#29271f] bg-[#29271f] text-[#f7f4ec]'
                  : 'border-[#d4ccbd] hover:border-[#8b713a] bg-transparent'
              }`}
            >
              {task.status === 'completed' ? (
                <Check className="h-3 w-3 stroke-[3]" />
              ) : null}
            </button>

            <div className="space-y-1 min-w-0 flex-1">
              <h3
                className={`font-serif text-lg leading-snug tracking-tight text-[#29271f] ${
                  task.status === 'completed'
                    ? 'line-through opacity-50'
                    : ''
                }`}
              >
                {task.title}
              </h3>
              {task.description ? (
                <p className="font-sans text-xs sm:text-sm text-[#514d44] leading-relaxed line-clamp-2">
                  {task.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 pl-7 text-[11px] uppercase tracking-wider font-sans font-medium">
            <span
              className={`inline-flex items-center rounded-[2px] border px-2 py-0.5 ${
                priorityStyles[task.priority] || priorityStyles.medium
              }`}
            >
              {task.priority}
            </span>

            <span
              className={`inline-flex items-center rounded-[2px] border px-2 py-0.5 ${
                task.status === 'completed'
                  ? 'border-[#d4ccbd] text-[#514d44] bg-[#f7f4ec]'
                  : 'border-[#8b713a]/40 text-[#68501f]'
              }`}
            >
              {task.status}
            </span>

            {task.dueDate ? (
              <span
                className={`inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 ${
                  isOverdue
                    ? 'border-[#8b2b2b]/50 text-[#8b2b2b] bg-[#8b2b2b]/5'
                    : 'border-[#d4ccbd] text-[#514d44]'
                }`}
              >
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
                {isOverdue ? <span className="font-bold">(Overdue)</span> : null}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-80 sm:opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded-[2px] p-1.5 text-[#514d44] transition-colors hover:bg-[#eae3d5] hover:text-[#29271f]"
            title="Edit task"
            aria-label="Edit task"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="rounded-[2px] p-1.5 text-[#514d44] transition-colors hover:bg-[#8b2b2b]/10 hover:text-[#8b2b2b]"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
