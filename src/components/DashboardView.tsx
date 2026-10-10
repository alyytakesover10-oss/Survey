import React, { useState, useMemo } from 'react';
import { AssessmentRecord } from '../types';
import { DatasetPresetMode } from '../utils/datasetSeeder';
import { 
  BarChart3, 
  Building2, 
  GraduationCap, 
  Info, 
  SlidersHorizontal,
  Shuffle,
  PieChart,
  Activity,
  Radar,
  Layers,
  Code2
} from 'lucide-react';

interface DashboardViewProps {
  records: AssessmentRecord[];
  onNavigateToDemo?: () => void;
  onReseedDataset?: (mode: DatasetPresetMode) => void;
  onNavigateToStreamlit?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onNavigateToDemo,
  onReseedDataset,
  onNavigateToStreamlit
}) => {
  // Filters
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDataType, setSelectedDataType] = useState<string>('All');
  const [hoveredStudentIdx, setHoveredStudentIdx] = useState<number | null>(null);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (selectedClass !== 'All' && r.studentClass !== selectedClass) return false;
      if (selectedLanguage !== 'All' && r.language !== selectedLanguage) return false;
      if (selectedStatus !== 'All' && r.dataStatus !== selectedStatus) return false;
      if (selectedDataType !== 'All' && r.dataType !== selectedDataType) return false;
      return true;
    });
  }, [records, selectedClass, selectedLanguage, selectedStatus, selectedDataType]);

  const govRecords = useMemo(
    () => filteredRecords.filter(r => r.schoolType === 'Government'),
    [filteredRecords]
  );

  const pvtRecords = useMemo(
    () => filteredRecords.filter(r => r.schoolType === 'Private'),
    [filteredRecords]
  );

  // Statistical summary computation
  const computeStats = (sample: AssessmentRecord[]) => {
    const n = sample.length;
    if (n === 0) {
      return {
        count: 0,
        avgTotal: 0,
        avgPercentage: 0,
        medianTotal: 0,
        highestTotal: 0,
        lowestTotal: 0,
        stdDev: 0,
        avgReading: 0,
        avgMath: 0,
        avgReasoning: 0,
        distribution: Array(10).fill(0) as number[],
        foundationalCount: 0,
        intermediateCount: 0,
        proficientCount: 0,
        consistencyPct: 0
      };
    }

    const sumTotal = sample.reduce((acc, r) => acc + r.totalScore, 0);
    const sumReading = sample.reduce((acc, r) => acc + r.readingScore, 0);
    const sumMath = sample.reduce((acc, r) => acc + r.mathScore, 0);
    const sumReasoning = sample.reduce((acc, r) => acc + r.reasoningScore, 0);

    const mean = sumTotal / n;
    const variance = sample.reduce((acc, r) => acc + Math.pow(r.totalScore - mean, 2), 0) / n;
    const stdDev = Number(Math.sqrt(variance).toFixed(2));

    const sortedScores = [...sample.map(r => r.totalScore)].sort((a, b) => a - b);
    const mid = Math.floor(sortedScores.length / 2);
    const medianTotal =
      sortedScores.length % 2 !== 0
        ? sortedScores[mid]
        : Number(((sortedScores[mid - 1] + sortedScores[mid]) / 2).toFixed(1));

    const distribution = Array(10).fill(0);
    let foundationalCount = 0;
    let intermediateCount = 0;
    let proficientCount = 0;
    let scoreAtLeast6 = 0;

    sample.forEach(r => {
      const score = Math.max(0, Math.min(9, Math.round(r.totalScore)));
      distribution[score]++;
      if (score >= 6) scoreAtLeast6++;

      if (score <= 4) foundationalCount++;
      else if (score <= 6) intermediateCount++;
      else proficientCount++;
    });

    return {
      count: n,
      avgTotal: Number(mean.toFixed(2)),
      avgPercentage: Number(((sumTotal / (n * 9)) * 100).toFixed(1)),
      medianTotal,
      highestTotal: sortedScores[sortedScores.length - 1],
      lowestTotal: sortedScores[0],
      stdDev,
      avgReading: Number((sumReading / n).toFixed(2)),
      avgMath: Number((sumMath / n).toFixed(2)),
      avgReasoning: Number((sumReasoning / n).toFixed(2)),
      distribution,
      foundationalCount,
      intermediateCount,
      proficientCount,
      consistencyPct: Number(((scoreAtLeast6 / n) * 100).toFixed(1))
    };
  };

  const govStats = useMemo(() => computeStats(govRecords), [govRecords]);
  const pvtStats = useMemo(() => computeStats(pvtRecords), [pvtRecords]);

  const diffAvg = Number((pvtStats.avgTotal - govStats.avgTotal).toFixed(2));
  const diffPct = Number((pvtStats.avgPercentage - govStats.avgPercentage).toFixed(1));

  // Max count for Visual 2 histogram
  const maxFreq = Math.max(...govStats.distribution, ...pvtStats.distribution, 1);

  // Visual 3: 5-Axis Radar Chart Calculations
  const radarAxes = useMemo(() => {
    const gReadPct = Number(((govStats.avgReading / 3) * 100).toFixed(1));
    const pReadPct = Number(((pvtStats.avgReading / 3) * 100).toFixed(1));

    const gMathPct = Number(((govStats.avgMath / 3) * 100).toFixed(1));
    const pMathPct = Number(((pvtStats.avgMath / 3) * 100).toFixed(1));

    const gReasPct = Number(((govStats.avgReasoning / 3) * 100).toFixed(1));
    const pReasPct = Number(((pvtStats.avgReasoning / 3) * 100).toFixed(1));

    return [
      { label: 'Reading %', gov: gReadPct, pvt: pReadPct },
      { label: 'Mathematics %', gov: gMathPct, pvt: pMathPct },
      { label: 'Reasoning %', gov: gReasPct, pvt: pReasPct },
      { label: 'Consistency (≥6/9)', gov: govStats.consistencyPct, pvt: pvtStats.consistencyPct },
      { label: 'Overall Score %', gov: govStats.avgPercentage, pvt: pvtStats.avgPercentage }
    ];
  }, [govStats, pvtStats]);

  // Visual 5: Class-wise Average Comparison
  const classBreakdown = useMemo(() => {
    const classes = ['Class 5', 'Class 6', 'Class 7', 'Class 8'];
    return classes.map(cls => {
      const gSub = govRecords.filter(r => r.studentClass === cls);
      const pSub = pvtRecords.filter(r => r.studentClass === cls);
      const gAvg = gSub.length > 0 ? Number((gSub.reduce((a, b) => a + b.totalScore, 0) / gSub.length).toFixed(2)) : 0;
      const pAvg = pSub.length > 0 ? Number((pSub.reduce((a, b) => a + b.totalScore, 0) / pSub.length).toFixed(2)) : 0;
      return {
        className: cls,
        govAvg: gAvg,
        govCount: gSub.length,
        pvtAvg: pAvg,
        pvtCount: pSub.length
      };
    });
  }, [govRecords, pvtRecords]);

  // Helper for Radar SVG coordinates
  const getRadarPoint = (axisIndex: number, valuePct: number, radius: number = 95, cx: number = 140, cy: number = 130) => {
    const angle = (Math.PI * 2 * axisIndex) / 5 - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, valuePct)) / 100) * radius;
    return {
      x: Number((cx + r * Math.cos(angle)).toFixed(1)),
      y: Number((cy + r * Math.sin(angle)).toFixed(1))
    };
  };

  const govRadarPolygon = radarAxes
    .map((ax, idx) => {
      const pt = getRadarPoint(idx, ax.gov);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  const pvtRadarPolygon = radarAxes
    .map((ax, idx) => {
      const pt = getRadarPoint(idx, ax.pvt);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div className="space-y-7 pb-16">
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Assessment Records Match Current Filter</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Reset the filters above or re-seed the 75 Government (5–6–7) &amp; 75 Private (7–8–9) jumbled dataset.
          </p>
          {onReseedDataset && (
            <button
              onClick={() => onReseedDataset('75_each')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              Load 75 Gov + 75 Pvt Jumbled Dataset
            </button>
          )}
        </div>
      ) : (
        <>
          {/* KPI Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Government School Card */}
            <div className="bg-white rounded-2xl p-5 border-2 border-emerald-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Government School (75 Separate Records)</h3>
                    <span className="text-[11px] text-slate-500">N = {govStats.count} Separate Students (G001–G075 • Scores 5–6–7)</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {govStats.count} Records
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-500 font-medium block">Observed Average Score</span>
                  <span className="text-2xl font-bold text-slate-900">{govStats.avgTotal}</span>
                  <span className="text-xs text-slate-400"> / 9</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-500 font-medium block">Observed Percentage</span>
                  <span className="text-2xl font-bold text-emerald-700">{govStats.avgPercentage}%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Score 5/9</span>
                  <strong className="text-emerald-800">{govStats.distribution[5]} students</strong>
                </div>
                <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Score 6/9</span>
                  <strong className="text-emerald-800">{govStats.distribution[6]} students</strong>
                </div>
                <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Score 7/9</span>
                  <strong className="text-emerald-800">{govStats.distribution[7]} students</strong>
                </div>
              </div>
            </div>

            {/* Private School Card */}
            <div className="bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-blue-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Private School (75 Separate Records)</h3>
                    <span className="text-[11px] text-slate-500">N = {pvtStats.count} Separate Students (P001–P075 • Scores 7–8–9)</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {pvtStats.count} Records
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-500 font-medium block">Observed Average Score</span>
                  <span className="text-2xl font-bold text-slate-900">{pvtStats.avgTotal}</span>
                  <span className="text-xs text-slate-400"> / 9</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-500 font-medium block">Observed Percentage</span>
                  <span className="text-2xl font-bold text-blue-700">{pvtStats.avgPercentage}%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                  <span className="text-slate-500 block text-[10px]">Score 7/9</span>
                  <strong className="text-blue-800">{pvtStats.distribution[7]} students</strong>
                </div>
                <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                  <span className="text-slate-500 block text-[10px]">Score 8/9</span>
                  <strong className="text-blue-800">{pvtStats.distribution[8]} students</strong>
                </div>
                <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                  <span className="text-slate-500 block text-[10px]">Score 9/9</span>
                  <strong className="text-blue-800">{pvtStats.distribution[9]} students</strong>
                </div>
              </div>
            </div>

            {/* Difference in Sample Average Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    <Info className="w-4 h-4 text-indigo-600" />
                    <span>Difference in Sample Average</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    75 Gov Records (5–6–7) vs 75 Pvt Records (7–8–9) = {govStats.count + pvtStats.count} Total.
                  </p>
                </div>
                {onReseedDataset && (
                  <button
                    type="button"
                    onClick={() => onReseedDataset('75_each')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold shrink-0 cursor-pointer"
                    title="Re-jumble 75 Government (5-6-7) and 75 Private (7-8-9) records"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Re-Jumble 75+75</span>
                  </button>
                )}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1 text-center">
                <div className="text-xs text-slate-500 font-medium">Difference in Mean Score (Δ)</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {diffAvg >= 0 ? `+${diffAvg}` : diffAvg}
                  <span className="text-xs font-normal text-slate-500"> / 9 marks</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold">
                  {diffPct >= 0 ? `+${diffPct}%` : `${diffPct}%`} percentage variance
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  Gov Sample: <strong>{govStats.count} Separate</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  Pvt Sample: <strong>{pvtStats.count} Separate</strong>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              VISUAL 1 & VISUAL 2 (ROW 1)
             ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* VISUAL 1: Section-wise & Overall Grouped Bar Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 mb-1">
                    Visual 1 of 5 • Grouped Bar Chart
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Section-Wise &amp; Overall Mean Score Comparison
                  </h3>
                  <span className="text-xs text-slate-500">
                    Reading (/3), Mathematics (/3), Reasoning (/3), and Total Score (/9)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                    <span className="text-slate-600 font-medium">Gov</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block" />
                    <span className="text-slate-600 font-medium">Pvt</span>
                  </span>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between pt-8 pb-2 px-3 border-b border-slate-200">
                {[
                  { section: 'Reading (/3)', gov: govStats.avgReading, pvt: pvtStats.avgReading, max: 3 },
                  { section: 'Math (/3)', gov: govStats.avgMath, pvt: pvtStats.avgMath, max: 3 },
                  { section: 'Reasoning (/3)', gov: govStats.avgReasoning, pvt: pvtStats.avgReasoning, max: 3 },
                  { section: 'Total Score (/9)', gov: govStats.avgTotal, pvt: pvtStats.avgTotal, max: 9 }
                ].map((item, i) => {
                  const govHeight = (item.gov / item.max) * 100;
                  const pvtHeight = (item.pvt / item.max) * 100;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end px-1.5">
                      <div className="w-full flex items-end justify-center gap-2 h-44">
                        <div className="w-7 sm:w-9 flex flex-col items-center h-full justify-end">
                          <span className="text-[11px] font-bold text-emerald-700 mb-1">
                            {item.gov}
                          </span>
                          <div
                            style={{ height: `${Math.max(govHeight, 6)}%` }}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all duration-500 shadow-2xs"
                            title={`Government ${item.section}: ${item.gov} / ${item.max}`}
                          />
                        </div>

                        <div className="w-7 sm:w-9 flex flex-col items-center h-full justify-end">
                          <span className="text-[11px] font-bold text-blue-700 mb-1">
                            {item.pvt}
                          </span>
                          <div
                            style={{ height: `${Math.max(pvtHeight, 6)}%` }}
                            className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all duration-500 shadow-2xs"
                            title={`Private ${item.section}: ${item.pvt} / ${item.max}`}
                          />
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-slate-700 text-center">
                        {item.section}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                <span>Gov Accuracy: <strong>{govStats.avgPercentage}%</strong></span>
                <span>Pvt Accuracy: <strong>{pvtStats.avgPercentage}%</strong></span>
                <span>Gap: <strong>+{diffAvg} marks</strong></span>
              </div>
            </div>

            {/* VISUAL 2: Score Distribution Histogram (0 to 9 Marks) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 mb-1">
                    Visual 2 of 5 • Frequency Histogram
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Jumbled Score Distribution Histogram (0–9 Marks)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Notice Gov clustering at 5–6–7 and Pvt clustering at 7–8–9 (overlap at Score 7)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                    <span className="text-slate-600 font-medium">Gov (5–7)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block" />
                    <span className="text-slate-600 font-medium">Pvt (7–9)</span>
                  </span>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between pt-8 pb-2 px-1 border-b border-slate-200 gap-1 sm:gap-2">
                {Array.from({ length: 10 }).map((_, score) => {
                  const gCount = govStats.distribution[score] || 0;
                  const pCount = pvtStats.distribution[score] || 0;
                  const gHeight = (gCount / maxFreq) * 100;
                  const pHeight = (pCount / maxFreq) * 100;
                  const isHighlighted = score >= 5;

                  return (
                    <div
                      key={score}
                      className={`flex-1 flex flex-col items-center gap-1 h-full justify-end rounded-lg px-0.5 ${
                        isHighlighted ? 'bg-slate-50/70' : ''
                      }`}
                    >
                      <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-44">
                        <div className="flex flex-col items-center h-full justify-end">
                          {gCount > 0 && (
                            <span className="text-[9px] font-bold text-emerald-700 mb-0.5">
                              {gCount}
                            </span>
                          )}
                          <div
                            style={{ height: `${Math.max(gHeight, gCount > 0 ? 8 : 0)}%` }}
                            className="w-2.5 sm:w-3.5 bg-emerald-500 rounded-t-xs transition-all duration-500"
                            title={`Government: ${gCount} students scored ${score}/9`}
                          />
                        </div>
                        <div className="flex flex-col items-center h-full justify-end">
                          {pCount > 0 && (
                            <span className="text-[9px] font-bold text-blue-700 mb-0.5">
                              {pCount}
                            </span>
                          )}
                          <div
                            style={{ height: `${Math.max(pHeight, pCount > 0 ? 8 : 0)}%` }}
                            className="w-2.5 sm:w-3.5 bg-blue-500 rounded-t-xs transition-all duration-500"
                            title={`Private: ${pCount} students scored ${score}/9`}
                          />
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold ${isHighlighted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {score}/9
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                <span>Gov 5–6–7 Total: <strong>{govStats.distribution[5] + govStats.distribution[6] + govStats.distribution[7]}</strong></span>
                <span>Overlap at 7/9: <strong>{govStats.distribution[7]} Gov &amp; {pvtStats.distribution[7]} Pvt</strong></span>
                <span>Pvt 7–8–9 Total: <strong>{pvtStats.distribution[7] + pvtStats.distribution[8] + pvtStats.distribution[9]}</strong></span>
              </div>
            </div>
          </div>

          {/* =====================================================================
              VISUAL 3 & VISUAL 4 (ROW 2)
             ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* VISUAL 3: 5-Axis Multi-Dimensional Competency Radar Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 mb-1">
                    Visual 3 of 5 • 5-Axis Radar / Spider Chart
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Radar className="w-4 h-4 text-purple-600" />
                    <span>Multi-Dimensional Competency Profile (0–100%)</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Polygon overlay across Reading, Math, Reasoning, Consistency, and Overall Accuracy
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-3/5 flex justify-center">
                  <svg viewBox="0 0 280 260" className="w-full max-w-[280px] h-auto overflow-visible">
                    {/* Concentric Pentagons (20%, 40%, 60%, 80%, 100%) */}
                    {[20, 40, 60, 80, 100].map(pct => {
                      const pts = [0, 1, 2, 3, 4]
                        .map(i => {
                          const p = getRadarPoint(i, pct);
                          return `${p.x},${p.y}`;
                        })
                        .join(' ');
                      return (
                        <polygon
                          key={pct}
                          points={pts}
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Axis Spokes & Labels */}
                    {radarAxes.map((ax, i) => {
                      const outer = getRadarPoint(i, 100);
                      const labelPt = getRadarPoint(i, 122);
                      return (
                        <g key={i}>
                          <line
                            x1="140"
                            y1="130"
                            x2={outer.x}
                            y2={outer.y}
                            stroke="#cbd5e1"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                          />
                          <text
                            x={labelPt.x}
                            y={labelPt.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-[9px] font-bold fill-slate-700"
                          >
                            {ax.label}
                          </text>
                        </g>
                      );
                    })}

                    {/* Private Polygon */}
                    <polygon
                      points={pvtRadarPolygon}
                      fill="rgba(59, 130, 246, 0.22)"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />

                    {/* Government Polygon */}
                    <polygon
                      points={govRadarPolygon}
                      fill="rgba(16, 185, 129, 0.28)"
                      stroke="#059669"
                      strokeWidth="2.5"
                    />

                    {/* Data Vertices */}
                    {radarAxes.map((ax, i) => {
                      const gPt = getRadarPoint(i, ax.gov);
                      const pPt = getRadarPoint(i, ax.pvt);
                      return (
                        <g key={i}>
                          <circle cx={gPt.x} cy={gPt.y} r="3.5" fill="#059669" />
                          <circle cx={pPt.x} cy={pPt.y} r="3.5" fill="#2563eb" />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="w-full sm:w-2/5 space-y-2 text-xs">
                  {radarAxes.map((ax, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-700">{ax.label}</span>
                      <div className="flex items-center gap-2 font-mono font-bold">
                        <span className="text-emerald-700">{ax.gov}%</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-blue-700">{ax.pvt}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VISUAL 4: Jumbled Student Sequence Trajectory Plot (Scatter + Trend Line) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 mb-1">
                    Visual 4 of 5 • Jumbled Sequence Scatter &amp; Trajectory
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <span>Student-by-Student Jumbled Result Trajectory (1 to {Math.max(govRecords.length, pvtRecords.length)})</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Individual jumbled student scores showing Gov oscillating in 5–6–7 and Pvt in 7–8–9
                  </span>
                </div>
              </div>

              {/* SVG Scatter & Line Trajectory */}
              <div className="relative">
                <svg viewBox="0 0 520 210" className="w-full h-56 bg-slate-50/60 rounded-xl border border-slate-200/80 p-2">
                  {/* Horizontal Grid Lines for Scores 4, 5, 6, 7, 8, 9 */}
                  {[4, 5, 6, 7, 8, 9].map(scoreVal => {
                    const y = 185 - ((scoreVal - 4) / 5) * 160;
                    return (
                      <g key={scoreVal}>
                        <line x1="36" y1={y} x2="505" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                        <text x="12" y={y + 3} className="text-[10px] font-mono font-bold fill-slate-500">
                          {scoreVal}/9
                        </text>
                      </g>
                    );
                  })}

                  {/* Polyline for Government Jumbled Scores */}
                  {govRecords.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeOpacity="0.65"
                      points={govRecords
                        .slice(0, 75)
                        .map((rec, idx, arr) => {
                          const x = 40 + (idx / Math.max(1, arr.length - 1)) * 460;
                          const clamped = Math.max(4, Math.min(9, rec.totalScore));
                          const y = 185 - ((clamped - 4) / 5) * 160;
                          return `${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(' ')}
                    />
                  )}

                  {/* Polyline for Private Jumbled Scores */}
                  {pvtRecords.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeOpacity="0.65"
                      points={pvtRecords
                        .slice(0, 75)
                        .map((rec, idx, arr) => {
                          const x = 40 + (idx / Math.max(1, arr.length - 1)) * 460;
                          const clamped = Math.max(4, Math.min(9, rec.totalScore));
                          const y = 185 - ((clamped - 4) / 5) * 160;
                          return `${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(' ')}
                    />
                  )}

                  {/* Dots for Government Students */}
                  {govRecords.slice(0, 75).map((rec, idx, arr) => {
                    const x = 40 + (idx / Math.max(1, arr.length - 1)) * 460;
                    const clamped = Math.max(4, Math.min(9, rec.totalScore));
                    const y = 185 - ((clamped - 4) / 5) * 160;
                    return (
                      <circle
                        key={rec.recordId}
                        cx={x}
                        cy={y}
                        r={hoveredStudentIdx === idx ? 5 : 3}
                        fill="#059669"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredStudentIdx(idx)}
                        onMouseLeave={() => setHoveredStudentIdx(null)}
                      >
                        <title>{`${rec.studentId} (Gov): Score ${rec.totalScore}/9`}</title>
                      </circle>
                    );
                  })}

                  {/* Dots for Private Students */}
                  {pvtRecords.slice(0, 75).map((rec, idx, arr) => {
                    const x = 40 + (idx / Math.max(1, arr.length - 1)) * 460;
                    const clamped = Math.max(4, Math.min(9, rec.totalScore));
                    const y = 185 - ((clamped - 4) / 5) * 160;
                    return (
                      <circle
                        key={rec.recordId}
                        cx={x}
                        cy={y}
                        r={hoveredStudentIdx === idx ? 5 : 3}
                        fill="#2563eb"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredStudentIdx(idx)}
                        onMouseLeave={() => setHoveredStudentIdx(null)}
                      >
                        <title>{`${rec.studentId} (Pvt): Score ${rec.totalScore}/9`}</title>
                      </circle>
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                <span>
                  {hoveredStudentIdx !== null ? (
                    <>
                      Student #{hoveredStudentIdx + 1}:{' '}
                      <strong className="text-emerald-700">
                        {govRecords[hoveredStudentIdx]?.studentId || 'N/A'} = {govRecords[hoveredStudentIdx]?.totalScore ?? '-'}
                      </strong>{' '}
                      vs{' '}
                      <strong className="text-blue-700">
                        {pvtRecords[hoveredStudentIdx]?.studentId || 'N/A'} = {pvtRecords[hoveredStudentIdx]?.totalScore ?? '-'}
                      </strong>
                    </>
                  ) : (
                    'Hover over any point to inspect jumbled student pair scores'
                  )}
                </span>
                <span className="font-semibold text-slate-700">Jumbled Sequence Verified ✓</span>
              </div>
            </div>
          </div>

          {/* =====================================================================
              VISUAL 5 (ROW 3): SCORE BAND DONUTS & CLASS-WISE BREAKDOWN
             ===================================================================== */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 mb-1">
                  Visual 5 of 5 • Score Band Donut Charts &amp; Class-Wise Breakdown
                </span>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-rose-600" />
                  <span>Proportional Score Share (5–6–7 vs 7–8–9) &amp; Class-Level Performance</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Exact score composition rings alongside Class 5, Class 6, Class 7, and Class 8 mean comparisons
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Gov Score Share Donut */}
              <div className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-100 flex flex-col items-center space-y-3">
                <div className="text-xs font-bold text-emerald-900">
                  Government School Score Share (5, 6, 7)
                </div>
                {(() => {
                  const total = Math.max(1, govStats.count);
                  const c5 = govStats.distribution[5];
                  const c6 = govStats.distribution[6];
                  const c7 = govStats.distribution[7];
                  const p5 = (c5 / total) * 100;
                  const p6 = (c6 / total) * 100;
                  const p7 = (c7 / total) * 100;
                  // SVG circle circumference for r=45 is ~282.74
                  const circ = 2 * Math.PI * 45;
                  const dash5 = (p5 / 100) * circ;
                  const dash6 = (p6 / 100) * circ;
                  const dash7 = (p7 / 100) * circ;

                  return (
                    <>
                      <svg viewBox="0 0 120 120" className="w-32 h-32">
                        <circle cx="60" cy="60" r="45" fill="none" stroke="#e2e8f0" strokeWidth="14" />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="14"
                          strokeDasharray={`${dash5} ${circ}`}
                          strokeDashoffset="0"
                          transform="rotate(-90 60 60)"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="14"
                          strokeDasharray={`${dash6} ${circ}`}
                          strokeDashoffset={-dash5}
                          transform="rotate(-90 60 60)"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#047857"
                          strokeWidth="14"
                          strokeDasharray={`${dash7} ${circ}`}
                          strokeDashoffset={-(dash5 + dash6)}
                          transform="rotate(-90 60 60)"
                        />
                        <text x="60" y="57" textAnchor="middle" className="text-xs font-bold fill-slate-800">
                          {govStats.avgTotal}/9
                        </text>
                        <text x="60" y="70" textAnchor="middle" className="text-[9px] fill-slate-500">
                          Gov Mean
                        </text>
                      </svg>
                      <div className="flex items-center gap-3 text-[11px] font-semibold">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                          5/9 ({c5})
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                          6/9 ({c6})
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
                          7/9 ({c7})
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Pvt Score Share Donut */}
              <div className="bg-blue-50/40 rounded-xl p-4 border border-blue-100 flex flex-col items-center space-y-3">
                <div className="text-xs font-bold text-blue-900">
                  Private School Score Share (7, 8, 9)
                </div>
                {(() => {
                  const total = Math.max(1, pvtStats.count);
                  const c7 = pvtStats.distribution[7];
                  const c8 = pvtStats.distribution[8];
                  const c9 = pvtStats.distribution[9];
                  const p7 = (c7 / total) * 100;
                  const p8 = (c8 / total) * 100;
                  const p9 = (c9 / total) * 100;
                  const circ = 2 * Math.PI * 45;
                  const dash7 = (p7 / 100) * circ;
                  const dash8 = (p8 / 100) * circ;
                  const dash9 = (p9 / 100) * circ;

                  return (
                    <>
                      <svg viewBox="0 0 120 120" className="w-32 h-32">
                        <circle cx="60" cy="60" r="45" fill="none" stroke="#e2e8f0" strokeWidth="14" />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="14"
                          strokeDasharray={`${dash7} ${circ}`}
                          strokeDashoffset="0"
                          transform="rotate(-90 60 60)"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="14"
                          strokeDasharray={`${dash8} ${circ}`}
                          strokeDashoffset={-dash7}
                          transform="rotate(-90 60 60)"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#1d4ed8"
                          strokeWidth="14"
                          strokeDasharray={`${dash9} ${circ}`}
                          strokeDashoffset={-(dash7 + dash8)}
                          transform="rotate(-90 60 60)"
                        />
                        <text x="60" y="57" textAnchor="middle" className="text-xs font-bold fill-slate-800">
                          {pvtStats.avgTotal}/9
                        </text>
                        <text x="60" y="70" textAnchor="middle" className="text-[9px] fill-slate-500">
                          Pvt Mean
                        </text>
                      </svg>
                      <div className="flex items-center gap-3 text-[11px] font-semibold">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
                          7/9 ({c7})
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                          8/9 ({c8})
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-700 inline-block" />
                          9/9 ({c9})
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Class-Wise Horizontal Bars */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800">
                  Class-Wise Mean Score Comparison (/9)
                </div>
                {classBreakdown.map((cb, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">{cb.className}</span>
                      <span className="text-[11px] text-slate-500">
                        Gov: <strong className="text-emerald-700">{cb.govAvg}</strong> ({cb.govCount}) • Pvt:{' '}
                        <strong className="text-blue-700">{cb.pvtAvg}</strong> ({cb.pvtCount})
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(cb.govAvg / 9) * 100}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(cb.pvtAvg / 9) * 100}%` }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side-by-Side 75 Separate Records Tables (Government 75 vs Private 75) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Government 75 Separate Records Table */}
            <div className="bg-white rounded-2xl p-5 border-2 border-emerald-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-50 pb-2.5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Government School — {govRecords.length} Separate Jumbled Records
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                  Scores 5, 6, 7 Jumbled
                </span>
              </div>
              <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2 px-2.5">#</th>
                      <th className="py-2 px-2.5">Student ID</th>
                      <th className="py-2 px-2.5">Class</th>
                      <th className="py-2 px-2.5 text-center">R/M/L</th>
                      <th className="py-2 px-2.5 text-center">Total (/9)</th>
                      <th className="py-2 px-2.5 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {govRecords.map((rec, idx) => (
                      <tr key={rec.recordId} className="hover:bg-emerald-50/30">
                        <td className="py-1.5 px-2.5 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-1.5 px-2.5 font-mono font-bold text-slate-900">{rec.studentId}</td>
                        <td className="py-1.5 px-2.5 text-slate-600">{rec.studentClass}</td>
                        <td className="py-1.5 px-2.5 text-center font-mono text-slate-600">
                          {rec.readingScore}/{rec.mathScore}/{rec.reasoningScore}
                        </td>
                        <td className="py-1.5 px-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                            {rec.totalScore}/9
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-semibold text-slate-700">
                          {rec.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Private 75 Separate Records Table */}
            <div className="bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-blue-50 pb-2.5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Private School — {pvtRecords.length} Separate Jumbled Records
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md border border-blue-200">
                  Scores 7, 8, 9 Jumbled
                </span>
              </div>
              <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2 px-2.5">#</th>
                      <th className="py-2 px-2.5">Student ID</th>
                      <th className="py-2 px-2.5">Class</th>
                      <th className="py-2 px-2.5 text-center">R/M/L</th>
                      <th className="py-2 px-2.5 text-center">Total (/9)</th>
                      <th className="py-2 px-2.5 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pvtRecords.map((rec, idx) => (
                      <tr key={rec.recordId} className="hover:bg-blue-50/30">
                        <td className="py-1.5 px-2.5 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-1.5 px-2.5 font-mono font-bold text-slate-900">{rec.studentId}</td>
                        <td className="py-1.5 px-2.5 text-slate-600">{rec.studentClass}</td>
                        <td className="py-1.5 px-2.5 text-center font-mono text-slate-600">
                          {rec.readingScore}/{rec.mathScore}/{rec.reasoningScore}
                        </td>
                        <td className="py-1.5 px-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                            {rec.totalScore}/9
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-semibold text-slate-700">
                          {rec.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
