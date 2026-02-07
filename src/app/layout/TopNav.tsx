import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../../utils';

// Page-specific tabs configuration
const pageTabs: Record<string, { label: string; path: string }[]> = {
  '/dashboard': [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Risk Tools', path: '/dashboard/risk-tools' },
    { label: 'KRIs', path: '/dashboard/risk-indicators' },
    { label: 'Appetite', path: '/dashboard/risk-appetite' },
    { label: 'Case Studies', path: '/dashboard/case-studies' },
    { label: 'Matrix', path: '/dashboard/risk-matrix' },
  ],
  '/dashboard/risk-register': [
    { label: 'All Risks', path: '/dashboard/risk-register' },
    { label: 'Active', path: '/dashboard/risk-register?status=active' },
    { label: 'Escalated', path: '/dashboard/risk-register?status=escalated' },
    { label: 'Monitoring', path: '/dashboard/risk-register?status=monitoring' },
  ],
  '/dashboard/risk-indicators': [
    { label: 'All KRIs', path: '/dashboard/risk-indicators' },
    { label: 'Financial', path: '/dashboard/risk-indicators?category=financial' },
    { label: 'Operational', path: '/dashboard/risk-indicators?category=operational' },
    { label: 'Compliance', path: '/dashboard/risk-indicators?category=compliance' },
    { label: 'Cyber', path: '/dashboard/risk-indicators?category=cyber' },
  ],
  '/dashboard/analytics': [
    { label: 'Overview', path: '/dashboard/analytics' },
    { label: 'Trends', path: '/dashboard/analytics/trends' },
    { label: 'Forecasts', path: '/dashboard/analytics/forecasts' },
  ],
};

export function TopNav() {
  const location = useLocation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Get the base path for tab matching - handle /dashboard prefix
  const pathParts = location.pathname.split('/').filter(Boolean);
  const basePath = pathParts.length > 1
    ? '/' + pathParts.slice(0, 2).join('/')
    : '/dashboard';
  const currentTabs = pageTabs[basePath] || pageTabs['/dashboard'];

  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'KRI Breach Alert',
      message: 'Vulnerability Remediation KRI has breached red threshold',
      time: '5 min ago',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Risk Appetite Warning',
      message: 'Cyber risk category approaching tolerance limit',
      time: '1 hour ago',
    },
    {
      id: 3,
      type: 'info',
      title: 'New Risk Identified',
      message: 'AI advisor has flagged a potential emerging risk',
      time: '3 hours ago',
    },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-navy-900/80 backdrop-blur-xl border-b border-navy-700/50 z-20">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Contextual Tabs */}
        <nav className="flex items-center gap-1">
          {currentTabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                location.pathname === tab.path || (tab.path === '/dashboard' && location.pathname === '/dashboard')
                  ? 'bg-navy-800/80 text-navy-100'
                  : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/40'
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <div
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200',
                isSearchFocused
                  ? 'bg-navy-800 border-accent-primary/50 w-80'
                  : 'bg-navy-800/50 border-navy-700 w-64 hover:border-navy-600'
              )}
            >
              <Search className="w-4 h-4 text-navy-500" />
              <input
                type="text"
                placeholder="Search risks, reports, or ask AI..."
                className="flex-1 bg-transparent text-sm text-navy-100 placeholder-navy-500 focus:outline-none"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-2xs font-mono text-navy-500 bg-navy-700/50 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-risk-critical" />
            </button>

            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-navy-850 border border-navy-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-navy-700">
                    <h3 className="text-sm font-semibold text-navy-100">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 border-b border-navy-700/50 hover:bg-navy-800/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full mt-2',
                              notification.type === 'critical' && 'bg-risk-critical',
                              notification.type === 'warning' && 'bg-risk-medium',
                              notification.type === 'info' && 'bg-status-info'
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-navy-100">
                              {notification.title}
                            </p>
                            <p className="text-xs text-navy-400 mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-2xs text-navy-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-navy-700 bg-navy-800/50">
                    <Link
                      to="/dashboard/alerts"
                      className="text-sm text-accent-primary hover:text-accent-primary/80 font-medium"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      View all alerts →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Settings */}
          <Link
            to="/dashboard/admin"
            className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-navy-800/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                <span className="text-sm font-semibold text-white">JD</span>
              </div>
              <ChevronDown className="w-4 h-4 text-navy-400" />
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-navy-850 border border-navy-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-navy-700">
                    <p className="text-sm font-medium text-navy-100">John Doe</p>
                    <p className="text-xs text-navy-400">Chief Risk Officer</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-navy-300 hover:bg-navy-800/50 transition-colors">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <Link
                      to="/dashboard/admin"
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-navy-300 hover:bg-navy-800/50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-navy-300 hover:bg-navy-800/50 transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      Help & Support
                    </button>
                  </div>
                  <div className="border-t border-navy-700 py-2">
                    <Link
                      to="/"
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-risk-critical hover:bg-navy-800/50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
