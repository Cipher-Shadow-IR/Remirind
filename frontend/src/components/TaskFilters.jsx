import { PRIORITIES, STATUSES } from '../utils/constants';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function TaskFilters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const handleClear = () => {
    onChange({ status: '', priority: '', search: '' });
  };

  const hasFilters = filters.status || filters.priority || filters.search;

  const inputClass =
    'flex h-9 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <div className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters</span>
      </div>
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className={`${inputClass} w-full pl-9`}
          />
        </div>
      </div>
      <select
        value={filters.status}
        onChange={(e) => handleChange('status', e.target.value)}
        className={inputClass}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <select
        value={filters.priority}
        onChange={(e) => handleChange('priority', e.target.value)}
        className={inputClass}
      >
        <option value="">All Priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </option>
        ))}
      </select>
      {hasFilters && (
        <button
          onClick={handleClear}
          className="inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
}
