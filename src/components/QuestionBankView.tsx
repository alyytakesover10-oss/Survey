import React, { useState, useMemo } from 'react';
import { FieldTestConfig, Question, QuestionCategory } from '../types';
import { 
  ALL_QUESTIONS, 
  getFieldTestQuestions, 
  DEFAULT_FIELD_TEST_CONFIG 
} from '../data/questionBank';
import { 
  BookOpen, 
  Lock, 
  Unlock, 
  Search, 
  Filter, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface QuestionBankViewProps {
  fieldTestConfig: FieldTestConfig;
  onUpdateConfig: (config: FieldTestConfig) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  fieldTestConfig,
  onUpdateConfig
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | QuestionCategory>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLockedOnly, setShowLockedOnly] = useState(false);
  const [selectedSlotToReplace, setSelectedSlotToReplace] = useState<string | null>(null);

  // Active 9 field test questions
  const activeFieldQuestions = useMemo(() => 
    getFieldTestQuestions(fieldTestConfig), 
    [fieldTestConfig]
  );

  const lockedIds = useMemo(() => new Set([
    ...fieldTestConfig.readingQuestionIds,
    ...fieldTestConfig.mathQuestionIds,
    ...fieldTestConfig.reasoningQuestionIds
  ]), [fieldTestConfig]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter(q => {
      if (showLockedOnly && !lockedIds.has(q.id)) return false;
      if (activeCategory !== 'All' && q.category !== activeCategory) return false;
      if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) return false;
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchesId = q.id.toLowerCase().includes(term);
        const matchesEn = q.questionEn.toLowerCase().includes(term);
        const matchesHi = q.questionHi.toLowerCase().includes(term);
        const matchesOpt = q.options.some(o => 
          o.textEn.toLowerCase().includes(term) || o.textHi.toLowerCase().includes(term)
        );
        if (!matchesId && !matchesEn && !matchesHi && !matchesOpt) return false;
      }
      return true;
    });
  }, [activeCategory, difficultyFilter, searchTerm, showLockedOnly, lockedIds]);

  const handleToggleLock = () => {
    if (fieldTestConfig.isLocked) {
      if (window.confirm('Are you sure you want to unlock the field test? Editing questions during active field collection will compromise measurement validity.')) {
        onUpdateConfig({
          ...fieldTestConfig,
          isLocked: false
        });
      }
    } else {
      onUpdateConfig({
        ...fieldTestConfig,
        isLocked: true
      });
    }
  };

  const handleAssignToSlot = (question: Question) => {
    if (fieldTestConfig.isLocked) return;

    if (question.category === 'Reading') {
      const idx = selectedSlotToReplace ? parseInt(selectedSlotToReplace) : 0;
      const newIds = [...fieldTestConfig.readingQuestionIds] as [string, string, string];
      newIds[idx] = question.id;
      onUpdateConfig({ ...fieldTestConfig, readingQuestionIds: newIds });
    } else if (question.category === 'Mathematics') {
      const idx = selectedSlotToReplace ? parseInt(selectedSlotToReplace) : 0;
      const newIds = [...fieldTestConfig.mathQuestionIds] as [string, string, string];
      newIds[idx] = question.id;
      onUpdateConfig({ ...fieldTestConfig, mathQuestionIds: newIds });
    } else {
      const idx = selectedSlotToReplace ? parseInt(selectedSlotToReplace) : 0;
      const newIds = [...fieldTestConfig.reasoningQuestionIds] as [string, string, string];
      newIds[idx] = question.id;
      onUpdateConfig({ ...fieldTestConfig, reasoningQuestionIds: newIds });
    }

    setSelectedSlotToReplace(null);
  };

  const handleResetToDefaults = () => {
    if (fieldTestConfig.isLocked) return;
    if (window.confirm('Reset the 9 field questions back to standard validated defaults?')) {
      onUpdateConfig({
        ...DEFAULT_FIELD_TEST_CONFIG,
        isLocked: false
      });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Lock Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <span>Standardized Question Bank &amp; Field Test Settings</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Total 450 calibrated bilingual questions (150 Reading, 150 Math, 150 Reasoning).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!fieldTestConfig.isLocked && (
              <button
                id="btn-reset-default-q"
                onClick={handleResetToDefaults}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            )}

            <button
              id="btn-toggle-lock"
              onClick={handleToggleLock}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs ${
                fieldTestConfig.isLocked
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {fieldTestConfig.isLocked ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>FIELD TEST LOCKED (Strict Mode)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>LOCK FIELD TEST NOW</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Lock warning notice */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
          fieldTestConfig.isLocked 
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}>
          {fieldTestConfig.isLocked ? (
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-bold">
              {fieldTestConfig.isLocked 
                ? 'Field Test is Locked for Empirical Integrity' 
                : 'Field Test is Currently in Draft / Configurable State'}
            </div>
            <p className="leading-relaxed">
              {fieldTestConfig.isLocked 
                ? 'The 9 assessment questions below are locked. Any student assessed in Government or Private schools will receive these identical 9 items to guarantee statistical validity.'
                : 'You can swap any of the 9 active test questions using the question bank below. Once satisfied, click "LOCK FIELD TEST NOW" before sending researchers into schools.'}
            </p>
          </div>
        </div>
      </div>

      {/* The 9 Active Field Test Questions Overview */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Active 9 Field Assessment Questions</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Target: {fieldTestConfig.targetClass}
              </span>
            </h2>
            <span className="text-xs text-slate-500">
              Administered uniformly across both Government &amp; Private schools.
            </span>
          </div>

          <div className="text-xs font-medium text-slate-500">
            Click question ID to view full text in bank below
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Section 1: Reading (3) */}
          <div className="bg-white rounded-xl p-4 border border-indigo-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
              <span className="text-xs font-bold text-indigo-800">
                Section 1: Reading (3)
              </span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">1 Mark Each</span>
            </div>
            <div className="space-y-2">
              {activeFieldQuestions.reading.map((q, idx) => (
                <div key={q.id} className="p-2.5 rounded-lg bg-indigo-50/40 border border-indigo-100/70 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold text-indigo-900 mb-1">
                    <span>Q{idx + 1}: {q.id}</span>
                    <span className="text-[10px] text-slate-500 font-sans font-medium">{q.difficulty}</span>
                  </div>
                  <div className="line-clamp-2 text-slate-700 font-medium">{q.questionEn}</div>
                  <div className="line-clamp-1 text-slate-500 text-[11px] mt-0.5">{q.questionHi}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Math (3) */}
          <div className="bg-white rounded-xl p-4 border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-xs font-bold text-emerald-800">
                Section 2: Mathematics (3)
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">1 Mark Each</span>
            </div>
            <div className="space-y-2">
              {activeFieldQuestions.math.map((q, idx) => (
                <div key={q.id} className="p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-100/70 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold text-emerald-900 mb-1">
                    <span>Q{idx + 4}: {q.id}</span>
                    <span className="text-[10px] text-slate-500 font-sans font-medium">{q.difficulty}</span>
                  </div>
                  <div className="line-clamp-2 text-slate-700 font-medium">{q.questionEn}</div>
                  <div className="line-clamp-1 text-slate-500 text-[11px] mt-0.5">{q.questionHi}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Reasoning (3) */}
          <div className="bg-white rounded-xl p-4 border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-bold text-amber-800">
                Section 3: Reasoning (3)
              </span>
              <span className="text-[10px] font-mono text-amber-600 font-bold">1 Mark Each</span>
            </div>
            <div className="space-y-2">
              {activeFieldQuestions.reasoning.map((q, idx) => (
                <div key={q.id} className="p-2.5 rounded-lg bg-amber-50/40 border border-amber-100/70 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold text-amber-900 mb-1">
                    <span>Q{idx + 7}: {q.id}</span>
                    <span className="text-[10px] text-slate-500 font-sans font-medium">{q.difficulty}</span>
                  </div>
                  <div className="line-clamp-2 text-slate-700 font-medium">{q.questionEn}</div>
                  <div className="line-clamp-1 text-slate-500 text-[11px] mt-0.5">{q.questionHi}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Question Bank Explorer & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            Browse Calibrated 450-Question Bank
          </h2>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['All', 'Reading', 'Mathematics', 'Reasoning'] as const).map((cat) => (
              <button
                key={cat}
                id={`tab-cat-${cat}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat} {cat === 'All' ? '(450)' : '(150)'}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="search-qb-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID (e.g. READ-001) or text in English or हिन्दी..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs rounded-lg border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              id="filter-diff-qb"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="bg-slate-50 text-slate-700 text-xs rounded-lg border border-slate-200 px-3 py-2 font-semibold focus:outline-hidden"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <button
              id="btn-show-locked-toggle"
              onClick={() => setShowLockedOnly(!showLockedOnly)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                showLockedOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {showLockedOnly ? 'Locked 9 Only' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredQuestions.length} questions
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.slice(0, 50).map((q) => {
              const isCurrentlyLocked = lockedIds.has(q.id);

              return (
                <div 
                  key={q.id}
                  id={`q-card-${q.id}`}
                  className={`bg-white rounded-2xl p-5 border shadow-xs transition-all ${
                    isCurrentlyLocked 
                      ? 'border-emerald-300 ring-1 ring-emerald-300/40 bg-emerald-50/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {q.id}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {q.category}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        q.difficulty === 'Medium' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCurrentlyLocked ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active Field Question</span>
                        </span>
                      ) : (
                        !fieldTestConfig.isLocked && (
                          <button
                            onClick={() => handleAssignToSlot(q)}
                            className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                          >
                            Set as Active Field Q
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Bilingual Question text side-by-side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        English Version
                      </span>
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                        {q.questionEn}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        सरल हिन्दी (Hindi Version)
                      </span>
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed font-serif">
                        {q.questionHi}
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt) => {
                      const isCorrect = opt.id === q.correctAnswer;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {opt.id}
                            </span>
                            <span>{opt.textEn}</span>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-600 font-serif">{opt.textHi}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 shrink-0">
                              (Correct)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Explanation: </span>
                    {q.explanationEn} — <span className="font-serif">{q.explanationHi}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredQuestions.length > 50 && (
            <div className="text-center py-4 text-xs text-slate-400">
              Showing first 50 results of {filteredQuestions.length}. Use the search bar above to pinpoint specific IDs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
