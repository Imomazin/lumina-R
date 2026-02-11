import { useState } from 'react';
import { Bot, Send, BookOpen, TrendingUp, Shield, AlertTriangle, MessageSquare, Workflow, Plus } from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { RiskAdvisorPanel } from '../../ai';
import { risks, kris, riskAppetite } from '../../data';
import { cn } from '../../utils';
import RiskInterrogation from './RiskInterrogation';

const suggestedQuestions = [
  'What are the top 3 risks I should focus on this week?',
  'Which KRIs are trending in the wrong direction?',
  'Summarize our cyber risk posture',
  'What actions should we take for breached appetite?',
  'Give me a board-ready risk summary',
];

const conversationHistory = [
  {
    role: 'assistant',
    content: `Good morning. Based on my analysis of your current risk portfolio, here are the key items requiring your attention:

**Critical Findings:**
1. **Vulnerability Remediation KRI** has breached red threshold (68% vs 70% minimum)
2. **Cyber Risk Appetite** has exceeded tolerance limits (52% vs 45% max)
3. **Third-Party Vendor Data Breach** risk showing increasing trend

**Recommended Actions:**
- Convene InfoSec team to address vulnerability backlog
- Escalate cyber appetite breach to Risk Committee
- Review vendor security assessments for critical suppliers

Would you like me to elaborate on any of these findings?`,
  },
];

type TabType = 'chat' | 'interrogation';

export default function AIAdvisor() {
  const [activeTab, setActiveTab] = useState<TabType>('interrogation');
  const [query, setQuery] = useState('');
  const [isLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // In a real app, this would call an AI API
    setQuery('');
  };

  // Quick insights data
  const criticalRisks = risks.filter(r => r.severity === 'critical').length;
  const breachedKRIs = kris.filter(k => k.status === 'red').length;
  const breachedAppetites = riskAppetite.filter(a => a.status === 'breached').length;
  const increasingRisks = risks.filter(r => r.trend === 'increasing').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Risk Advisor"
        subtitle="Structured risk interrogation and intelligent insights"
        actions={
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Assessment
          </button>
        }
      />

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-navy-700/50 pb-4">
        <button
          onClick={() => setActiveTab('interrogation')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all',
            activeTab === 'interrogation'
              ? 'bg-accent-primary text-white'
              : 'bg-navy-800/50 text-navy-400 hover:text-navy-200 hover:bg-navy-800'
          )}
        >
          <Workflow className="w-4 h-4" />
          Risk Interrogation
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all',
            activeTab === 'chat'
              ? 'bg-accent-primary text-white'
              : 'bg-navy-800/50 text-navy-400 hover:text-navy-200 hover:bg-navy-800'
          )}
        >
          <MessageSquare className="w-4 h-4" />
          Chat Assistant
        </button>
      </div>

      {activeTab === 'interrogation' ? (
        <RiskInterrogation />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Insights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 border-l-4 border-l-red-500">
                <div className="flex items-center gap-2 text-red-400 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-2xl font-bold">{criticalRisks}</span>
                </div>
                <p className="text-xs text-navy-400">Critical Risks</p>
              </div>
              <div className="glass-card p-4 border-l-4 border-l-amber-500">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-2xl font-bold">{breachedKRIs}</span>
                </div>
                <p className="text-xs text-navy-400">KRIs Breached</p>
              </div>
              <div className="glass-card p-4 border-l-4 border-l-orange-500">
                <div className="flex items-center gap-2 text-orange-400 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-2xl font-bold">{breachedAppetites}</span>
                </div>
                <p className="text-xs text-navy-400">Appetite Breaches</p>
              </div>
              <div className="glass-card p-4 border-l-4 border-l-purple-500">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-2xl font-bold">{increasingRisks}</span>
                </div>
                <p className="text-xs text-navy-400">Increasing Risks</p>
              </div>
            </div>

            {/* Conversation */}
            <SectionCard noPadding>
              <div className="flex items-center gap-3 p-5 border-b border-navy-700/50">
                <div className="p-2 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30">
                  <Bot className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-navy-100">Risk Analysis Session</h3>
                  <p className="text-xs text-navy-400">Analyzing {risks.length} risks, {kris.length} KRIs</p>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-6 max-h-[500px] overflow-y-auto">
                {conversationHistory.map((msg, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="p-2 rounded-lg bg-accent-primary/10 h-fit">
                      <Bot className="w-4 h-4 text-accent-primary" />
                    </div>
                    <div className="flex-1 prose prose-sm prose-invert max-w-none">
                      <div className="text-navy-200 text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content.split('\n').map((line, j) => {
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={j} className="font-semibold text-navy-100 mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
                          }
                          if (line.startsWith('- ')) {
                            return <p key={j} className="ml-4 text-navy-300">{line}</p>;
                          }
                          return <p key={j}>{line}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-5 border-t border-navy-700/50">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about risks, KRIs, or get recommendations..."
                    className="flex-1 px-4 py-3 bg-navy-800/50 border border-navy-700 rounded-xl text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="btn-primary px-4"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>

                {/* Suggested Questions */}
                <div className="mt-4">
                  <p className="text-xs text-navy-500 mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.slice(0, 3).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(q)}
                        className="px-3 py-1.5 rounded-lg bg-navy-800/50 text-xs text-navy-300 hover:bg-navy-700/50 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Real-time Insights */}
            <RiskAdvisorPanel maxInsights={4} />

            {/* Capabilities */}
            <SectionCard title="AI Capabilities">
              <div className="space-y-3">
                {[
                  { icon: TrendingUp, label: 'Trend Analysis', desc: 'Identify patterns in risk data' },
                  { icon: AlertTriangle, label: 'Risk Detection', desc: 'Flag emerging threats' },
                  { icon: Shield, label: 'Control Assessment', desc: 'Evaluate mitigation effectiveness' },
                  { icon: BookOpen, label: 'Report Generation', desc: 'Create executive summaries' },
                ].map((cap, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-navy-800/30">
                    <cap.icon className="w-5 h-5 text-accent-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-navy-200">{cap.label}</p>
                      <p className="text-xs text-navy-500">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
}
