/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, AssessmentRecord, FieldTestConfig } from './types';
import { 
  loadStoredRecords, 
  saveStoredRecords, 
  loadStoredConfig, 
  saveStoredConfig, 
  clearStoredSyntheticRecords 
} from './utils/storage';
import { generatePreloadedJumbledDataset, DatasetPresetMode } from './utils/datasetSeeder';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AssessmentView } from './components/AssessmentView';
import { DataCenterView } from './components/DataCenterView';
import { DashboardView } from './components/DashboardView';
import { QuestionBankView } from './components/QuestionBankView';
import { DemoModeView } from './components/DemoModeView';
import { MethodologyView } from './components/MethodologyView';
import { StreamlitView } from './components/StreamlitView';
import { ShieldCheck, HardDrive, Code2 } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('comparison_dashboard');
  const [records, setRecords] = useState<AssessmentRecord[]>(() => loadStoredRecords());
  const [fieldTestConfig, setFieldTestConfig] = useState<FieldTestConfig>(() => loadStoredConfig());
  const [jumbleSeed, setJumbleSeed] = useState<number>(20261009);

  // Scroll to top when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Handler for re-jumbling / reseeding the Government (5-6-7) & Private (7-8-9) dataset
  const handleReseedDataset = (mode: DatasetPresetMode) => {
    const nextSeed = jumbleSeed + 13;
    setJumbleSeed(nextSeed);
    const reseeded = generatePreloadedJumbledDataset(fieldTestConfig, mode, nextSeed);
    setRecords(reseeded);
    saveStoredRecords(reseeded);
  };

  // Handler for adding an individual assessment record
  const handleSaveRecord = (newRecord: AssessmentRecord) => {
    const updated = [...records, newRecord];
    setRecords(updated);
    saveStoredRecords(updated);
  };

  // Handler for updating an existing record (e.g. metadata edit in Data Center)
  const handleUpdateRecord = (updatedRecord: AssessmentRecord) => {
    const updated = records.map(r => r.recordId === updatedRecord.recordId ? updatedRecord : r);
    setRecords(updated);
    saveStoredRecords(updated);
  };

  // Handler for deleting a record
  const handleDeleteRecord = (recordId: string) => {
    const updated = records.filter(r => r.recordId !== recordId);
    setRecords(updated);
    saveStoredRecords(updated);
  };

  // Handler for multi-device data merge
  const handleMergeImport = (mergedRecords: AssessmentRecord[]) => {
    setRecords(mergedRecords);
    saveStoredRecords(mergedRecords);
  };

  // Handler for adding synthetic batch
  const handleAddSyntheticRecords = (newSynthetic: AssessmentRecord[]) => {
    const updated = [...records, ...newSynthetic];
    setRecords(updated);
    saveStoredRecords(updated);
  };

  // Handler for clearing synthetic records only
  const handleClearSynthetic = () => {
    const fieldOnly = records.filter(r => r.dataType === 'FIELD');
    setRecords(fieldOnly);
    clearStoredSyntheticRecords();
  };

  // Handler for updating field test config (locking, swapping questions)
  const handleUpdateConfig = (newConfig: FieldTestConfig) => {
    setFieldTestConfig(newConfig);
    saveStoredConfig(newConfig);
  };

  const syntheticCount = records.filter(r => r.dataType === 'SYNTHETIC').length;

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Responsive Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        fieldTestConfig={fieldTestConfig}
        recordsCount={records.length}
        syntheticCount={syntheticCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activePage === 'home' && (
          <HomeView
            setActivePage={setActivePage}
            fieldTestConfig={fieldTestConfig}
            records={records}
          />
        )}

        {activePage === 'gov_test' && (
          <AssessmentView
            key="gov-test-view"
            schoolType="Government"
            fieldTestConfig={fieldTestConfig}
            existingRecords={records}
            onSaveRecord={handleSaveRecord}
            onNavigateToDataCenter={() => setActivePage('data_center')}
          />
        )}

        {activePage === 'pvt_test' && (
          <AssessmentView
            key="pvt-test-view"
            schoolType="Private"
            fieldTestConfig={fieldTestConfig}
            existingRecords={records}
            onSaveRecord={handleSaveRecord}
            onNavigateToDataCenter={() => setActivePage('data_center')}
          />
        )}

        {activePage === 'data_center' && (
          <DataCenterView
            records={records}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onMergeImport={handleMergeImport}
            onClearSynthetic={handleClearSynthetic}
            onReseedDataset={handleReseedDataset}
          />
        )}

        {activePage === 'comparison_dashboard' && (
          <DashboardView
            records={records}
            onNavigateToDemo={() => setActivePage('demo_mode')}
            onReseedDataset={handleReseedDataset}
            onNavigateToStreamlit={() => setActivePage('streamlit_python')}
          />
        )}

        {activePage === 'streamlit_python' && (
          <StreamlitView
            records={records}
            onReseedDataset={handleReseedDataset}
            onNavigateToDashboard={() => setActivePage('comparison_dashboard')}
          />
        )}

        {activePage === 'question_bank' && (
          <QuestionBankView
            fieldTestConfig={fieldTestConfig}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {activePage === 'demo_mode' && (
          <DemoModeView
            fieldTestConfig={fieldTestConfig}
            records={records}
            onAddSyntheticRecords={handleAddSyntheticRecords}
            onClearSynthetic={handleClearSynthetic}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'methodology' && (
          <MethodologyView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              CEP Learning Outcomes Data Collection &amp; Comparison System
            </span>
            <span>•</span>
            <span>Government (5–6–7) &amp; Private (7–8–9) Jumbled Dataset</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActivePage('streamlit_python')}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              Streamlit Python (app.py)
            </button>
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Anonymous (Zero PII)
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
              Offline Local Persistence Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
