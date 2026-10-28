import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark,
  Compass,
  Scale,
  Flame,
  Shield,
  Sparkles,
  Sun,
  Moon,
  RotateCw,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export type StoicAtmosphereMode = 'marble' | 'obsidian';

interface MarcusBustProps {
  className?: string;
  atmosphere?: StoicAtmosphereMode;
  interactiveSlice?: boolean;
}

/**
 * High-craft classical sculpted relief of Marcus Aurelius with an architectural
 * "Face Cut" (sliced marble plane revealing the Inner Citadel / Hegemonikon geometry).
 */
export const MarcusAureliusFaceCutBust: React.FC<MarcusBustProps> = ({
  className = 'w-44 h-52',
  atmosphere = 'obsidian',
  interactiveSlice = false,
}) => {
  const isObsidian = atmosphere === 'obsidian';

  const marbleLight = isObsidian ? '#E6DEC8' : '#F7F2E7';
  const marbleMid = isObsidian ? '#B8AE97' : '#D5C9B4';
  const marbleShadow = isObsidian ? '#4B443A' : '#8A7E6D';
  const marbleDeep = isObsidian ? '#1E1B18' : '#433B32';
  const goldAccent = isObsidian ? '#D4AF37' : '#8B2E1D';
  const goldSoft = isObsidian ? 'rgba(212, 175, 55, 0.28)' : 'rgba(139, 46, 29, 0.22)';
  const cutInterior = isObsidian ? '#141210' : '#26211D';

  return (
    <svg
      viewBox="0 0 320 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      role="img"
      aria-label="Classical sculpted bust of Marcus Aurelius with philosophical face-cut relief"
    >
      <defs>
        <linearGradient id="ma-marble-lit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={marbleLight} />
          <stop offset="55%" stopColor={marbleMid} />
          <stop offset="100%" stopColor={marbleShadow} />
        </linearGradient>

        <linearGradient id="ma-marble-shadow" x1="15%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor={marbleMid} />
          <stop offset="50%" stopColor={marbleShadow} />
          <stop offset="100%" stopColor={marbleDeep} />
        </linearGradient>

        <linearGradient id="ma-gold-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3E29F" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8E6A1C" />
        </linearGradient>

        <radialGradient id="ma-halo" cx="50%" cy="42%" r="48%">
          <stop offset="0%" stopColor={goldSoft} />
          <stop offset="70%" stopColor="rgba(212, 175, 55, 0.04)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Clip path for the Upper/Left Sculpted Face above the Face-Cut */}
        <clipPath id="ma-upper-face-cut">
          <polygon points="0,0 320,0 320,162 212,162 188,184 94,184 72,208 0,208" />
        </clipPath>

        {/* Clip path for the Lower Sculpted Beard & Bust below the Face-Cut */}
        <clipPath id="ma-lower-face-cut">
          <polygon points="0,218 82,218 104,196 198,196 220,174 320,174 320,380 0,380" />
        </clipPath>
      </defs>

      {/* Subtle Classical Aureole / Halo + Stoic Compass Geometry */}
      <circle cx="160" cy="158" r="134" fill="url(#ma-halo)" />
      <circle
        cx="160"
        cy="158"
        r="122"
        stroke={goldAccent}
        strokeOpacity="0.28"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <circle
        cx="160"
        cy="158"
        r="104"
        stroke={goldAccent}
        strokeOpacity="0.18"
        strokeWidth="0.75"
      />

      {/* Classical Greek Epigraphy Arc Marks */}
      <text
        x="160"
        y="26"
        textAnchor="middle"
        fill={goldAccent}
        fillOpacity="0.8"
        fontSize="8.5"
        fontFamily="monospace"
        letterSpacing="3.8"
      >
        Μ·ΑΥΡΗΛΙΟΣ · ΤΑ ΕΙΣ ΕΑΥΤΟΝ
      </text>

      {/* Architectural Crosshairs behind the Face Cut */}
      <line
        x1="28"
        y1="190"
        x2="292"
        y2="190"
        stroke={goldAccent}
        strokeOpacity="0.35"
        strokeWidth="0.8"
        strokeDasharray="2 3"
      />
      <line
        x1="160"
        y1="34"
        x2="160"
        y2="352"
        stroke={goldAccent}
        strokeOpacity="0.2"
        strokeWidth="0.8"
        strokeDasharray="3 4"
      />

      {/* =================================================================
          THE "FACE CUT" INNER CITADEL REVEAL SLICE (BETWEEN THE TWO PLANES)
          Shows golden geometric cross-section of the mind (Hegemonikon)
          ================================================================= */}
      <g>
        {/* Recessed dark obsidian/porphyry cross-section plane */}
        <polygon
          points="78,208 98,184 190,184 214,162 240,174 216,196 106,196 84,218"
          fill={cutInterior}
          stroke="url(#ma-gold-leaf)"
          strokeWidth="1.4"
        />
        {/* Golden Kintsugi / Stoic Geometric Facets inside the Face Cut */}
        <polyline
          points="86,210 118,188 156,194 192,185 224,170"
          stroke="url(#ma-gold-leaf)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="156" cy="190" r="4.5" fill="url(#ma-gold-leaf)" />
        <circle
          cx="156"
          cy="190"
          r="9"
          stroke="url(#ma-gold-leaf)"
          strokeWidth="0.9"
          strokeOpacity="0.7"
        />
      </g>

      {/* =================================================================
          LOWER SCULPTED PLANE — BEARD, MUSTACHE, NECK & PALUDAMENTUM BUST
          ================================================================= */}
      <g clipPath="url(#ma-lower-face-cut)">
        {/* Classical Pedestal Plinth */}
        <path
          d="M96 346 H224 L236 366 H84 L96 346 Z"
          fill="url(#ma-marble-shadow)"
          stroke={marbleDeep}
          strokeWidth="1.2"
        />
        <rect
          x="108"
          y="334"
          width="104"
          height="12"
          fill="url(#ma-marble-lit)"
          stroke={marbleDeep}
          strokeWidth="1"
        />

        {/* Roman Emperor Cloak Drapery (Paludamentum & Tunic) */}
        <path
          d="M44 338 C48 292, 82 266, 118 258 L160 264 L202 258 C238 266, 272 292, 276 338 Z"
          fill="url(#ma-marble-lit)"
          stroke={marbleDeep}
          strokeWidth="1.4"
        />
        {/* Shadow side of drapery */}
        <path
          d="M160 264 L202 258 C238 266, 272 292, 276 338 H160 Z"
          fill="url(#ma-marble-shadow)"
          fillOpacity="0.72"
        />
        {/* Carved Drapery Folds */}
        <path
          d="M66 336 C82 302, 114 284, 154 294 C192 304, 226 286, 248 336"
          stroke={marbleDeep}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M86 336 C104 312, 134 304, 166 312 C196 318, 216 306, 232 336"
          stroke={marbleShadow}
          strokeWidth="1.3"
          fill="none"
        />
        {/* Imperial Fibula (Cloak Brooch on right shoulder) */}
        <circle
          cx="216"
          cy="278"
          r="9"
          fill="url(#ma-gold-leaf)"
          stroke={marbleDeep}
          strokeWidth="1.2"
        />
        <circle cx="216" cy="278" r="4" fill={cutInterior} />

        {/* Sculpted Neck */}
        <path
          d="M126 232 L122 266 C140 276, 180 276, 198 266 L194 232 Z"
          fill="url(#ma-marble-shadow)"
          stroke={marbleDeep}
          strokeWidth="1.2"
        />

        {/* Lower Cheekbones & Nose Tip */}
        <path
          d="M104 170 C104 206, 120 242, 160 252 C200 242, 216 206, 216 170 Z"
          fill="url(#ma-marble-lit)"
          stroke={marbleDeep}
          strokeWidth="1.3"
        />
        {/* Chiaroscuro Right Cheek Shadow */}
        <path
          d="M160 170 C160 206, 160 242, 160 252 C200 242, 216 206, 216 170 Z"
          fill="url(#ma-marble-shadow)"
          fillOpacity="0.65"
        />

        {/* Iconic Twin-Peaked Antonine Philosopher's Beard */}
        <path
          d="M102 192 C96 214, 104 242, 122 258 C134 268, 144 274, 152 264 C156 258, 164 258, 168 264 C176 274, 186 268, 198 258 C216 242, 224 214, 218 192 C206 204, 186 208, 160 208 C134 208, 114 204, 102 192 Z"
          fill="url(#ma-marble-lit)"
          stroke={marbleDeep}
          strokeWidth="1.5"
        />
        {/* Right-side Beard Shadow for 3D Relief Depth */}
        <path
          d="M160 208 C186 208, 206 204, 218 192 C224 214, 216 242, 198 258 C186 268, 176 274, 168 264 C164 259, 161 258, 160 260 Z"
          fill="url(#ma-marble-shadow)"
          fillOpacity="0.72"
        />

        {/* Mustache & Contemplative Mouth */}
        <path
          d="M126 206 C138 196, 152 196, 160 201 C168 196, 182 196, 194 206 C188 214, 174 212, 160 208 C146 212, 132 214, 126 206 Z"
          fill="url(#ma-marble-shadow)"
          stroke={marbleDeep}
          strokeWidth="1.2"
        />
        <path
          d="M142 213 C150 216, 170 216, 178 213"
          stroke={marbleDeep}
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Carved Beard Curls (Chiseled Antonine Texture) */}
        <path
          d="M114 216 C118 228, 128 232, 134 224 M126 236 C132 248, 144 250, 148 240 M144 226 C148 238, 158 238, 160 228 M174 226 C178 238, 188 236, 192 224 M168 242 C174 252, 186 250, 190 238 M192 216 C198 228, 208 226, 210 214"
          stroke={marbleDeep}
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* =================================================================
          UPPER SCULPTED PLANE — ANTONINE CURLS, FOREHEAD, BROW & EYES
          Slightly shifted (-3px, -4px) when interactiveSlice is active to
          emphasize the dramatic "Face Cut" separation
          ================================================================= */}
      <g
        clipPath="url(#ma-upper-face-cut)"
        transform={interactiveSlice ? 'translate(-4, -5)' : 'translate(-2, -2)'}
      >
        {/* Cranium & Upper Face Marble Block */}
        <path
          d="M102 106 C102 74, 126 54, 160 54 C194 54, 218 74, 218 106 L216 196 L104 196 Z"
          fill="url(#ma-marble-lit)"
          stroke={marbleDeep}
          strokeWidth="1.4"
        />
        {/* Chiaroscuro Half-Face Shadow on Right Side */}
        <path
          d="M160 54 C194 54, 218 74, 218 106 L216 196 L160 196 Z"
          fill="url(#ma-marble-shadow)"
          fillOpacity="0.6"
        />

        {/* Contemplative Forehead Creases (Signature Marcus Aurelius Furrowed Brow) */}
        <path
          d="M132 114 Q160 119 188 114"
          stroke={marbleDeep}
          strokeWidth="1.1"
          strokeOpacity="0.65"
          fill="none"
        />
        <path
          d="M126 124 Q160 130 194 124"
          stroke={marbleDeep}
          strokeWidth="1.2"
          strokeOpacity="0.75"
          fill="none"
        />

        {/* Deep-Set Antonine Brows & Heavy Upper Eyelids */}
        <path
          d="M116 138 C126 131, 142 132, 151 139"
          stroke={marbleDeep}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M204 138 C194 131, 178 132, 169 139"
          stroke={marbleDeep}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sculpted Blank Marble Eyes (Slightly Heavy-Lidded, Meditative Gaze) */}
        <path
          d="M121 146 C128 140, 141 140, 147 146 C141 151, 128 151, 121 146 Z"
          fill={marbleLight}
          stroke={marbleDeep}
          strokeWidth="1.3"
        />
        <path
          d="M173 146 C179 140, 192 140, 199 146 C192 151, 179 151, 173 146 Z"
          fill={marbleMid}
          stroke={marbleDeep}
          strokeWidth="1.3"
        />
        {/* Subtle Carved Iris Rings (Late Imperial Antonine Drill Technique) */}
        <circle cx="134" cy="145.5" r="3" stroke={marbleDeep} strokeWidth="1" fill="none" />
        <circle cx="186" cy="145.5" r="3" stroke={marbleDeep} strokeWidth="1" fill="none" />

        {/* Classical Aquiline Nose Bridge */}
        <path
          d="M153 138 L150 182 L160 187 L170 182 L165 138"
          fill="url(#ma-marble-lit)"
          stroke={marbleDeep}
          strokeWidth="1.3"
        />
        <path
          d="M160 138 L160 187 L170 182 L165 138 Z"
          fill="url(#ma-marble-shadow)"
          fillOpacity="0.75"
        />

        {/* Voluminous Crown of Sculpted Antonine Curls */}
        <path
          d="M94 148 C82 134, 80 108, 90 88 C96 66, 114 48, 138 44 C152 38, 170 38, 184 44 C208 48, 224 66, 230 88 C240 108, 238 134, 226 148 C222 126, 216 112, 206 102 C194 94, 180 96, 160 94 C140 96, 126 94, 114 102 C104 112, 98 126, 94 148 Z"
          fill="url(#ma-marble-lit)"
          stroke={marbleDeep}
          strokeWidth="1.6"
        />
        {/* Shadow side of hair mass */}
        <path
          d="M160 40 C170 39, 178 41, 184 44 C208 48, 224 66, 230 88 C240 108, 238 134, 226 148 C222 126, 216 112, 206 102 C194 94, 180 96, 160 94 Z"
          fill="url(#ma-marble-shadow)"
          fillOpacity="0.68"
        />

        {/* Individual Chiseled Hair Curls Across the Brow & Temples */}
        <path
          d="M100 116 C92 106, 98 92, 110 96 M112 94 C106 80, 118 68, 130 78 M132 76 C128 60, 144 52, 154 66 M156 66 C158 52, 174 52, 176 68 M178 70 C186 58, 202 64, 196 80 M198 82 C210 74, 222 86, 212 100 M210 104 C222 100, 228 114, 218 124 M118 100 C126 108, 138 106, 144 96 M146 96 C154 106, 168 106, 174 96 M176 96 C184 106, 196 106, 202 98"
          stroke={marbleDeep}
          strokeWidth="1.45"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* =================================================================
          GOLD-LEAF ARCHITECTURAL CUT LINES & CORNER BRACKETS
          ================================================================= */}
      <polyline
        points="62,210 74,210 96,184 188,184 212,162 256,162"
        stroke="url(#ma-gold-leaf)"
        strokeWidth="1.8"
        fill="none"
      />
      <polyline
        points="66,220 84,220 106,196 198,196 220,174 260,174"
        stroke="url(#ma-gold-leaf)"
        strokeWidth="1.2"
        strokeDasharray="4 2"
        fill="none"
      />

      {/* Roman Numeral & Hegemonikon Callout Label */}
      <g>
        <line
          x1="220"
          y1="168"
          x2="266"
          y2="144"
          stroke="url(#ma-gold-leaf)"
          strokeWidth="1"
        />
        <circle cx="220" cy="168" r="2.5" fill="url(#ma-gold-leaf)" />
        <text
          x="270"
          y="142"
          fill={goldAccent}
          fontSize="7.5"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          HEGEMONIKON
        </text>
        <text
          x="270"
          y="152"
          fill={goldAccent}
          fillOpacity="0.75"
          fontSize="6.5"
          fontFamily="monospace"
        >
          IV.3 · INNER CITADEL
        </text>
      </g>

      {/* Bottom Medallion Inscription Plate */}
      <rect
        x="72"
        y="354"
        width="176"
        height="18"
        rx="3"
        fill={cutInterior}
        stroke="url(#ma-gold-leaf)"
        strokeWidth="1"
      />
      <text
        x="160"
        y="366"
        textAnchor="middle"
        fill="#E6DEC8"
        fontSize="8"
        fontFamily="monospace"
        letterSpacing="2.4"
      >
        MARCUS AURELIUS · 121–180 AD
      </text>
    </svg>
  );
};

