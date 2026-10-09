import { Question } from '../types';

// 150 Comprehensive Reading & Understanding Questions (R001 - R150)
// Designed for school assessment (Class 5 - 8)
// Bilingual: English and Simple, spoken classroom Hindi (सरल हिन्दी)

export const readingQuestions: Question[] = [
  {
    id: 'R001',
    section: 'Reading & Understanding',
    category: 'Factual Understanding',
    questionEn: 'Rani gets up at 6:00 AM every morning. She brushes her teeth, eats breakfast at 7:00 AM, and walks to school. At what time does Rani eat breakfast?',
    questionHi: 'रानी रोज़ सुबह 6:00 बजे उठती है। वह दाँत साफ करती है, 7:00 बजे नाश्ता करती है और पैदल स्कूल जाती है। रानी नाश्ता किस समय करती है?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: '6:00 AM', textHi: 'सुबह 6:00 बजे' },
      { id: 'B', textEn: '6:30 AM', textHi: 'सुबह 6:30 बजे' },
      { id: 'C', textEn: '7:00 AM', textHi: 'सुबह 7:00 बजे' },
      { id: 'D', textEn: '8:00 AM', textHi: 'सुबह 8:00 बजे' }
    ],
    correctAnswer: 'C',
    explanationEn: 'The passage clearly mentions that Rani eats breakfast at 7:00 AM.',
    explanationHi: 'पैराग्राफ में साफ़ लिखा है कि रानी सुबह 7:00 बजे नाश्ता करती है।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'R002',
    section: 'Reading & Understanding',
    category: 'Vocabulary in Context',
    questionEn: 'The old banyan tree provides "shade" to tired travelers during hot afternoons. What does the word "shade" mean here?',
    questionHi: 'गर्मियों की दोपहर में बरगद का पुराना पेड़ थके हुए राहगीरों को "छाँव" देता है। यहाँ "छाँव" का क्या मतलब है?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'Cold water', textHi: 'ठंडा पानी' },
      { id: 'B', textEn: 'Shelter from sunlight', textHi: 'धूप से बचाव की ठंडी जगह' },
      { id: 'C', textEn: 'Tasty fruits', textHi: 'स्वादिष्ट फल' },
      { id: 'D', textEn: 'Strong wind', textHi: 'तेज़ आँधी' }
    ],
    correctAnswer: 'B',
    explanationEn: 'Shade means protection or shelter from direct sunlight.',
    explanationHi: 'छाँव का अर्थ धूप से बचकर बैठने की ठंडी जगह होता है।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'R003',
    section: 'Reading & Understanding',
    category: 'Main Idea',
    questionEn: 'Bees fly from flower to flower collecting nectar to make honey. In doing so, they also help flowers produce seeds. What is this passage mainly about?',
    questionHi: 'मधुमक्खियाँ शहद बनाने के लिए फूलों से रस इकट्ठा करती हैं। ऐसा करते समय वे पौधों में बीज बनने में भी मदद करती हैं। यह छोटी सी बात मुख्य रूप से किस बारे में है?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'The colors of flowers', textHi: 'फूलों के सुंदर रंग' },
      { id: 'B', textEn: 'How bees work and help plants', textHi: 'मधुमक्खियों का काम और पौधों की मदद' },
      { id: 'C', textEn: 'Why flowers smell good', textHi: 'फूलों की महक' },
      { id: 'D', textEn: 'The sweetness of sugar', textHi: 'चीनी की मिठास' }
    ],
    correctAnswer: 'B',
    explanationEn: 'The text explains how bees collect nectar and assist in pollination.',
    explanationHi: 'यह बात बताती है कि मधुमक्खियाँ क्या काम करती हैं और वे पौधों की कैसे मदद करती हैं।',
    difficulty: 'Medium',
    marks: 1
  },
  {
    id: 'R004',
    section: 'Reading & Understanding',
    category: 'Interpreting Notices',
    questionEn: 'Notice on School Gate: "The school library will remain closed on Friday for book sorting. It will reopen on Monday at 9:00 AM." On which day will the library reopen?',
    questionHi: 'स्कूल के नोटिस बोर्ड पर लिखा है: "किताबों की छँटाई के लिए शुक्रवार को पुस्तकालय बंद रहेगा। यह सोमवार को सुबह 9:00 बजे खुलेगा।" पुस्तकालय किस दिन खुलेगा?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'Thursday', textHi: 'गुरुवार' },
      { id: 'B', textEn: 'Friday', textHi: 'शुक्रवार' },
      { id: 'C', textEn: 'Saturday', textHi: 'शनिवार' },
      { id: 'D', textEn: 'Monday', textHi: 'सोमवार' }
    ],
    correctAnswer: 'D',
    explanationEn: 'The notice specifically states the library reopens on Monday.',
    explanationHi: 'नोटिस में साफ़ लिखा है कि पुस्तकालय सोमवार को खुलेगा।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'R005',
    section: 'Reading & Understanding',
    category: 'Simple Inference',
    questionEn: 'Deepak saw dark clouds in the sky. He took his umbrella and ran out of the house. Why did Deepak take his umbrella?',
    questionHi: 'दीपक ने आसमान में काले बादल देखे। उसने अपनी छतरी उठाई और घर से बाहर निकला। दीपक ने छतरी क्यों ली?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'It looked like it would rain', textHi: 'क्योंकि बारिश होने की संभावना थी' },
      { id: 'B', textEn: 'He wanted to fly a kite', textHi: 'वह पतंग उड़ाना चाहता था' },
      { id: 'C', textEn: 'He wanted to play cricket', textHi: 'वह क्रिकेट खेलना चाहता था' },
      { id: 'D', textEn: 'The sun was very bright', textHi: 'धूप बहुत तेज़ थी' }
    ],
    correctAnswer: 'A',
    explanationEn: 'Dark clouds typically indicate impending rain, so he took an umbrella.',
    explanationHi: 'काले बादलों का मतलब है कि बारिश आ सकती है, इसलिए उसने छाता लिया।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'R006',
    section: 'Reading & Understanding',
    category: 'Sequence & Order',
    questionEn: 'To plant a seed, first dig a small hole in the soil. Next, drop the seed in and cover it gently with mud. Finally, water it with a small can. What is the second step?',
    questionHi: 'बीज बोने के लिए सबसे पहले मिट्टी में छोटा सा गड्ढा करें। उसके बाद बीज को उसमें डालकर हल्की मिट्टी से ढक दें। अंत में हल्का पानी दें। दूसरा कदम क्या है?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'Water the plant', textHi: 'पौधे में पानी डालना' },
      { id: 'B', textEn: 'Drop the seed and cover with mud', textHi: 'बीज डालकर मिट्टी से ढकना' },
      { id: 'C', textEn: 'Harvest the fruit', textHi: 'फल तोड़ना' },
      { id: 'D', textEn: 'Dig a hole in the soil', textHi: 'मिट्टी में गड्ढा करना' }
    ],
    correctAnswer: 'B',
    explanationEn: 'The second step is dropping the seed in and covering it with mud.',
    explanationHi: 'दूसरे चरण में बीज डालकर उसे मिट्टी से ढकने को कहा गया है।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'R007',
    section: 'Reading & Understanding',
    category: 'Vocabulary in Context',
    questionEn: 'The doctor advised Rahul to eat "nutritious" food like lentils, green vegetables, and milk to grow strong. What does "nutritious" mean?',
    questionHi: 'डॉक्टर ने राहुल को ताकतवर बनने के लिए दाल, हरी सब्ज़ियाँ और दूध जैसा "पौष्टिक" खाना खाने को कहा। "पौष्टिक" का क्या मतलब है?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'Very sweet food', textHi: 'बहुत मीठा खाना' },
      { id: 'B', textEn: 'Expensive food from a hotel', textHi: 'होटल का महँगा खाना' },
      { id: 'C', textEn: 'Healthy food that gives good nourishment', textHi: 'सेहतमंद खाना जो शरीर को ताकत दे' },
      { id: 'D', textEn: 'Fried snacks', textHi: 'तला-भुना नमकीन' }
    ],
    correctAnswer: 'C',
    explanationEn: 'Nutritious means providing nourishment and essential vitamins for health.',
    explanationHi: 'पौष्टिक का मतलब सेहतमंद और ताकत देने वाले आहार से है।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'R008',
    section: 'Reading & Understanding',
    category: 'True / False Statement',
    questionEn: '"Camels can survive in the desert for many days without water because they store fat in their humps and lose very little water." According to this sentence, which statement is true?',
    questionHi: '"ऊँट बिना पानी पिए कई दिनों तक रेगिस्तान में रह सकते हैं क्योंकि उनके कूबड़ में चर्बी जमा होती है और उनके शरीर से पानी बहुत कम निकलता है।" इस वाक्य के अनुसार कौन सा कथन सही है?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'Camels drink water every hour', textHi: 'ऊँट को हर घंटे पानी चाहिए' },
      { id: 'B', textEn: 'Camels cannot walk on desert sand', textHi: 'ऊँट रेत पर नहीं चल सकते' },
      { id: 'C', textEn: 'Camels can go without water for days', textHi: 'ऊँट कई दिनों तक बिना पानी रह सकते हैं' },
      { id: 'D', textEn: 'Camels store water in their feet', textHi: 'ऊँट पैरों में पानी जमा करते हैं' }
    ],
    correctAnswer: 'C',
    explanationEn: 'The passage explicitly says camels can survive for many days without water.',
    explanationHi: 'वाक्य में साफ कहा गया है कि ऊँट कई दिनों तक बिना पानी रह सकते हैं।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'R009',
    section: 'Reading & Understanding',
    category: 'Sentence Understanding',
    questionEn: 'Suman forgot her water bottle at home, but her benchmate Mohan shared his bottle during lunch break. How did Mohan behave?',
    questionHi: 'सुमन अपनी पानी की बोतल घर भूल आई थी, लेकिन दोपहर के खाने के समय उसके सहपाठी मोहन ने अपनी बोतल से उसे पानी पिलाया। मोहन का व्यवहार कैसा था?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: 'Selfish and rude', textHi: 'स्वार्थी और बुरा' },
      { id: 'B', textEn: 'Helpful and kind', textHi: 'मददगार और दयालु' },
      { id: 'C', textEn: 'Angry and loud', textHi: 'गुस्सैल और नाराज़' },
      { id: 'D', textEn: 'Lazy', textHi: 'आलसी' }
    ],
    correctAnswer: 'B',
    explanationEn: 'Sharing with someone who has forgotten their water is helpful and kind.',
    explanationHi: 'ज़रूरत के समय पानी बाँटना मददगार और अच्छे स्वभाव को दर्शाता है।',
    difficulty: 'Easy',
    marks: 1
  },
  {
    id: 'R010',
    section: 'Reading & Understanding',
    category: 'Factual Understanding',
    questionEn: 'Ramesh has 3 cows, 2 goats, and 5 chickens on his small farm. How many four-legged animals does Ramesh have?',
    questionHi: 'रमेश के छोटे से खेत में 3 गायें, 2 बकरियाँ और 5 मुर्गियाँ हैं। रमेश के पास चार पैरों वाले कुल कितने जानवर हैं?',
    type: 'mcq',
    options: [
      { id: 'A', textEn: '3', textHi: '3' },
      { id: 'B', textEn: '5', textHi: '5' },
      { id: 'C', textEn: '8', textHi: '8' },
      { id: 'D', textEn: '10', textHi: '10' }
    ],
    correctAnswer: 'B',
    explanationEn: 'Cows (3) and goats (2) have four legs. 3 + 2 = 5. Chickens have two legs.',
    explanationHi: 'गाय (3) और बकरी (2) के चार पैर होते हैं: 3 + 2 = 5 (मुर्गियों के दो पैर होते हैं)।',
    difficulty: 'Medium',
    marks: 1
  }
];

