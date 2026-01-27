import { useState } from 'react';
import { ArrowRight, Building2, Target, CheckCircle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { PageHeader } from '../../components';
import { caseStudies } from '../../data';
import type { CaseStudy } from '../../types';

export default function CaseStudiesPage() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? caseStudies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === caseStudies.length - 1 ? 0 : prev + 1));
  };

  const featuredStudy = caseStudies[currentIndex];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Case Studies"
        subtitle="Real-world success stories in risk management transformation"
      />

      {/* Featured Carousel */}
      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Content */}
          <div className="p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium mb-4">
                <Building2 className="w-4 h-4" />
                {featuredStudy.industry}
              </span>

              <h2 className="text-2xl lg:text-3xl font-bold text-navy-100 mb-4 leading-tight">
                {featuredStudy.title}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-navy-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    Challenge
                  </h3>
                  <p className="text-navy-400 text-sm leading-relaxed">
                    {featuredStudy.challenge}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-navy-300 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Solution
                  </h3>
                  <p className="text-navy-400 text-sm leading-relaxed">
                    {featuredStudy.solution}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedStudy(featuredStudy)}
                className="btn-primary"
              >
                Read Full Story
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-navy-500">
                  {currentIndex + 1} / {caseStudies.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Outcomes */}
          <div className="bg-navy-800/30 p-8 lg:p-10 border-l border-navy-700/50">
            <h3 className="text-lg font-semibold text-navy-100 mb-6">Key Outcomes</h3>
            <div className="grid grid-cols-2 gap-4">
              {featuredStudy.outcomes.map((outcome, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50"
                >
                  <p className="text-2xl font-bold text-navy-100 mb-1">{outcome.value}</p>
                  <p className="text-sm text-navy-400">{outcome.metric}</p>
                  <p className="text-xs text-emerald-400 mt-1">{outcome.improvement}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-navy-300 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {featuredStudy.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-navy-700/50 text-navy-300 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Case Studies Grid */}
      <div>
        <h2 className="text-xl font-semibold text-navy-100 mb-4">All Case Studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              onClick={() => setSelectedStudy(study)}
              className="glass-card-hover p-5 cursor-pointer"
            >
              <span className="text-2xs font-medium text-accent-primary uppercase tracking-wider">
                {study.industry}
              </span>
              <h3 className="text-base font-semibold text-navy-100 mt-2 mb-3 line-clamp-2">
                {study.title}
              </h3>
              <p className="text-sm text-navy-400 line-clamp-2 mb-4">
                {study.challenge}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {study.outcomes.slice(0, 2).map((outcome, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-2xs font-medium"
                  >
                    {outcome.value}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-sm text-accent-primary font-medium">
                Read More
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedStudy && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedStudy(null)}
        >
          <div
            className="glass-card max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-navy-700/50">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium mb-3">
                    <Building2 className="w-4 h-4" />
                    {selectedStudy.industry}
                  </span>
                  <h2 className="text-2xl font-bold text-navy-100">{selectedStudy.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedStudy(null)}
                  className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-navy-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  The Challenge
                </h3>
                <p className="text-navy-400 leading-relaxed">{selectedStudy.challenge}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-navy-300 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  The Solution
                </h3>
                <p className="text-navy-400 leading-relaxed">{selectedStudy.solution}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-navy-300 mb-4">Quantified Outcomes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedStudy.outcomes.map((outcome, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50"
                    >
                      <p className="text-2xl font-bold text-navy-100 mb-1">{outcome.value}</p>
                      <p className="text-sm text-navy-400">{outcome.metric}</p>
                      <p className="text-sm text-emerald-400 mt-1">{outcome.improvement}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-navy-300 mb-3">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStudy.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-navy-700/50 text-navy-300 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-navy-700/50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setSelectedStudy(null)}>
                Close
              </button>
              <button className="btn-primary">
                <ExternalLink className="w-4 h-4 mr-2" />
                Share Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