export interface StoicMaxim {
  id: string;
  bookRef: string;
  author: string;
  greekOrLatin: string;
  translation: string;
  quote: string;
  reflection: string;
}

export const STOIC_MEDITATION_MAXIMS: StoicMaxim[] = [
  {
    id: 'med-4-3',
    bookRef: 'Meditations · Book IV.3',
    author: 'Marcus Aurelius',
    greekOrLatin: 'Ἀναχωρήσεις εἰς ἑαυτόν',
    translation: 'Retreat into your own Inner Citadel',
    quote:
      'People look for retreats for themselves, in the country, by the coast, or in the hills. There is nowhere that a person can find a more peaceful and trouble-free retreat than in his own mind.',
    reflection:
      'You do not need the world to go quiet before you can think clearly. Clarity is a room you carry inside yourself.',
  },
  {
    id: 'med-2-1',
    bookRef: 'Meditations · Book II.1',
    author: 'Marcus Aurelius',
    greekOrLatin: 'Ἕωθεν προλέγειν ἑαυτῷ',
    translation: 'Begin the morning by telling yourself',
    quote:
      'When you wake up in the morning, tell yourself: the people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. None of them can hurt me.',
    reflection:
      'Frustration usually comes from expecting the world to behave differently than it always has.',
  },
  {
    id: 'med-5-20',
    bookRef: 'Meditations · Book V.20',
    author: 'Marcus Aurelius',
    greekOrLatin: 'Περιτροπὴ τοῦ ἐμποδίου',
    translation: 'The impediment to action advances action',
    quote:
      'The mind adapts and converts to its own purposes the obstacle to our acting. The impediment to action advances action. What stands in the way becomes the way.',
    reflection:
      'Every interruption or setback is raw material to practice patience, steadiness, or resourcefulness.',
  },
  {
    id: 'ench-1',
    bookRef: 'Enchiridion · Chapter I',
    author: 'Epictetus',
    greekOrLatin: 'Τὰ ἐφ’ ἡμῖν καὶ τὰ οὐκ ἐφ’ ἡμῖν',
    translation: 'What is up to us, and what is not',
    quote:
      'Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions.',
    reflection:
      'Overthinking almost always happens when we try to mentally manage the second list instead of acting on the first.',
  },
  {
    id: 'sen-ep-1',
    bookRef: 'Moral Letters · Epistle I',
    author: 'Seneca',
    greekOrLatin: 'Vindica te tibi',
    translation: 'Claim yourself for yourself',
    quote:
      'Nothing, Lucilius, is ours, except time. We are mistaken when we look forward to death; the major portion of death has already passed. Whatever years lie behind us are in death’s hands.',
    reflection:
      'Guard your attention the way people guard their money. What you give your hours to is what your life becomes.',
  },
  {
    id: 'med-7-59',
    bookRef: 'Meditations · Book VII.59',
    author: 'Marcus Aurelius',
    greekOrLatin: 'Ἔνδον βλέπε',
    translation: 'Look within',
    quote:
      'Look within. Within is the fountain of good, and it will ever bubble up, if you will ever dig.',
    reflection:
      'Instead of waiting for validation or certainty from outside, return to your own principles and work from there.',
  },
];

