import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f4ec] p-4 font-sans text-[#29271f]">
      <div className="flex flex-col items-center text-center max-w-sm animate-fade-in border border-[#d4ccbd] bg-[#fcfaf5] p-8 rounded-[3px] shadow-[0_4px_20px_rgba(41,39,31,0.06)]">
        <div className="rounded-[2px] border border-[#d4ccbd] bg-[#f7f4ec] p-3 mb-4 text-[#8b713a]">
          <FileQuestion className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-5xl font-normal text-[#29271f] tracking-tight">
          404
        </h1>
        <p className="font-serif italic text-lg text-[#8b713a] mt-2">
          Page Not Found
        </p>
        <p className="text-xs text-[#514d44] mt-2 font-sans leading-relaxed">
          The requested document or resource does not exist within this registry.
        </p>
        <Link to="/dashboard" className="mt-6">
          <Button size="default">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
