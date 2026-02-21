import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Upload, PlusCircle } from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { RiskAdvisorPanel } from '../../ai';
import { processMessage, getSuggestedQuestions } from '../../ai/chatEngine';
import { callAIStreaming, isAIConfigured, setApiKey, clearApiKey, resetConversation } from '../../ai/aiService';
import { enterpriseRisks } from '../../data/enterpriseRisks';
import { enterpriseKRIs, getKRIStats } from '../../data/enterpriseKRIs';
import { getControlStats } from '../../data/enterpriseControls';
import { cn } from '../../utils';
import { useData } from '../../context/DataContext';
import RiskInterrogation from './RiskInterrogation';

type TabType = 'chat' | 'interrogation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function AIAdvisor() {
  const navigate = useNavigate();
  const { activateData, resetAllData, isDataActive } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiConnected, setAiConnected] = useState(isAIConfigured());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Quick insights data - show zeros when data is not active
  const kriStats = getKRIStats();
  const controlStats = getControlStats();
  const criticalRisks = isDataActive ? enterpriseRisks.filter(r => r.inherentRiskScore >= 16).length : 0;
  const breachedKRIs = isDataActive ? kriStats.byStatus.red : 0;
  const outsideAppetite = isDataActive ? enterpriseRisks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length : 0;
  const escalatedRisks = isDataActive ? enterpriseRisks.filter(r => r.riskStatus === 'Escalated').length : 0;

  // Data counts for display
  const riskCount = isDataActive ? enterpriseRisks.length : 0;
  const kriCount = isDataActive ? enterpriseKRIs.length : 0;
  const controlCount = isDataActive ? controlStats.total : 0;

  // Initialize
  useEffect(() => {
    setAiConnected(isAIConfigured());
    if (messages.length === 0) {
      if (isAIConfigured() && isDataActive) {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: `**LUMINA-R Risk Intelligence Engine Active**\n\nI am your Chief Risk Intelligence Engine, operating on a five-layer reasoning system grounded in your live risk data.\n\n**Current Portfolio:** ${riskCount} risks | ${kriCount} KRIs | ${controlCount} controls\n**Attention:** ${breachedKRIs} KRIs breached | ${escalatedRisks} risks escalated | ${outsideAppetite} outside appetite\n\nI can perform executive summaries, EMV calculations, Monte Carlo analysis, appetite breach quantification, control gap analysis, and risk cluster detection.\n\nWhat would you like to analyse?`
        }]);
      } else {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: `**LUMINA-R Risk Intelligence Engine**\n\nTo begin analysis:\n1. **Upload your risk data** via the Risk Workspace, or\n2. **Connect your OpenAI API key** to engage with demo data\n\nOnce data is loaded, I will operate as your Chief Risk Intelligence Engine with:\n- Five-layer reasoning (Structural, Quantitative, Strategic, Governance, Action)\n- EMV calculations grounded in your risk portfolio\n- Monte Carlo simulation, cluster detection, and appetite breach analysis\n- Board-ready executive outputs\n\n**Current Status:** No data loaded. Upload data or connect AI to begin.`
        }]);
      }
    }
  }, [isDataActive]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConnectKey = () => {
    if (!keyInput.trim()) return;
    setApiKey(keyInput.trim());
    setAiConnected(true);
    setShowKeyInput(false);
    setKeyInput('');
    setAiError(null);
    resetConversation();
    activateData(); // Activate demo data when AI connects
    setMessages([{
      id: 'connected',
      role: 'assistant',
      content: `**AI Engine Connected**\n\nLumina-R Risk Intelligence Engine is now active with GPT-4o.\n\n**Portfolio loaded:** ${enterpriseRisks.length} risks, ${enterpriseKRIs.length} KRIs, ${controlStats.total} controls, ${getKRIStats().byStatus.red} breached KRIs.\n\nAll responses will use the five-layer reasoning system grounded in your live data. Ask me anything about your risk portfolio.`
    }]);
  };

  // Reset all analysis data to start fresh
  const handleResetAnalysis = () => {
    resetAllData();
    resetConversation();
    setMessages([{
      id: 'reset',
      role: 'assistant',
      content: `**Analysis Reset Complete**\n\nAll risk data has been cleared. The dashboard and all metrics are now at zero.\n\nTo begin a new analysis:\n- Upload your risk data via the Risk Workspace\n- Or connect your OpenAI API key to engage with demo data\n\nReady for your next analysis session.`
    }]);
  };

  const handleDisconnect = () => {
    clearApiKey();
    setAiConnected(false);
    resetConversation();
    setAiError(null);
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);
    setAiError(null);

    if (aiConnected) {
      // Real AI streaming
      const aiMsgId = `ai-${Date.now()}`;
      setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', isStreaming: true }]);

      try {
        await callAIStreaming(
          text,
          (chunk) => {
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: chunk } : m));
          },
          () => {
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m));
            setIsLoading(false);
          }
        );
      } catch (err: any) {
        const errorMsg = err?.message || 'Unknown error';
        // If API key is invalid, show error and fall back
        if (errorMsg.includes('401') || errorMsg.includes('Incorrect API key')) {
          setAiError('Invalid API key. Please check and reconnect.');
          setMessages(prev => prev.filter(m => m.id !== aiMsgId));
          handleDisconnect();
        } else {
          setMessages(prev => prev.map(m => m.id === aiMsgId
            ? { ...m, content: `**Error:** ${errorMsg}\n\nFalling back to local analysis...`, isStreaming: false }
            : m
          ));
        }
        setIsLoading(false);
      }
    } else {
      // Fallback to local engine
      await new Promise(resolve => setTimeout(resolve, 300));
      const response = processMessage(text);
      setMessages(prev => [...prev, {
        id: response.id,
        role: 'assistant',
        content: response.content,
      }]);
      setIsLoading(false);
    }
  }, [aiConnected, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(query);
  };

  const handleQuickCommand = (cmd: string) => {
    sendMessage(cmd);
  };

  // Markdown-style renderer
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.trim() === '---') {
        return <hr key={i} className="border-navy-700/50 my-3" />;
      }
      // ### Headers
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-sm font-bold text-navy-100 mt-3 mb-1">{line.slice(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-base font-bold text-accent-primary mt-4 mb-2">{line.slice(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-lg font-bold text-accent-primary mt-4 mb-2">{line.slice(2)}</h1>;
      }
      // Bold standalone line
      if (line.startsWith('**') && line.endsWith('**') && !line.includes('**', 2)) {
        const text = line.slice(2, -2);
        if (text === text.toUpperCase() || text.includes('EXECUTIVE') || text.includes('QUANTITATIVE') || text.includes('DECISION') || text.includes('GOVERNANCE') || text.includes('Board Ready')) {
          return <p key={i} className="font-bold text-accent-primary mt-4 mb-2 text-xs uppercase tracking-widest">{text}</p>;
        }
        return <p key={i} className="font-bold text-navy-100 mt-3 mb-1 text-sm">{text}</p>;
      }
      // Lines with bold segments
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-navy-200 my-0.5 text-sm leading-relaxed">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-navy-100 font-semibold">{part}</strong> : part)}
          </p>
        );
      }
      // Numbered items
      if (line.match(/^\d+\.\s/)) {
        return <p key={i} className="text-navy-200 my-1 ml-2 text-sm">{line}</p>;
      }
      // Sub-bullets (indented)
      if (line.match(/^\s{2,}-\s/)) {
        return <p key={i} className="text-navy-400 my-0.5 ml-8 text-xs">{line.trim()}</p>;
      }
      // Bullets
      if (line.startsWith('- ')) {
        return <p key={i} className="text-navy-300 my-0.5 ml-4 text-sm">{line}</p>;
      }
      if (!line.trim()) return <div key={i} className="h-2" />;
      return <p key={i} className="text-navy-200 my-0.5 text-sm leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Risk Advisor"
        subtitle="Five-Layer Risk Reasoning Engine powered by GPT-4o"
        actions={
          <div className="flex items-center gap-3">
            {aiConnected && (
              <span className="flex items-center gap-2 text-xs text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                AI Connected
              </span>
            )}
            {isDataActive && (
              <button
                onClick={handleResetAnalysis}
                className="btn-secondary flex items-center gap-2"
                title="Reset all data to zero for new analysis"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Analysis
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard/risk-workspace')}
              className="btn-secondary flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Data
            </button>
            <button className="btn-primary flex items-center gap-2" onClick={() => setActiveTab('interrogation')}>
              <PlusCircle className="w-4 h-4" />
              New Assessment
            </button>
          </div>
        }
      />

      {/* API Key Error Banner */}
      {aiError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
          {aiError}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-navy-700/50 pb-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            'px-4 py-2.5 rounded-lg font-medium transition-all',
            activeTab === 'chat'
              ? 'bg-accent-primary text-white'
              : 'bg-navy-800/50 text-navy-400 hover:text-navy-200 hover:bg-navy-800'
          )}
        >
          AI Chat
        </button>
        <button
          onClick={() => setActiveTab('interrogation')}
          className={cn(
            'px-4 py-2.5 rounded-lg font-medium transition-all',
            activeTab === 'interrogation'
              ? 'bg-accent-primary text-white'
              : 'bg-navy-800/50 text-navy-400 hover:text-navy-200 hover:bg-navy-800'
          )}
        >
          Risk Interrogation
        </button>
      </div>

      {activeTab === 'interrogation' ? (
        <RiskInterrogation />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 border-l-4 border-l-red-500">
                <span className="text-2xl font-bold text-red-400">{criticalRisks}</span>
                <p className="text-xs text-navy-400">Critical Risks</p>
              </div>
              <div className="glass-card p-4 border-l-4 border-l-amber-500">
                <span className="text-2xl font-bold text-amber-400">{breachedKRIs}</span>
                <p className="text-xs text-navy-400">KRIs Breached</p>
              </div>
              <div className="glass-card p-4 border-l-4 border-l-orange-500">
                <span className="text-2xl font-bold text-orange-400">{outsideAppetite}</span>
                <p className="text-xs text-navy-400">Outside Appetite</p>
              </div>
              <div className="glass-card p-4 border-l-4 border-l-purple-500">
                <span className="text-2xl font-bold text-purple-400">{escalatedRisks}</span>
                <p className="text-xs text-navy-400">Escalated</p>
              </div>
            </div>

            {/* Chat */}
            <SectionCard noPadding>
              <div className="flex items-center justify-between p-5 border-b border-navy-700/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-xl border ai-advisor-icon-glow',
                    aiConnected
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30'
                      : 'bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border-accent-primary/30'
                  )}>
                    <span className={cn('text-sm font-bold', aiConnected ? 'text-green-400' : 'text-accent-primary')}>AI</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-navy-100">
                      {aiConnected ? 'GPT-4o Risk Intelligence' : 'Risk Advisor (Local)'}
                    </h3>
                    <p className="text-xs text-navy-400">
                      {aiConnected && isDataActive
                        ? `Live AI · ${riskCount} risks · ${kriCount} KRIs · ${controlCount} controls loaded`
                        : aiConnected
                          ? 'AI connected · Upload data to begin analysis'
                          : 'Connect OpenAI key or upload data to begin'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    resetConversation();
                    setMessages([]);
                    // Re-trigger welcome
                    setTimeout(() => {
                      setMessages([{
                        id: 'welcome-' + Date.now(),
                        role: 'assistant',
                        content: aiConnected
                          ? `**Conversation Reset**\n\nReady for new analysis. Your full risk portfolio is loaded.\n\nWhat would you like to investigate?`
                          : `**Reset**\n\nLocal analysis mode. Connect an API key for intelligent responses.`
                      }]);
                    }, 100);
                  }}
                  className="p-2 rounded-lg hover:bg-navy-800/50 text-navy-400 hover:text-navy-200 transition-colors text-xs"
                >
                  Reset
                </button>
              </div>

              {/* Messages */}
              <div ref={chatContainerRef} className="p-5 space-y-5 max-h-[600px] overflow-y-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                    <div className={cn(
                      'p-2 rounded-lg h-fit font-bold text-xs shrink-0',
                      msg.role === 'user' ? 'bg-accent-primary/20 text-accent-primary' : aiConnected ? 'bg-green-500/10 text-green-400' : 'bg-accent-primary/10 text-accent-primary'
                    )}>
                      {msg.role === 'user' ? 'You' : 'AI'}
                    </div>
                    <div className={cn('flex-1 max-w-[90%]', msg.role === 'user' ? 'text-right' : '')}>
                      {msg.role === 'user' ? (
                        <div className="inline-block px-4 py-2.5 rounded-xl bg-accent-primary/20 text-navy-100 text-sm">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="text-sm leading-relaxed">
                          {renderContent(msg.content)}
                          {msg.isStreaming && (
                            <span className="inline-block w-2 h-4 bg-accent-primary animate-pulse ml-1" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && !messages.some(m => m.isStreaming) && (
                  <div className="flex gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 h-fit font-bold text-xs text-green-400 animate-pulse">AI</div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-navy-800/50">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-navy-400">Reasoning across risk data...</span>
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
                    placeholder={aiConnected
                      ? 'Ask anything about your risk portfolio...'
                      : 'Connect API key for AI responses, or use quick commands...'
                    }
                    className="flex-1 px-4 py-3 bg-navy-800/50 border border-navy-700 rounded-xl text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="btn-primary px-5"
                  >
                    {isLoading ? '...' : 'Send'}
                  </button>
                </form>

                {/* Suggested prompts */}
                <div className="mt-4">
                  <p className="text-xs text-navy-500 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {getSuggestedQuestions().slice(0, 4).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickCommand(q)}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-lg bg-navy-800/50 text-xs text-navy-300 hover:bg-navy-700/50 hover:text-navy-100 transition-colors disabled:opacity-50"
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
            {/* AI Connection */}
            <SectionCard title="AI Connection">
              {aiConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-green-300">GPT-4o Connected</p>
                      <p className="text-xs text-navy-400">Five-layer reasoning active</p>
                    </div>
                  </div>
                  <p className="text-xs text-navy-400">
                    Your full risk portfolio ({enterpriseRisks.length} risks, {enterpriseKRIs.length} KRIs, {controlStats.total} controls) is loaded into the AI context.
                  </p>
                  <button
                    onClick={handleDisconnect}
                    className="w-full text-xs text-navy-500 hover:text-red-400 transition-colors py-2"
                  >
                    Disconnect API Key
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-navy-800/50 border border-navy-700/50">
                    <span className="w-3 h-3 rounded-full bg-navy-600" />
                    <div>
                      <p className="text-sm font-medium text-navy-300">Not Connected</p>
                      <p className="text-xs text-navy-500">Using local analysis only</p>
                    </div>
                  </div>
                  {showKeyInput ? (
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="sk-..."
                        className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleConnectKey(); }}
                      />
                      <div className="flex gap-2">
                        <button onClick={handleConnectKey} className="btn-primary text-xs py-2 flex-1">
                          Connect
                        </button>
                        <button onClick={() => setShowKeyInput(false)} className="btn-secondary text-xs py-2">
                          Cancel
                        </button>
                      </div>
                      <p className="text-xs text-navy-500">Key stored locally in browser only. Never sent to our servers.</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowKeyInput(true)}
                      className="w-full btn-primary text-sm py-2.5"
                    >
                      Connect OpenAI API Key
                    </button>
                  )}
                </div>
              )}
            </SectionCard>

            {/* Insights */}
            <RiskAdvisorPanel maxInsights={3} />

            {/* Quick Commands */}
            <SectionCard title="Quick Commands">
              <div className="space-y-1.5">
                {[
                  'Give me a board-ready executive summary of our risk posture',
                  'What are the top 5 risks by EMV and what investment is needed?',
                  'Which KRIs are breached and trending adversely?',
                  'Run Monte Carlo analysis on the full portfolio',
                  'Quantify the appetite breaches with remediation costs',
                  'Where are our biggest control effectiveness gaps?',
                  'Identify correlated risk clusters across the portfolio',
                  'What needs urgent attention in the next 7 days?',
                ].map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickCommand(cmd)}
                    disabled={isLoading}
                    className="w-full text-left px-3 py-2 rounded-lg bg-navy-800/30 text-xs text-navy-300 hover:bg-navy-700/50 hover:text-navy-100 transition-colors disabled:opacity-50"
                  >
                    {cmd}
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
