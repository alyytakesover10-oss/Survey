import React, { useState } from 'react';
import { AssessmentRecord } from '../types';
import { DatasetPresetMode } from '../utils/datasetSeeder';
import { convertRecordsToCSV, downloadCSV } from '../utils/csvExport';
import { 
  Code2, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  FileSpreadsheet, 
  BarChart3,
  Cpu,
  BookOpen,
  FileCode
} from 'lucide-react';

interface StreamlitViewProps {
  records: AssessmentRecord[];
  onReseedDataset: (mode: DatasetPresetMode) => void;
  onNavigateToDashboard: () => void;
  onNavigateToDeepLearning?: () => void;
}

const APP_PY_CODE = `"""
===============================================================================
FILE: app.py
PROJECT: CEP Learning Outcomes Data Collection & Comparison System
FRAMEWORK: Python Streamlit + Plotly + NumPy Deep Neural Network (MLP)
HOW TO RUN IN VISUAL STUDIO CODE (VS CODE):
    1. Open Terminal in VS Code (Ctrl + ~ or Terminal -> New Terminal)
    2. Install packages:
           pip install -r requirements.txt
    3. Run the Streamlit app on localhost:
           streamlit run app.py
===============================================================================
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

from dataset_generator import generate_school_datasets
from neural_network import DeepLearningOutcomeMLP

st.set_page_config(
    page_title="CEP Learning Outcomes & Deep Learning System",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)

# -----------------------------------------------------------------------------
# 1. INITIALIZE 75 GOVERNMENT (5-6-7) & 75 PRIVATE (7-8-9) SEPARATE DATASETS
# -----------------------------------------------------------------------------
if "seed" not in st.session_state:
    st.session_state.seed = 20261010

if "gov_df" not in st.session_state or "pvt_df" not in st.session_state:
    gov_df, pvt_df, combined_df = generate_school_datasets(st.session_state.seed)
    st.session_state.gov_df = gov_df
    st.session_state.pvt_df = pvt_df
    st.session_state.combined_df = combined_df

# -----------------------------------------------------------------------------
# 2. INITIALIZE & TRAIN DEEP LEARNING NEURAL NETWORK (MLP: 6 -> 16 -> 8 -> 3)
# -----------------------------------------------------------------------------
if "mlp_model" not in st.session_state:
    mlp = DeepLearningOutcomeMLP(input_dim=6, hidden1_dim=16, hidden2_dim=8, output_dim=3, seed=42)
    metrics = mlp.fit(st.session_state.combined_df, epochs=120, learning_rate=0.08)
    st.session_state.mlp_model = mlp
    st.session_state.mlp_metrics = metrics

st.sidebar.title("🧠 CEP Streamlit System")
active_tab = st.sidebar.radio(
    "Select Module",
    [
        "📊 1. Comparison Dashboard (5 Visuals)",
        "🧠 2. Deep Learning Neural Network Predictor",
        "🏫 3. Government School (75 Records: 5–6–7)",
        "🎓 4. Private School (75 Records: 7–8–9)",
        "🗂️ 5. Combined Data Center (150 Records)",
    ],
)

if st.sidebar.button("🔀 Re-Jumble Both 75 Separate Datasets", use_container_width=True):
    st.session_state.seed += 17
    gov_df, pvt_df, combined_df = generate_school_datasets(st.session_state.seed)
    st.session_state.gov_df = gov_df
    st.session_state.pvt_df = pvt_df
    st.session_state.combined_df = combined_df
    st.session_state.mlp_metrics = st.session_state.mlp_model.fit(combined_df, epochs=120, learning_rate=0.08)

gov_df = st.session_state.gov_df
pvt_df = st.session_state.pvt_df
combined_df = st.session_state.combined_df

if active_tab.startswith("📊 1."):
    st.title("📊 Learning Outcomes Comparison Dashboard (5 Interactive Visuals)")
    c1, c2, c3, c4 = st.columns(4)
    gov_mean = gov_df["Total_Score"].mean()
    pvt_mean = pvt_df["Total_Score"].mean()
    c1.metric("Government School (75 Records)", f"{gov_mean:.2f} / 9", "Scores 5, 6, 7 Jumbled")
    c2.metric("Private School (75 Records)", f"{pvt_mean:.2f} / 9", "Scores 7, 8, 9 Jumbled")
    c3.metric("Difference in Sample Mean (Δ)", f"+{(pvt_mean - gov_mean):.2f} / 9")
    c4.metric("Neural Network Accuracy", f"{st.session_state.mlp_metrics['final_accuracy']:.1f}%", "MLP (6→16→8→3)")

    # Visual 1 & Visual 2
    col_v1, col_v2 = st.columns(2)
    with col_v1:
        st.subheader("Visual 1: Section-Wise & Overall Mean Score")
        sec_data = pd.DataFrame({
            "Section": ["Reading (/3)", "Math (/3)", "Reasoning (/3)", "Total Score (/9)"],
            "Government (75)": [gov_df["Reading_Score"].mean(), gov_df["Math_Score"].mean(), gov_df["Reasoning_Score"].mean(), gov_df["Total_Score"].mean()],
            "Private (75)": [pvt_df["Reading_Score"].mean(), pvt_df["Math_Score"].mean(), pvt_df["Reasoning_Score"].mean(), pvt_df["Total_Score"].mean()],
        }).melt(id_vars="Section", var_name="School", value_name="Average_Score").round(2)
        st.plotly_chart(px.bar(sec_data, x="Section", y="Average_Score", color="School", barmode="group", text="Average_Score",
                               color_discrete_map={"Government (75)": "#10b981", "Private (75)": "#3b82f6"}), use_container_width=True)

    with col_v2:
        st.subheader("Visual 2: Jumbled Score Distribution Histogram (5-6-7 vs 7-8-9)")
        st.plotly_chart(px.histogram(combined_df, x="Total_Score", color="School_Type", barmode="group", text_auto=True,
                                     color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"}), use_container_width=True)

    # Visual 3 & Visual 4
    col_v3, col_v4 = st.columns(2)
    with col_v3:
        st.subheader("Visual 3: 5-Axis Competency Radar Chart")
        axes = ["Reading %", "Math %", "Reasoning %", "Consistency %", "Overall %"]
        fig3 = go.Figure()
        fig3.add_trace(go.Scatterpolar(r=[(gov_df["Reading_Score"].mean()/3)*100, (gov_df["Math_Score"].mean()/3)*100, (gov_df["Reasoning_Score"].mean()/3)*100, (gov_df["Total_Score"]>=6).mean()*100, gov_df["Percentage"].mean()], theta=axes, fill="toself", name="Government (75)", line_color="#10b981"))
        fig3.add_trace(go.Scatterpolar(r=[(pvt_df["Reading_Score"].mean()/3)*100, (pvt_df["Math_Score"].mean()/3)*100, (pvt_df["Reasoning_Score"].mean()/3)*100, (pvt_df["Total_Score"]>=6).mean()*100, pvt_df["Percentage"].mean()], theta=axes, fill="toself", name="Private (75)", line_color="#3b82f6"))
        st.plotly_chart(fig3, use_container_width=True)

    with col_v4:
        st.subheader("Visual 4: Jumbled Student Sequence Trajectory (1 to 75)")
        traj_df = pd.DataFrame({
            "Student_Index": list(range(1, 76)) * 2,
            "Total_Score": list(gov_df["Total_Score"]) + list(pvt_df["Total_Score"]),
            "School_Type": ["Government"] * 75 + ["Private"] * 75,
        })
        st.plotly_chart(px.line(traj_df, x="Student_Index", y="Total_Score", color="School_Type", markers=True,
                                color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"}), use_container_width=True)

    # Visual 5
    st.subheader("Visual 5: Score Band Donut Charts & Class-Wise Breakdown")
    col_v5a, col_v5b = st.columns(2)
    with col_v5a:
        st.plotly_chart(px.pie(combined_df, names="Total_Score", facet_col="School_Type", hole=0.45), use_container_width=True)
    with col_v5b:
        cls_df = combined_df.groupby(["Class", "School_Type"], as_index=False)["Total_Score"].mean().round(2)
        st.plotly_chart(px.bar(cls_df, x="Class", y="Total_Score", color="School_Type", barmode="group", text="Total_Score",
                               color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"}), use_container_width=True)

elif active_tab.startswith("🧠 2."):
    st.title("🧠 Deep Learning Neural Network Outcome Predictor (MLP)")
    col_train, col_pred = st.columns(2)
    with col_train:
        epochs = st.slider("Training Epochs", 30, 300, 120, 10)
        lr = st.select_slider("Learning Rate (α)", options=[0.01, 0.03, 0.05, 0.08, 0.1, 0.15], value=0.08)
        if st.button("🚀 Train Deep Neural Network"):
            st.session_state.mlp_metrics = st.session_state.mlp_model.fit(combined_df, epochs=epochs, learning_rate=lr)
        metrics = st.session_state.mlp_metrics
        st.metric("Final Cross-Entropy Loss", f"{metrics['final_loss']:.4f}")
        st.metric("Training Classification Accuracy", f"{metrics['final_accuracy']:.1f}%")
        hist_df = pd.DataFrame({"Epoch": range(1, len(metrics["loss_history"])+1), "Loss": metrics["loss_history"], "Accuracy (%)": metrics["accuracy_history"]})
        st.plotly_chart(px.line(hist_df, x="Epoch", y=["Loss", "Accuracy (%)"]), use_container_width=True)

    with col_pred:
        p_school = st.selectbox("School Type", ["Government", "Private"])
        p_class = st.selectbox("Student Class", ["Class 5", "Class 6", "Class 7", "Class 8"])
        p_lang = st.selectbox("Language", ["Hindi", "English"])
        p_read = st.slider("Reading Score (/3)", 0, 3, 2)
        p_math = st.slider("Math Score (/3)", 0, 3, 2)
        p_reas = st.slider("Reasoning Score (/3)", 0, 3, 2)
        pred = st.session_state.mlp_model.predict_student(p_school, p_class, p_lang, p_read, p_math, p_reas)
        st.success(f"Predicted Tier: {pred['predicted_tier']} ({pred['confidence_pct']}%)")
        st.info(f"Expected Mastery Score: {pred['predicted_score']} / 9")

elif active_tab.startswith("🏫 3."):
    st.title("🏫 Government School — 75 Separate Records (Scores 5, 6, 7)")
    st.dataframe(gov_df, use_container_width=True)

elif active_tab.startswith("🎓 4."):
    st.title("🎓 Private School — 75 Separate Records (Scores 7, 8, 9)")
    st.dataframe(pvt_df, use_container_width=True)

elif active_tab.startswith("🗂️ 5."):
    st.title("🗂️ Combined Data Center (150 Records)")
    st.dataframe(combined_df, use_container_width=True)
`;

