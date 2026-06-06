export default function StatCard({ icon: Icon, label, value, color, bg, ring }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg ${bg} p-2.5 ${ring} ring-1`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
