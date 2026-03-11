// Enterprise Controls Dataset - 150 Controls matching user data structure
export interface EnterpriseControl {
  controlId: string;
  controlName: string;
  controlType: 'Preventive' | 'Detective' | 'Corrective';
  automationLevel: 'Manual' | 'Semi Automated' | 'Automated';
  owner: string;
  mappedRiskIds: number[];
  effectivenessScore?: number;
  lastTestedDate?: string;
  testFrequency?: 'Monthly' | 'Quarterly' | 'Annually';
}

export const enterpriseControls: EnterpriseControl[] = [
  // ============================================================================
  // ORIGINAL CONTROLS (C1-C25) - PRESERVED EXACTLY
  // ============================================================================
  { controlId: 'C1', controlName: 'Revenue Concentration Monitoring Dashboard', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'COO', mappedRiskIds: [9, 19, 12], effectivenessScore: 72, lastTestedDate: '2024-12-15', testFrequency: 'Monthly' },
  { controlId: 'C2', controlName: 'Infrastructure Health Monitoring System', controlType: 'Preventive', automationLevel: 'Automated', owner: 'COO', mappedRiskIds: [6, 19, 24], effectivenessScore: 85, lastTestedDate: '2024-12-01', testFrequency: 'Monthly' },
  { controlId: 'C3', controlName: 'Competitive Intelligence Analysis', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [28, 2, 4], effectivenessScore: 68, lastTestedDate: '2024-11-20', testFrequency: 'Quarterly' },
  { controlId: 'C4', controlName: 'Vendor Risk Assessment Framework', controlType: 'Preventive', automationLevel: 'Automated', owner: 'HR Director', mappedRiskIds: [27, 24, 2], effectivenessScore: 78, lastTestedDate: '2024-10-15', testFrequency: 'Quarterly' },
  { controlId: 'C5', controlName: 'Data Privacy Impact Assessments', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'Head of AI', mappedRiskIds: [19, 1, 25], effectivenessScore: 82, lastTestedDate: '2024-12-10', testFrequency: 'Monthly' },
  { controlId: 'C6', controlName: 'Cloud Service SLA Monitoring', controlType: 'Preventive', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [16, 6, 24], effectivenessScore: 91, lastTestedDate: '2024-12-20', testFrequency: 'Monthly' },
  { controlId: 'C7', controlName: 'Succession Planning Program', controlType: 'Preventive', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [18, 8, 28], effectivenessScore: 65, lastTestedDate: '2024-09-01', testFrequency: 'Annually' },
  { controlId: 'C8', controlName: 'AML Transaction Monitoring System', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [3, 7, 30], effectivenessScore: 88, lastTestedDate: '2024-12-15', testFrequency: 'Monthly' },
  { controlId: 'C9', controlName: 'Social Media Monitoring & Response', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [1, 5, 9], effectivenessScore: 76, lastTestedDate: '2024-11-30', testFrequency: 'Monthly' },
  { controlId: 'C10', controlName: 'AI Model Bias Testing Protocol', controlType: 'Preventive', automationLevel: 'Manual', owner: 'Head of AI', mappedRiskIds: [18, 14, 23], effectivenessScore: 71, lastTestedDate: '2024-12-05', testFrequency: 'Quarterly' },
  { controlId: 'C11', controlName: 'Employee Retention Program', controlType: 'Preventive', automationLevel: 'Manual', owner: 'CISO', mappedRiskIds: [21, 12, 10], effectivenessScore: 69, lastTestedDate: '2024-10-01', testFrequency: 'Quarterly' },
  { controlId: 'C12', controlName: 'Endpoint Detection & Response', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'Head of AI', mappedRiskIds: [15, 30, 16], effectivenessScore: 86, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },
  { controlId: 'C13', controlName: 'Workplace Safety Incident Response', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [29, 6, 5], effectivenessScore: 74, lastTestedDate: '2024-11-15', testFrequency: 'Monthly' },
  { controlId: 'C14', controlName: 'Data Quality Validation Rules', controlType: 'Detective', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [5, 22, 24], effectivenessScore: 67, lastTestedDate: '2024-12-01', testFrequency: 'Monthly' },
  { controlId: 'C15', controlName: 'Change Management Advisory Board', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'CISO', mappedRiskIds: [18, 5, 19], effectivenessScore: 79, lastTestedDate: '2024-12-10', testFrequency: 'Monthly' },
  { controlId: 'C16', controlName: 'Vendor Financial Health Screening', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [17, 8, 6], effectivenessScore: 83, lastTestedDate: '2024-11-25', testFrequency: 'Quarterly' },
  { controlId: 'C17', controlName: 'SOX Compliance Testing Program', controlType: 'Detective', automationLevel: 'Automated', owner: 'HR Director', mappedRiskIds: [21, 11, 14], effectivenessScore: 92, lastTestedDate: '2024-12-20', testFrequency: 'Quarterly' },
  { controlId: 'C18', controlName: 'Product Quality Assurance Testing', controlType: 'Detective', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [5, 11, 8], effectivenessScore: 73, lastTestedDate: '2024-12-12', testFrequency: 'Monthly' },
  { controlId: 'C19', controlName: 'FX Hedging Strategy Review', controlType: 'Corrective', automationLevel: 'Manual', owner: 'HR Director', mappedRiskIds: [17, 4, 13], effectivenessScore: 81, lastTestedDate: '2024-11-01', testFrequency: 'Monthly' },
  { controlId: 'C20', controlName: 'Third Party Security Assessments', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [23, 28, 8], effectivenessScore: 77, lastTestedDate: '2024-12-08', testFrequency: 'Quarterly' },
  { controlId: 'C21', controlName: 'Credit Risk Scoring Model', controlType: 'Corrective', automationLevel: 'Manual', owner: 'HR Director', mappedRiskIds: [10, 25, 2], effectivenessScore: 84, lastTestedDate: '2024-12-15', testFrequency: 'Monthly' },
  { controlId: 'C22', controlName: 'M&A Integration PMO', controlType: 'Corrective', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [14, 18, 24], effectivenessScore: 70, lastTestedDate: '2024-10-20', testFrequency: 'Monthly' },
  { controlId: 'C23', controlName: 'ESG Reporting Framework', controlType: 'Corrective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [28, 10, 3], effectivenessScore: 66, lastTestedDate: '2024-11-30', testFrequency: 'Quarterly' },
  { controlId: 'C24', controlName: 'Sanctions Screening System', controlType: 'Detective', automationLevel: 'Manual', owner: 'CRO', mappedRiskIds: [7, 3, 15], effectivenessScore: 89, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },
  { controlId: 'C25', controlName: 'Ethics Hotline & Investigation Process', controlType: 'Preventive', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [19, 24, 11], effectivenessScore: 75, lastTestedDate: '2024-12-01', testFrequency: 'Quarterly' },

  // ============================================================================
  // FINANCIAL CONTROLS (C26-C50)
  // ============================================================================
  { controlId: 'C26', controlName: 'Treasury Cash Position Monitoring', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [31, 45, 67, 89], effectivenessScore: 88, lastTestedDate: '2024-12-28', testFrequency: 'Monthly' },
  { controlId: 'C27', controlName: 'Investment Policy Compliance Checker', controlType: 'Detective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [32, 56, 78], effectivenessScore: 91, lastTestedDate: '2024-12-20', testFrequency: 'Monthly' },
  { controlId: 'C28', controlName: 'Credit Approval Workflow System', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [33, 47, 112, 145], effectivenessScore: 85, lastTestedDate: '2024-11-15', testFrequency: 'Quarterly' },
  { controlId: 'C29', controlName: 'Loan Loss Provisioning Model', controlType: 'Detective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [34, 58, 91], effectivenessScore: 79, lastTestedDate: '2024-12-10', testFrequency: 'Quarterly' },
  { controlId: 'C30', controlName: 'FX Exposure Limit Monitoring', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [35, 67, 134, 178], effectivenessScore: 92, lastTestedDate: '2025-01-05', testFrequency: 'Monthly' },
  { controlId: 'C31', controlName: 'Daily Liquidity Position Dashboard', controlType: 'Detective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [36, 89, 156], effectivenessScore: 94, lastTestedDate: '2025-01-10', testFrequency: 'Monthly' },
  { controlId: 'C32', controlName: 'Capital Adequacy Ratio Tracking', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [37, 78, 123, 167], effectivenessScore: 87, lastTestedDate: '2024-12-01', testFrequency: 'Monthly' },
  { controlId: 'C33', controlName: 'Budget Variance Alert System', controlType: 'Detective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [38, 91, 145], effectivenessScore: 83, lastTestedDate: '2024-11-28', testFrequency: 'Monthly' },
  { controlId: 'C34', controlName: 'Revenue Recognition Policy Engine', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [39, 112, 156, 189], effectivenessScore: 90, lastTestedDate: '2024-12-15', testFrequency: 'Quarterly' },
  { controlId: 'C35', controlName: 'Expense Approval Workflow', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CFO', mappedRiskIds: [40, 78], effectivenessScore: 76, lastTestedDate: '2024-10-20', testFrequency: 'Monthly' },
  { controlId: 'C36', controlName: 'Invoice Three-Way Match Validation', controlType: 'Detective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [41, 134, 167], effectivenessScore: 89, lastTestedDate: '2024-12-22', testFrequency: 'Monthly' },
  { controlId: 'C37', controlName: 'Payment Authorization Matrix', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CFO', mappedRiskIds: [42, 89, 145, 178], effectivenessScore: 86, lastTestedDate: '2024-11-30', testFrequency: 'Monthly' },
  { controlId: 'C38', controlName: 'Bank Reconciliation Automation', controlType: 'Detective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [43, 91, 156], effectivenessScore: 93, lastTestedDate: '2025-01-08', testFrequency: 'Monthly' },
  { controlId: 'C39', controlName: 'Financial Close Checklist System', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'CFO', mappedRiskIds: [44, 112, 189], effectivenessScore: 81, lastTestedDate: '2024-12-31', testFrequency: 'Monthly' },
  { controlId: 'C40', controlName: 'Intercompany Transaction Reconciliation', controlType: 'Detective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [45, 78, 134, 167], effectivenessScore: 84, lastTestedDate: '2024-12-18', testFrequency: 'Quarterly' },
  { controlId: 'C41', controlName: 'Accounts Receivable Aging Monitor', controlType: 'Detective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [46, 91], effectivenessScore: 78, lastTestedDate: '2024-11-25', testFrequency: 'Monthly' },
  { controlId: 'C42', controlName: 'Working Capital Optimization Control', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CFO', mappedRiskIds: [47, 145, 178], effectivenessScore: 72, lastTestedDate: '2024-10-15', testFrequency: 'Quarterly' },
  { controlId: 'C43', controlName: 'Fixed Asset Capitalization Rules', controlType: 'Preventive', automationLevel: 'Manual', owner: 'CFO', mappedRiskIds: [48, 112, 156], effectivenessScore: 69, lastTestedDate: '2024-09-20', testFrequency: 'Annually' },
  { controlId: 'C44', controlName: 'Derivative Valuation Controls', controlType: 'Detective', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [49, 78, 134, 189], effectivenessScore: 88, lastTestedDate: '2024-12-12', testFrequency: 'Monthly' },
  { controlId: 'C45', controlName: 'Interest Rate Risk Hedging Review', controlType: 'Corrective', automationLevel: 'Manual', owner: 'CFO', mappedRiskIds: [50, 91, 167], effectivenessScore: 74, lastTestedDate: '2024-11-05', testFrequency: 'Quarterly' },
  { controlId: 'C46', controlName: 'Tax Provision Calculation Engine', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [51, 145, 178], effectivenessScore: 85, lastTestedDate: '2024-12-28', testFrequency: 'Quarterly' },
  { controlId: 'C47', controlName: 'Transfer Pricing Documentation Control', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CFO', mappedRiskIds: [52, 112, 156, 189], effectivenessScore: 77, lastTestedDate: '2024-10-30', testFrequency: 'Annually' },
  { controlId: 'C48', controlName: 'Lease Accounting Compliance Monitor', controlType: 'Detective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [53, 78, 134], effectivenessScore: 82, lastTestedDate: '2024-12-05', testFrequency: 'Quarterly' },
  { controlId: 'C49', controlName: 'Goodwill Impairment Testing', controlType: 'Detective', automationLevel: 'Manual', owner: 'CFO', mappedRiskIds: [54, 91, 167], effectivenessScore: 68, lastTestedDate: '2024-06-15', testFrequency: 'Annually' },
  { controlId: 'C50', controlName: 'Debt Covenant Compliance Tracker', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [55, 145, 178, 189], effectivenessScore: 91, lastTestedDate: '2025-01-12', testFrequency: 'Monthly' },

  // ============================================================================
  // OPERATIONAL CONTROLS (C51-C80)
  // ============================================================================
  { controlId: 'C51', controlName: 'Change Management Approval Workflow', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'COO', mappedRiskIds: [56, 102, 134, 167], effectivenessScore: 84, lastTestedDate: '2024-12-20', testFrequency: 'Monthly' },
  { controlId: 'C52', controlName: 'Incident Management Process Control', controlType: 'Corrective', automationLevel: 'Automated', owner: 'COO', mappedRiskIds: [57, 89, 145], effectivenessScore: 87, lastTestedDate: '2024-12-28', testFrequency: 'Monthly' },
  { controlId: 'C53', controlName: 'Problem Management Root Cause Workflow', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'COO', mappedRiskIds: [58, 112, 156, 178], effectivenessScore: 79, lastTestedDate: '2024-11-15', testFrequency: 'Monthly' },
  { controlId: 'C54', controlName: 'Infrastructure Capacity Monitoring', controlType: 'Detective', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [59, 78, 134], effectivenessScore: 92, lastTestedDate: '2025-01-10', testFrequency: 'Monthly' },
  { controlId: 'C55', controlName: 'Backup Verification and Testing', controlType: 'Detective', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [60, 91, 167, 189], effectivenessScore: 88, lastTestedDate: '2024-12-22', testFrequency: 'Monthly' },
  { controlId: 'C56', controlName: 'Disaster Recovery Testing Program', controlType: 'Detective', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [61, 145, 178], effectivenessScore: 75, lastTestedDate: '2024-09-30', testFrequency: 'Annually' },
  { controlId: 'C57', controlName: 'Business Continuity Plan Testing', controlType: 'Corrective', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [62, 112, 156], effectivenessScore: 71, lastTestedDate: '2024-08-15', testFrequency: 'Annually' },
  { controlId: 'C58', controlName: 'Service Desk Ticket Workflow', controlType: 'Corrective', automationLevel: 'Automated', owner: 'COO', mappedRiskIds: [63, 78, 134, 189], effectivenessScore: 83, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },
  { controlId: 'C59', controlName: 'IT Asset Lifecycle Management', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'COO', mappedRiskIds: [64, 91, 167], effectivenessScore: 76, lastTestedDate: '2024-11-20', testFrequency: 'Quarterly' },
  { controlId: 'C60', controlName: 'Configuration Management Database', controlType: 'Preventive', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [65, 145, 178], effectivenessScore: 89, lastTestedDate: '2024-12-30', testFrequency: 'Monthly' },
  { controlId: 'C61', controlName: 'Release Management Gate Process', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'Head of AI', mappedRiskIds: [66, 112, 156, 189], effectivenessScore: 82, lastTestedDate: '2024-12-15', testFrequency: 'Monthly' },
  { controlId: 'C62', controlName: 'Application Performance Monitoring', controlType: 'Detective', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [67, 78, 134], effectivenessScore: 94, lastTestedDate: '2025-01-08', testFrequency: 'Monthly' },
  { controlId: 'C63', controlName: 'SLA Performance Dashboard', controlType: 'Detective', automationLevel: 'Automated', owner: 'COO', mappedRiskIds: [68, 91, 167], effectivenessScore: 86, lastTestedDate: '2024-12-25', testFrequency: 'Monthly' },
  { controlId: 'C64', controlName: 'Vendor Performance Management Process', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'COO', mappedRiskIds: [69, 145, 178, 189], effectivenessScore: 78, lastTestedDate: '2024-11-30', testFrequency: 'Quarterly' },
  { controlId: 'C65', controlName: 'Contract Renewal Tracking System', controlType: 'Preventive', automationLevel: 'Automated', owner: 'COO', mappedRiskIds: [70, 112, 156], effectivenessScore: 81, lastTestedDate: '2024-12-12', testFrequency: 'Quarterly' },
  { controlId: 'C66', controlName: 'Supplier Due Diligence Process', controlType: 'Preventive', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [71, 78, 134], effectivenessScore: 73, lastTestedDate: '2024-10-25', testFrequency: 'Quarterly' },
  { controlId: 'C67', controlName: 'Network Uptime Monitoring', controlType: 'Detective', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [72, 91, 167, 189], effectivenessScore: 95, lastTestedDate: '2025-01-15', testFrequency: 'Monthly' },
  { controlId: 'C68', controlName: 'Database Health Check Automation', controlType: 'Detective', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [73, 145, 178], effectivenessScore: 90, lastTestedDate: '2024-12-28', testFrequency: 'Monthly' },
  { controlId: 'C69', controlName: 'Storage Capacity Planning Control', controlType: 'Preventive', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [74, 112, 156], effectivenessScore: 85, lastTestedDate: '2024-12-20', testFrequency: 'Monthly' },
  { controlId: 'C70', controlName: 'Batch Job Scheduling Monitor', controlType: 'Detective', automationLevel: 'Automated', owner: 'COO', mappedRiskIds: [75, 78, 134, 189], effectivenessScore: 87, lastTestedDate: '2024-12-22', testFrequency: 'Monthly' },
  { controlId: 'C71', controlName: 'API Gateway Performance Control', controlType: 'Detective', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [76, 91, 167], effectivenessScore: 91, lastTestedDate: '2025-01-05', testFrequency: 'Monthly' },
  { controlId: 'C72', controlName: 'Environment Parity Verification', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'Head of AI', mappedRiskIds: [77, 145, 178], effectivenessScore: 80, lastTestedDate: '2024-11-28', testFrequency: 'Quarterly' },
  { controlId: 'C73', controlName: 'Code Deployment Rollback Procedure', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'Head of AI', mappedRiskIds: [78, 112, 156, 189], effectivenessScore: 84, lastTestedDate: '2024-12-15', testFrequency: 'Monthly' },
  { controlId: 'C74', controlName: 'Load Balancer Health Monitoring', controlType: 'Detective', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [79, 134, 167], effectivenessScore: 93, lastTestedDate: '2025-01-12', testFrequency: 'Monthly' },
  { controlId: 'C75', controlName: 'SSL Certificate Expiry Tracking', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [80, 91, 178], effectivenessScore: 89, lastTestedDate: '2024-12-30', testFrequency: 'Monthly' },
  { controlId: 'C76', controlName: 'Infrastructure Cost Optimization Review', controlType: 'Corrective', automationLevel: 'Manual', owner: 'CFO', mappedRiskIds: [81, 145, 156], effectivenessScore: 67, lastTestedDate: '2024-10-10', testFrequency: 'Quarterly' },
  { controlId: 'C77', controlName: 'Patch Management Compliance Check', controlType: 'Detective', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [82, 112, 189], effectivenessScore: 86, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },
  { controlId: 'C78', controlName: 'Server Hardening Verification', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CISO', mappedRiskIds: [83, 78, 134, 167], effectivenessScore: 82, lastTestedDate: '2024-11-25', testFrequency: 'Quarterly' },
  { controlId: 'C79', controlName: 'Log Retention Policy Enforcement', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [84, 91, 178], effectivenessScore: 88, lastTestedDate: '2024-12-25', testFrequency: 'Monthly' },
  { controlId: 'C80', controlName: 'IT Service Catalog Management', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'COO', mappedRiskIds: [85, 145, 156, 189], effectivenessScore: 74, lastTestedDate: '2024-11-15', testFrequency: 'Quarterly' },

  // ============================================================================
  // COMPLIANCE CONTROLS (C81-C105)
  // ============================================================================
  { controlId: 'C81', controlName: 'Annual Policy Attestation Workflow', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [86, 123, 156, 178], effectivenessScore: 83, lastTestedDate: '2024-12-15', testFrequency: 'Annually' },
  { controlId: 'C82', controlName: 'Regulatory Change Impact Tracker', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [87, 112, 145], effectivenessScore: 79, lastTestedDate: '2024-11-20', testFrequency: 'Monthly' },
  { controlId: 'C83', controlName: 'Compliance Testing Program Schedule', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [88, 134, 167, 189], effectivenessScore: 85, lastTestedDate: '2024-12-28', testFrequency: 'Quarterly' },
  { controlId: 'C84', controlName: 'Audit Finding Remediation Tracker', controlType: 'Corrective', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [89, 91, 156], effectivenessScore: 87, lastTestedDate: '2024-12-22', testFrequency: 'Monthly' },
  { controlId: 'C85', controlName: 'Regulatory Reporting Submission Control', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [90, 145, 178], effectivenessScore: 92, lastTestedDate: '2025-01-10', testFrequency: 'Monthly' },
  { controlId: 'C86', controlName: 'KYC Customer Verification Process', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [91, 112, 134, 189], effectivenessScore: 88, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },
  { controlId: 'C87', controlName: 'AML Enhanced Due Diligence', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [92, 167, 178], effectivenessScore: 86, lastTestedDate: '2024-12-12', testFrequency: 'Monthly' },
  { controlId: 'C88', controlName: 'Real-Time Sanctions Screening', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [93, 91, 145, 156], effectivenessScore: 94, lastTestedDate: '2025-01-05', testFrequency: 'Monthly' },
  { controlId: 'C89', controlName: 'Data Retention Schedule Compliance', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [94, 112, 189], effectivenessScore: 81, lastTestedDate: '2024-11-30', testFrequency: 'Quarterly' },
  { controlId: 'C90', controlName: 'Privacy Consent Management Platform', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [95, 134, 167, 178], effectivenessScore: 85, lastTestedDate: '2024-12-20', testFrequency: 'Monthly' },
  { controlId: 'C91', controlName: 'Cross-Border Data Transfer Controls', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CISO', mappedRiskIds: [96, 91, 145], effectivenessScore: 78, lastTestedDate: '2024-11-15', testFrequency: 'Quarterly' },
  { controlId: 'C92', controlName: 'Whistleblower Case Management', controlType: 'Corrective', automationLevel: 'Manual', owner: 'HR Director', mappedRiskIds: [97, 112, 156, 189], effectivenessScore: 72, lastTestedDate: '2024-10-20', testFrequency: 'Quarterly' },
  { controlId: 'C93', controlName: 'Conflicts of Interest Declaration System', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [98, 134, 167], effectivenessScore: 76, lastTestedDate: '2024-11-25', testFrequency: 'Annually' },
  { controlId: 'C94', controlName: 'Gifts and Entertainment Tracking', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [99, 91, 145, 178], effectivenessScore: 74, lastTestedDate: '2024-11-10', testFrequency: 'Quarterly' },
  { controlId: 'C95', controlName: 'Trade Surveillance Monitoring System', controlType: 'Detective', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [100, 112, 156], effectivenessScore: 91, lastTestedDate: '2024-12-30', testFrequency: 'Monthly' },
  { controlId: 'C96', controlName: 'Insider Trading Prevention Controls', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [101, 134, 189], effectivenessScore: 89, lastTestedDate: '2024-12-25', testFrequency: 'Monthly' },
  { controlId: 'C97', controlName: 'Market Abuse Detection Algorithm', controlType: 'Detective', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [102, 91, 167, 178], effectivenessScore: 87, lastTestedDate: '2024-12-22', testFrequency: 'Monthly' },
  { controlId: 'C98', controlName: 'Consumer Protection Compliance Check', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [103, 145, 156], effectivenessScore: 80, lastTestedDate: '2024-11-28', testFrequency: 'Quarterly' },
  { controlId: 'C99', controlName: 'Fair Lending Analysis Control', controlType: 'Detective', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [104, 112, 134, 189], effectivenessScore: 84, lastTestedDate: '2024-12-15', testFrequency: 'Quarterly' },
  { controlId: 'C100', controlName: 'GDPR Subject Access Request Handler', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'CISO', mappedRiskIds: [105, 91, 167], effectivenessScore: 82, lastTestedDate: '2024-12-10', testFrequency: 'Monthly' },
  { controlId: 'C101', controlName: 'CCPA Compliance Monitoring', controlType: 'Detective', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [106, 145, 178], effectivenessScore: 86, lastTestedDate: '2024-12-28', testFrequency: 'Monthly' },
  { controlId: 'C102', controlName: 'Third Party Compliance Assessment', controlType: 'Preventive', automationLevel: 'Manual', owner: 'CRO', mappedRiskIds: [107, 112, 156, 189], effectivenessScore: 71, lastTestedDate: '2024-10-15', testFrequency: 'Annually' },
  { controlId: 'C103', controlName: 'Regulatory Examination Readiness', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [108, 134, 167], effectivenessScore: 77, lastTestedDate: '2024-11-20', testFrequency: 'Quarterly' },
  { controlId: 'C104', controlName: 'Compliance Risk Assessment Framework', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [109, 91, 145, 178], effectivenessScore: 83, lastTestedDate: '2024-12-05', testFrequency: 'Quarterly' },
  { controlId: 'C105', controlName: 'Regulatory Capital Reporting Control', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [110, 112, 156], effectivenessScore: 90, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },

  // ============================================================================
  // CYBER CONTROLS (C106-C130)
  // ============================================================================
  { controlId: 'C106', controlName: 'Multi-Factor Authentication Enforcement', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [111, 134, 167, 189], effectivenessScore: 93, lastTestedDate: '2025-01-10', testFrequency: 'Monthly' },
  { controlId: 'C107', controlName: 'Privileged Access Management System', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [112, 91, 145], effectivenessScore: 91, lastTestedDate: '2024-12-28', testFrequency: 'Monthly' },
  { controlId: 'C108', controlName: 'Endpoint Protection Platform', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [113, 156, 178], effectivenessScore: 89, lastTestedDate: '2024-12-22', testFrequency: 'Monthly' },
  { controlId: 'C109', controlName: 'Network Segmentation Controls', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CISO', mappedRiskIds: [114, 112, 134, 189], effectivenessScore: 85, lastTestedDate: '2024-12-15', testFrequency: 'Quarterly' },
  { controlId: 'C110', controlName: 'Email Security Gateway', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [115, 91, 167], effectivenessScore: 88, lastTestedDate: '2024-12-30', testFrequency: 'Monthly' },
  { controlId: 'C111', controlName: 'Web Application Firewall Rules', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [116, 145, 178], effectivenessScore: 90, lastTestedDate: '2025-01-05', testFrequency: 'Monthly' },
  { controlId: 'C112', controlName: 'Data Loss Prevention Controls', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [117, 112, 156, 189], effectivenessScore: 84, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },
  { controlId: 'C113', controlName: 'SIEM Real-Time Monitoring', controlType: 'Detective', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [118, 134, 167], effectivenessScore: 92, lastTestedDate: '2025-01-12', testFrequency: 'Monthly' },
  { controlId: 'C114', controlName: 'Automated Vulnerability Scanning', controlType: 'Detective', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [119, 91, 145, 178], effectivenessScore: 87, lastTestedDate: '2024-12-25', testFrequency: 'Monthly' },
  { controlId: 'C115', controlName: 'Annual Penetration Testing Program', controlType: 'Detective', automationLevel: 'Manual', owner: 'CISO', mappedRiskIds: [120, 112, 156], effectivenessScore: 78, lastTestedDate: '2024-09-20', testFrequency: 'Annually' },
  { controlId: 'C116', controlName: 'Security Awareness Training Program', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'CISO', mappedRiskIds: [121, 134, 189], effectivenessScore: 76, lastTestedDate: '2024-11-30', testFrequency: 'Quarterly' },
  { controlId: 'C117', controlName: 'Incident Response Playbook System', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'CISO', mappedRiskIds: [122, 91, 167, 178], effectivenessScore: 83, lastTestedDate: '2024-12-10', testFrequency: 'Monthly' },
  { controlId: 'C118', controlName: 'Digital Forensics Capability', controlType: 'Corrective', automationLevel: 'Manual', owner: 'CISO', mappedRiskIds: [123, 145, 156], effectivenessScore: 72, lastTestedDate: '2024-10-25', testFrequency: 'Quarterly' },
  { controlId: 'C119', controlName: 'Threat Intelligence Integration', controlType: 'Detective', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [124, 112, 134, 189], effectivenessScore: 86, lastTestedDate: '2024-12-22', testFrequency: 'Monthly' },
  { controlId: 'C120', controlName: 'Security Operations Center 24x7', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'CISO', mappedRiskIds: [125, 91, 167], effectivenessScore: 89, lastTestedDate: '2024-12-28', testFrequency: 'Monthly' },
  { controlId: 'C121', controlName: 'Zero Trust Network Architecture', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [126, 145, 178], effectivenessScore: 82, lastTestedDate: '2024-12-15', testFrequency: 'Quarterly' },
  { controlId: 'C122', controlName: 'Cloud Security Posture Management', controlType: 'Detective', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [127, 112, 156, 189], effectivenessScore: 88, lastTestedDate: '2024-12-30', testFrequency: 'Monthly' },
  { controlId: 'C123', controlName: 'Container Security Scanning', controlType: 'Preventive', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [128, 134, 167], effectivenessScore: 85, lastTestedDate: '2024-12-20', testFrequency: 'Monthly' },
  { controlId: 'C124', controlName: 'API Security Testing Framework', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'Head of AI', mappedRiskIds: [129, 91, 145, 178], effectivenessScore: 81, lastTestedDate: '2024-11-28', testFrequency: 'Quarterly' },
  { controlId: 'C125', controlName: 'Identity Governance Administration', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [130, 112, 156], effectivenessScore: 87, lastTestedDate: '2024-12-25', testFrequency: 'Monthly' },
  { controlId: 'C126', controlName: 'Phishing Simulation Program', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'CISO', mappedRiskIds: [131, 134, 189], effectivenessScore: 75, lastTestedDate: '2024-11-15', testFrequency: 'Quarterly' },
  { controlId: 'C127', controlName: 'Security Configuration Baseline', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [132, 91, 167, 178], effectivenessScore: 84, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },
  { controlId: 'C128', controlName: 'Encryption Key Management System', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [133, 145, 156], effectivenessScore: 91, lastTestedDate: '2025-01-08', testFrequency: 'Monthly' },
  { controlId: 'C129', controlName: 'Mobile Device Management Platform', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [134, 112, 189], effectivenessScore: 86, lastTestedDate: '2024-12-22', testFrequency: 'Monthly' },
  { controlId: 'C130', controlName: 'Secure Software Development Lifecycle', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'Head of AI', mappedRiskIds: [135, 134, 167, 178], effectivenessScore: 80, lastTestedDate: '2024-11-30', testFrequency: 'Quarterly' },

  // ============================================================================
  // PEOPLE CONTROLS (C131-C145)
  // ============================================================================
  { controlId: 'C131', controlName: 'Pre-Employment Background Check Process', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [136, 91, 145, 156], effectivenessScore: 88, lastTestedDate: '2024-12-20', testFrequency: 'Monthly' },
  { controlId: 'C132', controlName: 'New Employee Onboarding Workflow', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [137, 112, 189], effectivenessScore: 82, lastTestedDate: '2024-12-15', testFrequency: 'Monthly' },
  { controlId: 'C133', controlName: 'Employee Offboarding Checklist', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [138, 134, 167], effectivenessScore: 85, lastTestedDate: '2024-12-22', testFrequency: 'Monthly' },
  { controlId: 'C134', controlName: 'Access Deprovisioning Automation', controlType: 'Corrective', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [139, 91, 145, 178], effectivenessScore: 91, lastTestedDate: '2024-12-28', testFrequency: 'Monthly' },
  { controlId: 'C135', controlName: 'Performance Review Management System', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [140, 112, 156], effectivenessScore: 74, lastTestedDate: '2024-11-10', testFrequency: 'Quarterly' },
  { controlId: 'C136', controlName: 'Mandatory Training Compliance Tracker', controlType: 'Detective', automationLevel: 'Automated', owner: 'HR Director', mappedRiskIds: [141, 134, 189], effectivenessScore: 87, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },
  { controlId: 'C137', controlName: 'Leadership Succession Planning Updates', controlType: 'Preventive', automationLevel: 'Manual', owner: 'HR Director', mappedRiskIds: [142, 91, 167, 178], effectivenessScore: 68, lastTestedDate: '2024-08-15', testFrequency: 'Annually' },
  { controlId: 'C138', controlName: 'Compensation Review Approval Workflow', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [143, 145, 156], effectivenessScore: 79, lastTestedDate: '2024-11-30', testFrequency: 'Annually' },
  { controlId: 'C139', controlName: 'Diversity Metrics Monitoring Dashboard', controlType: 'Detective', automationLevel: 'Automated', owner: 'HR Director', mappedRiskIds: [144, 112, 189], effectivenessScore: 76, lastTestedDate: '2024-12-10', testFrequency: 'Quarterly' },
  { controlId: 'C140', controlName: 'Workplace Safety Inspection Program', controlType: 'Detective', automationLevel: 'Manual', owner: 'HR Director', mappedRiskIds: [145, 134, 167], effectivenessScore: 73, lastTestedDate: '2024-10-20', testFrequency: 'Quarterly' },
  { controlId: 'C141', controlName: 'Ergonomic Assessment Protocol', controlType: 'Preventive', automationLevel: 'Manual', owner: 'HR Director', mappedRiskIds: [146, 91, 145, 178], effectivenessScore: 65, lastTestedDate: '2024-07-15', testFrequency: 'Annually' },
  { controlId: 'C142', controlName: 'Employee Wellbeing Support Program', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [147, 112, 156], effectivenessScore: 71, lastTestedDate: '2024-11-25', testFrequency: 'Quarterly' },
  { controlId: 'C143', controlName: 'Remote Work Policy Compliance Monitor', controlType: 'Detective', automationLevel: 'Automated', owner: 'HR Director', mappedRiskIds: [148, 134, 189], effectivenessScore: 78, lastTestedDate: '2024-12-05', testFrequency: 'Monthly' },
  { controlId: 'C144', controlName: 'Contractor Lifecycle Management', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [149, 91, 167, 178], effectivenessScore: 80, lastTestedDate: '2024-12-12', testFrequency: 'Quarterly' },
  { controlId: 'C145', controlName: 'Temporary Staff Access Controls', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [150, 145, 156], effectivenessScore: 84, lastTestedDate: '2024-12-20', testFrequency: 'Monthly' },

  // ============================================================================
  // STRATEGIC CONTROLS (C146-C150)
  // ============================================================================
  { controlId: 'C146', controlName: 'Strategic Initiative Progress Tracking', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'COO', mappedRiskIds: [151, 112, 167, 189], effectivenessScore: 77, lastTestedDate: '2024-11-28', testFrequency: 'Quarterly' },
  { controlId: 'C147', controlName: 'Competitive Intelligence Gathering Process', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'COO', mappedRiskIds: [152, 134, 178], effectivenessScore: 72, lastTestedDate: '2024-10-30', testFrequency: 'Quarterly' },
  { controlId: 'C148', controlName: 'Market Trend Analysis Workflow', controlType: 'Detective', automationLevel: 'Manual', owner: 'CFO', mappedRiskIds: [153, 91, 145, 156], effectivenessScore: 69, lastTestedDate: '2024-09-15', testFrequency: 'Quarterly' },
  { controlId: 'C149', controlName: 'Customer Feedback Integration System', controlType: 'Corrective', automationLevel: 'Automated', owner: 'COO', mappedRiskIds: [154, 112, 189], effectivenessScore: 81, lastTestedDate: '2024-12-15', testFrequency: 'Monthly' },
  { controlId: 'C150', controlName: 'Innovation Pipeline Management Control', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'Head of AI', mappedRiskIds: [155, 134, 167, 178], effectivenessScore: 75, lastTestedDate: '2024-11-20', testFrequency: 'Quarterly' },
];

// Helper functions
export const getControlById = (id: string) => enterpriseControls.find(c => c.controlId === id);
export const getControlsByRiskId = (riskId: number) => enterpriseControls.filter(c => c.mappedRiskIds.includes(riskId));
export const getControlsByType = (type: EnterpriseControl['controlType']) => enterpriseControls.filter(c => c.controlType === type);
export const getControlsByOwner = (owner: string) => enterpriseControls.filter(c => c.owner === owner);
export const getAutomatedControls = () => enterpriseControls.filter(c => c.automationLevel === 'Automated');
export const getManualControls = () => enterpriseControls.filter(c => c.automationLevel === 'Manual');

// Analytics
export const getControlStats = () => {
  const total = enterpriseControls.length;
  const avgEffectiveness = enterpriseControls.reduce((sum, c) => sum + (c.effectivenessScore || 0), 0) / total;

  return {
    total,
    avgEffectiveness: Math.round(avgEffectiveness),
    byType: {
      preventive: getControlsByType('Preventive').length,
      detective: getControlsByType('Detective').length,
      corrective: getControlsByType('Corrective').length,
    },
    byAutomation: {
      automated: getAutomatedControls().length,
      semiAutomated: enterpriseControls.filter(c => c.automationLevel === 'Semi Automated').length,
      manual: getManualControls().length,
    },
    lowEffectivenessControls: enterpriseControls.filter(c => (c.effectivenessScore || 0) < 70),
    highEffectivenessControls: enterpriseControls.filter(c => (c.effectivenessScore || 0) >= 85),
    riskCoverage: calculateRiskCoverage(),
  };
};

const calculateRiskCoverage = () => {
  const allRiskIds = new Set<number>();
  enterpriseControls.forEach(c => c.mappedRiskIds.forEach(id => allRiskIds.add(id)));
  return {
    risksWithControls: allRiskIds.size,
    totalRisks: 200,
    coveragePercent: Math.round((allRiskIds.size / 200) * 100),
  };
};

export const getControlEffectivenessScore = () => {
  const stats = getControlStats();
  return stats.avgEffectiveness;
};
