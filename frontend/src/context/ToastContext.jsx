import { createContext, useState, useCallback, useRef, useContext } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

const typeStyles = {
  success: {
    border: 'border-green-200',
    bg: 'bg-green-50',
    icon: CheckCircle2,
    iconColor: 'text-green-600',
  },
  error: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    icon: AlertCircle,
    iconColor: 'text-red-600',
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
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => {
          const style = typeStyles[toast.type] || typeStyles.success;
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 rounded-lg border ${style.border} ${style.bg} p-4 shadow-lg animate-fade-in`}
            >
              <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${style.iconColor}`} />
              <p className="text-sm font-medium text-foreground flex-1">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-md p-1 text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
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