const NEURAL_NETWORK_PY_CODE = `"""
===============================================================================
FILE: neural_network.py
PURPOSE:
    Deep Learning Multi-Layer Perceptron (MLP) Neural Network implemented in
    NumPy with Forward Propagation, ReLU, Softmax, Cross-Entropy Loss, and
    Backpropagation for predicting Student Learning Outcomes.
ARCHITECTURE:
    Input (6) ➔ Hidden Layer 1 (16, ReLU) ➔ Hidden Layer 2 (8, ReLU) ➔ Output (3, Softmax)
===============================================================================
"""

import numpy as np
import pandas as pd

class DeepLearningOutcomeMLP:
    def __init__(self, input_dim: int = 6, hidden1_dim: int = 16, hidden2_dim: int = 8, output_dim: int = 3, seed: int = 42):
        self.rng = np.random.default_rng(seed)
        self.input_dim = input_dim
        self.hidden1_dim = hidden1_dim
        self.hidden2_dim = hidden2_dim
        self.output_dim = output_dim

        # He Initialization for ReLU layers
        self.W1 = self.rng.normal(0, np.sqrt(2.0 / input_dim), size=(input_dim, hidden1_dim))
        self.b1 = np.zeros((1, hidden1_dim))
        self.W2 = self.rng.normal(0, np.sqrt(2.0 / hidden1_dim), size=(hidden1_dim, hidden2_dim))
        self.b2 = np.zeros((1, hidden2_dim))
        self.W3 = self.rng.normal(0, np.sqrt(1.0 / hidden2_dim), size=(hidden2_dim, output_dim))
        self.b3 = np.zeros((1, output_dim))

        self.loss_history = []
        self.accuracy_history = []

    @staticmethod
    def relu(z: np.ndarray) -> np.ndarray:
        return np.maximum(0.0, z)

    @staticmethod
    def relu_derivative(z: np.ndarray) -> np.ndarray:
        return (z > 0).astype(float)

    @staticmethod
    def softmax(z: np.ndarray) -> np.ndarray:
        shifted = z - np.max(z, axis=1, keepdims=True)
        exp_z = np.exp(shifted)
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)

    @staticmethod
    def prepare_features(df: pd.DataFrame):
        school_enc = (df["School_Type"] == "Private").astype(float).values
        class_num = df["Class"].str.replace("Class ", "", regex=False).astype(float).values
        class_norm = (class_num - 5.0) / 3.0
        lang_enc = (df["Language"].isin(["English", "en"])).astype(float).values
        read_norm = df["Reading_Score"].astype(float).values / 3.0
        math_norm = df["Math_Score"].astype(float).values / 3.0
        reas_norm = df["Reasoning_Score"].astype(float).values / 3.0

        X = np.column_stack([school_enc, class_norm, lang_enc, read_norm, math_norm, reas_norm])
        scores = df["Total_Score"].astype(int).values
        y = np.where(scores <= 6, 0, np.where(scores == 7, 1, 2))
        return X, y

    def forward(self, X: np.ndarray):
        Z1 = X @ self.W1 + self.b1
        A1 = self.relu(Z1)
        Z2 = A1 @ self.W2 + self.b2
        A2 = self.relu(Z2)
        Z3 = A2 @ self.W3 + self.b3
        probs = self.softmax(Z3)
        return {"Z1": Z1, "A1": A1, "Z2": Z2, "A2": A2, "Z3": Z3, "probs": probs}

    def fit(self, df: pd.DataFrame, epochs: int = 120, learning_rate: float = 0.08):
        X, y = self.prepare_features(df)
        n_samples = X.shape[0]
        y_onehot = np.eye(self.output_dim)[y]
        self.loss_history, self.accuracy_history = [], []

        for _ in range(epochs):
            cache = self.forward(X)
            probs = cache["probs"]
            ce_loss = -np.mean(np.sum(y_onehot * np.log(probs + 1e-9), axis=1))
            self.loss_history.append(round(float(ce_loss), 4))
            preds = np.argmax(probs, axis=1)
            self.accuracy_history.append(round(float(np.mean(preds == y) * 100.0), 2))

            # Backpropagation
            dZ3 = (probs - y_onehot) / n_samples
            dW3 = cache["A2"].T @ dZ3 + 0.002 * self.W3
            db3 = np.sum(dZ3, axis=0, keepdims=True)

            dA2 = dZ3 @ self.W3.T
            dZ2 = dA2 * self.relu_derivative(cache["Z2"])
            dW2 = cache["A1"].T @ dZ2 + 0.002 * self.W2
            db2 = np.sum(dZ2, axis=0, keepdims=True)

            dA1 = dZ2 @ self.W2.T
            dZ1 = dA1 * self.relu_derivative(cache["Z1"])
            dW1 = X.T @ dZ1 + 0.002 * self.W1
            db1 = np.sum(dZ1, axis=0, keepdims=True)

            self.W3 -= learning_rate * dW3
            self.b3 -= learning_rate * db3
            self.W2 -= learning_rate * dW2
            self.b2 -= learning_rate * db2
            self.W1 -= learning_rate * dW1
            self.b1 -= learning_rate * db1

        return {
            "final_loss": self.loss_history[-1],
            "final_accuracy": self.accuracy_history[-1],
            "loss_history": self.loss_history,
            "accuracy_history": self.accuracy_history,
        }

    def predict_student(self, school_type: str, student_class: str, language: str, reading_score: int, math_score: int, reasoning_score: int):
        school_enc = 1.0 if school_type == "Private" else 0.0
        class_norm = (float(student_class.replace("Class ", "")) - 5.0) / 3.0
        lang_enc = 1.0 if language in ("English", "en") else 0.0
        x = np.array([[school_enc, class_norm, lang_enc, reading_score / 3.0, math_score / 3.0, reasoning_score / 3.0]])
        cache = self.forward(x)
        probs = cache["probs"][0]
        tier_names = ["Developing Mastery Band (5–6 / 9)", "Proficient Grade-Level Band (7 / 9)", "Advanced Distinction Band (8–9 / 9)"]
        pred_idx = int(np.argmax(probs))
        raw_sum = reading_score + math_score + reasoning_score
        nn_expected = float(probs[0] * 5.5 + probs[1] * 7.0 + probs[2] * 8.5)
        return {
            "predicted_tier": tier_names[pred_idx],
            "confidence_pct": round(float(probs[pred_idx] * 100.0), 1),
            "probabilities": {
                "Developing (5-6)": round(float(probs[0] * 100.0), 1),
                "Proficient (7)": round(float(probs[1] * 100.0), 1),
                "Advanced (8-9)": round(float(probs[2] * 100.0), 1),
            },
            "predicted_score": round(0.65 * raw_sum + 0.35 * nn_expected, 2),
        }
`;

