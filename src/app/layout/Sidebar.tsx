import { NavLink, useLocation, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils';

interface NavItemProps {
  to: string;
  label: string;
  badge?: number;
  children?: { to: string; label: string }[];
}

function NavItem({ to, label, badge, children }: NavItemProps) {
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
          <span>{label}</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {isExpanded && (
          <div className="mt-1 ml-4 space-y-1">
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
          'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-accent-primary/10 text-accent-primary border-l-2 border-accent-primary -ml-[2px] pl-[14px]'
            : 'text-navy-400 hover:bg-navy-800/50 hover:text-navy-200'
        )
      }
    >
      <span>{label}</span>
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
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--bg-secondary)] backdrop-blur-xl border-r border-[var(--border-primary)] flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--border-primary)]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
          <span className="text-white font-bold text-sm">LR</span>
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
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/dashboard/risk-register" label="Risk Register" />
          <NavItem to="/dashboard/risk-indicators" label="Risk Indicators" badge={1} />
          <NavItem to="/dashboard/risk-appetite" label="Risk Appetite" />
          <NavItem to="/dashboard/risk-matrix" label="Risk Matrix" />
          <NavItem to="/dashboard/risk-workspace" label="Risk Workspace" />
        </div>

        {/* Strategic Section */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-2xs font-semibold text-navy-600 uppercase tracking-wider">
            Strategic
          </p>
          <NavItem to="/dashboard/strategic-register" label="Strategic Register" />
          <NavItem to="/dashboard/strategic-portfolio" label="Portfolio Dashboard" />
        </div>

        {/* Tools Section */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-2xs font-semibold text-navy-600 uppercase tracking-wider">
            Tools
          </p>
          <NavItem to="/dashboard/risk-tools" label="Risk Tools" />
          <NavItem to="/dashboard/analytics" label="Analytics" />
          <NavItem to="/dashboard/case-studies" label="Case Studies" />
        </div>

        {/* Intelligence Section */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-2xs font-semibold text-navy-600 uppercase tracking-wider">
            Intelligence
          </p>
          <NavItem to="/dashboard/alerts" label="Alerts" badge={3} />
          <NavItem to="/dashboard/reports" label="Reports" />
          <NavItem to="/dashboard/ai-advisor" label="AI Risk Advisor" />
        </div>

        {/* System Section */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-2xs font-semibold text-navy-600 uppercase tracking-wider">
            System
          </p>
          <NavItem to="/dashboard/integrations" label="API Gateway" />
          <NavItem
            to="/dashboard/admin"
            label="Admin"
            children={[
              { to: '/dashboard/admin/users', label: 'Users' },
              { to: '/dashboard/admin/settings', label: 'Settings' },
              { to: '/dashboard/admin/audit', label: 'Audit Log' },
            ]}
          />
        </div>
      </nav>

      {/* Bottom Section - Pricing Link */}
      <div className="p-4 border-t border-[var(--border-primary)]">
        <Link
          to="/pricing"
          className="block w-full text-center py-3 px-4 rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          View Pricing Plans
        </Link>
        <NavLink
          to="/dashboard/ai-advisor"
          className="block w-full text-center py-2 px-3 mt-2 rounded-lg bg-navy-800/50 text-navy-300 text-sm hover:bg-navy-800 transition-colors"
        >
          AI Risk Advisor
        </NavLink>
      </div>
    </aside>
  );
}
