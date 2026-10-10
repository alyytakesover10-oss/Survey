"""
===============================================================================
FILE: neural_network.py
PROJECT: CEP Learning Outcomes Data Collection & Comparison System
PURPOSE:
    Deep Learning Multi-Layer Perceptron (MLP) Neural Network for predicting
    Student Learning Outcomes and Mastery Tiers from foundational assessment
    features.

ARCHITECTURE:
    - Input Layer (6 Features):
        1. School_Type_Encoded (0 = Government, 1 = Private)
        2. Class_Normalized    (Class 5..8 scaled to 0..1)
        3. Language_Encoded    (0 = Hindi, 1 = English)
        4. Reading_Score_Norm  (Reading Score / 3.0)
        5. Math_Score_Norm     (Math Score / 3.0)
        6. Reasoning_Score_Norm(Reasoning Score / 3.0)

    - Hidden Layer 1: 16 Neurons with ReLU Activation
        Z1 = X @ W1 + b1
        A1 = ReLU(Z1) = max(0, Z1)

    - Hidden Layer 2: 8 Neurons with ReLU Activation
        Z2 = A1 @ W2 + b2
        A2 = ReLU(Z2) = max(0, Z2)

    - Output Layer:
        * Classification Head (3 Mastery Tiers via Softmax Activation):
            Tier 0: Developing Mastery (Score 5-6 / 9)
            Tier 1: Proficient Mastery (Score 7 / 9)
            Tier 2: Advanced Distinction (Score 8-9 / 9)
        * Expected Score Prediction: Weighted expectation mapped to 0..9 scale
===============================================================================
"""

import numpy as np
import pandas as pd