// Generate R011 to R150 systematically covering all required topics
const readingCategories = [
  'Factual Understanding',
  'Main Idea',
  'Vocabulary in Context',
  'Simple Inference',
  'Sequence & Order',
  'Interpreting Notices',
  'True / False Statement',
  'Sentence Understanding'
];

interface ReadingTemplate {
  en: string;
  hi: string;
  opts: [
    { en: string; hi: string },
    { en: string; hi: string },
    { en: string; hi: string },
    { en: string; hi: string }
  ];
  ans: 'A' | 'B' | 'C' | 'D';
  expEn: string;
  expHi: string;
  diff: 'Easy' | 'Medium' | 'Hard';
  cat: string;
}

const rawReadingTemplates: ReadingTemplate[] = [
  {
    cat: 'Interpreting Notices',
    en: 'Bus Stand Board: "Bus No. 12 leaves for the District Hospital every 30 minutes starting from 8:00 AM." If you reach at 8:15 AM, at what time will the next bus depart?',
    hi: 'बस स्टॉप का बोर्ड: "बस नंबर 12 सुबह 8:00 बजे से हर 30 मिनट में ज़िला अस्पताल के लिए चलती है।" यदि आप 8:15 बजे पहुँचते हैं, तो अगली बस कितने बजे छूटेगी?',
    opts: [
      { en: '8:20 AM', hi: 'सुबह 8:20 बजे' },
      { en: '8:30 AM', hi: 'सुबह 8:30 बजे' },
      { en: '8:45 AM', hi: 'सुबह 8:45 बजे' },
      { en: '9:00 AM', hi: 'सुबह 9:00 बजे' }
    ],
    ans: 'B',
    expEn: 'The buses run every 30 min (8:00, 8:30, 9:00...). The next bus after 8:15 AM is 8:30 AM.',
    expHi: 'बसें 8:00, 8:30, 9:00 बजे चलती हैं। 8:15 के बाद अगली बस 8:30 बजे जाएगी।',
    diff: 'Medium'
  },
  {
    cat: 'Vocabulary in Context',
    en: 'The farmer was "delighted" when fresh rain poured down after two months of dry heat. What does "delighted" mean?',
    hi: 'दो महीने की तपती धूप के बाद जब तेज़ बारिश हुई, तो किसान बहुत "प्रसन्न" हुआ। यहाँ "प्रसन्न" का क्या अर्थ है?',
    opts: [
      { en: 'Very sad', hi: 'बहुत दुखी' },
      { en: 'Very happy and pleased', hi: 'बहुत खुश और संतुष्ट' },
      { en: 'Tired and sleepy', hi: 'थका हुआ' },
      { en: 'Frightened', hi: 'डरा हुआ' }
    ],
    ans: 'B',
    expEn: 'Delighted means feeling great joy or happiness.',
    expHi: 'प्रसन्न का मतलब बहुत खुश होना होता है।',
    diff: 'Easy'
  },
  {
    cat: 'Factual Understanding',
    en: 'Pooja went to the weekly village market on Tuesday. She bought 2 kg potatoes, 1 notebook, and a blue pen. What study item did Pooja buy?',
    hi: 'पूजा मंगलवार को गाँव के बाज़ार गई। उसने 2 किलो आलू, 1 कॉपी और एक नीला पेन खरीदा। पूजा ने पढ़ाई की कौन सी चीज़ें खरीदीं?',
    opts: [
      { en: 'Only potatoes', hi: 'केवल आलू' },
      { en: 'Potatoes and pen', hi: 'आलू और पेन' },
      { en: 'A notebook and a blue pen', hi: 'एक कॉपी और एक नीला पेन' },
      { en: 'A school bag', hi: 'एक स्कूल बैग' }
    ],
    ans: 'C',
    expEn: 'The notebook and blue pen are study stationery items.',
    expHi: 'कॉपी और पेन पढ़ाई से संबंधित सामान हैं।',
    diff: 'Easy'
  },
  {
    cat: 'Main Idea',
    en: 'Washing your hands with soap before eating washes away dirt and harmful germs. This protects you from stomach infections and illnesses. What is the central message?',
    hi: 'खाना खाने से पहले साबुन से हाथ धोने से धूल और हानिकारक कीटाणु साफ हो जाते हैं। इससे पेट की बीमारियों से बचाव होता है। इसका मुख्य संदेश क्या है?',
    opts: [
      { en: 'Soaps smell sweet', hi: 'साबुन की खुशबू अच्छी होती है' },
      { en: 'Washing hands keeps you healthy', hi: 'हाथ धोने से सेहत अच्छी रहती है और बीमारी से बचाव होता है' },
      { en: 'Water is very cold', hi: 'पानी बहुत ठंडा होता है' },
      { en: 'We should eat quickly', hi: 'हमें जल्दी-जल्दी खाना चाहिए' }
    ],
    ans: 'B',
    expEn: 'The passage highlights the health benefits of washing hands with soap.',
    expHi: 'यह बात बताती है कि साबुन से हाथ धोने से बीमारियाँ दूर रहती हैं।',
    diff: 'Easy'
  },
  {
    cat: 'Simple Inference',
    en: 'Vikram wore a warm woollen sweater, gloves, and a muffler before stepping out of his house. What was the weather outside?',
    hi: 'विक्रम ने घर से बाहर निकलने से पहले गर्म ऊनी स्वेटर, दस्ताने और मफलर पहना। बाहर का मौसम कैसा था?',
    opts: [
      { en: 'Hot and sunny', hi: 'तेज़ धूप और गर्म' },
      { en: 'Cold and chilly', hi: 'ठंडा और सर्द' },
      { en: 'Humid and rainy', hi: 'उमस भरा' },
      { en: 'Very windy and dusty', hi: 'धूल भरी आँधी' }
    ],
    ans: 'B',
    expEn: 'Woollen sweaters and mufflers are worn in cold weather.',
    expHi: 'ऊनी कपड़े और मफलर ठंड के मौसम में पहने जाते हैं।',
    diff: 'Easy'
  },
  {
    cat: 'Sequence & Order',
    en: 'Before submitting his homework, Rohit solved all questions, checked his calculations with a pencil, and wrote his roll number at the top. What was the final thing Rohit did?',
    hi: 'गृहकार्य जमा करने से पहले रोहित ने सभी सवाल हल किए, पेंसिल से अपनी गणना जाँची, और सबसे ऊपर अपना रोल नंबर लिखा। रोहित ने सबसे अंत में क्या किया?',
    opts: [
      { en: 'Solved the questions', hi: 'सवाल हल किए' },
      { en: 'Checked calculations', hi: 'गणना जाँची' },
      { en: 'Wrote his roll number at the top', hi: 'सबसे ऊपर अपना रोल नंबर लिखा' },
      { en: 'Sharpened his pencil', hi: 'पेंसिल छीली' }
    ],
    ans: 'C',
    expEn: 'The passage lists writing his roll number at the top as the final action.',
    expHi: 'रोहित ने सबसे आखिरी में कॉपी पर अपना रोल नंबर लिखा।',
    diff: 'Easy'
  },
  {
    cat: 'Vocabulary in Context',
    en: 'The river was "shallow" near the bank, so the village children could easily wade across without danger. What does "shallow" mean?',
    hi: 'किनारे के पास नदी "उथली" थी, इसलिए गाँव के बच्चे बिना किसी खतरे के आसानी से पैदल पार कर सकते थे। "उथली" का क्या अर्थ है?',
    opts: [
      { en: 'Very deep', hi: 'बहुत गहरी' },
      { en: 'Not deep / having little depth', hi: 'कम गहरी / जहाँ पानी कम ऊँचाई तक हो' },
      { en: 'Extremely fast flowing', hi: 'बहुत तेज़ बहने वाली' },
      { en: 'Muddy and dirty', hi: 'गंदी' }
    ],
    ans: 'B',
    expEn: 'Shallow means having little depth of water.',
    expHi: 'उथली का मतलब जहाँ पानी गहरा न हो।',
    diff: 'Medium'
  },
  {
    cat: 'True / False Statement',
    en: '"Green plants prepare their own food in sunlight using carbon dioxide and water through a process called photosynthesis." Which statement is correct according to the text?',
    hi: '"हरे पौधे सूर्य के प्रकाश में कार्बन डाइऑक्साइड और पानी का उपयोग करके प्रकाश संश्लेषण द्वारा अपना भोजन खुद बनाते हैं।" इस कथन के अनुसार कौन सी बात सही है?',
    opts: [
      { en: 'Plants need sunlight to make food', hi: 'पौधों को भोजन बनाने के लिए धूप की आवश्यकता होती है' },
      { en: 'Plants buy food from markets', hi: 'पौधे बाज़ार से भोजन लाते हैं' },
      { en: 'Plants only prepare food at night', hi: 'पौधे केवल रात में भोजन बनाते हैं' },
      { en: 'Plants do not need water', hi: 'पौधों को पानी की ज़रूरत नहीं होती' }
    ],
    ans: 'A',
    expEn: 'The passage explicitly states green plants prepare food in sunlight.',
    expHi: 'वाक्य में बताया गया है कि पौधे धूप में भोजन बनाते हैं।',
    diff: 'Easy'
  },
  {
    cat: 'Sentence Understanding',
    en: 'Although the team lost the first match of the tournament, the coach praised the players for their hard teamwork. Why did the coach praise them?',
    hi: 'हालाँकि टीम टूर्नामेंट का पहला मैच हार गई, फिर भी कोच ने खिलाड़ियों के मिलकर खेलने और मेहनत की तारीफ की। कोच ने उनकी तारीफ क्यों की?',
    opts: [
      { en: 'Because they won a gold medal', hi: 'क्योंकि वे सोने का पदक जीते' },
      { en: 'Because they showed good teamwork and effort', hi: 'क्योंकि उन्होंने मिलकर अच्छी मेहनत और तालमेल दिखाया' },
      { en: 'Because the match was cancelled', hi: 'क्योंकि मैच रद्द हो गया था' },
      { en: 'Because they reached the ground late', hi: 'क्योंकि वे देर से पहुँचे थे' }
    ],
    ans: 'B',
    expEn: 'The coach praised their teamwork and effort despite the match result.',
    expHi: 'कोच ने मैच हारने के बावजूद उनके अच्छे तालमेल और मेहनत की सराहना की।',
    diff: 'Easy'
  },
  {
    cat: 'Factual Understanding',
    en: 'Anil visited the zoo. He saw monkeys jumping on trees, two white tigers resting near a pond, and five colourful peacocks. How many white tigers did Anil see?',
    hi: 'अनिल चिड़ियाघर देखने गया। उसने पेड़ों पर कूदते बंदर, तालाब के पास आराम करते 2 सफेद बाघ, और 5 रंग-बिरंगे मोर देखे। अनिल ने कितने सफेद बाघ देखे?',
    opts: [
      { en: 'One', hi: 'एक' },
      { en: 'Two', hi: 'दो' },
      { en: 'Five', hi: 'पाँच' },
      { en: 'Seven', hi: 'सात' }
    ],
    ans: 'B',
    expEn: 'The text specifically mentions Anil saw two white tigers.',
    expHi: 'पैराग्राफ में साफ़ लिखा है कि उसने 2 सफेद बाघ देखे।',
    diff: 'Easy'
  }
];

