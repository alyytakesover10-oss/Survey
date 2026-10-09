import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Languages, 
  Smartphone, 
  Scale, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
          <FileText className="w-3.5 h-3.5" />
          <span>Research Methodology &amp; Fieldwork Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Community Engagement Project (CEP) Documentation
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Standardized empirical assessment protocol for comparing foundational learning outcomes 
          across one Government School and one Private School cohort.
        </p>
      </div>

      {/* Section 1: Research Objectives & Scope */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">1</span>
          <span>Research Objectives &amp; Problem Statement</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            The primary aim of this Community Engagement Project (CEP) is to assess and compare student learning outcomes 
            in foundational literacy, numeracy, and problem-solving reasoning across two contrasting educational settings: 
            one local Government School and one Private School within the same geographic catchment.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">Foundational Literacy</span>
              <span className="text-xs text-slate-500">Reading comprehension, vocabulary in context, and central message identification.</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">Foundational Numeracy</span>
              <span className="text-xs text-slate-500">Arithmetic operations, basic fractions, geometry, and applied word problems.</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">Cognitive Reasoning</span>
              <span className="text-xs text-slate-500">Pattern recognition, logical sequencing, and spatial/deductive problem solving.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Instrument Standardization & Field Locking */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">2</span>
          <span>Instrument Standardization &amp; Field Locking</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            To eliminate instrument bias and ensure internal validity, every student in both participating schools 
            is administered the exact same standardized 9-question assessment battery:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
            <li><strong>Section 1: Reading &amp; Understanding</strong> — 3 questions (1 mark each = 3 marks total)</li>
            <li><strong>Section 2: Mathematics</strong> — 3 questions (1 mark each = 3 marks total)</li>
            <li><strong>Section 3: Reasoning &amp; Problem Solving</strong> — 3 questions (1 mark each = 3 marks total)</li>
            <li><strong>Total Score:</strong> 9 marks maximum, converted to percentage: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded-xs">(Total / 9) * 100</code></li>
          </ul>
          <p>
            The software enforces a <strong>Field Test Lock</strong> mechanism. Once locked, the 9 selected questions cannot 
            be altered during active testing, guaranteeing empirical measurement equivalence.
          </p>
        </div>
      </div>

      {/* Section 3: Ethical Safeguards & PII Protection */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">3</span>
          <span>Research Ethics &amp; PII Confidentiality</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Personally Identifiable Information (PII) Stored</span>
            </div>
            <p className="text-xs leading-relaxed">
              In strict adherence to undergraduate research ethics and child privacy protections, the system 
              does not prompt for or store student names, telephone numbers, home addresses, Aadhaar numbers, 
              or socioeconomic family metrics.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block">Government School Pseudonyms</span>
              <span className="text-slate-600 mt-1 block">Students are cataloged sequentially as <code className="font-mono font-bold text-emerald-700">G001, G002, G003...</code></span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block">Private School Pseudonyms</span>
              <span className="text-slate-600 mt-1 block">Students are cataloged sequentially as <code className="font-mono font-bold text-blue-700">P001, P002, P003...</code></span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Bilingual Delivery */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">4</span>
          <span>Bilingual Equity: English &amp; सरल हिन्दी</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            Language barriers should not confound mathematics and reasoning assessments. Every single item in the 
            450-question bank has been crafted in English alongside clear, natural, spoken school Hindi (सरल हिन्दी). 
            Enumerators can toggle languages with a single touch during the assessment if a student requires linguistic clarity.
          </p>
        </div>
      </div>

      {/* Section 5: Descriptive Analysis & Non-Deficit Neutrality */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">5</span>
          <span>Descriptive Statistics &amp; Non-Deficit Neutrality</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            The project adheres to objective, descriptive reporting standards. Sensationalist or pejorative labeling 
            is strictly avoided. The dashboard uses mathematically neutral terminology:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono font-semibold">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">“Observed Average Score”</div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">“Observed Percentage”</div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">“Difference in Sample Average”</div>
          </div>
          <p className="text-slate-500 text-xs">
            Differences between sample cohorts are interpreted in the context of institutional resources, 
            instructional hours, and sample characteristics rather than generalized deficit judgments.
          </p>
        </div>
      </div>
    </div>
  );
};
