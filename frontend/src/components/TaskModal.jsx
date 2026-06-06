import { useState, useEffect } from 'react';
import { PRIORITIES } from '../utils/constants';
import { Plus, X } from 'lucide-react';
import Button from './ui/Button';

const initialState = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function TaskModal({ task, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const minDate = getTomorrow();

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(initialState);
    }
  }, [task]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (form.dueDate && form.dueDate < minDate) {
      setError('Due date must be tomorrow or later');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate || undefined,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-50 w-full max-w-lg animate-fade-in rounded-xl border bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter task title"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Optional description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={inputClass}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                min={minDate}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={submitting} className="flex-1">
              {submitting ? 'Saving...' : task ? 'Update' : 'Add Task'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