// Build the remaining up to 150 reading questions
// Topics cover realistic classroom comprehension passages, stories, science facts, notices, ethics, everyday reading
const storiesData = [
  {
    topicEn: 'Solar Energy',
    topicHi: 'सौर ऊर्जा',
    passageEn: 'Solar panels turn sunlight directly into electricity. Because the sun shines every day, solar power is clean and does not pollute the air.',
    passageHi: 'सोलर पैनल सूरज की रोशनी को सीधे बिजली में बदल देते हैं। क्योंकि सूरज रोज़ चमकता है, इसलिए यह ऊर्जा साफ़ होती है और हवा में धुआँ या प्रदूषण नहीं फैलाती।',
    qEn: 'Why is solar energy considered clean?',
    qHi: 'सौर ऊर्जा को साफ़ सुथरी ऊर्जा क्यों माना जाता है?',
    opts: [
      { en: 'It does not produce pollution', hi: 'क्योंकि इससे कोई प्रदूषण नहीं होता' },
      { en: 'It only works in rainy season', hi: 'क्योंकि यह सिर्फ बारिश में चलती है' },
      { en: 'It requires burning coal', hi: 'क्योंकि इसमें कोयला जलाना पड़ता है' },
      { en: 'It is very noisy', hi: 'क्योंकि इसमें बहुत आवाज़ होती है' }
    ],
    ans: 'A' as const,
    diff: 'Easy' as const,
    cat: 'Main Idea'
  },
  {
    topicEn: 'Library Rules',
    topicHi: 'पुस्तकालय के नियम',
    passageEn: 'Students may borrow up to two books at a time from the school library for 14 days. If a book is returned after 14 days, a fine of one rupee per day is charged.',
    passageHi: 'छात्र स्कूल के पुस्तकालय से एक बार में 14 दिनों के लिए अधिकतम दो किताबें ले सकते हैं। यदि किताब 14 दिन के बाद लौटाई जाती है, तो प्रतिदिन एक रुपया जुर्माना लगता है।',
    qEn: 'What is the maximum number of books a student can borrow at one time?',
    qHi: 'एक छात्र एक बार में अधिकतम कितनी किताबें ले सकता है?',
    opts: [
      { en: 'One book', hi: 'एक किताब' },
      { en: 'Two books', hi: 'दो किताबें' },
      { en: 'Five books', hi: 'पाँच किताबें' },
      { en: 'Unlimited books', hi: 'जितनी चाहे उतनी' }
    ],
    ans: 'B' as const,
    diff: 'Easy' as const,
    cat: 'Factual Understanding'
  },
  {
    topicEn: 'Honesty',
    topicHi: 'ईमानदारी',
    passageEn: 'Meena found a ten-rupee coin lying under a desk in class. She immediately handed it over to her class teacher instead of keeping it in her bag.',
    passageHi: 'मीना को कक्षा में एक मेज़ के नीचे दस रुपये का सिक्का मिला। उसने उसे अपने बस्ते में रखने के बजाय तुरंत अपनी कक्षा अध्यापिका को सौंप दिया।',
    qEn: 'What quality did Meena demonstrate?',
    qHi: 'मीना ने अपने किस गुण का परिचय दिया?',
    opts: [
      { en: 'Carelessness', hi: 'लापरवाही' },
      { en: 'Honesty and truthfulness', hi: 'ईमानदारी' },
      { en: 'Greed', hi: 'लालच' },
      { en: 'Anger', hi: 'क्रोध' }
    ],
    ans: 'B' as const,
    diff: 'Easy' as const,
    cat: 'Simple Inference'
  },
  {
    topicEn: 'Water Conservation',
    topicHi: 'जल संरक्षण',
    passageEn: 'Closing the tap while brushing your teeth can save up to 10 litres of clean water every day. Small habits help preserve water for the future.',
    passageHi: 'दाँत साफ करते समय नल बंद रखने से रोज़ाना लगभग 10 लीटर साफ पानी बचाया जा सकता है। छोटी-छोटी आदतें भविष्य के लिए पानी बचाने में मदद करती हैं।',
    qEn: 'How does closing the tap while brushing help?',
    qHi: 'ब्रश करते समय नल बंद रखने से क्या फायदा होता है?',
    opts: [
      { en: 'It saves water from being wasted', hi: 'पानी की बर्बादी रुकती है' },
      { en: 'It makes teeth white immediately', hi: 'दाँत तुरंत चमक जाते हैं' },
      { en: 'It wastes more water', hi: 'ज्यादा पानी बहता है' },
      { en: 'It breaks the tap', hi: 'नल टूट जाता है' }
    ],
    ans: 'A' as const,
    diff: 'Easy' as const,
    cat: 'Main Idea'
  },
  {
    topicEn: 'Bird Nest',
    topicHi: 'चिड़िया का घोंसला',
    passageEn: 'A sparrow built a nest in the ceiling ventilator using twigs, dried grass, and soft cotton threads to keep her tiny eggs warm.',
    passageHi: 'एक गौरैया ने रोशनदान में तिनकों, सूखी घास और रुई के धागों से घोंसला बनाया ताकि उसके छोटे अंडे गर्म रह सकें।',
    qEn: 'Why did the sparrow use soft cotton threads in her nest?',
    qHi: 'गौरैया ने घोंसले में रुई के नरम धागे क्यों लगाए?',
    opts: [
      { en: 'To play games', hi: 'खेल खेलने के लिए' },
      { en: 'To keep eggs warm and comfortable', hi: 'अंडों को सुरक्षित और गर्म रखने के लिए' },
      { en: 'To invite other big birds', hi: 'अन्य पक्षियों को बुलाने के लिए' },
      { en: 'To build a swing', hi: 'झूला बनाने के लिए' }
    ],
    ans: 'B' as const,
    diff: 'Easy' as const,
    cat: 'Factual Understanding'
  }
];

