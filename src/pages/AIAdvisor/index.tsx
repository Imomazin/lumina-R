import { useState, useRef, useEffect } from 'react';
import { Bot, Send, BookOpen, TrendingUp, Shield, AlertTriangle, MessageSquare, Workflow, Plus, Upload, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, SectionCard } from '../../components';
import { RiskAdvisorPanel } from '../../ai';
import { processMessage, getSuggestedQuestions } from '../../ai/chatEngine';
import type { ChatMessage } from '../../ai/chatEngine';
import { enterpriseRisks } from '../../data/enterpriseRisks';
import { enterpriseKRIs, getKRIStats } from '../../data/enterpriseKRIs';
import { getControlStats } from '../../data/enterpriseControls';
import { cn } from '../../utils';
import RiskInterrogation from './RiskInterrogation';

type TabType = 'chat' | 'interrogation';

export default function AIAdvisor() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasData] = useState(true); // Set to false to show upload prompt
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = processMessage('hello');
      setMessages([welcomeMessage]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const response = processMessage(query);
    setMessages(prev => [...prev, response]);
    setIsLoading(false);
  };

  const handleSuggestionClick = (question: string) => {
    setQuery(question);
  };

  // Quick insights data
  const kriStats = getKRIStats();
  const controlStats = getControlStats();
  const criticalRisks = enterpriseRisks.filter(r => r.inherentRiskScore >= 16).length;
  const breachedKRIs = kriStats.byStatus.red;
  const outsideAppetite = enterpriseRisks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length;
  const escalatedRisks = enterpriseRisks.filter(r => r.riskStatus === 'Escalated').length;

  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-navy-100 mt-4 mb-2 text-base">{line.replace(/\*\*/g, '')}</p>;
      }
      // Bold sections
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-navy-200 my-1">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-navy-100">{part}</strong> : part)}
          </p>
        );
      }
      // List items
      if (line.match(/^\d+\./)) {
        return <p key={i} className="text-navy-300 my-2 ml-2">{line}</p>;
      }
      if (line.startsWith('- ')) {
        return <p key={i} className="text-navy-300 my-1 ml-4">{line}</p>;
      }
      if (line.startsWith('├─') || line.startsWith('└─')) {
        return <p key={i} className="text-navy-400 my-0.5 ml-6 font-mono text-xs">{line}</p>;
      }
      // Empty lines
      if (!line.trim()) {
        return <br key={i} />;
      }
      return <p key={i} className="text-navy-200 my-1">{line}</p>;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Risk Advisor"
        subtitle="Intelligent risk analysis and structured interrogation"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/workspace')}
              className="btn-secondary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </button>
            <button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </button>
          </div>
        }
      />

      {/* Data Upload CTA Banner - Shows when no data */}
      {!hasData && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 p-6 animate-pulse-glow">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <Upload className="w-7 h-7 text-amber-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-100">No Risk Data Detected</h3>
                <p className="text-sm text-navy-400 mt-1">
                  Upload your risk register, KRIs, and controls to unlock AI-powered analysis
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-navy-500">
                  <span>Supports: Excel, CSV, PDF</span>
                  <span>|</span>
                  <span>Auto-maps to Lumina-R schema</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/workspace')}
              className="btn-primary text-base px-6 py-3"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Risk Data
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-navy-700/50 pb-4">
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
                <p className="text-xs text-navy-400">High Score Risks</p>
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
                  <span className="text-2xl font-bold">{outsideAppetite}</span>
                </div>
                <p className="text-xs text-navy-400">Outside Appetite</p>
              </div>
              <div className="glass-card p-4 border-l-4 border-l-purple-500">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-2xl font-bold">{escalatedRisks}</span>
                </div>
                <p className="text-xs text-navy-400">Escalated</p>
              </div>
            </div>

            {/* Conversation */}
            <SectionCard noPadding>
              <div className="flex items-center justify-between p-5 border-b border-navy-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 ai-advisor-icon-glow">
                    <Bot className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-navy-100">Intelligent Risk Advisor</h3>
                    <p className="text-xs text-navy-400">Analyzing {enterpriseRisks.length} risks, {enterpriseKRIs.length} KRIs, {controlStats.total} controls</p>
                  </div>
                </div>
                <button
                  onClick={() => setMessages([processMessage('hello')])}
                  className="p-2 rounded-lg hover:bg-navy-800/50 text-navy-400 hover:text-navy-200 transition-colors"
                  title="Reset conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-6 max-h-[500px] overflow-y-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                    <div className={cn(
                      'p-2 rounded-lg h-fit',
                      msg.role === 'user' ? 'bg-accent-primary/20' : 'bg-accent-primary/10'
                    )}>
                      {msg.role === 'user' ? (
                        <Sparkles className="w-4 h-4 text-accent-primary" />
                      ) : (
                        <Bot className="w-4 h-4 text-accent-primary" />
                      )}
                    </div>
                    <div className={cn(
                      'flex-1 max-w-[85%]',
                      msg.role === 'user' ? 'text-right' : ''
                    )}>
                      {msg.role === 'user' ? (
                        <div className="inline-block px-4 py-2 rounded-xl bg-accent-primary/20 text-navy-100 text-sm">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="prose prose-sm prose-invert max-w-none">
                          <div className="text-sm leading-relaxed">
                            {renderMessageContent(msg.content)}
                          </div>
                          {msg.metadata?.suggestedActions && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {msg.metadata.suggestedActions.slice(0, 3).map((action, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSuggestionClick(action)}
                                  className="px-3 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/30 text-xs text-accent-primary hover:bg-accent-primary/20 transition-colors"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="p-2 rounded-lg bg-accent-primary/10 h-fit">
                      <Bot className="w-4 h-4 text-accent-primary animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-navy-800/50">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-navy-400">Analyzing your data...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-5 border-t border-navy-700/50">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about risks, KRIs, run simulations, or get recommendations..."
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
                  <p className="text-xs text-navy-500 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {getSuggestedQuestions().slice(0, 4).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(q)}
                        className="px-3 py-1.5 rounded-lg bg-navy-800/50 text-xs text-navy-300 hover:bg-navy-700/50 hover:text-navy-100 transition-colors"
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
                  { icon: TrendingUp, label: 'Risk Analysis', desc: 'Analyze 30 risks, 40 KRIs, 25 controls' },
                  { icon: AlertTriangle, label: 'Monte Carlo', desc: 'Run probability simulations' },
                  { icon: Shield, label: 'Bow-Tie Analysis', desc: 'Visualize cause-consequence' },
                  { icon: BookOpen, label: 'Decision Trees', desc: 'Evaluate treatment options' },
                ].map((cap, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-navy-800/30 hover:bg-navy-800/50 cursor-pointer transition-colors">
                    <cap.icon className="w-5 h-5 text-accent-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-navy-200">{cap.label}</p>
                      <p className="text-xs text-navy-500">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Quick Commands */}
            <SectionCard title="Quick Commands">
              <div className="space-y-2">
                {[
                  'Show executive summary',
                  'Top 5 urgent risks',
                  'Breached KRIs',
                  'Control effectiveness',
                  'Risk #13 details',
                ].map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(cmd)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-navy-800/30 text-xs text-navy-300 hover:bg-navy-700/50 hover:text-navy-100 transition-colors"
                  >
                    → {cmd}
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
}
