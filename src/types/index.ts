// Core type definitions for Lumina-R Risk Intelligence Platform

// Risk severity levels
export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';

// Risk status
export type RiskStatus = 'active' | 'mitigated' | 'monitoring' | 'closed' | 'escalated';

// KRI status
export type KRIStatus = 'green' | 'amber' | 'red';

// Risk categories
export type RiskCategory =
  | 'strategic'
  | 'financial'
  | 'operational'
  | 'compliance'
  | 'cyber'
  | 'reputational';

// Risk entity
export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  severity: RiskSeverity;
  status: RiskStatus;
  probability: number; // 1-5
  impact: number; // 1-5
  riskScore: number; // probability * impact
  owner: string;
  department: string;
  dateIdentified: string;
  lastReviewed: string;
  nextReview: string;
  mitigationPlan?: string;
  controls: string[];
  trend: 'increasing' | 'stable' | 'decreasing';
  tags: string[];
}

// Key Risk Indicator
export interface KRI {
  id: string;
  name: string;
  description: string;
  category: RiskCategory;
  currentValue: number;
  threshold: {
    green: { min: number; max: number };
    amber: { min: number; max: number };
    red: { min: number; max: number };
  };
  unit: string;
  status: KRIStatus;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  lastUpdated: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  owner: string;
  linkedRisks: string[];
}

// Risk Appetite
export interface RiskAppetite {
  category: RiskCategory;
  statement: string;
  currentLevel: number; // 0-100
  toleranceMin: number;
  toleranceMax: number;
  status: 'within' | 'approaching' | 'breached';
  rationale: string[];
  lastReviewed: string;
  approvedBy: string;
}

// Case Study
export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  outcomes: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  imageUrl?: string;
  tags: string[];
  publishedDate: string;
}

// Risk Tool
export interface RiskTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'analysis' | 'assessment' | 'monitoring' | 'reporting' | 'compliance';
  route: string;
  isNew?: boolean;
  isPremium?: boolean;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalRisks: number;
  totalRisksChange: number;
  highPriorityRisks: number;
  highPriorityChange: number;
  krisBreached: number;
  krisBreachedChange: number;
  outsideAppetite: number;
  outsideAppetiteChange: number;
}

// Alert/Notification
export interface Alert {
  id: string;
  type: 'risk' | 'kri' | 'appetite' | 'system';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer' | 'executive';
  avatar?: string;
  department: string;
  lastActive: string;
}

// Navigation item
export interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: number;
  children?: NavItem[];
}

// Chart data point
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Risk matrix cell
export interface MatrixCell {
  probability: number;
  impact: number;
  count: number;
  risks: Risk[];
  severity: RiskSeverity;
}

// Integration
export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: string;
}
