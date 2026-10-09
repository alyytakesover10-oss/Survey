"""
CEP Learning Outcomes Data Collection & Comparison System (Streamlit Python Edition)
Undergraduate Community Engagement Project (CEP)
Includes:
- Government School Test & Jumbled Dataset (Scores 5, 6, 7 out of 9 | 75 Records)
- Private School Test & Jumbled Dataset (Scores 7, 8, 9 out of 9 | 75 Records)
- Combined Dataset (75 Per School = 150 Records OR 75 Total Combined toggle)
- Comparison Dashboard with 5 Interactive Working Visuals (Plotly + Streamlit)
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
# 1. LOCKED 9-QUESTION BILINGUAL FIELD ASSESSMENT BATTERY
# ---------------------------------------------------------------------------
FIELD_QUESTIONS = [
    # Section 1: Reading & Understanding (3 Marks)
    {
        "id": "R001",
        "section": "Reading & Understanding",
        "question_en": "Ramesh goes to the village library every Sunday to read storybooks. When does Ramesh visit the library?",
        "question_hi": "रमेश हर रविवार को कहानी की किताबें पढ़ने गाँव के पुस्तकालय जाता है। रमेश पुस्तकालय कब जाता है?",
        "options_en": {"A": "Monday", "B": "Sunday", "C": "Friday", "D": "Saturday"},
        "options_hi": {"A": "सोमवार", "B": "रविवार", "C": "शुक्रवार", "D": "शनिवार"},
        "correct": "B",
    },
    {
        "id": "R002",
        "section": "Reading & Understanding",
        "question_en": "Trees give us shade, fruits, and clean air. We should plant more trees. What is the main message?",
        "question_hi": "पेड़ हमें छाया, फल और साफ हवा देते हैं। हमें और पेड़ लगाने चाहिए। इस बात का मुख्य संदेश क्या है?",
        "options_en": {"A": "Cut trees", "B": "Trees are harmful", "C": "Trees are useful and we should plant them", "D": "Only grow flowers"},
        "options_hi": {"A": "पेड़ काटो", "B": "पेड़ नुकसानदायक हैं", "C": "पेड़ उपयोगी हैं और हमें उन्हें लगाना चाहिए", "D": "केवल फूल उगाओ"},
        "correct": "C",
    },
    {
        "id": "R003",
        "section": "Reading & Understanding",
        "question_en": "Meena shared her lunch with her friend who forgot to bring food. Which word best describes Meena?",
        "question_hi": "मीना ने अपना खाना अपनी सहेली के साथ बाँटा जो टिफिन लाना भूल गई थी। मीना का स्वभाव कैसा है?",
        "options_en": {"A": "Selfish", "B": "Angry", "C": "Kind and helpful", "D": "Careless"},
        "options_hi": {"A": "स्वार्थी", "B": "गुस्सैल", "C": "दयालु और मददगार", "D": "लापरवाह"},
        "correct": "C",
    },
    # Section 2: Mathematics (3 Marks)
    {
        "id": "M001",
        "section": "Mathematics",
        "question_en": "A notebook costs ₹15. How much will 4 notebooks cost?",
        "question_hi": "एक कॉपी की कीमत ₹15 है। ऐसी 4 कॉपियों की कुल कीमत कितनी होगी?",
        "options_en": {"A": "₹45", "B": "₹50", "C": "₹60", "D": "₹75"},
        "options_hi": {"A": "₹45", "B": "₹50", "C": "₹60", "D": "₹75"},
        "correct": "C",
    },
    {
        "id": "M002",
        "section": "Mathematics",
        "question_en": "In a class of 40 students, half of the students are girls. How many girls are in the class?",
        "question_hi": "40 बच्चों की एक कक्षा में आधे बच्चे लड़कियाँ हैं। कक्षा में कुल कितनी लड़कियाँ हैं?",
        "options_en": {"A": "10", "B": "15", "C": "20", "D": "25"},
        "options_hi": {"A": "10", "B": "15", "C": "20", "D": "25"},
        "correct": "C",
    },
    {
        "id": "M003",
        "section": "Mathematics",
        "question_en": "What is 125 + 75?",
        "question_hi": "125 + 75 कितना होता है?",
        "options_en": {"A": "190", "B": "200", "C": "205", "D": "210"},
        "options_hi": {"A": "190", "B": "200", "C": "205", "D": "210"},
        "correct": "B",
    },
    # Section 3: Reasoning & Problem Solving (3 Marks)
    {
        "id": "L001",
        "section": "Reasoning & Problem Solving",
        "question_en": "Find the next number in the pattern: 2, 4, 6, 8, ___",
        "question_hi": "इस क्रम में अगला नंबर कौन-सा आएगा? 2, 4, 6, 8, ___",
        "options_en": {"A": "9", "B": "10", "C": "11", "D": "12"},
        "options_hi": {"A": "9", "B": "10", "C": "11", "D": "12"},
        "correct": "B",
    },
    {
        "id": "L002",
        "section": "Reasoning & Problem Solving",
        "question_en": "Which one is different from the other three? Apple, Mango, Banana, Chair",
        "question_hi": "इन चारों में से कौन-सा बाकी तीन से अलग है? सेब, आम, केला, कुर्सी",
        "options_en": {"A": "Apple", "B": "Mango", "C": "Banana", "D": "Chair"},
        "options_hi": {"A": "सेब", "B": "आम", "C": "केला", "D": "कुर्सी"},
        "correct": "D",
    },
    {
        "id": "L003",
        "section": "Reasoning & Problem Solving",
        "question_en": "If today is Tuesday, what day will it be tomorrow?",
        "question_hi": "अगर आज मंगलवार है, तो कल कौन-सा दिन होगा?",
        "options_en": {"A": "Monday", "B": "Wednesday", "C": "Thursday", "D": "Friday"},
        "options_hi": {"A": "सोमवार", "B": "बुधवार", "C": "गुरुवार", "D": "शुक्रवार"},
        "correct": "B",
    },
]


# ---------------------------------------------------------------------------
# 2. JUMBLED DATASET GENERATOR (GOV: 5-6-7 | PVT: 7-8-9)
# ---------------------------------------------------------------------------
def generate_jumbled_dataset(mode: str = "75_each", seed: int = 20261009) -> pd.DataFrame:
    rng = random.Random(seed)
    gov_count = 75 if mode == "75_each" else 38
    pvt_count = 75 if mode == "75_each" else 37

    # Balanced jumbled scores: Government [5, 6, 7], Private [7, 8, 9]
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

        # Jumble which exact questions out of 9 are answered correctly
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

    # Jumble combined dataset order
    rng.shuffle(rows)
    for idx, r in enumerate(rows):
        ts = base_time + timedelta(minutes=idx * 3, seconds=rng.randint(0, 50))
        r["Timestamp"] = ts.strftime("%Y-%m-%d %H:%M:%S")
        r["Sequence_Order"] = idx + 1

    return pd.DataFrame(rows)


# Initialize session state
if "dataset_mode" not in st.session_state:
    st.session_state.dataset_mode = "75_each"
if "seed" not in st.session_state:
    st.session_state.seed = 20261009
if "df" not in st.session_state:
    st.session_state.df = generate_jumbled_dataset(st.session_state.dataset_mode, st.session_state.seed)


# ---------------------------------------------------------------------------
# 3. SIDEBAR NAVIGATION & DATASET CONTROLS
# ---------------------------------------------------------------------------
st.sidebar.title("📊 CEP Learning Outcomes")
st.sidebar.caption("Government (5–6–7) vs Private (7–8–9) Jumbled Assessment System")

page = st.sidebar.radio(
    "Navigation",
    [
        "📈 Comparison Dashboard (5 Visuals)",
        "🏫 Government School Test (5-6-7)",
        "🎓 Private School Test (7-8-9)",
        "🗂️ Combined Data Center",
    ],
)

st.sidebar.markdown("---")
st.sidebar.subheader("🔀 Dataset & Jumble Controls")

mode_label = st.sidebar.selectbox(
    "Dataset Size Preset",
    [
        "75 Each School (75 Gov + 75 Pvt = 150)",
        "75 Total Combined (38 Gov + 37 Pvt = 75)",
    ],
)
selected_mode = "75_each" if "150" in mode_label else "75_total"

if selected_mode != st.session_state.dataset_mode:
    st.session_state.dataset_mode = selected_mode
    st.session_state.df = generate_jumbled_dataset(selected_mode, st.session_state.seed)

if st.sidebar.button("🎲 Re-Jumble 5-6-7 & 7-8-9 Results", use_container_width=True):
    st.session_state.seed += 7
    st.session_state.df = generate_jumbled_dataset(st.session_state.dataset_mode, st.session_state.seed)
    st.sidebar.success("Results re-jumbled!")

df = st.session_state.df
gov_df = df[df["School_Type"] == "Government"]
pvt_df = df[df["School_Type"] == "Private"]


# ---------------------------------------------------------------------------
# PAGE 1: COMPARISON DASHBOARD WITH 5 WORKING VISUALS
# ---------------------------------------------------------------------------
if page == "📈 Comparison Dashboard (5 Visuals)":
    st.title("📊 CEP Learning Outcomes Comparison Dashboard")
    st.markdown(
        f"**Active Dataset:** `{len(df)}` Total Jumbled Records — "
        f"**Government School:** `{len(gov_df)}` records (Scores 5, 6, 7 jumbled) | "
        f"**Private School:** `{len(pvt_df)}` records (Scores 7, 8, 9 jumbled)"
    )

    # Top KPI Metrics
    col1, col2, col3, col4 = st.columns(4)
    gov_mean = round(gov_df["Total_Score"].mean(), 2) if len(gov_df) else 0
    pvt_mean = round(pvt_df["Total_Score"].mean(), 2) if len(pvt_df) else 0
    gov_pct = round(gov_df["Percentage"].mean(), 1) if len(gov_df) else 0
    pvt_pct = round(pvt_df["Percentage"].mean(), 1) if len(pvt_df) else 0

    col1.metric("Government Mean Score (5–6–7)", f"{gov_mean} / 9", f"{gov_pct}%")
    col2.metric("Private Mean Score (7–8–9)", f"{pvt_mean} / 9", f"{pvt_pct}%")
    col3.metric("Difference in Sample Average", f"+{round(pvt_mean - gov_mean, 2)} / 9", f"+{round(pvt_pct - gov_pct, 1)}%")
    col4.metric("Total Sample Size (N)", f"{len(df)} Students", f"{len(gov_df)} Gov / {len(pvt_df)} Pvt")

    st.markdown("---")

    # Row 1: Visual 1 & Visual 2
    r1c1, r1c2 = st.columns(2)

    with r1c1:
        st.subheader("1️⃣ Visual 1: Section-Wise & Overall Mean Score (Grouped Bar)")
        sec_df = pd.DataFrame(
            {
                "Metric": ["Reading (/3)", "Math (/3)", "Reasoning (/3)", "Total Score (/9)"],
                "Government": [
                    gov_df["Reading_Score"].mean(),
                    gov_df["Math_Score"].mean(),
                    gov_df["Reasoning_Score"].mean(),
                    gov_df["Total_Score"].mean(),
                ],
                "Private": [
                    pvt_df["Reading_Score"].mean(),
                    pvt_df["Math_Score"].mean(),
                    pvt_df["Reasoning_Score"].mean(),
                    pvt_df["Total_Score"].mean(),
                ],
            }
        ).melt(id_vars="Metric", var_name="School_Type", value_name="Average_Score")
        sec_df["Average_Score"] = sec_df["Average_Score"].round(2)

        fig1 = px.bar(
            sec_df,
            x="Metric",
            y="Average_Score",
            color="School_Type",
            barmode="group",
            text="Average_Score",
            color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"},
        )
        st.plotly_chart(fig1, use_container_width=True)

    with r1c2:
        st.subheader("2️⃣ Visual 2: Jumbled Score Distribution Histogram (5–6–7 vs 7–8–9)")
        fig2 = px.histogram(
            df,
            x="Total_Score",
            color="School_Type",
            barmode="group",
            nbins=10,
            text_auto=True,
            color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"},
        )
        st.plotly_chart(fig2, use_container_width=True)

    # Row 2: Visual 3 & Visual 4
    r2c1, r2c2 = st.columns(2)

    with r2c1:
        st.subheader("3️⃣ Visual 3: 5-Axis Competency Radar Chart")
        categories = ["Reading %", "Math %", "Reasoning %", "Consistency (≥6/9) %", "Overall %"]
        gov_vals = [
            (gov_df["Reading_Score"].mean() / 3) * 100,
            (gov_df["Math_Score"].mean() / 3) * 100,
            (gov_df["Reasoning_Score"].mean() / 3) * 100,
            (gov_df["Total_Score"] >= 6).mean() * 100,
            gov_df["Percentage"].mean(),
        ]
        pvt_vals = [
            (pvt_df["Reading_Score"].mean() / 3) * 100,
            (pvt_df["Math_Score"].mean() / 3) * 100,
            (pvt_df["Reasoning_Score"].mean() / 3) * 100,
            (pvt_df["Total_Score"] >= 6).mean() * 100,
            pvt_df["Percentage"].mean(),
        ]
        fig3 = go.Figure()
        fig3.add_trace(go.Scatterpolar(r=gov_vals, theta=categories, fill="toself", name="Government", line_color="#10b981"))
        fig3.add_trace(go.Scatterpolar(r=pvt_vals, theta=categories, fill="toself", name="Private", line_color="#3b82f6"))
        fig3.update_layout(polar=dict(radialaxis=dict(visible=True, range=[0, 100])))
        st.plotly_chart(fig3, use_container_width=True)

    with r2c2:
        st.subheader("4️⃣ Visual 4: Jumbled Student Sequence Trajectory Plot")
        fig4 = px.line(
            df,
            x="Sequence_Order",
            y="Total_Score",
            color="School_Type",
            markers=True,
            hover_data=["Student_ID", "Class", "Percentage"],
            color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"},
        )
        st.plotly_chart(fig4, use_container_width=True)

    # Row 3: Visual 5
    st.subheader("5️⃣ Visual 5: Class-Wise & Score-Band Box / Violin & Donut Breakdown")
    r3c1, r3c2 = st.columns(2)
    with r3c1:
        fig5a = px.pie(
            df,
            names="Total_Score",
            facet_col="School_Type",
            hole=0.45,
            title="Proportional Score Share by School (5, 6, 7 vs 7, 8, 9)",
        )
        st.plotly_chart(fig5a, use_container_width=True)
    with r3c2:
        class_grp = df.groupby(["Class", "School_Type"], as_index=False)["Total_Score"].mean()
        fig5b = px.bar(
            class_grp,
            x="Class",
            y="Total_Score",
            color="School_Type",
            barmode="group",
            title="Class-Wise Mean Score Comparison (/9)",
            color_discrete_map={"Government": "#10b981", "Private": "#3b82f6"},
        )
        st.plotly_chart(fig5b, use_container_width=True)


# ---------------------------------------------------------------------------
# PAGE 2 & 3: GOVERNMENT & PRIVATE SCHOOL TEST + JUMBLED RECORDS
# ---------------------------------------------------------------------------
elif page in ["🏫 Government School Test (5-6-7)", "🎓 Private School Test (7-8-9)"]:
    is_gov = "Government" in page
    school_label = "Government" if is_gov else "Private"
    sub_df = gov_df if is_gov else pvt_df

    st.title(f"{'🏫 Government' if is_gov else '🎓 Private'} School Assessment & Jumbled Dataset")
    st.info(
        f"Showing **{len(sub_df)} {school_label} School** jumbled records "
        f"(Scores calibrated to **{'5, 6, 7' if is_gov else '7, 8, 9'} out of 9**). "
        "You can also administer a new test below."
    )

    st.subheader(f"📋 Preloaded {school_label} School Jumbled Results ({len(sub_df)} Students)")
    st.dataframe(sub_df, use_container_width=True)

    st.markdown("---")
    st.subheader(f"📝 Administer New {school_label} School Test (9 Locked Questions)")
    lang = st.radio("Language / भाषा", ["🇮🇳 सरल हिन्दी", "🇬🇧 English"], horizontal=True)
    use_hi = "हिन्दी" in lang

    with st.form(f"test_form_{school_label}"):
        c1, c2, c3 = st.columns(3)
        next_id = f"{'G' if is_gov else 'P'}{len(sub_df) + 1:03d}"
        s_id = c1.text_input("Anonymous Student ID", value=next_id)
        s_cls = c2.selectbox("Class", ["Class 5", "Class 6", "Class 7", "Class 8"])
        s_sec = c3.selectbox("Section", ["A", "B", "C"])

        responses = {}
        for idx, q in enumerate(FIELD_QUESTIONS):
            st.markdown(f"**Q{idx + 1} ({q['section']}):** {q['question_hi'] if use_hi else q['question_en']}")
            opts = q["options_hi"] if use_hi else q["options_en"]
            responses[idx] = st.radio(
                f"Select answer for Q{idx + 1}",
                options=["A", "B", "C", "D"],
                format_func=lambda k, o=opts: f"{k}: {o[k]}",
                key=f"q_{school_label}_{idx}",
                horizontal=True,
            )

        submitted = st.form_submit_button("Submit Student Assessment")
        if submitted:
            r_score = sum(1 for i in [0, 1, 2] if responses[i] == FIELD_QUESTIONS[i]["correct"])
            m_score = sum(1 for i in [3, 4, 5] if responses[i] == FIELD_QUESTIONS[i]["correct"])
            l_score = sum(1 for i in [6, 7, 8] if responses[i] == FIELD_QUESTIONS[i]["correct"])
            tot = r_score + m_score + l_score
            pct = round((tot / 9.0) * 100, 1)
            new_row = {
                "Record_ID": f"REC-{'GOV' if is_gov else 'PVT'}-{len(df) + 1:04d}",
                "Student_ID": s_id,
                "School_Type": school_label,
                "Class": s_cls,
                "Section": s_sec,
                "Language": "hi" if use_hi else "en",
                "Enumerator": "Enumerator 1",
                "Reading_Score": r_score,
                "Math_Score": m_score,
                "Reasoning_Score": l_score,
                "Total_Score": tot,
                "Percentage": pct,
                "Data_Status": "Complete",
                "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "Sequence_Order": len(df) + 1,
            }
            st.session_state.df = pd.concat([st.session_state.df, pd.DataFrame([new_row])], ignore_index=True)
            st.success(f"Saved {s_id}! Total Score: {tot}/9 ({pct}%)")


# ---------------------------------------------------------------------------
# PAGE 4: COMBINED DATA CENTER & CSV EXPORT
# ---------------------------------------------------------------------------
elif page == "🗂️ Combined Data Center":
    st.title("🗂️ Combined Jumbled Dataset (Government 5–6–7 & Private 7–8–9)")
    st.write(f"Total Records: **{len(df)}** ({len(gov_df)} Government | {len(pvt_df)} Private)")

    csv_bytes = df.to_csv(index=False).encode("utf-8")
    st.download_button(
        "⬇️ Download Complete Jumbled Dataset (CSV)",
        data=csv_bytes,
        file_name="cep_learning_outcomes_jumbled_dataset.csv",
        mime="text/csv",
    )
    st.dataframe(df, use_container_width=True)
