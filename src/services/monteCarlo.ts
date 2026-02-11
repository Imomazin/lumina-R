import type { MonteCarloConfig, MonteCarloResult, TriangularEstimate, StressScenario } from '../types';

/**
 * Monte Carlo Simulation Engine
 * Implements triangular distribution sampling for risk quantification
 */

// Generate a random number from triangular distribution
function triangularSample(min: number, mode: number, max: number): number {
  if (min >= max || mode < min || mode > max) {
    return mode; // Return mode if parameters are invalid
  }

  const u = Math.random();
  const fc = (mode - min) / (max - min);

  if (u < fc) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

// Generate sample from normal distribution (Box-Muller transform)
function normalSample(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * stdDev + mean;
}

// Generate sample from uniform distribution
function uniformSample(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// PERT distribution (modified beta distribution)
function pertSample(min: number, mode: number, max: number, lambda = 4): number {
  if (min >= max) return mode;

  // Calculate alpha and beta for beta distribution
  const range = max - min;
  const mu = (min + lambda * mode + max) / (lambda + 2);
  const alpha = ((mu - min) * (2 * mode - min - max)) / ((mode - mu) * (max - min)) || 2;
  const beta = (alpha * (max - mu)) / (mu - min) || 2;

  // Simple approximation using triangular as fallback
  if (isNaN(alpha) || isNaN(beta) || alpha <= 0 || beta <= 0) {
    return triangularSample(min, mode, max);
  }

  // Generate beta-distributed sample and scale to range
  const u = betaSample(alpha, beta);
  return min + u * range;
}

// Beta distribution sample using rejection sampling
function betaSample(alpha: number, beta: number): number {
  // Simple approximation for Monte Carlo
  let u1, u2;
  do {
    u1 = Math.random();
    u2 = Math.random();
  } while (u1 === 0);

  const x = Math.pow(u1, 1 / alpha);
  const y = Math.pow(u2, 1 / beta);
  return x / (x + y);
}

// Calculate expected value from triangular estimate
export function calculateExpectedValue(estimate: TriangularEstimate): number {
  return (estimate.bestCase + estimate.mostLikely + estimate.worstCase) / 3;
}

// Calculate variance from triangular estimate
export function calculateVariance(estimate: TriangularEstimate): number {
  const { bestCase: a, mostLikely: b, worstCase: c } = estimate;
  return (a * a + b * b + c * c - a * b - a * c - b * c) / 18;
}

// Run Monte Carlo simulation
export function runMonteCarloSimulation(
  estimates: TriangularEstimate[],
  config: Partial<MonteCarloConfig> = {}
): {
  results: number[];
  statistics: {
    mean: number;
    stdDev: number;
    min: number;
    max: number;
    percentiles: Record<number, number>;
    valueAtRisk: number;
    conditionalVaR: number;
  };
} {
  const iterations = config.iterations || 10000;
  const confidenceLevel = config.confidenceLevel || 95;
  const distributionType = config.distributionType || 'triangular';

  const results: number[] = [];

  // Run simulations
  for (let i = 0; i < iterations; i++) {
    let totalImpact = 0;

    for (const estimate of estimates) {
      let sample: number;

      switch (distributionType) {
        case 'normal':
          const ev = calculateExpectedValue(estimate);
          const stdDev = Math.sqrt(calculateVariance(estimate));
          sample = normalSample(ev, stdDev);
          break;
        case 'uniform':
          sample = uniformSample(estimate.bestCase, estimate.worstCase);
          break;
        case 'pert':
          sample = pertSample(estimate.bestCase, estimate.mostLikely, estimate.worstCase);
          break;
        case 'triangular':
        default:
          sample = triangularSample(estimate.bestCase, estimate.mostLikely, estimate.worstCase);
      }

      totalImpact += Math.max(0, sample);
    }

    results.push(totalImpact);
  }

  // Sort results for percentile calculations
  const sortedResults = [...results].sort((a, b) => a - b);

  // Calculate statistics
  const mean = results.reduce((sum, r) => sum + r, 0) / results.length;
  const variance = results.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / results.length;
  const stdDev = Math.sqrt(variance);

  // Calculate percentiles
  const percentileValues = [5, 10, 25, 50, 75, 90, 95, 99];
  const percentiles: Record<number, number> = {};
  for (const p of percentileValues) {
    const index = Math.floor((p / 100) * sortedResults.length);
    percentiles[p] = sortedResults[Math.min(index, sortedResults.length - 1)];
  }

  // Value at Risk (VaR) at confidence level
  const varIndex = Math.floor((confidenceLevel / 100) * sortedResults.length);
  const valueAtRisk = sortedResults[Math.min(varIndex, sortedResults.length - 1)];

  // Conditional VaR (Expected Shortfall) - average of values beyond VaR
  const tailValues = sortedResults.slice(varIndex);
  const conditionalVaR = tailValues.length > 0
    ? tailValues.reduce((sum, v) => sum + v, 0) / tailValues.length
    : valueAtRisk;

  return {
    results,
    statistics: {
      mean,
      stdDev,
      min: sortedResults[0],
      max: sortedResults[sortedResults.length - 1],
      percentiles,
      valueAtRisk,
      conditionalVaR,
    },
  };
}

// Generate histogram data for visualization
export function generateHistogramData(
  results: number[],
  bins = 50
): { bin: number; count: number; percentage: number }[] {
  const min = Math.min(...results);
  const max = Math.max(...results);
  const binWidth = (max - min) / bins;

  const histogram: { bin: number; count: number; percentage: number }[] = [];

  for (let i = 0; i < bins; i++) {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    const count = results.filter((r) => r >= binStart && r < binEnd).length;

    histogram.push({
      bin: binStart + binWidth / 2,
      count,
      percentage: (count / results.length) * 100,
    });
  }

  return histogram;
}

// Generate cumulative distribution data
export function generateCumulativeData(
  results: number[],
  points = 100
): { value: number; probability: number }[] {
  const sortedResults = [...results].sort((a, b) => a - b);
  const cumulative: { value: number; probability: number }[] = [];

  for (let i = 0; i < points; i++) {
    const index = Math.floor((i / points) * sortedResults.length);
    cumulative.push({
      value: sortedResults[index],
      probability: ((i + 1) / points) * 100,
    });
  }

  return cumulative;
}

// Generate stress scenarios based on simulation results
export function generateStressScenarios(
  results: number[],
  _mean: number
): StressScenario[] {
  const sortedResults = [...results].sort((a, b) => a - b);
  const length = sortedResults.length;

  return [
    {
      name: 'Best Case (5th percentile)',
      probability: 5,
      impact: sortedResults[Math.floor(0.05 * length)],
      description: 'Optimistic scenario with minimal risk materialization',
    },
    {
      name: 'Expected Case (50th percentile)',
      probability: 50,
      impact: sortedResults[Math.floor(0.5 * length)],
      description: 'Most likely outcome based on probability distribution',
    },
    {
      name: 'Adverse Case (90th percentile)',
      probability: 90,
      impact: sortedResults[Math.floor(0.9 * length)],
      description: 'Significant risk materialization scenario',
    },
    {
      name: 'Severe Case (95th percentile)',
      probability: 95,
      impact: sortedResults[Math.floor(0.95 * length)],
      description: 'High-impact stress scenario for planning',
    },
    {
      name: 'Extreme Case (99th percentile)',
      probability: 99,
      impact: sortedResults[Math.floor(0.99 * length)],
      description: 'Tail risk scenario for worst-case planning',
    },
  ];
}

// Full Monte Carlo analysis with all outputs
export function runFullMonteCarloAnalysis(
  estimates: TriangularEstimate[],
  riskId: string,
  config: Partial<MonteCarloConfig> = {}
): Omit<MonteCarloResult, 'id'> {
  const { results, statistics } = runMonteCarloSimulation(estimates, config);
  const histogramData = generateHistogramData(results);
  const stressScenarios = generateStressScenarios(results, statistics.mean);

  return {
    riskId,
    runDate: new Date().toISOString(),
    iterations: config.iterations || 10000,
    probabilityDistribution: histogramData.map((h) => h.percentage),
    valueAtRisk: statistics.valueAtRisk,
    conditionalVaR: statistics.conditionalVaR,
    percentiles: statistics.percentiles,
    mean: statistics.mean,
    stdDev: statistics.stdDev,
    stressScenarios,
  };
}

export default {
  runMonteCarloSimulation,
  runFullMonteCarloAnalysis,
  generateHistogramData,
  generateCumulativeData,
  generateStressScenarios,
  calculateExpectedValue,
  calculateVariance,
};
