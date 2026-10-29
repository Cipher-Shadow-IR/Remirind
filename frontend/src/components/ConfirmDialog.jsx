import { useEffect } from 'react';
import { AlertTriangle, HelpCircle, X } from 'lucide-react';
import Button from './ui/Button';

export default function ConfirmDialog({
  open,
  isOpen,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  confirmVariant,
  variant,
  onConfirm,
  onCancel,
  loading,
}) {
  const isVisible = open !== undefined ? open : isOpen;

  useEffect(() => {
    if (!isVisible) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onCancel]);

  if (!isVisible) return null;

  const resolvedVariant =
    variant ||
    confirmVariant ||
    (title?.toLowerCase().includes('delete') ? 'destructive' : 'primary');
  const resolvedConfirmText =
    confirmText || (resolvedVariant === 'destructive' ? 'Delete' : 'Confirm');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#29271f]/40 backdrop-blur-[2px] transition-opacity"
        onClick={loading ? undefined : onCancel}
      />
      <div className="relative z-50 w-full max-w-md animate-fade-in rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-6 shadow-[0_8px_30px_rgba(41,39,31,0.12)]">
        <div className="flex items-start gap-4">
          <div
            className={`rounded-[2px] p-2 shrink-0 border ${
              resolvedVariant === 'destructive'
                ? 'border-[#8b2b2b]/30 bg-[#8b2b2b]/10 text-[#8b2b2b]'
                : 'border-[#8b713a]/30 bg-[#8b713a]/10 text-[#8b713a]'
            }`}
          >
            {resolvedVariant === 'destructive' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <HelpCircle className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 border-b border-[#e7e0d3] pb-2">
              <h2 className="font-serif text-lg font-normal tracking-tight text-[#29271f]">
                {title}
              </h2>
              <button
                onClick={onCancel}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-[2px] p-1 text-[#514d44] transition-colors hover:text-[#29271f] shrink-0"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#514d44] mt-3 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 border-t border-[#e7e0d3] pt-4">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={resolvedVariant === 'destructive' ? 'destructive' : 'primary'}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {loading ? 'Processing...' : resolvedConfirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
