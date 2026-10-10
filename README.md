# 🧠 CEP Learning Outcomes & Deep Learning Neural Network System (Python Streamlit)

A complete **Python Streamlit + Deep Learning Neural Network (Multi-Layer Perceptron)** application for an Undergraduate **Community Engagement Project (CEP)** comparing learning outcomes between one **Government School** and one **Private School**.

---

## 📁 Project Architecture (Pure Python Streamlit)

| File Name | Description & Faculty Presentation Context |
| :--- | :--- |
| **`app.py`** | Main **Streamlit Python** web application (`streamlit run app.py`) with 5 interactive Plotly visuals, Deep Learning Neural Network live predictor, and 75+75 datasets. |
| **`neural_network.py`** | **Deep Learning Multi-Layer Perceptron (MLP)** Neural Network (`Input[6] ➔ Dense[16, ReLU] ➔ Dense[8, ReLU] ➔ Output[3, Softmax]`) with Forward Propagation, Backpropagation, and Cross-Entropy Loss. |
| **`dataset_generator.py`** | Generates **75 separate Government School records (`G001–G075`, scores 5, 6, 7 jumbled)** and **75 separate Private School records (`P001–P075`, scores 7, 8, 9 jumbled)** = **150 Total Records**. |
| **`requirements.txt`** | Python dependencies (`streamlit`, `pandas`, `numpy`, `plotly`). |
| **`README.md`** | Step-by-step guide to run on `localhost` using **Visual Studio Code (VS Code)**. |

---

## 🚀 How to Run on Localhost in Visual Studio Code (VS Code)

Follow these 4 simple steps to launch the application on your laptop (`http://localhost:8501`):

### Step 1: Open Folder in VS Code
1. Open **Visual Studio Code (VS Code)**.
2. Click **File ➔ Open Folder...** and select this project folder (containing `app.py`, `neural_network.py`, `dataset_generator.py`, and `requirements.txt`).

### Step 2: Open the Integrated Terminal in VS Code
- Press **`Ctrl + ~`** (or **`Ctrl + ` `** on Windows/Linux, **`Cmd + ~`** on Mac), OR click **Terminal ➔ New Terminal** in the top menu bar.

### Step 3: Install the Required Python Packages
Run this single command in the VS Code terminal:
```bash
pip install -r requirements.txt
```
*(Or directly: `pip install streamlit pandas numpy plotly`)*

### Step 4: Launch the Streamlit App on Localhost
Run:
```bash
streamlit run app.py
```
Your browser will automatically open at:
👉 **`http://localhost:8501`**

---

## 🧠 Deep Learning Neural Network Architecture (For Code Presentation)

When presenting `neural_network.py` to your faculty or external examiner:

1. **Input Layer (`6` Normalized Features)**:
   - `School_Type` (`0` = Government, `1` = Private)
   - `Class_Normalized` (`Class 5` to `Class 8` scaled to `[0, 1]`)
   - `Language` (`0` = सरल हिन्दी, `1` = English)
   - `Reading_Score` (`/3`), `Math_Score` (`/3`), `Reasoning_Score` (`/3`)
2. **Hidden Layer 1 (`16` Neurons, ReLU Activation)**:
   - $Z^{[1]} = X W^{[1]} + b^{[1]}$, $\quad A^{[1]} = \max(0, Z^{[1]})$
3. **Hidden Layer 2 (`8` Neurons, ReLU Activation)**:
   - $Z^{[2]} = A^{[1]} W^{[2]} + b^{[2]}$, $\quad A^{[2]} = \max(0, Z^{[2]})$
4. **Output Layer (`3` Softmax Mastery Tiers + Expected Score `/9`)**:
   - **Tier 0**: Developing Mastery (`Score 5–6 / 9`)
   - **Tier 1**: Proficient Grade-Level Mastery (`Score 7 / 9`)
   - **Tier 2**: Advanced Distinction (`Score 8–9 / 9`)
5. **Training Algorithm**:
   - Trained via **Backpropagation & Gradient Descent** minimizing **Categorical Cross-Entropy Loss + L2 Regularization** across the 150 student records.

---

## 📊 5 Interactive Dashboard Visuals Included

1. **Visual 1 (Grouped Bar Chart)**: Section-wise (`Reading /3`, `Math /3`, `Reasoning /3`) and `Total Score (/9)` mean comparison between Government (`75` records) and Private (`75` records).
2. **Visual 2 (Frequency Histogram)**: Jumbled score distribution highlighting Government (`5, 6, 7`) and Private (`7, 8, 9`) cohorts and their overlap at score `7/9`.
3. **Visual 3 (5-Axis Radar / Spider Chart)**: Multi-dimensional competency polygon across Reading %, Math %, Reasoning %, Consistency (`≥6/9`), and Overall Score %.
4. **Visual 4 (Jumbled Student Sequence Trajectory Plot)**: Student-by-student sequence plot (`1` to `75`) verifying the jumbled order of `5–6–7` (Gov) and `7–8–9` (Pvt) results.
5. **Visual 5 (Proportional Score Share Donut Charts & Class-Wise Breakdown)**: Ring charts of score proportions alongside `Class 5`, `Class 6`, `Class 7`, and `Class 8` comparisons.
