import React, { useState, useMemo, useRef } from 'react';
import { AssessmentRecord, SchoolType, DataStatus, DataType } from '../types';
import { convertRecordsToCSV, downloadCSV } from '../utils/csvExport';
import { exportDeviceBackup, mergeRecords, MergeResult } from '../utils/mergeData';
import { getFormattedTimestamp } from '../utils/storage';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  Eye, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Smartphone, 
  Share2,
  X,
  Clock,
  ArrowUpDown,
  Shuffle
} from 'lucide-react';
import { DatasetPresetMode } from '../utils/datasetSeeder';

interface DataCenterViewProps {
  records: AssessmentRecord[];
  onUpdateRecord: (updated: AssessmentRecord) => void;
  onDeleteRecord: (recordId: string) => void;
  onMergeImport: (merged: AssessmentRecord[]) => void;
  onClearSynthetic: () => void;
  onReseedDataset?: (mode: DatasetPresetMode) => void;
}

export const DataCenterView: React.FC<DataCenterViewProps> = ({
  records,
  onUpdateRecord,
  onDeleteRecord,
  onMergeImport,
  onClearSynthetic,
  onReseedDataset
}) => {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState<'All' | SchoolType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | DataStatus>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | DataType>('All');
  const [sortField, setSortField] = useState<'timestamp' | 'studentId' | 'totalScore'>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);

  // Modals state
  const [viewingRecord, setViewingRecord] = useState<AssessmentRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<AssessmentRecord | null>(null);
  const [editNote, setEditNote] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Multi-device import state
  const [mergeReport, setMergeReport] = useState<MergeResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Summary counts
  const totalCount = records.length;
  const govCount = records.filter(r => r.schoolType === 'Government').length;
  const pvtCount = records.filter(r => r.schoolType === 'Private').length;
  const completeCount = records.filter(r => r.dataStatus === 'Complete').length;
  const incompleteCount = records.filter(r => r.dataStatus === 'Incomplete').length;
  const syntheticCount = records.filter(r => r.dataType === 'SYNTHETIC').length;
  const fieldCount = records.filter(r => r.dataType === 'FIELD').length;

  // Filtered and sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter(r => {
        if (schoolFilter !== 'All' && r.schoolType !== schoolFilter) return false;
        if (statusFilter !== 'All' && r.dataStatus !== statusFilter) return false;
        if (typeFilter !== 'All' && r.dataType !== typeFilter) return false;
        if (searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase();
          const matchesId = r.studentId.toLowerCase().includes(q);
          const matchesRec = r.recordId.toLowerCase().includes(q);
          const matchesDate = r.timestamp.toLowerCase().includes(q);
          const matchesClass = r.studentClass.toLowerCase().includes(q);
          if (!matchesId && !matchesRec && !matchesDate && !matchesClass) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'timestamp') {
          return sortAsc 
            ? a.timestamp.localeCompare(b.timestamp)
            : b.timestamp.localeCompare(a.timestamp);
        } else if (sortField === 'studentId') {
          return sortAsc 
            ? a.studentId.localeCompare(b.studentId)
            : b.studentId.localeCompare(a.studentId);
        } else {
          return sortAsc 
            ? a.totalScore - b.totalScore
            : b.totalScore - a.totalScore;
        }
      });
  }, [records, schoolFilter, statusFilter, typeFilter, searchTerm, sortField, sortAsc]);

  // Export handlers
  const handleExportComplete = () => {
    const csv = convertRecordsToCSV(records);
    downloadCSV(`CEP_Learning_Outcomes_Complete_Dataset_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleExportGov = () => {
    const govRecords = records.filter(r => r.schoolType === 'Government');
    const csv = convertRecordsToCSV(govRecords);
    downloadCSV(`CEP_Government_School_Dataset_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleExportPvt = () => {
    const pvtRecords = records.filter(r => r.schoolType === 'Private');
    const csv = convertRecordsToCSV(pvtRecords);
    downloadCSV(`CEP_Private_School_Dataset_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  // Import / Merge handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        const incomingRecords: AssessmentRecord[] = Array.isArray(parsed) 
          ? parsed 
          : Array.isArray(parsed.records) 
          ? parsed.records 
          : [];

        if (incomingRecords.length === 0) {
          alert('No valid assessment records found in uploaded file.');
          return;
        }

        const report = mergeRecords(records, incomingRecords);
        setMergeReport(report);
        onMergeImport(report.newRecords);
      } catch (err) {
        alert('Failed to parse uploaded backup file. Ensure it is a valid JSON file exported from this application.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Save Edit record
  const handleSaveEdit = () => {
    if (!editingRecord) return;
    const updated: AssessmentRecord = {
      ...editingRecord,
      lastModified: getFormattedTimestamp(),
      editNotes: editNote.trim() || undefined
    };
    onUpdateRecord(updated);
    setEditingRecord(null);
    setEditNote('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Stats Cards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-6 h-6 text-indigo-600" />
              <span>Research Data Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Master repository for student assessments, CSV exports, and multi-phone dataset merging.
            </p>
          </div>

          {/* Quick CSV Export Dropdown / Action */}
          <div className="flex flex-wrap items-center gap-2">
            {onReseedDataset && (
              <>
                <button
                  type="button"
                  onClick={() => onReseedDataset('75_each')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Jumble 75 Each (150)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onReseedDataset('75_total')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Jumble 75 Total</span>
                </button>
              </>
            )}
            <button
              id="btn-export-all-csv"
              onClick={handleExportComplete}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Complete Dataset (CSV)</span>
            </button>

            <button
              id="btn-export-device-backup"
              onClick={() => exportDeviceBackup(records)}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-xs transition-colors"
              title="Download full JSON backup for this device to merge onto laptop or secondary phone"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Export Device Backup</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Import / Merge Data</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 5 Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Records
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {totalCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {fieldCount} Field • {syntheticCount} Demo
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              Gov School
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {govCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Prefix G001+
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              Private School
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {pvtCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Prefix P001+
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              Complete (9/9)
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {completeCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Standard completed tests
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
            <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
              Incomplete
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-1">
              {incompleteCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Partial test submissions
            </div>
          </div>
        </div>
      </div>

      {/* Merge Report Notice (if triggered) */}
      {mergeReport && (
        <div className="bg-white rounded-xl p-4 border border-indigo-200 bg-indigo-50/40 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Multi-Device Data Merge Completed</span>
            </div>
            <button 
              onClick={() => setMergeReport(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-700">
            Added <strong>{mergeReport.addedCount}</strong> new unique records. 
            Skipped <strong>{mergeReport.skippedDuplicates}</strong> duplicate records. 
            Total records updated from {mergeReport.totalBefore} to {mergeReport.totalAfter}.
          </p>
          {mergeReport.conflictingStudentIds.length > 0 && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <strong>Notice on Student ID overlap:</strong> The following Student IDs appeared in both devices: {mergeReport.conflictingStudentIds.join(', ')}. Each record preserves its distinct Record_ID and timestamp.
            </div>
          )}
        </div>
      )}

      {/* Specialized Export Buttons */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <span className="font-semibold text-slate-600 mr-1">Direct CSV Downloads:</span>
        <button
          id="btn-export-gov-csv"
          onClick={handleExportGov}
          disabled={govCount === 0}
          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 font-semibold"
        >
          Export Government Data ({govCount})
        </button>
        <button
          id="btn-export-pvt-csv"
          onClick={handleExportPvt}
          disabled={pvtCount === 0}
          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 disabled:opacity-40 font-semibold"
        >
          Export Private Data ({pvtCount})
        </button>
        {syntheticCount > 0 && (
          <button
            id="btn-clear-synthetic-datacenter"
            onClick={onClearSynthetic}
            className="ml-auto text-rose-700 hover:text-rose-900 font-semibold underline"
          >
            Clear {syntheticCount} Synthetic Demo Records
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="search-records-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Student ID, Record ID, Date, or Class..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs rounded-lg border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* School filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              id="filter-school-select"
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value as any)}
              className="bg-slate-50 text-slate-700 text-xs rounded-lg border border-slate-200 px-3 py-2 font-semibold focus:outline-hidden"
            >
              <option value="All">All Schools</option>
              <option value="Government">Government School</option>
              <option value="Private">Private School</option>
            </select>

            {/* Status filter */}
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 text-slate-700 text-xs rounded-lg border border-slate-200 px-3 py-2 font-semibold focus:outline-hidden"
            >
              <option value="All">All Status</option>
              <option value="Complete">Complete Only</option>
              <option value="Incomplete">Incomplete Only</option>
            </select>

            {/* Type filter */}
            <select
              id="filter-type-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-slate-50 text-slate-700 text-xs rounded-lg border border-slate-200 px-3 py-2 font-semibold focus:outline-hidden"
            >
              <option value="All">All Types (Field + Demo)</option>
              <option value="FIELD">Field Study Records Only</option>
              <option value="SYNTHETIC">Synthetic Demo Records Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th 
                  className="px-4 py-3 cursor-pointer select-none hover:text-slate-800"
                  onClick={() => {
                    if (sortField === 'studentId') setSortAsc(!sortAsc);
                    else { setSortField('studentId'); setSortAsc(true); }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Student ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3">School</th>
                <th className="px-3 py-3">Class</th>
                <th className="px-3 py-3">Lang</th>
                <th className="px-3 py-3">Enumerator</th>
                <th className="px-3 py-3 text-center">Reading</th>
                <th className="px-3 py-3 text-center">Math</th>
                <th className="px-3 py-3 text-center">Reasoning</th>
                <th 
                  className="px-4 py-3 cursor-pointer select-none hover:text-slate-800 text-center"
                  onClick={() => {
                    if (sortField === 'totalScore') setSortAsc(!sortAsc);
                    else { setSortField('totalScore'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Total / 9 (%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 cursor-pointer select-none hover:text-slate-800"
                  onClick={() => {
                    if (sortField === 'timestamp') setSortAsc(!sortAsc);
                    else { setSortField('timestamp'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Timestamp</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-12 text-slate-400">
                    No assessment records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isGov = r.schoolType === 'Government';
                  return (
                    <tr key={r.recordId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {r.studentId}
                        {r.dataType === 'SYNTHETIC' && (
                          <span className="ml-1 text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-sm font-semibold">
                            DEMO
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isGov 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {isGov ? <Building2 className="w-2.5 h-2.5" /> : <GraduationCap className="w-2.5 h-2.5" />}
                          {r.schoolType}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-700">
                        {r.studentClass} ({r.section || 'A'})
                      </td>
                      <td className="px-3 py-3 text-slate-600 font-medium">
                        {r.language === 'hi' ? '🇮🇳 Hi' : '🇬🇧 En'}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {r.enumerator}
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-indigo-700">
                        {r.readingScore}/3
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-emerald-700">
                        {r.mathScore}/3
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-amber-700">
                        {r.reasoningScore}/3
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-900">
                        {r.totalScore} <span className="text-slate-400 font-normal">({r.percentage}%)</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {r.timestamp}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.dataStatus === 'Complete'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.dataStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-view-${r.recordId}`}
                            onClick={() => setViewingRecord(r)}
                            className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                            title="View Question-by-Question Audit"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-edit-${r.recordId}`}
                            onClick={() => {
                              setEditingRecord(r);
                              setEditNote(r.editNotes || '');
                            }}
                            className="p-1 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                            title="Edit Record"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-${r.recordId}`}
                            onClick={() => setDeleteConfirmId(r.recordId)}
                            className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredRecords.length} of {records.length} records</span>
          <span>Anonymous Student Records • Field Research Compliance</span>
        </div>
      </div>

      {/* VIEW RECORD AUDIT MODAL */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Student Record: {viewingRecord.studentId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    viewingRecord.schoolType === 'Government' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {viewingRecord.schoolType} School
                  </span>
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Record ID: {viewingRecord.recordId}
                </div>
              </div>
              <button onClick={() => setViewingRecord(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div><span className="text-slate-500">Class:</span> <strong>{viewingRecord.studentClass} ({viewingRecord.section})</strong></div>
              <div><span className="text-slate-500">Language:</span> <strong>{viewingRecord.language === 'hi' ? 'सरल हिन्दी' : 'English'}</strong></div>
              <div><span className="text-slate-500">Enumerator:</span> <strong>{viewingRecord.enumerator}</strong></div>
              <div><span className="text-slate-500">Status:</span> <strong>{viewingRecord.dataStatus}</strong></div>
              <div className="col-span-2"><span className="text-slate-500">Timestamp:</span> <strong>{viewingRecord.timestamp}</strong></div>
              <div className="col-span-2"><span className="text-slate-500">Total Score:</span> <strong className="text-indigo-700 text-sm">{viewingRecord.totalScore} / 9 ({viewingRecord.percentage}%)</strong></div>
            </div>

            {/* Detailed Question Answers (1 to 9) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                9-Question Breakdown
              </h4>

              {/* Section 1: Reading */}
              <div className="border border-indigo-100 rounded-xl p-3 bg-indigo-50/20 space-y-2">
                <div className="text-xs font-bold text-indigo-900 flex justify-between">
                  <span>Reading &amp; Understanding</span>
                  <span>Score: {viewingRecord.readingScore}/3</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-mono">Q1 ({viewingRecord.readingQ1Id})</div>
                    <div>Ans: <strong>{viewingRecord.readingQ1Answer || 'None'}</strong> {viewingRecord.readingQ1Correct ? '✅' : '❌'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-mono">Q2 ({viewingRecord.readingQ2Id})</div>
                    <div>Ans: <strong>{viewingRecord.readingQ2Answer || 'None'}</strong> {viewingRecord.readingQ2Correct ? '✅' : '❌'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-mono">Q3 ({viewingRecord.readingQ3Id})</div>
                    <div>Ans: <strong>{viewingRecord.readingQ3Answer || 'None'}</strong> {viewingRecord.readingQ3Correct ? '✅' : '❌'}</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Math */}
              <div className="border border-emerald-100 rounded-xl p-3 bg-emerald-50/20 space-y-2">
                <div className="text-xs font-bold text-emerald-900 flex justify-between">
                  <span>Mathematics</span>
                  <span>Score: {viewingRecord.mathScore}/3</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-mono">Q4 ({viewingRecord.mathQ1Id})</div>
                    <div>Ans: <strong>{viewingRecord.mathQ1Answer || 'None'}</strong> {viewingRecord.mathQ1Correct ? '✅' : '❌'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-mono">Q5 ({viewingRecord.mathQ2Id})</div>
                    <div>Ans: <strong>{viewingRecord.mathQ2Answer || 'None'}</strong> {viewingRecord.mathQ2Correct ? '✅' : '❌'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-mono">Q6 ({viewingRecord.mathQ3Id})</div>
                    <div>Ans: <strong>{viewingRecord.mathQ3Answer || 'None'}</strong> {viewingRecord.mathQ3Correct ? '✅' : '❌'}</div>
                  </div>
                </div>
              </div>

              {/* Section 3: Reasoning */}
              <div className="border border-amber-100 rounded-xl p-3 bg-amber-50/20 space-y-2">
                <div className="text-xs font-bold text-amber-900 flex justify-between">
                  <span>Reasoning &amp; Problem Solving</span>
                  <span>Score: {viewingRecord.reasoningScore}/3</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-mono">Q7 ({viewingRecord.reasoningQ1Id})</div>
                    <div>Ans: <strong>{viewingRecord.reasoningQ1Answer || 'None'}</strong> {viewingRecord.reasoningQ1Correct ? '✅' : '❌'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-mono">Q8 ({viewingRecord.reasoningQ2Id})</div>
                    <div>Ans: <strong>{viewingRecord.reasoningQ2Answer || 'None'}</strong> {viewingRecord.reasoningQ2Correct ? '✅' : '❌'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-mono">Q9 ({viewingRecord.reasoningQ3Id})</div>
                    <div>Ans: <strong>{viewingRecord.reasoningQ3Answer || 'None'}</strong> {viewingRecord.reasoningQ3Correct ? '✅' : '❌'}</div>
                  </div>
                </div>
              </div>
            </div>

            {viewingRecord.lastModified && (
              <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-md">
                Last modified on {viewingRecord.lastModified} {viewingRecord.editNotes ? `— Note: "${viewingRecord.editNotes}"` : ''}
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 text-right">
              <button
                onClick={() => setViewingRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT RECORD MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-600" />
              <span>Edit Record: {editingRecord.studentId}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Class</label>
                <input
                  type="text"
                  value={editingRecord.studentClass}
                  onChange={(e) => setEditingRecord({ ...editingRecord, studentClass: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Section</label>
                <input
                  type="text"
                  value={editingRecord.section}
                  onChange={(e) => setEditingRecord({ ...editingRecord, section: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Data Status</label>
                <select
                  value={editingRecord.dataStatus}
                  onChange={(e) => setEditingRecord({ ...editingRecord, dataStatus: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                >
                  <option value="Complete">Complete</option>
                  <option value="Incomplete">Incomplete</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Audit Reason / Edit Note (Required for data integrity)
                </label>
                <textarea
                  rows={2}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="e.g. Corrected section from A to B as verified with class register."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <Trash2 className="w-5 h-5" />
              <span>Delete Record?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Are you sure you want to permanently delete record <strong>{deleteConfirmId}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteRecord(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
