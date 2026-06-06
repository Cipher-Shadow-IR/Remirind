import { List, Clock, CheckCircle2, AlertTriangle, AlertCircle, Calendar } from 'lucide-react';
import StatCard from './ui/StatCard';

const cards = [
  { key: 'total', label: 'Total Tasks', value: 'total', icon: List, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-600/10' },
  { key: 'pending', label: 'Pending', value: 'pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', ring: 'ring-yellow-600/10' },
  { key: 'completed', label: 'Completed', value: 'completed', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-600/10' },
  { key: 'highPriority', label: 'High Priority', value: 'highPriority', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-600/10' },
  { key: 'overdue', label: 'Overdue', value: 'overdue', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', ring: 'ring-rose-600/10' },
  { key: 'dueToday', label: 'Due Today', value: 'dueToday', icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50', ring: 'ring-violet-600/10' },
  { key: 'dueThisWeek', label: 'Due This Week', value: 'dueThisWeek', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', ring: 'ring-indigo-600/10' },
];

export default function DashboardStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {cards.map(({ key, label, value, icon, color, bg, ring }) => (
        <StatCard key={key} icon={icon} label={label} value={stats[value]} color={color} bg={bg} ring={ring} />
      ))}
    </div>
  );
}
