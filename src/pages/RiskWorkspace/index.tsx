import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
} from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { cn } from '../../utils';
import type { UploadSession } from '../../types';

type UploadStep = 'upload' | 'parsing' | 'mapping' | 'validation' | 'clarification' | 'complete';

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
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [session, setSession] = useState<Partial<UploadSession>>({});
  const [detectedColumns, setDetectedColumns] = useState<DetectedColumn[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [clarificationQuestions, setClarificationQuestions] = useState<ClarificationQuestion[]>([]);
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setCurrentStep('complete');
    } else if (questions.length > 0) {
      setCurrentStep('clarification');
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
    setPreviewData([]);
  };

  const steps: { id: UploadStep; label: string; description: string }[] = [
    { id: 'upload', label: 'Upload', description: 'Select file' },
    { id: 'parsing', label: 'Parse', description: 'Detect schema' },
    { id: 'mapping', label: 'Map', description: 'Map columns' },
    { id: 'validation', label: 'Validate', description: 'Check data' },
    { id: 'clarification', label: 'Clarify', description: 'Resolve issues' },
    { id: 'complete', label: 'Complete', description: 'Import risks' },
  ];

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

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
                    'w-12 md:w-24 h-0.5 mx-2',
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

                      {/* Confidence */}
                      {col.suggestedMapping && (
                        <div className="w-16 text-right">
                          <span
                            className={cn(
                              'text-xs font-medium',
                              col.confidence >= 80
                                ? 'text-emerald-400'
                                : col.confidence >= 60
                                ? 'text-amber-400'
                                : 'text-navy-500'
                            )}
                          >
                            {col.confidence}%
                          </span>
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
                  Finalize Import
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
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

            <div className="flex justify-center gap-3">
              <button className="btn-secondary">
                <Eye className="w-4 h-4 mr-2" />
                View in Register
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
