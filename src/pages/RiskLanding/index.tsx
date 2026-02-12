import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Upload,
  FileSpreadsheet,
  FileText,
  FileType,
  ArrowRight,
  Sparkles,
  Shield,
  Target,
  BarChart3,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { cn } from '../../utils';

type ContextType = 'project' | 'programme' | 'business_unit' | 'enterprise';

interface ContextOption {
  type: ContextType;
  label: string;
  description: string;
  icon: React.ElementType;
}

const contextOptions: ContextOption[] = [
  {
    type: 'project',
    label: 'Project',
    description: 'Single initiative with defined scope and timeline',
    icon: Target,
  },
  {
    type: 'programme',
    label: 'Programme',
    description: 'Collection of related projects with shared objectives',
    icon: BarChart3,
  },
  {
    type: 'business_unit',
    label: 'Business Unit',
    description: 'Departmental or divisional risk assessment',
    icon: Shield,
  },
  {
    type: 'enterprise',
    label: 'Enterprise',
    description: 'Organization-wide strategic risk analysis',
    icon: Sparkles,
  },
];

const features = [
  'Structured 8-phase interrogation flow',
  'Six Constraints Framework',
  'Monte Carlo & Bow-Tie analysis',
  'KRI/KCI builder with live scoring',
];

const fileTypes = [
  { icon: FileSpreadsheet, label: 'Excel', ext: '.xlsx, .xls' },
  { icon: FileSpreadsheet, label: 'CSV', ext: '.csv' },
  { icon: FileType, label: 'PDF', ext: '.pdf' },
  { icon: FileText, label: 'Word', ext: '.docx' },
];

export default function RiskLanding() {
  const navigate = useNavigate();
  const [showContextModal, setShowContextModal] = useState(false);
  const [selectedContext, setSelectedContext] = useState<ContextType | null>(null);
  const [isHoveringAdvisor, setIsHoveringAdvisor] = useState(false);

  const handleStartAdvisor = () => {
    setShowContextModal(true);
  };

  const handleContextSelect = (context: ContextType) => {
    setSelectedContext(context);
  };

  const handleProceedWithContext = () => {
    if (selectedContext) {
      // Store context in session/state and navigate
      sessionStorage.setItem('riskContext', selectedContext);
      navigate('/dashboard/ai-advisor?mode=interrogation');
    }
  };

  const handleUpload = () => {
    navigate('/dashboard/risk-workspace');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 border-b border-navy-800/50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-red-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Lumina R</h1>
              <p className="text-xs text-navy-400">Risk Intelligence Engine</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-navy-400 hover:text-navy-200 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </header>

      {/* Main Split Panel */}
      <main className="flex-1 flex">
        {/* LEFT PANEL - AI Risk Advisor */}
        <div
          className={cn(
            'flex-1 p-8 lg:p-12 flex flex-col justify-center items-center border-r border-navy-800/50 transition-all duration-300',
            isHoveringAdvisor ? 'bg-accent-primary/5' : 'bg-navy-950'
          )}
          onMouseEnter={() => setIsHoveringAdvisor(true)}
          onMouseLeave={() => setIsHoveringAdvisor(false)}
        >
          <div className="max-w-md text-center">
            {/* Animated Icon */}
            <div
              className={cn(
                'w-24 h-24 rounded-2xl mx-auto mb-8 flex items-center justify-center transition-all duration-500',
                isHoveringAdvisor
                  ? 'bg-gradient-to-br from-accent-primary to-red-600 shadow-lg shadow-accent-primary/30 scale-110'
                  : 'bg-gradient-to-br from-accent-primary/80 to-red-600/80'
              )}
            >
              <Bot
                className={cn(
                  'w-12 h-12 text-white transition-transform duration-500',
                  isHoveringAdvisor && 'animate-pulse'
                )}
              />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">AI Risk Advisor</h2>
            <p className="text-lg text-navy-300 mb-6">
              Guided interrogation through 8 structured phases.
              Build a complete risk profile from objectives to simulations.
            </p>

            {/* Feature List */}
            <div className="mb-8 space-y-2">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-navy-400">
                  <CheckCircle className="w-4 h-4 text-accent-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartAdvisor}
              className={cn(
                'group px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center gap-3 mx-auto',
                isHoveringAdvisor
                  ? 'bg-gradient-to-r from-accent-primary to-red-600 shadow-lg shadow-accent-primary/30 scale-105'
                  : 'bg-accent-primary hover:bg-accent-primary/90'
              )}
            >
              <Zap className="w-5 h-5" />
              Start AI Advisor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - Upload / Enter Risk Data */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center items-center bg-navy-900/30">
          <div className="max-w-md text-center">
            {/* Icon */}
            <div className="w-24 h-24 rounded-2xl bg-navy-800/50 border border-navy-700/50 mx-auto mb-8 flex items-center justify-center">
              <Upload className="w-12 h-12 text-navy-400" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">Upload Risk Data</h2>
            <p className="text-lg text-navy-300 mb-6">
              Import existing risk registers or data files.
              AI will auto-parse, validate, and fill any gaps.
            </p>

            {/* File Types */}
            <div className="mb-8 grid grid-cols-2 gap-3">
              {fileTypes.map((type, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-navy-800/30 border border-navy-700/50 flex items-center gap-3"
                >
                  <type.icon className="w-5 h-5 text-navy-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-navy-200">{type.label}</p>
                    <p className="text-2xs text-navy-500">{type.ext}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpload}
              className="group px-8 py-4 rounded-xl font-semibold text-white bg-navy-700 hover:bg-navy-600 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <Upload className="w-5 h-5" />
              Upload Files
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* Context Selection Modal */}
      {showContextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-accent-primary/20 mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-accent-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Select Context</h3>
              <p className="text-navy-400">
                Choose the scope of your risk assessment. This cannot be changed once you begin.
              </p>
            </div>

            {/* Context Options */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {contextOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => handleContextSelect(option.type)}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all',
                    selectedContext === option.type
                      ? 'border-accent-primary bg-accent-primary/10'
                      : 'border-navy-700 bg-navy-800/30 hover:border-navy-600'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={cn(
                        'p-2 rounded-lg',
                        selectedContext === option.type
                          ? 'bg-accent-primary/20'
                          : 'bg-navy-700/50'
                      )}
                    >
                      <option.icon
                        className={cn(
                          'w-5 h-5',
                          selectedContext === option.type
                            ? 'text-accent-primary'
                            : 'text-navy-400'
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        'font-semibold',
                        selectedContext === option.type ? 'text-accent-primary' : 'text-white'
                      )}
                    >
                      {option.label}
                    </span>
                  </div>
                  <p className="text-sm text-navy-400">{option.description}</p>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowContextModal(false)}
                className="px-6 py-3 rounded-lg text-navy-400 hover:text-navy-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedWithContext}
                disabled={!selectedContext}
                className={cn(
                  'px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all',
                  selectedContext
                    ? 'bg-accent-primary text-white hover:bg-accent-primary/90'
                    : 'bg-navy-700 text-navy-500 cursor-not-allowed'
                )}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
