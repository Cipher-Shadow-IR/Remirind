import { createContext, useState, useCallback, useRef, useContext } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const typeStyles = {
  success: {
    border: 'border-[#8b713a]/50',
    bg: 'bg-[#fcfaf5]',
    icon: CheckCircle2,
    iconColor: 'text-[#68501f]',
  },
  error: {
    border: 'border-[#8b2b2b]/50',
    bg: 'bg-[#fcfaf5]',
    icon: AlertCircle,
    iconColor: 'text-[#8b2b2b]',
  },
  info: {
    border: 'border-[#d4ccbd]',
    bg: 'bg-[#fcfaf5]',
    icon: Info,
    iconColor: 'text-[#8b713a]',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'success', duration = 4000) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" role="region" aria-live="polite">
        {toasts.map((toast) => {
          const style = typeStyles[toast.type] || typeStyles.success;
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 rounded-[3px] border ${style.border} ${style.bg} p-3.5 shadow-[0_4px_16px_rgba(41,39,31,0.08)] animate-fade-in font-sans`}
            >
              <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${style.iconColor}`} />
              <p className="text-xs font-normal text-[#29271f] flex-1 leading-relaxed">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-[2px] p-0.5 text-[#514d44]/70 transition-colors hover:text-[#29271f]"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
