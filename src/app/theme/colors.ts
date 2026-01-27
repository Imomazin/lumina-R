// Color system for Lumina-R Risk Intelligence Platform
// Deep navy base with strategic use of red for risk escalation

export const colors = {
  // Primary brand - Deep navy/midnight (Palantir-inspired)
  navy: {
    950: '#0a0d14',  // Deepest - main background
    900: '#0d1117',  // Primary background
    850: '#111827',  // Card backgrounds
    800: '#151c28',  // Elevated surfaces
    700: '#1e293b',  // Borders, dividers
    600: '#334155',  // Subtle borders
    500: '#475569',  // Muted text
    400: '#64748b',  // Secondary text
    300: '#94a3b8',  // Primary text
    200: '#cbd5e1',  // Emphasized text
    100: '#e2e8f0',  // High contrast text
    50: '#f8fafc',   // Maximum contrast
  },

  // Risk severity colors (Virgin Atlantic red accent)
  risk: {
    critical: {
      bg: 'rgba(220, 38, 38, 0.15)',
      border: 'rgba(220, 38, 38, 0.4)',
      text: '#fca5a5',
      solid: '#dc2626',
    },
    high: {
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.4)',
      text: '#fca5a5',
      solid: '#ef4444',
    },
    medium: {
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.4)',
      text: '#fcd34d',
      solid: '#f59e0b',
    },
    low: {
      bg: 'rgba(34, 197, 94, 0.15)',
      border: 'rgba(34, 197, 94, 0.4)',
      text: '#86efac',
      solid: '#22c55e',
    },
  },

  // Status colors
  status: {
    success: {
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.4)',
      text: '#6ee7b7',
      solid: '#10b981',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.4)',
      text: '#fcd34d',
      solid: '#f59e0b',
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.4)',
      text: '#fca5a5',
      solid: '#ef4444',
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.15)',
      border: 'rgba(59, 130, 246, 0.4)',
      text: '#93c5fd',
      solid: '#3b82f6',
    },
  },

  // Accent colors for charts and interactive elements
  accent: {
    primary: '#6366f1',    // Indigo
    secondary: '#8b5cf6',  // Violet
    tertiary: '#ec4899',   // Pink
    cyan: '#06b6d4',       // Cyan
    emerald: '#10b981',    // Emerald
    amber: '#f59e0b',      // Amber
  },

  // Chart palette - ordered for visual harmony
  chart: [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#3b82f6', // Blue
  ],

  // Gradient definitions
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    accent: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    danger: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
    dark: 'linear-gradient(180deg, #0d1117 0%, #151c28 100%)',
    card: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
    glow: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
  },
} as const;

export type Colors = typeof colors;

// Helper function to get risk color by severity
export const getRiskColor = (severity: 'critical' | 'high' | 'medium' | 'low') => {
  return colors.risk[severity];
};

// Helper function to get status color
export const getStatusColor = (status: 'success' | 'warning' | 'danger' | 'info') => {
  return colors.status[status];
};