class DeepLearningOutcomeMLP:
    """
    A 3-Layer Deep Neural Network (Multi-Layer Perceptron) implemented with
    NumPy for transparent academic presentation of Forward Propagation,
    ReLU & Softmax Activations, Cross-Entropy Loss, and Backpropagation.
    """

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

        self.loss_history: list[float] = []
        self.accuracy_history: list[float] = []

    # -------------------------------------------------------------------------
    # ACTIVATION FUNCTIONS
    # -------------------------------------------------------------------------
    @staticmethod
    def relu(z: np.ndarray) -> np.ndarray:
        """Rectified Linear Unit: f(z) = max(0, z)"""
        return np.maximum(0.0, z)

    @staticmethod
    def relu_derivative(z: np.ndarray) -> np.ndarray:
        """Derivative of ReLU for Backpropagation: f'(z) = 1 if z > 0 else 0"""
        return (z > 0).astype(float)

    @staticmethod
    def softmax(z: np.ndarray) -> np.ndarray:
        """Softmax activation converting logits into probability distribution."""
        shifted = z - np.max(z, axis=1, keepdims=True)
        exp_z = np.exp(shifted)
        return exp_z / np.sum(exp_z, axis=1, keepdims=True)

    # -------------------------------------------------------------------------
    # FEATURE PREPROCESSING
    # -------------------------------------------------------------------------
    @staticmethod
    def prepare_features(df: pd.DataFrame) -> tuple[np.ndarray, np.ndarray]:
        """
        Converts student dataset columns into normalized numerical feature matrix X
        and target class labels y (0 = Score 5-6, 1 = Score 7, 2 = Score 8-9).
        """
        school_enc = (df["School_Type"] == "Private").astype(float).values
        class_num = df["Class"].str.replace("Class ", "", regex=False).astype(float).values
        class_norm = (class_num - 5.0) / 3.0
        lang_enc = (df["Language"].isin(["English", "en"])).astype(float).values

        read_norm = df["Reading_Score"].astype(float).values / 3.0
        math_norm = df["Math_Score"].astype(float).values / 3.0
        reas_norm = df["Reasoning_Score"].astype(float).values / 3.0

        X = np.column_stack([school_enc, class_norm, lang_enc, read_norm, math_norm, reas_norm])

        # Target classes based on Total_Score:
        # Class 0: Score 5 or 6 (Developing Band)
        # Class 1: Score 7      (Proficient Band)
        # Class 2: Score 8 or 9 (Advanced Band)
        scores = df["Total_Score"].astype(int).values
        y = np.where(scores <= 6, 0, np.where(scores == 7, 1, 2))
        return X, y

    # -------------------------------------------------------------------------
    # FORWARD PROPAGATION
    # -------------------------------------------------------------------------
    def forward(self, X: np.ndarray) -> dict[str, np.ndarray]:
        """
        Executes a forward pass through the 2 hidden layers and output layer.
        """
        Z1 = X @ self.W1 + self.b1
        A1 = self.relu(Z1)

        Z2 = A1 @ self.W2 + self.b2
        A2 = self.relu(Z2)

        Z3 = A2 @ self.W3 + self.b3
        probs = self.softmax(Z3)

        return {"Z1": Z1, "A1": A1, "Z2": Z2, "A2": A2, "Z3": Z3, "probs": probs}

    # -------------------------------------------------------------------------
    # BACKPROPAGATION & TRAINING LOOP
    # -------------------------------------------------------------------------
    def fit(self, df: pd.DataFrame, epochs: int = 120, learning_rate: float = 0.08) -> dict:
        """
        Trains the Deep Neural Network using Backpropagation and Gradient Descent
        on the 150-student CEP dataset.
        """
        X, y = self.prepare_features(df)
        n_samples = X.shape[0]
        y_onehot = np.eye(self.output_dim)[y]

        self.loss_history = []
        self.accuracy_history = []

        for _ in range(epochs):
            # 1. Forward Pass
            cache = self.forward(X)
            probs = cache["probs"]

            # 2. Categorical Cross-Entropy Loss + L2 Regularization
            eps = 1e-9
            ce_loss = -np.mean(np.sum(y_onehot * np.log(probs + eps), axis=1))
            l2_reg = 0.001 * (np.sum(self.W1 ** 2) + np.sum(self.W2 ** 2) + np.sum(self.W3 ** 2))
            loss = float(ce_loss + l2_reg)
            self.loss_history.append(round(loss, 4))

            # 3. Training Accuracy
            preds = np.argmax(probs, axis=1)
            acc = float(np.mean(preds == y) * 100.0)
            self.accuracy_history.append(round(acc, 2))

            # 4. Backpropagation Gradients
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

            # 5. Parameter Update Step
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

    # -------------------------------------------------------------------------
    # SINGLE STUDENT PREDICTION FOR LIVE DEMONSTRATION
    # -------------------------------------------------------------------------
    def predict_student(
        self,
        school_type: str,
        student_class: str,
        language: str,
        reading_score: int,
        math_score: int,
        reasoning_score: int,
    ) -> dict:
        """
        Runs a forward pass for a single student profile and returns predicted
        mastery probabilities, expected score (/9), and hidden layer activations.
        """
        school_enc = 1.0 if school_type == "Private" else 0.0
        class_num = float(student_class.replace("Class ", ""))
        class_norm = (class_num - 5.0) / 3.0
        lang_enc = 1.0 if language in ("English", "en") else 0.0

        x = np.array([[
            school_enc,
            class_norm,
            lang_enc,
            reading_score / 3.0,
            math_score / 3.0,
            reasoning_score / 3.0,
        ]])

        cache = self.forward(x)
        probs = cache["probs"][0]

        tier_names = [
            "Developing Mastery Band (5–6 / 9)",
            "Proficient Grade-Level Band (7 / 9)",
            "Advanced Distinction Band (8–9 / 9)",
        ]
        pred_idx = int(np.argmax(probs))

        # Expected score weighted by neural network probabilities & input sub-scores
        raw_sum = reading_score + math_score + reasoning_score
        nn_expected = float(probs[0] * 5.5 + probs[1] * 7.0 + probs[2] * 8.5)
        blended_score = round(0.65 * raw_sum + 0.35 * nn_expected, 2)

        return {
            "predicted_tier": tier_names[pred_idx],
            "confidence_pct": round(float(probs[pred_idx] * 100.0), 1),
            "probabilities": {
                "Developing (5-6)": round(float(probs[0] * 100.0), 1),
                "Proficient (7)": round(float(probs[1] * 100.0), 1),
                "Advanced (8-9)": round(float(probs[2] * 100.0), 1),
            },
            "predicted_score": blended_score,
            "hidden_layer_1_mean_activation": round(float(np.mean(cache["A1"])), 3),
            "hidden_layer_2_mean_activation": round(float(np.mean(cache["A2"])), 3),
        }
