import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';

function AccessDenied() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <Card>
        <h1 className="text-lg font-semibold text-white">Access Denied</h1>
        <p className="mt-2 text-sm text-muted">You do not have permission to access the Admin section.</p>
      </Card>
    </div>
  );
}

export function AdminRoute() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <AccessDenied />;
  return <Outlet />;
}