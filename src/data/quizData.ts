import { QuizQuestion, QuizRoastBand } from '../types/archive';

/**
 * Configurable Quiz Data Structure
 * - 10 multiple-choice questions (10 points each = 100 points total)
 * - Easily add, remove, or edit questions and answers below.
 * - Uses Vishvajeet's actual configured interests (thriller/action cinema, SRK, Fincher,
 *   FC Barcelona, Messi, Peter Drury calls, cooking Lemon Chicken & Butter Chicken gravy,
 *   Desi Hip Hop / Marathi classics, Stoic philosophy) plus clearly marked customizable
 *   inside-joke questions.
 */
export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-01-movies',
    category: '01 · Cinema Obsession',
    question: 'What kind of movies am I most obsessed with?',
    options: [
      'Thrillers and grounded action where the story, tension, and craft come first (way less romance)',
      'Pure cheesy rom-coms where two people bump into each other at an airport',
      'Three-hour CGI superhero movies with zero plot',
      'Only 1920s silent nature documentaries about penguins',
    ],
    correctIndex: 0,
    points: 10,
    personalNote:
      'Give me a tight script, real tension, and grounded action where the story actually matters. Romance takes a back seat.',
  },
  {
    id: 'q-02-actor',
    category: '02 · Screen Legend',
    question: 'Who is my all-time favourite actor — no debate allowed?',
    options: [
      'Shah Rukh Khan (SRK)',
      'Tom Cruise',
      'Leonardo DiCaprio',
      'Ryan Gosling',
    ],
    correctIndex: 0,
    points: 10,
    personalNote:
      'Shah Rukh Khan, always. From Swades and Chak De! India to his wit off-screen, nobody commands a frame like him.',
  },
  {
    id: 'q-03-filmmaker',
    category: '03 · Visual Craft',
    question: 'Which filmmaker’s visual style and obsessive framing fascinates me the most?',
    options: [
      'David Fincher — surgical camera movement, restraint, and frames where every shadow has a job',
      'Michael Bay — explosions every four seconds and spinning sunset cameras',
      'Whoever directed the latest fast-food commercial',
      'I don’t actually pay attention to directors at all',
    ],
    correctIndex: 0,
    points: 10,
    personalNote:
      'Fincher’s patience with the camera in Zodiac and Se7en is the reason I end up rewinding a five-second scene ten times.',
  },
  {
    id: 'q-04-first-notice',
    category: '04 · How I Watch',
    question: 'What do I usually notice first when watching a movie?',
    options: [
      'The framing, color grade, lighting, and how a scene builds tension before anyone even speaks',
      'Whether the lead actor’s shoes match the sofa in the background',
      'How fast I can skip to the end credits',
      'Only the Rotten Tomatoes score before I decide to enjoy it',
    ],
    correctIndex: 0,
    points: 10,
    personalNote:
      'Sometimes I watch a film. Sometimes I spend the next two hours thinking about one frame and how it was lit.',
  },
  {
    id: 'q-05-football-club',
    category: '05 · Football Loyalty',
    question: 'Which football club owns my loyalty (and is responsible for half my emotional damage)?',
    options: [
      'FC Barcelona',
      'Real Madrid',
      'Manchester City',
      'Chelsea',
    ],
    correctIndex: 0,
    points: 10,
    personalNote:
      'Barça and Messi. Because how you play—the geometry of the pass and the identity on the pitch—matters as much as the scoreboard.',
  },
  {
    id: 'q-06-football-trauma',
    category: '06 · Goosebumps & Tears',
    question: 'Which football night literally had me in tears asking “how could we not win this?!”',
    options: [
      'Roma vs. FC Barcelona (2018) — Peter Drury’s “Roma have risen from their ruins!” call',
      'A random pre-season friendly in July',
      'The 2010 World Cup vuvuzela concert',
      'I have never once gotten emotional over football',
    ],
    correctIndex: 0,
    points: 10,
    personalNote:
      'Manolas in Rome still haunts me, even though Peter Drury’s commentary gives me chills. Thank god Lusail 2022 healed everything.',
  },
  {
    id: 'q-07-kitchen',
    category: '07 · What’s Cooking?',
    question: 'When I’m in the kitchen cooking to relax, what is my actual signature specialty?',
    options: [
      'Chicken Lemon & rich Butter Chicken gravy (just don’t trust me with mutton yet)',
      'Five-star slow-cooked Mutton Rogan Josh every single Sunday',
      'Burnt toast and instant noodles with zero seasoning',
      'Vegan kale smoothies only',
    ],
    correctIndex: 0,
    points: 10,
    personalNote:
      'My Chicken Lemon and Butter Chicken gravy are genuinely elite—you can hire me. Mutton and I are still negotiating.',
  },
  {
    id: 'q-08-music-youtube',
    category: '08 · On Rotation',
    question: 'What’s actually sitting in my YouTube and Spotify crates when I plug in my earphones?',
    options: [
      'Desi Hip Hop, Pop, Marathi golden songs, plus rare YouTube finds, G(old) songs & short films',
      '10 hours of white noise and corporate motivational podcasts',
      'Only 18th-century harpsichord concertos',
      'Whatever is trending on TikTok this morning',
    ],
    correctIndex: 0,
    points: 10,
    personalNote:
      'From Desi Hip Hop bars and timeless Marathi classics to rare internet finds and twenty-minute short films.',
  },
  {
    id: 'q-09-website-hours',
    category: '09 · Late-Night Rabbit Hole',
    question: 'What kind of website am I most likely to spend hours building and obsessing over?',
    options: [
      'A personal archive & film notebook where I tweak typography, color grades, and small details at 1 AM',
      'A dropshipping store selling glow-in-the-dark phone cases',
      'A corporate B2B accounting dashboard with 40 pie charts',
      'I hate building websites and never touch a keyboard',
    ],
    correctIndex: 0,
    points: 10,
    personalNote:
      'Guilty. If a font pairing or color grade feels slightly off, I will redesign the whole thing until it feels right.',
    isEditablePlaceholder: true,
  },
  {
    id: 'q-10-overthink-2am',
    category: '10 · 2 AM Brain [Customizable Inside Joke]',
    question: 'What am I most likely to overthink at 2 AM?',
    options: [
      'Whether I’m reacting to what actually happened or just my judgment of it—plus a film frame I watched three days ago',
      'Why my stock portfolio isn’t beating Wall Street',
      'What I wore on a Tuesday four years ago',
      'Nothing, I fall asleep at 9:15 PM sharp every night',
    ],
    correctIndex: 0,
    points: 10,
    personalNote:
      'Editable inside-joke slot: customize this question anytime in Author Mode (Shift + E) or in src/data/quizData.ts.',
    isEditablePlaceholder: true,
  },
];