const DATASET_PY_CODE = `"""
===============================================================================
FILE: dataset_generator.py
PURPOSE:
    Generates 75 separate Government School records (G001-G075, scores 5-6-7
    jumbled) and 75 separate Private School records (P001-P075, scores 7-8-9
    jumbled) = 150 Total Student Records.
===============================================================================
"""

import random
from datetime import datetime, timedelta
import pandas as pd

def generate_school_datasets(seed: int = 20261010):
    rng = random.Random(seed)
    records_per_school = 75

    gov_scores = [5 + (i % 3) for i in range(records_per_school)]
    rng.shuffle(gov_scores)

    pvt_scores = [7 + (i % 3) for i in range(records_per_school)]
    rng.shuffle(pvt_scores)

    base_time = datetime(2026, 10, 8, 9, 0, 0)

    def create_student_record(school_type: str, student_num: int, target_total_score: int):
        is_gov = school_type == "Government"
        prefix = "G" if is_gov else "P"
        student_id = f"{prefix}{student_num:03d}"
        record_id = f"REC-{'GOV' if is_gov else 'PVT'}-{student_num:04d}"

        q_indices = list(range(9))
        rng.shuffle(q_indices)
        correct_set = set(q_indices[:target_total_score])

        reading_score = sum(1 for q in [0, 1, 2] if q in correct_set)
        math_score = sum(1 for q in [3, 4, 5] if q in correct_set)
        reasoning_score = sum(1 for q in [6, 7, 8] if q in correct_set)
        total_score = reading_score + math_score + reasoning_score
        percentage = round((total_score / 9.0) * 100, 1)

        student_class = rng.choice(["Class 5", "Class 6", "Class 7"] if is_gov else ["Class 5", "Class 6", "Class 7", "Class 8"])
        section = rng.choice(["A", "B", "C"])
        language = "Hindi" if (rng.random() < (0.72 if is_gov else 0.32)) else "English"
        enumerator = rng.choice(["Enumerator 1", "Enumerator 2"])
        ts = base_time + timedelta(minutes=student_num * 4, seconds=rng.randint(0, 50))

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
            "Timestamp": ts.strftime("%Y-%m-%d %H:%M:%S"),
        }

    gov_list = [create_student_record("Government", i + 1, gov_scores[i]) for i in range(records_per_school)]
    pvt_list = [create_student_record("Private", i + 1, pvt_scores[i]) for i in range(records_per_school)]

    gov_df = pd.DataFrame(gov_list)
    pvt_df = pd.DataFrame(pvt_list)
    combined_list = gov_list + pvt_list
    rng.shuffle(combined_list)
    for idx, row in enumerate(combined_list):
        row["Sequence_Order"] = idx + 1
    combined_df = pd.DataFrame(combined_list)
    return gov_df, pvt_df, combined_df
`;

