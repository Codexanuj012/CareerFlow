import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GmailProvider } from './context/GmailContext';
import { ToastProvider } from './components/ui/Toast';
import { AppRoutes } from './routes/AppRoutes';
import { useSeedDemoData } from './hooks/useSeedDemoData';


function SeedGate({ children }: { children: React.ReactNode }) {
  useSeedDemoData();
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <GmailProvider>
            <SeedGate>
              <AppRoutes />
            </SeedGate>
          </GmailProvider>
        </AuthProvider>
      </ToastProvider>
      
    </BrowserRouter>
  );
}
