import { AssessmentRecord, SchoolType } from '../types';

export interface MLPTrainingResult {
  epochs: number;
  learningRate: number;
  finalLoss: number;
  finalAccuracy: number;
  lossHistory: number[];
  accuracyHistory: number[];
  weightsSummary: {
    w1Shape: string;
    w2Shape: string;
    w3Shape: string;
    totalParameters: number;
  };
}

export interface MLPPredictionResult {
  predictedTierIndex: 0 | 1 | 2;
  predictedTierName: string;
  confidencePct: number;
  probabilities: {
    developing56: number;
    proficient7: number;
    advanced89: number;
  };
  predictedScoreOutOf9: number;
  predictedPercentage: number;
  hiddenLayer1Activations: number[];
  hiddenLayer2Activations: number[];
  inputVector: number[];
  pedagogicalRecommendation: string;
}

// Seeded PRNG for deterministic weight initialization
function createSeededRng(seed: number) {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Real 3-Layer Multi-Layer Perceptron (MLP) Deep Neural Network
 * Architecture: Input(6) -> Dense(16, ReLU) -> Dense(8, ReLU) -> Output(3, Softmax)
 */
export class DeepNeuralNetworkMLP {
  private inputDim = 6;
  private h1Dim = 16;
  private h2Dim = 8;
  private outDim = 3;

  private W1: number[][] = [];
  private b1: number[] = [];
  private W2: number[][] = [];
  private b2: number[] = [];
  private W3: number[][] = [];
  private b3: number[] = [];

  constructor(seed: number = 42) {
    this.initWeights(seed);
  }

  private initWeights(seed: number) {
    const rng = createSeededRng(seed);
    const randNormal = (scale: number) => (rng() * 2 - 1) * scale;

    this.W1 = Array.from({ length: this.inputDim }, () =>
      Array.from({ length: this.h1Dim }, () => randNormal(Math.sqrt(2 / this.inputDim)))
    );
    this.b1 = Array(this.h1Dim).fill(0);

    this.W2 = Array.from({ length: this.h1Dim }, () =>
      Array.from({ length: this.h2Dim }, () => randNormal(Math.sqrt(2 / this.h1Dim)))
    );
    this.b2 = Array(this.h2Dim).fill(0);

    this.W3 = Array.from({ length: this.h2Dim }, () =>
      Array.from({ length: this.outDim }, () => randNormal(Math.sqrt(1 / this.h2Dim)))
    );
    this.b3 = Array(this.outDim).fill(0);
  }

  private static relu(x: number): number {
    return x > 0 ? x : 0;
  }

  private static softmax(logits: number[]): number[] {
    const maxLogit = Math.max(...logits);
    const exps = logits.map(v => Math.exp(v - maxLogit));
    const sumExps = exps.reduce((a, b) => a + b, 0) || 1;
    return exps.map(e => e / sumExps);
  }

  public static encodeRecordFeatures(rec: {
    schoolType: SchoolType;
    studentClass: string;
    language: string;
    readingScore: number;
    mathScore: number;
    reasoningScore: number;
  }): number[] {
    const schoolEnc = rec.schoolType === 'Private' ? 1.0 : 0.0;
    const clsNum = parseInt(rec.studentClass.replace('Class ', ''), 10) || 6;
    const clsNorm = (clsNum - 5.0) / 3.0;
    const langEnc = rec.language === 'en' || rec.language === 'English' ? 1.0 : 0.0;
    const rNorm = rec.readingScore / 3.0;
    const mNorm = rec.mathScore / 3.0;
    const lNorm = rec.reasoningScore / 3.0;
    return [schoolEnc, clsNorm, langEnc, rNorm, mNorm, lNorm];
  }

  public forwardSingle(x: number[]) {
    // Layer 1: Z1 = x * W1 + b1, A1 = ReLU(Z1)
    const Z1: number[] = Array(this.h1Dim).fill(0);
    for (let j = 0; j < this.h1Dim; j++) {
      let sum = this.b1[j];
      for (let i = 0; i < this.inputDim; i++) {
        sum += x[i] * this.W1[i][j];
      }
      Z1[j] = sum;
    }
    const A1 = Z1.map(DeepNeuralNetworkMLP.relu);

    // Layer 2: Z2 = A1 * W2 + b2, A2 = ReLU(Z2)
    const Z2: number[] = Array(this.h2Dim).fill(0);
    for (let k = 0; k < this.h2Dim; k++) {
      let sum = this.b2[k];
      for (let j = 0; j < this.h1Dim; j++) {
        sum += A1[j] * this.W2[j][k];
      }
      Z2[k] = sum;
    }
    const A2 = Z2.map(DeepNeuralNetworkMLP.relu);

    // Output Layer: Z3 = A2 * W3 + b3, Probs = Softmax(Z3)
    const Z3: number[] = Array(this.outDim).fill(0);
    for (let o = 0; o < this.outDim; o++) {
      let sum = this.b3[o];
      for (let k = 0; k < this.h2Dim; k++) {
        sum += A2[k] * this.W3[k][o];
      }
      Z3[o] = sum;
    }
    const probs = DeepNeuralNetworkMLP.softmax(Z3);

    return { Z1, A1, Z2, A2, Z3, probs };
  }

  public train(records: AssessmentRecord[], epochs: number = 120, learningRate: number = 0.08): MLPTrainingResult {
    this.initWeights(42);
    const n = Math.max(1, records.length);

    const X = records.map(r => DeepNeuralNetworkMLP.encodeRecordFeatures(r));
    // Target Tier: 0 -> Score 5-6, 1 -> Score 7, 2 -> Score 8-9
    const Y = records.map(r => (r.totalScore <= 6 ? 0 : r.totalScore === 7 ? 1 : 2));

    const lossHistory: number[] = [];
    const accuracyHistory: number[] = [];

    for (let ep = 0; ep < epochs; ep++) {
      let totalLoss = 0;
      let correctCount = 0;

      // Zero gradients
      const dW1 = Array.from({ length: this.inputDim }, () => Array(this.h1Dim).fill(0));
      const db1 = Array(this.h1Dim).fill(0);
      const dW2 = Array.from({ length: this.h1Dim }, () => Array(this.h2Dim).fill(0));
      const db2 = Array(this.h2Dim).fill(0);
      const dW3 = Array.from({ length: this.h2Dim }, () => Array(this.outDim).fill(0));
      const db3 = Array(this.outDim).fill(0);

      for (let idx = 0; idx < n; idx++) {
        const x = X[idx];
        const y = Y[idx];
        const { Z1, A1, Z2, A2, probs } = this.forwardSingle(x);

        // Cross-entropy loss
        totalLoss += -Math.log(Math.max(probs[y], 1e-9));

        const predClass = probs.indexOf(Math.max(...probs));
        if (predClass === y) correctCount++;

        // Backprop Output Layer
        const dZ3 = probs.map((p, o) => (p - (o === y ? 1 : 0)) / n);
        for (let k = 0; k < this.h2Dim; k++) {
          for (let o = 0; o < this.outDim; o++) {
            dW3[k][o] += A2[k] * dZ3[o];
          }
        }
        for (let o = 0; o < this.outDim; o++) db3[o] += dZ3[o];

        // Backprop Hidden Layer 2
        const dZ2 = Array(this.h2Dim).fill(0);
        for (let k = 0; k < this.h2Dim; k++) {
          if (Z2[k] > 0) {
            let sum = 0;
            for (let o = 0; o < this.outDim; o++) sum += dZ3[o] * this.W3[k][o];
            dZ2[k] = sum;
          }
        }
        for (let j = 0; j < this.h1Dim; j++) {
          for (let k = 0; k < this.h2Dim; k++) {
            dW2[j][k] += A1[j] * dZ2[k];
          }
        }
        for (let k = 0; k < this.h2Dim; k++) db2[k] += dZ2[k];

        // Backprop Hidden Layer 1
        const dZ1 = Array(this.h1Dim).fill(0);
        for (let j = 0; j < this.h1Dim; j++) {
          if (Z1[j] > 0) {
            let sum = 0;
            for (let k = 0; k < this.h2Dim; k++) sum += dZ2[k] * this.W2[j][k];
            dZ1[j] = sum;
          }
        }
        for (let i = 0; i < this.inputDim; i++) {
          for (let j = 0; j < this.h1Dim; j++) {
            dW1[i][j] += x[i] * dZ1[j];
          }
        }
        for (let j = 0; j < this.h1Dim; j++) db1[j] += dZ1[j];
      }

      // Gradient Descent Parameter Update
      for (let i = 0; i < this.inputDim; i++) {
        for (let j = 0; j < this.h1Dim; j++) {
          this.W1[i][j] -= learningRate * (dW1[i][j] + 0.001 * this.W1[i][j]);
        }
      }
      for (let j = 0; j < this.h1Dim; j++) this.b1[j] -= learningRate * db1[j];

      for (let j = 0; j < this.h1Dim; j++) {
        for (let k = 0; k < this.h2Dim; k++) {
          this.W2[j][k] -= learningRate * (dW2[j][k] + 0.001 * this.W2[j][k]);
        }
      }
      for (let k = 0; k < this.h2Dim; k++) this.b2[k] -= learningRate * db2[k];

      for (let k = 0; k < this.h2Dim; k++) {
        for (let o = 0; o < this.outDim; o++) {
          this.W3[k][o] -= learningRate * (dW3[k][o] + 0.001 * this.W3[k][o]);
        }
      }
      for (let o = 0; o < this.outDim; o++) this.b3[o] -= learningRate * db3[o];

      lossHistory.push(Number((totalLoss / n).toFixed(4)));
      accuracyHistory.push(Number(((correctCount / n) * 100).toFixed(1)));
    }

    const totalParameters =
      this.inputDim * this.h1Dim +
      this.h1Dim +
      this.h1Dim * this.h2Dim +
      this.h2Dim +
      this.h2Dim * this.outDim +
      this.outDim;

    return {
      epochs,
      learningRate,
      finalLoss: lossHistory[lossHistory.length - 1] || 0,
      finalAccuracy: accuracyHistory[accuracyHistory.length - 1] || 0,
      lossHistory,
      accuracyHistory,
      weightsSummary: {
        w1Shape: '6 × 16 (+16 bias)',
        w2Shape: '16 × 8 (+8 bias)',
        w3Shape: '8 × 3 (+3 bias)',
        totalParameters
      }
    };
  }

  public predictStudent(input: {
    schoolType: SchoolType;
    studentClass: string;
    language: string;
    readingScore: number;
    mathScore: number;
    reasoningScore: number;
  }): MLPPredictionResult {
    const x = DeepNeuralNetworkMLP.encodeRecordFeatures(input);
    const { A1, A2, probs } = this.forwardSingle(x);

    const tierNames = [
      'Developing Mastery Tier (Score 5–6 Band)',
      'Proficient Grade-Level Tier (Score 7 Band)',
      'Advanced Distinction Tier (Score 8–9 Band)'
    ];

    const maxIdx = probs.indexOf(Math.max(...probs)) as 0 | 1 | 2;
    const rawScore = input.readingScore + input.mathScore + input.reasoningScore;
    const nnExpected = probs[0] * 5.5 + probs[1] * 7.0 + probs[2] * 8.5;
    const blendedScore = Number((0.65 * rawScore + 0.35 * nnExpected).toFixed(2));
    const predictedPercentage = Number(((blendedScore / 9) * 100).toFixed(1));

    const recommendations = [
      'Focus on bilingual foundational reading and arithmetic word-problem drills to bridge from 5–6/9 to 7+/9.',
      'Solid grade-level mastery achieved (7/9 band). Introduce multi-step logical reasoning puzzles for advanced growth.',
      'High distinction mastery (8–9/9 band). Ready for peer-mentoring and higher-order analytical problem sets.'
    ];

    return {
      predictedTierIndex: maxIdx,
      predictedTierName: tierNames[maxIdx],
      confidencePct: Number((probs[maxIdx] * 100).toFixed(1)),
      probabilities: {
        developing56: Number((probs[0] * 100).toFixed(1)),
        proficient7: Number((probs[1] * 100).toFixed(1)),
        advanced89: Number((probs[2] * 100).toFixed(1))
      },
      predictedScoreOutOf9: blendedScore,
      predictedPercentage,
      hiddenLayer1Activations: A1.map(v => Number(v.toFixed(2))),
      hiddenLayer2Activations: A2.map(v => Number(v.toFixed(2))),
      inputVector: x.map(v => Number(v.toFixed(2))),
      pedagogicalRecommendation: recommendations[maxIdx]
    };
  }
}
