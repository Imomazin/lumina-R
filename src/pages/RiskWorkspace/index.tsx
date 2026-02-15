import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  HelpCircle,
  Loader2,
  AlertTriangle,
  Database,
  Table2,
  Shield,
  Activity,
  BarChart3,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { cn } from '../../utils';
import { useData } from '../../context/DataContext';
import {
  parseCSV,
  parseExcel,
  detectDatasetType,
  mapToRisks,
  mapToKRIs,
  mapToEvents,
  mapToControls,
  type ParsedSheet,
  type DatasetType,
} from '../../utils/fileParser';

interface UploadedDataset {
  id: string;
  fileName: string;
  sheet: ParsedSheet;
  detectedType: DatasetType;
  assignedType: DatasetType;
  status: 'parsed' | 'imported' | 'error';
  error?: string;
  expandPreview: boolean;
}

const datasetTypeConfig: Record<DatasetType, { label: string; icon: React.ElementType; color: string; description: string }> = {
  risks: { label: 'Risk Register', icon: AlertTriangle, color: 'text-red-400', description: 'Risk IDs, categories, likelihood, impact scores' },
  kris: { label: 'Key Risk Indicators', icon: Activity, color: 'text-amber-400', description: 'KRI IDs, thresholds, current values, trends' },
  events: { label: 'Risk Events', icon: BarChart3, color: 'text-blue-400', description: 'Event IDs, dates, financial impacts, root causes' },
  controls: { label: 'Controls', icon: Shield, color: 'text-emerald-400', description: 'Control IDs, types, automation levels, owners' },
  unknown: { label: 'Unknown', icon: Table2, color: 'text-navy-400', description: 'Could not auto-detect dataset type' },
};