interface ControlItem {
  id: string;
  prompt: string;
  category: 'within' | 'outside';
  stoicNote: string;
}

const DICHOTOMY_ITEMS: ControlItem[] = [
  {
    id: 'dc-1',
    prompt: 'How other people interpret my intentions or judge my choices',
    category: 'outside',
    stoicNote:
      'Outside your control (Τὰ οὐκ ἐφ’ ἡμῖν). Other people’s minds belong to them. Explain yourself clearly once, act fairly, and let their opinion be theirs.',
  },
  {
    id: 'dc-2',
    prompt: 'The three seconds of space between an impulse and my reply',
    category: 'within',
    stoicNote:
      'Within your control (Τὰ ἐφ’ ἡμῖν). As Epictetus taught, impressions strike us uninvited, but our assent—whether we react in anger or pause—is entirely ours.',
  },
  {
    id: 'dc-3',
    prompt: 'Whether a plan I worked hard on succeeds without hiccups',
    category: 'outside',
    stoicNote:
      'Outside your control. The Stoic archer controls drawing the bow, aiming carefully, and releasing cleanly. Once the arrow leaves the hand, wind and fate decide the rest.',
  },
  {
    id: 'dc-4',
    prompt: 'Whether I keep my word and show up honestly when nobody is watching',
    category: 'within',
    stoicNote:
      'Within your control. Character is the only possession that cannot be taken from you by bad luck or other people.',
  },
  {
    id: 'dc-5',
    prompt: 'Mistakes I made two years ago or conversations I wish went differently',
    category: 'outside',
    stoicNote:
      'Outside your control. As Seneca wrote, what lies behind is already in the hands of fate. Only the lesson you carry into the present hour is yours.',
  },
  {
    id: 'dc-6',
    prompt: 'Choosing what deserves my attention for the next hour',
    category: 'within',
    stoicNote:
      'Within your control. Marcus Aurelius: “The quality of your life is dyed by the color of your habitual thoughts.”',
  },
];

