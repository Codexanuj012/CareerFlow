import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingState } from '../components/ui/LoadingState';

const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Contacts = lazy(() => import('../pages/Contacts'));
const ContactDetails = lazy(() => import('../pages/ContactDetails'));
const Compose = lazy(() => import('../pages/Compose'));
const Outreach = lazy(() => import('../pages/Outreach'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Integrations = lazy(() => import('../pages/Integrations'));
const Settings = lazy(() => import('../pages/Settings'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingState label="Loading CareerFlow…" />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<ContactDetails />} />
            <Route path="/compose" element={<Compose />} />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            
          </Route>
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
