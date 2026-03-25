import { connect } from "@config/db";
import languageModel from "@models/language.model";
import phraseModel from "@models/phrase.model";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import CustomResponse from "utils/handlers/response.handler";

dotenv.config();

const languages = [
  {
    code: "yoruba",
    name: "Yoruba",
    nativeName: "Èdè Yorùbá",
    description:
      "Spoken by over 45 million people across Nigeria, Benin, and Togo.",
    flagEmoji: "🇳🇬",
    isActive: true,
  },
  {
    code: "igbo",
    name: "Igbo",
    nativeName: "Asụsụ Igbo",
    description:
      "Spoken by over 45 million people mainly in southeastern Nigeria.",
    flagEmoji: "🇳🇬",
    isActive: true,
  },
  {
    code: "hausa",
    name: "Hausa",
    nativeName: "Harshen Hausa",
    description:
      "One of Africa's most widely spoken languages with over 70 million speakers.",
    flagEmoji: "🇳🇬",
    isActive: true,
  },
];

const yorubaPhrases = [
  // Greetings
  {
    text: "Ẹ káàárọ̀",
    translation: "Good morning",
    romanization: "Eh kah-ah-ro",
    category: "greetings",
    toneNotes: 'Rising tone on "ká"',
    orderIndex: 1,
  },
  {
    text: "Ẹ káàsán",
    translation: "Good afternoon",
    romanization: "Eh kah-ah-san",
    category: "greetings",
    toneNotes: 'Mid tone on "sán"',
    orderIndex: 2,
  },
  {
    text: "Ẹ káalẹ̀",
    translation: "Good evening",
    romanization: "Eh kah-ah-leh",
    category: "greetings",
    toneNotes: 'Low tone on "lẹ̀"',
    orderIndex: 3,
  },
  {
    text: "Báwo ni?",
    translation: "How are you?",
    romanization: "Bah-woh nee",
    category: "greetings",
    toneNotes: "Mid tone throughout",
    orderIndex: 4,
  },
  {
    text: "Mo wà dáadáa",
    translation: "I am fine",
    romanization: "Moh wah dah-dah",
    category: "greetings",
    toneNotes: 'High tones on "dáadáa"',
    orderIndex: 5,
  },
  {
    text: "Ẹ jọ̀ọ́",
    translation: "Please",
    romanization: "Eh joh-oh",
    category: "everyday",
    toneNotes: "Low then high tone",
    orderIndex: 6,
  },
  {
    text: "Ẹ ṣéun",
    translation: "Thank you",
    romanization: "Eh sheh-oon",
    category: "everyday",
    toneNotes: 'High tone on "ṣé"',
    orderIndex: 7,
  },
  {
    text: "Bẹ̀ẹ̀ ni",
    translation: "Yes",
    romanization: "Beh-eh nee",
    category: "everyday",
    toneNotes: "Low tones",
    orderIndex: 8,
  },
  {
    text: "Rárá",
    translation: "No",
    romanization: "Rah-rah",
    category: "everyday",
    toneNotes: "High tones",
    orderIndex: 9,
  },
  {
    text: "Ẹ jẹ̀ kí a jẹun",
    translation: "Let us eat",
    romanization: "Eh jeh-kee ah jeh-oon",
    category: "food",
    toneNotes: 'Low tone on "jẹ̀"',
    orderIndex: 10,
  },
];

const igboPhrases = [
  {
    text: "Ụtụtụ ọma",
    translation: "Good morning",
    romanization: "Oo-too-too oh-mah",
    category: "greetings",
    toneNotes: "",
    orderIndex: 1,
  },
  {
    text: "Ehihie ọma",
    translation: "Good afternoon",
    romanization: "Eh-hee-eh oh-mah",
    category: "greetings",
    toneNotes: "",
    orderIndex: 2,
  },
  {
    text: "Anyasị ọma",
    translation: "Good evening",
    romanization: "An-yah-see oh-mah",
    category: "greetings",
    toneNotes: "",
    orderIndex: 3,
  },
  {
    text: "Kedu?",
    translation: "How are you?",
    romanization: "Keh-doo",
    category: "greetings",
    toneNotes: "",
    orderIndex: 4,
  },
  {
    text: "Adị m mma",
    translation: "I am fine",
    romanization: "Ah-dee m-mah",
    category: "greetings",
    toneNotes: "",
    orderIndex: 5,
  },
  {
    text: "Daalu",
    translation: "Thank you",
    romanization: "Dah-ah-loo",
    category: "everyday",
    toneNotes: "",
    orderIndex: 6,
  },
  {
    text: "Biko",
    translation: "Please",
    romanization: "Bee-koh",
    category: "everyday",
    toneNotes: "",
    orderIndex: 7,
  },
];

const hausaPhrases = [
  {
    text: "Ina kwana?",
    translation: "Good morning (How did you sleep?)",
    romanization: "Ee-nah kwah-nah",
    category: "greetings",
    toneNotes: "",
    orderIndex: 1,
  },
  {
    text: "Ina wuni?",
    translation: "Good afternoon",
    romanization: "Ee-nah woo-nee",
    category: "greetings",
    toneNotes: "",
    orderIndex: 2,
  },
  {
    text: "Ina yini?",
    translation: "Good evening",
    romanization: "Ee-nah yee-nee",
    category: "greetings",
    toneNotes: "",
    orderIndex: 3,
  },
  {
    text: "Yaya dai?",
    translation: "How are you?",
    romanization: "Yah-yah die",
    category: "greetings",
    toneNotes: "",
    orderIndex: 4,
  },
  {
    text: "Lafiya lau",
    translation: "I am fine / All is well",
    romanization: "Lah-fee-yah law",
    category: "greetings",
    toneNotes: "",
    orderIndex: 5,
  },
  {
    text: "Na gode",
    translation: "Thank you",
    romanization: "Nah goh-deh",
    category: "everyday",
    toneNotes: "",
    orderIndex: 6,
  },
  {
    text: "Don Allah",
    translation: "Please",
    romanization: "Don ah-lah",
    category: "everyday",
    toneNotes: "",
    orderIndex: 7,
  },
];

async function seed(req: Request, res: Response, next: NextFunction) {
  try {
    await connect();

    // Clear existing data
    await languageModel.deleteMany({});
    await phraseModel.deleteMany({});
    console.log("Cleared existing data");

    // Seed languages
    await languageModel.insertMany(languages);
    console.log("✓ Languages seeded");

    // Seed phrases
    const allPhrases = [
      ...yorubaPhrases.map((p) => ({
        ...p,
        language: "yoruba",
        difficulty: "beginner",
      })),
      ...igboPhrases.map((p) => ({
        ...p,
        language: "igbo",
        difficulty: "beginner",
      })),
      ...hausaPhrases.map((p) => ({
        ...p,
        language: "hausa",
        difficulty: "beginner",
      })),
    ];

    await phraseModel.insertMany(allPhrases);
    console.log(`✓ ${allPhrases.length} phrases seeded`);

    // Update phrase counts on language docs
    for (const lang of ["yoruba", "igbo", "hausa"]) {
      const count = await phraseModel.countDocuments({ language: lang });
      await languageModel.updateOne({ code: lang }, { totalPhrases: count });
    }

    console.log(
      "\n✅ Seed complete! Run batchCacheAudio() once you have YarnGPT API key.",
    );

    return new CustomResponse(res).success(
      "Seed complete! Run batchCacheAudio() once you have YarnGPT API key.",
      {},
      200,
    );
  } catch (error: any) {
    console.log(error.stack);
    return next(error);
  }
}

export default seed;