export default function RiskWorkspace() {
  const navigate = useNavigate();
  const dataCtx = useData();
  const [datasets, setDatasets] = useState<UploadedDataset[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFile, setProcessingFile] = useState<string>('');
  const [importComplete, setImportComplete] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);

  const validExtensions = ['csv', 'xlsx', 'xls'];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setDropError(null);

    if (acceptedFiles.length === 0) {
      setDropError('No files received. Try clicking "Browse Files" below instead.');
      return;
    }

    for (const file of acceptedFiles) {
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (!ext || !validExtensions.includes(ext)) {
        setDropError(`Unsupported file: ${file.name}. Please use .csv, .xlsx, or .xls files.`);
        continue;
      }

      setIsProcessing(true);
      setProcessingFile(file.name);

      try {
        let sheets: ParsedSheet[];

        if (ext === 'csv') {
          const sheet = await parseCSV(file);
          sheets = [sheet];
        } else {
          sheets = await parseExcel(file);
        }

        const newDatasets: UploadedDataset[] = sheets.map((sheet, i) => {
          const detectedType = detectDatasetType(sheet.headers);
          return {
            id: `ds-${Date.now()}-${i}`,
            fileName: file.name,
            sheet,
            detectedType,
            assignedType: detectedType,
            status: 'parsed' as const,
            expandPreview: false,
          };
        });

        setDatasets(prev => [...prev, ...newDatasets]);
      } catch (err) {
        const errorDs: UploadedDataset = {
          id: `ds-err-${Date.now()}`,
          fileName: file.name,
          sheet: { name: file.name, headers: [], rows: [], rowCount: 0 },
          detectedType: 'unknown',
          assignedType: 'unknown',
          status: 'error',
          error: err instanceof Error ? err.message : 'Failed to parse file',
          expandPreview: false,
        };
        setDatasets(prev => [...prev, errorDs]);
      }

      setIsProcessing(false);
      setProcessingFile('');
    }
  }, []);

  const onDropRejected = useCallback(() => {
    setDropError('File rejected. Please upload .csv, .xlsx, or .xls files only.');
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    noClick: false,
    noDrag: false,
    multiple: true,
  });

  const handleTypeChange = (datasetId: string, newType: DatasetType) => {
    setDatasets(prev => prev.map(ds =>
      ds.id === datasetId ? { ...ds, assignedType: newType } : ds
    ));
  };

  const handleRemoveDataset = (datasetId: string) => {
    setDatasets(prev => prev.filter(ds => ds.id !== datasetId));
  };

  const togglePreview = (datasetId: string) => {
    setDatasets(prev => prev.map(ds =>
      ds.id === datasetId ? { ...ds, expandPreview: !ds.expandPreview } : ds
    ));
  };

  const handleImportAll = () => {
    const validDatasets = datasets.filter(ds => ds.status === 'parsed' && ds.assignedType !== 'unknown');

    for (const ds of validDatasets) {
      switch (ds.assignedType) {
        case 'risks': {
          const mapped = mapToRisks(ds.sheet.rows);
          dataCtx.setRisks(mapped);
          dataCtx.addDatasetSummary({
            name: `${ds.sheet.name} (Risks)`,
            rowCount: mapped.length,
            columns: ds.sheet.headers,
            uploadedAt: new Date(),
          });
          break;
        }
        case 'kris': {
          const mapped = mapToKRIs(ds.sheet.rows);
          dataCtx.setKRIs(mapped);
          dataCtx.addDatasetSummary({
            name: `${ds.sheet.name} (KRIs)`,
            rowCount: mapped.length,
            columns: ds.sheet.headers,
            uploadedAt: new Date(),
          });
          break;
        }
        case 'events': {
          const mapped = mapToEvents(ds.sheet.rows);
          dataCtx.setEvents(mapped);
          dataCtx.addDatasetSummary({
            name: `${ds.sheet.name} (Events)`,
            rowCount: mapped.length,
            columns: ds.sheet.headers,
            uploadedAt: new Date(),
          });
          break;
        }
        case 'controls': {
          const mapped = mapToControls(ds.sheet.rows);
          dataCtx.setControls(mapped);
          dataCtx.addDatasetSummary({
            name: `${ds.sheet.name} (Controls)`,
            rowCount: mapped.length,
            columns: ds.sheet.headers,
            uploadedAt: new Date(),
          });
          break;
        }
      }

      // Mark as imported
      setDatasets(prev => prev.map(d =>
        d.id === ds.id ? { ...d, status: 'imported' as const } : d
      ));
    }

    setImportComplete(true);
  };

  const resetWorkspace = () => {
    setDatasets([]);
    setImportComplete(false);
  };

  const validCount = datasets.filter(ds => ds.status === 'parsed' && ds.assignedType !== 'unknown').length;
  const importedCount = datasets.filter(ds => ds.status === 'imported').length;
  const hasRisks = datasets.some(ds => ds.assignedType === 'risks' && ds.status !== 'error');
  const hasKRIs = datasets.some(ds => ds.assignedType === 'kris' && ds.status !== 'error');
  const hasEvents = datasets.some(ds => ds.assignedType === 'events' && ds.status !== 'error');
  const hasControls = datasets.some(ds => ds.assignedType === 'controls' && ds.status !== 'error');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Workspace"
        subtitle="Import your risk register, KRIs, controls, and events"
        actions={
          <div className="flex items-center gap-3">
            {datasets.length > 0 && (
              <button onClick={resetWorkspace} className="btn-secondary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </button>
            )}
          </div>
        }
      />

      {/* Import Complete */}
      {importComplete && (
        <div className="glass-card p-8 border-2 border-emerald-500/30 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-navy-100 mb-2">Data Imported Successfully</h3>
          <p className="text-sm text-navy-400 mb-6">
            {importedCount} dataset{importedCount !== 1 ? 's' : ''} imported into Lumina-R
          </p>

          <div className="flex justify-center gap-4 mb-6">
            {dataCtx.uploadedRisks.length > 0 && (
              <div className="glass-card p-4 text-center min-w-[120px]">
                <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-navy-100">{dataCtx.uploadedRisks.length}</div>
                <p className="text-xs text-navy-400">Risks</p>
              </div>
            )}
            {dataCtx.uploadedKRIs.length > 0 && (
              <div className="glass-card p-4 text-center min-w-[120px]">
                <Activity className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-navy-100">{dataCtx.uploadedKRIs.length}</div>
                <p className="text-xs text-navy-400">KRIs</p>
              </div>
            )}
            {dataCtx.uploadedEvents.length > 0 && (
              <div className="glass-card p-4 text-center min-w-[120px]">
                <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-navy-100">{dataCtx.uploadedEvents.length}</div>
                <p className="text-xs text-navy-400">Events</p>
              </div>
            )}
            {dataCtx.uploadedControls.length > 0 && (
              <div className="glass-card p-4 text-center min-w-[120px]">
                <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-navy-100">{dataCtx.uploadedControls.length}</div>
                <p className="text-xs text-navy-400">Controls</p>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="btn-secondary">
              <Eye className="w-4 h-4 mr-2" />
              View Dashboard
            </button>
            <button onClick={() => navigate('/dashboard/ai-advisor')} className="btn-primary">
              <Database className="w-4 h-4 mr-2" />
              Analyze with AI
            </button>
            <button onClick={resetWorkspace} className="btn-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Import More
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!importComplete && (
        <>
          {/* Dataset Coverage Indicators */}
          {datasets.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { type: 'risks' as const, has: hasRisks, label: 'Risks', count: datasets.find(d => d.assignedType === 'risks')?.sheet.rowCount },
                { type: 'kris' as const, has: hasKRIs, label: 'KRIs', count: datasets.find(d => d.assignedType === 'kris')?.sheet.rowCount },
                { type: 'events' as const, has: hasEvents, label: 'Events', count: datasets.find(d => d.assignedType === 'events')?.sheet.rowCount },
                { type: 'controls' as const, has: hasControls, label: 'Controls', count: datasets.find(d => d.assignedType === 'controls')?.sheet.rowCount },
              ].map(({ type, has, label, count }) => {
                const config = datasetTypeConfig[type];
                const Icon = config.icon;
                return (
                  <div
                    key={type}
                    className={cn(
                      'glass-card p-4 border-l-4 transition-all',
                      has ? 'border-l-emerald-500 bg-emerald-500/5' : 'border-l-navy-700 opacity-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn('w-5 h-5', has ? config.color : 'text-navy-600')} />
                      <div>
                        <p className={cn('text-sm font-medium', has ? 'text-navy-100' : 'text-navy-500')}>{label}</p>
                        {has ? (
                          <p className="text-xs text-emerald-400">{count} rows detected</p>
                        ) : (
                          <p className="text-xs text-navy-600">Not uploaded yet</p>
                        )}
                      </div>
                      {has && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Drop Zone */}
          <SectionCard
            title="Upload Datasets"
            subtitle="Drop CSV or Excel files containing your risk data. Multi-sheet Excel files will be split automatically."
          >
            {/* Error Message */}
            {dropError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{dropError}</p>
                <button onClick={() => setDropError(null)} className="ml-auto text-red-400 hover:text-red-300 text-xs">Dismiss</button>
              </div>
            )}

            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all',
                isDragActive
                  ? 'border-accent-primary bg-accent-primary/10'
                  : 'border-navy-700 hover:border-navy-600 bg-navy-800/30'
              )}
            >
              <input {...getInputProps()} />
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-accent-primary animate-spin mb-4" />
                  <p className="text-lg font-medium text-navy-200 mb-1">Parsing {processingFile}...</p>
                  <p className="text-sm text-navy-500">Reading columns and detecting dataset types</p>
                </div>
              ) : (
                <>
                  <Upload className={cn('w-12 h-12 mx-auto mb-4', isDragActive ? 'text-accent-primary' : 'text-navy-500')} />
                  <p className="text-lg font-medium text-navy-200 mb-2">
                    {isDragActive ? 'Drop files here' : 'Drag & drop your data files here'}
                  </p>
                  <p className="text-sm text-navy-500 mb-3">or</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); open(); }}
                    className="btn-primary px-6 py-2.5 text-base mb-4"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Browse Files
                  </button>
                  <div className="flex items-center justify-center gap-6 text-xs text-navy-600">
                    <span className="flex items-center gap-1">
                      <FileSpreadsheet className="w-4 h-4" /> Excel (.xlsx, .xls)
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" /> CSV
                    </span>
                  </div>
                  <p className="text-xs text-navy-600 mt-3">
                    Upload multiple files at once - risks, KRIs, events, and controls
                  </p>
                </>
              )}
            </div>

            {datasets.length === 0 && (
              <div className="mt-6 p-4 rounded-xl bg-navy-800/30 border border-navy-700/50">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-navy-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-navy-200">What data can you upload?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {(['risks', 'kris', 'events', 'controls'] as const).map(type => {
                        const config = datasetTypeConfig[type];
                        const Icon = config.icon;
                        return (
                          <div key={type} className="flex items-start gap-2">
                            <Icon className={cn('w-4 h-4 mt-0.5', config.color)} />
                            <div>
                              <p className="text-xs font-medium text-navy-300">{config.label}</p>
                              <p className="text-xs text-navy-500">{config.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Parsed Datasets */}
          {datasets.length > 0 && (
            <SectionCard
              title={`Parsed Datasets (${datasets.length})`}
              subtitle="Review detected types and column mappings before importing"
            >
              <div className="space-y-4">
                {datasets.map(ds => {
                  const config = datasetTypeConfig[ds.assignedType];
                  const Icon = config.icon;
                  const isError = ds.status === 'error';
                  const isImported = ds.status === 'imported';

                  return (
                    <div
                      key={ds.id}
                      className={cn(
                        'rounded-xl border transition-all',
                        isError ? 'bg-red-500/5 border-red-500/30' :
                        isImported ? 'bg-emerald-500/5 border-emerald-500/30' :
                        'bg-navy-800/30 border-navy-700/50'
                      )}
                    >
                      {/* Dataset Header */}
                      <div className="p-4 flex items-center gap-4">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          isError ? 'bg-red-500/20' : isImported ? 'bg-emerald-500/20' : 'bg-navy-700/50'
                        )}>
                          {isError ? <XCircle className="w-5 h-5 text-red-400" /> :
                           isImported ? <CheckCircle className="w-5 h-5 text-emerald-400" /> :
                           <Icon className={cn('w-5 h-5', config.color)} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-navy-100 truncate">{ds.sheet.name}</p>
                            <span className="text-xs text-navy-500">from {ds.fileName}</span>
                            {isImported && <span className="px-2 py-0.5 rounded-full text-2xs bg-emerald-500/20 text-emerald-400 font-medium">Imported</span>}
                          </div>
                          <p className="text-xs text-navy-400 mt-0.5">
                            {ds.sheet.rowCount} rows, {ds.sheet.headers.length} columns
                            {ds.detectedType !== 'unknown' && !isError && (
                              <span className="ml-2 text-accent-primary">Auto-detected as {datasetTypeConfig[ds.detectedType].label}</span>
                            )}
                          </p>
                          {isError && <p className="text-xs text-red-400 mt-0.5">{ds.error}</p>}
                        </div>

                        {/* Type Selector */}
                        {!isError && !isImported && (
                          <select
                            value={ds.assignedType}
                            onChange={(e) => handleTypeChange(ds.id, e.target.value as DatasetType)}
                            className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50"
                          >
                            <option value="unknown">-- Select Type --</option>
                            <option value="risks">Risk Register</option>
                            <option value="kris">Key Risk Indicators</option>
                            <option value="events">Risk Events</option>
                            <option value="controls">Controls</option>
                          </select>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!isImported && (
                            <button
                              onClick={() => togglePreview(ds.id)}
                              className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50"
                              title="Preview data"
                            >
                              {ds.expandPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveDataset(ds.id)}
                            className="p-2 rounded-lg text-navy-400 hover:text-red-400 hover:bg-red-500/10"
                            title="Remove dataset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Data Preview */}
                      {ds.expandPreview && !isError && (
                        <div className="border-t border-navy-700/50 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Table2 className="w-4 h-4 text-navy-400" />
                            <p className="text-xs font-medium text-navy-300">Column Headers</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {ds.sheet.headers.map(h => (
                              <span key={h} className="px-2 py-1 rounded bg-navy-700/50 text-xs text-navy-300 font-mono">{h}</span>
                            ))}
                          </div>

                          <p className="text-xs font-medium text-navy-300 mb-2">First 5 Rows</p>
                          <div className="overflow-x-auto rounded-lg border border-navy-700/50">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-navy-800/50">
                                  <th className="text-left py-2 px-3 text-navy-500 font-medium">#</th>
                                  {ds.sheet.headers.slice(0, 8).map(h => (
                                    <th key={h} className="text-left py-2 px-3 text-navy-500 font-medium truncate max-w-[150px]">{h}</th>
                                  ))}
                                  {ds.sheet.headers.length > 8 && (
                                    <th className="text-left py-2 px-3 text-navy-600">+{ds.sheet.headers.length - 8} more</th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {ds.sheet.rows.slice(0, 5).map((row, i) => (
                                  <tr key={i} className="border-t border-navy-800/50">
                                    <td className="py-1.5 px-3 text-navy-500">{i + 1}</td>
                                    {ds.sheet.headers.slice(0, 8).map(h => (
                                      <td key={h} className="py-1.5 px-3 text-navy-300 truncate max-w-[150px]">
                                        {String(row[h] ?? '')}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Import Button */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-navy-400">
                  {validCount > 0 ? (
                    <span className="text-navy-200">{validCount} dataset{validCount !== 1 ? 's' : ''} ready to import</span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Assign a type to at least one dataset to continue
                    </span>
                  )}
                </div>
                <button
                  onClick={handleImportAll}
                  disabled={validCount === 0}
                  className="btn-primary text-base px-6 py-3"
                >
                  <Database className="w-5 h-5 mr-2" />
                  Import {validCount} Dataset{validCount !== 1 ? 's' : ''} into Lumina-R
                </button>
              </div>
            </SectionCard>
          )}

          {/* Already Uploaded Data Summary */}
          {dataCtx.hasUploadedData && datasets.length === 0 && !importComplete && (
            <SectionCard title="Currently Loaded Data" subtitle="Previously imported datasets">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dataCtx.uploadedRisks.length > 0 && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                    <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-navy-100">{dataCtx.uploadedRisks.length}</div>
                    <p className="text-xs text-navy-400">Risks loaded</p>
                  </div>
                )}
                {dataCtx.uploadedKRIs.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                    <Activity className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-navy-100">{dataCtx.uploadedKRIs.length}</div>
                    <p className="text-xs text-navy-400">KRIs loaded</p>
                  </div>
                )}
                {dataCtx.uploadedEvents.length > 0 && (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
                    <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-navy-100">{dataCtx.uploadedEvents.length}</div>
                    <p className="text-xs text-navy-400">Events loaded</p>
                  </div>
                )}
                {dataCtx.uploadedControls.length > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-navy-100">{dataCtx.uploadedControls.length}</div>
                    <p className="text-xs text-navy-400">Controls loaded</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={() => dataCtx.clearAllData()} className="btn-secondary text-sm">
                  Clear All Data
                </button>
              </div>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}