const CARDINAL_VIRTUES = [
  {
    id: 'wisdom',
    greek: 'Φρόνησις · Phronesis',
    title: 'Practical Wisdom',
    Icon: Compass,
    summary:
      'Knowing what is good, what is bad, and what is indifferent. Navigating complex situations logically without being blinded by wishful thinking or panic.',
  },
  {
    id: 'courage',
    greek: 'Ἀνδρεία · Andreia',
    title: 'Courage',
    Icon: Shield,
    summary:
      'Not the absence of fear, but standing up for what is right, speaking honestly, and enduring discomfort without complaining.',
  },
  {
    id: 'justice',
    greek: 'Δικαιοσύνη · Dikaiosyne',
    title: 'Justice & Fairness',
    Icon: Scale,
    summary:
      'Marcus Aurelius called Justice the most important of the virtues: acting for the common good, treating people fairly, and keeping your obligations.',
  },
  {
    id: 'temperance',
    greek: 'Σωφροσύνη · Sophrosyne',
    title: 'Temperance',
    Icon: Flame,
    summary:
      'Self-restraint, discipline, and moderation. Doing things in the right measure and not letting passing impulses rule your day.',
  },
];

interface GlobalStoicBannerProps {
  atmosphere: StoicAtmosphereMode;
  onChangeAtmosphere: (mode: StoicAtmosphereMode) => void;
  onOpenPhilosophyRoom: () => void;
  isPhilosophyRoomActive: boolean;
}

