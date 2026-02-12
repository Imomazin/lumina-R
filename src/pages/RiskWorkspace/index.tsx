import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  FileType,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Download,
  Eye,
  HelpCircle,
  Loader2,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Shield,
  Target,
  BarChart3,
} from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { cn } from '../../utils';
import type { UploadSession } from '../../types';

type UploadStep = 'upload' | 'parsing' | 'mapping' | 'validation' | 'clarification' | 'gap_detection' | 'complete';

interface DetectedColumn {
  originalName: string;
  suggestedMapping: string | null;
  sampleValues: string[];
  dataType: 'string' | 'number' | 'date' | 'boolean';
  confidence: number;
}

interface ValidationIssue {
  row: number;
  column: string;
  issue: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

interface ClarificationQuestion {
  id: string;
  field: string;
  question: string;
  options: string[];
  selectedOption?: string;
}

interface DataGap {
  id: string;
  field: string;
  label: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
  icon: React.ElementType;
  advisorPhase?: string;
}

const canonicalFields = [
  { key: 'title', label: 'Risk Title', required: true },
  { key: 'description', label: 'Description', required: true },
  { key: 'category', label: 'Category', required: true },
  { key: 'owner', label: 'Risk Owner', required: true },
  { key: 'probability', label: 'Probability (1-5)', required: true },
  { key: 'impact', label: 'Impact (1-5)', required: true },
  { key: 'status', label: 'Status', required: false },
  { key: 'severity', label: 'Severity', required: false },
  { key: 'department', label: 'Department', required: false },
  { key: 'dateIdentified', label: 'Date Identified', required: false },
  { key: 'mitigationPlan', label: 'Mitigation Plan', required: false },
  { key: 'controls', label: 'Controls', required: false },
  { key: 'linkedObjectiveIds', label: 'Linked Objectives', required: false },
  { key: 'riskAppetite', label: 'Risk Appetite', required: false },
  { key: 'constraintMapping', label: 'Constraint Mapping', required: false },
  { key: 'kri', label: 'Key Risk Indicators', required: false },
  { key: 'kci', label: 'Key Control Indicators', required: false },
];

const fileTypeIcons: Record<string, React.ElementType> = {
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  csv: FileSpreadsheet,
  pdf: FileType,
  doc: FileText,
  docx: FileText,
};

export default function RiskWorkspace() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [session, setSession] = useState<Partial<UploadSession>>({});
  const [detectedColumns, setDetectedColumns] = useState<DetectedColumn[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [clarificationQuestions, setClarificationQuestions] = useState<ClarificationQuestion[]>([]);
  const [dataGaps, setDataGaps] = useState<DataGap[]>([]);
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gapsResolved, setGapsResolved] = useState<Set<string>>(new Set());

  // Calculate overall mapping confidence score
  const overallConfidence = useMemo(() => {
    if (detectedColumns.length === 0) return 0;
    const mappedColumns = detectedColumns.filter(col => columnMappings[col.originalName]);
    if (mappedColumns.length === 0) return 0;
    const totalConfidence = mappedColumns.reduce((sum, col) => sum + col.confidence, 0);
    return Math.round(totalConfidence / mappedColumns.length);
  }, [detectedColumns, columnMappings]);

  // Calculate mapping completeness
  const mappingCompleteness = useMemo(() => {
    const requiredFields = canonicalFields.filter(f => f.required);
    const mappedRequired = requiredFields.filter(f =>
      Object.values(columnMappings).includes(f.key)
    );
    return Math.round((mappedRequired.length / requiredFields.length) * 100);
  }, [columnMappings]);

