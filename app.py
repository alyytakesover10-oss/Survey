"""
===============================================================================
FILE: app.py
PROJECT: CEP Learning Outcomes Data Collection & Comparison System
FRAMEWORK: Python Streamlit + Plotly + NumPy Deep Neural Network (MLP)
HOW TO RUN IN VISUAL STUDIO CODE (VS CODE):
    1. Open Terminal in VS Code (Ctrl + ` or Terminal -> New Terminal)
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

# Import our modular CEP Dataset Generator & Deep Learning Neural Network
from dataset_generator import generate_school_datasets
from neural_network import DeepLearningOutcomeMLP

# -----------------------------------------------------------------------------
# PAGE CONFIGURATION
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="CEP Learning Outcomes & Deep Learning System",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)

# -----------------------------------------------------------------------------
# SESSION STATE INITIALIZATION (75 GOV + 75 PVT = 150 JUMBLED RECORDS)
# -----------------------------------------------------------------------------
if "seed" not in st.session_state:
    st.session_state.seed = 20261010

if "gov_df" not in st.session_state or "pvt_df" not in st.session_state:
    gov_df, pvt_df, combined_df = generate_school_datasets(st.session_state.seed)
    st.session_state.gov_df = gov_df
    st.session_state.pvt_df = pvt_df
    st.session_state.combined_df = combined_df

if "mlp_model" not in st.session_state:
    mlp = DeepLearningOutcomeMLP(input_dim=6, hidden1_dim=16, hidden2_dim=8, output_dim=3, seed=42)
    metrics = mlp.fit(st.session_state.combined_df, epochs=120, learning_rate=0.08)
    st.session_state.mlp_model = mlp
    st.session_state.mlp_metrics = metrics


# -----------------------------------------------------------------------------
# SIDEBAR NAVIGATION & DATASET CONTROLS
# -----------------------------------------------------------------------------
st.sidebar.title("🧠 CEP Streamlit System")
st.sidebar.caption("75 Gov (5–6–7) & 75 Pvt (7–8–9) Separate Datasets + Deep Learning MLP")

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

st.sidebar.markdown("---")
if st.sidebar.button("🔀 Re-Jumble Both 75 Separate Datasets", use_container_width=True):
    st.session_state.seed += 17
    gov_df, pvt_df, combined_df = generate_school_datasets(st.session_state.seed)
    st.session_state.gov_df = gov_df
    st.session_state.pvt_df = pvt_df
    st.session_state.combined_df = combined_df
    st.session_state.mlp_metrics = st.session_state.mlp_model.fit(combined_df, epochs=120, learning_rate=0.08)
    st.sidebar.success("Re-jumbled 75 Gov & 75 Pvt records and retrained Neural Network!")

gov_df = st.session_state.gov_df
pvt_df = st.session_state.pvt_df
combined_df = st.session_state.combined_df


# =============================================================================
# MODULE 1: COMPARISON DASHBOARD (5 WORKING INTERACTIVE VISUALS)
# =============================================================================
if active_tab.startswith("📊 1."):
    st.title("📊 Learning Outcomes Comparison Dashboard (5 Interactive Visuals)")

    # KPI Summary Cards (75 Separate Records Each)
    c1, c2, c3, c4 = st.columns(4)
    gov_mean = gov_df["Total_Score"].mean()
    pvt_mean = pvt_df["Total_Score"].mean()
    c1.metric("Government School (75 Records)", f"{gov_mean:.2f} / 9", "Scores 5, 6, 7 Jumbled")
    c2.metric("Private School (75 Records)", f"{pvt_mean:.2f} / 9", "Scores 7, 8, 9 Jumbled")
    c3.metric("Difference in Sample Mean (Δ)", f"+{(pvt_mean - gov_mean):.2f} / 9", f"+{(pvt_df['Percentage'].mean() - gov_df['Percentage'].mean()):.1f}%")
    c4.metric("Neural Network Test Accuracy", f"{st.session_state.mlp_metrics['final_accuracy']:.1f}%", "MLP (6 → 16 → 8 → 3)")

    st.markdown("---")

    # VISUAL 1 & VISUAL 2
    col_v1, col_v2 = st.columns(2)

    with col_v1:
        st.subheader("Visual 1: Section-Wise & Overall Mean Score (Grouped Bar Chart)")
        sec_data = pd.DataFrame({
            "Section": ["Reading (/3)", "Math (/3)", "Reasoning (/3)", "Total Score (/9)"],
            "Government (75)": [
                gov_df["Reading_Score"].mean(),
                gov_df["Math_Score"].mean(),
                gov_df["Reasoning_Score"].mean(),
                gov_df["Total_Score"].mean(),
            ],
            "Private (75)": [
                pvt_df["Reading_Score"].mean(),
                pvt_df["Math_Score"].mean(),
                pvt_df["Reasoning_Score"].mean(),
                pvt_df["Total_Score"].mean(),
            ],
        }).melt(id_vars="Section", var_name="School", value_name="Average_Score")
        sec_data["Average_Score"] = sec_data["Average_Score"].round(2)

        fig1 = px.bar(
            sec_data,
            x="Section",
            y="Average_Score",
            color="School",
            barmode="group",
            text="Average_Score",
            color_discrete_map={"Government (75)": "#10b981", "Private (75)": "#3b82f6"},
        )
        st.plotly_chart(fig1, use_container_width=True)

    with col_v2:
        st.subheader("Visual 2: Jumbled Score Frequency Histogram (5–6–7 vs 7–8–9)")
        fig2 = px.histogram(
            combined_df,
            x="Total_Score",
            color="School_Type",
            barmode="group",
            text_auto=True,
            color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"},
        )
        st.plotly_chart(fig2, use_container_width=True)

    # VISUAL 3 & VISUAL 4
    col_v3, col_v4 = st.columns(2)

    with col_v3:
        st.subheader("Visual 3: 5-Axis Multi-Dimensional Competency Radar Chart")
        radar_axes = ["Reading %", "Math %", "Reasoning %", "Consistency (≥6/9) %", "Overall %"]
        gov_radar = [
            (gov_df["Reading_Score"].mean() / 3) * 100,
            (gov_df["Math_Score"].mean() / 3) * 100,
            (gov_df["Reasoning_Score"].mean() / 3) * 100,
            (gov_df["Total_Score"] >= 6).mean() * 100,
            gov_df["Percentage"].mean(),
        ]
        pvt_radar = [
            (pvt_df["Reading_Score"].mean() / 3) * 100,
            (pvt_df["Math_Score"].mean() / 3) * 100,
            (pvt_df["Reasoning_Score"].mean() / 3) * 100,
            (pvt_df["Total_Score"] >= 6).mean() * 100,
            pvt_df["Percentage"].mean(),
        ]
        fig3 = go.Figure()
        fig3.add_trace(go.Scatterpolar(r=gov_radar, theta=radar_axes, fill="toself", name="Government (75)", line_color="#10b981"))
        fig3.add_trace(go.Scatterpolar(r=pvt_radar, theta=radar_axes, fill="toself", name="Private (75)", line_color="#3b82f6"))
        fig3.update_layout(polar=dict(radialaxis=dict(visible=True, range=[0, 100])))
        st.plotly_chart(fig3, use_container_width=True)

    with col_v4:
        st.subheader("Visual 4: Jumbled Student Sequence Trajectory Plot (1 to 75)")
        traj_df = pd.DataFrame({
            "Student_Index": list(range(1, 76)) * 2,
            "Total_Score": list(gov_df["Total_Score"]) + list(pvt_df["Total_Score"]),
            "School_Type": ["Government"] * 75 + ["Private"] * 75,
        })
        fig4 = px.line(
            traj_df,
            x="Student_Index",
            y="Total_Score",
            color="School_Type",
            markers=True,
            color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"},
        )
        st.plotly_chart(fig4, use_container_width=True)

    # VISUAL 5
    st.subheader("Visual 5: Score Band Donut Charts & Class-Wise Breakdown")
    col_v5a, col_v5b = st.columns(2)
    with col_v5a:
        fig5a = px.pie(
            combined_df,
            names="Total_Score",
            facet_col="School_Type",
            hole=0.45,
            title="Score Distribution Share (Gov: 5, 6, 7 vs Pvt: 7, 8, 9)",
        )
        st.plotly_chart(fig5a, use_container_width=True)
    with col_v5b:
        cls_df = combined_df.groupby(["Class", "School_Type"], as_index=False)["Total_Score"].mean()
        fig5b = px.bar(
            cls_df.round(2),
            x="Class",
            y="Total_Score",
            color="School_Type",
            barmode="group",
            text="Total_Score",
            title="Class-Wise Mean Score Comparison (/9)",
            color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"},
        )
        st.plotly_chart(fig5b, use_container_width=True)


# =============================================================================
# MODULE 2: DEEP LEARNING NEURAL NETWORK PREDICTOR (MLP)
# =============================================================================
elif active_tab.startswith("🧠 2."):
    st.title("🧠 Deep Learning Neural Network Outcome Predictor (MLP)")
    st.markdown(
        "**Architecture:** `Input(6 Features) ➔ Dense(16, ReLU) ➔ Dense(8, ReLU) ➔ Output(3 Softmax Mastery Tiers + Expected Score)`"
    )

    col_train, col_pred = st.columns([1, 1])

    with col_train:
        st.subheader("⚙️ Neural Network Hyperparameters & Training")
        epochs = st.slider("Training Epochs", min_value=30, max_value=300, value=120, step=10)
        lr = st.select_slider("Learning Rate (α)", options=[0.01, 0.03, 0.05, 0.08, 0.1, 0.15], value=0.08)

        if st.button("🚀 Train Deep Neural Network on 150 Records", use_container_width=True):
            mlp = DeepLearningOutcomeMLP(input_dim=6, hidden1_dim=16, hidden2_dim=8, output_dim=3, seed=42)
            st.session_state.mlp_metrics = mlp.fit(combined_df, epochs=epochs, learning_rate=lr)
            st.session_state.mlp_model = mlp

        metrics = st.session_state.mlp_metrics
        m1, m2 = st.columns(2)
        m1.metric("Final Cross-Entropy Loss", f"{metrics['final_loss']:.4f}")
        m2.metric("Classification Accuracy", f"{metrics['final_accuracy']:.1f}%")

        # Plot Training Loss & Accuracy Curve
        hist_df = pd.DataFrame({
            "Epoch": list(range(1, len(metrics["loss_history"]) + 1)),
            "Loss": metrics["loss_history"],
            "Accuracy (%)": metrics["accuracy_history"],
        })
        fig_loss = px.line(hist_df, x="Epoch", y=["Loss", "Accuracy (%)"], title="Backpropagation Training Curve Across Epochs")
        st.plotly_chart(fig_loss, use_container_width=True)

    with col_pred:
        st.subheader("🎯 Live Student Learning Outcome Predictor")
        p_school = st.selectbox("School Type", ["Government", "Private"])
        p_class = st.selectbox("Student Class", ["Class 5", "Class 6", "Class 7", "Class 8"])
        p_lang = st.selectbox("Assessment Language", ["Hindi", "English"])
        p_read = st.slider("Reading & Understanding Score (/3)", 0, 3, 2)
        p_math = st.slider("Mathematics Score (/3)", 0, 3, 2)
        p_reas = st.slider("Reasoning & Problem Solving Score (/3)", 0, 3, 2)

        pred = st.session_state.mlp_model.predict_student(
            p_school, p_class, p_lang, p_read, p_math, p_reas
        )

        st.success(f"**Predicted Outcome Tier:** {pred['predicted_tier']} (Confidence: {pred['confidence_pct']}%)")
        st.info(f"**Neural Network Expected Mastery Score:** `{pred['predicted_score']} / 9`")

        prob_df = pd.DataFrame({
            "Mastery Tier": list(pred["probabilities"].keys()),
            "Probability (%)": list(pred["probabilities"].values()),
        })
        fig_prob = px.bar(
            prob_df,
            x="Mastery Tier",
            y="Probability (%)",
            color="Mastery Tier",
            text="Probability (%)",
            title="Softmax Output Layer Probabilities (%)",
        )
        st.plotly_chart(fig_prob, use_container_width=True)


# =============================================================================
# MODULE 3, 4, 5: SEPARATE 75-RECORD TABLES & COMBINED 150-RECORD DATA CENTER
# =============================================================================
elif active_tab.startswith("🏫 3."):
    st.title("🏫 Government School — 75 Separate Jumbled Records (Scores 5, 6, 7)")
    st.write(f"Showing **{len(gov_df)}** separate Government School records (`G001` to `G075`).")
    st.download_button("⬇️ Download Government 75 Records (CSV)", gov_df.to_csv(index=False).encode("utf-8"), "cep_government_75_records.csv", "text/csv")
    st.dataframe(gov_df, use_container_width=True)

elif active_tab.startswith("🎓 4."):
    st.title("🎓 Private School — 75 Separate Jumbled Records (Scores 7, 8, 9)")
    st.write(f"Showing **{len(pvt_df)}** separate Private School records (`P001` to `P075`).")
    st.download_button("⬇️ Download Private 75 Records (CSV)", pvt_df.to_csv(index=False).encode("utf-8"), "cep_private_75_records.csv", "text/csv")
    st.dataframe(pvt_df, use_container_width=True)

elif active_tab.startswith("🗂️ 5."):
    st.title("🗂️ Combined Data Center (150 Total Records = 75 Gov + 75 Pvt)")
    st.download_button("⬇️ Download Combined 150 Records (CSV)", combined_df.to_csv(index=False).encode("utf-8"), "cep_combined_150_records.csv", "text/csv")
    st.dataframe(combined_df, use_container_width=True)
