import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  Wrench,
  PieChart,
  Bell,
  BarChart3,
  FileText,
  Bot,
  Plug,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  children?: { to: string; label: string }[];
}

function NavItem({ to, icon, label, badge, children }: NavItemProps) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
  const hasChildren = children && children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            isActive
              ? 'bg-accent-primary/10 text-accent-primary'
              : 'text-navy-400 hover:bg-navy-800/50 hover:text-navy-200'
          )}
        >
          <div className="flex items-center gap-3">
            <span className="w-5 h-5">{icon}</span>
            <span>{label}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {isExpanded && (
          <div className="mt-1 ml-8 space-y-1">
            {children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-2 rounded-lg text-sm transition-all duration-200',
                    isActive
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-navy-400 hover:bg-navy-800/50 hover:text-navy-200'
                  )
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-accent-primary/10 text-accent-primary border-l-2 border-accent-primary -ml-[2px] pl-[14px]'
            : 'text-navy-400 hover:bg-navy-800/50 hover:text-navy-200'
        )
      }
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-risk-critical/20 text-risk-critical">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-navy-900/80 backdrop-blur-xl border-r border-navy-700/50 flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-navy-700/50">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-navy-100">Lumina-R</h1>
          <p className="text-2xs text-navy-500 -mt-0.5">Risk Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* Main Section */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-2xs font-semibold text-navy-600 uppercase tracking-wider">
            Main
          </p>
          <NavItem to="/" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
          <NavItem
            to="/risk-register"
            icon={<ClipboardList className="w-5 h-5" />}
            label="Risk Register"
          />
          <NavItem
            to="/risk-indicators"
            icon={<Activity className="w-5 h-5" />}
            label="Risk Indicators"
            badge={1}
          />
          <NavItem
            to="/risk-appetite"
            icon={<PieChart className="w-5 h-5" />}
            label="Risk Appetite"
          />
          <NavItem
            to="/risk-matrix"
            icon={<BarChart3 className="w-5 h-5" />}
            label="Risk Matrix"
          />
        </div>

        {/* Tools Section */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-2xs font-semibold text-navy-600 uppercase tracking-wider">
            Tools
          </p>
          <NavItem
            to="/risk-tools"
            icon={<Wrench className="w-5 h-5" />}
            label="Risk Tools"
          />
          <NavItem
            to="/analytics"
            icon={<BarChart3 className="w-5 h-5" />}
            label="Analytics"
          />
          <NavItem
            to="/case-studies"
            icon={<FileText className="w-5 h-5" />}
            label="Case Studies"
          />
        </div>

        {/* Intelligence Section */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-2xs font-semibold text-navy-600 uppercase tracking-wider">
            Intelligence
          </p>
          <NavItem
            to="/alerts"
            icon={<Bell className="w-5 h-5" />}
            label="Alerts"
            badge={3}
          />
          <NavItem
            to="/reports"
            icon={<FileText className="w-5 h-5" />}
            label="Reports"
          />
          <NavItem
            to="/ai-advisor"
            icon={<Bot className="w-5 h-5" />}
            label="AI Risk Advisor"
          />
        </div>

        {/* System Section */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-2xs font-semibold text-navy-600 uppercase tracking-wider">
            System
          </p>
          <NavItem
            to="/integrations"
            icon={<Plug className="w-5 h-5" />}
            label="API Gateway"
          />
          <NavItem
            to="/admin"
            icon={<Settings className="w-5 h-5" />}
            label="Admin"
            children={[
              { to: '/admin/users', label: 'Users' },
              { to: '/admin/settings', label: 'Settings' },
              { to: '/admin/audit', label: 'Audit Log' },
            ]}
          />
        </div>
      </nav>

      {/* AI Advisor Quick Access */}
      <div className="p-4 border-t border-navy-700/50">
        <div className="p-3 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-medium text-navy-100">AI Insights</span>
          </div>
          <p className="text-xs text-navy-400 mb-3">
            3 new risk patterns detected requiring attention.
          </p>
          <NavLink
            to="/ai-advisor"
            className="block w-full text-center py-2 px-3 rounded-lg bg-accent-primary/20 text-accent-primary text-sm font-medium hover:bg-accent-primary/30 transition-colors"
          >
            View Analysis
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