  // Calculate readiness score (combination of confidence and completeness)
  const readinessScore = useMemo(() => {
    return Math.round((overallConfidence * 0.6) + (mappingCompleteness * 0.4));
  }, [overallConfidence, mappingCompleteness]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setSession({
      id: `upload-${Date.now()}`,
      fileName: file.name,
      fileType: getFileType(file.name),
      status: 'uploading',
      uploadedAt: new Date().toISOString(),
    });

    // Simulate file parsing
    setIsProcessing(true);
    setCurrentStep('parsing');

    await simulateFileParsing(file);
    setIsProcessing(false);
    setCurrentStep('mapping');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  });

  const getFileType = (filename: string): UploadSession['fileType'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'xlsx' || ext === 'xls') return 'excel';
    if (ext === 'csv') return 'csv';
    if (ext === 'pdf') return 'pdf';
    return 'word';
  };

  const simulateFileParsing = async (_file: File) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate detected columns based on file type
    const mockColumns: DetectedColumn[] = [
      { originalName: 'Risk Name', suggestedMapping: 'title', sampleValues: ['Cyber Attack', 'Data Breach', 'System Failure'], dataType: 'string', confidence: 95 },
      { originalName: 'Risk Description', suggestedMapping: 'description', sampleValues: ['Unauthorized access to...', 'Loss of customer...', 'Critical system...'], dataType: 'string', confidence: 90 },
      { originalName: 'Risk Category', suggestedMapping: 'category', sampleValues: ['Cyber', 'Operational', 'Financial'], dataType: 'string', confidence: 85 },
      { originalName: 'Owner', suggestedMapping: 'owner', sampleValues: ['John Smith', 'Jane Doe', 'Mike Johnson'], dataType: 'string', confidence: 88 },
      { originalName: 'Likelihood', suggestedMapping: 'probability', sampleValues: ['3', '4', '2'], dataType: 'number', confidence: 75 },
      { originalName: 'Impact Score', suggestedMapping: 'impact', sampleValues: ['4', '5', '3'], dataType: 'number', confidence: 78 },
      { originalName: 'Dept', suggestedMapping: 'department', sampleValues: ['IT', 'Finance', 'Operations'], dataType: 'string', confidence: 82 },
      { originalName: 'Date Added', suggestedMapping: 'dateIdentified', sampleValues: ['2024-01-15', '2024-02-20', '2024-03-01'], dataType: 'date', confidence: 92 },
      { originalName: 'Mitigation', suggestedMapping: 'mitigationPlan', sampleValues: ['Implement MFA', 'Encrypt data', 'Add redundancy'], dataType: 'string', confidence: 70 },
      { originalName: 'Unknown Column', suggestedMapping: null, sampleValues: ['ABC', 'DEF', 'GHI'], dataType: 'string', confidence: 0 },
    ];

    setDetectedColumns(mockColumns);
    setSession((prev) => ({ ...prev, detectedSchema: Object.fromEntries(mockColumns.map((c) => [c.originalName, c.dataType])) }));

    // Auto-set high-confidence mappings
    const autoMappings: Record<string, string> = {};
    mockColumns.forEach((col) => {
      if (col.suggestedMapping && col.confidence >= 70) {
        autoMappings[col.originalName] = col.suggestedMapping;
      }
    });
    setColumnMappings(autoMappings);

    // Generate preview data
    setPreviewData([
      { 'Risk Name': 'Cyber Attack', 'Risk Description': 'Unauthorized access to systems', 'Risk Category': 'Cyber', 'Owner': 'John Smith', 'Likelihood': '3', 'Impact Score': '4' },
      { 'Risk Name': 'Data Breach', 'Risk Description': 'Loss of customer data', 'Risk Category': 'Operational', 'Owner': 'Jane Doe', 'Likelihood': '4', 'Impact Score': '5' },
      { 'Risk Name': 'System Failure', 'Risk Description': 'Critical system downtime', 'Risk Category': 'Operational', 'Owner': 'Mike Johnson', 'Likelihood': '2', 'Impact Score': '3' },
    ]);
  };

  const handleMappingChange = (originalColumn: string, targetField: string) => {
    setColumnMappings((prev) => ({
      ...prev,
      [originalColumn]: targetField,
    }));
  };

  const validateMappings = async () => {
    setIsProcessing(true);
    setCurrentStep('validation');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate validation issues
    const issues: ValidationIssue[] = [
      { row: 2, column: 'Risk Category', issue: 'Value "Cyber" not in standard categories', severity: 'warning', suggestion: 'Map to "cyber"' },
      { row: 5, column: 'Likelihood', issue: 'Value "High" is not numeric (expected 1-5)', severity: 'error', suggestion: 'Convert to scale value' },
      { row: 7, column: 'Owner', issue: 'Missing value', severity: 'warning', suggestion: 'Assign default owner' },
    ];

    setValidationIssues(issues);

    // Generate clarification questions for ambiguous data
    const questions: ClarificationQuestion[] = [
      {
        id: 'q1',
        field: 'category',
        question: 'How should "Cyber" be mapped to our risk categories?',
        options: ['cyber', 'operational', 'compliance'],
      },
      {
        id: 'q2',
        field: 'probability',
        question: 'The file uses "High/Medium/Low" for likelihood. How should we convert?',
        options: ['High=5, Medium=3, Low=1', 'High=4, Medium=3, Low=2', 'Keep as text'],
      },
    ];

    setClarificationQuestions(questions);
    setIsProcessing(false);

    if (issues.filter((i) => i.severity === 'error').length === 0 && questions.length === 0) {
      // Check for data gaps before completing
      await detectDataGaps();
    } else if (questions.length > 0) {
      setCurrentStep('clarification');
    }
  };

  const detectDataGaps = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Analyze mapped data for missing risk intelligence components
    const mappedFields = Object.values(columnMappings);
    const gaps: DataGap[] = [];

    // Check for Risk Appetite
    if (!mappedFields.includes('riskAppetite')) {
      gaps.push({
        id: 'gap_risk_appetite',
        field: 'riskAppetite',
        label: 'Risk Appetite',
        description: 'No risk appetite levels defined. Required for proper risk scoring and threshold alerts.',
        severity: 'critical',
        icon: TrendingUp,
        advisorPhase: 'constraint_architecture',
      });
    }

    // Check for Constraint Mapping
    if (!mappedFields.includes('constraintMapping')) {
      gaps.push({
        id: 'gap_constraints',
        field: 'constraintMapping',
        label: 'Constraint Framework',
        description: 'Risks not linked to organizational constraints. Required for impact assessment.',
        severity: 'critical',
        icon: Shield,
        advisorPhase: 'constraint_architecture',
      });
    }

    // Check for Objectives linkage
    if (!mappedFields.includes('linkedObjectiveIds')) {
      gaps.push({
        id: 'gap_objectives',
        field: 'linkedObjectiveIds',
        label: 'Strategic Objectives',
        description: 'Risks not linked to business objectives. Recommended for strategic alignment.',
        severity: 'high',
        icon: Target,
        advisorPhase: 'context_establishment',
      });
    }

    // Check for KRIs
    if (!mappedFields.includes('kri')) {
      gaps.push({
        id: 'gap_kri',
        field: 'kri',
        label: 'Key Risk Indicators',
        description: 'No KRIs defined for monitoring. Required for proactive risk management.',
        severity: 'high',
        icon: BarChart3,
        advisorPhase: 'kri_builder',
      });
    }

    // Check for Controls/KCIs
    if (!mappedFields.includes('kci') && !mappedFields.includes('controls')) {
      gaps.push({
        id: 'gap_controls',
        field: 'kci',
        label: 'Controls & KCIs',
        description: 'No control indicators mapped. Required for control effectiveness monitoring.',
        severity: 'medium',
        icon: Shield,
        advisorPhase: 'kci_builder',
      });
    }

    setDataGaps(gaps);
    setIsProcessing(false);

    if (gaps.filter(g => g.severity === 'critical').length > 0) {
      setCurrentStep('gap_detection');
    } else {
      setCurrentStep('complete');
      setSession((prev) => ({ ...prev, status: 'complete' }));
    }
  };

  const handleClarificationAnswer = (questionId: string, answer: string) => {
    setClarificationQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, selectedOption: answer } : q))
    );
  };

  const finalizeClarifications = async () => {
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsProcessing(false);
    // After clarifications, check for data gaps
    await detectDataGaps();
  };

  const launchAdvisorForGap = (gap: DataGap) => {
    // Navigate to AI Advisor with the specific phase
    navigate(`/dashboard/ai-advisor?phase=${gap.advisorPhase}&returnTo=workspace`);
  };

  const markGapResolved = (gapId: string) => {
    setGapsResolved(prev => new Set([...prev, gapId]));
  };

  const proceedWithGaps = () => {
    setCurrentStep('complete');
    setSession((prev) => ({ ...prev, status: 'complete' }));
  };

  const resetWorkspace = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setSession({});
    setDetectedColumns([]);
    setColumnMappings({});
    setValidationIssues([]);
    setClarificationQuestions([]);
    setDataGaps([]);
    setPreviewData([]);
    setGapsResolved(new Set());
  };

  const steps: { id: UploadStep; label: string; description: string }[] = [
    { id: 'upload', label: 'Upload', description: 'Select file' },
    { id: 'parsing', label: 'Parse', description: 'Detect schema' },
    { id: 'mapping', label: 'Map', description: 'Map columns' },
    { id: 'validation', label: 'Validate', description: 'Check data' },
    { id: 'clarification', label: 'Clarify', description: 'Resolve issues' },
    { id: 'gap_detection', label: 'Gaps', description: 'Fill gaps' },
    { id: 'complete', label: 'Complete', description: 'Import risks' },
  ];

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getConfidenceBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Workspace"
        subtitle="Import and normalize risk data from external sources"
        actions={
          <div className="flex items-center gap-3">
            {uploadedFile && (
              <button onClick={resetWorkspace} className="btn-secondary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </button>
            )}
          </div>
        }
      />

      {/* Overall Mapping Confidence Score - Prominent Display */}
      {currentStep === 'mapping' && detectedColumns.length > 0 && (
        <div className="glass-card p-6 border-2 border-accent-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                'w-16 h-16 rounded-xl flex items-center justify-center',
                overallConfidence >= 80 ? 'bg-emerald-500/20' :
                overallConfidence >= 60 ? 'bg-amber-500/20' : 'bg-red-500/20'
              )}>
                <span className={cn('text-2xl font-bold', getConfidenceColor(overallConfidence))}>
                  {overallConfidence}%
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-100">Mapping Confidence Score</h3>
                <p className="text-sm text-navy-400">
                  Based on {detectedColumns.filter(c => columnMappings[c.originalName]).length} of {detectedColumns.length} columns mapped
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Readiness Score */}
              <div className="text-center">
                <div className={cn('text-xl font-bold', getConfidenceColor(readinessScore))}>
                  {readinessScore}%
                </div>
                <p className="text-xs text-navy-500">Import Readiness</p>
              </div>

              {/* Completeness */}
              <div className="text-center">
                <div className={cn('text-xl font-bold', getConfidenceColor(mappingCompleteness))}>
                  {mappingCompleteness}%
                </div>
                <p className="text-xs text-navy-500">Required Fields</p>
              </div>

              {/* Visual Progress */}
              <div className="w-32">
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full transition-all duration-500', getConfidenceBg(overallConfidence))}
                    style={{ width: `${overallConfidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                    index < stepIndex
                      ? 'bg-emerald-500 text-white'
                      : index === stepIndex
                      ? 'bg-accent-primary text-white'
                      : 'bg-navy-800 text-navy-500'
                  )}
                >
                  {index < stepIndex ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-1',
                    index <= stepIndex ? 'text-navy-200' : 'text-navy-600'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 md:w-16 h-0.5 mx-2',
                    index < stepIndex ? 'bg-emerald-500' : 'bg-navy-800'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload Step */}
      {currentStep === 'upload' && (
        <SectionCard title="Upload Risk Data" subtitle="Supports Excel, CSV, PDF, and Word documents">
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all',
              isDragActive
                ? 'border-accent-primary bg-accent-primary/10'
                : 'border-navy-700 hover:border-navy-600 bg-navy-800/30'
            )}
          >
            <input {...getInputProps()} />
            <Upload
              className={cn(
                'w-12 h-12 mx-auto mb-4',
                isDragActive ? 'text-accent-primary' : 'text-navy-500'
              )}
            />
            <p className="text-lg font-medium text-navy-200 mb-2">
              {isDragActive ? 'Drop file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-sm text-navy-500 mb-4">or click to browse</p>
            <div className="flex items-center justify-center gap-6 text-xs text-navy-600">
              <span className="flex items-center gap-1">
                <FileSpreadsheet className="w-4 h-4" /> Excel/CSV
              </span>
              <span className="flex items-center gap-1">
                <FileType className="w-4 h-4" /> PDF
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" /> Word
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-navy-800/30 border border-navy-700/50">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-navy-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-navy-200">Tips for best results</p>
                <ul className="text-xs text-navy-500 mt-2 space-y-1">
                  <li>• Include column headers in the first row</li>
                  <li>• Use consistent date formats (YYYY-MM-DD preferred)</li>
                  <li>• Probability and impact should be numeric (1-5 scale)</li>
                  <li>• Risk categories should match: strategic, financial, operational, compliance, cyber, reputational</li>
                </ul>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Parsing Step */}
      {currentStep === 'parsing' && (
        <SectionCard title="Parsing File" subtitle="Detecting schema and extracting data">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-accent-primary animate-spin mb-4" />
            <p className="text-lg font-medium text-navy-200 mb-2">Analyzing {uploadedFile?.name}</p>
            <p className="text-sm text-navy-500">Detecting columns and data types...</p>
          </div>
        </SectionCard>
      )}

      {/* Mapping Step */}
      {currentStep === 'mapping' && (
        <div className="space-y-6">
          <SectionCard
            title="Column Mapping"
            subtitle={`Detected ${detectedColumns.length} columns - map them to canonical risk fields`}
          >
            <div className="space-y-3">
              {detectedColumns.map((col) => {
                const FileIcon = fileTypeIcons[session.fileType || 'csv'] || FileSpreadsheet;
                return (
                  <div
                    key={col.originalName}
                    className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50"
                  >
                    <div className="flex items-center gap-4">
                      {/* Source Column */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileIcon className="w-4 h-4 text-navy-500" />
                          <span className="text-sm font-medium text-navy-200">{col.originalName}</span>
                          <span className="px-1.5 py-0.5 rounded text-2xs bg-navy-700 text-navy-400">
                            {col.dataType}
                          </span>
                        </div>
                        <p className="text-xs text-navy-500 truncate">
                          Sample: {col.sampleValues.slice(0, 3).join(', ')}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="w-5 h-5 text-navy-600" />

                      {/* Target Mapping */}
                      <div className="w-48">
                        <select
                          value={columnMappings[col.originalName] || ''}
                          onChange={(e) => handleMappingChange(col.originalName, e.target.value)}
                          className={cn(
                            'input text-sm',
                            col.confidence >= 70 && columnMappings[col.originalName]
                              ? 'border-emerald-500/50'
                              : ''
                          )}
                        >
                          <option value="">-- Skip column --</option>
                          {canonicalFields.map((field) => (
                            <option key={field.key} value={field.key}>
                              {field.label} {field.required && '*'}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Confidence Badge */}
                      {col.suggestedMapping && (
                        <div className={cn(
                          'px-2 py-1 rounded-lg text-xs font-medium',
                          col.confidence >= 80
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : col.confidence >= 60
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                        )}>
                          {col.confidence}% confidence
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Required fields check */}
            <div className="mt-6 p-4 rounded-xl bg-navy-800/30 border border-navy-700/50">
              <p className="text-sm font-medium text-navy-200 mb-2">Required Fields</p>
              <div className="flex flex-wrap gap-2">
                {canonicalFields
                  .filter((f) => f.required)
                  .map((field) => {
                    const isMapped = Object.values(columnMappings).includes(field.key);
                    return (
                      <span
                        key={field.key}
                        className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          isMapped
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        )}
                      >
                        {isMapped ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <XCircle className="w-3 h-3 inline mr-1" />}
                        {field.label}
                      </span>
                    );
                  })}
              </div>
            </div>
          </SectionCard>

          {/* Preview */}
          <SectionCard title="Data Preview" subtitle="First 3 rows of your data">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-700">
                    {Object.keys(previewData[0] || {}).map((col) => (
                      <th key={col} className="text-left py-2 px-3 text-xs text-navy-500 font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="border-b border-navy-800/50">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="py-2 px-3 text-navy-300">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="flex justify-end">
            <button
              onClick={validateMappings}
              disabled={
                !canonicalFields
                  .filter((f) => f.required)
                  .every((f) => Object.values(columnMappings).includes(f.key))
              }
              className="btn-primary"
            >
              Validate Mappings
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Validation Step */}
      {currentStep === 'validation' && isProcessing && (
        <SectionCard title="Validating Data" subtitle="Checking for errors and inconsistencies">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-accent-primary animate-spin mb-4" />
            <p className="text-lg font-medium text-navy-200">Validating data...</p>
          </div>
        </SectionCard>
      )}

      {/* Clarification Step */}
      {currentStep === 'clarification' && (
        <div className="space-y-6">
          {validationIssues.length > 0 && (
            <SectionCard
              title="Validation Issues"
              subtitle={`${validationIssues.filter((i) => i.severity === 'error').length} errors, ${validationIssues.filter((i) => i.severity === 'warning').length} warnings`}
            >
              <div className="space-y-2">
                {validationIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'p-3 rounded-lg border flex items-start gap-3',
                      issue.severity === 'error'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-amber-500/10 border-amber-500/30'
                    )}
                  >
                    {issue.severity === 'error' ? (
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-navy-200">
                        Row {issue.row}, Column "{issue.column}": {issue.issue}
                      </p>
                      {issue.suggestion && (
                        <p className="text-xs text-navy-500 mt-1">Suggestion: {issue.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {clarificationQuestions.length > 0 && (
            <SectionCard title="Clarification Needed" subtitle="Please answer the following questions">
              <div className="space-y-4">
                {clarificationQuestions.map((q) => (
                  <div key={q.id} className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50">
                    <p className="text-sm font-medium text-navy-200 mb-3">{q.question}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleClarificationAnswer(q.id, option)}
                          className={cn(
                            'px-3 py-2 rounded-lg text-sm transition-colors',
                            q.selectedOption === option
                              ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary'
                              : 'bg-navy-800/50 text-navy-300 border border-navy-700 hover:border-navy-600'
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          <div className="flex justify-end">
            <button
              onClick={finalizeClarifications}
              disabled={
                clarificationQuestions.some((q) => !q.selectedOption) ||
                validationIssues.some((i) => i.severity === 'error') ||
                isProcessing
              }
              className="btn-primary"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Gap Detection Step */}
      {currentStep === 'gap_detection' && (
        <div className="space-y-6">
          {/* Gap Detection Alert */}
          <div className="glass-card p-6 border-2 border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-navy-100">Missing Risk Intelligence Data</h3>
                <p className="text-sm text-navy-400 mt-1">
                  Your upload is missing critical data for comprehensive risk analysis.
                  Use the AI Risk Advisor to fill these gaps before proceeding.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-400">
                  {dataGaps.filter(g => !gapsResolved.has(g.id)).length}
                </div>
                <p className="text-xs text-navy-500">Gaps remaining</p>
              </div>
            </div>
          </div>

          {/* Data Gaps List */}
          <SectionCard
            title="Data Gaps Detected"
            subtitle="Click 'Launch Advisor' to fill missing data through guided questions"
          >
            <div className="space-y-4">
              {dataGaps.map((gap) => {
                const isResolved = gapsResolved.has(gap.id);
                const GapIcon = gap.icon;

                return (
                  <div
                    key={gap.id}
                    className={cn(
                      'p-4 rounded-xl border transition-all',
                      isResolved
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : gap.severity === 'critical'
                        ? 'bg-red-500/10 border-red-500/30'
                        : gap.severity === 'high'
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-navy-800/30 border-navy-700/50'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        isResolved
                          ? 'bg-emerald-500/20'
                          : gap.severity === 'critical'
                          ? 'bg-red-500/20'
                          : gap.severity === 'high'
                          ? 'bg-amber-500/20'
                          : 'bg-navy-700/50'
                      )}>
                        {isResolved ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <GapIcon className={cn(
                            'w-5 h-5',
                            gap.severity === 'critical' ? 'text-red-400' :
                            gap.severity === 'high' ? 'text-amber-400' : 'text-navy-400'
                          )} />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-navy-200">{gap.label}</h4>
                          {!isResolved && (
                            <span className={cn(
                              'px-1.5 py-0.5 rounded text-2xs font-medium uppercase',
                              gap.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                              gap.severity === 'high' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-navy-700 text-navy-400'
                            )}>
                              {gap.severity}
                            </span>
                          )}
                          {isResolved && (
                            <span className="px-1.5 py-0.5 rounded text-2xs font-medium bg-emerald-500/20 text-emerald-400">
                              RESOLVED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-navy-500 mt-1">{gap.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isResolved ? (
                          <button className="btn-secondary text-sm py-1.5 px-3 opacity-50 cursor-not-allowed">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completed
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => launchAdvisorForGap(gap)}
                              className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1"
                            >
                              <Sparkles className="w-4 h-4" />
                              Launch Advisor
                            </button>
                            <button
                              onClick={() => markGapResolved(gap.id)}
                              className="btn-secondary text-sm py-1.5 px-3"
                              title="Mark as already provided"
                            >
                              Skip
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Analytics Block Warning */}
            {dataGaps.some(g => g.severity === 'critical' && !gapsResolved.has(g.id)) && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Analytics Blocked</p>
                    <p className="text-xs text-navy-400">
                      Advanced analytics (Monte Carlo, Bow-Tie) require critical gaps to be resolved.
                      Fill missing data to unlock full analysis capabilities.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          <div className="flex justify-between">
            <button
              onClick={proceedWithGaps}
              className="btn-secondary"
            >
              Proceed with Warnings
            </button>
            <button
              onClick={proceedWithGaps}
              disabled={dataGaps.some(g => g.severity === 'critical' && !gapsResolved.has(g.id))}
              className="btn-primary"
            >
              Complete Import
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Complete Step */}
      {currentStep === 'complete' && (
        <SectionCard>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-navy-100 mb-2">Import Complete</h3>
            <p className="text-sm text-navy-400 mb-6">
              Successfully imported {previewData.length} risks from {uploadedFile?.name}
            </p>

            {/* Import Summary Stats */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{overallConfidence}%</div>
                <p className="text-xs text-navy-500">Mapping Confidence</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{previewData.length}</div>
                <p className="text-xs text-navy-500">Risks Imported</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{gapsResolved.size}</div>
                <p className="text-xs text-navy-500">Gaps Resolved</p>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                <Eye className="w-4 h-4 mr-2" />
                View Dashboard
              </button>
              <button className="btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
              <button onClick={resetWorkspace} className="btn-primary">
                <Upload className="w-4 h-4 mr-2" />
                Import More
              </button>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
