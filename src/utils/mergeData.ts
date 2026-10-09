import { AssessmentRecord } from '../types';

export interface MergeResult {
  addedCount: number;
  skippedDuplicates: number;
  conflictingStudentIds: string[];
  newRecords: AssessmentRecord[];
  totalBefore: number;
  totalAfter: number;
}

export function exportDeviceBackup(records: AssessmentRecord[]): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    recordCount: records.length,
    system: 'CEP Learning Outcomes Data Collection System',
    version: '1.0.0',
    records
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `CEP_Device_Data_Backup_${dateStr}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function mergeRecords(
  existingRecords: AssessmentRecord[],
  incomingRecords: AssessmentRecord[]
): MergeResult {
  const existingRecordIds = new Set(existingRecords.map(r => r.recordId));
  const existingStudentIds = new Set(existingRecords.map(r => r.studentId));

  let addedCount = 0;
  let skippedDuplicates = 0;
  const conflictingStudentIds: string[] = [];
  const mergedList = [...existingRecords];

  incomingRecords.forEach(incoming => {
    // Check for exact duplicate Record ID
    if (existingRecordIds.has(incoming.recordId)) {
      skippedDuplicates++;
      return;
    }

    // Check if another record has the exact same Student ID (potential collision between phones)
    if (existingStudentIds.has(incoming.studentId)) {
      conflictingStudentIds.push(incoming.studentId);
    }

    // Add unique incoming record, preserving original timestamps & data
    mergedList.push(incoming);
    existingRecordIds.add(incoming.recordId);
    existingStudentIds.add(incoming.studentId);
    addedCount++;
  });

  return {
    addedCount,
    skippedDuplicates,
    conflictingStudentIds: Array.from(new Set(conflictingStudentIds)),
    newRecords: mergedList,
    totalBefore: existingRecords.length,
    totalAfter: mergedList.length
  };
}
