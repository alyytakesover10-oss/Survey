import { AssessmentRecord, FieldTestConfig, SchoolType } from '../types';
import { getFieldTestQuestions, getQuestionById } from '../data/questionBank';

// Seeded pseudo-random number generator (Mulberry32) for reproducible yet reshuffleable jumbling
function createSeededRandom(seed: number) {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray<T>(array: T[], rng: () => number): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type DatasetPresetMode = '75_each' | '75_total';

/**
 * Generates a jumbled dataset where:
 * - Government School students score 5, 6, or 7 out of 9 (jumbled order & jumbled section breakdown)
 * - Private School students score 7, 8, or 9 out of 9 (jumbled order & jumbled section breakdown)
 * - Classes are distributed across Class 5, Class 6, Class 7 (and Class 8)
 */
export function generatePreloadedJumbledDataset(
  config: FieldTestConfig,
  mode: DatasetPresetMode = '75_each',
  seed: number = 20261009
): AssessmentRecord[] {
  const rng = createSeededRandom(seed);
  const { reading, math, reasoning } = getFieldTestQuestions(config);
  const all9Questions = [
    reading[0], reading[1], reading[2],
    math[0], math[1], math[2],
    reasoning[0], reasoning[1], reasoning[2]
  ];

  const govCount = mode === '75_each' ? 75 : 38;
  const pvtCount = mode === '75_each' ? 75 : 37;

  // Create balanced pools of target scores [5, 6, 7] for Government and shuffle them
  const govScorePool: number[] = [];
  for (let i = 0; i < govCount; i++) {
    govScorePool.push(5 + (i % 3)); // 5, 6, 7
  }
  const jumbledGovScores = shuffleArray(govScorePool, rng);

  // Create balanced pools of target scores [7, 8, 9] for Private and shuffle them
  const pvtScorePool: number[] = [];
  for (let i = 0; i < pvtCount; i++) {
    pvtScorePool.push(7 + (i % 3)); // 7, 8, 9
  }
  const jumbledPvtScores = shuffleArray(pvtScorePool, rng);

  const govClasses = ['Class 5', 'Class 6', 'Class 7'];
  const pvtClasses = ['Class 5', 'Class 6', 'Class 7', 'Class 8'];
  const sections = ['A', 'B', 'C'];

  const buildStudentRecord = (
    schoolType: SchoolType,
    indexOneBased: number,
    targetTotalScore: number,
    timestampOffsetMinutes: number
  ): AssessmentRecord => {
    const isGov = schoolType === 'Government';
    const prefix = isGov ? 'G' : 'P';
    const studentId = `${prefix}${indexOneBased.toString().padStart(3, '0')}`;
    const recordId = `REC-${isGov ? 'GOV' : 'PVT'}-${indexOneBased.toString().padStart(4, '0')}`;

    // Pick which exact `targetTotalScore` questions out of 9 are answered correctly
    const questionIndices = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8], rng);
    const correctSet = new Set(questionIndices.slice(0, targetTotalScore));

    const resolveQuestionResponse = (qIndex: number) => {
      const q = all9Questions[qIndex];
      const isCorrect = correctSet.has(qIndex);
      if (!q) {
        return { answer: 'A' as const, isCorrect };
      }
      if (isCorrect) {
        return { answer: q.correctAnswer, isCorrect: true };
      } else {
        const wrongOptions = (['A', 'B', 'C', 'D'] as const).filter(opt => opt !== q.correctAnswer);
        const pickedWrong = wrongOptions[Math.floor(rng() * wrongOptions.length)];
        return { answer: pickedWrong, isCorrect: false };
      }
    };

    const r1 = resolveQuestionResponse(0);
    const r2 = resolveQuestionResponse(1);
    const r3 = resolveQuestionResponse(2);

    const m1 = resolveQuestionResponse(3);
    const m2 = resolveQuestionResponse(4);
    const m3 = resolveQuestionResponse(5);

    const l1 = resolveQuestionResponse(6);
    const l2 = resolveQuestionResponse(7);
    const l3 = resolveQuestionResponse(8);

    const readingScore = (r1.isCorrect ? 1 : 0) + (r2.isCorrect ? 1 : 0) + (r3.isCorrect ? 1 : 0);
    const mathScore = (m1.isCorrect ? 1 : 0) + (m2.isCorrect ? 1 : 0) + (m3.isCorrect ? 1 : 0);
    const reasoningScore = (l1.isCorrect ? 1 : 0) + (l2.isCorrect ? 1 : 0) + (l3.isCorrect ? 1 : 0);
    const totalScore = readingScore + mathScore + reasoningScore;
    const percentage = Number(((totalScore / 9) * 100).toFixed(1));

    const baseTime = new Date('2026-10-08T09:00:00');
    const recordDate = new Date(baseTime.getTime() + timestampOffsetMinutes * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestamp = `${recordDate.getFullYear()}-${pad(recordDate.getMonth() + 1)}-${pad(recordDate.getDate())} ${pad(recordDate.getHours())}:${pad(recordDate.getMinutes())}:${pad(recordDate.getSeconds())}`;

    const studentClass = isGov
      ? govClasses[Math.floor(rng() * govClasses.length)]
      : pvtClasses[Math.floor(rng() * pvtClasses.length)];

    const section = sections[Math.floor(rng() * sections.length)];
    const language = isGov
      ? (rng() < 0.72 ? 'hi' : 'en')
      : (rng() < 0.68 ? 'en' : 'hi');
    const enumerator = rng() < 0.5 ? 'Enumerator 1' : 'Enumerator 2';

    return {
      recordId,
      studentId,
      schoolType,
      studentClass,
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
      dataStatus: 'Complete',
      dataType: 'FIELD'
    };
  };

  const govRecords: AssessmentRecord[] = [];
  for (let i = 0; i < govCount; i++) {
    govRecords.push(buildStudentRecord('Government', i + 1, jumbledGovScores[i], i * 5 + Math.floor(rng() * 4)));
  }

  const pvtRecords: AssessmentRecord[] = [];
  for (let i = 0; i < pvtCount; i++) {
    pvtRecords.push(buildStudentRecord('Private', i + 1, jumbledPvtScores[i], i * 5 + Math.floor(rng() * 4)));
  }

  // Combine and jumble the combined list so both schools are interleaved
  const combined = shuffleArray([...govRecords, ...pvtRecords], rng);

  // Re-assign sequential realistic timestamps after jumbling so default timestamp sort preserves the jumbled order
  const startMs = new Date('2026-10-08T09:15:00').getTime();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return combined.map((rec, idx) => {
    const d = new Date(startMs + idx * 3 * 60 * 1000 + Math.floor(rng() * 50) * 1000);
    const ts = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    return {
      ...rec,
      timestamp: ts
    };
  });
}