const README_MD_CODE = `# 🧠 CEP Learning Outcomes & Deep Learning Neural Network System (Python Streamlit)

## 🚀 How to Run on Localhost in Visual Studio Code (VS Code)

### Step 1: Create a Folder & Save the 4 Files
Save these files in the same folder on your laptop:
- \`app.py\` (Main Streamlit Dashboard & UI)
- \`neural_network.py\` (3-Layer Deep Learning MLP Predictor)
- \`dataset_generator.py\` (75 Government [5-6-7] & 75 Private [7-8-9] Dataset Generator)
- \`requirements.txt\`

### Step 2: Open Folder in VS Code
1. Open **Visual Studio Code (VS Code)**.
2. Click **File ➔ Open Folder...** and select your project folder.
3. Open the VS Code Terminal (**Ctrl + ~** or **Terminal ➔ New Terminal**).

### Step 3: Install Packages & Launch Localhost
Run these two commands in the VS Code terminal:
\`\`\`bash
pip install streamlit pandas numpy plotly
streamlit run app.py
\`\`\`
The app will automatically open at **http://localhost:8501**!
`;

export const StreamlitView: React.FC<StreamlitViewProps> = ({
  records,
  onNavigateToDashboard,
  onNavigateToDeepLearning
}) => {
  const [selectedFile, setSelectedFile] = useState<'app.py' | 'neural_network.py' | 'dataset_generator.py' | 'README.md'>('app.py');
  const [copied, setCopied] = useState(false);

  const fileContents: Record<typeof selectedFile, string> = {
    'app.py': APP_PY_CODE,
    'neural_network.py': NEURAL_NETWORK_PY_CODE,
    'dataset_generator.py': DATASET_PY_CODE,
    'README.md': README_MD_CODE
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fileContents[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllPythonFiles = () => {
    downloadFile('app.py', APP_PY_CODE);
    setTimeout(() => downloadFile('neural_network.py', NEURAL_NETWORK_PY_CODE), 250);
    setTimeout(() => downloadFile('dataset_generator.py', DATASET_PY_CODE), 500);
    setTimeout(() => downloadFile('README.md', README_MD_CODE), 750);
    setTimeout(() => downloadFile('requirements.txt', 'streamlit>=1.38.0\npandas>=2.2.0\nnumpy>=1.26.0\nplotly>=5.24.0\n'), 1000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <Code2 className="w-3.5 h-3.5" />
              <span>Pure Python Streamlit + Deep Learning Project (VS Code Ready)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              VS Code Python Streamlit Project &amp; README Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Well-commented Python files (<code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-xs">app.py</code>, <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-xs">neural_network.py</code>, <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-xs">dataset_generator.py</code>, <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-xs">README.md</code>) ready for faculty code presentation and running on <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-xs">localhost:8501</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadAllPythonFiles}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download All Python Files + README</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const csv = convertRecordsToCSV(records);
                downloadCSV('cep_combined_150_records.csv', csv);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download 150-Record CSV</span>
            </button>
            {onNavigateToDeepLearning && (
              <button
                type="button"
                onClick={onNavigateToDeepLearning}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>Open Live Neural Network Predictor</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VS Code Localhost Step-by-Step Quick Guide */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Terminal className="w-4 h-4" />
            <span>How to Run on Localhost in Visual Studio Code (2 Commands)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Runs on http://localhost:8501</span>
        </div>
        <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-slate-200 leading-relaxed">
{`# 1. Open this folder in Visual Studio Code & open Terminal (Ctrl + ~)
pip install streamlit pandas numpy plotly

# 2. Start the Streamlit Python Server on Localhost
streamlit run app.py`}
        </pre>
      </div>

      {/* VS Code File Tabs & Code Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['app.py', 'neural_network.py', 'dataset_generator.py', 'README.md'] as const).map((fname) => (
              <button
                key={fname}
                type="button"
                onClick={() => setSelectedFile(fname)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedFile === fname
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{fname}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadFile(selectedFile, fileContents[selectedFile])}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {selectedFile}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : `Copy ${selectedFile}`}</span>
            </button>
          </div>
        </div>

        <pre className="p-5 text-xs font-mono text-slate-800 bg-slate-50/40 overflow-x-auto max-h-[560px] overflow-y-auto leading-relaxed">
          {fileContents[selectedFile]}
        </pre>
      </div>
    </div>
  );
};
