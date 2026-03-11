import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedSheet {
  name: string;
  headers: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
}

export type DatasetType = 'risks' | 'kris' | 'events' | 'controls' | 'unknown';

/**
 * Parse a CSV file and return structured data
 */
export function parseCSV(file: File): Promise<ParsedSheet> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        resolve({
          name: file.name.replace(/\.[^.]+$/, ''),
          headers,
          rows: results.data as Record<string, unknown>[],
          rowCount: results.data.length,
        });
      },
      error: (error) => {
        reject(new Error(`CSV parse error: ${error.message}`));
      },
    });
  });
}

/**
 * Parse an Excel file and return all sheets as structured data
 */
export function parseExcel(file: File): Promise<ParsedSheet[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheets: ParsedSheet[] = [];

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });
          const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

          sheets.push({
            name: sheetName,
            headers,
            rows: jsonData,
            rowCount: jsonData.length,
          });
        }

        resolve(sheets);
      } catch (err) {
        reject(new Error(`Excel parse error: ${err instanceof Error ? err.message : String(err)}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Auto-detect what type of dataset a sheet contains based on column headers
 */
export function detectDatasetType(headers: string[]): DatasetType {
  const lower = headers.map(h => String(h).toLowerCase().replace(/[^a-z0-9]/g, ''));

  // Detect Risks
  const riskSignals = ['riskid', 'riskcategory', 'riskdescription', 'likelihood', 'impact', 'inherentriskscore', 'residualriskscore', 'riskowner', 'riskstatus', 'rootcause', 'velocity'];
  const riskScore = riskSignals.filter(s => lower.some(h => h.includes(s))).length;

  // Detect KRIs
  const kriSignals = ['kriid', 'indicator', 'currentvalue', 'threshold', 'trend', 'status', 'riskid'];
  const kriScore = kriSignals.filter(s => lower.some(h => h.includes(s))).length;

  // Detect Events
  const eventSignals = ['eventid', 'relatedriskid', 'financialimpact', 'date', 'rootcause', 'severity', 'lessonlearned'];
  const eventScore = eventSignals.filter(s => lower.some(h => h.includes(s))).length;

  // Detect Controls
  const controlSignals = ['controlid', 'controlname', 'automationlevel', 'mappedriskids', 'controltype', 'effectiveness', 'testfrequency'];
  const controlScore = controlSignals.filter(s => lower.some(h => h.includes(s))).length;

  const scores = { risks: riskScore, kris: kriScore, events: eventScore, controls: controlScore };
  const maxScore = Math.max(...Object.values(scores));

  if (maxScore < 2) return 'unknown';

  const best = Object.entries(scores).find(([, v]) => v === maxScore);
  return (best?.[0] as DatasetType) || 'unknown';
}

/**
 * Normalize column names to canonical form
 */
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Map raw row data to normalized risk objects
 */
export function mapToRisks(rows: Record<string, unknown>[]): import('../context/DataContext').UploadedRisk[] {
  return rows.map((row, i) => {
    const get = (patterns: string[]): unknown => {
      for (const key of Object.keys(row)) {
        const norm = normalizeKey(key);
        if (patterns.some(p => norm.includes(p))) return row[key];
      }
      return undefined;
    };

    return {
      riskId: String(get(['riskid', 'id']) || `RISK-${i + 1}`),
      category: String(get(['riskcategory', 'category']) || 'Uncategorized'),
      description: String(get(['riskdescription', 'description', 'riskname', 'name', 'title']) || ''),
      likelihood: Number(get(['likelihood', 'probability']) || 3),
      impact: Number(get(['impact', 'impactscore']) || 3),
      velocity: String(get(['velocity', 'speed']) || ''),
      inherentRiskScore: Number(get(['inherentriskscore', 'inherentscore', 'riskscore']) || 0),
      existingControls: String(get(['existingcontrols', 'controls', 'control']) || ''),
      controlEffectiveness: Number(get(['controleffectiveness', 'effectiveness']) || 0),
      residualRiskScore: Number(get(['residualriskscore', 'residualscore']) || 0),
      riskAppetiteAlignment: String(get(['riskappetitealignment', 'appetitealignment', 'appetite']) || ''),
      riskOwner: String(get(['riskowner', 'owner']) || ''),
      region: String(get(['region', 'geography', 'location']) || ''),
      riskStatus: String(get(['riskstatus', 'status']) || 'Active'),
      rootCause: String(get(['rootcause', 'cause']) || ''),
    };
  });
}

/**
 * Map raw row data to normalized KRI objects
 */
export function mapToKRIs(rows: Record<string, unknown>[]): import('../context/DataContext').UploadedKRI[] {
  return rows.map((row, i) => {
    const get = (patterns: string[]): unknown => {
      for (const key of Object.keys(row)) {
        const norm = normalizeKey(key);
        if (patterns.some(p => norm.includes(p))) return row[key];
      }
      return undefined;
    };

    return {
      kriId: String(get(['kriid', 'id']) || `KRI-${i + 1}`),
      riskId: String(get(['riskid', 'relatedrisk', 'linkedrisk']) || ''),
      indicator: String(get(['indicator', 'indicatorname', 'name', 'kri']) || ''),
      currentValue: Number(get(['currentvalue', 'value', 'current']) || 0),
      threshold: get(['threshold', 'limit', 'target']) as number | string ?? 0,
      trend: String(get(['trend', 'direction']) || 'Stable'),
      status: String(get(['status', 'state']) || 'Green'),
    };
  });
}

/**
 * Map raw row data to normalized event objects
 */
export function mapToEvents(rows: Record<string, unknown>[]): import('../context/DataContext').UploadedEvent[] {
  return rows.map((row, i) => {
    const get = (patterns: string[]): unknown => {
      for (const key of Object.keys(row)) {
        const norm = normalizeKey(key);
        if (patterns.some(p => norm.includes(p))) return row[key];
      }
      return undefined;
    };

    return {
      eventId: String(get(['eventid', 'id']) || `EVT-${i + 1}`),
      relatedRiskId: String(get(['relatedriskid', 'riskid', 'linkedrisk']) || ''),
      description: String(get(['description', 'eventdescription', 'name', 'event']) || ''),
      date: String(get(['date', 'eventdate', 'occurrencedate']) || ''),
      financialImpact: Number(get(['financialimpact', 'impact', 'cost', 'loss']) || 0),
      rootCause: String(get(['rootcause', 'cause']) || ''),
      severity: String(get(['severity', 'level']) || ''),
      status: String(get(['status', 'resolution']) || ''),
    };
  });
}

/**
 * Map raw row data to normalized control objects
 */
export function mapToControls(rows: Record<string, unknown>[]): import('../context/DataContext').UploadedControl[] {
  return rows.map((row, i) => {
    const get = (patterns: string[]): unknown => {
      for (const key of Object.keys(row)) {
        const norm = normalizeKey(key);
        if (patterns.some(p => norm.includes(p))) return row[key];
      }
      return undefined;
    };

    return {
      controlId: String(get(['controlid', 'id']) || `CTRL-${i + 1}`),
      name: String(get(['controlname', 'name', 'control']) || ''),
      type: String(get(['controltype', 'type']) || ''),
      automationLevel: String(get(['automationlevel', 'automation']) || ''),
      owner: String(get(['owner', 'controlowner']) || ''),
      mappedRiskIds: String(get(['mappedriskids', 'riskids', 'riskmapping']) || ''),
      effectiveness: Number(get(['effectiveness', 'effectivenessscore', 'score']) || 0),
    };
  });
}
