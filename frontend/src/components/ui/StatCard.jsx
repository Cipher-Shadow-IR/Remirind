export default function StatCard({ icon: Icon, label, value, color, bg, ring }) {
  return (
    <div className="relative overflow-hidden rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-5 shadow-[0_1px_2px_rgba(41,39,31,0.04)] transition-colors hover:border-[#8b713a]/60">
      <div className="flex items-center justify-between border-b border-[#e7e0d3] pb-3">
        <p className="text-[11px] font-medium uppercase tracking-widest text-[#514d44]">
          {label}
        </p>
        {Icon ? (
          <div className="text-[#8b713a]">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>
      <div className="mt-3">
        <p className="font-serif text-3xl font-normal tracking-tight text-[#29271f]">
          {value}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#8b713a]/30" />
    </div>
  );
}