/**
 * Score-Based Roasts — Written like actual texts between close friends.
 * Casual, slightly mean, sarcastic, lowercase, and human.
 * Editable in code or via the Author Mode editor.
 */
export const INITIAL_QUIZ_ROAST_BANDS: QuizRoastBand[] = [
  {
    id: 'roast-0-10',
    minScore: 0,
    maxScore: 10,
    rangeLabel: '0–10/100',
    shortLabel: 'Wait, do we even know each other?',
    roastMessage: 'bro who even are you 😭 why are you taking a quiz about me',
  },
  {
    id: 'roast-11-20',
    minScore: 11,
    maxScore: 20,
    rangeLabel: '11–20/100',
    shortLabel: 'Barely a first-name basis',
    roastMessage: 'we need to talk. what exactly do you know about me apart from my name',
  },
  {
    id: 'roast-21-30',
    minScore: 21,
    maxScore: 30,
    rangeLabel: '21–30/100',
    shortLabel: 'Painfully awkward score',
    roastMessage: 'yeah we should probably start talking more 💀 this is embarrassing for both of us',
  },
  {
    id: 'roast-31-40',
    minScore: 31,
    maxScore: 40,
    rangeLabel: '31–40/100',
    shortLabel: 'Questionable friendship status',
    roastMessage: 'and i thought we were friends lmao. my bad i guess',
  },
  {
    id: 'roast-41-50',
    minScore: 41,
    maxScore: 50,
    rangeLabel: '41–50/100',
    shortLabel: 'Selective listener',
    roastMessage: 'half marks is crazy. even after all those conversations this is what you remember??',
  },
  {
    id: 'roast-51-60',
    minScore: 51,
    maxScore: 60,
    rangeLabel: '51–60/100',
    shortLabel: 'Bare minimum passed',
    roastMessage: 'okay not bad. at least you listen sometimes',
  },
  {
    id: 'roast-61-70',
    minScore: 61,
    maxScore: 70,
    rangeLabel: '61–70/100',
    shortLabel: 'Pleasantly surprised',
    roastMessage: "wait you actually know me?? i didn't expect that from you ngl 😭",
  },
  {
    id: 'roast-71-80',
    minScore: 71,
    maxScore: 80,
    rangeLabel: '71–80/100',
    shortLabel: 'Solid friend, stay humble',
    roastMessage: "okay fine you know me pretty well. don't let this get to your head though",
  },
  {
    id: 'roast-81-90',
    minScore: 81,
    maxScore: 90,
    rangeLabel: '81–90/100',
    shortLabel: 'Suspiciously attentive',
    roastMessage: 'bro do you have anything else going on in your life or what 😭 how do you remember all this',
  },
  {
    id: 'roast-91-99',
    minScore: 91,
    maxScore: 99,
    rangeLabel: '91–99/100',
    shortLabel: 'Borderline concerning',
    roastMessage: 'nah this is actually concerning. go do something with your life bro 😭 why do you know me this well',
  },
  {
    id: 'roast-100',
    minScore: 100,
    maxScore: 100,
    rangeLabel: '100/100',
    shortLabel: 'Real one (unfortunately)',
    roastMessage: `BRO 😭😭

go look into your own life man. you won't find anything if you keep focusing on mine lmaooo

get a hobby or something 😭

love you bro ❤️`,
  },
];

export function getRoastForScore(
  score: number,
  bands: QuizRoastBand[] = INITIAL_QUIZ_ROAST_BANDS
): QuizRoastBand {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const matched = bands.find((b) => clamped >= b.minScore && clamped <= b.maxScore);
  return matched || bands[0];
}
