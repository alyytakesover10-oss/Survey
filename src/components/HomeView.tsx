import React from 'react';
import { ActivePage, FieldTestConfig, AssessmentRecord } from '../types';
import { getNextStudentId } from '../utils/storage';
import { 
  Building2, 
  GraduationCap, 
  Database, 
  BarChart3, 
  BookOpen, 
  FlaskConical, 
  CheckCircle2, 
  ShieldCheck, 
  Languages, 
  Smartphone, 
  Lock, 
  Unlock, 
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';

interface HomeViewProps {
  setActivePage: (page: ActivePage) => void;
  fieldTestConfig: FieldTestConfig;
  records: AssessmentRecord[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActivePage,
  fieldTestConfig,
  records
}) => {
  const fieldRecords = records.filter(r => r.dataType === 'FIELD');
  const syntheticRecords = records.filter(r => r.dataType === 'SYNTHETIC');
  const govCount = fieldRecords.filter(r => r.schoolType === 'Government').length;
  const pvtCount = fieldRecords.filter(r => r.schoolType === 'Private').length;

  const nextGovId = getNextStudentId(records, 'Government');
  const nextPvtId = getNextStudentId(records, 'Private');

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <span>🎓 Undergraduate Community Engagement Project (CEP)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            Learning Outcomes Data Collection &amp; Comparison System
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            A standardized, anonymous digital assessment instrument designed for undergraduate field research 
            to measure and compare learning outcomes between students of one Government School and one Private School 
            across Reading, Mathematics, and Reasoning.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Anonymous (No PII)
            </span>
            <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
              <Languages className="w-3.5 h-3.5 text-blue-600" />
              Bilingual (English &amp; सरल हिन्दी)
            </span>
            <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              Multi-Device Field Ready
            </span>
          </div>
        </div>
      </div>

      {/* Primary Field Collection Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Field Test Assessment Modules
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Standardized 9-question battery per student
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Government School Card */}
          <div 
            id="start-gov-test-card"
            className="bg-white rounded-2xl p-6 border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 block">Next Anonymous ID</span>
                  <span className="text-base font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 inline-block">
                    {nextGovId}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Government School Assessment
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Administer the 9 locked assessment questions to government school students with immediate English/सरल हिन्दी switching.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-1 border-t border-slate-100">
                <span>Field Records: <strong className="text-slate-800">{govCount}</strong></span>
                <span>•</span>
                <span>Prefix: <strong className="text-slate-800">G001–G999</strong></span>
              </div>
            </div>

            <button
              id="btn-launch-gov-test"
              onClick={() => setActivePage('gov_test')}
              className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-xs"
            >
              <span>Start Government Test ({nextGovId})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Private School Card */}
          <div 
            id="start-pvt-test-card"
            className="bg-white rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 block">Next Anonymous ID</span>
                  <span className="text-base font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 inline-block">
                    {nextPvtId}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Private School Assessment
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Administer the identical 9-question battery to private school students under strictly equivalent testing conditions.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-1 border-t border-slate-100">
                <span>Field Records: <strong className="text-slate-800">{pvtCount}</strong></span>
                <span>•</span>
                <span>Prefix: <strong className="text-slate-800">P001–P999</strong></span>
              </div>
            </div>

            <button
              id="btn-launch-pvt-test"
              onClick={() => setActivePage('pvt_test')}
              className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-xs"
            >
              <span>Start Private School Test ({nextPvtId})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Field Study Status & Operational Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Field Test Lock Status */}
        <div 
          onClick={() => setActivePage('question_bank')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Field Test Lock</span>
            {fieldTestConfig.isLocked ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <Lock className="w-3 h-3" /> Locked
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Unlock className="w-3 h-3" /> Draft
              </span>
            )}
          </div>
          <div className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            9 Questions Locked
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Target: {fieldTestConfig.targetClass} • 3 Reading, 3 Math, 3 Reasoning
          </div>
        </div>

        {/* Data Center Card */}
        <div 
          onClick={() => setActivePage('data_center')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Data Center</span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {records.length} Total Records
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {fieldRecords.length} Field ({govCount} Gov / {pvtCount} Pvt) • CSV Export
          </div>
        </div>

        {/* Comparison Dashboard */}
        <div 
          onClick={() => setActivePage('comparison_dashboard')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Comparison</span>
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Outcomes Analysis
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Neutral descriptive statistics &amp; comparative charts
          </div>
        </div>

        {/* Demo / Simulation Mode */}
        <div 
          onClick={() => setActivePage('demo_mode')}
          className="bg-white p-5 rounded-xl border border-purple-200/80 bg-purple-50/20 hover:border-purple-300 transition-colors shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-700">Demonstration</span>
            <FlaskConical className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
            Simulation Mode
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Generate synthetic datasets for examiner review ({syntheticRecords.length} active)
          </div>
        </div>
      </div>

      {/* Fieldwork Protocol & Methodology Highlights */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Standardized Field Research Protocol
          </h3>
          <button 
            onClick={() => setActivePage('methodology')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Full Methodology</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              1. Identical Instrument
            </div>
            <p className="leading-relaxed">
              Every student from both schools receives the exact same locked 9 questions to guarantee empirical measurement equivalence.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              2. Dual Enumerators
            </div>
            <p className="leading-relaxed">
              Supports two researchers administering simultaneously on two phones (Enumerator 1 &amp; 2) with offline support and merge utility.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              3. Objective Scoring
            </div>
            <p className="leading-relaxed">
              Immediate scoring out of 9, section breakdowns (Reading, Math, Reasoning), and automatic timestamped audit trails.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
