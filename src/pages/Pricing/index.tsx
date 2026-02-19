import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  abbrev: string;
  features: PlanFeature[];
  cta: string;
  popular?: boolean;
  gradient?: string;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for exploring risk intelligence',
    price: 0,
    period: 'forever',
    abbrev: 'S',
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
    abbrev: 'Pro',
    cta: 'Start 14-Day Trial',
    features: [
      { text: 'Up to 100 risks in register', included: true, highlight: true },
      { text: '25 Key Risk Indicators', included: true },
      { text: 'Advanced risk matrix & heatmaps', included: true },
      { text: 'Excel & CSV import/export', included: true },
      { text: 'Email support (48h response)', included: true },
      { text: 'AI Risk Advisor (50 queries/month)', included: true, highlight: true },
      { text: 'Monte Carlo simulation', included: true },
      { text: 'Bow-Tie analysis', included: true },
      { text: 'Standard PDF reports', included: true },
      { text: 'API access (500 calls/month)', included: true },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For established risk functions',
    price: 199,
    period: 'per user / month',
    abbrev: 'Biz',
    cta: 'Start 14-Day Trial',
    popular: true,
    gradient: 'from-accent-primary to-accent-secondary',
    features: [
      { text: 'Unlimited risks in register', included: true, highlight: true },
      { text: 'Unlimited KRIs', included: true, highlight: true },
      { text: 'Strategic risk register (Tier 4)', included: true, highlight: true },
      { text: 'Portfolio risk dashboard', included: true },
      { text: 'Priority email support (24h)', included: true },
      { text: 'AI Risk Advisor (unlimited)', included: true, highlight: true },
      { text: 'All simulation & analysis tools', included: true },
      { text: 'Custom branded reports', included: true },
      { text: 'API access (5,000 calls/month)', included: true },
      { text: 'Team collaboration features', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with complex needs',
    price: 'Custom',
    period: 'tailored to your needs',
    abbrev: 'Ent',
    cta: 'Contact Sales',
    features: [
      { text: 'Everything in Business', included: true, highlight: true },
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
    abbrev: 'AI',
    title: 'AI-Powered Insights',
    description: 'Get intelligent risk recommendations and predictions powered by advanced AI',
  },
  {
    abbrev: 'A',
    title: 'Advanced Analytics',
    description: 'Monte Carlo simulations, Bow-Tie analysis, and comprehensive reporting',
  },
  {
    abbrev: 'S',
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with encryption at rest and in transit',
  },
  {
    abbrev: 'RT',
    title: 'Real-Time Monitoring',
    description: 'Track KRIs and risk events as they happen with instant alerts',
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise') {
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
              <span className="text-sm font-bold text-white">LR</span>
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

      {/* Pricing Cards - 4 columns */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const displayPrice = typeof plan.price === 'number'
                ? billingPeriod === 'annual'
                  ? Math.round(plan.price * 0.8)
                  : plan.price
                : plan.price;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'pricing-card relative',
                    plan.popular && 'featured ring-2 ring-accent-primary'
                  )}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-accent-primary to-accent-secondary text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-5">
                    <div className={cn(
                      'w-11 h-11 rounded-lg flex items-center justify-center mb-3 font-bold text-sm',
                      plan.popular
                        ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white'
                        : 'bg-navy-800/50 text-navy-400'
                    )}>
                      {plan.abbrev}
                    </div>
                    <h3 className="text-lg font-semibold text-navy-100">{plan.name}</h3>
                    <p className="text-sm text-navy-400 mt-1">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      {typeof displayPrice === 'number' ? (
                        <>
                          <span className="text-sm text-navy-400">$</span>
                          <span className="text-4xl font-bold text-navy-100">{displayPrice}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-navy-100">{displayPrice}</span>
                      )}
                    </div>
                    <p className="text-xs text-navy-500 mt-1">{plan.period}</p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={cn(
                      'w-full py-2.5 rounded-lg font-medium mb-5 transition-all text-sm',
                      plan.popular
                        ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90'
                        : 'btn-secondary'
                    )}
                  >
                    {plan.cta}
                  </button>

                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'flex items-start gap-2 text-sm',
                          !feature.included && 'opacity-40'
                        )}
                      >
                        <span className={cn(
                          'mt-0.5 text-xs',
                          feature.included
                            ? feature.highlight ? 'text-accent-primary' : 'text-emerald-400'
                            : 'text-navy-600'
                        )}>
                          {feature.included ? '✓' : '✕'}
                        </span>
                        <span className={cn(
                          feature.highlight ? 'text-navy-100 font-medium' : 'text-navy-400'
                        )}>
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
            {featureHighlights.map((feature, idx) => (
              <div key={idx} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-4 font-bold text-accent-primary">
                  {feature.abbrev}
                </div>
                <h3 className="text-lg font-semibold text-navy-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-navy-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-navy-100 text-center mb-12">
            Compare Plans
          </h2>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-700">
                    <th className="text-left py-4 px-6 text-navy-400 font-medium">Feature</th>
                    <th className="text-center py-4 px-4 text-navy-400 font-medium">Starter</th>
                    <th className="text-center py-4 px-4 text-navy-400 font-medium">Professional</th>
                    <th className="text-center py-4 px-4 text-navy-400 font-medium bg-accent-primary/5">Business</th>
                    <th className="text-center py-4 px-4 text-navy-400 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Risks in Register', starter: '25', pro: '100', biz: 'Unlimited', ent: 'Unlimited' },
                    { feature: 'Key Risk Indicators', starter: '5', pro: '25', biz: 'Unlimited', ent: 'Unlimited' },
                    { feature: 'Strategic Risk Register', starter: '—', pro: '—', biz: '✓', ent: '✓' },
                    { feature: 'Portfolio Dashboard', starter: '—', pro: '—', biz: '✓', ent: '✓' },
                    { feature: 'AI Risk Advisor', starter: '5/mo', pro: '50/mo', biz: 'Unlimited', ent: 'Unlimited' },
                    { feature: 'Monte Carlo Simulation', starter: '—', pro: '✓', biz: '✓', ent: '✓' },
                    { feature: 'Bow-Tie Analysis', starter: '—', pro: '✓', biz: '✓', ent: '✓' },
                    { feature: 'API Calls/Month', starter: '—', pro: '500', biz: '5,000', ent: 'Unlimited' },
                    { feature: 'SSO/SAML', starter: '—', pro: '—', biz: '—', ent: '✓' },
                    { feature: 'Dedicated Support', starter: '—', pro: '—', biz: '—', ent: '✓' },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-navy-800">
                      <td className="py-3 px-6 text-navy-200">{row.feature}</td>
                      <td className="py-3 px-4 text-center text-navy-400">{row.starter}</td>
                      <td className="py-3 px-4 text-center text-navy-400">{row.pro}</td>
                      <td className="py-3 px-4 text-center text-navy-100 bg-accent-primary/5 font-medium">{row.biz}</td>
                      <td className="py-3 px-4 text-center text-navy-400">{row.ent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
            <span className="text-sm text-navy-400">SOC 2 Compliant</span>
            <span className="text-sm text-navy-400">256-bit Encryption</span>
            <span className="text-sm text-navy-400">10,000+ Users</span>
            <span className="text-sm text-navy-400">99.9% Uptime</span>
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
          <div className="space-y-4">
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
                a: 'Yes! Professional and Business plans include a 14-day free trial with full access to all features. No credit card required.',
              },
              {
                q: 'How does the AI Risk Advisor work?',
                a: 'Our AI analyzes your risk data, industry benchmarks, and regulatory requirements to provide actionable insights and recommendations.',
              },
              {
                q: 'What is the Strategic Risk Register?',
                a: 'The Strategic Risk Register (Tier 4) includes advanced financial modelling with EMV calculations, EBITDA exposure analysis, capital allocation, and executive escalation triggers.',
              },
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-5">
                <h3 className="text-base font-medium text-navy-100 mb-2">{item.q}</h3>
                <p className="text-sm text-navy-400">{item.a}</p>
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
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90 transition-opacity"
            >
              Start Free Today
            </button>
            <button
              onClick={() => alert('Demo booking would open here')}
              className="btn-secondary px-8 py-3"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-navy-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-navy-500 flex-wrap gap-4">
          <p>© 2024 Lumina-R. All rights reserved.</p>
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
