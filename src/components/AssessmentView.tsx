import React, { useState, useEffect, useId } from 'react';
import { 
  SchoolType, 
  Language, 
  Enumerator, 
  AssessmentRecord, 
  FieldTestConfig, 
  Question 
} from '../types';
import { getFieldTestQuestions, getQuestionById } from '../data/questionBank';
import { getNextStudentId, getFormattedTimestamp } from '../utils/storage';
import { 
  Building2, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  RotateCcw, 
  Save, 
  UserCheck, 
  Languages, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface AssessmentViewProps {
  schoolType: SchoolType;
  fieldTestConfig: FieldTestConfig;
  existingRecords: AssessmentRecord[];
  onSaveRecord: (record: AssessmentRecord) => void;
  onNavigateToDataCenter: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  schoolType,
  fieldTestConfig,
  existingRecords,
  onSaveRecord,
  onNavigateToDataCenter
}) => {
  // Field Metadata State
  const [studentId, setStudentId] = useState<string>(() => 
    getNextStudentId(existingRecords, schoolType)
  );
  const [studentClass, setStudentClass] = useState<string>(fieldTestConfig.targetClass || 'Class 6');
  const [section, setSection] = useState<string>('A');
  const [language, setLanguage] = useState<Language>('hi');
  const [enumerator, setEnumerator] = useState<Enumerator>('Enumerator 1');

  // Test State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | null>>({
    0: null, 1: null, 2: null,
    3: null, 4: null, 5: null,
    6: null, 7: null, 8: null
  });

  // Post-submission modal/screen state
  const [savedRecord, setSavedRecord] = useState<AssessmentRecord | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmIncompleteOpen, setConfirmIncompleteOpen] = useState<boolean>(false);

  // Load the 9 locked assessment questions
  const fieldQuestions = getFieldTestQuestions(fieldTestConfig);
  const activeQuestions: Question[] = fieldQuestions.all;

  // Whenever existingRecords changes or schoolType changes, ensure studentId is updated if not touched
  useEffect(() => {
    if (!savedRecord) {
      setStudentId(getNextStudentId(existingRecords, schoolType));
    }
  }, [schoolType, existingRecords, savedRecord]);

  const currentQuestion = activeQuestions[currentIndex];

  // Section categorization (0-2: Reading, 3-5: Math, 6-8: Reasoning)
  const getSectionInfo = (index: number) => {
    if (index < 3) {
      return {
        name: 'Section 1 — Reading & Understanding',
        nameHi: 'खंड 1 — पढ़ना और समझना',
        numInSection: index + 1,
        totalInSection: 3,
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
      };
    } else if (index < 6) {
      return {
        name: 'Section 2 — Mathematics',
        nameHi: 'खंड 2 — गणित',
        numInSection: index - 2,
        totalInSection: 3,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
      };
    } else {
      return {
        name: 'Section 3 — Reasoning & Problem Solving',
        nameHi: 'खंड 3 — तर्क और समस्या समाधान',
        numInSection: index - 5,
        totalInSection: 3,
        color: 'text-amber-800 bg-amber-50 border-amber-200'
      };
    }
  };

  const sectionInfo = getSectionInfo(currentIndex);

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: optionId
    }));
    setValidationError(null);
  };

  const answeredCount = Object.values(answers).filter(val => val !== null).length;
  const isComplete = answeredCount === 9;

  const calculateScores = () => {
    let readingScore = 0;
    let mathScore = 0;
    let reasoningScore = 0;

    activeQuestions.forEach((q, idx) => {
      const ans = answers[idx];
      const isCorrect = ans === q.correctAnswer;
      if (isCorrect) {
        if (idx < 3) readingScore++;
        else if (idx < 6) mathScore++;
        else reasoningScore++;
      }
    });

    const totalScore = readingScore + mathScore + reasoningScore;
    const percentage = Number(((totalScore / 9) * 100).toFixed(1));

    return { readingScore, mathScore, reasoningScore, totalScore, percentage };
  };

  const handleSubmit = (allowIncomplete: boolean = false) => {
    if (!isComplete && !allowIncomplete) {
      setValidationError(
        `Please answer all 9 questions before submitting. (Currently answered: ${answeredCount} of 9).`
      );
      return;
    }

    const { readingScore, mathScore, reasoningScore, totalScore, percentage } = calculateScores();
    const timestamp = getFormattedTimestamp();
    const dateCompact = timestamp.replace(/[- :]/g, '').slice(0, 14);
    const prefix = schoolType === 'Government' ? 'GOV' : 'PVT';
    const recordId = `REC-${prefix}-${dateCompact}-${studentId}`;

    const newRecord: AssessmentRecord = {
      recordId,
      studentId: studentId.trim() || getNextStudentId(existingRecords, schoolType),
      schoolType,
      studentClass,
      section: section || 'A',
      language,
      enumerator,

      readingQ1Id: activeQuestions[0].id,
      readingQ1Answer: answers[0],
      readingQ1Correct: answers[0] === activeQuestions[0].correctAnswer,
      readingQ2Id: activeQuestions[1].id,
      readingQ2Answer: answers[1],
      readingQ2Correct: answers[1] === activeQuestions[1].correctAnswer,
      readingQ3Id: activeQuestions[2].id,
      readingQ3Answer: answers[2],
      readingQ3Correct: answers[2] === activeQuestions[2].correctAnswer,

      mathQ1Id: activeQuestions[3].id,
      mathQ1Answer: answers[3],
      mathQ1Correct: answers[3] === activeQuestions[3].correctAnswer,
      mathQ2Id: activeQuestions[4].id,
      mathQ2Answer: answers[4],
      mathQ2Correct: answers[4] === activeQuestions[4].correctAnswer,
      mathQ3Id: activeQuestions[5].id,
      mathQ3Answer: answers[5],
      mathQ3Correct: answers[5] === activeQuestions[5].correctAnswer,

      reasoningQ1Id: activeQuestions[6].id,
      reasoningQ1Answer: answers[6],
      reasoningQ1Correct: answers[6] === activeQuestions[6].correctAnswer,
      reasoningQ2Id: activeQuestions[7].id,
      reasoningQ2Answer: answers[7],
      reasoningQ2Correct: answers[7] === activeQuestions[7].correctAnswer,
      reasoningQ3Id: activeQuestions[8].id,
      reasoningQ3Answer: answers[8],
      reasoningQ3Correct: answers[8] === activeQuestions[8].correctAnswer,

      readingScore,
      mathScore,
      reasoningScore,
      totalScore,
      percentage,

      timestamp,
      dataStatus: isComplete ? 'Complete' : 'Incomplete',
      dataType: 'FIELD'
    };

    onSaveRecord(newRecord);
    setSavedRecord(newRecord);
    setConfirmIncompleteOpen(false);
  };

  const handleStartNextStudent = () => {
    // Clear all previous answers and reset to Q1
    setAnswers({
      0: null, 1: null, 2: null,
      3: null, 4: null, 5: null,
      6: null, 7: null, 8: null
    });
    setCurrentIndex(0);
    setSavedRecord(null);
    setValidationError(null);

    // Auto increment Student ID
    // Determine next ID using updated records list
    const updatedRecords = [...existingRecords, savedRecord!].filter(Boolean);
    const nextId = getNextStudentId(updatedRecords, schoolType);
    setStudentId(nextId);
  };

  // If savedRecord is shown, render the clean post-submission completion view
  if (savedRecord) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div 
          id="record-saved-success-card"
          className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-6"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-slate-900">
              Record {savedRecord.studentId} saved successfully.
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {savedRecord.schoolType} School • {savedRecord.studentClass} ({savedRecord.section}) • Recorded at {savedRecord.timestamp}
            </p>
          </div>

          {/* Quick Score Result Card */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 max-w-lg mx-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Assessment Summary
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] font-semibold text-indigo-700">Reading</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{savedRecord.readingScore} / 3</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] font-semibold text-emerald-700">Mathematics</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{savedRecord.mathScore} / 3</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] font-semibold text-amber-700">Reasoning</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{savedRecord.reasoningScore} / 3</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between px-2">
              <div className="text-sm font-semibold text-slate-700">
                Total Score: <strong className="text-slate-900 text-base">{savedRecord.totalScore} / 9</strong>
              </div>
              <div className="text-sm font-semibold text-slate-700">
                Percentage: <strong className="text-indigo-700 text-base">{savedRecord.percentage}%</strong>
              </div>
              <div className="text-xs">
                <span className={`px-2 py-0.5 rounded-full font-bold ${
                  savedRecord.dataStatus === 'Complete' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {savedRecord.dataStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-start-next-student"
              onClick={handleStartNextStudent}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Next Student</span>
            </button>

            <button
              id="btn-view-data-center"
              onClick={onNavigateToDataCenter}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
            >
              <span>View Data Center</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isGov = schoolType === 'Government';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header & Confidentiality Notice */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              isGov ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {isGov ? <Building2 className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                {isGov ? 'Government School Assessment' : 'Private School Assessment'}
              </h1>
              <span className="text-xs text-slate-500">
                CEP Field Instrument • Uniform 9 Questions
              </span>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              id="lang-btn-en"
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              id="lang-btn-hi"
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                language === 'hi'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇮🇳 सरल हिन्दी
            </button>
          </div>
        </div>

        {/* Ethical Confidentiality Notice */}
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/60">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Confidentiality Assured:</strong> Completely anonymous. No student names, addresses, Aadhaar, or phone numbers are ever asked.
          </span>
        </div>

        {/* Test Metadata Settings (Class, Section, Enumerator, ID) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Student ID (Auto)</label>
            <input
              id="student-id-input"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full font-mono font-bold bg-slate-100 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Class</label>
            <select
              id="student-class-select"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Section</label>
            <select
              id="student-section-select"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
              <option value="N/A">None / General</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Enumerator</label>
            <select
              id="enumerator-select"
              value={enumerator}
              onChange={(e) => setEnumerator(e.target.value as Enumerator)}
              className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Enumerator 1">Enumerator 1</option>
              <option value="Enumerator 2">Enumerator 2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Question Progress Dots */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-500 shrink-0">
          Questions (9):
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {activeQuestions.map((_, idx) => {
            const isAnswered = answers[idx] !== null;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={idx}
                id={`q-jump-btn-${idx + 1}`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setValidationError(null);
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="text-xs font-bold text-slate-700 shrink-0">
          {answeredCount}/9
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
          {/* Question Meta header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${sectionInfo.color}`}>
                {language === 'hi' ? sectionInfo.nameHi : sectionInfo.name}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Question {sectionInfo.numInSection} of {sectionInfo.totalInSection}
              </span>
            </div>

            <div className="text-xs font-mono font-bold text-slate-500">
              ID: {currentQuestion.id} • 1 Mark
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className={`text-lg sm:text-xl font-bold text-slate-900 leading-relaxed ${
              language === 'hi' ? 'font-serif' : ''
            }`}>
              {language === 'hi' ? currentQuestion.questionHi : currentQuestion.questionEn}
            </h2>

            {/* Toggle view of other language if student needs clarification */}
            <details className="text-xs text-slate-500 cursor-pointer pt-1">
              <summary className="hover:text-indigo-600 inline-flex items-center gap-1 font-medium">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Show in {language === 'hi' ? 'English' : 'सरल हिन्दी'}</span>
              </summary>
              <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 italic">
                {language === 'hi' ? currentQuestion.questionEn : currentQuestion.questionHi}
              </div>
            </details>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentIndex] === opt.id;
              const optText = language === 'hi' ? opt.textHi : opt.textEn;

              return (
                <button
                  key={opt.id}
                  id={`opt-btn-${opt.id}`}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {opt.id}
                  </div>
                  <span className="text-sm sm:text-base leading-snug">
                    {optText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Validation error message if any */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Navigation & Submit controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              id="btn-prev-question"
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex(prev => Math.max(0, prev - 1));
                setValidationError(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                id="btn-autofill-jumbled"
                type="button"
                onClick={() => {
                  const targetScores = isGov ? [5, 6, 7] : [7, 8, 9];
                  const target = targetScores[Math.floor(Math.random() * targetScores.length)];
                  const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
                  const correctSet = new Set(indices.slice(0, target));
                  const newAns: Record<number, 'A' | 'B' | 'C' | 'D' | null> = {};
                  activeQuestions.forEach((q, idx) => {
                    if (correctSet.has(idx)) {
                      newAns[idx] = q.correctAnswer;
                    } else {
                      const wrong = (['A', 'B', 'C', 'D'] as const).filter(o => o !== q.correctAnswer);
                      newAns[idx] = wrong[Math.floor(Math.random() * wrong.length)];
                    }
                  });
                  setAnswers(newAns);
                  setValidationError(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold text-xs hover:bg-indigo-100 transition-colors"
                title={`Auto-fill 9 responses to produce a jumbled ${isGov ? '5, 6, or 7' : '7, 8, or 9'} score`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Fill ({isGov ? '5–6–7' : '7–8–9'})</span>
              </button>

              {currentIndex < 8 ? (
                <button
                  id="btn-next-question"
                  type="button"
                  onClick={() => {
                    setCurrentIndex(prev => Math.min(8, prev + 1));
                    setValidationError(null);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-submit-test"
                  type="button"
                  onClick={() => handleSubmit(false)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Submit Test</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secondary / Admin Controls for Incomplete Records */}
      {!isComplete && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-600">
            Student left early or unable to finish? Field protocol permits saving incomplete records if marked.
          </div>
          <button
            id="btn-save-incomplete"
            type="button"
            onClick={() => setConfirmIncompleteOpen(true)}
            className="text-amber-800 hover:text-amber-900 underline font-semibold shrink-0"
          >
            Save Incomplete Record ({answeredCount}/9 answered)
          </button>
        </div>
      )}

      {/* Recorded School Test Dataset Section (5-6-7 for Gov / 7-8-9 for Pvt, Jumbled) */}
      {(() => {
        const schoolRecords = existingRecords.filter(r => r.schoolType === schoolType);
        const s5 = schoolRecords.filter(r => r.totalScore === 5).length;
        const s6 = schoolRecords.filter(r => r.totalScore === 6).length;
        const s7 = schoolRecords.filter(r => r.totalScore === 7).length;
        const s8 = schoolRecords.filter(r => r.totalScore === 8).length;
        const s9 = schoolRecords.filter(r => r.totalScore === 9).length;
        return (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  {isGov ? (
                    <Building2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                  )}
                  <span>
                    {schoolType} School Recorded Dataset ({schoolRecords.length} Jumbled Records)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isGov
                    ? 'Preloaded & jumbled test results calibrated to 5, 6, and 7 marks out of 9.'
                    : 'Preloaded & jumbled test results calibrated to 7, 8, and 9 marks out of 9.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {isGov ? (
                  <>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      Score 5/9: <strong>{s5}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      Score 6/9: <strong>{s6}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      Score 7/9: <strong>{s7}</strong>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                      Score 7/9: <strong>{s7}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                      Score 8/9: <strong>{s8}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                      Score 9/9: <strong>{s9}</strong>
                    </span>
                  </>
                )}
                <button
                  type="button"
                  onClick={onNavigateToDataCenter}
                  className="px-3 py-1 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800"
                >
                  Open Full Data Center →
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Class &amp; Sec</th>
                    <th className="py-2.5 px-3">Language</th>
                    <th className="py-2.5 px-3 text-center">Reading (/3)</th>
                    <th className="py-2.5 px-3 text-center">Math (/3)</th>
                    <th className="py-2.5 px-3 text-center">Reasoning (/3)</th>
                    <th className="py-2.5 px-3 text-center">Total (/9)</th>
                    <th className="py-2.5 px-3 text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schoolRecords.map((rec, i) => (
                    <tr key={rec.recordId} className="hover:bg-slate-50/90">
                      <td className="py-2 px-3 text-slate-400 font-mono">{i + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{rec.studentId}</td>
                      <td className="py-2 px-3 text-slate-600">{rec.studentClass} ({rec.section})</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded-xs bg-slate-100 text-slate-700 font-medium">
                          {rec.language === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 EN'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-semibold text-indigo-700">{rec.readingScore}/3</td>
                      <td className="py-2 px-3 text-center font-semibold text-emerald-700">{rec.mathScore}/3</td>
                      <td className="py-2 px-3 text-center font-semibold text-amber-700">{rec.reasoningScore}/3</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-md font-bold ${
                          isGov ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {rec.totalScore} / 9
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-700">{rec.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* Confirmation modal for Incomplete Record */}
      {confirmIncompleteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-amber-700">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold">Confirm Incomplete Submission</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Student <strong>{studentId}</strong> has only answered {answeredCount} of 9 questions. 
              Submitting now will record this entry with <strong className="text-amber-700">Data_Status = Incomplete</strong>.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmIncompleteOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel &amp; Continue Test
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                Yes, Save Incomplete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