/**
 * Global Stoic Medallion Sanctuary Bar shown across the site whenever the
 * "Stoic" theme is active — so the theme reflects real Stoic philosophy and
 * features the Marcus Aurelius Face-Cut portrait + Marble/Obsidian switcher.
 */
export const GlobalStoicThemeBanner: React.FC<GlobalStoicBannerProps> = ({
  atmosphere,
  onChangeAtmosphere,
  onOpenPhilosophyRoom,
  isPhilosophyRoomActive,
}) => {
  const [maximIdx, setMaximIdx] = useState<number>(0);
  const currentMaxim = STOIC_MEDITATION_MAXIMS[maximIdx % STOIC_MEDITATION_MAXIMS.length];

  // Calculate daylight / present day progress for Memento Mori indicator
  const dayProgress = useMemo(() => {
    const now = new Date();
    const minutesPassed = now.getHours() * 60 + now.getMinutes();
    const pct = Math.min(100, Math.max(1, Math.round((minutesPassed / 1440) * 100)));
    const hoursLeft = Math.max(0, 24 - now.getHours());
    return { pct, hoursLeft };
  }, []);

  const isObsidian = atmosphere === 'obsidian';

  return (
    <div
      className={`border-b transition-colors duration-300 ${
        isObsidian
          ? 'bg-[#12100E] text-[#EDE5D5] border-[#D4AF37]/30'
          : 'bg-[#E5DBC9] text-[#1A1614] border-[#7C2D26]/25'
      }`}
    >
      {/* Classical Roman Meander / Key Subtle Top Hairline */}
      <div
        aria-hidden="true"
        className="h-1 w-full"
        style={{
          backgroundImage: isObsidian
            ? 'repeating-linear-gradient(90deg, #D4AF37 0px, #D4AF37 10px, transparent 10px, transparent 16px, #7C2D26 16px, #7C2D26 22px, transparent 22px, transparent 28px)'
            : 'repeating-linear-gradient(90deg, #7C2D26 0px, #7C2D26 10px, transparent 10px, transparent 16px, #9C6B30 16px, #9C6B30 22px, transparent 22px, transparent 28px)',
          opacity: 0.65,
        }}
      />

      <div className="px-4 sm:px-7 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Left: Marcus Aurelius Face-Cut Cameo + Stoic Sanctuary Identity & Quote */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`relative w-14 h-16 sm:w-16 sm:h-18 rounded-xl shrink-0 overflow-hidden border flex items-center justify-center ${
              isObsidian
                ? 'bg-[#1B1815] border-[#D4AF37]/45 shadow-[0_0_20px_rgba(212,175,55,0.12)]'
                : 'bg-[#F6F0E4] border-[#7C2D26]/35 shadow-2xs'
            }`}
          >
            <MarcusAureliusFaceCutBust
              atmosphere={atmosphere}
              interactiveSlice={true}
              className="w-16 h-20 scale-110"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-mono-meta text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded ${
                  isObsidian
                    ? 'bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/30'
                    : 'bg-[#7C2D26]/12 text-[#7C2D26] border border-[#7C2D26]/25'
                }`}
              >
                Μ·ΑΥΡΗΛΙΟΣ · Stoic Philosophy Mode
              </span>
              <span className="font-mono-meta text-[10px] opacity-75">
                {currentMaxim.bookRef} · {currentMaxim.greekOrLatin}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentMaxim.id}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
                className="font-literary italic text-xs sm:text-sm leading-snug line-clamp-2"
              >
                “{currentMaxim.quote}”
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Dual Stoic Atmosphere Toggle (Marble vs Obsidian), Memento Mori Meter & Maxim Cycler */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 sm:gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-current/10">
          {/* Memento Mori Present-Day Progress Pill */}
          <div
            title="Memento Mori — Guard the present hour"
            className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono-meta flex items-center gap-2 ${
              isObsidian
                ? 'bg-[#1B1815] border-[#D4AF37]/25 text-[#D8CFC0]'
                : 'bg-[#F5EFE4] border-[#7C2D26]/20 text-[#3E3730]'
            }`}
          >
            <span className="uppercase tracking-wider opacity-75">Memento Mori:</span>
            <div className="w-14 h-1.5 rounded-full bg-current/15 overflow-hidden">
              <div
                style={{ width: `${dayProgress.pct}%` }}
                className={`h-full rounded-full ${
                  isObsidian ? 'bg-[#D4AF37]' : 'bg-[#7C2D26]'
                }`}
              />
            </div>
            <span className="tabular-nums font-semibold">{dayProgress.pct}% of today</span>
          </div>

          {/* Cycle Meditations Quote */}
          <button
            type="button"
            onClick={() => setMaximIdx((prev) => prev + 1)}
            className={`min-h-[32px] px-2.5 py-1 rounded-lg border font-mono-meta text-[10px] inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              isObsidian
                ? 'bg-[#1B1815] border-[#D4AF37]/30 text-[#E5C158] hover:bg-[#26211C]'
                : 'bg-[#F5EFE4] border-[#7C2D26]/25 text-[#7C2D26] hover:bg-[#FAF6EE]'
            }`}
          >
            <RotateCw className="w-3 h-3" />
            <span>Next Maxim</span>
          </button>

          {/* Dual Stoic Sub-Palette Switcher (So Stoic Theme Has 2 Distinct Philosophical Grades!) */}
          <div
            role="group"
            aria-label="Stoic Atmosphere"
            className={`inline-flex items-center p-0.5 rounded-lg border ${
              isObsidian
                ? 'bg-[#0B0A09] border-[#D4AF37]/30'
                : 'bg-[#D8CEBA] border-[#7C2D26]/25'
            }`}
          >
            <button
              type="button"
              onClick={() => onChangeAtmosphere('marble')}
              className={`px-2 py-1 rounded-md text-[10px] font-mono-meta inline-flex items-center gap-1 transition-all cursor-pointer ${
                !isObsidian
                  ? 'bg-[#F8F4EC] text-[#181615] font-semibold shadow-2xs'
                  : 'text-[#B8ADA0] hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3 text-[#9C6B30]" />
              <span>Marble</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeAtmosphere('obsidian')}
              className={`px-2 py-1 rounded-md text-[10px] font-mono-meta inline-flex items-center gap-1 transition-all cursor-pointer ${
                isObsidian
                  ? 'bg-[#26211C] text-[#E5C158] font-semibold border border-[#D4AF37]/40 shadow-2xs'
                  : 'text-[#433E39] hover:text-[#181615]'
              }`}
            >
              <Moon className="w-3 h-3 text-[#D4AF37]" />
              <span>Obsidian</span>
            </button>
          </div>

          {!isPhilosophyRoomActive && (
            <button
              type="button"
              onClick={onOpenPhilosophyRoom}
              className={`min-h-[32px] px-2.5 py-1 rounded-lg font-mono-meta text-[10px] inline-flex items-center gap-1 transition-all cursor-pointer ${
                isObsidian
                  ? 'bg-[#D4AF37] text-[#141210] font-semibold hover:bg-[#E5C158]'
                  : 'bg-[#7C2D26] text-[#F8F4EC] font-medium hover:bg-[#5E201A]'
              }`}
            >
              <span>Stoic Notes</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface StoicPhilosophyHeroProps {
  stoicThemeActive: boolean;
  atmosphere: StoicAtmosphereMode;
  onToggleStoicTheme: () => void;
  onChangeAtmosphere: (mode: StoicAtmosphereMode) => void;
}

/**
 * Centerpiece Marcus Aurelius Face-Cut Sculpture Relief & Interactive Stoic
 * Philosophy Studio inside the Philosophy Section (BlogSection.tsx).
 */
export const StoicPhilosophyStudioPanel: React.FC<StoicPhilosophyHeroProps> = ({
  stoicThemeActive,
  atmosphere,
  onToggleStoicTheme,
  onChangeAtmosphere,
}) => {
  const [sliceMode, setSliceMode] = useState<'citadel' | 'amor-fati'>('citadel');
  const [selectedVirtueId, setSelectedVirtueId] = useState<string>('wisdom');
  const [selectedControlId, setSelectedControlId] = useState<string>('dc-2');
  const [maximIndex, setMaximIndex] = useState<number>(0);

  const activeVirtue =
    CARDINAL_VIRTUES.find((v) => v.id === selectedVirtueId) || CARDINAL_VIRTUES[0];
  const activeControl =
    DICHOTOMY_ITEMS.find((c) => c.id === selectedControlId) || DICHOTOMY_ITEMS[0];
  const activeMaxim =
    STOIC_MEDITATION_MAXIMS[maximIndex % STOIC_MEDITATION_MAXIMS.length];

  const isObsidian = stoicThemeActive && atmosphere === 'obsidian';

  return (
    <section
      aria-label="Marcus Aurelius Face-Cut Sculpture and Interactive Stoic Philosophy Studio"
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isObsidian
          ? 'bg-[#141210] text-[#EDE5D5] border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.45)]'
          : stoicThemeActive
          ? 'bg-[#EFE7D8] text-[#1A1614] border-[#7C2D26]/35 shadow-[0_14px_36px_rgba(26,22,20,0.08)]'
          : 'bg-[var(--bg-canvas)] text-[var(--text-primary)] border-[var(--border-hairline)]'
      }`}
    >
      {/* Top Classical Frieze Bar */}
      <div
        className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-2 text-xs font-mono-meta ${
          isObsidian
            ? 'bg-[#1B1814] border-[#D4AF37]/25 text-[#E5C158]'
            : stoicThemeActive
            ? 'bg-[#E4D9C5] border-[#7C2D26]/20 text-[#7C2D26]'
            : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--accent-crimson)]'
        }`}
      >
        <div className="flex items-center gap-2">
          <Landmark className="w-3.5 h-3.5 shrink-0" />
          <span className="uppercase tracking-widest font-semibold">
            Μ·ΑΥΡΗΛΙΟΣ · The Inner Citadel &amp; Face-Cut Relief
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {stoicThemeActive && (
            <div className="inline-flex items-center gap-1 rounded-lg p-0.5 border border-current/20">
              <button
                type="button"
                onClick={() => onChangeAtmosphere('marble')}
                className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-all ${
                  atmosphere === 'marble'
                    ? 'bg-[#7C2D26] text-[#F8F4EC] font-semibold'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                I. Roman Marble
              </button>
              <button
                type="button"
                onClick={() => onChangeAtmosphere('obsidian')}
                className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-all ${
                  atmosphere === 'obsidian'
                    ? 'bg-[#D4AF37] text-[#141210] font-semibold'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                II. Danube Night (Obsidian &amp; Gold)
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleStoicTheme}
            className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider border cursor-pointer transition-all ${
              stoicThemeActive
                ? isObsidian
                  ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#E5C158]'
                  : 'bg-[#7C2D26] text-white border-[#7C2D26]'
                : 'bg-[var(--bg-canvas)] text-[var(--text-primary)] border-[var(--border-strong)] hover:border-[var(--accent-crimson)]'
            }`}
          >
            {stoicThemeActive ? 'Stoic Theme Active' : 'Activate Full Stoic Theme'}
          </button>
        </div>
      </div>

      {/* Main 12-Column Sculptural & Philosophical Grid */}
      <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left 5 Columns: Marcus Aurelius Face-Cut Sculpture Bust & Perspective Switcher */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-4">
          <div
            className={`relative w-full max-w-[320px] aspect-[5/6] rounded-2xl border p-4 flex flex-col items-center justify-center overflow-hidden transition-colors ${
              isObsidian
                ? 'bg-gradient-to-b from-[#1E1A16] via-[#141210] to-[#0D0B0A] border-[#D4AF37]/40'
                : 'bg-gradient-to-b from-[#FAF6EE] via-[#EFE7D8] to-[#E2D6C1] border-[#7C2D26]/30'
            }`}
          >
            {/* Corner Classical Inscription Marks */}
            <div className="absolute top-3 left-3.5 font-mono-meta text-[9px] uppercase tracking-widest opacity-60">
              STOA POIKILE
            </div>
            <div className="absolute top-3 right-3.5 font-mono-meta text-[9px] uppercase tracking-widest opacity-60">
              CARNUNTUM · 172 AD
            </div>

            <motion.div
              animate={{
                y: sliceMode === 'citadel' ? [0, -3, 0] : 0,
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full flex items-center justify-center"
            >
              <MarcusAureliusFaceCutBust
                atmosphere={isObsidian ? 'obsidian' : 'marble'}
                interactiveSlice={sliceMode === 'citadel'}
                className="w-56 h-64 sm:w-64 sm:h-72"
              />
            </motion.div>
          </div>

          {/* Interactive Face-Cut Anatomy Toggle */}
          <div className="w-full max-w-[320px] space-y-2">
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl border border-current/15 bg-current/5">
              <button
                type="button"
                onClick={() => setSliceMode('citadel')}
                className={`py-1.5 px-2 rounded-lg font-mono-meta text-[10px] transition-all cursor-pointer ${
                  sliceMode === 'citadel'
                    ? isObsidian
                      ? 'bg-[#D4AF37] text-[#141210] font-semibold'
                      : 'bg-[#7C2D26] text-white font-semibold'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                I. The Face-Cut (Inner Mind)
              </button>
              <button
                type="button"
                onClick={() => setSliceMode('amor-fati')}
                className={`py-1.5 px-2 rounded-lg font-mono-meta text-[10px] transition-all cursor-pointer ${
                  sliceMode === 'amor-fati'
                    ? isObsidian
                      ? 'bg-[#D4AF37] text-[#141210] font-semibold'
                      : 'bg-[#7C2D26] text-white font-semibold'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                II. The Marble Mask (Fate)
              </button>
            </div>

            <p className="font-mono-meta text-[11px] leading-relaxed opacity-85 text-center px-1">
              {sliceMode === 'citadel'
                ? 'The gold-leaf cut across the bust represents the Hegemonikon — the ruling center of the mind that remains untouched by external chaos.'
                : 'The outer stone represents Amor Fati — meeting whatever fate brings with a steady, uncomplaining face.'}
            </p>
          </div>
        </div>

        {/* Right 7 Columns: Interactive Stoic Philosophy Modules */}
        <div className="lg:col-span-7 space-y-6">
          {/* Module 1: Meditations Passage & Philosophical Lens */}
          <div
            className={`p-4 sm:p-5 rounded-xl border space-y-2.5 ${
              isObsidian
                ? 'bg-[#1B1814] border-[#D4AF37]/30'
                : 'bg-[var(--bg-surface)] border-[var(--border-hairline)]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-mono-meta text-[10px] uppercase tracking-widest text-[var(--accent-crimson)] font-semibold">
                {activeMaxim.bookRef} · {activeMaxim.author}
              </div>
              <button
                type="button"
                onClick={() => setMaximIndex((prev) => prev + 1)}
                className="font-mono-meta text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded border border-current/20 hover:border-current/50 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Another passage ({(maximIndex % STOIC_MEDITATION_MAXIMS.length) + 1}/{STOIC_MEDITATION_MAXIMS.length})</span>
              </button>
            </div>

            <blockquote className="font-serif-editorial text-lg sm:text-xl leading-snug">
              “{activeMaxim.quote}”
            </blockquote>

            <p className="font-sans-body text-xs sm:text-sm opacity-80 border-t border-current/10 pt-2">
              <strong className="font-mono-meta text-[10px] uppercase tracking-wider mr-1.5">
                In practice:
              </strong>
              {activeMaxim.reflection}
            </p>
          </div>

          {/* Module 2: The Four Stoic Cardinal Virtues (Arete) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono-meta text-[10px] uppercase tracking-widest opacity-75">
                The Four Cardinal Virtues · Ἀρετή
              </span>
              <span className="font-mono-meta text-[10px] opacity-65">Tap to inspect</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CARDINAL_VIRTUES.map((virtue) => {
                const Icon = virtue.Icon;
                const isSelected = virtue.id === activeVirtue.id;
                return (
                  <button
                    key={virtue.id}
                    type="button"
                    onClick={() => setSelectedVirtueId(virtue.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? isObsidian
                          ? 'bg-[#D4AF37] text-[#141210] border-[#D4AF37] font-semibold'
                          : 'bg-[#7C2D26] text-[#F8F4EC] border-[#7C2D26] font-medium'
                        : 'border-current/15 hover:border-current/35 bg-current/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-mono-meta text-[9px] opacity-80">
                        {virtue.greek.split(' · ')[1]}
                      </span>
                    </div>
                    <div className="font-serif-editorial text-sm leading-tight">
                      {virtue.title}
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                isObsidian
                  ? 'bg-[#1B1814]/80 border-[#D4AF37]/20'
                  : 'bg-[var(--bg-surface)]/80 border-[var(--border-hairline)]'
              }`}
            >
              <span className="font-mono-meta text-[10px] uppercase tracking-wider font-semibold mr-2">
                {activeVirtue.greek}:
              </span>
              <span className="opacity-90">{activeVirtue.summary}</span>
            </div>
          </div>

          {/* Module 3: Interactive Dichotomy of Control Sorter */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono-meta text-[10px] uppercase tracking-widest opacity-75">
                Interactive Exercise · The Dichotomy of Control
              </span>
              <span className="font-mono-meta text-[10px] opacity-65">
                Test an everyday thought
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {DICHOTOMY_ITEMS.map((item) => {
                const isSelected = item.id === activeControl.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedControlId(item.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2 ${
                      isSelected
                        ? isObsidian
                          ? 'bg-[#26211C] border-[#D4AF37] text-[#EDE5D5] font-medium'
                          : 'bg-[var(--bg-surface)] border-[#7C2D26] text-[var(--text-primary)] font-medium shadow-2xs'
                        : 'border-current/15 hover:border-current/30 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {item.category === 'within' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    )}
                    <span className="line-clamp-2 leading-snug">{item.prompt}</span>
                  </button>
                );
              })}
            </div>

            <div
              className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 ${
                activeControl.category === 'within'
                  ? isObsidian
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
                    : 'bg-emerald-950/5 border-emerald-700/25'
                  : isObsidian
                  ? 'bg-amber-950/30 border-amber-500/30 text-amber-100'
                  : 'bg-amber-950/5 border-amber-700/25'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
              <div>
                <span className="font-mono-meta text-[10px] uppercase tracking-wider font-semibold block mb-0.5">
                  {activeControl.category === 'within'
                    ? 'Up to you · Return your energy here'
                    : 'Not up to you · Practice letting this go'}
                </span>
                <p className="opacity-90">{activeControl.stoicNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
