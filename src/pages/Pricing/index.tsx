import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  Zap,
  Shield,
  Building2,
  Sparkles,
  ArrowRight,
  Users,
  BarChart3,
  Bot,
  Clock,
  Lock,
  Headphones,
} from 'lucide-react';
import { cn } from '../../utils';

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number | 'Custom';
  period: string;
  icon: React.ElementType;
  features: PlanFeature[];
  cta: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for exploring risk intelligence',
    price: 0,
    period: 'forever',
    icon: Sparkles,
    cta: 'Get Started Free',
    features: [
      { text: 'Up to 25 risks in register', included: true },
      { text: '5 Key Risk Indicators', included: true },
      { text: 'Basic risk matrix visualization', included: true },
      { text: 'CSV data import', included: true },
      { text: 'Community support', included: true },
      { text: 'AI Risk Advisor (5 queries/month)', included: true },
      { text: 'Monte Carlo simulation', included: false },
      { text: 'Bow-Tie analysis', included: false },
      { text: 'Custom reports', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing risk management teams',
    price: 79,
    period: 'per user / month',
    icon: Zap,
    cta: 'Start 14-Day Trial',
    popular: true,
    features: [
      { text: 'Unlimited risks in register', included: true, highlight: true },
      { text: 'Unlimited KRIs', included: true, highlight: true },
      { text: 'Advanced risk matrix & heatmaps', included: true },
      { text: 'Excel & CSV import/export', included: true },
      { text: 'Priority email support', included: true },
      { text: 'AI Risk Advisor (unlimited)', included: true, highlight: true },
      { text: 'Monte Carlo simulation', included: true },
      { text: 'Bow-Tie analysis', included: true },
      { text: 'Custom PDF reports', included: true },
      { text: 'API access (1000 calls/month)', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with complex needs',
    price: 'Custom',
    period: 'tailored to your needs',
    icon: Building2,
    cta: 'Contact Sales',
    features: [
      { text: 'Everything in Professional', included: true, highlight: true },
      { text: 'Unlimited API access', included: true },
      { text: 'SSO / SAML authentication', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated success manager', included: true, highlight: true },
      { text: 'On-premise deployment option', included: true },
      { text: 'Custom AI model training', included: true, highlight: true },
      { text: 'Audit logs & compliance', included: true },
      { text: 'SLA guarantee (99.9% uptime)', included: true },
      { text: '24/7 phone support', included: true },
    ],
  },
];

const featureHighlights = [
  {
    icon: Bot,
    title: 'AI-Powered Insights',
    description: 'Get intelligent risk recommendations and predictions powered by advanced AI',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Monte Carlo simulations, Bow-Tie analysis, and comprehensive reporting',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with encryption at rest and in transit',
  },
  {
    icon: Clock,
    title: 'Real-Time Monitoring',
    description: 'Track KRIs and risk events as they happen with instant alerts',
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise') {
      // Would open contact form
      alert('Contact form would open here');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="border-b border-navy-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy-100">Lumina-R</h1>
              <p className="text-xs text-navy-500">Risk Intelligence</p>
            </div>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost text-sm"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-100 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-navy-400 mb-8 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
            All plans include our core risk management features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-navy-800/50 border border-navy-700">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                billingPeriod === 'monthly'
                  ? 'bg-accent-primary text-white'
                  : 'text-navy-400 hover:text-navy-200'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                billingPeriod === 'annual'
                  ? 'bg-accent-primary text-white'
                  : 'text-navy-400 hover:text-navy-200'
              )}
            >
              Annual
              <span className="px-1.5 py-0.5 text-xs rounded bg-emerald-500/20 text-emerald-400">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const displayPrice = typeof plan.price === 'number'
                ? billingPeriod === 'annual'
                  ? Math.round(plan.price * 0.8)
                  : plan.price
                : plan.price;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'pricing-card',
                    plan.popular && 'featured'
                  )}
                >
                  {/* Plan Header */}
                  <div className="mb-6">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                      plan.popular
                        ? 'bg-accent-primary/20'
                        : 'bg-navy-800/50'
                    )}>
                      <Icon className={cn(
                        'w-6 h-6',
                        plan.popular ? 'text-accent-primary' : 'text-navy-400'
                      )} />
                    </div>
                    <h3 className="text-xl font-semibold text-navy-100">{plan.name}</h3>
                    <p className="text-sm text-navy-400 mt-1">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      {typeof displayPrice === 'number' ? (
                        <>
                          <span className="text-sm text-navy-400">$</span>
                          <span className="pricing-price">{displayPrice}</span>
                        </>
                      ) : (
                        <span className="pricing-price text-3xl">{displayPrice}</span>
                      )}
                    </div>
                    <p className="pricing-period mt-1">{plan.period}</p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={cn(
                      'w-full py-3 rounded-xl font-medium mb-6 transition-all',
                      plan.popular
                        ? 'btn-primary'
                        : 'btn-secondary'
                    )}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>

                  {/* Features */}
                  <div className="space-y-1">
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'pricing-feature',
                          !feature.included && 'pricing-feature-disabled'
                        )}
                      >
                        {feature.included ? (
                          <Check className={cn(
                            'pricing-feature-icon',
                            feature.highlight && 'text-accent-primary'
                          )} />
                        ) : (
                          <X className="pricing-feature-icon" />
                        )}
                        <span className={cn(feature.highlight && 'font-medium')}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-6 bg-navy-900/50 border-y border-navy-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-navy-100 text-center mb-12">
            Everything You Need for Enterprise Risk Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureHighlights.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-accent-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-navy-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-navy-400">
              <Lock className="w-5 h-5" />
              <span className="text-sm">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-navy-400">
              <Shield className="w-5 h-5" />
              <span className="text-sm">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-navy-400">
              <Users className="w-5 h-5" />
              <span className="text-sm">10,000+ Users</span>
            </div>
          </div>
          <p className="text-navy-500 text-sm">
            Trusted by risk professionals at leading enterprises worldwide
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-navy-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-navy-100 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I switch plans at any time?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.',
              },
              {
                q: 'What happens when I exceed my plan limits?',
                a: 'We\'ll notify you when you\'re approaching limits. You can upgrade to a higher plan or we\'ll work with you on a custom solution.',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Yes! Professional plan includes a 14-day free trial with full access to all features. No credit card required.',
              },
              {
                q: 'How does the AI Risk Advisor work?',
                a: 'Our AI analyzes your risk data, industry benchmarks, and regulatory requirements to provide actionable insights and recommendations.',
              },
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6">
                <h3 className="text-lg font-medium text-navy-100 mb-2">{item.q}</h3>
                <p className="text-navy-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-navy-100 mb-4">
            Ready to Transform Your Risk Management?
          </h2>
          <p className="text-lg text-navy-400 mb-8">
            Join thousands of risk professionals using Lumina-R to make smarter decisions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary btn-lg"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => alert('Demo booking would open here')}
              className="btn-secondary btn-lg"
            >
              <Headphones className="w-5 h-5 mr-2" />
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-navy-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-navy-500">
          <p>&copy; 2024 Lumina-R. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-navy-300">Privacy Policy</a>
            <a href="#" className="hover:text-navy-300">Terms of Service</a>
            <a href="#" className="hover:text-navy-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
