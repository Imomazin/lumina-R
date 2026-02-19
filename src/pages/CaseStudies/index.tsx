import { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Shield,
  TrendingUp,
  CreditCard,
  Landmark,
  ChevronDown,
  ArrowRight,
  Quote,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
  Clock,
  Users,
  Globe,
  Award,
  X
} from 'lucide-react';
import { cn } from '../../utils';

// Rich case study data with full narratives
const caseStudies = [
  {
    id: 'wells-fargo-transformation',
    company: 'Global Investment Bank',
    industry: 'Financial Services',
    region: 'North America',
    employeeCount: '250,000+',
    icon: Landmark,
    gradient: 'from-amber-500 to-orange-600',
    heroImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    title: 'Transforming Enterprise Risk Management for a Fortune 100 Bank',
    subtitle: 'How a leading global bank unified 47 siloed systems into one intelligent risk platform',
    executiveSummary: 'Facing mounting regulatory pressure and a fragmented technology landscape, this Fortune 100 bank embarked on a comprehensive risk transformation journey. Within 18 months, they achieved complete visibility across their $2.3T asset portfolio.',
    challenge: {
      headline: 'A Perfect Storm of Risk Complexity',
      description: 'The bank operated with 47 separate risk systems across business lines, creating dangerous blind spots and regulatory exposure.',
      points: [
        'Manual aggregation of risk data took 5+ business days',
        'Inconsistent risk taxonomies across divisions',
        'Failed 3 consecutive regulatory stress tests',
        '$180M annual spend on risk technology with declining effectiveness',
        'Key person dependency on legacy system experts'
      ],
      quote: {
        text: "We were flying blind. Our board received risk reports that were already a week old, and even then, we couldn't trust the numbers.",
        author: 'Chief Risk Officer',
        role: 'Global Investment Bank'
      }
    },
    solution: {
      headline: 'Unified Intelligence Platform',
      description: 'A phased implementation of Lumina-R transformed their risk operations from reactive to predictive.',
      phases: [
        {
          name: 'Foundation',
          duration: '3 months',
          description: 'Data integration layer connecting all 47 source systems with automated reconciliation'
        },
        {
          name: 'Intelligence',
          duration: '4 months',
          description: 'AI-powered risk analytics engine with real-time scoring and anomaly detection'
        },
        {
          name: 'Automation',
          duration: '5 months',
          description: 'Workflow automation for reporting, escalation, and regulatory submissions'
        },
        {
          name: 'Optimization',
          duration: '6 months',
          description: 'Advanced scenario modeling, stress testing, and predictive analytics deployment'
        }
      ]
    },
    outcomes: [
      { metric: 'Report Generation', before: '5 days', after: '4 hours', improvement: '96% faster' },
      { metric: 'Risk Assessment Accuracy', before: '71%', after: '94%', improvement: '+23 points' },
      { metric: 'Regulatory Findings', before: '23 issues', after: '7 issues', improvement: '70% reduction' },
      { metric: 'Annual Cost Savings', before: '$180M spend', after: '$95M spend', improvement: '$85M saved' }
    ],
    timeline: [
      { month: 'Month 1-3', event: 'Data integration complete', milestone: true },
      { month: 'Month 4-6', event: 'First automated reports generated', milestone: false },
      { month: 'Month 7-9', event: 'AI risk scoring goes live', milestone: true },
      { month: 'Month 10-12', event: 'Passed regulatory stress test', milestone: true },
      { month: 'Month 13-18', event: 'Full platform rollout to all divisions', milestone: true }
    ],
    testimonial: {
      text: "Lumina-R didn't just modernize our risk function—it transformed how our entire organization thinks about risk. For the first time, we have a true enterprise view.",
      author: 'Sarah Chen',
      role: 'Group Chief Risk Officer',
      avatar: 'SC'
    },
    tags: ['Enterprise Risk', 'AI Analytics', 'Regulatory Compliance', 'Data Integration']
  },
  {
    id: 'axa-resilience',
    company: 'European Insurance Leader',
    industry: 'Insurance',
    region: 'Europe',
    employeeCount: '150,000+',
    icon: Shield,
    gradient: 'from-blue-500 to-indigo-600',
    heroImage: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #2d2d5a 100%)',
    title: 'Building Real-Time Operational Resilience at Scale',
    subtitle: 'How Europe\'s largest insurer achieved 15-minute incident detection from 4 hours',
    executiveSummary: 'Operating across 54 countries with 100M+ customers, this insurance giant needed to transform from reactive incident management to predictive operational resilience.',
    challenge: {
      headline: 'Blind Spots in a Complex Operation',
      description: 'With operations spanning multiple continents and business lines, critical incidents often went undetected until customer complaints surfaced.',
      points: [
        'Average incident detection time exceeded 4 hours',
        '68% of major incidents discovered via customer complaints',
        'Siloed monitoring across IT, operations, and customer service',
        'No unified view of operational health across regions',
        'Business continuity plans were paper-based and untested'
      ],
      quote: {
        text: "Our biggest fear was realized when a payment processing failure affected 2 million customers before we even knew about it.",
        author: 'Head of Operations',
        role: 'European Insurance Leader'
      }
    },
    solution: {
      headline: 'Intelligent Resilience Platform',
      description: 'End-to-end operational resilience with predictive analytics and automated response.',
      phases: [
        {
          name: 'Connect',
          duration: '2 months',
          description: 'Integration with 200+ monitoring systems, customer channels, and business applications'
        },
        {
          name: 'Detect',
          duration: '3 months',
          description: 'AI-powered anomaly detection with correlation engine across all data streams'
        },
        {
          name: 'Respond',
          duration: '3 months',
          description: 'Automated playbooks, escalation workflows, and real-time command center'
        },
        {
          name: 'Prevent',
          duration: '4 months',
          description: 'Predictive failure modeling and proactive resilience testing'
        }
      ]
    },
    outcomes: [
      { metric: 'Detection Time', before: '4 hours', after: '15 min', improvement: '94% faster' },
      { metric: 'Customer Impact', before: '68% via complaints', after: '12% via complaints', improvement: '82% proactive' },
      { metric: 'Incident Recovery', before: '6 hours avg', after: '45 min avg', improvement: '87% faster' },
      { metric: 'Operational Losses', before: '$12M/year', after: '$3.8M/year', improvement: '$8.2M saved' }
    ],
    timeline: [
      { month: 'Week 1-8', event: 'Global monitoring integration', milestone: true },
      { month: 'Week 9-16', event: 'AI detection engine live', milestone: false },
      { month: 'Week 17-24', event: 'First prevented major incident', milestone: true },
      { month: 'Week 25-36', event: 'Command center operational', milestone: true },
      { month: 'Week 37-48', event: 'Predictive model deployment', milestone: true }
    ],
    testimonial: {
      text: "We went from discovering problems via angry customer calls to predicting issues before they impact anyone. That's a fundamental shift in how we operate.",
      author: 'Marcus Weber',
      role: 'Chief Operating Officer',
      avatar: 'MW'
    },
    tags: ['Operational Resilience', 'Real-Time Monitoring', 'AI Detection', 'BCM']
  },
  {
    id: 'blackrock-investment',
    company: 'Global Asset Manager',
    industry: 'Asset Management',
    region: 'Global',
    employeeCount: '18,000+',
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-600',
    heroImage: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)',
    title: 'Next-Generation Investment Risk Analytics',
    subtitle: 'Real-time portfolio risk intelligence across $340B in assets under management',
    executiveSummary: 'Managing institutional assets for sovereign wealth funds and pension plans requires impeccable risk management. This firm transformed from T+1 reporting to real-time risk intelligence.',
    challenge: {
      headline: 'Outdated Models in a Fast Market',
      description: 'Traditional risk models failed to capture rapidly evolving market dynamics and emerging asset correlations.',
      points: [
        'Risk reports delivered T+1, missing intraday exposure changes',
        'VaR models breached 34 times in one year (expected: 2-3)',
        'No coverage for alternative investments representing 40% of AUM',
        'Portfolio managers making decisions on stale risk data',
        'Model validation taking 6+ months for any updates'
      ],
      quote: {
        text: "When COVID hit, our risk models were useless. Correlations changed overnight, and we had no way to capture it.",
        author: 'Head of Risk Analytics',
        role: 'Global Asset Manager'
      }
    },
    solution: {
      headline: 'Real-Time Risk Intelligence',
      description: 'Modern risk analytics platform with ML-driven factor models and scenario analysis.',
      phases: [
        {
          name: 'Data',
          duration: '2 months',
          description: 'Real-time market data integration with position-level granularity'
        },
        {
          name: 'Models',
          duration: '4 months',
          description: 'ML-enhanced factor models with dynamic correlation estimation'
        },
        {
          name: 'Analytics',
          duration: '3 months',
          description: 'Monte Carlo simulation engine with GPU acceleration'
        },
        {
          name: 'Delivery',
          duration: '3 months',
          description: 'Real-time dashboards and API integration with trading systems'
        }
      ]
    },
    outcomes: [
      { metric: 'Risk Reporting', before: 'T+1', after: 'Real-time', improvement: 'Instant' },
      { metric: 'VaR Breaches', before: '34/year', after: '3/year', improvement: '91% reduction' },
      { metric: 'Asset Coverage', before: '60%', after: '100%', improvement: 'Full coverage' },
      { metric: 'Risk-Adjusted Return', before: 'Sharpe 0.8', after: 'Sharpe 1.2', improvement: '+50%' }
    ],
    timeline: [
      { month: 'Q1', event: 'Real-time data pipeline live', milestone: true },
      { month: 'Q2', event: 'ML factor models deployed', milestone: true },
      { month: 'Q3', event: 'Monte Carlo engine operational', milestone: false },
      { month: 'Q4', event: 'Full platform rollout', milestone: true },
      { month: 'Q5', event: 'Client portal launched', milestone: true }
    ],
    testimonial: {
      text: "Our portfolio managers now see risk the same way they see returns—in real-time. It's completely changed our investment process.",
      author: 'James Morrison',
      role: 'Global Head of Investments',
      avatar: 'JM'
    },
    tags: ['Investment Risk', 'Real-Time Analytics', 'Machine Learning', 'Monte Carlo']
  },
  {
    id: 'visa-cyber',
    company: 'Global Payment Network',
    industry: 'Payments & Fintech',
    region: 'Global',
    employeeCount: '25,000+',
    icon: CreditCard,
    gradient: 'from-violet-500 to-purple-600',
    heroImage: 'linear-gradient(135deg, #1a0033 0%, #2d004d 50%, #4a0080 100%)',
    title: 'Cyber Risk Excellence in Payment Processing',
    subtitle: 'Protecting $15 trillion in annual payment volume with AI-driven security',
    executiveSummary: 'Processing payments for 3.5 billion cardholders requires world-class cyber defense. This payment network achieved 45-second threat detection from a 23-hour baseline.',
    challenge: {
      headline: 'The Ultimate Target',
      description: 'As one of the world\'s largest payment processors, they faced sophisticated attacks from nation-states and organized crime.',
      points: [
        '15M+ daily security alerts creating severe analyst fatigue',
        'Mean time to detect threats averaged 23 hours',
        '68% false positive rate wasting analyst resources',
        'Critical vulnerabilities taking 45 days to remediate',
        'Siloed security tools with no unified threat view'
      ],
      quote: {
        text: "Every second of undetected compromise could mean millions of cards exposed. The stakes couldn't be higher.",
        author: 'Chief Information Security Officer',
        role: 'Global Payment Network'
      }
    },
    solution: {
      headline: 'AI-Powered Cyber Defense',
      description: 'Integrated cyber risk platform with automated threat detection and response.',
      phases: [
        {
          name: 'Unify',
          duration: '2 months',
          description: 'Security data lake integrating 50+ security tools and threat feeds'
        },
        {
          name: 'Analyze',
          duration: '3 months',
          description: 'ML-based threat detection with behavioral analysis and correlation'
        },
        {
          name: 'Prioritize',
          duration: '2 months',
          description: 'Risk-based alert scoring reducing noise and highlighting critical threats'
        },
        {
          name: 'Automate',
          duration: '3 months',
          description: 'Automated response playbooks and vulnerability orchestration'
        }
      ]
    },
    outcomes: [
      { metric: 'Threat Detection', before: '23 hours', after: '45 seconds', improvement: '99.9% faster' },
      { metric: 'False Positive Rate', before: '68%', after: '8%', improvement: '88% reduction' },
      { metric: 'Vulnerability Remediation', before: '45 days', after: '3 days', improvement: '93% faster' },
      { metric: 'Security Incidents', before: '142/year', after: '31/year', improvement: '78% reduction' }
    ],
    timeline: [
      { month: 'Month 1-2', event: 'Security data lake operational', milestone: true },
      { month: 'Month 3-5', event: 'ML threat detection live', milestone: true },
      { month: 'Month 6-7', event: 'Alert triage automated', milestone: false },
      { month: 'Month 8-10', event: 'First automated response executed', milestone: true },
      { month: 'Month 11-12', event: 'Full SOC transformation complete', milestone: true }
    ],
    testimonial: {
      text: "We went from drowning in alerts to having intelligent, prioritized threat intelligence. Our analysts now focus on real threats, not noise.",
      author: 'David Park',
      role: 'VP Security Operations',
      avatar: 'DP'
    },
    tags: ['Cybersecurity', 'Threat Detection', 'AI/ML', 'SOC Transformation']
  },
  {
    id: 'hsbc-compliance',
    company: 'International Banking Group',
    industry: 'Banking',
    region: 'Asia-Pacific',
    employeeCount: '220,000+',
    icon: Building2,
    gradient: 'from-red-500 to-rose-600',
    heroImage: 'linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #4a2020 100%)',
    title: 'Regulatory Compliance Transformation',
    subtitle: 'From reactive compliance to proactive regulatory intelligence across 64 markets',
    executiveSummary: 'Operating in 64 countries with constantly evolving regulations, this international bank transformed compliance from a cost center to a competitive advantage.',
    challenge: {
      headline: 'Regulatory Complexity at Scale',
      description: 'Managing compliance across 64 jurisdictions with thousands of regulatory changes annually was overwhelming existing processes.',
      points: [
        '8,000+ regulatory changes tracked annually across markets',
        'Compliance team spending 80% of time on manual monitoring',
        'Average regulatory change implementation taking 6 weeks',
        '$340M annual compliance spend with increasing regulatory fines',
        'Three major regulatory enforcement actions in two years'
      ],
      quote: {
        text: "We were always playing catch-up. By the time we implemented one regulatory change, three more were already pending.",
        author: 'Group Head of Compliance',
        role: 'International Banking Group'
      }
    },
    solution: {
      headline: 'Intelligent Compliance Platform',
      description: 'AI-powered regulatory intelligence with automated obligation tracking and control testing.',
      phases: [
        {
          name: 'Intelligence',
          duration: '3 months',
          description: 'AI regulatory change monitoring with automated impact assessment'
        },
        {
          name: 'Mapping',
          duration: '4 months',
          description: 'Dynamic obligation-to-control mapping across all business lines'
        },
        {
          name: 'Testing',
          duration: '4 months',
          description: 'Automated control testing with continuous assurance monitoring'
        },
        {
          name: 'Reporting',
          duration: '3 months',
          description: 'Real-time compliance dashboards and regulatory submission automation'
        }
      ]
    },
    outcomes: [
      { metric: 'Regulatory Response', before: '6 weeks', after: '5 days', improvement: '88% faster' },
      { metric: 'Compliance Costs', before: '$340M', after: '$220M', improvement: '$120M saved' },
      { metric: 'Control Coverage', before: '45%', after: '100%', improvement: 'Full coverage' },
      { metric: 'Regulatory Fines', before: '$180M/2yr', after: '$12M/2yr', improvement: '93% reduction' }
    ],
    timeline: [
      { month: 'Month 1-3', event: 'AI monitoring deployed', milestone: true },
      { month: 'Month 4-7', event: 'Obligation mapping complete', milestone: true },
      { month: 'Month 8-11', event: 'Automated testing live', milestone: false },
      { month: 'Month 12-14', event: 'Real-time dashboards launched', milestone: true },
      { month: 'Month 15-18', event: 'Clean regulatory examination', milestone: true }
    ],
    testimonial: {
      text: "Compliance used to be seen as a necessary burden. Now it's a strategic advantage that helps us enter new markets faster than competitors.",
      author: 'Linda Ng',
      role: 'Group Chief Compliance Officer',
      avatar: 'LN'
    },
    tags: ['Regulatory Compliance', 'AI Monitoring', 'Control Testing', 'RegTech']
  }
];

