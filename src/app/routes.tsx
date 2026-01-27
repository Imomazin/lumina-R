import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layout';

// Pages
import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import RiskRegister from '../pages/RiskRegister';
import RiskIndicators from '../pages/RiskIndicators';
import RiskTools from '../pages/RiskTools';
import RiskAppetite from '../pages/RiskAppetite';
import RiskMatrix from '../pages/RiskMatrix';
import CaseStudies from '../pages/CaseStudies';
import Analytics from '../pages/Analytics';
import Alerts from '../pages/Alerts';
import Reports from '../pages/Reports';
import AIAdvisor from '../pages/AIAdvisor';
import Integrations from '../pages/ApiGateway';
import Admin from '../pages/Admin';

export const router = createBrowserRouter([
  // Landing page (no layout)
  {
    path: '/',
    element: <Landing />,
  },
  // Dashboard and app routes (with layout)
  {
    path: '/dashboard',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'risk-register',
        element: <RiskRegister />,
      },
      {
        path: 'risk-indicators',
        element: <RiskIndicators />,
      },
      {
        path: 'risk-tools',
        element: <RiskTools />,
      },
      {
        path: 'risk-appetite',
        element: <RiskAppetite />,
      },
      {
        path: 'risk-matrix',
        element: <RiskMatrix />,
      },
      {
        path: 'case-studies',
        element: <CaseStudies />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'alerts',
        element: <Alerts />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'ai-advisor',
        element: <AIAdvisor />,
      },
      {
        path: 'integrations',
        element: <Integrations />,
      },
      {
        path: 'admin',
        element: <Admin />,
      },
      {
        path: 'admin/*',
        element: <Admin />,
      },
      {
        path: 'tools/*',
        element: <RiskTools />,
      },
    ],
  },
  // Catch-all redirect to landing
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
