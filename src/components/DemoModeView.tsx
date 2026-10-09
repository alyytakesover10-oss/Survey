import React, { useState } from 'react';
import { AssessmentRecord, FieldTestConfig, ActivePage } from '../types';
import { generateSyntheticRecords } from '../utils/syntheticGenerator';
import { 
  FlaskConical, 
  AlertTriangle, 
  Sparkles, 
  Trash2, 
  BarChart3, 
  Database, 
  CheckCircle2, 
  Info,
  Layers
} from 'lucide-react';

interface DemoModeViewProps {
  fieldTestConfig: FieldTestConfig;
  records: AssessmentRecord[];
  onAddSyntheticRecords: (newRecords: AssessmentRecord[]) => void;
  onClearSynthetic: () => void;
  setActivePage: (page: ActivePage) => void;
}

export const DemoModeView: React.FC<DemoModeViewProps> = ({
  fieldTestConfig,
  records,
  onAddSyntheticRecords,
  onClearSynthetic,
  setActivePage
}) => {
  const [justGenerated, setJustGenerated] = useState<number | null>(null);

  const syntheticRecords = records.filter(r => r.dataType === 'SYNTHETIC');
  const fieldRecords = records.filter(r => r.dataType === 'FIELD');

  const handleGenerate = (count: number) => {
    const generated = generateSyntheticRecords(
      count, 
      fieldTestConfig, 
      syntheticRecords.length
    );
    onAddSyntheticRecords(generated);
    setJustGenerated(count);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Simulation Banner */}
      <div className="bg-purple-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-800 text-purple-200 border border-purple-700">
          <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
          <span>DEMO / SIMULATION MODE</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Synthetic Data Generation &amp; Presentation Mode
        </h1>

        <p className="text-purple-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
          This testing module generates synthetic student responses for demonstrating the comparison dashboard 
          and data center to faculty and examiners. All generated records are strictly flagged with 
          <code className="mx-1 px-1.5 py-0.5 rounded-sm bg-purple-950 font-mono text-amber-300">Data_Type = SYNTHETIC</code> 
          and isolated from authentic school field data.
        </p>

        {/* Ethical Safeguard Notice */}
        <div className="bg-purple-950/80 border border-purple-800 rounded-xl p-4 flex items-start gap-3 text-xs text-purple-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300">Academic Integrity Constraint:</span>
            <p className="leading-relaxed">
              Synthetic records must NOT be presented as actual students in final thesis submissions. 
              They simulate realistic variance and response distributions across the 9 locked assessment questions 
              to verify software behavior and preview analytical charts.
            </p>
          </div>
        </div>
      </div>

      {/* Current Dataset Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-purple-700 block">Synthetic Demo Records</span>
          <div className="text-3xl font-bold text-purple-950 mt-1">
            {syntheticRecords.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Tagged: Data_Type = SYNTHETIC
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 block">Authentic Field Records</span>
          <div className="text-3xl font-bold text-emerald-950 mt-1">
            {fieldRecords.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Collected via School Assessment Modules
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-600 block">Total Combined In Memory</span>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {records.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Filtered separately in Dashboard &amp; Data Center
          </span>
        </div>
      </div>

      {/* Generation Action Buttons */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Generate Calibrated Synthetic Records</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Select a batch size to create balanced Government (G-SYN...) and Private (P-SYN...) student records.
          </p>
        </div>

        {justGenerated !== null && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Successfully generated <strong>{justGenerated}</strong> synthetic assessment records.
              </span>
            </div>
            <button 
              onClick={() => setActivePage('comparison_dashboard')}
              className="font-bold underline text-indigo-700 hover:text-indigo-900"
            >
              View Dashboard →
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            id="btn-gen-10"
            onClick={() => handleGenerate(10)}
            className="p-4 rounded-xl border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50/40 text-center transition-all group"
          >
            <span className="text-2xl font-bold text-slate-900 group-hover:text-purple-700 block">
              +10
            </span>
            <span className="text-xs font-semibold text-slate-600 mt-1 block">
              Generate 10
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">5 Gov / 5 Pvt</span>
          </button>

          <button
            id="btn-gen-50"
            onClick={() => handleGenerate(50)}
            className="p-4 rounded-xl border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50/40 text-center transition-all group"
          >
            <span className="text-2xl font-bold text-slate-900 group-hover:text-purple-700 block">
              +50
            </span>
            <span className="text-xs font-semibold text-slate-600 mt-1 block">
              Generate 50
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">25 Gov / 25 Pvt</span>
          </button>

          <button
            id="btn-gen-100"
            onClick={() => handleGenerate(100)}
            className="p-4 rounded-xl border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50/40 text-center transition-all group"
          >
            <span className="text-2xl font-bold text-slate-900 group-hover:text-purple-700 block">
              +100
            </span>
            <span className="text-xs font-semibold text-slate-600 mt-1 block">
              Generate 100
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">50 Gov / 50 Pvt</span>
          </button>

          <button
            id="btn-gen-150"
            onClick={() => handleGenerate(150)}
            className="p-4 rounded-xl border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50/40 text-center transition-all group"
          >
            <span className="text-2xl font-bold text-slate-900 group-hover:text-purple-700 block">
              +150
            </span>
            <span className="text-xs font-semibold text-slate-600 mt-1 block">
              Generate 150
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">75 Gov / 75 Pvt</span>
          </button>
        </div>

        {/* Action buttons & Clear Synthetic */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-nav-dash-from-demo"
              onClick={() => setActivePage('comparison_dashboard')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Explore in Dashboard</span>
            </button>

            <button
              id="btn-nav-dc-from-demo"
              onClick={() => setActivePage('data_center')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              <Database className="w-4 h-4" />
              <span>Inspect in Data Center</span>
            </button>
          </div>

          {syntheticRecords.length > 0 && (
            <button
              id="btn-clear-synthetic"
              onClick={() => {
                if (window.confirm(`Permanently remove all ${syntheticRecords.length} synthetic demo records? Your authentic field records will remain untouched.`)) {
                  onClearSynthetic();
                  setJustGenerated(null);
                }
              }}
              className="text-rose-600 hover:text-rose-800 font-semibold text-xs flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All {syntheticRecords.length} Synthetic Records</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
