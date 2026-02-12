import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Activity, BarChart3, Zap } from 'lucide-react';

export default function Landing() {

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Lumina R</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#capabilities" className="text-sm text-gray-400 hover:text-white transition-colors">Capabilities</a>
            <a href="#integrations" className="text-sm text-gray-400 hover:text-white transition-colors">Integrations</a>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="inline-block">
              <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium uppercase tracking-wider">
                Risk Intelligence Platform
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Transform risk<br />
              into <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">intelligence</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
              The enterprise risk management platform for modern organizations.
              Discover threats, assess exposure, design controls,
              and deliver resilience with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/risk"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold hover:from-red-600 hover:to-red-800 transition-all shadow-lg shadow-red-500/20"
              >
                Start Risk Assessment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors border border-white/10"
              >
                Go to Dashboard
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              Start with AI-guided risk assessment or explore the dashboard
            </p>
          </div>

          {/* Right Content - 3D Cube */}
          <div className="relative flex items-center justify-center">
            {/* Glow effect */}
            <div className="absolute w-96 h-96 bg-red-600/20 rounded-full blur-[100px]" />

            {/* 3D Cube */}
            <div className="relative w-80 h-80 perspective-1000">
              <div className="cube-container">
                {/* Cube faces */}
                <div className="cube">
                  {/* Front face */}
                  <div className="cube-face cube-front" />
                  {/* Back face */}
                  <div className="cube-face cube-back" />
                  {/* Right face */}
                  <div className="cube-face cube-right" />
                  {/* Left face */}
                  <div className="cube-face cube-left" />
                  {/* Top face */}
                  <div className="cube-face cube-top" />
                  {/* Bottom face */}
                  <div className="cube-face cube-bottom" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-4xl font-bold mt-6 mb-4">
              Enterprise-grade risk management
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to identify, assess, monitor, and mitigate enterprise risks in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Risk Register',
                description: 'Centralized repository for all enterprise risks with full lifecycle tracking',
                color: 'from-red-500 to-red-700',
              },
              {
                icon: Activity,
                title: 'KRI Monitoring',
                description: 'Real-time key risk indicator tracking with automated alerts and thresholds',
                color: 'from-orange-500 to-red-600',
              },
              {
                icon: BarChart3,
                title: 'Risk Analytics',
                description: 'Advanced analytics and visualizations for executive risk reporting',
                color: 'from-amber-500 to-orange-600',
              },
              {
                icon: Zap,
                title: 'AI Insights',
                description: 'AI-powered risk advisor providing contextual recommendations',
                color: 'from-red-400 to-pink-600',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-red-950/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '99.9%', label: 'Platform Uptime' },
              { value: '500+', label: 'Enterprise Clients' },
              { value: '10M+', label: 'Risks Managed' },
              { value: '<1min', label: 'Alert Response' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to transform your risk management?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of organizations using Lumina R to gain visibility,
            reduce exposure, and build resilience.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-medium hover:from-red-600 hover:to-red-800 transition-all"
          >
            Launch Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-400">Lumina R</span>
          </div>
          <p className="text-sm text-gray-500">
            Part of the Lumina ONE intelligence platform
          </p>
        </div>
      </footer>

      {/* CSS for 3D Cube */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .cube-container {
          width: 200px;
          height: 200px;
          transform-style: preserve-3d;
          animation: float 6s ease-in-out infinite;
        }

        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transform: rotateX(-20deg) rotateY(-30deg);
          animation: rotate 20s linear infinite;
        }

        .cube-face {
          position: absolute;
          width: 200px;
          height: 200px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          background: linear-gradient(135deg, rgba(127, 29, 29, 0.4) 0%, rgba(69, 10, 10, 0.6) 100%);
          backdrop-filter: blur(10px);
        }

        .cube-front {
          transform: translateZ(100px);
          background: linear-gradient(135deg, rgba(153, 27, 27, 0.5) 0%, rgba(69, 10, 10, 0.7) 100%);
        }

        .cube-back {
          transform: rotateY(180deg) translateZ(100px);
        }

        .cube-right {
          transform: rotateY(90deg) translateZ(100px);
          background: linear-gradient(135deg, rgba(127, 29, 29, 0.3) 0%, rgba(69, 10, 10, 0.5) 100%);
        }

        .cube-left {
          transform: rotateY(-90deg) translateZ(100px);
          background: linear-gradient(135deg, rgba(185, 28, 28, 0.4) 0%, rgba(127, 29, 29, 0.6) 100%);
        }

        .cube-top {
          transform: rotateX(90deg) translateZ(100px);
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(153, 27, 27, 0.5) 100%);
        }

        .cube-bottom {
          transform: rotateX(-90deg) translateZ(100px);
        }

        @keyframes rotate {
          from {
            transform: rotateX(-20deg) rotateY(-30deg);
          }
          to {
            transform: rotateX(-20deg) rotateY(330deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
