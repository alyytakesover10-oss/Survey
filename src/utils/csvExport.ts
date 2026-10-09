import { AssessmentRecord } from '../types';

export function convertRecordsToCSV(records: AssessmentRecord[]): string {
  const headers = [
    'Record_ID',
    'Student_ID',
    'School_Type',
    'Class',
    'Section',
    'Language',
    'Enumerator',
    'Reading_Q1_Id',
    'Reading_Q1_Answer',
    'Reading_Q1_Correct',
    'Reading_Q2_Id',
    'Reading_Q2_Answer',
    'Reading_Q2_Correct',
    'Reading_Q3_Id',
    'Reading_Q3_Answer',
    'Reading_Q3_Correct',
    'Math_Q1_Id',
    'Math_Q1_Answer',
    'Math_Q1_Correct',
    'Math_Q2_Id',
    'Math_Q2_Answer',
    'Math_Q2_Correct',
    'Math_Q3_Id',
    'Math_Q3_Answer',
    'Math_Q3_Correct',
    'Reasoning_Q1_Id',
    'Reasoning_Q1_Answer',
    'Reasoning_Q1_Correct',
    'Reasoning_Q2_Id',
    'Reasoning_Q2_Answer',
    'Reasoning_Q2_Correct',
    'Reasoning_Q3_Id',
    'Reasoning_Q3_Answer',
    'Reasoning_Q3_Correct',
    'Reading_Score',
    'Math_Score',
    'Reasoning_Score',
    'Total_Score',
    'Percentage',
    'Timestamp',
    'Data_Status',
    'Data_Type',
    'Last_Modified'
  ];

  const escapeCSV = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const rows = records.map(r => [
    escapeCSV(r.recordId),
    escapeCSV(r.studentId),
    escapeCSV(r.schoolType),
    escapeCSV(r.studentClass),
    escapeCSV(r.section || 'N/A'),
    escapeCSV(r.language === 'hi' ? 'Hindi' : 'English'),
    escapeCSV(r.enumerator),
    escapeCSV(r.readingQ1Id),
    escapeCSV(r.readingQ1Answer || 'Unanswered'),
    escapeCSV(r.readingQ1Correct ? '1' : '0'),
    escapeCSV(r.readingQ2Id),
    escapeCSV(r.readingQ2Answer || 'Unanswered'),
    escapeCSV(r.readingQ2Correct ? '1' : '0'),
    escapeCSV(r.readingQ3Id),
    escapeCSV(r.readingQ3Answer || 'Unanswered'),
    escapeCSV(r.readingQ3Correct ? '1' : '0'),
    escapeCSV(r.mathQ1Id),
    escapeCSV(r.mathQ1Answer || 'Unanswered'),
    escapeCSV(r.mathQ1Correct ? '1' : '0'),
    escapeCSV(r.mathQ2Id),
    escapeCSV(r.mathQ2Answer || 'Unanswered'),
    escapeCSV(r.mathQ2Correct ? '1' : '0'),
    escapeCSV(r.mathQ3Id),
    escapeCSV(r.mathQ3Answer || 'Unanswered'),
    escapeCSV(r.mathQ3Correct ? '1' : '0'),
    escapeCSV(r.reasoningQ1Id),
    escapeCSV(r.reasoningQ1Answer || 'Unanswered'),
    escapeCSV(r.reasoningQ1Correct ? '1' : '0'),
    escapeCSV(r.reasoningQ2Id),
    escapeCSV(r.reasoningQ2Answer || 'Unanswered'),
    escapeCSV(r.reasoningQ2Correct ? '1' : '0'),
    escapeCSV(r.reasoningQ3Id),
    escapeCSV(r.reasoningQ3Answer || 'Unanswered'),
    escapeCSV(r.reasoningQ3Correct ? '1' : '0'),
    escapeCSV(r.readingScore),
    escapeCSV(r.mathScore),
    escapeCSV(r.reasoningScore),
    escapeCSV(r.totalScore),
    escapeCSV(r.percentage.toFixed(1)),
    escapeCSV(r.timestamp),
    escapeCSV(r.dataStatus),
    escapeCSV(r.dataType),
    escapeCSV(r.lastModified || 'N/A')
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
