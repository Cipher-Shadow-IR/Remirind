import { PRIORITIES, STATUSES } from '../utils/constants';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function TaskFilters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const handleClear = () => {
    onChange({ status: '', priority: '', search: '' });
  };

  const hasFilters = Boolean(filters.status || filters.priority || filters.search);

  const inputClass =
    'flex h-9 rounded-[3px] border border-[#d4ccbd] bg-[#f7f4ec] px-3 py-1.5 text-xs text-[#29271f] font-sans focus:outline-none focus:border-[#8b713a] focus:ring-1 focus:ring-[#8b713a] transition-colors';

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3 rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-3 sm:p-4 shadow-[0_1px_2px_rgba(41,39,31,0.03)]">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-[#514d44] mr-2">
        <SlidersHorizontal className="h-3.5 w-3.5 text-[#8b713a]" />
        <span>Filter</span>
      </div>

      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#514d44]/70" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className={`${inputClass} w-full pl-8`}
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

      {hasFilters ? (
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1 rounded-[3px] border border-[#d4ccbd] px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#514d44] transition-colors hover:border-[#8b713a] hover:bg-[#eae3d5] hover:text-[#29271f]"
        >
          <X className="h-3 w-3" />
          <span>Reset</span>
        </button>
      ) : null}
    </div>
  );
}
