import { useState } from 'react';
import {
  Bot,
  AlertTriangle,
  TrendingUp,
  Shield,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../utils';
import { risks, kris, riskAppetite } from '../data';

interface Insight {
  id: string;
  type: 'alert' | 'trend' | 'recommendation' | 'observation';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  action?: string;
  linkedItems?: string[];
}

// Generate insights from current data
function generateInsights(): Insight[] {
  const insights: Insight[] = [];

  // Check for breached KRIs
  const breachedKRIs = kris.filter(k => k.status === 'red');
  if (breachedKRIs.length > 0) {
    insights.push({
      id: 'insight-kri-breach',
      type: 'alert',
      priority: 'high',
      title: 'KRI Threshold Breach Detected',
      message: `${breachedKRIs.length} Key Risk Indicator${breachedKRIs.length > 1 ? 's have' : ' has'} breached red thresholds. ${breachedKRIs[0].name} requires immediate attention with current value at ${breachedKRIs[0].currentValue}${breachedKRIs[0].unit}.`,
      action: 'Review KRI Dashboard',
      linkedItems: breachedKRIs.map(k => k.id),
    });
  }

  // Check for breached appetite
  const breachedAppetite = riskAppetite.filter(a => a.status === 'breached');
  if (breachedAppetite.length > 0) {
    insights.push({
      id: 'insight-appetite-breach',
      type: 'alert',
      priority: 'high',
      title: 'Risk Appetite Exceeded',
      message: `${breachedAppetite[0].category.charAt(0).toUpperCase() + breachedAppetite[0].category.slice(1)} risk has exceeded tolerance limits. Current exposure at ${breachedAppetite[0].currentLevel}% versus maximum tolerance of ${breachedAppetite[0].toleranceMax}%.`,
      action: 'Review Appetite Framework',
      linkedItems: [breachedAppetite[0].category],
    });
  }

  // Analyze risk trends
  const increasingRisks = risks.filter(r => r.trend === 'increasing' && (r.severity === 'critical' || r.severity === 'high'));
  if (increasingRisks.length > 0) {
    insights.push({
      id: 'insight-risk-trend',
      type: 'trend',
      priority: 'medium',
      title: 'Escalating Risk Patterns',
      message: `${increasingRisks.length} high-severity risk${increasingRisks.length > 1 ? 's are' : ' is'} showing an increasing trend. Consider reviewing mitigation strategies for ${increasingRisks[0].title}.`,
      action: 'Analyze Trends',
      linkedItems: increasingRisks.map(r => r.id),
    });
  }

  // Strategic recommendation
  const cyberRisks = risks.filter(r => r.category === 'cyber' && r.severity !== 'low');
  if (cyberRisks.length >= 2) {
    insights.push({
      id: 'insight-cyber-posture',
      type: 'recommendation',
      priority: 'medium',
      title: 'Strengthen Cyber Defense Posture',
      message: 'Analysis indicates elevated cyber risk exposure with multiple active threats. Recommend accelerating vulnerability remediation program and conducting tabletop exercises for ransomware scenarios.',
      action: 'View Cyber Risks',
      linkedItems: cyberRisks.map(r => r.id),
    });
  }

  // Positive observation
  const mitigatedRisks = risks.filter(r => r.trend === 'decreasing');
  if (mitigatedRisks.length >= 2) {
    insights.push({
      id: 'insight-positive',
      type: 'observation',
      priority: 'low',
      title: 'Mitigation Efforts Showing Results',
      message: `${mitigatedRisks.length} risks are showing decreasing trends, indicating effective mitigation measures. Continue monitoring to ensure sustained improvement.`,
      linkedItems: mitigatedRisks.map(r => r.id),
    });
  }

  // Compliance focus
  insights.push({
    id: 'insight-compliance',
    type: 'recommendation',
    priority: 'medium',
    title: 'Regulatory Compliance Review Due',
    message: 'Quarterly compliance self-assessment is approaching. Ensure all regulatory finding remediation timelines are on track and documentation is current.',
    action: 'View Compliance Status',
  });

  return insights;
}

interface RiskAdvisorPanelProps {
  compact?: boolean;
  maxInsights?: number;
  className?: string;
}

export function RiskAdvisorPanel({ compact = false, maxInsights = 4, className }: RiskAdvisorPanelProps) {
  const [insights] = useState(() => generateInsights());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const getTypeIcon = (type: Insight['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />;
      case 'trend':
        return <TrendingUp className="w-4 h-4" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4" />;
      case 'observation':
        return <Shield className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Insight['type'], priority: Insight['priority']) => {
    if (priority === 'high') {
      return 'bg-risk-critical/15 text-red-400 border-risk-critical/40';
    }
    switch (type) {
      case 'alert':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'trend':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
      case 'recommendation':
        return 'bg-accent-primary/15 text-accent-primary border-accent-primary/40';
      case 'observation':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
    }
  };

  const displayedInsights = insights.slice(0, maxInsights);

  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        {displayedInsights.map((insight) => (
          <div
            key={insight.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-navy-800/40 border border-navy-700/50 hover:bg-navy-800/60 transition-colors cursor-pointer"
          >
            <div className={cn('p-1.5 rounded-lg border', getTypeColor(insight.type, insight.priority))}>
              {getTypeIcon(insight.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy-100 mb-0.5">{insight.title}</p>
              <p className="text-xs text-navy-400 line-clamp-2">{insight.message}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-navy-500 mt-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('glass-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-navy-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30">
            <Bot className="w-5 h-5 text-accent-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-100 flex items-center gap-2">
              AI Risk Advisor
              <Sparkles className="w-4 h-4 text-accent-primary" />
            </h2>
            <p className="text-xs text-navy-400">Intelligent insights from your risk data</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 transition-colors"
        >
          <RefreshCw className={cn('w-5 h-5', isRefreshing && 'animate-spin')} />
        </button>
      </div>

      {/* Insights */}
      <div className="p-5 space-y-4">
        {displayedInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50 hover:border-navy-600/50 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={cn('p-2 rounded-lg border', getTypeColor(insight.type, insight.priority))}>
                {getTypeIcon(insight.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-navy-100">{insight.title}</h3>
                  {insight.priority === 'high' && (
                    <span className="px-1.5 py-0.5 text-2xs font-medium rounded bg-risk-critical/20 text-red-400">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-sm text-navy-400 leading-relaxed">{insight.message}</p>
              </div>
            </div>

            {insight.action && (
              <button className="flex items-center gap-2 text-sm font-medium text-accent-primary hover:text-accent-primary/80 transition-colors">
                {insight.action}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-navy-700/50 bg-navy-800/20">
        <div className="flex items-center justify-between">
          <p className="text-xs text-navy-500">
            Analysis based on {risks.length} risks, {kris.length} KRIs, and {riskAppetite.length} appetite categories
          </p>
          <button className="text-sm font-medium text-accent-primary hover:text-accent-primary/80 transition-colors flex items-center gap-1">
            View Full Analysis
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
