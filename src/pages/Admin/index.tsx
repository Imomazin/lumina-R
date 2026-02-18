import { useState } from 'react';
// Icons removed for cleaner UI
import { PageHeader, SectionCard } from '../../components';
import { cn } from '../../utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer' | 'executive';
  department: string;
  lastActive: string;
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  { id: 'USR-001', name: 'John Doe', email: 'john.doe@company.com', role: 'admin', department: 'Risk Management', lastActive: '2024-03-15T10:30:00Z', status: 'active' },
  { id: 'USR-002', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'analyst', department: 'Information Security', lastActive: '2024-03-15T09:45:00Z', status: 'active' },
  { id: 'USR-003', name: 'Michael Torres', email: 'michael.torres@company.com', role: 'analyst', department: 'Treasury', lastActive: '2024-03-14T16:20:00Z', status: 'active' },
  { id: 'USR-004', name: 'Emma Williams', email: 'emma.williams@company.com', role: 'analyst', department: 'Compliance', lastActive: '2024-03-15T08:00:00Z', status: 'active' },
  { id: 'USR-005', name: 'David Park', email: 'david.park@company.com', role: 'viewer', department: 'Operations', lastActive: '2024-03-13T14:30:00Z', status: 'inactive' },
  { id: 'USR-006', name: 'Jennifer Liu', email: 'jennifer.liu@company.com', role: 'executive', department: 'Executive', lastActive: '2024-03-15T07:00:00Z', status: 'active' },
];

const auditLog = [
  { action: 'Risk RSK-001 updated', user: 'Sarah Chen', time: '10:30 AM' },
  { action: 'KRI threshold modified', user: 'John Doe', time: '09:45 AM' },
  { action: 'New user added', user: 'John Doe', time: '09:00 AM' },
  { action: 'Report generated', user: 'Jennifer Liu', time: '08:30 AM' },
  { action: 'Risk appetite reviewed', user: 'Emma Williams', time: 'Yesterday' },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'audit'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Record<number, boolean>>({
    0: true, 1: true, 2: true, 3: false,
  });

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/40';
      case 'analyst':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
      case 'executive':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'viewer':
        return 'bg-navy-600/50 text-navy-300 border-navy-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Administration"
        subtitle="Manage users, settings, and system configuration"
      />

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-navy-700/50 pb-4">
        {[
          { id: 'users', label: 'Users' },
          { id: 'settings', label: 'Settings' },
          { id: 'audit', label: 'Audit Log' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-accent-primary/20 text-accent-primary'
                : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50"
              />
            </div>
            <button className="btn-primary" onClick={() => setShowAddUserModal(true)}>
              + Add User
            </button>
          </div>

          <div className="table-container bg-navy-850/50">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Last Active</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-navy-100">{user.name}</p>
                          <p className="text-xs text-navy-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={cn(
                        'px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
                        getRoleBadge(user.role)
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-navy-300">{user.department}</td>
                    <td className="text-navy-400">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        user.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-navy-600/50 text-navy-400'
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="relative">
                      <button className="p-1 rounded hover:bg-navy-800/50 text-navy-400 text-sm" onClick={() => setShowUserMenu(showUserMenu === user.id ? null : user.id)}>
                        ⋮
                      </button>
                      {showUserMenu === user.id && (
                        <div className="absolute right-0 top-8 z-10 w-40 rounded-lg bg-navy-800 border border-navy-700 shadow-xl py-1">
                          <button className="w-full px-4 py-2 text-left text-sm text-navy-200 hover:bg-navy-700/50" onClick={() => setShowUserMenu(null)}>Edit User</button>
                          <button className="w-full px-4 py-2 text-left text-sm text-navy-200 hover:bg-navy-700/50" onClick={() => setShowUserMenu(null)}>Change Role</button>
                          <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-navy-700/50" onClick={() => setShowUserMenu(null)}>Deactivate</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="General Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  defaultValue="Acme Corporation"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-2">
                  Default Risk Rating Scale
                </label>
                <select className="input">
                  <option>5x5 Matrix</option>
                  <option>4x4 Matrix</option>
                  <option>3x3 Matrix</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-2">
                  Fiscal Year Start
                </label>
                <select className="input">
                  <option>January</option>
                  <option>April</option>
                  <option>July</option>
                  <option>October</option>
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Notification Settings">
            <div className="space-y-4">
              {[
                { label: 'KRI Breach Alerts', desc: 'Notify when KRI breaches threshold' },
                { label: 'Risk Escalation', desc: 'Notify on risk status changes' },
                { label: 'Appetite Warnings', desc: 'Notify when approaching tolerance' },
                { label: 'Weekly Digest', desc: 'Send weekly risk summary' },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-navy-200">{setting.label}</p>
                    <p className="text-xs text-navy-500">{setting.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [i]: !prev[i] }))}
                    className={cn(
                      'w-11 h-6 rounded-full transition-colors relative',
                      notifications[i] ? 'bg-accent-primary' : 'bg-navy-700'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                        notifications[i] ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Security Settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-navy-200">Two-Factor Authentication</p>
                  <p className="text-xs text-navy-500">Require 2FA for all users</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400">
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-navy-200">Session Timeout</p>
                  <p className="text-xs text-navy-500">Auto-logout after inactivity</p>
                </div>
                <span className="text-sm text-navy-300">30 minutes</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-navy-200">Password Policy</p>
                  <p className="text-xs text-navy-500">Minimum requirements</p>
                </div>
                <span className="text-sm text-navy-300">Strong (12+ chars)</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Data Retention">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-2">
                  Audit Log Retention
                </label>
                <select className="input">
                  <option>1 year</option>
                  <option>2 years</option>
                  <option>5 years</option>
                  <option>7 years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-2">
                  Risk History Retention
                </label>
                <select className="input">
                  <option>Indefinite</option>
                  <option>5 years</option>
                  <option>7 years</option>
                  <option>10 years</option>
                </select>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <SectionCard title="Recent Activity">
          <div className="space-y-3">
            {auditLog.map((entry, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/30 border border-navy-700/50"
              >
                <div className="p-2 rounded-lg bg-navy-700/50 text-xs font-bold text-navy-400">
                  •
                </div>
                <div className="flex-1">
                  <p className="text-sm text-navy-200">{entry.action}</p>
                  <p className="text-xs text-navy-500">by {entry.user}</p>
                </div>
                <span className="text-xs text-navy-500">{entry.time}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      {/* Add User Modal */}
      {showAddUserModal && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowAddUserModal(false)}
        >
          <div
            className="glass-card max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-navy-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy-100">Add New User</h2>
                <button onClick={() => setShowAddUserModal(false)} className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50">×</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-300 mb-1">First Name</label>
                  <input type="text" placeholder="First name" className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-300 mb-1">Last Name</label>
                  <input type="text" placeholder="Last name" className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Email</label>
                <input type="email" placeholder="user@company.com" className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-300 mb-1">Role</label>
                  <select className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50">
                    <option>Viewer</option><option>Analyst</option><option>Admin</option><option>Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-300 mb-1">Department</label>
                  <select className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50">
                    <option>Risk Management</option><option>Information Security</option><option>Compliance</option><option>Treasury</option><option>Operations</option><option>Executive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-navy-700/50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setShowAddUserModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowAddUserModal(false)}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
