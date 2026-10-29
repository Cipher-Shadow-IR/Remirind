import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-label="Loading content">
      <div className="animate-spin text-[#8b713a]">
        <Loader2 className="h-6 w-6 stroke-[1.5]" />
      </div>
    </div>
  );
}
