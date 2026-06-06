import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './ui/Button';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-50 w-full max-w-sm animate-fade-in rounded-xl border bg-card p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-destructive/10 p-2.5 shrink-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onCancel}
                className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} loading={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
