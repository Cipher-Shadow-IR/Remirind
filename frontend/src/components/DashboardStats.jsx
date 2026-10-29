import { List, Clock, CheckCircle2, AlertTriangle, AlertCircle, Calendar } from 'lucide-react';
import StatCard from './ui/StatCard';

const cards = [
  { key: 'total', label: 'Total Tasks', value: 'total', icon: List },
  { key: 'pending', label: 'Pending', value: 'pending', icon: Clock },
  { key: 'completed', label: 'Completed', value: 'completed', icon: CheckCircle2 },
  { key: 'highPriority', label: 'High Priority', value: 'highPriority', icon: AlertTriangle },
  { key: 'overdue', label: 'Overdue', value: 'overdue', icon: AlertCircle },
  { key: 'dueToday', label: 'Due Today', value: 'dueToday', icon: Calendar },
  { key: 'dueThisWeek', label: 'Due This Week', value: 'dueThisWeek', icon: Calendar },
];

export default function DashboardStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-4">
      {cards.map(({ key, label, value, icon }) => (
        <StatCard
          key={key}
          icon={icon}
          label={label}
          value={stats[value] !== undefined ? stats[value] : 0}
        />
      ))}
    </div>
  );
}
