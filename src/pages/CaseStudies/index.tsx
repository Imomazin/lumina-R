import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Quote,
  CheckCircle2,
  AlertTriangle,
  Target,
  BarChart3,
  Clock,
  Users,
  Globe,
  X
} from 'lucide-react';
import { cn } from '../../utils';

// Real Unsplash images for each case study
const IMAGES = {
  bankHero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
  bankModal: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
  insuranceHero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
  insuranceModal: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
  assetHero: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
  assetModal: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  cyberHero: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
  cyberModal: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
  complianceHero: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  complianceModal: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
  heroBackground: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
};

// Rich case study data with full narratives
const caseStudies = [
  {
    id: 'fortune100-bank',
    company: 'Global Investment Bank',
    industry: 'Financial Services',
    region: 'North America',
    employeeCount: '250,000+',
    image: IMAGES.bankHero,
    modalImage: IMAGES.bankModal,
    accentColor: 'amber',
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
        { name: 'Foundation', duration: '3 months', description: 'Data integration layer connecting all 47 source systems with automated reconciliation' },
        { name: 'Intelligence', duration: '4 months', description: 'AI-powered risk analytics engine with real-time scoring and anomaly detection' },
        { name: 'Automation', duration: '5 months', description: 'Workflow automation for reporting, escalation, and regulatory submissions' },
        { name: 'Optimization', duration: '6 months', description: 'Advanced scenario modeling, stress testing, and predictive analytics deployment' }
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
      text: "Lumina-R didn't just modernize our risk function — it transformed how our entire organization thinks about risk. For the first time, we have a true enterprise view.",
      author: 'Sarah Chen',
      role: 'Group Chief Risk Officer',
      avatar: 'SC'
    },
    tags: ['Enterprise Risk', 'AI Analytics', 'Regulatory Compliance', 'Data Integration']
  },
  {
    id: 'euro-insurance',
    company: 'European Insurance Leader',
    industry: 'Insurance',
    region: 'Europe',
    employeeCount: '150,000+',
    image: IMAGES.insuranceHero,
    modalImage: IMAGES.insuranceModal,
    accentColor: 'blue',
    title: 'Building Real-Time Operational Resilience at Scale',
    subtitle: "How Europe's largest insurer achieved 15-minute incident detection from 4 hours",
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
        text: 'Our biggest fear was realized when a payment processing failure affected 2 million customers before we even knew about it.',
        author: 'Head of Operations',
        role: 'European Insurance Leader'
      }
    },
    solution: {
      headline: 'Intelligent Resilience Platform',
      description: 'End-to-end operational resilience with predictive analytics and automated response.',
      phases: [
        { name: 'Connect', duration: '2 months', description: 'Integration with 200+ monitoring systems, customer channels, and business applications' },
        { name: 'Detect', duration: '3 months', description: 'AI-powered anomaly detection with correlation engine across all data streams' },
        { name: 'Respond', duration: '3 months', description: 'Automated playbooks, escalation workflows, and real-time command center' },
        { name: 'Prevent', duration: '4 months', description: 'Predictive failure modeling and proactive resilience testing' }
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
    id: 'global-asset-mgr',
    company: 'Global Asset Manager',
    industry: 'Asset Management',
    region: 'Global',
    employeeCount: '18,000+',
    image: IMAGES.assetHero,
    modalImage: IMAGES.assetModal,
    accentColor: 'emerald',
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
        text: 'When COVID hit, our risk models were useless. Correlations changed overnight, and we had no way to capture it.',
        author: 'Head of Risk Analytics',
        role: 'Global Asset Manager'
      }
    },
    solution: {
      headline: 'Real-Time Risk Intelligence',
      description: 'Modern risk analytics platform with ML-driven factor models and scenario analysis.',
      phases: [
        { name: 'Data', duration: '2 months', description: 'Real-time market data integration with position-level granularity' },
        { name: 'Models', duration: '4 months', description: 'ML-enhanced factor models with dynamic correlation estimation' },
        { name: 'Analytics', duration: '3 months', description: 'Monte Carlo simulation engine with GPU acceleration' },
        { name: 'Delivery', duration: '3 months', description: 'Real-time dashboards and API integration with trading systems' }
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
      text: "Our portfolio managers now see risk the same way they see returns — in real-time. It's completely changed our investment process.",
      author: 'James Morrison',
      role: 'Global Head of Investments',
      avatar: 'JM'
    },
    tags: ['Investment Risk', 'Real-Time Analytics', 'Machine Learning', 'Monte Carlo']
  },
  {
    id: 'payment-network',
    company: 'Global Payment Network',
    industry: 'Payments & Fintech',
    region: 'Global',
    employeeCount: '25,000+',
    image: IMAGES.cyberHero,
    modalImage: IMAGES.cyberModal,
    accentColor: 'violet',
    title: 'Cyber Risk Excellence in Payment Processing',
    subtitle: 'Protecting $15 trillion in annual payment volume with AI-driven security',
    executiveSummary: 'Processing payments for 3.5 billion cardholders requires world-class cyber defense. This payment network achieved 45-second threat detection from a 23-hour baseline.',
    challenge: {
      headline: 'The Ultimate Target',
      description: "As one of the world's largest payment processors, they faced sophisticated attacks from nation-states and organized crime.",
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
        { name: 'Unify', duration: '2 months', description: 'Security data lake integrating 50+ security tools and threat feeds' },
        { name: 'Analyze', duration: '3 months', description: 'ML-based threat detection with behavioral analysis and correlation' },
        { name: 'Prioritize', duration: '2 months', description: 'Risk-based alert scoring reducing noise and highlighting critical threats' },
        { name: 'Automate', duration: '3 months', description: 'Automated response playbooks and vulnerability orchestration' }
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
      text: 'We went from drowning in alerts to having intelligent, prioritized threat intelligence. Our analysts now focus on real threats, not noise.',
      author: 'David Park',
      role: 'VP Security Operations',
      avatar: 'DP'
    },
    tags: ['Cybersecurity', 'Threat Detection', 'AI/ML', 'SOC Transformation']
  },
  {
    id: 'intl-banking-group',
    company: 'International Banking Group',
    industry: 'Banking',
    region: 'Asia-Pacific',
    employeeCount: '220,000+',
    image: IMAGES.complianceHero,
    modalImage: IMAGES.complianceModal,
    accentColor: 'rose',
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
        text: 'We were always playing catch-up. By the time we implemented one regulatory change, three more were already pending.',
        author: 'Group Head of Compliance',
        role: 'International Banking Group'
      }
    },
    solution: {
      headline: 'Intelligent Compliance Platform',
      description: 'AI-powered regulatory intelligence with automated obligation tracking and control testing.',
      phases: [
        { name: 'Intelligence', duration: '3 months', description: 'AI regulatory change monitoring with automated impact assessment' },
        { name: 'Mapping', duration: '4 months', description: 'Dynamic obligation-to-control mapping across all business lines' },
        { name: 'Testing', duration: '4 months', description: 'Automated control testing with continuous assurance monitoring' },
        { name: 'Reporting', duration: '3 months', description: 'Real-time compliance dashboards and regulatory submission automation' }
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

export default function CaseStudiesPage() {
  const [selectedStudy, setSelectedStudy] = useState<typeof caseStudies[0] | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section — clean, photo-driven, minimal red */}
      <div
        ref={heroRef}
        className="relative min-h-[80vh] flex items-end overflow-hidden -mx-6 -mt-6 mb-16"
      >
        {/* Full-bleed background photo */}
        <img
          src={IMAGES.heroBackground}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for readability - using explicit hex to avoid theme inversion */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/80 to-[#0a0d14]/30" />

        {/* Content pinned to bottom */}
        <div
          className="relative z-10 w-full px-8 pb-16 pt-32 max-w-5xl mx-auto"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
            opacity: Math.max(0, 1 - scrollY / 500)
          }}
        >
          <p className="text-sm font-medium tracking-widest uppercase text-[#94a3b8] mb-4">
            Case Studies
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-[#ffffff] mb-6 leading-tight max-w-3xl">
            How enterprises transform risk into&nbsp;
            <span className="text-red-400">competitive advantage</span>
          </h1>

          <p className="text-lg text-[#94a3b8] max-w-2xl mb-10">
            Real stories from Fortune 500 banks, global insurers, and asset managers
            who reimagined their risk operations with Lumina-R.
          </p>

          {/* Compact stat bar — no icons, using explicit colors for theme stability */}
          <div className="flex flex-wrap gap-8">
            {[
              { value: '$4.2T', label: 'Assets Protected' },
              { value: '500+', label: 'Enterprise Clients' },
              { value: '64', label: 'Markets' },
              { value: '99.9%', label: 'Uptime' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-[#ffffff]">{s.value}</p>
                <p className="text-xs text-[#94a3b8] uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Studies — alternating image + text sections */}
      <div className="space-y-32 px-2">
        {caseStudies.map((study, index) => {
          const isVisible = visibleCards.has(index);
          const isEven = index % 2 === 0;

          return (
            <div
              key={study.id}
              className={cn(
                'case-study-card transition-all duration-1000',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              )}
            >
              <div
                className={cn(
                  'grid grid-cols-1 lg:grid-cols-2 gap-10 items-center',
                  !isEven && 'lg:grid-flow-dense'
                )}
              >
                {/* Image side */}
                <div
                  className={cn(
                    'relative rounded-2xl overflow-hidden group',
                    !isEven && 'lg:col-start-2'
                  )}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={study.image}
                      alt={study.company}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {/* Gradient scrim on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Overlay content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/80 text-sm font-medium">{study.industry}</span>
                      <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs">
                        {study.region}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {study.outcomes.slice(0, 2).map((outcome, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-white/10 backdrop-blur-sm"
                        >
                          <p className="text-xl font-bold text-white">{outcome.after}</p>
                          <p className="text-xs text-white/70">{outcome.metric}</p>
                          <p className="text-xs text-emerald-300 mt-0.5">{outcome.improvement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text side */}
                <div
                  className={cn(
                    'space-y-5',
                    !isEven && 'lg:col-start-1 lg:row-start-1'
                  )}
                >
                  <div className="flex flex-wrap gap-2">
                    {study.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-navy-800/60 text-navy-300 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl font-bold text-navy-100 leading-snug">
                    {study.title}
                  </h2>

                  <p className="text-navy-400 leading-relaxed">
                    {study.executiveSummary}
                  </p>

                  {/* Challenge preview */}
                  <div className="p-5 rounded-xl bg-navy-800/30 border border-navy-700/40">
                    <p className="text-sm font-semibold text-amber-400 mb-3">The Challenge</p>
                    <ul className="space-y-2">
                      {study.challenge.points.slice(0, 3).map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-navy-300">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-navy-500 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setSelectedStudy(study)}
                    className="group inline-flex items-center gap-2 text-red-400 font-medium hover:text-red-300 transition-colors"
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

      {/* Bottom CTA */}
      <div className="mt-32 mb-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-navy-100 mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-navy-400 mb-8">
            Join 500+ enterprises that have transformed their risk management with Lumina-R.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-medium hover:from-red-600 hover:to-red-800 transition-all">
              Schedule a Demo
            </button>
            <button className="px-8 py-3.5 rounded-xl border border-navy-600 text-navy-300 font-medium hover:bg-navy-800 transition-all">
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
              {/* Close */}
              <button
                onClick={() => setSelectedStudy(null)}
                className="fixed top-6 right-6 z-50 p-3 rounded-full bg-navy-800/80 backdrop-blur-sm text-navy-300 hover:text-white hover:bg-navy-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Hero image */}
              <div className="relative rounded-2xl overflow-hidden mb-12">
                <img
                  src={selectedStudy.modalImage}
                  alt={selectedStudy.company}
                  className="w-full h-72 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-4 text-navy-300 text-sm">
                    <span>{selectedStudy.industry}</span>
                    <span className="text-navy-600">|</span>
                    <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {selectedStudy.region}</span>
                    <span className="text-navy-600">|</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {selectedStudy.employeeCount}</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
                    {selectedStudy.title}
                  </h1>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="mb-12 p-8 rounded-2xl bg-navy-800/30 border border-navy-700/50">
                <h2 className="text-lg font-semibold text-navy-100 mb-3">Executive Summary</h2>
                <p className="text-navy-300 leading-relaxed">{selectedStudy.executiveSummary}</p>
              </div>

              {/* Challenge */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy-100">{selectedStudy.challenge.headline}</h2>
                </div>
                <p className="text-navy-300 mb-6">{selectedStudy.challenge.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {selectedStudy.challenge.points.map((point, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-navy-800/30 border border-navy-700/40">
                      <span className="w-6 h-6 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">{i + 1}</span>
                      <p className="text-navy-300 text-sm">{point}</p>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="relative p-8 rounded-2xl bg-navy-800/30 border border-navy-700/40">
                  <Quote className="absolute top-6 left-6 w-7 h-7 text-navy-600" />
                  <blockquote className="pl-10">
                    <p className="text-lg text-navy-200 italic mb-4">"{selectedStudy.challenge.quote.text}"</p>
                    <footer className="text-sm text-navy-400">
                      <cite className="not-italic font-medium text-navy-300">{selectedStudy.challenge.quote.author}</cite>
                      <span className="mx-2">·</span>
                      <span>{selectedStudy.challenge.quote.role}</span>
                    </footer>
                  </blockquote>
                </div>
              </div>

              {/* Solution */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Target className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy-100">{selectedStudy.solution.headline}</h2>
                </div>
                <p className="text-navy-300 mb-8">{selectedStudy.solution.description}</p>

                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-navy-700" />
                  <div className="space-y-5">
                    {selectedStudy.solution.phases.map((phase, i) => (
                      <div key={i} className="relative pl-14">
                        <div className="absolute left-0 w-10 h-10 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-navy-200 text-sm font-bold">
                          {i + 1}
                        </div>
                        <div className="p-5 rounded-xl bg-navy-800/30 border border-navy-700/40">
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className="font-semibold text-navy-100">{phase.name}</h3>
                            <span className="text-xs text-navy-400 bg-navy-800 px-2.5 py-1 rounded-full">{phase.duration}</span>
                          </div>
                          <p className="text-sm text-navy-400">{phase.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outcomes */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-4.5 h-4.5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy-100">Measurable Outcomes</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {selectedStudy.outcomes.map((outcome, i) => (
                    <div key={i} className="p-5 rounded-xl bg-navy-800/30 border border-navy-700/40">
                      <p className="text-sm text-navy-400 mb-3">{outcome.metric}</p>
                      <div className="flex items-end gap-3 mb-2">
                        <div>
                          <p className="text-xs text-navy-500">Before</p>
                          <p className="text-lg text-navy-500 line-through">{outcome.before}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-500 mb-1.5" />
                        <div>
                          <p className="text-xs text-navy-500">After</p>
                          <p className="text-2xl font-bold text-white">{outcome.after}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="font-medium">{outcome.improvement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Clock className="w-4.5 h-4.5 text-violet-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy-100">Implementation Timeline</h2>
                </div>
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-3 min-w-max">
                    {selectedStudy.timeline.map((item, i) => (
                      <div
                        key={i}
                        className={cn(
                          'relative flex-shrink-0 w-44 p-4 rounded-xl border',
                          item.milestone ? 'bg-navy-800/50 border-navy-600' : 'bg-navy-800/20 border-navy-700/40'
                        )}
                      >
                        {item.milestone && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <p className="text-xs font-medium text-navy-500 mb-1.5">{item.month}</p>
                        <p className="text-sm text-navy-200">{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mb-12 p-8 rounded-2xl bg-navy-800/30 border border-navy-700/40">
                <Quote className="w-8 h-8 text-navy-600 mb-4" />
                <blockquote className="text-xl text-navy-100 italic mb-6 leading-relaxed">
                  "{selectedStudy.testimonial.text}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-sm font-bold">
                    {selectedStudy.testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-navy-100 text-sm">{selectedStudy.testimonial.author}</p>
                    <p className="text-xs text-navy-400">{selectedStudy.testimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-xl bg-navy-800/30 border border-navy-700/40">
                <div>
                  <p className="text-navy-400 text-sm">Want to achieve similar results?</p>
                  <p className="font-semibold text-navy-100">Schedule a personalized demo today.</p>
                </div>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-medium hover:from-red-600 hover:to-red-800 transition-all">
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
