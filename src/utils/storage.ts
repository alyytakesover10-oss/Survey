import { AssessmentRecord, FieldTestConfig, SchoolType } from '../types';
import { DEFAULT_FIELD_TEST_CONFIG } from '../data/questionBank';
import { generatePreloadedJumbledDataset } from './datasetSeeder';

const RECORDS_STORAGE_KEY = 'cep_assessment_records_v2';
const FIELD_TEST_CONFIG_KEY = 'cep_field_test_config_v1';

export function loadStoredRecords(): AssessmentRecord[] {
  try {
    const data = localStorage.getItem(RECORDS_STORAGE_KEY);
    if (!data) {
      const config = loadFieldTestConfig();
      const seeded = generatePreloadedJumbledDataset(config, '75_each', 20261009);
      localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(data) as AssessmentRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const config = loadFieldTestConfig();
      const seeded = generatePreloadedJumbledDataset(config, '75_each', 20261009);
      localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch (err) {
    console.error('Error loading stored records:', err);
    return generatePreloadedJumbledDataset(DEFAULT_FIELD_TEST_CONFIG, '75_each', 20261009);
  }
}

export function saveStoredRecords(records: AssessmentRecord[]): void {
  try {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving records:', err);
  }
}

export function loadFieldTestConfig(): FieldTestConfig {
  try {
    const data = localStorage.getItem(FIELD_TEST_CONFIG_KEY);
    if (!data) return DEFAULT_FIELD_TEST_CONFIG;
    return JSON.parse(data) as FieldTestConfig;
  } catch (err) {
    console.error('Error loading field test config:', err);
    return DEFAULT_FIELD_TEST_CONFIG;
  }
}

export const loadStoredConfig = loadFieldTestConfig;

export function saveFieldTestConfig(config: FieldTestConfig): void {
  try {
    localStorage.setItem(FIELD_TEST_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving field test config:', err);
  }
}

export const saveStoredConfig = saveFieldTestConfig;

export function clearStoredSyntheticRecords(): void {
  try {
    const records = loadStoredRecords();
    const fieldOnly = records.filter(r => r.dataType === 'FIELD');
    saveStoredRecords(fieldOnly);
  } catch (err) {
    console.error('Error clearing synthetic records:', err);
  }
}

// Generate the next student ID based on existing records
export function getNextStudentId(records: AssessmentRecord[], schoolType: SchoolType): string {
  const prefix = schoolType === 'Government' ? 'G' : 'P';
  // Filter for IDs starting with prefix and followed by digits
  const existingNums = records
    .filter(r => r.studentId.startsWith(prefix))
    .map(r => {
      const numPart = r.studentId.substring(1);
      const parsed = parseInt(numPart, 10);
      return isNaN(parsed) ? 0 : parsed;
    });

  const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
  const nextNum = maxNum + 1;
  return `${prefix}${nextNum.toString().padStart(3, '0')}`;
}

export function getFormattedTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}
