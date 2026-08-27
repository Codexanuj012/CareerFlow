import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useGmail } from '../../hooks/useGmail';

export function QuickActions() {
  const navigate = useNavigate();
  const { connected } = useGmail();

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => navigate('/compose')}>+ Compose Email</Button>
      <Button variant="secondary" onClick={() => navigate('/contacts?add=1')}>Add Contact</Button>
      <Button variant="secondary" onClick={() => navigate('/contacts')}>View Contacts</Button>
      <Button variant="secondary" onClick={() => navigate('/outreach')}>View Outreach</Button>
      {!connected && (
        <Button variant="secondary" onClick={() => navigate('/integrations')}>Connect Gmail</Button>
      )}
    </div>
  );
}