// Statistics for hero section
const platformStats = [
  { value: '$4.2T', label: 'Assets Protected', icon: Shield },
  { value: '500+', label: 'Enterprise Clients', icon: Building2 },
  { value: '64', label: 'Countries Served', icon: Globe },
  { value: '99.9%', label: 'Platform Uptime', icon: Zap }
];

export default function CaseStudiesPage() {
  const [selectedStudy, setSelectedStudy] = useState<typeof caseStudies[0] | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Check which cards are visible
      const cards = document.querySelectorAll('.case-study-card');
      const newVisible = new Set<number>();
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          newVisible.add(index);
        }
      });
      setVisibleCards(newVisible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <div
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden -mx-6 -mt-6 mb-12"
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)'
        }}
      >
        {/* Animated Background Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        />

        {/* Floating Orbs */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)',
            top: '10%',
            right: '10%',
            transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.1}px)`
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, #b91c1c 0%, transparent 70%)',
            bottom: '20%',
            left: '5%',
            transform: `translate(${-scrollY * 0.03}px, ${-scrollY * 0.08}px)`
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
            <Award className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-300">Trusted by Industry Leaders</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #dc2626 50%, #b91c1c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: Math.max(0, 1 - scrollY / 500)
            }}
          >
            Real Results.<br />Real Impact.
          </h1>

          <p
            className="text-xl text-navy-300 mb-12 max-w-2xl mx-auto"
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
              opacity: Math.max(0, 1 - scrollY / 400)
            }}
          >
            Discover how the world's leading organizations transform their risk management
            with Lumina-R. From Fortune 100 banks to global insurers.
          </p>

          {/* Stats Grid */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              opacity: Math.max(0, 1 - scrollY / 600)
            }}
          >
            {platformStats.map((stat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-navy-900/50 border border-navy-700/50 backdrop-blur-sm"
              >
                <stat.icon className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-navy-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-navy-400"
            style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
          >
            <span className="text-sm">Explore Case Studies</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Case Studies Section */}
      <div className="space-y-24">
        {caseStudies.map((study, index) => {
          const Icon = study.icon;
          const isVisible = visibleCards.has(index);
          const isEven = index % 2 === 0;

          return (
            <div
              key={study.id}
              className={cn(
                "case-study-card relative transition-all duration-1000",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Large Background Number */}
              <div
                className="absolute -top-20 text-[200px] font-bold text-navy-800/20 select-none pointer-events-none"
                style={{ [isEven ? 'left' : 'right']: '-20px' }}
              >
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className={cn(
                "relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center",
                !isEven && "lg:grid-flow-dense"
              )}>
                {/* Visual Side */}
                <div
                  className={cn(
                    "relative rounded-3xl overflow-hidden aspect-[4/3]",
                    !isEven && "lg:col-start-2"
                  )}
                  style={{ background: study.heroImage }}
                >
                  {/* Gradient Overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-60",
                    study.gradient
                  )} />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm"
                        )}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">{study.industry}</p>
                          <p className="text-white font-semibold">{study.company}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                        {study.region}
                      </span>
                    </div>

                    {/* Key Metrics Preview */}
                    <div className="grid grid-cols-2 gap-4">
                      {study.outcomes.slice(0, 2).map((outcome, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10"
                        >
                          <p className="text-2xl font-bold text-white">{outcome.after}</p>
                          <p className="text-sm text-white/70">{outcome.metric}</p>
                          <p className="text-xs text-emerald-300 mt-1">{outcome.improvement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className={cn(
                  "space-y-6",
                  !isEven && "lg:col-start-1 lg:row-start-1"
                )}>
                  <div className="flex flex-wrap items-center gap-3">
                    {study.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl font-bold text-navy-100 leading-tight">
                    {study.title}
                  </h2>

                  <p className="text-navy-400 leading-relaxed">
                    {study.executiveSummary}
                  </p>

                  {/* Challenge Preview */}
                  <div className="p-5 rounded-xl bg-navy-800/30 border border-navy-700/50">
                    <div className="flex items-center gap-2 text-amber-400 mb-3">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-semibold">The Challenge</span>
                    </div>
                    <ul className="space-y-2">
                      {study.challenge.points.slice(0, 3).map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-navy-300">
                          <span className="text-red-400 mt-1">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setSelectedStudy(study)}
                    className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-medium hover:from-red-600 hover:to-red-800 transition-all"
                  >
                    Read Full Case Study
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-24 mb-12 text-center">
        <div className="inline-flex flex-col items-center p-12 rounded-3xl bg-gradient-to-br from-navy-800/50 to-navy-900/50 border border-navy-700/50">
          <h2 className="text-3xl font-bold text-navy-100 mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-navy-400 mb-8 max-w-lg">
            Join 500+ enterprises that have transformed their risk management with Lumina-R.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-medium hover:from-red-600 hover:to-red-800 transition-all">
              Schedule a Demo
            </button>
            <button className="px-8 py-4 rounded-xl bg-navy-800 border border-navy-600 text-navy-200 font-medium hover:bg-navy-700 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Full Case Study Modal */}
      {selectedStudy && (
        <div
          className="fixed inset-0 bg-navy-950/95 backdrop-blur-xl z-50 overflow-y-auto"
          onClick={() => setSelectedStudy(null)}
        >
          <div
            className="min-h-screen py-8 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-5xl mx-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedStudy(null)}
                className="fixed top-6 right-6 z-50 p-3 rounded-full bg-navy-800/80 backdrop-blur-sm text-navy-300 hover:text-white hover:bg-navy-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Hero Section */}
              <div
                className="relative rounded-3xl overflow-hidden mb-12"
                style={{ background: selectedStudy.heroImage }}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-60",
                  selectedStudy.gradient
                )} />

                <div className="relative p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-sm">
                      <selectedStudy.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60">{selectedStudy.industry}</p>
                      <h3 className="text-xl font-semibold text-white">{selectedStudy.company}</h3>
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {selectedStudy.title}
                  </h1>
                  <p className="text-xl text-white/80 max-w-3xl">
                    {selectedStudy.subtitle}
                  </p>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-6 mt-8">
                    <div className="flex items-center gap-2 text-white/80">
                      <Globe className="w-4 h-4" />
                      {selectedStudy.region}
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Users className="w-4 h-4" />
                      {selectedStudy.employeeCount} Employees
                    </div>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="mb-12 p-8 rounded-2xl bg-navy-800/30 border border-navy-700/50">
                <h2 className="text-xl font-semibold text-navy-100 mb-4">Executive Summary</h2>
                <p className="text-lg text-navy-300 leading-relaxed">
                  {selectedStudy.executiveSummary}
                </p>
              </div>

              {/* Challenge Section */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy-100">{selectedStudy.challenge.headline}</h2>
                </div>

                <p className="text-navy-300 mb-6">{selectedStudy.challenge.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {selectedStudy.challenge.points.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-navy-800/30 border border-navy-700/50"
                    >
                      <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </span>
                      <p className="text-navy-300 text-sm">{point}</p>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-navy-800/50 to-navy-900/50 border border-navy-700/50">
                  <Quote className="absolute top-6 left-6 w-8 h-8 text-red-500/30" />
                  <blockquote className="relative z-10 pl-8">
                    <p className="text-xl text-navy-200 italic mb-4">
                      "{selectedStudy.challenge.quote.text}"
                    </p>
                    <footer className="text-navy-400">
                      <cite className="not-italic font-medium text-navy-300">
                        {selectedStudy.challenge.quote.author}
                      </cite>
                      <span className="mx-2">•</span>
                      <span>{selectedStudy.challenge.quote.role}</span>
                    </footer>
                  </blockquote>
                </div>
              </div>

              {/* Solution Section */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy-100">{selectedStudy.solution.headline}</h2>
                </div>

                <p className="text-navy-300 mb-8">{selectedStudy.solution.description}</p>

                {/* Solution Phases Timeline */}
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-red-500 via-amber-500 to-emerald-500" />

                  <div className="space-y-6">
                    {selectedStudy.solution.phases.map((phase, i) => (
                      <div key={i} className="relative pl-16">
                        <div className={cn(
                          "absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
                          i === 0 ? "bg-red-500" :
                          i === 1 ? "bg-amber-500" :
                          i === 2 ? "bg-emerald-500" :
                          "bg-blue-500"
                        )}>
                          {i + 1}
                        </div>
                        <div className="p-6 rounded-xl bg-navy-800/30 border border-navy-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-navy-100">{phase.name}</h3>
                            <span className="px-3 py-1 rounded-full bg-navy-700/50 text-navy-300 text-sm">
                              {phase.duration}
                            </span>
                          </div>
                          <p className="text-navy-400">{phase.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outcomes Section */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy-100">Measurable Outcomes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedStudy.outcomes.map((outcome, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-2xl bg-gradient-to-br from-navy-800/50 to-navy-900/50 border border-navy-700/50"
                    >
                      <p className="text-sm text-navy-400 mb-3">{outcome.metric}</p>
                      <div className="flex items-end gap-4 mb-3">
                        <div>
                          <p className="text-xs text-navy-500 mb-1">Before</p>
                          <p className="text-xl text-navy-400 line-through">{outcome.before}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-emerald-400 mb-1" />
                        <div>
                          <p className="text-xs text-navy-500 mb-1">After</p>
                          <p className="text-3xl font-bold text-white">{outcome.after}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">{outcome.improvement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Section */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-violet-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy-100">Implementation Timeline</h2>
                </div>

                <div className="relative overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-max">
                    {selectedStudy.timeline.map((item, i) => (
                      <div
                        key={i}
                        className={cn(
                          "relative flex-shrink-0 w-48 p-4 rounded-xl border",
                          item.milestone
                            ? "bg-red-500/10 border-red-500/30"
                            : "bg-navy-800/30 border-navy-700/50"
                        )}
                      >
                        {item.milestone && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <p className={cn(
                          "text-xs font-medium mb-2",
                          item.milestone ? "text-red-400" : "text-navy-500"
                        )}>
                          {item.month}
                        </p>
                        <p className="text-sm text-navy-200">{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20">
                <Quote className="w-10 h-10 text-red-500/40 mb-4" />
                <blockquote className="text-2xl text-navy-100 italic mb-6 leading-relaxed">
                  "{selectedStudy.testimonial.text}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold">
                    {selectedStudy.testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-100">{selectedStudy.testimonial.author}</p>
                    <p className="text-sm text-navy-400">{selectedStudy.testimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedStudy.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-navy-800/50 text-navy-300 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-navy-800/30 border border-navy-700/50">
                <div>
                  <p className="text-navy-300">Want to achieve similar results?</p>
                  <p className="text-lg font-semibold text-navy-100">Schedule a personalized demo today.</p>
                </div>
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-medium hover:from-red-600 hover:to-red-800 transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
