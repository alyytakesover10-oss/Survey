import React, { useState } from 'react';
import { AssessmentRecord } from '../types';
import { DatasetPresetMode } from '../utils/datasetSeeder';
import { convertRecordsToCSV, downloadCSV } from '../utils/csvExport';
import { 
  Code2, 
  Download, 
  Copy, 
  Check, 
  Shuffle, 
  Terminal, 
  FileSpreadsheet, 
  BarChart3,
  Building2,
  GraduationCap
} from 'lucide-react';

interface StreamlitViewProps {
  records: AssessmentRecord[];
  onReseedDataset: (mode: DatasetPresetMode) => void;
  onNavigateToDashboard: () => void;
}

const STREAMLIT_PYTHON_CODE = `"""
CEP Learning Outcomes Data Collection & Comparison System (Streamlit Python Edition)
Run locally with:
    pip install streamlit pandas numpy plotly
    streamlit run app.py
"""

import random
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

st.set_page_config(
    page_title="CEP Learning Outcomes Data Collection & Comparison System",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------------------------------------------------------------------------
# JUMBLED DATASET GENERATOR (GOV: 5-6-7 | PVT: 7-8-9)
# ---------------------------------------------------------------------------
def generate_jumbled_dataset(mode: str = "75_each", seed: int = 20261009) -> pd.DataFrame:
    rng = random.Random(seed)
    gov_count = 75 if mode == "75_each" else 38
    pvt_count = 75 if mode == "75_each" else 37

    gov_scores = [5 + (i % 3) for i in range(gov_count)]
    rng.shuffle(gov_scores)

    pvt_scores = [7 + (i % 3) for i in range(pvt_count)]
    rng.shuffle(pvt_scores)

    rows = []
    base_time = datetime(2026, 10, 8, 9, 0, 0)

    def make_student(school_type: str, idx: int, target_score: int):
        is_gov = school_type == "Government"
        prefix = "G" if is_gov else "P"
        student_id = f"{prefix}{idx:03d}"
        record_id = f"REC-{'GOV' if is_gov else 'PVT'}-{idx:04d}"

        q_indices = list(range(9))
        rng.shuffle(q_indices)
        correct_set = set(q_indices[:target_score])

        reading_score = sum(1 for q in [0, 1, 2] if q in correct_set)
        math_score = sum(1 for q in [3, 4, 5] if q in correct_set)
        reasoning_score = sum(1 for q in [6, 7, 8] if q in correct_set)
        total_score = reading_score + math_score + reasoning_score
        percentage = round((total_score / 9.0) * 100, 1)

        student_class = rng.choice(["Class 5", "Class 6", "Class 7"] if is_gov else ["Class 5", "Class 6", "Class 7", "Class 8"])
        section = rng.choice(["A", "B", "C"])
        language = "hi" if (rng.random() < (0.72 if is_gov else 0.32)) else "en"
        enumerator = rng.choice(["Enumerator 1", "Enumerator 2"])

        return {
            "Record_ID": record_id,
            "Student_ID": student_id,
            "School_Type": school_type,
            "Class": student_class,
            "Section": section,
            "Language": language,
            "Enumerator": enumerator,
            "Reading_Score": reading_score,
            "Math_Score": math_score,
            "Reasoning_Score": reasoning_score,
            "Total_Score": total_score,
            "Percentage": percentage,
            "Data_Status": "Complete",
        }

    for i in range(gov_count):
        rows.append(make_student("Government", i + 1, gov_scores[i]))

    for i in range(pvt_count):
        rows.append(make_student("Private", i + 1, pvt_scores[i]))

    rng.shuffle(rows)
    for idx, r in enumerate(rows):
        ts = base_time + timedelta(minutes=idx * 3, seconds=rng.randint(0, 50))
        r["Timestamp"] = ts.strftime("%Y-%m-%d %H:%M:%S")
        r["Sequence_Order"] = idx + 1

    return pd.DataFrame(rows)

if "dataset_mode" not in st.session_state:
    st.session_state.dataset_mode = "75_each"
if "seed" not in st.session_state:
    st.session_state.seed = 20261009
if "df" not in st.session_state:
    st.session_state.df = generate_jumbled_dataset(st.session_state.dataset_mode, st.session_state.seed)

st.sidebar.title("📊 CEP Learning Outcomes")
mode_label = st.sidebar.selectbox(
    "Dataset Size Preset",
    ["75 Each School (75 Gov + 75 Pvt = 150)", "75 Total Combined (38 Gov + 37 Pvt = 75)"]
)
selected_mode = "75_each" if "150" in mode_label else "75_total"
if selected_mode != st.session_state.dataset_mode:
    st.session_state.dataset_mode = selected_mode
    st.session_state.df = generate_jumbled_dataset(selected_mode, st.session_state.seed)

if st.sidebar.button("🎲 Re-Jumble 5-6-7 & 7-8-9 Results", use_container_width=True):
    st.session_state.seed += 7
    st.session_state.df = generate_jumbled_dataset(st.session_state.dataset_mode, st.session_state.seed)

df = st.session_state.df
gov_df = df[df["School_Type"] == "Government"]
pvt_df = df[df["School_Type"] == "Private"]

st.title("📊 CEP Learning Outcomes Comparison System (5 Interactive Visuals)")
c1, c2, c3, c4 = st.columns(4)
c1.metric("Gov Mean (5-6-7)", f"{gov_df['Total_Score'].mean():.2f} / 9", f"{gov_df['Percentage'].mean():.1f}%")
c2.metric("Pvt Mean (7-8-9)", f"{pvt_df['Total_Score'].mean():.2f} / 9", f"{pvt_df['Percentage'].mean():.1f}%")
c3.metric("Difference (Δ)", f"+{(pvt_df['Total_Score'].mean() - gov_df['Total_Score'].mean()):.2f} / 9")
c4.metric("Total Sample", f"{len(df)} Records", f"{len(gov_df)} Gov / {len(pvt_df)} Pvt")

# Visual 1: Grouped Bar Chart
r1c1, r1c2 = st.columns(2)
with r1c1:
    st.subheader("1️⃣ Visual 1: Section-Wise & Overall Mean Score")
    sec_df = pd.DataFrame({
        "Metric": ["Reading (/3)", "Math (/3)", "Reasoning (/3)", "Total Score (/9)"],
        "Government": [gov_df["Reading_Score"].mean(), gov_df["Math_Score"].mean(), gov_df["Reasoning_Score"].mean(), gov_df["Total_Score"].mean()],
        "Private": [pvt_df["Reading_Score"].mean(), pvt_df["Math_Score"].mean(), pvt_df["Reasoning_Score"].mean(), pvt_df["Total_Score"].mean()],
    }).melt(id_vars="Metric", var_name="School_Type", value_name="Average_Score")
    st.plotly_chart(px.bar(sec_df.round(2), x="Metric", y="Average_Score", color="School_Type", barmode="group", text="Average_Score",
                           color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"}), use_container_width=True)

# Visual 2: Score Distribution Histogram
with r1c2:
    st.subheader("2️⃣ Visual 2: Jumbled Score Distribution Histogram (5-6-7 vs 7-8-9)")
    st.plotly_chart(px.histogram(df, x="Total_Score", color="School_Type", barmode="group", text_auto=True,
                                 color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"}), use_container_width=True)

# Visual 3: 5-Axis Radar Chart
r2c1, r2c2 = st.columns(2)
with r2c1:
    st.subheader("3️⃣ Visual 3: 5-Axis Competency Radar Chart")
    cats = ["Reading %", "Math %", "Reasoning %", "Consistency %", "Overall %"]
    fig3 = go.Figure()
    fig3.add_trace(go.Scatterpolar(r=[(gov_df["Reading_Score"].mean()/3)*100, (gov_df["Math_Score"].mean()/3)*100, (gov_df["Reasoning_Score"].mean()/3)*100, (gov_df["Total_Score"]>=6).mean()*100, gov_df["Percentage"].mean()], theta=cats, fill="toself", name="Government", line_color="#10b981"))
    fig3.add_trace(go.Scatterpolar(r=[(pvt_df["Reading_Score"].mean()/3)*100, (pvt_df["Math_Score"].mean()/3)*100, (pvt_df["Reasoning_Score"].mean()/3)*100, (pvt_df["Total_Score"]>=6).mean()*100, pvt_df["Percentage"].mean()], theta=cats, fill="toself", name="Private", line_color="#3b82f6"))
    st.plotly_chart(fig3, use_container_width=True)

# Visual 4: Jumbled Sequence Trajectory
with r2c2:
    st.subheader("4️⃣ Visual 4: Jumbled Student Sequence Trajectory")
    st.plotly_chart(px.line(df, x="Sequence_Order", y="Total_Score", color="School_Type", markers=True,
                            color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"}), use_container_width=True)

# Visual 5: Score Band Donut & Class Breakdown
st.subheader("5️⃣ Visual 5: Score Share Donut & Class-Wise Breakdown")
r3c1, r3c2 = st.columns(2)
with r3c1:
    st.plotly_chart(px.pie(df, names="Total_Score", facet_col="School_Type", hole=0.45), use_container_width=True)
with r3c2:
    cls_df = df.groupby(["Class", "School_Type"], as_index=False)["Total_Score"].mean()
    st.plotly_chart(px.bar(cls_df, x="Class", y="Total_Score", color="School_Type", barmode="group",
                           color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"}), use_container_width=True)

st.subheader("🗂️ Complete Jumbled Dataset (Government 5-6-7 & Private 7-8-9)")
st.dataframe(df, use_container_width=True)
`;

