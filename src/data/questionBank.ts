import { Question, FieldTestConfig, SectionType } from '../types';
import { allReadingQuestions } from './readingQuestions';
import { allMathQuestions } from './mathQuestions';
import { allReasoningQuestions } from './reasoningQuestions';

export const ALL_QUESTIONS: Question[] = [
  ...allReadingQuestions,
  ...allMathQuestions,
  ...allReasoningQuestions
];

export const TOTAL_QUESTIONS_COUNT = ALL_QUESTIONS.length;

export const DEFAULT_FIELD_TEST_CONFIG: FieldTestConfig = {
  // 3 Reading questions
  readingQuestionIds: ['R001', 'R003', 'R005'],
  // 3 Math questions
  mathQuestionIds: ['M001', 'M002', 'M006'],
  // 3 Reasoning questions
  reasoningQuestionIds: ['L001', 'L003', 'L006'],
  targetClass: 'Class 6',
  isLocked: false
};

const questionMap = new Map<string, Question>();
ALL_QUESTIONS.forEach(q => questionMap.set(q.id, q));

export function getQuestionById(id: string): Question | undefined {
  return questionMap.get(id);
}

export function getQuestionsBySection(section: SectionType): Question[] {
  return ALL_QUESTIONS.filter(q => q.section === section);
}

export function getFieldTestQuestions(config: FieldTestConfig): {
  reading: Question[];
  math: Question[];
  reasoning: Question[];
  all: Question[];
} {
  const reading = config.readingQuestionIds
    .map(id => getQuestionById(id))
    .filter((q): q is Question => Boolean(q));

  const math = config.mathQuestionIds
    .map(id => getQuestionById(id))
    .filter((q): q is Question => Boolean(q));

  const reasoning = config.reasoningQuestionIds
    .map(id => getQuestionById(id))
    .filter((q): q is Question => Boolean(q));

  return {
    reading,
    math,
    reasoning,
    all: [...reading, ...math, ...reasoning]
  };
}
