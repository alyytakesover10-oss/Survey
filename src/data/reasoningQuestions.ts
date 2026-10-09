import { Question } from '../types';

// 150 Reasoning & Problem Solving Questions (L001 - L150)
// Designed for assessing logical reasoning without visual diagrams (accessible to all students)
// Topics: Number patterns, Letter patterns, Odd one out, Classification, Sequences,
// Analogies, Logical ordering, Simple coding/decoding, Direction sense, Everyday problem solving.
// Bilingual: English and Simple school Hindi (सरल हिन्दी)

const baseReasoningQuestions: Question[] = [
  {
    id: 'L001',
    section: 'Reasoning & Problem Solving',
    category: 'Number Patterns',
    questionEn: 'Look at the number series: 5, 10, 15, 20, __. What number comes next?',
    questionHi: 'संख्याओं के इस क्रम को देखें: 5, 10, 15, 20, __। अगला अंक क्या आएगा?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: '22', textHi: '22' },
      { id: 'B', textEn: '25', textHi: '25' },
      { id: 'C', textEn: '30', textHi: '30' },
      { id: 'D', textEn: '35', textHi: '35' }
    ],
    correctAnswer: 'B',
    explanationEn: 'Each number increases by 5. 20 + 5 = 25.',
    explanationHi: 'हर बार 5 जोड़ा जा रहा है: 20 + 5 = 25।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'L002',
    section: 'Reasoning & Problem Solving',
    category: 'Odd One Out',
    questionEn: 'Which of the following does NOT belong with the others: Apple, Banana, Mango, Potato?',
    questionHi: 'इनमें से कौन सा शब्द बाकी तीनों से अलग है: सेब, केला, आम, आलू?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'Apple', textHi: 'सेब' },
      { id: 'B', textEn: 'Banana', textHi: 'केला' },
      { id: 'C', textEn: 'Mango', textHi: 'आम' },
      { id: 'D', textEn: 'Potato', textHi: 'आलू' }
    ],
    correctAnswer: 'D',
    explanationEn: 'Apple, Banana, and Mango are fruits, while Potato is a vegetable/tuber.',
    explanationHi: 'सेब, केला और आम फल हैं, जबकि आलू एक सब्ज़ी है।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'L003',
    section: 'Reasoning & Problem Solving',
    category: 'Analogies',
    questionEn: 'Doctor is to Hospital as Teacher is to: ?',
    questionHi: 'जिस प्रकार डॉक्टर का संबंध अस्पताल से है, उसी प्रकार शिक्षक का संबंध किससे है?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'Bank', textHi: 'बैंक' },
      { id: 'B', textEn: 'School', textHi: 'स्कूल' },
      { id: 'C', textEn: 'Market', textHi: 'बाज़ार' },
      { id: 'D', textEn: 'Court', textHi: 'अदालत' }
    ],
    correctAnswer: 'B',
    explanationEn: 'A doctor works in a hospital, and a teacher works in a school.',
    explanationHi: 'डॉक्टर अस्पताल में काम करते हैं और शिक्षक स्कूल में पढ़ाते हैं।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'L004',
    section: 'Reasoning & Problem Solving',
    category: 'Direction Sense',
    questionEn: 'If you are standing facing the rising sun in the morning, which direction is to your left side?',
    questionHi: 'यदि आप सुबह उगते हुए सूरज की तरफ मुँह करके खड़े हैं, तो आपकी बाईं (लेफ्ट) तरफ कौन सी दिशा होगी?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'North', textHi: 'उत्तर' },
      { id: 'B', textEn: 'South', textHi: 'दक्षिण' },
      { id: 'C', textEn: 'West', textHi: 'पश्चिम' },
      { id: 'D', textEn: 'East', textHi: 'पूर्व' }
    ],
    correctAnswer: 'A',
    explanationEn: 'Facing East (rising sun), your left hand points North, right hand points South, back points West.',
    explanationHi: 'पूर्व दिशा (सूरज) की तरफ मुँह करने पर बायाँ हाथ उत्तर दिशा की ओर होता है।',
    difficulty: 'Medium',
    marks: 1
  },
  {
    id: 'L005',
    section: 'Reasoning & Problem Solving',
    category: 'Letter Patterns',
    questionEn: 'Look at the letters: A, C, E, G, __. What letter comes next in the sequence?',
    questionHi: 'अंग्रेजी वर्णमाला के इस क्रम को देखें: A, C, E, G, __। अगला अक्षर क्या होगा?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'H', textHi: 'H' },
      { id: 'B', textEn: 'I', textHi: 'I' },
      { id: 'C', textEn: 'J', textHi: 'J' },
      { id: 'D', textEn: 'K', textHi: 'K' }
    ],
    correctAnswer: 'B',
    explanationEn: 'Each step skips one letter (A + 2 = C, C + 2 = E, E + 2 = G, G + 2 = I).',
    explanationHi: 'एक-एक अक्षर छोड़कर आगे बढ़ रहे हैं: G के बाद H छोड़कर I आएगा।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'L006',
    section: 'Reasoning & Problem Solving',
    category: 'Comparison Problems',
    questionEn: 'Aman is taller than Binod. Binod is taller than Chetan. Who is the tallest among the three?',
    questionHi: 'अमन, बिनोद से लंबा है। बिनोद, चेतन से लंबा है। इन तीनों में सबसे लंबा कौन है?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'Aman', textHi: 'अमन' },
      { id: 'B', textEn: 'Binod', textHi: 'बिनोद' },
      { id: 'C', textEn: 'Chetan', textHi: 'चेतन' },
      { id: 'D', textEn: 'All are equal', textHi: 'सभी बराबर हैं' }
    ],
    correctAnswer: 'A',
    explanationEn: 'Aman > Binod > Chetan, so Aman is the tallest.',
    explanationHi: 'अमन > बिनोद > चेतन। अतः अमन सबसे लंबा है।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'L007',
    section: 'Reasoning & Problem Solving',
    category: 'Simple Coding',
    questionEn: 'If in a secret code "CAT" is written as "DBU" (each letter replaced by the next letter), how will "DOG" be written?',
    questionHi: 'यदि किसी गुप्त कोड में "CAT" को "DBU" लिखा जाता है (प्रत्येक अक्षर के स्थान पर अगला अक्षर), तो "DOG" को कैसे लिखा जाएगा?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'EPH', textHi: 'EPH' },
      { id: 'B', textEn: 'EQH', textHi: 'EQH' },
      { id: 'C', textEn: 'FPI', textHi: 'FPI' },
      { id: 'D', textEn: 'COF', textHi: 'COF' }
    ],
    correctAnswer: 'A',
    explanationEn: 'D + 1 = E, O + 1 = P, G + 1 = H. So DOG becomes EPH.',
    explanationHi: 'D का अगला अक्षर E, O का अगला P, G का अगला H। अतः DOG बनेगा EPH।',
    difficulty: 'Medium',
    marks: 1
  },
  {
    id: 'L008',
    section: 'Reasoning & Problem Solving',
    category: 'Logical Ordering',
    questionEn: 'Arrange in natural order: 1. Seed, 2. Fruit, 3. Plant, 4. Flower. Which is the correct order?',
    questionHi: 'इन्हें प्राकृतिक क्रम में लगाइए: 1. बीज, 2. फल, 3. पौधा, 4. फूल। सही क्रम क्या है?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: '1, 3, 4, 2', textHi: '1, 3, 4, 2' },
      { id: 'B', textEn: '1, 2, 3, 4', textHi: '1, 2, 3, 4' },
      { id: 'C', textEn: '3, 1, 4, 2', textHi: '3, 1, 4, 2' },
      { id: 'D', textEn: '4, 2, 1, 3', textHi: '4, 2, 1, 3' }
    ],
    correctAnswer: 'A',
    explanationEn: 'First is Seed (1), then grows into Plant (3), blooms into Flower (4), and yields Fruit (2).',
    explanationHi: 'पहले बीज (1), फिर पौधा (3), फिर फूल (4), और अंत में फल (2)। क्रम = 1, 3, 4, 2।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'L009',
    section: 'Reasoning & Problem Solving',
    category: 'Simple Deduction',
    questionEn: 'All sparrows are birds. All birds have feathers. What can we conclude about sparrows?',
    questionHi: 'सभी गौरैया पक्षी हैं। सभी पक्षियों के पंख होते हैं। गौरैया के बारे में क्या निष्कर्ष निकलता है?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'Sparrows have feathers', textHi: 'गौरैया के पंख होते हैं' },
      { id: 'B', textEn: 'Sparrows cannot fly', textHi: 'गौरैया उड़ नहीं सकती' },
      { id: 'C', textEn: 'Sparrows are reptiles', textHi: 'गौरैया रेंगने वाले जीव हैं' },
      { id: 'D', textEn: 'Sparrows do not eat food', textHi: 'गौरैया खाना नहीं खाती' }
    ],
    correctAnswer: 'A',
    explanationEn: 'Since all sparrows are birds and all birds have feathers, sparrows must have feathers.',
    explanationHi: 'क्योंकि सभी पक्षियों के पंख होते हैं और गौरैया पक्षी है, इसलिए गौरैया के भी पंख होते हैं।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'L010',
    section: 'Reasoning & Problem Solving',
    category: 'Everyday Problem Solving',
    questionEn: 'A candle burns completely in 2 hours. If you light 3 candles of the exact same type at the exact same time, how long will they burn?',
    questionHi: 'एक मोमबत्ती पूरी जलने में 2 घंटे लेती है। यदि उसी तरह की 3 मोमबत्तियाँ एक साथ जलाई जाएँ, तो वे कुल कितने समय तक जलेंगी?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: '2 hours', textHi: '2 घंटे' },
      { id: 'B', textEn: '6 hours', textHi: '6 घंटे' },
      { id: 'C', textEn: '1 hour', textHi: '1 घंटा' },
      { id: 'D', textEn: '3 hours', textHi: '3 घंटे' }
    ],
    correctAnswer: 'A',
    explanationEn: 'All 3 candles burn simultaneously, so they will all burn out together in 2 hours.',
    explanationHi: 'तीनों मोमबत्तियाँ एक साथ जल रही हैं, इसलिए वे 2 घंटे में ही एक साथ खत्म होंगी।',
    difficulty: 'Medium',
    marks: 1
  }
];

