import React, { useState, useMemo } from 'react';
import { AssessmentRecord, SchoolType } from '../types';
import { DeepNeuralNetworkMLP } from '../utils/deepLearningMlp';
import { 
  Cpu, 
  Play, 
  Sliders, 
  Activity, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Code2,
  TrendingUp
} from 'lucide-react';

interface DeepLearningViewProps {
  records: AssessmentRecord[];
  onNavigateToStreamlit: () => void;
}

export const DeepLearningView: React.FC<DeepLearningViewProps> = ({
  records,
  onNavigateToStreamlit
}) => {
  // Hyperparameters
  const [epochs, setEpochs] = useState<number>(120);
  const [learningRate, setLearningRate] = useState<number>(0.08);
  const [retrainTrigger, setRetrainTrigger] = useState<number>(0);

  // Live Predictor Inputs
  const [predSchool, setPredSchool] = useState<SchoolType>('Government');
  const [predClass, setPredClass] = useState<string>('Class 6');
  const [predLang, setPredLang] = useState<string>('hi');
  const [predReading, setPredReading] = useState<number>(2);
  const [predMath, setPredMath] = useState<number>(2);
  const [predReasoning, setPredReasoning] = useState<number>(2);

  // Train MLP model on the 150 records (75 Gov + 75 Pvt)
  const { mlp, trainingMetrics } = useMemo(() => {
    const model = new DeepNeuralNetworkMLP(42 + retrainTrigger);
    const metrics = model.train(records, epochs, learningRate);
    return { mlp: model, trainingMetrics: metrics };
  }, [records, epochs, learningRate, retrainTrigger]);

  // Run forward pass for the current student profile
  const prediction = useMemo(() => {
    return mlp.predictStudent({
      schoolType: predSchool,
      studentClass: predClass,
      language: predLang,
      readingScore: predReading,
      mathScore: predMath,
      reasoningScore: predReasoning
    });
  }, [mlp, predSchool, predClass, predLang, predReading, predMath, predReasoning]);

  const govCount = records.filter(r => r.schoolType === 'Government').length;
  const pvtCount = records.filter(r => r.schoolType === 'Private').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 mb-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Deep Learning Multi-Layer Perceptron (MLP) • Backpropagation Predictor</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Deep Learning Neural Network Outcome Predictor
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Trained on <strong>{records.length}</strong> records ({govCount} Government [5–6–7] + {pvtCount} Private [7–8–9]) using a 3-Layer Feedforward Neural Network (<code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded-xs">6 ➔ 16 (ReLU) ➔ 8 (ReLU) ➔ 3 (Softmax)</code>).
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToStreamlit}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer shrink-0"
          >
            <Code2 className="w-4 h-4" />
            <span>View Python Neural Network Code (neural_network.py)</span>
          </button>
        </div>
      </div>

      {/* Top Row: Live Student Predictor + Hyperparameter Trainer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive Student Outcome Predictor */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Live Neural Network Student Outcome Predictor</span>
              </h2>
              <p className="text-xs text-slate-500">
                Adjust the 6 input features below to execute a real-time forward pass through the trained neural network
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200">
              Input Dim = 6
            </span>
          </div>

          {/* 6 Input Feature Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">1. School Type (x₁)</label>
              <select
                value={predSchool}
                onChange={(e) => setPredSchool(e.target.value as SchoolType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
              >
                <option value="Government">🏫 Government School (0.0)</option>
                <option value="Private">🎓 Private School (1.0)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">2. Student Class (x₂)</label>
              <select
                value={predClass}
                onChange={(e) => setPredClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
              >
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">3. Language Medium (x₃)</label>
              <select
                value={predLang}
                onChange={(e) => setPredLang(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
              >
                <option value="hi">🇮🇳 सरल हिन्दी (0.0)</option>
                <option value="en">🇬🇧 English (1.0)</option>
              </select>
            </div>
          </div>

          {/* Section Score Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>4. Reading Score (x₄)</span>
                <span className="text-indigo-700 font-mono">{predReading} / 3</span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={predReading}
                onChange={(e) => setPredReading(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>5. Math Score (x₅)</span>
                <span className="text-emerald-700 font-mono">{predMath} / 3</span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={predMath}
                onChange={(e) => setPredMath(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>6. Reasoning Score (x₆)</span>
                <span className="text-amber-700 font-mono">{predReasoning} / 3</span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={predReasoning}
                onChange={(e) => setPredReasoning(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Neural Network Prediction Output Box */}
          <div className="bg-indigo-950 text-white rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/80 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
                  Softmax Output Layer Classification
                </span>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {prediction.predictedTierName}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-indigo-300 block">Predicted Mastery Index</span>
                <span className="text-2xl font-mono font-bold text-emerald-400">
                  {prediction.predictedScoreOutOf9} / 9 ({prediction.predictedPercentage}%)
                </span>
              </div>
            </div>

            {/* Softmax Probability Bars */}
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-indigo-200">Tier 0: Developing Mastery Band (Scores 5–6 / 9)</span>
                  <span className="font-mono font-bold text-amber-300">{prediction.probabilities.developing56}%</span>
                </div>
                <div className="w-full h-2.5 bg-indigo-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${prediction.probabilities.developing56}%` }}
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-indigo-200">Tier 1: Proficient Grade-Level Band (Score 7 / 9)</span>
                  <span className="font-mono font-bold text-emerald-300">{prediction.probabilities.proficient7}%</span>
                </div>
                <div className="w-full h-2.5 bg-indigo-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${prediction.probabilities.proficient7}%` }}
                    className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-indigo-200">Tier 2: Advanced Distinction Band (Scores 8–9 / 9)</span>
                  <span className="font-mono font-bold text-sky-300">{prediction.probabilities.advanced89}%</span>
                </div>
                <div className="w-full h-2.5 bg-indigo-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${prediction.probabilities.advanced89}%` }}
                    className="h-full bg-sky-400 rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-indigo-200 bg-indigo-900/70 p-3 rounded-xl border border-indigo-800">
              <strong className="text-white">Pedagogical Recommendation:</strong> {prediction.pedagogicalRecommendation}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Backpropagation Training & Loss Curve */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  <span>Backpropagation Training Loop</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Cross-Entropy Loss &amp; Gradient Descent on {records.length} records
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRetrainTrigger(prev => prev + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer shadow-2xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Re-Train MLP</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Epochs</span>
                  <span className="font-mono text-purple-700">{epochs}</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={250}
                  step={10}
                  value={epochs}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Learning Rate (α)</span>
                  <span className="font-mono text-purple-700">{learningRate}</span>
                </div>
                <input
                  type="range"
                  min={0.02}
                  max={0.16}
                  step={0.02}
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Training Metrics Cards */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-100">
                <span className="text-[10px] text-slate-500 block">Final Loss</span>
                <strong className="text-sm font-mono text-purple-900">{trainingMetrics.finalLoss}</strong>
              </div>
              <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-500 block">Train Accuracy</span>
                <strong className="text-sm font-mono text-emerald-800">{trainingMetrics.finalAccuracy}%</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Parameters</span>
                <strong className="text-sm font-mono text-slate-800">{trainingMetrics.weightsSummary.totalParameters}</strong>
              </div>
            </div>

            {/* SVG Loss & Accuracy Convergence Curve */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Epoch Convergence Curve (Loss vs Accuracy)</span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-rose-600">― Loss</span>
                  <span className="text-emerald-600">― Accuracy %</span>
                </div>
              </div>
              <svg viewBox="0 0 360 150" className="w-full h-36 bg-slate-50 rounded-xl border border-slate-200 p-2">
                {/* Grid lines */}
                {[30, 75, 120].map(y => (
                  <line key={y} x1="20" y1={y} x2="345" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                ))}

                {/* Loss polyline */}
                {trainingMetrics.lossHistory.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="2"
                    points={trainingMetrics.lossHistory
                      .map((l, i, arr) => {
                        const x = 20 + (i / (arr.length - 1)) * 325;
                        const maxLoss = Math.max(...arr, 1.2);
                        const y = 135 - (l / maxLoss) * 115;
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(' ')}
                  />
                )}

                {/* Accuracy polyline */}
                {trainingMetrics.accuracyHistory.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2"
                    points={trainingMetrics.accuracyHistory
                      .map((acc, i, arr) => {
                        const x = 20 + (i / (arr.length - 1)) * 325;
                        const y = 135 - (acc / 100) * 115;
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(' ')}
                  />
                )}
              </svg>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <strong>Weight Matrices:</strong> W₁ ({trainingMetrics.weightsSummary.w1Shape}), W₂ ({trainingMetrics.weightsSummary.w2Shape}), W₃ ({trainingMetrics.weightsSummary.w3Shape})
          </div>
        </div>
      </div>

      {/* Bottom Row: Visual Neural Network Layer & Activation Inspector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Neural Network Layer-by-Layer Forward Pass Activation Inspector</span>
            </h3>
            <p className="text-xs text-slate-500">
              Real-time neuron activations $A^[1] = \text{'{ReLU}'}(X W_1 + b_1)$ and $A^[2] = \text{'{ReLU}'}(A^[1] W_2 + b_2)$ for the selected student profile
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Layer 0: Input Vector */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5">
              Input Layer (6 Features)
            </div>
            {['School (x₁)', 'Class (x₂)', 'Language (x₃)', 'Reading (x₄)', 'Math (x₅)', 'Reasoning (x₆)'].map((label, i) => (
              <div key={i} className="flex justify-between items-center font-mono">
                <span className="text-slate-600">{label}</span>
                <span className="px-2 py-0.5 rounded-xs bg-white border border-slate-200 font-bold text-indigo-700">
                  {prediction.inputVector[i]}
                </span>
              </div>
            ))}
          </div>

          {/* Layer 1: 16 ReLU Neurons */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5">
              Hidden Layer 1 (16 ReLU Neurons)
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {prediction.hiddenLayer1Activations.map((act, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded-lg text-center font-mono text-[10px] border ${
                    act > 0
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  h₁,{i + 1}: {act}
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2: 8 ReLU Neurons */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5">
              Hidden Layer 2 (8 ReLU Neurons)
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {prediction.hiddenLayer2Activations.map((act, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-center font-mono text-[11px] border ${
                    act > 0
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  h₂,{i + 1}: {act}
                </div>
              ))}
            </div>
          </div>

          {/* Layer 3: Output Softmax */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5">
              Output Layer (3 Softmax Nodes)
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between font-mono">
                <span>y₀ (5–6 Band):</span>
                <strong className="text-amber-700">{prediction.probabilities.developing56}%</strong>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between font-mono">
                <span>y₁ (7 Band):</span>
                <strong className="text-emerald-700">{prediction.probabilities.proficient7}%</strong>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between font-mono">
                <span>y₂ (8–9 Band):</span>
                <strong className="text-blue-700">{prediction.probabilities.advanced89}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