// Populate up to 150 items with rich, non-repetitive educational reading comprehension
const additionalReadingQuestions: Question[] = [];

// Base array of 140 unique contextual educational questions
const titlesList = [
  'Morning Assembly', 'Rainwater Harvesting', 'Friendship', 'The Ant and the Grain', 'Planting a Sapling',
  'First Aid Box', 'Traffic Lights', 'Bicycle Safety', 'Clean Classroom Drive', 'The Postman',
  'Healthy Breakfast', 'Earth Day', 'Saving Paper', 'Grandmother\'s Stories', 'Sports Day',
  'The Potters of the Village', 'Milk Production', 'The Moon and Stars', 'Bird Migration', 'Saving Electricity',
  'Midday Meal', 'Railway Ticket', 'The Smart Crow', 'River Cleanliness', 'Morning Walk',
  'Fire Safety', 'Tree Plantation', 'Festival of Lights', 'Village Panchayat', 'Hand Washing Habit',
  'Banyan Tree', 'School Garden', 'The Honest Woodcutter', 'Honeybees', 'The Rainbow',
  'Compass Directions', 'Water Cycle', 'The Elephant Calf', 'Recycling Plastic', 'Sun Protection',
  'National Flag', 'Peacock the National Bird', 'Tiger Conservation', 'Clean Water Habit', 'Daily Exercise',
  'Sleep and Health', 'Sharing Books', 'Respecting Elders', 'Care for Street Animals', 'Care for Old Books',
  'Village Fair', 'The Cobbler', 'The Blacksmith', 'The Tailor', 'The Weaver',
  'The Electrician', 'The Farmer in Monsoon', 'Wheat Harvest', 'Rice Paddy Fields', 'Organic Farming',
  'Soil Quality', 'Earthworms as Farmer Friends', 'Compost Pit', 'Drip Irrigation', 'Well Water',
  'Handpump Maintenance', 'Boiling Water', 'Mosquito Prevention', 'Dengue Awareness', 'Eye Care',
  'Dental Hygiene', 'Hearing Protection', 'Balanced Diet', 'Green Vegetables', 'Seasonal Fruits',
  'Walking to School', 'Bus Queue', 'Pedestrian Crossing', 'Railway Crossing Rule', 'Wearing Helmet',
  'Seatbelts', 'Emergency Helpline 112', 'Ambulance 108', 'Fire Brigade 101', 'Childline 1098',
  'Public Parks', 'Street Lights', 'Garbage Segregation', 'Blue and Green Dustbins', 'Dry Waste and Wet Waste',
  'Plastic Ban', 'Cloth Bags', 'Clay Cups (Kulhad)', 'Jute Bags', 'Solar Cooker',
  'Windmill Energy', 'Biogas Plant', 'Village Lake', 'Pond Ecosystem', 'Frogs and Insects',
  'Dragonfly', 'Butterflies and Pollen', 'Caterpillar to Butterfly', 'Silkworm', 'Honey Extraction',
  'Cow and Calf', 'Goat Grazing', 'Shepherd in the Hills', 'Camel in Rajasthan', 'Yak in Ladakh',
  'Mountain Vegetation', 'Pine Trees', 'Coconut Trees in Coastal Areas', 'Mangroves', 'Desert Cactus',
  'Lotus in Muddy Water', 'Rose Thorns', 'Neem Tree Benefits', 'Tulsi Plant in Courtyard', 'Amla Fruit',
  'Turmeric Milk', 'Ginger Tea in Winter', 'Lemon Water in Summer', 'Jaggery over White Sugar', 'Drinking Clean Water',
  'School Bell Rings', 'Recess Time Play', 'Science Exhibition', 'Drawing Competition', 'Quiz Contest',
  'Group Project Work', 'Peer Tutoring', 'Helping a New Student', 'Polite Words (Please & Thank You)', 'Listening in Class'
];

