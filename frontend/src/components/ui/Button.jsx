import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-[#29271f] text-[#f7f4ec] hover:bg-[#454034] border border-[#29271f] active:bg-[#1a1914]',
  outline:
    'border border-[#d4ccbd] bg-transparent text-[#29271f] hover:bg-[#ece5d8] hover:border-[#8b713a] active:bg-[#e4dcce]',
  secondary:
    'border border-[#d4ccbd] bg-[#fcfaf5] text-[#29271f] hover:bg-[#eae3d5] hover:border-[#8b713a]',
  destructive:
    'bg-[#8b2b2b] text-[#f7f4ec] hover:bg-[#6e2222] border border-[#8b2b2b]',
  ghost:
    'text-[#29271f] hover:bg-[#ece5d8] border border-transparent',
};

const sizes = {
  sm: 'h-8 px-3 text-[11px] uppercase tracking-wider',
  default: 'h-9 px-4 text-xs uppercase tracking-wider',
  lg: 'h-10 px-6 text-xs uppercase tracking-widest',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-[3px] font-sans font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8b713a] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 select-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.default} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" /> : null}
      {children}
    </button>
  );
}
