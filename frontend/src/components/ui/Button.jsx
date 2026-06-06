import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
};

const sizes = {
  sm: 'h-9 px-3 text-xs',
  default: 'h-10 px-4 py-2 text-sm',
  lg: 'h-11 px-6 text-base',
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
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
