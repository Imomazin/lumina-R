// Risk Events Dataset - 350 Events matching user data structure
export interface RiskEvent {
  eventId: number;
  relatedRiskId: number;
  eventDescription: string;
  eventDate: string;
  financialImpact: number;
  operationalImpact: 'Low' | 'Medium' | 'High';
  rootCauseConfirmed: boolean;
}

export const riskEvents: RiskEvent[] = [
  // Original 40 events (101-140)
  { eventId: 101, relatedRiskId: 29, eventDescription: 'Interest rate spike causing margin compression on variable rate facilities', eventDate: '2024-03-29', financialImpact: 334113, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 102, relatedRiskId: 12, eventDescription: 'Ransomware attack on secondary data center - contained within 4 hours', eventDate: '2024-11-20', financialImpact: 1087299, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 103, relatedRiskId: 21, eventDescription: 'Large customer bankruptcy resulting in significant write-off', eventDate: '2025-01-13', financialImpact: 1203356, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 104, relatedRiskId: 22, eventDescription: 'M&A integration delay - system consolidation postponed 3 months', eventDate: '2024-03-13', financialImpact: 477693, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 105, relatedRiskId: 20, eventDescription: 'Third-party vendor data breach exposing 10,000 customer records', eventDate: '2024-01-26', financialImpact: 645130, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 106, relatedRiskId: 30, eventDescription: 'CFPB enforcement action for disclosure violations', eventDate: '2024-03-27', financialImpact: 1339148, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 107, relatedRiskId: 17, eventDescription: 'External audit material weakness finding on revenue recognition', eventDate: '2024-09-23', financialImpact: 1222556, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 108, relatedRiskId: 16, eventDescription: 'Critical vendor sudden service discontinuation notice', eventDate: '2024-11-09', financialImpact: 1028006, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 109, relatedRiskId: 11, eventDescription: 'Key executive sudden resignation - Chief Risk Officer', eventDate: '2024-01-31', financialImpact: 1200175, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 110, relatedRiskId: 13, eventDescription: 'Workplace safety incident - office evacuation required', eventDate: '2024-01-14', financialImpact: 283719, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 111, relatedRiskId: 5, eventDescription: 'GDPR regulatory fine for consent management failures', eventDate: '2024-10-20', financialImpact: 1320900, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 112, relatedRiskId: 18, eventDescription: 'Major product defect recall affecting 5,000 units', eventDate: '2024-07-23', financialImpact: 435089, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 113, relatedRiskId: 30, eventDescription: 'State AG investigation into sales practices', eventDate: '2024-11-16', financialImpact: 1256675, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 114, relatedRiskId: 8, eventDescription: 'AML transaction monitoring system failure - 6 hour gap', eventDate: '2025-05-02', financialImpact: 1129706, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 115, relatedRiskId: 26, eventDescription: 'Product liability lawsuit filed - class action potential', eventDate: '2024-10-23', financialImpact: 603095, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 116, relatedRiskId: 9, eventDescription: 'Viral social media incident - negative brand trending', eventDate: '2024-01-20', financialImpact: 308553, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 117, relatedRiskId: 14, eventDescription: 'Data quality issue causing incorrect customer billing for 2 months', eventDate: '2025-04-06', financialImpact: 1226441, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 118, relatedRiskId: 17, eventDescription: 'Financial restatement required for previous quarter', eventDate: '2024-10-05', financialImpact: 1293120, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 119, relatedRiskId: 21, eventDescription: 'Credit loss spike in emerging market portfolio', eventDate: '2024-07-19', financialImpact: 1498110, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 120, relatedRiskId: 25, eventDescription: 'Executive conduct investigation launched by board', eventDate: '2025-02-02', financialImpact: 836087, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 121, relatedRiskId: 18, eventDescription: 'Customer satisfaction scores dropped 15 points', eventDate: '2024-02-29', financialImpact: 463709, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 122, relatedRiskId: 30, eventDescription: 'Consumer protection enforcement letter received', eventDate: '2024-05-03', financialImpact: 1043476, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 123, relatedRiskId: 10, eventDescription: 'AI lending model bias detected in protected class outcomes', eventDate: '2024-04-28', financialImpact: 928949, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 124, relatedRiskId: 14, eventDescription: 'Critical reporting system data feed failure', eventDate: '2024-02-22', financialImpact: 614696, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 125, relatedRiskId: 18, eventDescription: 'Product launch delayed due to quality failures', eventDate: '2024-03-30', financialImpact: 1259695, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 126, relatedRiskId: 13, eventDescription: 'OSHA inspection finding - multiple citations', eventDate: '2024-06-20', financialImpact: 309956, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 127, relatedRiskId: 12, eventDescription: 'Phishing attack compromised 50 employee accounts', eventDate: '2024-03-11', financialImpact: 968069, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 128, relatedRiskId: 1, eventDescription: 'Top 3 client revenue concentration exceeded 70%', eventDate: '2025-05-06', financialImpact: 893525, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 129, relatedRiskId: 18, eventDescription: 'Major software bug affecting core functionality', eventDate: '2025-05-01', financialImpact: 640467, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 130, relatedRiskId: 19, eventDescription: 'FX hedging strategy losses during market volatility', eventDate: '2024-11-27', financialImpact: 1470527, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 131, relatedRiskId: 14, eventDescription: 'Master data management failure affecting downstream systems', eventDate: '2025-04-01', financialImpact: 591028, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 132, relatedRiskId: 2, eventDescription: 'Core banking system unplanned outage - 8 hours', eventDate: '2024-09-14', financialImpact: 802124, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 133, relatedRiskId: 19, eventDescription: 'Currency devaluation in key operating region', eventDate: '2024-03-21', financialImpact: 1467234, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 134, relatedRiskId: 15, eventDescription: 'Failed system migration rollback required', eventDate: '2024-07-21', financialImpact: 696283, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 135, relatedRiskId: 13, eventDescription: 'Employee injury requiring medical attention', eventDate: '2025-02-14', financialImpact: 769326, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 136, relatedRiskId: 19, eventDescription: 'Interest rate derivative accounting error', eventDate: '2024-02-27', financialImpact: 616112, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 137, relatedRiskId: 30, eventDescription: 'State examination findings requiring remediation', eventDate: '2024-06-22', financialImpact: 880642, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 138, relatedRiskId: 26, eventDescription: 'Product safety recall notification received', eventDate: '2024-07-05', financialImpact: 1092141, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 139, relatedRiskId: 13, eventDescription: 'COVID-19 outbreak at regional office', eventDate: '2025-03-01', financialImpact: 57272, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 140, relatedRiskId: 20, eventDescription: 'Vendor security audit revealed critical gaps', eventDate: '2024-12-09', financialImpact: 793795, operationalImpact: 'Low', rootCauseConfirmed: true },

  // New events (141-450)
  // Cyber incidents
  { eventId: 141, relatedRiskId: 3, eventDescription: 'DDoS attack disrupted customer portal for 3 hours', eventDate: '2024-08-15', financialImpact: 425000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 142, relatedRiskId: 4, eventDescription: 'Insider threat detected - unauthorized data access by contractor', eventDate: '2024-09-02', financialImpact: 875000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 143, relatedRiskId: 6, eventDescription: 'Credential stuffing attack affected 2,500 accounts', eventDate: '2025-01-08', financialImpact: 312000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 144, relatedRiskId: 7, eventDescription: 'Malware infection on trading workstations detected', eventDate: '2024-05-19', financialImpact: 567000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 145, relatedRiskId: 12, eventDescription: 'SQL injection vulnerability exploited on legacy system', eventDate: '2024-06-30', financialImpact: 1245000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 146, relatedRiskId: 3, eventDescription: 'Business email compromise attempt targeting CFO', eventDate: '2025-02-28', financialImpact: 89000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 147, relatedRiskId: 4, eventDescription: 'Data exfiltration attempt blocked by DLP controls', eventDate: '2024-11-05', financialImpact: 125000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 148, relatedRiskId: 6, eventDescription: 'Zero-day exploit in network appliance discovered', eventDate: '2025-03-22', financialImpact: 780000, operationalImpact: 'High', rootCauseConfirmed: false },
  { eventId: 149, relatedRiskId: 7, eventDescription: 'Cryptojacking malware found on server infrastructure', eventDate: '2024-04-11', financialImpact: 156000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 150, relatedRiskId: 12, eventDescription: 'Spear phishing campaign targeting HR department', eventDate: '2024-12-18', financialImpact: 423000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  // Financial events
  { eventId: 151, relatedRiskId: 23, eventDescription: 'Internal fraud detected in accounts payable process', eventDate: '2024-07-08', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 152, relatedRiskId: 24, eventDescription: 'Employee embezzlement scheme uncovered - 18 month duration', eventDate: '2024-10-14', financialImpact: 4560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 153, relatedRiskId: 27, eventDescription: 'Unauthorized trading losses in derivatives desk', eventDate: '2024-08-29', financialImpact: 8900000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 154, relatedRiskId: 28, eventDescription: 'Credit default by major counterparty', eventDate: '2025-01-20', financialImpact: 3200000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 155, relatedRiskId: 29, eventDescription: 'FX translation losses exceeded hedging limits', eventDate: '2024-06-15', financialImpact: 1870000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 156, relatedRiskId: 31, eventDescription: 'SEC fine for late filing of material disclosures', eventDate: '2024-09-30', financialImpact: 2500000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 157, relatedRiskId: 23, eventDescription: 'Vendor kickback scheme identified in procurement', eventDate: '2025-04-12', financialImpact: 1120000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 158, relatedRiskId: 24, eventDescription: 'Ghost employee fraud detected during audit', eventDate: '2024-03-08', financialImpact: 890000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 159, relatedRiskId: 27, eventDescription: 'Model validation failure led to mispriced securities', eventDate: '2024-11-22', financialImpact: 5600000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 160, relatedRiskId: 28, eventDescription: 'Loan portfolio concentration breach identified', eventDate: '2024-05-27', financialImpact: 1450000, operationalImpact: 'Low', rootCauseConfirmed: true },

  // Operational failures
  { eventId: 161, relatedRiskId: 32, eventDescription: 'Payment processing system outage during peak hours', eventDate: '2024-12-23', financialImpact: 2100000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 162, relatedRiskId: 33, eventDescription: 'Trade settlement error affecting 500 transactions', eventDate: '2025-02-05', financialImpact: 890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 163, relatedRiskId: 34, eventDescription: 'Database corruption in customer records system', eventDate: '2024-04-16', financialImpact: 675000, operationalImpact: 'High', rootCauseConfirmed: false },
  { eventId: 164, relatedRiskId: 35, eventDescription: 'API integration failure with payment gateway', eventDate: '2024-08-09', financialImpact: 345000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 165, relatedRiskId: 36, eventDescription: 'End of day batch processing failure', eventDate: '2025-03-18', financialImpact: 267000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 166, relatedRiskId: 32, eventDescription: 'ATM network failure affecting 200 machines', eventDate: '2024-07-14', financialImpact: 430000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 167, relatedRiskId: 33, eventDescription: 'Wire transfer routing error sent to wrong beneficiary', eventDate: '2024-10-08', financialImpact: 1560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 168, relatedRiskId: 34, eventDescription: 'Data center cooling failure caused server shutdown', eventDate: '2025-01-29', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 169, relatedRiskId: 35, eventDescription: 'Middleware timeout causing transaction failures', eventDate: '2024-02-14', financialImpact: 234000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 170, relatedRiskId: 36, eventDescription: 'Scheduler malfunction delayed month-end close', eventDate: '2024-06-01', financialImpact: 178000, operationalImpact: 'Low', rootCauseConfirmed: true },

  // Compliance events
  { eventId: 171, relatedRiskId: 37, eventDescription: 'OCC consent order for BSA/AML deficiencies', eventDate: '2024-05-14', financialImpact: 4500000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 172, relatedRiskId: 38, eventDescription: 'Internal audit finding on segregation of duties', eventDate: '2024-09-11', financialImpact: 125000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 173, relatedRiskId: 39, eventDescription: 'Employee violated insider trading policy', eventDate: '2025-02-18', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 174, relatedRiskId: 40, eventDescription: 'Regulatory call report filed with errors', eventDate: '2024-04-30', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 175, relatedRiskId: 37, eventDescription: 'FINRA fine for supervisory failures', eventDate: '2024-11-28', financialImpact: 1200000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 176, relatedRiskId: 38, eventDescription: 'SOX 404 control deficiency identified', eventDate: '2025-03-05', financialImpact: 560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 177, relatedRiskId: 39, eventDescription: 'Code of conduct violation by senior manager', eventDate: '2024-07-22', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 178, relatedRiskId: 40, eventDescription: 'Late submission of CCAR stress test results', eventDate: '2024-01-15', financialImpact: 890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 179, relatedRiskId: 41, eventDescription: 'Privacy policy violation detected by regulator', eventDate: '2025-04-08', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: false },
  { eventId: 180, relatedRiskId: 42, eventDescription: 'Fair lending examination adverse finding', eventDate: '2024-08-20', financialImpact: 1890000, operationalImpact: 'High', rootCauseConfirmed: true },

  // People events
  { eventId: 181, relatedRiskId: 43, eventDescription: 'Age discrimination lawsuit filed by former employee', eventDate: '2024-06-12', financialImpact: 450000, operationalImpact: 'Low', rootCauseConfirmed: false },
  { eventId: 182, relatedRiskId: 44, eventDescription: 'Slip and fall accident in headquarters lobby', eventDate: '2024-09-25', financialImpact: 125000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 183, relatedRiskId: 45, eventDescription: 'Wrongful termination claim settled out of court', eventDate: '2025-01-10', financialImpact: 780000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 184, relatedRiskId: 46, eventDescription: 'Sexual harassment complaint requiring investigation', eventDate: '2024-03-18', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 185, relatedRiskId: 43, eventDescription: 'Disability accommodation lawsuit filed', eventDate: '2024-11-30', financialImpact: 290000, operationalImpact: 'Low', rootCauseConfirmed: false },
  { eventId: 186, relatedRiskId: 44, eventDescription: 'Ergonomic injury claims from call center staff', eventDate: '2025-02-22', financialImpact: 180000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 187, relatedRiskId: 45, eventDescription: 'Retaliation claim by whistleblower employee', eventDate: '2024-05-08', financialImpact: 1200000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 188, relatedRiskId: 46, eventDescription: 'Hostile work environment complaint filed with EEOC', eventDate: '2024-08-14', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 189, relatedRiskId: 47, eventDescription: 'Union grievance filed over overtime policies', eventDate: '2024-12-05', financialImpact: 89000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 190, relatedRiskId: 48, eventDescription: 'Key talent departure to competitor firm', eventDate: '2025-03-28', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  // Third party events
  { eventId: 191, relatedRiskId: 49, eventDescription: 'Cloud provider security breach affected shared data', eventDate: '2024-04-22', financialImpact: 2300000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 192, relatedRiskId: 50, eventDescription: 'Critical vendor experienced 12-hour outage', eventDate: '2024-10-16', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 193, relatedRiskId: 51, eventDescription: 'Contract dispute with IT outsourcing provider', eventDate: '2025-01-25', financialImpact: 1450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 194, relatedRiskId: 52, eventDescription: 'Key supplier filed for bankruptcy protection', eventDate: '2024-07-03', financialImpact: 3400000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 195, relatedRiskId: 49, eventDescription: 'Vendor failed SOC 2 audit requirements', eventDate: '2024-02-28', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 196, relatedRiskId: 50, eventDescription: 'Payment processor experienced data breach', eventDate: '2025-04-02', financialImpact: 1780000, operationalImpact: 'High', rootCauseConfirmed: false },
  { eventId: 197, relatedRiskId: 51, eventDescription: 'Software license audit revealed compliance gaps', eventDate: '2024-06-18', financialImpact: 670000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 198, relatedRiskId: 52, eventDescription: 'Subcontractor labor law violations discovered', eventDate: '2024-09-08', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 199, relatedRiskId: 53, eventDescription: 'Vendor concentration risk threshold exceeded', eventDate: '2024-12-12', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 200, relatedRiskId: 54, eventDescription: 'Third-party API rate limiting caused service degradation', eventDate: '2025-02-08', financialImpact: 167000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  // Reputational events
  { eventId: 201, relatedRiskId: 55, eventDescription: 'Negative news coverage of executive compensation', eventDate: '2024-05-21', financialImpact: 890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 202, relatedRiskId: 56, eventDescription: 'Customer data breach made headlines nationally', eventDate: '2024-08-03', financialImpact: 4500000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 203, relatedRiskId: 57, eventDescription: 'Product recall announced due to safety concerns', eventDate: '2025-01-17', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 204, relatedRiskId: 58, eventDescription: 'CEO social media post caused investor concerns', eventDate: '2024-03-25', financialImpact: 1200000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 205, relatedRiskId: 55, eventDescription: 'Glassdoor rating dropped significantly after layoffs', eventDate: '2024-11-08', financialImpact: 340000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 206, relatedRiskId: 56, eventDescription: 'Activist investor launched public campaign', eventDate: '2025-03-12', financialImpact: 1890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 207, relatedRiskId: 57, eventDescription: 'Environmental violation reported by media outlet', eventDate: '2024-06-28', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 208, relatedRiskId: 58, eventDescription: 'Customer complaint went viral on social media', eventDate: '2024-10-02', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 209, relatedRiskId: 59, eventDescription: 'Influencer campaign backfired with negative publicity', eventDate: '2024-02-08', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 210, relatedRiskId: 60, eventDescription: 'Brand impersonation fraud affecting customers', eventDate: '2025-04-18', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  // Strategic events
  { eventId: 211, relatedRiskId: 61, eventDescription: 'Lost major account to competitor pricing pressure', eventDate: '2024-04-05', financialImpact: 3400000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 212, relatedRiskId: 62, eventDescription: 'New product launch failed to meet sales targets', eventDate: '2024-09-19', financialImpact: 5600000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 213, relatedRiskId: 63, eventDescription: 'Acquisition integration exceeded budget by 40%', eventDate: '2025-02-12', financialImpact: 8900000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 214, relatedRiskId: 64, eventDescription: 'Market share declined 5% in core segment', eventDate: '2024-07-28', financialImpact: 4500000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 215, relatedRiskId: 61, eventDescription: 'Competitor undercut pricing on flagship product', eventDate: '2024-12-01', financialImpact: 2100000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 216, relatedRiskId: 62, eventDescription: 'R&D project cancelled after $2M investment', eventDate: '2025-03-25', financialImpact: 2000000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 217, relatedRiskId: 63, eventDescription: 'Divestiture proceeds below expected valuation', eventDate: '2024-05-30', financialImpact: 6700000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 218, relatedRiskId: 64, eventDescription: 'Channel partner terminated exclusive agreement', eventDate: '2024-08-22', financialImpact: 1560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 219, relatedRiskId: 65, eventDescription: 'Technology investment failed to deliver ROI', eventDate: '2024-01-28', financialImpact: 3400000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 220, relatedRiskId: 66, eventDescription: 'Geographic expansion stalled due to regulatory issues', eventDate: '2025-05-08', financialImpact: 2300000, operationalImpact: 'Medium', rootCauseConfirmed: false },

  // Additional cyber incidents
  { eventId: 221, relatedRiskId: 67, eventDescription: 'Watering hole attack compromised development tools', eventDate: '2024-03-14', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 222, relatedRiskId: 68, eventDescription: 'Supply chain attack via compromised software update', eventDate: '2024-10-28', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 223, relatedRiskId: 69, eventDescription: 'Mobile device lost containing sensitive client data', eventDate: '2025-01-05', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 224, relatedRiskId: 70, eventDescription: 'Unauthorized cloud storage discovered with PII', eventDate: '2024-06-10', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 225, relatedRiskId: 71, eventDescription: 'Social engineering attack on help desk succeeded', eventDate: '2024-09-05', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 226, relatedRiskId: 72, eventDescription: 'Unpatched vulnerability exploited on web server', eventDate: '2025-02-25', financialImpact: 780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 227, relatedRiskId: 73, eventDescription: 'Keylogger malware detected on executive laptop', eventDate: '2024-04-18', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 228, relatedRiskId: 74, eventDescription: 'DNS hijacking redirected customer traffic', eventDate: '2024-11-14', financialImpact: 670000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 229, relatedRiskId: 75, eventDescription: 'Privilege escalation attack gained admin access', eventDate: '2024-02-05', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 230, relatedRiskId: 76, eventDescription: 'Session hijacking affected online banking users', eventDate: '2025-04-22', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: false },

  // Additional financial events
  { eventId: 231, relatedRiskId: 77, eventDescription: 'Wire fraud attempt nearly succeeded - $3.2M', eventDate: '2024-07-11', financialImpact: 125000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 232, relatedRiskId: 78, eventDescription: 'Check kiting scheme discovered in retail branch', eventDate: '2024-12-28', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 233, relatedRiskId: 79, eventDescription: 'Insurance claim denied for business interruption', eventDate: '2025-03-08', financialImpact: 2100000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 234, relatedRiskId: 80, eventDescription: 'Commodity price spike increased operating costs', eventDate: '2024-05-04', financialImpact: 1450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 235, relatedRiskId: 81, eventDescription: 'Revenue recognition error required restatement', eventDate: '2024-08-30', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 236, relatedRiskId: 82, eventDescription: 'Pension fund shortfall identified in valuation', eventDate: '2024-01-22', financialImpact: 4500000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 237, relatedRiskId: 83, eventDescription: 'Customer refund fraud ring uncovered', eventDate: '2025-01-30', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 238, relatedRiskId: 84, eventDescription: 'Tax audit resulted in additional assessment', eventDate: '2024-06-25', financialImpact: 1890000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 239, relatedRiskId: 85, eventDescription: 'Inventory write-down due to obsolescence', eventDate: '2024-10-20', financialImpact: 2340000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 240, relatedRiskId: 86, eventDescription: 'Bad debt expense exceeded provision by 25%', eventDate: '2025-04-28', financialImpact: 3400000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  // Additional operational failures
  { eventId: 241, relatedRiskId: 87, eventDescription: 'Print vendor error caused statement delays', eventDate: '2024-03-05', financialImpact: 89000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 242, relatedRiskId: 88, eventDescription: 'Call center phone system crashed during peak', eventDate: '2024-09-28', financialImpact: 340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 243, relatedRiskId: 89, eventDescription: 'Document imaging system corrupted batch uploads', eventDate: '2025-02-01', financialImpact: 230000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 244, relatedRiskId: 90, eventDescription: 'Loan origination system calculation error', eventDate: '2024-06-08', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 245, relatedRiskId: 91, eventDescription: 'Email server outage affected 2000 employees', eventDate: '2024-11-02', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 246, relatedRiskId: 92, eventDescription: 'Automated clearing house file format error', eventDate: '2024-01-08', financialImpact: 670000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 247, relatedRiskId: 93, eventDescription: 'Backup restoration failed during DR test', eventDate: '2025-03-15', financialImpact: 560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 248, relatedRiskId: 94, eventDescription: 'Network switch failure isolated trading floor', eventDate: '2024-04-25', financialImpact: 1780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 249, relatedRiskId: 95, eventDescription: 'Certificate expiration caused service disruption', eventDate: '2024-08-17', financialImpact: 230000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 250, relatedRiskId: 96, eventDescription: 'Memory leak crashed production application', eventDate: '2024-12-15', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  // Additional compliance events
  { eventId: 251, relatedRiskId: 97, eventDescription: 'TCPA violation for automated calling practices', eventDate: '2024-02-18', financialImpact: 1200000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 252, relatedRiskId: 98, eventDescription: 'CRA examination resulted in needs improvement', eventDate: '2024-07-30', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 253, relatedRiskId: 99, eventDescription: 'Sanctions screening failure let transaction through', eventDate: '2025-01-12', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 254, relatedRiskId: 100, eventDescription: 'Record retention policy violation discovered', eventDate: '2024-05-16', financialImpact: 340000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 255, relatedRiskId: 101, eventDescription: 'Flood insurance compliance gap identified', eventDate: '2024-10-25', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 256, relatedRiskId: 102, eventDescription: 'UDAAP examination adverse finding', eventDate: '2024-03-22', financialImpact: 1450000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 257, relatedRiskId: 103, eventDescription: 'Regulation E dispute handling errors found', eventDate: '2025-04-05', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 258, relatedRiskId: 104, eventDescription: 'TILA disclosure timing violation detected', eventDate: '2024-08-08', financialImpact: 450000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 259, relatedRiskId: 105, eventDescription: 'ECOA notice requirement not met', eventDate: '2024-12-20', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 260, relatedRiskId: 106, eventDescription: 'HMDA data accuracy errors required correction', eventDate: '2024-01-30', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },

  // Additional people events
  { eventId: 261, relatedRiskId: 107, eventDescription: 'Mass layoff WARN Act notification failure', eventDate: '2024-04-12', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 262, relatedRiskId: 108, eventDescription: 'Workplace violence incident required response', eventDate: '2024-09-15', financialImpact: 340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 263, relatedRiskId: 109, eventDescription: 'Religious accommodation complaint filed', eventDate: '2025-02-20', financialImpact: 125000, operationalImpact: 'Low', rootCauseConfirmed: false },
  { eventId: 264, relatedRiskId: 110, eventDescription: 'FMLA interference claim by employee', eventDate: '2024-06-05', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 265, relatedRiskId: 111, eventDescription: 'Pregnancy discrimination allegation received', eventDate: '2024-11-18', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 266, relatedRiskId: 112, eventDescription: 'Wage and hour class action lawsuit filed', eventDate: '2024-02-25', financialImpact: 2100000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 267, relatedRiskId: 113, eventDescription: 'Non-compete agreement violation by ex-employee', eventDate: '2025-03-30', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 268, relatedRiskId: 114, eventDescription: 'Workplace bullying complaint substantiated', eventDate: '2024-07-18', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 269, relatedRiskId: 115, eventDescription: 'Benefits administration error affected 500 employees', eventDate: '2024-10-12', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 270, relatedRiskId: 116, eventDescription: 'I-9 audit revealed compliance deficiencies', eventDate: '2024-01-05', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  // Additional third party events
  { eventId: 271, relatedRiskId: 117, eventDescription: 'Offshore vendor data handling breach occurred', eventDate: '2024-05-28', financialImpact: 1560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 272, relatedRiskId: 118, eventDescription: 'SaaS provider raised prices 30% on renewal', eventDate: '2024-08-25', financialImpact: 890000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 273, relatedRiskId: 119, eventDescription: 'Vendor employee accessed systems inappropriately', eventDate: '2025-01-22', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 274, relatedRiskId: 120, eventDescription: 'Hardware supplier quality issue delayed project', eventDate: '2024-03-30', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 275, relatedRiskId: 121, eventDescription: 'Consulting firm conflict of interest discovered', eventDate: '2024-06-22', financialImpact: 340000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 276, relatedRiskId: 122, eventDescription: 'Staffing agency worker caused data incident', eventDate: '2024-11-28', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 277, relatedRiskId: 123, eventDescription: 'Vendor geopolitical risk affected supply chain', eventDate: '2024-02-12', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 278, relatedRiskId: 124, eventDescription: 'Partner firm reputational issue affected brand', eventDate: '2025-04-15', financialImpact: 1120000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 279, relatedRiskId: 125, eventDescription: 'Cloud migration vendor missed deadline by 3 months', eventDate: '2024-07-25', financialImpact: 1780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 280, relatedRiskId: 126, eventDescription: 'Vendor financial instability required transition', eventDate: '2024-10-05', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },

  // Additional reputational events
  { eventId: 281, relatedRiskId: 127, eventDescription: 'Former employee lawsuit covered by media', eventDate: '2024-04-08', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 282, relatedRiskId: 128, eventDescription: 'Analyst downgrade cited governance concerns', eventDate: '2024-09-22', financialImpact: 4500000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 283, relatedRiskId: 129, eventDescription: 'ESG rating decline attracted negative attention', eventDate: '2025-02-15', financialImpact: 1200000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 284, relatedRiskId: 130, eventDescription: 'Customer data sold on dark web discovered', eventDate: '2024-06-02', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 285, relatedRiskId: 131, eventDescription: 'Product counterfeiting ring discovered', eventDate: '2024-11-10', financialImpact: 890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 286, relatedRiskId: 132, eventDescription: 'Employee social media post went viral negatively', eventDate: '2024-02-20', financialImpact: 340000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 287, relatedRiskId: 133, eventDescription: 'Greenwashing accusation by environmental group', eventDate: '2025-03-20', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: false },
  { eventId: 288, relatedRiskId: 134, eventDescription: 'Executive interview gaffe caused stock drop', eventDate: '2024-05-12', financialImpact: 3400000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 289, relatedRiskId: 135, eventDescription: 'Customer review bombing campaign detected', eventDate: '2024-08-05', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 290, relatedRiskId: 136, eventDescription: 'Industry award rescinded after investigation', eventDate: '2024-12-08', financialImpact: 125000, operationalImpact: 'Low', rootCauseConfirmed: true },

  // Additional strategic events
  { eventId: 291, relatedRiskId: 137, eventDescription: 'Patent infringement lawsuit filed by competitor', eventDate: '2024-03-18', financialImpact: 5600000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 292, relatedRiskId: 138, eventDescription: 'Regulatory change invalidated product line', eventDate: '2024-08-12', financialImpact: 8900000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 293, relatedRiskId: 139, eventDescription: 'Joint venture partner withdrew from agreement', eventDate: '2025-01-28', financialImpact: 3400000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 294, relatedRiskId: 140, eventDescription: 'New entrant disrupted core market segment', eventDate: '2024-06-15', financialImpact: 4500000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 295, relatedRiskId: 141, eventDescription: 'Talent acquisition strategy failed in key market', eventDate: '2024-10-30', financialImpact: 1120000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 296, relatedRiskId: 142, eventDescription: 'Brand positioning research showed decline', eventDate: '2024-01-18', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 297, relatedRiskId: 143, eventDescription: 'Digital transformation initiative stalled', eventDate: '2025-04-10', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 298, relatedRiskId: 144, eventDescription: 'Customer churn rate exceeded threshold', eventDate: '2024-05-25', financialImpact: 1890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 299, relatedRiskId: 145, eventDescription: 'Pricing strategy backfired losing key accounts', eventDate: '2024-09-08', financialImpact: 2100000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 300, relatedRiskId: 146, eventDescription: 'Succession planning gap created leadership void', eventDate: '2024-12-22', financialImpact: 1560000, operationalImpact: 'High', rootCauseConfirmed: true },

  // More cyber incidents across different risks
  { eventId: 301, relatedRiskId: 147, eventDescription: 'Brute force attack locked out admin accounts', eventDate: '2024-04-02', financialImpact: 230000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 302, relatedRiskId: 148, eventDescription: 'Firmware vulnerability in IoT devices exploited', eventDate: '2024-07-08', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 303, relatedRiskId: 149, eventDescription: 'Rogue Wi-Fi access point detected in office', eventDate: '2025-02-28', financialImpact: 125000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 304, relatedRiskId: 150, eventDescription: 'Email forwarding rule attack exfiltrated data', eventDate: '2024-10-18', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 305, relatedRiskId: 151, eventDescription: 'Cloud misconfiguration exposed sensitive files', eventDate: '2024-02-08', financialImpact: 1450000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 306, relatedRiskId: 152, eventDescription: 'Fake job posting used for credential harvesting', eventDate: '2025-05-02', financialImpact: 89000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 307, relatedRiskId: 153, eventDescription: 'Man-in-the-middle attack on VPN connection', eventDate: '2024-06-28', financialImpact: 670000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 308, relatedRiskId: 154, eventDescription: 'USB drop attack introduced malware', eventDate: '2024-11-25', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 309, relatedRiskId: 155, eventDescription: 'API key exposure on public code repository', eventDate: '2024-03-08', financialImpact: 780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 310, relatedRiskId: 156, eventDescription: 'Shadow IT application discovered with PII', eventDate: '2025-01-15', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  // More financial and operational events
  { eventId: 311, relatedRiskId: 157, eventDescription: 'Accounts receivable fraud scheme uncovered', eventDate: '2024-05-18', financialImpact: 1780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 312, relatedRiskId: 158, eventDescription: 'Expense report fraud detected through analytics', eventDate: '2024-08-28', financialImpact: 340000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 313, relatedRiskId: 159, eventDescription: 'Fixed asset impairment required write-down', eventDate: '2025-03-05', financialImpact: 4500000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 314, relatedRiskId: 160, eventDescription: 'Liquidity stress event triggered contingency', eventDate: '2024-01-25', financialImpact: 6700000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 315, relatedRiskId: 161, eventDescription: 'Collateral value decline triggered margin call', eventDate: '2024-06-12', financialImpact: 3400000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 316, relatedRiskId: 162, eventDescription: 'Invoice factoring fraud by customer detected', eventDate: '2024-10-08', financialImpact: 1120000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 317, relatedRiskId: 163, eventDescription: 'Transfer pricing audit resulted in adjustment', eventDate: '2024-02-22', financialImpact: 2100000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 318, relatedRiskId: 164, eventDescription: 'Goodwill impairment test failed for acquisition', eventDate: '2025-04-25', financialImpact: 8900000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 319, relatedRiskId: 165, eventDescription: 'Customer deposit run affected liquidity', eventDate: '2024-07-22', financialImpact: 5600000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 320, relatedRiskId: 166, eventDescription: 'Derivative valuation model error discovered', eventDate: '2024-12-05', financialImpact: 1890000, operationalImpact: 'High', rootCauseConfirmed: true },

  // More operational and compliance events
  { eventId: 321, relatedRiskId: 167, eventDescription: 'Month-end close delayed due to system issues', eventDate: '2024-04-30', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 322, relatedRiskId: 168, eventDescription: 'Inventory management system sync failure', eventDate: '2024-09-05', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 323, relatedRiskId: 169, eventDescription: 'Order fulfillment errors spike during holiday', eventDate: '2025-01-02', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 324, relatedRiskId: 170, eventDescription: 'Quality control failure released defective batch', eventDate: '2024-06-18', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 325, relatedRiskId: 171, eventDescription: 'Shipping carrier strike disrupted deliveries', eventDate: '2024-10-28', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 326, relatedRiskId: 172, eventDescription: 'Warehouse fire destroyed inventory stock', eventDate: '2024-03-15', financialImpact: 4500000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 327, relatedRiskId: 173, eventDescription: 'Power outage affected data center operations', eventDate: '2025-02-10', financialImpact: 780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 328, relatedRiskId: 174, eventDescription: 'Customer service queue exceeded SLA thresholds', eventDate: '2024-08-02', financialImpact: 230000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 329, relatedRiskId: 175, eventDescription: 'ERP system upgrade caused processing delays', eventDate: '2024-12-28', financialImpact: 670000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 330, relatedRiskId: 176, eventDescription: 'Automated testing failure let bug into production', eventDate: '2024-01-12', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  // More people and third party events
  { eventId: 331, relatedRiskId: 177, eventDescription: 'Executive departure to start competing firm', eventDate: '2024-05-08', financialImpact: 1560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 332, relatedRiskId: 178, eventDescription: 'Department reorganization caused talent exodus', eventDate: '2024-09-18', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 333, relatedRiskId: 179, eventDescription: 'Training program failure led to compliance gap', eventDate: '2025-03-25', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 334, relatedRiskId: 180, eventDescription: 'Remote work policy abuse investigation launched', eventDate: '2024-07-05', financialImpact: 125000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 335, relatedRiskId: 181, eventDescription: 'Contractor background check failure discovered', eventDate: '2024-11-15', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 336, relatedRiskId: 182, eventDescription: 'Vendor data retention violation identified', eventDate: '2024-02-28', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 337, relatedRiskId: 183, eventDescription: 'Outsourcing provider SLA breach penalties', eventDate: '2025-05-10', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 338, relatedRiskId: 184, eventDescription: 'Supplier quality audit revealed deficiencies', eventDate: '2024-06-25', financialImpact: 450000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 339, relatedRiskId: 185, eventDescription: 'Distributor channel conflict escalated', eventDate: '2024-10-22', financialImpact: 1120000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 340, relatedRiskId: 186, eventDescription: 'Technology partner ended strategic alliance', eventDate: '2024-03-28', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },

  // More reputational and strategic events
  { eventId: 341, relatedRiskId: 187, eventDescription: 'Industry ranking dropped significantly', eventDate: '2024-08-15', financialImpact: 890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 342, relatedRiskId: 188, eventDescription: 'Customer advocacy group launched boycott', eventDate: '2025-01-08', financialImpact: 1780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 343, relatedRiskId: 189, eventDescription: 'Celebrity endorsement controversy emerged', eventDate: '2024-05-22', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 344, relatedRiskId: 190, eventDescription: 'Government contract award challenged', eventDate: '2024-11-02', financialImpact: 3400000, operationalImpact: 'High', rootCauseConfirmed: false },
  { eventId: 345, relatedRiskId: 191, eventDescription: 'Trade association membership suspended', eventDate: '2024-02-15', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 346, relatedRiskId: 192, eventDescription: 'Market research indicated brand erosion', eventDate: '2025-04-18', financialImpact: 1120000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 347, relatedRiskId: 193, eventDescription: 'Product innovation pipeline delayed 6 months', eventDate: '2024-07-12', financialImpact: 4500000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 348, relatedRiskId: 194, eventDescription: 'Strategic initiative benefits not materializing', eventDate: '2024-12-18', financialImpact: 2100000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 349, relatedRiskId: 195, eventDescription: 'Competitive intelligence revealed market threat', eventDate: '2024-04-25', financialImpact: 1560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 350, relatedRiskId: 196, eventDescription: 'Industry disruption accelerated decline', eventDate: '2024-09-30', financialImpact: 5600000, operationalImpact: 'High', rootCauseConfirmed: true },

  // Final batch of diverse events
  { eventId: 351, relatedRiskId: 197, eventDescription: 'Board governance review identified gaps', eventDate: '2025-02-05', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 352, relatedRiskId: 198, eventDescription: 'Shareholder activism campaign launched', eventDate: '2024-06-08', financialImpact: 1890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 353, relatedRiskId: 199, eventDescription: 'Capital expenditure project overrun by 35%', eventDate: '2024-10-15', financialImpact: 3400000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 354, relatedRiskId: 200, eventDescription: 'Organic growth targets missed by wide margin', eventDate: '2024-01-28', financialImpact: 4500000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 355, relatedRiskId: 1, eventDescription: 'Revenue concentration risk materialized Q4', eventDate: '2024-12-30', financialImpact: 2100000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 356, relatedRiskId: 2, eventDescription: 'System availability dropped below 99.5% SLA', eventDate: '2025-03-15', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 357, relatedRiskId: 5, eventDescription: 'Privacy impact assessment revealed new risks', eventDate: '2024-05-05', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 358, relatedRiskId: 8, eventDescription: 'Suspicious activity report filing backlog', eventDate: '2024-08-22', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 359, relatedRiskId: 9, eventDescription: 'Brand sentiment score declined sharply', eventDate: '2025-01-25', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 360, relatedRiskId: 10, eventDescription: 'Model risk management deficiency noted', eventDate: '2024-04-15', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: true },

  { eventId: 361, relatedRiskId: 11, eventDescription: 'Key person dependency risk materialized', eventDate: '2024-07-28', financialImpact: 1560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 362, relatedRiskId: 15, eventDescription: 'Technology debt created performance issues', eventDate: '2024-11-08', financialImpact: 890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 363, relatedRiskId: 16, eventDescription: 'Vendor lock-in limited strategic options', eventDate: '2024-02-18', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 364, relatedRiskId: 22, eventDescription: 'Post-merger synergy targets not achieved', eventDate: '2025-04-30', financialImpact: 5600000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 365, relatedRiskId: 25, eventDescription: 'Ethics hotline complaint volume increased', eventDate: '2024-06-30', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 366, relatedRiskId: 31, eventDescription: 'SEC comment letter required extensive response', eventDate: '2024-10-02', financialImpact: 560000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 367, relatedRiskId: 41, eventDescription: 'Data subject access requests backlog grew', eventDate: '2024-03-12', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 368, relatedRiskId: 47, eventDescription: 'Labor relations dispute affected operations', eventDate: '2024-08-08', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 369, relatedRiskId: 53, eventDescription: 'Fourth-party risk event impacted services', eventDate: '2025-02-22', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 370, relatedRiskId: 59, eventDescription: 'Marketing campaign received public backlash', eventDate: '2024-05-15', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  { eventId: 371, relatedRiskId: 65, eventDescription: 'Technology obsolescence forced upgrade', eventDate: '2024-09-25', financialImpact: 1890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 372, relatedRiskId: 66, eventDescription: 'International expansion regulatory setback', eventDate: '2024-12-12', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 373, relatedRiskId: 77, eventDescription: 'Payment fraud attempt during holiday period', eventDate: '2024-01-02', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 374, relatedRiskId: 81, eventDescription: 'Accounting policy change required restatement', eventDate: '2025-03-30', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 375, relatedRiskId: 87, eventDescription: 'Print and mail vendor quality issues', eventDate: '2024-04-20', financialImpact: 125000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 376, relatedRiskId: 91, eventDescription: 'Collaboration tool outage affected productivity', eventDate: '2024-07-15', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 377, relatedRiskId: 97, eventDescription: 'Marketing compliance violation identified', eventDate: '2024-11-22', financialImpact: 890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 378, relatedRiskId: 101, eventDescription: 'Insurance coverage gap identified post-loss', eventDate: '2024-02-05', financialImpact: 1560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 379, relatedRiskId: 107, eventDescription: 'Workforce reduction communication mishandled', eventDate: '2025-05-05', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 380, relatedRiskId: 113, eventDescription: 'Trade secret misappropriation lawsuit filed', eventDate: '2024-06-05', financialImpact: 2100000, operationalImpact: 'High', rootCauseConfirmed: true },

  { eventId: 381, relatedRiskId: 117, eventDescription: 'Offshore vendor GDPR violation occurred', eventDate: '2024-09-12', financialImpact: 1780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 382, relatedRiskId: 121, eventDescription: 'Consultant recommendation proved flawed', eventDate: '2025-01-18', financialImpact: 890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 383, relatedRiskId: 127, eventDescription: 'Media investigation published damaging story', eventDate: '2024-04-28', financialImpact: 1450000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 384, relatedRiskId: 133, eventDescription: 'Sustainability report accuracy challenged', eventDate: '2024-08-18', financialImpact: 340000, operationalImpact: 'Low', rootCauseConfirmed: false },
  { eventId: 385, relatedRiskId: 137, eventDescription: 'Intellectual property dispute escalated', eventDate: '2024-12-02', financialImpact: 3400000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 386, relatedRiskId: 141, eventDescription: 'Executive recruiting challenges persisted', eventDate: '2024-03-05', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 387, relatedRiskId: 147, eventDescription: 'Penetration test revealed critical vulnerabilities', eventDate: '2025-04-12', financialImpact: 450000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 388, relatedRiskId: 153, eventDescription: 'Network segmentation failure during audit', eventDate: '2024-07-02', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 389, relatedRiskId: 157, eventDescription: 'Revenue leakage identified in billing process', eventDate: '2024-10-25', financialImpact: 1120000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 390, relatedRiskId: 163, eventDescription: 'Tax planning strategy challenged by authority', eventDate: '2024-01-15', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },

  { eventId: 391, relatedRiskId: 167, eventDescription: 'Financial close process control failure', eventDate: '2024-05-30', financialImpact: 780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 392, relatedRiskId: 173, eventDescription: 'Natural disaster affected regional operations', eventDate: '2024-09-08', financialImpact: 4500000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 393, relatedRiskId: 177, eventDescription: 'Management team conflict became public', eventDate: '2025-02-15', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 394, relatedRiskId: 183, eventDescription: 'Vendor transition caused service degradation', eventDate: '2024-06-20', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 395, relatedRiskId: 189, eventDescription: 'Sponsorship deal controversy emerged', eventDate: '2024-11-05', financialImpact: 340000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 396, relatedRiskId: 193, eventDescription: 'R&D productivity metrics declined sharply', eventDate: '2024-02-25', financialImpact: 1560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 397, relatedRiskId: 197, eventDescription: 'Board committee effectiveness review concerns', eventDate: '2025-05-12', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 398, relatedRiskId: 3, eventDescription: 'Botnet attack on customer-facing systems', eventDate: '2024-04-08', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 399, relatedRiskId: 7, eventDescription: 'Fileless malware attack evaded detection', eventDate: '2024-08-02', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: false },
  { eventId: 400, relatedRiskId: 12, eventDescription: 'Double extortion ransomware threat received', eventDate: '2024-12-15', financialImpact: 2100000, operationalImpact: 'High', rootCauseConfirmed: true },

  { eventId: 401, relatedRiskId: 17, eventDescription: 'Internal control deficiency in procurement', eventDate: '2024-03-22', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 402, relatedRiskId: 21, eventDescription: 'Credit portfolio concentration limit breach', eventDate: '2024-07-08', financialImpact: 1780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 403, relatedRiskId: 26, eventDescription: 'Product liability reserve proved insufficient', eventDate: '2025-01-30', financialImpact: 3400000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 404, relatedRiskId: 30, eventDescription: 'Regulatory exam resulted in MRA issuance', eventDate: '2024-05-12', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 405, relatedRiskId: 34, eventDescription: 'Database replication lag caused data issues', eventDate: '2024-10-18', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 406, relatedRiskId: 38, eventDescription: 'Control self-assessment identified gaps', eventDate: '2024-02-10', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 407, relatedRiskId: 42, eventDescription: 'Fair lending statistical analysis concern', eventDate: '2025-04-08', financialImpact: 1560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 408, relatedRiskId: 46, eventDescription: 'Workplace culture survey revealed issues', eventDate: '2024-06-28', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 409, relatedRiskId: 50, eventDescription: 'Critical vendor financial distress signals', eventDate: '2024-11-12', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 410, relatedRiskId: 54, eventDescription: 'Third-party API security vulnerability found', eventDate: '2024-03-02', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },

  { eventId: 411, relatedRiskId: 58, eventDescription: 'Social media crisis management failure', eventDate: '2024-08-25', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 412, relatedRiskId: 62, eventDescription: 'Go-to-market strategy execution problems', eventDate: '2025-02-08', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 413, relatedRiskId: 70, eventDescription: 'Shadow data discovered in unapproved location', eventDate: '2024-05-25', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 414, relatedRiskId: 78, eventDescription: 'Deposit fraud ring identified at branches', eventDate: '2024-10-05', financialImpact: 1780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 415, relatedRiskId: 82, eventDescription: 'Actuarial assumption error in reserves', eventDate: '2024-01-20', financialImpact: 3400000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 416, relatedRiskId: 88, eventDescription: 'Contact center technology failure during peak', eventDate: '2025-03-18', financialImpact: 560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 417, relatedRiskId: 92, eventDescription: 'Payment file transmission failure occurred', eventDate: '2024-04-15', financialImpact: 890000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 418, relatedRiskId: 98, eventDescription: 'Community development commitment shortfall', eventDate: '2024-07-22', financialImpact: 670000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 419, relatedRiskId: 102, eventDescription: 'Customer complaint trends indicated UDAAP risk', eventDate: '2024-12-08', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 420, relatedRiskId: 108, eventDescription: 'Active shooter drill revealed response gaps', eventDate: '2024-03-28', financialImpact: 125000, operationalImpact: 'Low', rootCauseConfirmed: true },

  { eventId: 421, relatedRiskId: 114, eventDescription: 'Manager retaliation claim filed with HR', eventDate: '2024-09-15', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 422, relatedRiskId: 118, eventDescription: 'SaaS vendor service outage lasted 18 hours', eventDate: '2025-01-05', financialImpact: 780000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 423, relatedRiskId: 122, eventDescription: 'Temp worker unauthorized access incident', eventDate: '2024-06-12', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 424, relatedRiskId: 128, eventDescription: 'Investor relations communication misstep', eventDate: '2024-10-30', financialImpact: 1560000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 425, relatedRiskId: 132, eventDescription: 'Employee Facebook post violated policy', eventDate: '2024-02-02', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 426, relatedRiskId: 138, eventDescription: 'New regulation impacted business model', eventDate: '2025-04-25', financialImpact: 5600000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 427, relatedRiskId: 142, eventDescription: 'Brand equity measurement showed decline', eventDate: '2024-05-18', financialImpact: 890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 428, relatedRiskId: 148, eventDescription: 'IoT device botnet participation detected', eventDate: '2024-08-12', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 429, relatedRiskId: 152, eventDescription: 'HR system credential theft incident', eventDate: '2024-12-22', financialImpact: 670000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 430, relatedRiskId: 158, eventDescription: 'T&E policy violations widespread in audit', eventDate: '2024-03-15', financialImpact: 340000, operationalImpact: 'Low', rootCauseConfirmed: true },

  { eventId: 431, relatedRiskId: 162, eventDescription: 'Customer payment dispute rate increased', eventDate: '2024-07-30', financialImpact: 780000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 432, relatedRiskId: 168, eventDescription: 'Supply chain visibility gap identified', eventDate: '2025-02-18', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 433, relatedRiskId: 172, eventDescription: 'Facility flood caused extended closure', eventDate: '2024-04-22', financialImpact: 2100000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 434, relatedRiskId: 178, eventDescription: 'Employee engagement scores dropped sharply', eventDate: '2024-09-28', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 435, relatedRiskId: 182, eventDescription: 'Vendor contract auto-renewal oversight', eventDate: '2024-01-08', financialImpact: 670000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 436, relatedRiskId: 188, eventDescription: 'Consumer advocacy group filed complaint', eventDate: '2025-05-08', financialImpact: 1120000, operationalImpact: 'High', rootCauseConfirmed: false },
  { eventId: 437, relatedRiskId: 192, eventDescription: 'Customer experience metrics trended down', eventDate: '2024-06-02', financialImpact: 890000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 438, relatedRiskId: 196, eventDescription: 'Digital channel adoption below targets', eventDate: '2024-11-18', financialImpact: 1560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 439, relatedRiskId: 200, eventDescription: 'Strategic plan execution falling behind', eventDate: '2024-02-28', financialImpact: 2340000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 440, relatedRiskId: 4, eventDescription: 'Privileged user account misuse detected', eventDate: '2025-03-08', financialImpact: 780000, operationalImpact: 'High', rootCauseConfirmed: true },

  { eventId: 441, relatedRiskId: 14, eventDescription: 'Data reconciliation discrepancy found', eventDate: '2024-05-08', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 442, relatedRiskId: 24, eventDescription: 'Cash handling irregularity at branch', eventDate: '2024-08-05', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 443, relatedRiskId: 36, eventDescription: 'Batch job scheduling conflict caused delay', eventDate: '2024-12-28', financialImpact: 230000, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 444, relatedRiskId: 48, eventDescription: 'Senior developer unexpected departure', eventDate: '2024-03-18', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 445, relatedRiskId: 60, eventDescription: 'Domain typosquatting attack on brand', eventDate: '2024-07-25', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 446, relatedRiskId: 76, eventDescription: 'Web session management vulnerability', eventDate: '2025-01-22', financialImpact: 670000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 447, relatedRiskId: 86, eventDescription: 'Allowance for loan losses proved inadequate', eventDate: '2024-04-30', financialImpact: 2100000, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 448, relatedRiskId: 96, eventDescription: 'Application performance degradation severe', eventDate: '2024-10-12', financialImpact: 450000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 449, relatedRiskId: 106, eventDescription: 'Regulatory reporting data quality issues', eventDate: '2024-01-28', financialImpact: 560000, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 450, relatedRiskId: 116, eventDescription: 'Immigration compliance audit finding', eventDate: '2025-04-15', financialImpact: 340000, operationalImpact: 'Medium', rootCauseConfirmed: true },
];

// Helper functions
export const getEventById = (id: number) => riskEvents.find(e => e.eventId === id);
export const getEventsByRiskId = (riskId: number) => riskEvents.filter(e => e.relatedRiskId === riskId);
export const getRecentEvents = (days: number = 90) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return riskEvents.filter(e => new Date(e.eventDate) >= cutoff);
};
export const getHighImpactEvents = () => riskEvents.filter(e => e.operationalImpact === 'High');

// Analytics
export const getEventStats = () => {
  const total = riskEvents.length;
  const totalFinancialImpact = riskEvents.reduce((sum, e) => sum + e.financialImpact, 0);
  const avgFinancialImpact = totalFinancialImpact / total;

  return {
    total,
    totalFinancialImpact,
    avgFinancialImpact: Math.round(avgFinancialImpact),
    byOperationalImpact: {
      high: riskEvents.filter(e => e.operationalImpact === 'High').length,
      medium: riskEvents.filter(e => e.operationalImpact === 'Medium').length,
      low: riskEvents.filter(e => e.operationalImpact === 'Low').length,
    },
    topRisksWithEvents: getTopRisksWithEvents(),
    recentTrend: calculateEventTrend(),
  };
};

const getTopRisksWithEvents = () => {
  const riskEventCounts = new Map<number, { count: number; totalImpact: number }>();
  riskEvents.forEach(e => {
    const existing = riskEventCounts.get(e.relatedRiskId) || { count: 0, totalImpact: 0 };
    riskEventCounts.set(e.relatedRiskId, {
      count: existing.count + 1,
      totalImpact: existing.totalImpact + e.financialImpact,
    });
  });
  return Array.from(riskEventCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
};

const calculateEventTrend = () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentEvents = riskEvents.filter(e => new Date(e.eventDate) >= sixMonthsAgo);
  const olderEvents = riskEvents.filter(e => new Date(e.eventDate) < sixMonthsAgo);
  return {
    recentCount: recentEvents.length,
    olderCount: olderEvents.length,
    trend: recentEvents.length > olderEvents.length ? 'increasing' : 'decreasing',
  };
};
