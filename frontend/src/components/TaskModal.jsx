import { useState, useEffect } from 'react';
import { PRIORITIES } from '../utils/constants';
import { X } from 'lucide-react';
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
    'flex h-9 w-full rounded-[3px] border border-[#d4ccbd] bg-[#f7f4ec] px-3 py-1.5 text-xs text-[#29271f] font-sans placeholder:text-[#514d44]/60 focus:outline-none focus:border-[#8b713a] focus:ring-1 focus:ring-[#8b713a] disabled:opacity-50 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#29271f]/40 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div className="relative z-50 w-full max-w-lg animate-fade-in rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-6 shadow-[0_8px_30px_rgba(41,39,31,0.12)]">
        <div className="flex items-center justify-between border-b border-[#e7e0d3] pb-3 mb-6">
          <h2 className="font-serif text-xl font-normal tracking-tight text-[#29271f]">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-[2px] p-1 text-[#514d44] transition-colors hover:text-[#29271f]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-[2px] border border-[#8b2b2b]/30 bg-[#8b2b2b]/10 px-3 py-2 text-xs text-[#8b2b2b]">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-[#514d44]">
              Title <span className="text-[#8b2b2b]">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Refactor API endpoints"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-medium text-[#514d44]">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="flex min-h-[70px] w-full rounded-[3px] border border-[#d4ccbd] bg-[#f7f4ec] px-3 py-2 text-xs text-[#29271f] font-sans placeholder:text-[#514d44]/60 focus:outline-none focus:border-[#8b713a] focus:ring-1 focus:ring-[#8b713a] transition-colors"
              placeholder="Optional additional notes"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-medium text-[#514d44]">
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

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-medium text-[#514d44]">
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e7e0d3]">
            <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={submitting}>
              {submitting ? 'Saving...' : task ? 'Update Task' : 'Save Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