// Generate L011 to L150 systematically covering all required reasoning areas
const reasoningBlueprints = [
  // 1. Double number sequence (2, 4, 8, 16...)
  {
    cat: 'Number Patterns',
    create: (n: number) => {
      const start = 2 + (n % 4);
      const s1 = start;
      const s2 = start * 2;
      const s3 = start * 4;
      const next = start * 8;
      return {
        en: `Find the next number in this sequence: ${s1}, ${s2}, ${s3}, __?`,
        hi: `इस संख्या क्रम का अगला अंक ज्ञात करें: ${s1}, ${s2}, ${s3}, __?`,
        correct: `${next}`,
        correctHi: `${next}`,
        wrongs: [`${next - 2}`, `${next + 4}`, `${next * 2}`],
        wrongsHi: [`${next - 2}`, `${next + 4}`, `${next * 2}`],
        expEn: `Each number doubles the previous one. ${s3} × 2 = ${next}.`,
        expHi: `हर संख्या पिछली संख्या की दुगुनी है: ${s3} × 2 = ${next}।`,
        diff: 'Medium' as const
      };
    }
  },
  // 2. Odd one out - Animals vs Birds
  {
    cat: 'Odd One Out',
    create: (n: number) => {
      const sets = [
        { oddEn: 'Cow', oddHi: 'गाय', othersEn: ['Crow', 'Parrot', 'Pigeon'], othersHi: ['कौआ', 'तोता', 'कबूतर'], reasonEn: 'Cow is a mammal/quadruped, others are birds', reasonHi: 'गाय चार पैरों वाला जानवर है, बाकी सब पक्षी हैं' },
        { oddEn: 'Shark', oddHi: 'शार्क (मछली)', othersEn: ['Lion', 'Deer', 'Elephant'], othersHi: ['शेर', 'हिरण', 'हाथी'], reasonEn: 'Shark lives in water, others live on land', reasonHi: 'शार्क पानी में रहती है, बाकी ज़मीन के जानवर हैं' },
        { oddEn: 'Carrot', oddHi: 'गाजर', othersEn: ['Rose', 'Marigold', 'Jasmine'], othersHi: ['गुलाब', 'गेंदा', 'चमेली'], reasonEn: 'Carrot is a root vegetable, others are flowers', reasonHi: 'गाजर एक सब्ज़ी है, बाकी सब फूल हैं' },
        { oddEn: 'Book', oddHi: 'किताब', othersEn: ['Plate', 'Bowl', 'Spoon'], othersHi: ['थाली', 'कटोरी', 'चम्मच'], reasonEn: 'Book is for reading, others are eating utensils', reasonHi: 'किताब पढ़ने के लिए है, बाकी बर्तन हैं' }
      ];
      const selected = sets[n % sets.length];
      return {
        en: `Which of the following is the odd one out: ${selected.othersEn.join(', ')}, ${selected.oddEn}?`,
        hi: `इनमें से कौन सा सबसे अलग है: ${selected.othersHi.join(', ')}, ${selected.oddHi}?`,
        correct: selected.oddEn,
        correctHi: selected.oddHi,
        wrongs: selected.othersEn,
        wrongsHi: selected.othersHi,
        expEn: selected.reasonEn,
        expHi: selected.reasonHi,
        diff: 'Easy' as const
      };
    }
  },
  // 3. Simple Analogies
  {
    cat: 'Analogies',
    create: (n: number) => {
      const analogies = [
        { a: 'Fish', aHi: 'मछली', b: 'Water', bHi: 'पानी', c: 'Bird', cHi: 'पक्षी', d: 'Sky / Air', dHi: 'आसमान / हवा', w: ['Ground', 'Cave', 'Pond'], wHi: ['ज़मीन', 'गुफा', 'तालाब'] },
        { a: 'Pen', aHi: 'कलम', b: 'Write', bHi: 'लिखना', c: 'Knife', cHi: 'चाकू', d: 'Cut', dHi: 'काटना', w: ['Drink', 'Sleep', 'Run'], wHi: ['पीना', 'सोना', 'दौड़ना'] },
        { a: 'Sun', aHi: 'सूरज', b: 'Day', bHi: 'दिन', c: 'Moon', cHi: 'चाँद', d: 'Night', dHi: 'रात', w: ['Morning', 'Afternoon', 'Dawn'], wHi: ['सुबह', 'दोपहर', 'भोर'] },
        { a: 'Eye', aHi: 'आँख', b: 'See', bHi: 'देखना', c: 'Ear', cHi: 'कान', d: 'Hear', dHi: 'सुनना', w: ['Walk', 'Breathe', 'Chew'], wHi: ['चलना', 'साँस लेना', 'चबाना'] }
      ];
      const sel = analogies[n % analogies.length];
      return {
        en: `${sel.a} is to ${sel.b} as ${sel.c} is to: ?`,
        hi: `जिस प्रकार ${sel.aHi} का संबंध ${sel.bHi} से है, उसी प्रकार ${sel.cHi} का संबंध किससे है?`,
        correct: sel.d,
        correctHi: sel.dHi,
        wrongs: sel.w,
        wrongsHi: sel.wHi,
        expEn: `${sel.a} is associated with ${sel.b}, just as ${sel.c} is with ${sel.d}.`,
        expHi: `${sel.aHi} का संबंध ${sel.bHi} से है, तो ${sel.cHi} का संबंध ${sel.dHi} से होगा।`,
        diff: 'Easy' as const
      };
    }
  },
  // 4. Age and Comparison problem
  {
    cat: 'Comparison Problems',
    create: (n: number) => {
      const diff = 2 + (n % 4);
      const ageAman = 10 + (n % 5);
      const ageRamesh = ageAman + diff;
      return {
        en: `Ramesh is ${diff} years older than Aman. If Aman is ${ageAman} years old, how old is Ramesh?`,
        hi: `रमेश, अमन से ${diff} साल बड़ा है। यदि अमन की उम्र ${ageAman} वर्ष है, तो रमेश की उम्र क्या होगी?`,
        correct: `${ageRamesh} years`,
        correctHi: `${ageRamesh} वर्ष`,
        wrongs: [`${ageAman - diff} years`, `${ageAman} years`, `${ageRamesh + 2} years`],
        wrongsHi: [`${ageAman - diff} वर्ष`, `${ageAman} वर्ष`, `${ageRamesh + 2} वर्ष`],
        expEn: `Ramesh = Aman's age + ${diff} = ${ageAman} + ${diff} = ${ageRamesh} years.`,
        expHi: `रमेश की उम्र = ${ageAman} + ${diff} = ${ageRamesh} वर्ष।`,
        diff: 'Easy' as const
      };
    }
  },
  // 5. Letter sequence backward
  {
    cat: 'Letter Patterns',
    create: (n: number) => {
      const triplets = [
        { seq: 'Z, Y, X, W', next: 'V', w: ['U', 'T', 'S'] },
        { seq: 'M, L, K, J', next: 'I', w: ['H', 'G', 'F'] },
        { seq: 'P, O, N, M', next: 'L', w: ['K', 'J', 'I'] },
        { seq: 'E, D, C, B', next: 'A', w: ['Z', 'X', 'Y'] }
      ];
      const sel = triplets[n % triplets.length];
      return {
        en: `What is the next letter going backwards: ${sel.seq}, __?`,
        hi: `उल्टे क्रम में अगला अक्षर क्या होगा: ${sel.seq}, __?`,
        correct: sel.next,
        correctHi: sel.next,
        wrongs: sel.w,
        wrongsHi: sel.w,
        expEn: `Letters are progressing in reverse alphabetical order. The next is ${sel.next}.`,
        expHi: `अक्षर वर्णमाला के उल्टे क्रम में चल रहे हैं। अगला अक्षर ${sel.next} है।`,
        diff: 'Medium' as const
      };
    }
  },
  // 6. Day of the week problem
  {
    cat: 'Everyday Problem Solving',
    create: (n: number) => {
      const days = [
        { today: 'Monday', todayHi: 'सोमवार', after: 2, res: 'Wednesday', resHi: 'बुधवार', w: ['Tuesday', 'Thursday', 'Friday'], wHi: ['मंगलवार', 'गुरुवार', 'शुक्रवार'] },
        { today: 'Friday', todayHi: 'शुक्रवार', after: 3, res: 'Monday', resHi: 'सोमवार', w: ['Saturday', 'Sunday', 'Tuesday'], wHi: ['शनिवार', 'रविवार', 'मंगलवार'] },
        { today: 'Wednesday', todayHi: 'बुधवार', after: 1, res: 'Thursday', resHi: 'गुरुवार', w: ['Friday', 'Saturday', 'Tuesday'], wHi: ['शुक्रवार', 'शनिवार', 'मंगलवार'] },
        { today: 'Saturday', todayHi: 'शनिवार', after: 2, res: 'Monday', resHi: 'सोमवार', w: ['Sunday', 'Tuesday', 'Wednesday'], wHi: ['रविवार', 'मंगलवार', 'बुधवार'] }
      ];
      const sel = days[n % days.length];
      return {
        en: `If today is ${sel.today}, which day will it be after ${sel.after} days?`,
        hi: `यदि आज ${sel.todayHi} है, तो ${sel.after} दिन बाद कौन सा दिन होगा?`,
        correct: sel.res,
        correctHi: sel.resHi,
        wrongs: sel.w,
        wrongsHi: sel.wHi,
        expEn: `Counting forward ${sel.after} days from ${sel.today} gives ${sel.res}.`,
        expHi: `${sel.todayHi} से ${sel.after} दिन आगे गिनने पर ${sel.resHi} आता है।`,
        diff: 'Easy' as const
      };
    }
  },
  // 7. Logical arrangement
  {
    cat: 'Logical Ordering',
    create: (n: number) => {
      return {
        en: 'Arrange by size from smallest to largest: 1. Village, 2. Country, 3. House, 4. State. What is the correct order?',
        hi: 'छोटे से बड़े के सही क्रम में लगाएँ: 1. गाँव, 2. देश, 3. घर, 4. राज्य। सही क्रम क्या है?',
        correct: '3, 1, 4, 2',
        correctHi: '3, 1, 4, 2',
        wrongs: ['1, 3, 4, 2', '3, 4, 1, 2', '2, 4, 1, 3'],
        wrongsHi: ['1, 3, 4, 2', '3, 4, 1, 2', '2, 4, 1, 3'],
        expEn: 'House (3) is inside Village (1), which is inside State (4), inside Country (2).',
        expHi: 'सबसे छोटा घर (3), फिर गाँव (1), फिर राज्य (4), और सबसे बड़ा देश (2)।',
        diff: 'Medium' as const
      };
    }
  },
  // 8. Number sequence addition
  {
    cat: 'Number Patterns',
    create: (n: number) => {
      const step = 3 + (n % 4);
      const start = 7;
      const v1 = start;
      const v2 = v1 + step;
      const v3 = v2 + step;
      const next = v3 + step;
      return {
        en: `Find the missing number in the series: ${v1}, ${v2}, ${v3}, __?`,
        hi: `इस श्रेणी में छूटी हुई संख्या ज्ञात कीजिए: ${v1}, ${v2}, ${v3}, __?`,
        correct: `${next}`,
        correctHi: `${next}`,
        wrongs: [`${next - 1}`, `${next + 2}`, `${next + step}`],
        wrongsHi: [`${next - 1}`, `${next + 2}`, `${next + step}`],
        expEn: `Common difference is ${step}. Next number is ${v3} + ${step} = ${next}.`,
        expHi: `प्रत्येक पद में ${step} जोड़ा जा रहा है: ${v3} + ${step} = ${next}।`,
        diff: 'Easy' as const
      };
    }
  },
  // 9. Simple Clock Problem
  {
    cat: 'Everyday Problem Solving',
    create: (n: number) => {
      const times = [
        { h: 3, m: '00', deg: '90 degrees (Right angle)', degHi: '90 डिग्री (समकोण)', w: ['180 degrees', '45 degrees', '0 degrees'], wHi: ['180 डिग्री', '45 डिग्री', '0 डिग्री'] },
        { h: 6, m: '00', deg: '180 degrees (Straight angle)', degHi: '180 डिग्री (सीधा कोण)', w: ['90 degrees', '360 degrees', '60 degrees'], wHi: ['90 डिग्री', '360 डिग्री', '60 डिग्री'] },
        { h: 9, m: '00', deg: '90 degrees (Right angle)', degHi: '90 डिग्री (समकोण)', w: ['120 degrees', '180 degrees', '30 degrees'], wHi: ['120 डिग्री', '180 डिग्री', '30 डिग्री'] }
      ];
      const sel = times[n % times.length];
      return {
        en: `At ${sel.h}:${sel.m} on a standard wall clock, what angle do the hour and minute hands form?`,
        hi: `दीवार घड़ी में ठीक ${sel.h}:${sel.m} बजे घंटे और मिनट की सुइयों के बीच कितने अंश का कोण बनता है?`,
        correct: sel.deg,
        correctHi: sel.degHi,
        wrongs: sel.w,
        wrongsHi: sel.wHi,
        expEn: `At ${sel.h}:${sel.m}, the hands are perpendicular or collinear making ${sel.deg}.`,
        expHi: `घड़ी में ठीक ${sel.h}:${sel.m} बजे सुइयाँ ${sel.degHi} बनाती हैं।`,
        diff: 'Medium' as const
      };
    }
  },
  // 10. Simple Code Replacement
  {
    cat: 'Simple Coding',
    create: (n: number) => {
      return {
        en: 'If RED is coded as 3 (number of letters), BLUE is coded as 4, what is the code for GREEN?',
        hi: 'यदि अक्षरों की संख्या के आधार पर RED का कोड 3 और BLUE का कोड 4 है, तो GREEN का कोड क्या होगा?',
        correct: '5',
        correctHi: '5',
        wrongs: ['4', '6', '7'],
        wrongsHi: ['4', '6', '7'],
        expEn: 'GREEN contains 5 letters, so its code is 5.',
        expHi: 'GREEN में 5 अक्षर हैं (G-R-E-E-N), इसलिए इसका कोड 5 होगा।',
        diff: 'Easy' as const
      };
    }
  }
];

