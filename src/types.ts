export type SchoolType = 'Government' | 'Private';

export type Language = 'en' | 'hi';

export type Enumerator = 'Enumerator 1' | 'Enumerator 2';

export type DataStatus = 'Complete' | 'Incomplete';

export type DataType = 'FIELD' | 'SYNTHETIC';

export type SectionType = 
  | 'Reading & Understanding'
  | 'Mathematics'
  | 'Reasoning & Problem Solving';

export type QuestionCategory = 'Reading' | 'Mathematics' | 'Reasoning';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  textEn: string;
  textHi: string;
}

export interface Question {
  id: string; // R001..R150, M001..M150, L001..L150
  section: SectionType;
  category: string;
  questionEn: string;
  questionHi: string;
  type: 'mcq';
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanationEn: string;
  explanationHi: string;
  difficulty: Difficulty;
  marks: number;
}

export interface AssessmentRecord {
  recordId: string;
  studentId: string;
  schoolType: SchoolType;
  studentClass: string;
  section: string;
  language: Language;
  enumerator: Enumerator;
  
  // Specific question mappings for direct field access
  readingQ1Id: string;
  readingQ1Answer: 'A' | 'B' | 'C' | 'D' | null;
  readingQ1Correct: boolean;
  readingQ2Id: string;
  readingQ2Answer: 'A' | 'B' | 'C' | 'D' | null;
  readingQ2Correct: boolean;
  readingQ3Id: string;
  readingQ3Answer: 'A' | 'B' | 'C' | 'D' | null;
  readingQ3Correct: boolean;

  mathQ1Id: string;
  mathQ1Answer: 'A' | 'B' | 'C' | 'D' | null;
  mathQ1Correct: boolean;
  mathQ2Id: string;
  mathQ2Answer: 'A' | 'B' | 'C' | 'D' | null;
  mathQ2Correct: boolean;
  mathQ3Id: string;
  mathQ3Answer: 'A' | 'B' | 'C' | 'D' | null;
  mathQ3Correct: boolean;

  reasoningQ1Id: string;
  reasoningQ1Answer: 'A' | 'B' | 'C' | 'D' | null;
  reasoningQ1Correct: boolean;
  reasoningQ2Id: string;
  reasoningQ2Answer: 'A' | 'B' | 'C' | 'D' | null;
  reasoningQ2Correct: boolean;
  reasoningQ3Id: string;
  reasoningQ3Answer: 'A' | 'B' | 'C' | 'D' | null;
  reasoningQ3Correct: boolean;

  readingScore: number; // 0 to 3
  mathScore: number;    // 0 to 3
  reasoningScore: number; // 0 to 3
  totalScore: number;   // 0 to 9
  percentage: number;   // 0 to 100

  timestamp: string; // YYYY-MM-DD HH:mm:ss
  dataStatus: DataStatus;
  dataType: DataType; // 'FIELD' | 'SYNTHETIC'
  
  lastModified?: string;
  editNotes?: string;
}

export interface FieldTestConfig {
  readingQuestionIds: [string, string, string];
  mathQuestionIds: [string, string, string];
  reasoningQuestionIds: [string, string, string];
  targetClass: string;
  isLocked: boolean;
  lockedAt?: string;
}

export type ActivePage = 
  | 'home'
  | 'gov_test'
  | 'pvt_test'
  | 'data_center'
  | 'comparison_dashboard'
  | 'question_bank'
  | 'demo_mode'
  | 'methodology'
  | 'streamlit_python';
