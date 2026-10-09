import { AssessmentRecord, FieldTestConfig, SchoolType } from '../types';
import { getFieldTestQuestions, getQuestionById } from '../data/questionBank';

export function generateSyntheticRecords(
  count: number,
  config: FieldTestConfig,
  currentRecordsCount: number = 0
): AssessmentRecord[] {
  const { reading, math, reasoning } = getFieldTestQuestions(config);
  const syntheticRecords: AssessmentRecord[] = [];

  const baseTime = new Date('2026-09-21T09:30:00');

  for (let i = 0; i < count; i++) {
    const isGov = i % 2 === 0;
    const schoolType: SchoolType = isGov ? 'Government' : 'Private';
    const serial = currentRecordsCount + i + 1;
    const prefix = isGov ? 'G-SYN' : 'P-SYN';
    const studentId = `${prefix}${serial.toString().padStart(3, '0')}`;
    const recordId = `REC-${isGov ? 'GOV' : 'PVT'}-SYN-${serial.toString().padStart(4, '0')}`;

    // Incremental realistic timestamp (spread over a few school hours)
    const recordDate = new Date(baseTime.getTime() + i * 4 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestamp = `${recordDate.getFullYear()}-${pad(recordDate.getMonth() + 1)}-${pad(recordDate.getDate())} ${pad(recordDate.getHours())}:${pad(recordDate.getMinutes())}:${pad(recordDate.getSeconds())}`;

    const enumerator = (i % 2 === 0 ? 'Enumerator 1' : 'Enumerator 2');
    const language = (isGov ? (i % 5 === 0 ? 'en' : 'hi') : (i % 3 === 0 ? 'hi' : 'en'));
    const section = (['A', 'B', 'C'])[i % 3];

    // Probability of answering correctly:
    // Realistic simulated baseline learning outcomes:
    // Reading accuracy ~ 65-75%, Math ~ 55-70%, Reasoning ~ 60-75%
    const pReading = isGov ? 0.62 + (Math.random() * 0.15) : 0.72 + (Math.random() * 0.15);
    const pMath = isGov ? 0.55 + (Math.random() * 0.15) : 0.68 + (Math.random() * 0.15);
    const pReasoning = isGov ? 0.64 + (Math.random() * 0.15) : 0.70 + (Math.random() * 0.15);

    const isIncomplete = i % 25 === 24; // very small realistic 4% incomplete rate

    const simulateAnswer = (questionId: string, probCorrect: number, skip: boolean) => {
      if (skip) {
        return { answer: null as ('A' | 'B' | 'C' | 'D' | null), isCorrect: false };
      }
      const q = getQuestionById(questionId);
      const isCorrect = Math.random() < probCorrect;
      if (!q) {
        return { answer: 'A' as const, isCorrect: true };
      }
      if (isCorrect) {
        return { answer: q.correctAnswer, isCorrect: true };
      } else {
        const wrongOpts = (['A', 'B', 'C', 'D'] as const).filter(o => o !== q.correctAnswer);
        const randomWrong = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
        return { answer: randomWrong, isCorrect: false };
      }
    };

    // Reading
    const r1 = simulateAnswer(reading[0].id, pReading, isIncomplete && Math.random() < 0.3);
    const r2 = simulateAnswer(reading[1].id, pReading, isIncomplete && Math.random() < 0.3);
    const r3 = simulateAnswer(reading[2].id, pReading, isIncomplete && Math.random() < 0.3);

    // Math
    const m1 = simulateAnswer(math[0].id, pMath, isIncomplete && Math.random() < 0.3);
    const m2 = simulateAnswer(math[1].id, pMath, isIncomplete && Math.random() < 0.3);
    const m3 = simulateAnswer(math[2].id, pMath, isIncomplete && Math.random() < 0.3);

    // Reasoning
    const l1 = simulateAnswer(reasoning[0].id, pReasoning, isIncomplete && Math.random() < 0.3);
    const l2 = simulateAnswer(reasoning[1].id, pReasoning, isIncomplete && Math.random() < 0.3);
    const l3 = simulateAnswer(reasoning[2].id, pReasoning, isIncomplete && Math.random() < 0.3);

    const readingScore = (r1.isCorrect ? 1 : 0) + (r2.isCorrect ? 1 : 0) + (r3.isCorrect ? 1 : 0);
    const mathScore = (m1.isCorrect ? 1 : 0) + (m2.isCorrect ? 1 : 0) + (m3.isCorrect ? 1 : 0);
    const reasoningScore = (l1.isCorrect ? 1 : 0) + (l2.isCorrect ? 1 : 0) + (l3.isCorrect ? 1 : 0);
    const totalScore = readingScore + mathScore + reasoningScore;
    const percentage = Number(((totalScore / 9) * 100).toFixed(1));

    syntheticRecords.push({
      recordId,
      studentId,
      schoolType,
      studentClass: config.targetClass || 'Class 6',
      section,
      language,
      enumerator,

      readingQ1Id: reading[0].id,
      readingQ1Answer: r1.answer,
      readingQ1Correct: r1.isCorrect,
      readingQ2Id: reading[1].id,
      readingQ2Answer: r2.answer,
      readingQ2Correct: r2.isCorrect,
      readingQ3Id: reading[2].id,
      readingQ3Answer: r3.answer,
      readingQ3Correct: r3.isCorrect,

      mathQ1Id: math[0].id,
      mathQ1Answer: m1.answer,
      mathQ1Correct: m1.isCorrect,
      mathQ2Id: math[1].id,
      mathQ2Answer: m2.answer,
      mathQ2Correct: m2.isCorrect,
      mathQ3Id: math[2].id,
      mathQ3Answer: m3.answer,
      mathQ3Correct: m3.isCorrect,

      reasoningQ1Id: reasoning[0].id,
      reasoningQ1Answer: l1.answer,
      reasoningQ1Correct: l1.isCorrect,
      reasoningQ2Id: reasoning[1].id,
      reasoningQ2Answer: l2.answer,
      reasoningQ2Correct: l2.isCorrect,
      reasoningQ3Id: reasoning[2].id,
      reasoningQ3Answer: l3.answer,
      reasoningQ3Correct: l3.isCorrect,

      readingScore,
      mathScore,
      reasoningScore,
      totalScore,
      percentage,

      timestamp,
      dataStatus: isIncomplete ? 'Incomplete' : 'Complete',
      dataType: 'SYNTHETIC'
    });
  }

  return syntheticRecords;
}