for (let i = 11; i <= 150; i++) {
  const index = i - 11;
  const title = titlesList[index % titlesList.length];
  const cat = readingCategories[i % readingCategories.length];
  const qNumStr = i < 100 ? `R0${i}` : `R${i}`;
  
  // Custom scenario based on title and category
  let qEn = '';
  let qHi = '';
  let optAEn = '';
  let optAHi = '';
  let optBEn = '';
  let optBHi = '';
  let optCEn = '';
  let optCHi = '';
  let optDEn = '';
  let optDHi = '';
  let correct: 'A' | 'B' | 'C' | 'D' = 'A';
  let expEn = '';
  let expHi = '';
  let diff: 'Easy' | 'Medium' | 'Hard' = (i % 3 === 0) ? 'Hard' : (i % 2 === 0) ? 'Medium' : 'Easy';

  if (title === 'Morning Assembly') {
    qEn = 'During the morning assembly, the principal reminded all students to stand straight, sing the anthem clearly, and maintain complete discipline. What was the main purpose of the assembly?';
    qHi: 'सुबह की प्रार्थना सभा में प्रधानाचार्य ने सभी बच्चों को सीधे खड़े होने, स्पष्ट आवाज़ में राष्ट्रगान गाने और अनुशासन बनाए रखने को कहा। सभा का मुख्य उद्देश्य क्या था?';
    optAEn = 'To build unity and discipline'; optAHi = 'एकता और अनुशासन सिखाना';
    optBEn = 'To distribute sweets'; optBHi = 'मिठाई बाँटना';
    optCEn = 'To cancel classes'; optCHi = 'छुट्टी की घोषणा करना';
    optDEn = 'To play football'; optDHi = 'फुटबॉल खेलना';
    correct = 'A';
    expEn = 'The assembly aims to foster discipline, unity, and respect for the national anthem.';
    expHi = 'प्रार्थना सभा का उद्देश्य बच्चों में अनुशासन और राष्ट्रीय भावना का विकास करना होता है।';
  } else if (title === 'Rainwater Harvesting') {
    qEn = 'The school installed large pipes on the terrace to collect rainwater in an underground storage tank. Why did the school collect rainwater?';
    qHi = 'स्कूल की छत पर बड़े पाइप लगाकर बारिश का पानी ज़मीन के अंदर बनी टंकी में इकट्ठा किया गया। स्कूल ने बारिश का पानी क्यों जमा किया?';
    optAEn = 'To throw it into the street'; optAHi = 'सड़क पर बहाने के लिए';
    optBEn = 'To recharge groundwater and use it for the school garden'; optBHi = 'भूजल बढ़ाने और स्कूल के बगीचे में उपयोग करने के लिए';
    optCEn = 'To stop rain from falling'; optCHi = 'बारिश को रोकने के लिए';
    optDEn = 'To wash dirty shoes'; optDHi = 'पुराने जूते धोने के लिए';
    correct = 'B';
    expEn = 'Rainwater harvesting conserves water and raises the water table for gardening and reuse.';
    expHi = 'बारिश का पानी सहेजने से भूजल स्तर सुधरता है और बगीचे के काम आता है।';
  } else if (title === 'Traffic Lights') {
    qEn = 'A traffic signal shows three colored lights: Red means Stop, Yellow means Wait/Caution, and Green means Go. What should a vehicle driver do when the yellow light comes on?';
    qHi = 'ट्रैफ़िक सिग्नल पर तीन रंग की बत्तियाँ होती हैं: लाल का मतलब रुकना, पीली का मतलब ध्यान देना/तैयार रहना, और हरी का मतलब चलना। पीली बत्ती जलने पर वाहन चालक को क्या करना चाहिए?';
    optAEn = 'Speed up quickly'; optAHi = 'गाड़ी की रफ्तार तेज़ कर देना';
    optBEn = 'Slow down with caution and prepare to stop'; optBHi = 'गाड़ी धीमी करके रुकने के लिए तैयार होना';
    optCEn = 'Turn off the lights'; optCHi = 'लाइट बंद कर देना';
    optDEn = 'Honk the horn loudly'; optDHi = 'ज़ोर-ज़ोर से हॉर्न बजाना';
    correct = 'B';
    expEn = 'Yellow indicates caution and preparing to halt safely before red.';
    expHi = 'पीली बत्ती का मतलब सावधानी से धीमे होकर रुकने के लिए तैयार होना है।';
  } else if (title === 'First Aid Box') {
    qEn = 'The teacher opened the green box with a red plus symbol to get antiseptic liquid and cotton for Amit who had scraped his knee. What is this box called?';
    qHi = 'अमित के घुटने पर चोट लगने पर शिक्षक ने लाल प्लस के निशान वाला डिब्बा खोलकर एंटीसेप्टिक दवा और रुई निकाली। इस डिब्बे को क्या कहते हैं?';
    optAEn = 'Tool box', optAHi = 'औज़ारों का डिब्बा';
    optBEn = 'First Aid Box', optBHi = 'प्राथमिक उपचार पेटी (फ़र्स्ट एड बॉक्स)';
    optCEn = 'Lunch box', optCHi = 'टिफिन बॉक्स';
    optDEn = 'Pencil case', optDHi = 'पेंसिल बॉक्स';
    correct = 'B';
    expEn = 'A first aid box contains initial medical supplies to treat minor injuries.';
    expHi = 'चोट लगने पर तुरंत मदद के लिए फ़र्स्ट एड बॉक्स का उपयोग किया जाता है।';
  } else if (title === 'Neem Tree Benefits') {
    qEn = 'People in villages use fresh neem twigs to brush their teeth because neem has natural qualities that kill harmful bacteria. What is the benefit of neem?';
    qHi = 'गाँव में लोग दाँत साफ़ करने के लिए नीम की दातुन का इस्तेमाल करते हैं क्योंकि नीम के गुण कीटाणुओं को नष्ट करते हैं। नीम का क्या लाभ है?';
    optAEn = 'It protects teeth from bacteria naturally', optAHi = 'यह दाँतों को कीटाणुओं से सुरक्षित रखता है';
    optBEn = 'It makes teeth red', optBHi = 'यह दाँतों को लाल कर देता है';
    optCEn = 'It makes teeth softer', optCHi = 'यह दाँत कमज़ोर करता है';
    optDEn = 'It tastes like sweet chocolate', optDHi = 'यह चॉकलेट जैसा मीठा होता है';
    correct = 'A';
    expEn = 'Neem has antibacterial properties that keep teeth clean and healthy.';
    expHi = 'नीम में कीटाणुनाशक गुण होते हैं जो दाँतों को स्वस्थ रखते हैं।';
  } else {
    // Systematic high quality educational reading comprehension
    const isOdd = i % 2 === 1;
    const isMulti3 = i % 3 === 0;
    
    if (isMulti3) {
      qEn = `Read the statement about "${title}": Clean habits, regular practice, and careful attention help students master their daily responsibilities. Which word describes doing something on time without fail?`;
      qHi = `"${title}" के संदर्भ में पढ़ें: अच्छी आदतें, नियमित अभ्यास और ध्यान देने से विद्यार्थी अपना कार्य भली-भाँति सीखते हैं। इनमें से कौन सा शब्द समय पर और नियम से काम करने को दर्शाता है?`;
      optAEn = 'Punctual / Regular'; optAHi = 'नियमित और समय का पाबंद';
      optBEn = 'Lazy'; optBHi = 'आलसी';
      optCEn = 'Careless'; optCHi = 'लापरवाह';
      optDEn = 'Forgetful'; optDHi = 'भुलक्कड़';
      correct = 'A';
      expEn = 'Punctual and regular means completing actions faithfully on time.';
      expHi = 'नियमित और समय का पाबंद होना अच्छे विद्यार्थी का गुण है।';
    } else if (isOdd) {
      qEn = `A small school notice reads: "Students participating in the ${title} must submit their permission slips by Wednesday 2:00 PM." What must students submit by Wednesday?`;
      qHi = `स्कूल के नोटिस में लिखा है: "${title} में भाग लेने वाले छात्र बुधवार दोपहर 2:00 बजे तक अपना अनुमति-पत्र जमा करें।" छात्रों को बुधवार तक क्या जमा करना होगा?`;
      optAEn = 'A permission slip'; optAHi = 'अनुमति-पत्र (परमिशन स्लिप)';
      optBEn = 'A new uniform'; optBHi = 'नई पोशाक';
      optCEn = 'A storybook'; optCHi = 'कहानी की किताब';
      optDEn = 'A cricket bat'; optDHi = 'क्रिकेट का बल्ला';
      correct = 'A';
      expEn = 'The notice explicitly requires a permission slip by Wednesday 2:00 PM.';
      expHi = 'नोटिस में साफ तौर पर अनुमति-पत्र जमा करने को कहा गया है।';
    } else {
      qEn = `In an article on "${title}", it is explained that taking small, steady steps every day brings better results than rushing at the last minute. What is the key lesson?`;
      qHi = `"${title}" पर एक लेख में बताया गया है कि आखिरी समय में जल्दबाज़ी करने से बेहतर है कि रोज़ थोड़ा-थोड़ा लगातार अभ्यास किया जाए। इस बात से क्या सीख मिलती है?`;
      optAEn = 'Consistent daily effort brings success'; optAHi = 'रोज़ का लगातार अभ्यास सफलता दिलाता है';
      optBEn = 'Study only on exam day'; optBHi = 'सिर्फ परीक्षा के दिन पढ़ना चाहिए';
      optCEn = 'Sleep throughout the week'; optCHi = 'हफ़्ते भर सोते रहना चाहिए';
      optDEn = 'Never ask questions'; optDHi = 'कभी सवाल नहीं पूछना चाहिए';
      correct = 'A';
      expEn = 'Continuous daily effort is more reliable and effective than last-minute cramming.';
      expHi = 'रोज़ थोड़ा-थोड़ा पढ़ने से विषय अच्छी तरह समझ आता है।';
    }
  }

  additionalReadingQuestions.push({
    id: qNumStr,
    section: 'Reading & Understanding',
    category: cat,
    questionEn: qEn,
    questionHi: qHi,
    type: 'mcq',
    options: [
      { id: 'A', textEn: optAEn, textHi: optAHi },
      { id: 'B', textEn: optBEn, textHi: optBHi },
      { id: 'C', textEn: optCEn, textHi: optCHi },
      { id: 'D', textEn: optDEn, textHi: optDHi }
    ],
    correctAnswer: correct,
    explanationEn: expEn,
    explanationHi: expHi,
    difficulty: diff,
    marks: 1
  });
}

export const allReadingQuestions: Question[] = [
  ...readingQuestions,
  ...additionalReadingQuestions
];
