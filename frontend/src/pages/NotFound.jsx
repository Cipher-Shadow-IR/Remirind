import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="flex flex-col items-center text-center max-w-sm animate-fade-in">
        <div className="rounded-full bg-muted p-4 mb-6">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-bold tracking-tight text-muted-foreground/30">
          404
        </h1>
        <p className="text-xl font-semibold mt-4">Page not found</p>
        <p className="text-sm text-muted-foreground mt-1">
          The page you&apos;re looking for doesn&apos;t exist or has been moved
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
