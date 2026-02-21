// ============================================================================
// LUMINA-R v2 ENGINE — CORRELATION LAYER
// Systemic clustering, risk graph, cascade exposure analysis
// ============================================================================

import {
  enterpriseRisks,
  type EnterpriseRisk,
  getControlsByRiskId,
  getKRIsByRiskId
} from './dataLayer';
import { calculateRiskEMV } from './quantificationLayer';

// ============================================================================
// CORRELATION CONFIGURATION
// ============================================================================

export const CORRELATION_CONFIG = {
  // Minimum connection strength for edge creation
  minEdgeStrength: 0.3,
  // Edge type weights
  edgeWeights: {
    sharedRootCause: 0.9,
    sharedControl: 0.7,
    sharedKRI: 0.6,
    sameOwner: 0.4,
    sameRegion: 0.3,
    sameCategory: 0.5
  },
  // Cascade propagation factor
  cascadePropagationFactor: 0.35,  // 35% of EMV propagates to connected risks
  // Minimum cluster size for reporting
  minClusterSize: 2
};

// ============================================================================
// RISK GRAPH TYPES
// ============================================================================

export interface RiskEdge {
  sourceRiskId: number;
  targetRiskId: number;
  edgeType: 'sharedRootCause' | 'sharedControl' | 'sharedKRI' | 'sameOwner' | 'sameRegion' | 'sameCategory';
  strength: number;
  detail: string;
}

export interface RiskNode {
  riskId: number;
  riskDescription: string;
  category: string;
  residualEMV: number;
  edges: RiskEdge[];
  connectionCount: number;
  totalEdgeStrength: number;
  centralityScore: number;
}

export interface RiskGraph {
  nodes: RiskNode[];
  edges: RiskEdge[];
  totalEdges: number;
  averageConnections: number;
  mostConnectedRisk: RiskNode;
}

// ============================================================================
// EDGE DETECTION FUNCTIONS
// ============================================================================

function detectSharedRootCause(risk1: EnterpriseRisk, risk2: EnterpriseRisk): RiskEdge | null {
  // Simple keyword matching for root cause similarity
  const words1 = risk1.rootCause.toLowerCase().split(/\s+/);
  const words2 = risk2.rootCause.toLowerCase().split(/\s+/);
  const keywords = ['inadequate', 'lack', 'insufficient', 'failure', 'gap', 'weakness', 'dependency', 'vulnerability'];

  const shared = keywords.filter(kw => words1.includes(kw) && words2.includes(kw));
  if (shared.length >= 2) {
    return {
      sourceRiskId: risk1.riskId,
      targetRiskId: risk2.riskId,
      edgeType: 'sharedRootCause',
      strength: CORRELATION_CONFIG.edgeWeights.sharedRootCause,
      detail: `Shared root cause keywords: ${shared.join(', ')}`
    };
  }
  return null;
}

function detectSharedControl(risk1: EnterpriseRisk, risk2: EnterpriseRisk): RiskEdge | null {
  const controls1 = getControlsByRiskId(risk1.riskId);
  const controls2 = getControlsByRiskId(risk2.riskId);

  const sharedControls = controls1.filter(c1 =>
    controls2.some(c2 => c1.controlId === c2.controlId)
  );

  if (sharedControls.length > 0) {
    return {
      sourceRiskId: risk1.riskId,
      targetRiskId: risk2.riskId,
      edgeType: 'sharedControl',
      strength: Math.min(1, CORRELATION_CONFIG.edgeWeights.sharedControl * sharedControls.length),
      detail: `Shared controls: ${sharedControls.map(c => c.controlId).join(', ')}`
    };
  }
  return null;
}

function detectSharedKRI(risk1: EnterpriseRisk, risk2: EnterpriseRisk): RiskEdge | null {
  const kris1 = getKRIsByRiskId(risk1.riskId);
  const kris2 = getKRIsByRiskId(risk2.riskId);

  // Check for KRIs monitoring similar indicators
  const similarIndicators = kris1.filter(k1 =>
    kris2.some(k2 => {
      const words1 = k1.indicator.toLowerCase().split(/\s+/);
      const words2 = k2.indicator.toLowerCase().split(/\s+/);
      const overlap = words1.filter(w => words2.includes(w) && w.length > 4);
      return overlap.length >= 2;
    })
  );

  if (similarIndicators.length > 0) {
    return {
      sourceRiskId: risk1.riskId,
      targetRiskId: risk2.riskId,
      edgeType: 'sharedKRI',
      strength: CORRELATION_CONFIG.edgeWeights.sharedKRI,
      detail: `Related KRI indicators detected`
    };
  }
  return null;
}

function detectSameOwner(risk1: EnterpriseRisk, risk2: EnterpriseRisk): RiskEdge | null {
  if (risk1.riskOwner === risk2.riskOwner) {
    return {
      sourceRiskId: risk1.riskId,
      targetRiskId: risk2.riskId,
      edgeType: 'sameOwner',
      strength: CORRELATION_CONFIG.edgeWeights.sameOwner,
      detail: `Same owner: ${risk1.riskOwner}`
    };
  }
  return null;
}

