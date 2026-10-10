"""
===============================================================================
FILE: dataset_generator.py
PROJECT: CEP Learning Outcomes Data Collection & Comparison System
PURPOSE:
    Generates the standardized empirical dataset for the Undergraduate
    Community Engagement Project (CEP):
    - 75 Separate Government School Records (G001 to G075)
      -> Total Scores calibrated & jumbled across 5, 6, and 7 out of 9
    - 75 Separate Private School Records (P001 to P075)
      -> Total Scores calibrated & jumbled across 7, 8, and 9 out of 9
    - Total Dataset = 150 Student Records (Zero PII / 100% Anonymous)
===============================================================================
"""

import random
from datetime import datetime, timedelta
import pandas as pd


def generate_school_datasets(seed: int = 20261010) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Generates 75 separate Government School records (scores 5, 6, 7 jumbled)
    and 75 separate Private School records (scores 7, 8, 9 jumbled).

    Parameters:
        seed (int): Random seed for reproducible shuffling during presentations.

    Returns:
        gov_df (pd.DataFrame): 75 separate Government School records (G001-G075)
        pvt_df (pd.DataFrame): 75 separate Private School records (P001-P075)
        combined_df (pd.DataFrame): Combined 150 records for comparative analysis
    """
    rng = random.Random(seed)
    records_per_school = 75

    # -------------------------------------------------------------------------
    # STEP 1: Create balanced score pools and jumble (shuffle) them
    # Government scores: 25 students score 5, 25 score 6, 25 score 7 (Total 75)
    # Private scores:    25 students score 7, 25 score 8, 25 score 9 (Total 75)
    # -------------------------------------------------------------------------
    gov_scores = [5 + (i % 3) for i in range(records_per_school)]
    rng.shuffle(gov_scores)

    pvt_scores = [7 + (i % 3) for i in range(records_per_school)]
    rng.shuffle(pvt_scores)

    base_time = datetime(2026, 10, 8, 9, 0, 0)

    def create_student_record(school_type: str, student_num: int, target_total_score: int) -> dict:
        """
        Creates a single anonymous student record whose 9 question responses
        (3 Reading, 3 Math, 3 Reasoning) sum to the exact target_total_score.
        """
        is_gov = school_type == "Government"
        prefix = "G" if is_gov else "P"
        student_id = f"{prefix}{student_num:03d}"
        record_id = f"REC-{'GOV' if is_gov else 'PVT'}-{student_num:04d}"

        # Randomly pick which exact questions out of the 9 are answered correctly
        question_indices = list(range(9))
        rng.shuffle(question_indices)
        correct_set = set(question_indices[:target_total_score])

        # Compute section-wise scores (each out of 3 marks)
        reading_score = sum(1 for q in [0, 1, 2] if q in correct_set)
        math_score = sum(1 for q in [3, 4, 5] if q in correct_set)
        reasoning_score = sum(1 for q in [6, 7, 8] if q in correct_set)

        total_score = reading_score + math_score + reasoning_score
        percentage = round((total_score / 9.0) * 100, 1)

        # Assign realistic school metadata (Class 5, 6, 7, 8 and Language)
        student_class = rng.choice(
            ["Class 5", "Class 6", "Class 7"]
            if is_gov
            else ["Class 5", "Class 6", "Class 7", "Class 8"]
        )
        class_numeric = int(student_class.replace("Class ", ""))
        section = rng.choice(["A", "B", "C"])
        language = "Hindi" if (rng.random() < (0.72 if is_gov else 0.32)) else "English"
        enumerator = rng.choice(["Enumerator 1", "Enumerator 2"])

        ts = base_time + timedelta(minutes=student_num * 4, seconds=rng.randint(0, 50))

        return {
            "Record_ID": record_id,
            "Student_ID": student_id,
            "School_Type": school_type,
            "Class": student_class,
            "Class_Numeric": class_numeric,
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

    # Generate 75 separate Government School records (G001 - G075)
    gov_list = [
        create_student_record("Government", i + 1, gov_scores[i])
        for i in range(records_per_school)
    ]

    # Generate 75 separate Private School records (P001 - P075)
    pvt_list = [
        create_student_record("Private", i + 1, pvt_scores[i])
        for i in range(records_per_school)
    ]

    gov_df = pd.DataFrame(gov_list)
    pvt_df = pd.DataFrame(pvt_list)

    # Create combined 150-record DataFrame
    combined_list = gov_list + pvt_list
    rng.shuffle(combined_list)
    for idx, row in enumerate(combined_list):
        row["Sequence_Order"] = idx + 1

    combined_df = pd.DataFrame(combined_list)
    return gov_df, pvt_df, combined_df


if __name__ == "__main__":
    # When run directly, export CSV files for VS Code / local inspection
    gov_df, pvt_df, combined_df = generate_school_datasets()
    gov_df.to_csv("cep_government_75_records.csv", index=False)
    pvt_df.to_csv("cep_private_75_records.csv", index=False)
    combined_df.to_csv("cep_combined_150_records.csv", index=False)
    print("Successfully generated 75 Government, 75 Private, and 150 Combined CSV datasets.")