const generatedReasoningQuestions: Question[] = [];

for (let i = 11; i <= 150; i++) {
  const bpIdx = (i - 11) % reasoningBlueprints.length;
  const bp = reasoningBlueprints[bpIdx];
  const qNumStr = i < 100 ? `L0${i}` : `L${i}`;
  const generated = bp.create(i);

  // Distribute correct answer evenly across A, B, C, D
  const correctTarget = (['A', 'B', 'C', 'D'] as const)[(i * 2 + 3) % 4];
  const correctOpt = { en: generated.correct, hi: generated.correctHi };
  const wrongOpts = [
    { en: generated.wrongs[0], hi: generated.wrongsHi[0] },
    { en: generated.wrongs[1], hi: generated.wrongsHi[1] },
    { en: generated.wrongs[2], hi: generated.wrongsHi[2] }
  ];

  const finalOpts: [
    { id: 'A'; textEn: string; textHi: string },
    { id: 'B'; textEn: string; textHi: string },
    { id: 'C'; textEn: string; textHi: string },
    { id: 'D'; textEn: string; textHi: string }
  ] = [
    { id: 'A', textEn: '', textHi: '' },
    { id: 'B', textEn: '', textHi: '' },
    { id: 'C', textEn: '', textHi: '' },
    { id: 'D', textEn: '', textHi: '' }
  ];

  let wrongIdx = 0;
  (['A', 'B', 'C', 'D'] as const).forEach((optId, idx) => {
    if (optId === correctTarget) {
      finalOpts[idx] = { id: optId, textEn: correctOpt.en, textHi: correctOpt.hi };
    } else {
      finalOpts[idx] = { id: optId, textEn: wrongOpts[wrongIdx].en, textHi: wrongOpts[wrongIdx].hi };
      wrongIdx++;
    }
  });

  generatedReasoningQuestions.push({
    id: qNumStr,
    section: 'Reasoning & Problem Solving',
    category: bp.cat,
    questionEn: generated.en,
    questionHi: generated.hi,
    type: 'mcq',
    options: finalOpts,
    correctAnswer: correctTarget,
    explanationEn: generated.expEn,
    explanationHi: generated.expHi,
    difficulty: generated.diff,
    marks: 1
  });
}

export const allReasoningQuestions: Question[] = [
  ...baseReasoningQuestions,
  ...generatedReasoningQuestions
];