function detectSameRegion(risk1: EnterpriseRisk, risk2: EnterpriseRisk): RiskEdge | null {
  if (risk1.region === risk2.region && risk1.region !== 'Global') {
    return {
      sourceRiskId: risk1.riskId,
      targetRiskId: risk2.riskId,
      edgeType: 'sameRegion',
      strength: CORRELATION_CONFIG.edgeWeights.sameRegion,
      detail: `Same region: ${risk1.region}`
    };
  }
  return null;
}

function detectSameCategory(risk1: EnterpriseRisk, risk2: EnterpriseRisk): RiskEdge | null {
  if (risk1.riskCategory === risk2.riskCategory) {
    return {
      sourceRiskId: risk1.riskId,
      targetRiskId: risk2.riskId,
      edgeType: 'sameCategory',
      strength: CORRELATION_CONFIG.edgeWeights.sameCategory,
      detail: `Same category: ${risk1.riskCategory}`
    };
  }
  return null;
}

// ============================================================================
// RISK GRAPH BUILDER
// ============================================================================

export function buildRiskGraph(): RiskGraph {
  const edges: RiskEdge[] = [];
  const nodeMap = new Map<number, RiskNode>();

  // Initialize nodes
  for (const risk of enterpriseRisks) {
    const emv = calculateRiskEMV(risk);
    nodeMap.set(risk.riskId, {
      riskId: risk.riskId,
      riskDescription: risk.riskDescription,
      category: risk.riskCategory,
      residualEMV: emv.residualEMV,
      edges: [],
      connectionCount: 0,
      totalEdgeStrength: 0,
      centralityScore: 0
    });
  }

  // Detect edges between all risk pairs
  for (let i = 0; i < enterpriseRisks.length; i++) {
    for (let j = i + 1; j < enterpriseRisks.length; j++) {
      const risk1 = enterpriseRisks[i];
      const risk2 = enterpriseRisks[j];

      const detectors = [
        detectSharedRootCause,
        detectSharedControl,
        detectSharedKRI,
        detectSameOwner,
        detectSameRegion,
        detectSameCategory
      ];

      for (const detector of detectors) {
        const edge = detector(risk1, risk2);
        if (edge && edge.strength >= CORRELATION_CONFIG.minEdgeStrength) {
          edges.push(edge);

          // Update node connections
          const node1 = nodeMap.get(risk1.riskId)!;
          const node2 = nodeMap.get(risk2.riskId)!;

          node1.edges.push(edge);
          node2.edges.push({ ...edge, sourceRiskId: risk2.riskId, targetRiskId: risk1.riskId });

          node1.connectionCount++;
          node2.connectionCount++;
          node1.totalEdgeStrength += edge.strength;
          node2.totalEdgeStrength += edge.strength;
        }
      }
    }
  }

  // Calculate centrality scores
  const nodes = Array.from(nodeMap.values());
  const maxConnections = Math.max(...nodes.map(n => n.connectionCount));

  for (const node of nodes) {
    node.centralityScore = maxConnections > 0
      ? Math.round((node.connectionCount / maxConnections) * 100)
      : 0;
  }

  const totalConnections = nodes.reduce((sum, n) => sum + n.connectionCount, 0);

  return {
    nodes,
    edges,
    totalEdges: edges.length,
    averageConnections: Math.round((totalConnections / nodes.length) * 10) / 10,
    mostConnectedRisk: nodes.sort((a, b) => b.connectionCount - a.connectionCount)[0]
  };
}

// ============================================================================
// SYSTEMIC CLUSTER DETECTION
// ============================================================================

