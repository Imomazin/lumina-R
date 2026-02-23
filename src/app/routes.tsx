import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layout';

// Pages
import Landing from '../pages/Landing';
import RiskLanding from '../pages/RiskLanding';
import Pricing from '../pages/Pricing';
import Dashboard from '../pages/Dashboard';
import RiskRegister from '../pages/RiskRegister';
import RiskIndicators from '../pages/RiskIndicators';
import RiskTools from '../pages/RiskTools';
import RiskAppetite from '../pages/RiskAppetite';
import RiskMatrix from '../pages/RiskMatrix';
import RiskWorkspace from '../pages/RiskWorkspace';
import MonteCarloSimulation from '../pages/MonteCarloSimulation';
import BowTieAnalysis from '../pages/BowTieAnalysis';
import CaseStudies from '../pages/CaseStudies';
import Analytics from '../pages/Analytics';
import Alerts from '../pages/Alerts';
import Reports from '../pages/Reports';
import AIAdvisor from '../pages/AIAdvisor';
import Integrations from '../pages/ApiGateway';
import Admin from '../pages/Admin';
import StrategyRisk from '../pages/StrategyRisk';
import ScenarioAnalysis from '../pages/ScenarioAnalysis';
import ControlAssessment from '../pages/ControlAssessment';
import LossEvents from '../pages/LossEvents';
import ComplianceTracker from '../pages/ComplianceTracker';

export const router = createBrowserRouter([
  // Landing page (no layout)
  {
    path: '/',
    element: <Landing />,
  },
  // Risk Landing page (no layout)
  {
    path: '/risk',
    element: <RiskLanding />,
  },
  // Pricing page (no layout)
  {
    path: '/pricing',
    element: <Pricing />,
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
        path: 'risk-workspace',
        element: <RiskWorkspace />,
      },
      {
        path: 'strategy-risk',
        element: <StrategyRisk />,
      },
      {
        path: 'tools/monte-carlo',
        element: <MonteCarloSimulation />,
      },
      {
        path: 'tools/bowtie',
        element: <BowTieAnalysis />,
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
        path: 'tools/scenario',
        element: <ScenarioAnalysis />,
      },
      {
        path: 'tools/controls',
        element: <ControlAssessment />,
      },
      {
        path: 'tools/loss-events',
        element: <LossEvents />,
      },
      {
        path: 'tools/compliance',
        element: <ComplianceTracker />,
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
