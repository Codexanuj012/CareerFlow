import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
      <span className="text-6xl font-bold text-primary">404</span>
      <h1 className="text-xl font-semibold text-white">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