export interface SystemicCluster {
  clusterId: number;
  riskIds: number[];
  riskDescriptions: string[];
  categories: string[];
  dominantCategory: string;
  aggregateEMV: number;
  averageEMV: number;
  connectionDensity: number;
  cascadeExposure: number;
  primaryCorrelation: string;
  systemicRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export function detectSystemicClusters(): SystemicCluster[] {
  const graph = buildRiskGraph();
  const visited = new Set<number>();
  const clusters: SystemicCluster[] = [];
  let clusterId = 0;

  // DFS-based cluster detection
  function dfs(riskId: number, cluster: number[]): void {
    if (visited.has(riskId)) return;
    visited.add(riskId);
    cluster.push(riskId);

    const node = graph.nodes.find(n => n.riskId === riskId);
    if (!node) return;

    for (const edge of node.edges) {
      if (edge.strength >= 0.5) {  // Only follow strong connections
        dfs(edge.targetRiskId, cluster);
      }
    }
  }

  // Find all clusters
  for (const node of graph.nodes) {
    if (!visited.has(node.riskId)) {
      const cluster: number[] = [];
      dfs(node.riskId, cluster);

      if (cluster.length >= CORRELATION_CONFIG.minClusterSize) {
        const clusterRisks = cluster.map(id => enterpriseRisks.find(r => r.riskId === id)!);
        const clusterNodes = cluster.map(id => graph.nodes.find(n => n.riskId === id)!);

        // Calculate cluster metrics
        const aggregateEMV = clusterNodes.reduce((sum, n) => sum + n.residualEMV, 0);
        const categories = [...new Set(clusterRisks.map(r => r.riskCategory))];
        const categoryCount = categories.map(cat => ({
          cat,
          count: clusterRisks.filter(r => r.riskCategory === cat).length
        }));
        const dominantCategory = categoryCount.sort((a, b) => b.count - a.count)[0].cat;

        // Connection density within cluster
        const clusterEdges = graph.edges.filter(e =>
          cluster.includes(e.sourceRiskId) && cluster.includes(e.targetRiskId)
        );
        const maxPossibleEdges = (cluster.length * (cluster.length - 1)) / 2;
        const connectionDensity = maxPossibleEdges > 0
          ? Math.round((clusterEdges.length / maxPossibleEdges) * 100)
          : 0;

        // Cascade exposure: EMV that could propagate through cluster
        const cascadeExposure = Math.round(
          aggregateEMV * CORRELATION_CONFIG.cascadePropagationFactor * (cluster.length - 1)
        );

        // Determine primary correlation type
        const edgeTypes = clusterEdges.map(e => e.edgeType);
        const typeCounts = edgeTypes.reduce((acc, t) => {
          acc[t] = (acc[t] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const primaryCorrelation = Object.entries(typeCounts)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'mixed';

        // Systemic risk level
        let systemicRiskLevel: SystemicCluster['systemicRiskLevel'];
        if (cascadeExposure > 10000000 || cluster.length > 10) systemicRiskLevel = 'Critical';
        else if (cascadeExposure > 5000000 || cluster.length > 6) systemicRiskLevel = 'High';
        else if (cascadeExposure > 2000000 || cluster.length > 4) systemicRiskLevel = 'Medium';
        else systemicRiskLevel = 'Low';

        clusters.push({
          clusterId: ++clusterId,
          riskIds: cluster,
          riskDescriptions: clusterRisks.map(r => r.riskDescription.substring(0, 60)),
          categories,
          dominantCategory,
          aggregateEMV,
          averageEMV: Math.round(aggregateEMV / cluster.length),
          connectionDensity,
          cascadeExposure,
          primaryCorrelation,
          systemicRiskLevel
        });
      }
    }
  }

  return clusters.sort((a, b) => b.cascadeExposure - a.cascadeExposure);
}

// ============================================================================
// CASCADE ANALYSIS
// ============================================================================

export interface CascadeAnalysis {
  triggerRiskId: number;
  triggerRiskDescription: string;
  triggerEMV: number;
  affectedRisks: Array<{
    riskId: number;
    riskDescription: string;
    connectionStrength: number;
    propagatedEMV: number;
  }>;
  totalCascadeEMV: number;
  cascadeMultiplier: number;
}

export function analyzeCascadeImpact(triggerRiskId: number): CascadeAnalysis | null {
  const risk = enterpriseRisks.find(r => r.riskId === triggerRiskId);
  if (!risk) return null;

  const graph = buildRiskGraph();
  const triggerNode = graph.nodes.find(n => n.riskId === triggerRiskId);
  if (!triggerNode) return null;

  const triggerEMV = triggerNode.residualEMV;
  const affectedRisks: CascadeAnalysis['affectedRisks'] = [];

  for (const edge of triggerNode.edges) {
    const targetRisk = enterpriseRisks.find(r => r.riskId === edge.targetRiskId);
    if (targetRisk) {
      const propagatedEMV = Math.round(
        triggerEMV * edge.strength * CORRELATION_CONFIG.cascadePropagationFactor
      );
      affectedRisks.push({
        riskId: edge.targetRiskId,
        riskDescription: targetRisk.riskDescription.substring(0, 60),
        connectionStrength: edge.strength,
        propagatedEMV
      });
    }
  }

  const totalCascadeEMV = affectedRisks.reduce((sum, r) => sum + r.propagatedEMV, 0);

  return {
    triggerRiskId,
    triggerRiskDescription: risk.riskDescription,
    triggerEMV,
    affectedRisks: affectedRisks.sort((a, b) => b.propagatedEMV - a.propagatedEMV),
    totalCascadeEMV,
    cascadeMultiplier: triggerEMV > 0
      ? Math.round(((triggerEMV + totalCascadeEMV) / triggerEMV) * 100) / 100
      : 1
  };
}

// ============================================================================
// HIGH-CENTRALITY RISKS
// ============================================================================

export function getHighCentralityRisks(limit: number = 10): RiskNode[] {
  const graph = buildRiskGraph();
  return graph.nodes
    .sort((a, b) => b.centralityScore - a.centralityScore)
    .slice(0, limit);
}
