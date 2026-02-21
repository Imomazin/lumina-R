import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface UploadedRisk {
  riskId: string;
  category: string;
  description: string;
  likelihood: number;
  impact: number;
  velocity?: string;
  inherentRiskScore: number;
  existingControls?: string;
  controlEffectiveness?: number;
  residualRiskScore?: number;
  riskAppetiteAlignment?: string;
  riskOwner?: string;
  region?: string;
  riskStatus?: string;
  rootCause?: string;
  [key: string]: unknown;
}

export interface UploadedKRI {
  kriId: string;
  riskId: string;
  indicator: string;
  currentValue: number;
  threshold: number | string;
  trend: string;
  status: string;
  [key: string]: unknown;
}

export interface UploadedEvent {
  eventId: string;
  relatedRiskId: string;
  description: string;
  date: string;
  financialImpact?: number;
  rootCause?: string;
  severity?: string;
  status?: string;
  [key: string]: unknown;
}

export interface UploadedControl {
  controlId: string;
  name: string;
  type: string;
  automationLevel?: string;
  owner?: string;
  mappedRiskIds?: string;
  effectiveness?: number;
  [key: string]: unknown;
}

export interface DatasetSummary {
  name: string;
  rowCount: number;
  columns: string[];
  uploadedAt: Date;
}

interface DataContextType {
  // Uploaded datasets
  uploadedRisks: UploadedRisk[];
  uploadedKRIs: UploadedKRI[];
  uploadedEvents: UploadedEvent[];
  uploadedControls: UploadedControl[];

  // Dataset summaries
  datasetSummaries: DatasetSummary[];

  // Status
  hasUploadedData: boolean;
  isDataActive: boolean;  // Whether demo/uploaded data should be displayed

  // Actions
  setRisks: (risks: UploadedRisk[]) => void;
  setKRIs: (kris: UploadedKRI[]) => void;
  setEvents: (events: UploadedEvent[]) => void;
  setControls: (controls: UploadedControl[]) => void;
  addDatasetSummary: (summary: DatasetSummary) => void;
  activateData: () => void;   // Activate data display (when user engages)
  resetAllData: () => void;   // Reset to zero state for new analysis
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [uploadedRisks, setUploadedRisks] = useState<UploadedRisk[]>([]);
  const [uploadedKRIs, setUploadedKRIs] = useState<UploadedKRI[]>([]);
  const [uploadedEvents, setUploadedEvents] = useState<UploadedEvent[]>([]);
  const [uploadedControls, setUploadedControls] = useState<UploadedControl[]>([]);
  const [datasetSummaries, setDatasetSummaries] = useState<DatasetSummary[]>([]);
  const [isDataActive, setIsDataActive] = useState<boolean>(false);

  const hasUploadedData = uploadedRisks.length > 0 || uploadedKRIs.length > 0 || uploadedEvents.length > 0 || uploadedControls.length > 0;

  const setRisks = useCallback((risks: UploadedRisk[]) => {
    setUploadedRisks(risks);
    if (risks.length > 0) setIsDataActive(true);
  }, []);

  const setKRIs = useCallback((kris: UploadedKRI[]) => {
    setUploadedKRIs(kris);
    if (kris.length > 0) setIsDataActive(true);
  }, []);

  const setEvents = useCallback((events: UploadedEvent[]) => {
    setUploadedEvents(events);
    if (events.length > 0) setIsDataActive(true);
  }, []);

  const setControls = useCallback((controls: UploadedControl[]) => {
    setUploadedControls(controls);
    if (controls.length > 0) setIsDataActive(true);
  }, []);

  const addDatasetSummary = useCallback((summary: DatasetSummary) => {
    setDatasetSummaries(prev => [...prev, summary]);
    setIsDataActive(true);
  }, []);

  const activateData = useCallback(() => {
    setIsDataActive(true);
  }, []);

  const resetAllData = useCallback(() => {
    setUploadedRisks([]);
    setUploadedKRIs([]);
    setUploadedEvents([]);
    setUploadedControls([]);
    setDatasetSummaries([]);
    setIsDataActive(false);
  }, []);

  const clearAllData = useCallback(() => {
    setUploadedRisks([]);
    setUploadedKRIs([]);
    setUploadedEvents([]);
    setUploadedControls([]);
    setDatasetSummaries([]);
  }, []);

  return (
    <DataContext.Provider value={{
      uploadedRisks,
      uploadedKRIs,
      uploadedEvents,
      uploadedControls,
      datasetSummaries,
      hasUploadedData,
      isDataActive,
      setRisks,
      setKRIs,
      setEvents,
      setControls,
      addDatasetSummary,
      activateData,
      resetAllData,
      clearAllData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