export const StreamlitView: React.FC<StreamlitViewProps> = ({
  records,
  onReseedDataset,
  onNavigateToDashboard
}) => {
  const [copied, setCopied] = useState(false);

  const govCount = records.filter(r => r.schoolType === 'Government').length;
  const pvtCount = records.filter(r => r.schoolType === 'Private').length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(STREAMLIT_PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPython = () => {
    const blob = new Blob([STREAMLIT_PYTHON_CODE], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'app.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csv = convertRecordsToCSV(records);
    downloadCSV(`cep_jumbled_dataset_${records.length}_records.csv`, csv);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <Code2 className="w-3.5 h-3.5" />
              <span>Streamlit Python Edition (`app.py`) + Jumbled Dataset</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Streamlit Python Application &amp; Dataset Exporter
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Full standalone Python Streamlit code (<code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-xs">app.py</code>) with the jumbled Government (5–6–7) &amp; Private (7–8–9) dataset and all 5 interactive visuals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPython}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download app.py</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Jumbled CSV ({records.length})</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View 5 Live Visuals</span>
            </button>
          </div>
        </div>

        {/* Dataset Switcher Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-slate-700">Active Jumbled Dataset:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              Gov (5–6–7): <strong>{govCount} records</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
              Pvt (7–8–9): <strong>{pvtCount} records</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onReseedDataset('75_each')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Set 75 Gov + 75 Pvt (150 Total)</span>
            </button>
            <button
              type="button"
              onClick={() => onReseedDataset('75_total')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Set 75 Combined Total (38 Gov + 37 Pvt)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Instructions */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Terminal className="w-4 h-4" />
            <span>How to Run Locally in Streamlit Python</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Python 3.9+</span>
        </div>
        <pre className="text-xs font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 overflow-x-auto text-slate-200">
{`pip install streamlit pandas numpy plotly
streamlit run app.py`}
        </pre>
      </div>

      {/* Complete app.py Code Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 font-mono text-xs font-bold text-slate-800">app.py — Complete Streamlit Python Script</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied app.py!' : 'Copy Python Code'}</span>
          </button>
        </div>
        <pre className="p-5 text-xs font-mono text-slate-800 bg-slate-50/40 overflow-x-auto max-h-[540px] overflow-y-auto leading-relaxed">
          {STREAMLIT_PYTHON_CODE}
        </pre>
      </div>
    </div>
  );
};
