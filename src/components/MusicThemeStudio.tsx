import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Disc,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Radio,
  Volume2,
  Pause,
  Play,
} from 'lucide-react';

export type MusicPageThemeId = 'sanctuary-slate' | 'bluenote-archival' | 'kissa-walnut';

export interface MusicThemeConfig {
  id: MusicPageThemeId | 'standard-room';
  name: string;
  shortLabel: string;
  subtitle: string;
  inspiration: string;
  wrapperBg: string;
  surfaceBg: string;
  elevatedBg: string;
  headingText: string;
  bodyText: string;
  mutedText: string;
  accentText: string;
  accentBg: string;
  accentHex: string;
  secondaryHex: string;
  borderHairline: string;
  borderStrong: string;
  dotColor: string;
  isDark: boolean;
  textureClass: string;
}

/**
 * Fallback configuration when "Music Sanctuary" toggle is turned OFF —
 * inherits the ambient global site theme cleanly so the user can compare
 * the Music Sanctuary atmosphere against the standard editorial room.
 */
export const STANDARD_EDITORIAL_MUSIC_THEME: MusicThemeConfig = {
  id: 'standard-room',
  name: 'Standard Editorial Room',
  shortLabel: 'Standard Room',
  subtitle: 'Inherits Global Site Palette & Typography',
  inspiration: 'Matches the active global notebook palette.',
  wrapperBg: 'bg-[var(--bg-surface)]',
  surfaceBg: 'bg-[var(--bg-canvas)]/70',
  elevatedBg: 'bg-[var(--bg-diner-olive)]/55',
  headingText: 'text-[var(--text-primary)]',
  bodyText: 'text-[var(--text-secondary)]',
  mutedText: 'text-[var(--text-muted)]',
  accentText: 'text-[var(--accent-crimson)]',
  accentBg: 'bg-[var(--accent-crimson)]',
  accentHex: '#B85D3B',
  secondaryHex: '#1E4D3B',
  borderHairline: 'border-[var(--border-hairline)]',
  borderStrong: 'border-[var(--border-strong)]',
  dotColor: '#8C8274',
  isDark: false,
  textureClass: '',
};

export const MUSIC_PAGE_THEMES: Record<MusicPageThemeId, MusicThemeConfig> = {
  'sanctuary-slate': {
    id: 'sanctuary-slate',
    name: 'Music Sanctuary · Acoustic Slate & Brass',
    shortLabel: 'Acoustic Slate',
    subtitle: 'Sound-Baffle Slate · Champagne Brass · Verdigris',
    inspiration:
      'Minimalist mastering sanctuary inspired by ECM Munich liner notes, acoustic timber baffles, and brushed brass studio hardware.',
    wrapperBg: 'bg-[#11151C]',
    surfaceBg: 'bg-[#171C24]',
    elevatedBg: 'bg-[#1F2631]',
    headingText: 'text-[#F3F1EC]',
    bodyText: 'text-[#C8D0DC]',
    mutedText: 'text-[#8894A4]',
    accentText: 'text-[#C89D54]',
    accentBg: 'bg-[#C89D54]',
    accentHex: '#C89D54',
    secondaryHex: '#3D9982',
    borderHairline: 'border-[#E2E8F0]/12',
    borderStrong: 'border-[#C89D54]/45',
    dotColor: '#C89D54',
    isDark: true,
    textureClass: 'music-sanctuary-mode music-sanctuary-texture-dark',
  },
  'bluenote-archival': {
    id: 'bluenote-archival',
    name: 'Music Sanctuary · ECM Archival Linen',
    shortLabel: 'Archival Linen',
    subtitle: 'Pressed Acoustic Cotton · Studio Petrol Teal',
    inspiration:
      'Daylight listening sanctuary with unbleached cotton sleeve stock, deep carbon ink, and studio petrol-teal accents.',
    wrapperBg: 'bg-[#ECEAE3]',
    surfaceBg: 'bg-[#F6F5F0]',
    elevatedBg: 'bg-[#E0DDD3]',
    headingText: 'text-[#141920]',
    bodyText: 'text-[#2F3742]',
    mutedText: 'text-[#5E6875]',
    accentText: 'text-[#1F5A6E]',
    accentBg: 'bg-[#1F5A6E]',
    accentHex: '#1F5A6E',
    secondaryHex: '#B85238',
    borderHairline: 'border-[#141920]/13',
    borderStrong: 'border-[#1F5A6E]/45',
    dotColor: '#1F5A6E',
    isDark: false,
    textureClass: 'music-sanctuary-mode music-sanctuary-texture-light',
  },
  'kissa-walnut': {
    id: 'kissa-walnut',
    name: 'Music Sanctuary · Tokyo Jazz Kissa',
    shortLabel: 'Tokyo Kissa',
    subtitle: 'Smoked Walnut Baffle · Warm Tube Amber',
    inspiration:
      'Late-night Tokyo vinyl sanctuary with smoked walnut cabinetry and warm vacuum-tube VU illumination.',
    wrapperBg: 'bg-[#12100E]',
    surfaceBg: 'bg-[#1A1613]',
    elevatedBg: 'bg-[#231E1A]',
    headingText: 'text-[#F4EFE6]',
    bodyText: 'text-[#D6CEC2]',
    mutedText: 'text-[#9E9486]',
    accentText: 'text-[#D4883A]',
    accentBg: 'bg-[#D4883A]',
    accentHex: '#D4883A',
    secondaryHex: '#C84B31',
    borderHairline: 'border-[#D6C5AD]/15',
    borderStrong: 'border-[#D4883A]/45',
    dotColor: '#D4883A',
    isDark: true,
    textureClass: 'music-sanctuary-mode music-sanctuary-texture-dark',
  },
};

interface FeaturedVinylPressing {
  id: string;
  catalogNo: string;
  albumId: string;
  title: string;
  artist: string;
  year: string;
  rpm: '33⅓ RPM' | '45 RPM';
  sideATrack: string;
  sideBTrack: string;
  linerNote: string;
  sleeveColor: string;
  labelColor: string;
  vuPeakLeft: number;
  vuPeakRight: number;
  eqProfile: { bass: number; mid: number; treble: number };
}

const FEATURED_VINYL_STACK: FeaturedVinylPressing[] = [
  {
    id: 'vp-gkmc',
    catalogNo: 'CAT. 01 · TDE / AFTERMATH',
    albumId: 'kdot-gkmc',
    title: 'good kid, m.A.A.d city',
    artist: 'Kendrick Lamar',
    year: '2012',
    rpm: '33⅓ RPM',
    sideATrack: "Sing About Me, I'm Dying of Thirst (12:03)",
    sideBTrack: 'Money Trees · Bitch, Don’t Kill My Vibe',
    linerNote:
      'A short film by Kendrick Lamar. Twelve-minute storytelling where every voice and tape-cassette skit feels like a scene you can see.',
    sleeveColor: '#1E293B',
    labelColor: '#C84B31',
    vuPeakLeft: 18,
    vuPeakRight: 22,
    eqProfile: { bass: 82, mid: 88, treble: 74 },
  },
  {
    id: 'vp-mbdtf',
    catalogNo: 'CAT. 02 · ROC-A-FELLA',
    albumId: 'ye-mbdtf',
    title: 'My Beautiful Dark Twisted Fantasy',
    artist: 'Kanye West',
    year: '2010',
    rpm: '33⅓ RPM',
    sideATrack: 'Runaway ft. Pusha T (09:08)',
    sideBTrack: 'Devil in a New Dress · POWER · All of the Lights',
    linerNote:
      'Opens with a single naked piano note and expands into choirs, cellos, and distorted vocoder confession.',
    sleeveColor: '#7F1D1D',
    labelColor: '#D4AF37',
    vuPeakLeft: 26,
    vuPeakRight: 24,
    eqProfile: { bass: 92, mid: 85, treble: 88 },
  },
  {
    id: 'vp-hindi',
    catalogNo: 'CAT. 03 · HMV ODEON',
    albumId: 'ye-college-dropout',
    title: 'Amar Prem · Hum Dono · Golden Melodies',
    artist: 'Kishore Kumar, Mohammed Rafi & R. D. Burman',
    year: '1961–1972',
    rpm: '33⅓ RPM',
    sideATrack: 'Kuch Toh Log Kahenge · Chingari Koi Bhadke',
    sideBTrack: 'Abhi Na Jao Chhod Kar · Lag Ja Gale',
    linerNote:
      'Warm analog strings, Sahir and Anand Bakshi’s timeless Urdu/Hindi verses, and voices that belong to quiet evenings.',
    sleeveColor: '#4A2C1D',
    labelColor: '#D97706',
    vuPeakLeft: 8,
    vuPeakRight: 12,
    eqProfile: { bass: 64, mid: 94, treble: 78 },
  },
  {
    id: 'vp-marathi',
    catalogNo: 'CAT. 04 · सप्तसूर मराठी',
    albumId: 'cole-2014-fhd',
    title: 'भावगीत, नाट्यसंगीत & Ajay–Atul',
    artist: 'Sudhir Phadke, Asha Bhosle & Ajay–Atul',
    year: 'Evergreen LP',
    rpm: '33⅓ RPM',
    sideATrack: 'Kevha Tari Pahate · Toch Chandrama Nabhat',
    sideBTrack: 'Jeev Rangala · Ghei Chhand Makarand',
    linerNote:
      'From intimate morning bhavgeet and classical bandish to Ajay–Atul’s massive symphonic dhol-tasha arrangements.',
    sleeveColor: '#263228',
    labelColor: '#B45309',
    vuPeakLeft: 16,
    vuPeakRight: 19,
    eqProfile: { bass: 78, mid: 92, treble: 84 },
  },
  {
    id: 'vp-blonde',
    catalogNo: 'CAT. 05 · BOYS DON’T CRY',
    albumId: 'frank-blonde',
    title: 'Blonde',
    artist: 'Frank Ocean',
    year: '2016',
    rpm: '33⅓ RPM',
    sideATrack: 'Nights (Beat Switch at 03:30) · Pink + White',
    sideBTrack: 'Self Control · White Ferrari · Seigfried',
    linerNote:
      ' weightless guitars, tape-speed vocals, and late-night solitude without a single wasted drum beat.',
    sleeveColor: '#D6D3C9',
    labelColor: '#2E6F40',
    vuPeakLeft: 4,
    vuPeakRight: 6,
    eqProfile: { bass: 68, mid: 90, treble: 82 },
  },
  {
    id: 'vp-ronettes',
    catalogNo: 'CAT. 06 · PHILLES RECORDS',
    albumId: 'jayz-blueprint',
    title: 'Be My Baby · 90s Alt-Rock Shelf',
    artist: 'The Ronettes · Oasis · Radiohead',
    year: '1963 / 1995',
    rpm: '45 RPM',
    sideATrack: 'Be My Baby — The Ronettes (02:40)',
    sideBTrack: "Don't Look Back in Anger · Fake Plastic Trees",
    linerNote:
      'That iconic opening drum beat from 1963 paired with 90s guitar choruses that make you turn the volume up.',
    sleeveColor: '#1E3A5F',
    labelColor: '#2563EB',
    vuPeakLeft: 21,
    vuPeakRight: 23,
    eqProfile: { bass: 80, mid: 86, treble: 90 },
  },
];

/**
 * Illuminated Analog VU Meter Gauge (Left / Right Channel Decibel Dial)
 * Purely music-native hardware visual — warm backlit glass, decibel arc (-20 to +3 dB),
 * and a pivoting physical needle.
 */
const AnalogVuMeter: React.FC<{
  channelLabel: string;
  needleDropped: boolean;
  baseAngle: number;
  isDark: boolean;
}> = ({ channelLabel, needleDropped, baseAngle, isDark }) => {
  return (
    <div
      className={`relative rounded-xl border p-2.5 overflow-hidden ${
        isDark
          ? 'bg-gradient-to-b from-[#2A2116] to-[#1D160F] border-[#D4883A]/35 shadow-[inset_0_2px_12px_rgba(212,136,58,0.18)]'
          : 'bg-gradient-to-b from-[#FDF9EE] to-[#F2E8CF] border-[#141820]/20 shadow-inner'
      }`}
    >
      {/* Top Channel & Peak LED */}
      <div className="flex items-center justify-between font-mono-meta text-[9px] uppercase tracking-widest mb-1">
        <span className={isDark ? 'text-[#E8C589]' : 'text-[#3F3526]'}>{channelLabel}</span>
        <span className="inline-flex items-center gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              needleDropped ? 'bg-[#D14328] animate-pulse' : 'bg-current/25'
            }`}
          />
          <span className="opacity-65 text-[8px]">PEAK</span>
        </span>
      </div>

      {/* Curved VU Scale SVG + Animated Needle */}
      <svg viewBox="0 0 160 76" className="w-full h-14 select-none" aria-hidden="true">
        {/* Normal Zone Arc (-20 to 0 dB) */}
        <path
          d="M 18 64 A 68 68 0 0 1 112 22"
          fill="none"
          stroke={isDark ? '#D6C5AD' : '#2C2620'}
          strokeWidth="1.5"
          strokeOpacity="0.65"
        />
        {/* Red Overload Zone Arc (0 to +3 dB) */}
        <path
          d="M 112 22 A 68 68 0 0 1 142 64"
          fill="none"
          stroke="#D14328"
          strokeWidth="2.2"
        />

        {/* Scale Markings */}
        <text x="20" y="48" fill={isDark ? '#C9B89C' : '#4A4238'} fontSize="6.5" fontFamily="monospace">
          -20
        </text>
        <text x="48" y="28" fill={isDark ? '#C9B89C' : '#4A4238'} fontSize="6.5" fontFamily="monospace">
          -10
        </text>
        <text x="80" y="20" fill={isDark ? '#C9B89C' : '#4A4238'} fontSize="6.5" fontFamily="monospace">
          -3
        </text>
        <text x="108" y="22" fill="#D14328" fontSize="7" fontFamily="monospace" fontWeight="bold">
          0
        </text>
        <text x="128" y="38" fill="#D14328" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
          +3
        </text>

        <text
          x="80"
          y="46"
          textAnchor="middle"
          fill={isDark ? '#E8C589' : '#3F3526'}
          fillOpacity="0.65"
          fontSize="7.5"
          fontFamily="monospace"
          letterSpacing="2"
        >
          VU · dB
        </text>

        {/* Pivoting Physical Meter Needle */}
        <motion.g
          style={{ originX: '80px', originY: '72px' }}
          animate={{
            rotate: needleDropped
              ? [baseAngle - 8, baseAngle + 7, baseAngle - 3, baseAngle + 5, baseAngle]
              : -42,
          }}
          transition={
            needleDropped
              ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.4 }
          }
        >
          <line
            x1="80"
            y1="72"
            x2="80"
            y2="14"
            stroke="#D14328"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Needle Pivot Cap */}
        <circle cx="80" cy="72" r="5" fill={isDark ? '#14110E' : '#2C2620'} />
      </svg>
    </div>
  );
};

interface MusicConsoleProps {
  theme: MusicThemeConfig;
  coverUrls: Record<string, string>;
  failedIds: Record<string, boolean>;
}

/**
 * A 100% Music-Native Interactive Hi-Fi Receiver & Physical Vinyl Sleeve Flipper
 * (Completely distinct from the Stoic bust layout: designed like a vintage
 * McIntosh / Braun audio deck paired with an interactive record sleeve stack).
 */
export const MusicThemeStudioPanel: React.FC<MusicConsoleProps> = ({
  theme,
  coverUrls,
  failedIds,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [needleDropped, setNeedleDropped] = useState<boolean>(true);
  const [analogWarmth, setAnalogWarmth] = useState<'flat' | 'warm-tube' | 'late-night'>('warm-tube');

  const currentRecord = FEATURED_VINYL_STACK[activeIndex % FEATURED_VINYL_STACK.length];
  const artworkUrl =
    coverUrls[currentRecord.albumId] && !failedIds[currentRecord.albumId]
      ? coverUrls[currentRecord.albumId]
      : undefined;

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + FEATURED_VINYL_STACK.length) % FEATURED_VINYL_STACK.length
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FEATURED_VINYL_STACK.length);
  };

  return (
    <section
      aria-label="Analog Hi-Fi Preamp Console and Interactive Vinyl Sleeve Stack"
      className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${theme.surfaceBg} ${theme.borderHairline}`}
    >
      {/* ===================================================================
          TOP RACK: BRUSHED HI-FI AMPLIFIER FACEPLATE & DUAL ANALOG VU METERS
          =================================================================== */}
      <div
        className={`p-4 sm:p-6 border-b grid grid-cols-1 lg:grid-cols-12 gap-5 items-center ${theme.elevatedBg} ${theme.borderHairline}`}
      >
        {/* Left 4 Cols: Preamp Model Spec & Needle Drop Switch */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  needleDropped ? 'bg-[#D14328] animate-pulse' : 'bg-current/30'
                }`}
              />
              <span className={`font-mono-meta text-[10px] uppercase tracking-widest ${theme.accentText}`}>
                MODEL SK-62 · STEREO PREAMPLIFIER
              </span>
            </div>
            <span className={`font-mono-meta text-[10px] ${theme.mutedText}`}>
              {currentRecord.rpm}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tactile Needle Drop / Lift Hardware Button */}
            <button
              type="button"
              onClick={() => setNeedleDropped((prev) => !prev)}
              className={`px-3.5 py-2 rounded-lg font-mono-meta text-xs inline-flex items-center gap-2 transition-all cursor-pointer border ${
                needleDropped
                  ? `${theme.accentBg} text-white border-transparent font-semibold shadow-xs`
                  : `${theme.surfaceBg} ${theme.headingText} ${theme.borderHairline}`
              }`}
            >
              {needleDropped ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Needle on Record</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Drop the Needle</span>
                </>
              )}
            </button>

            {/* 3-Position Analog Tone Contour Switch */}
            <div
              role="group"
              aria-label="Analog tone contour"
              className={`inline-flex items-center p-0.5 rounded-lg border ${theme.surfaceBg} ${theme.borderHairline}`}
            >
              {(
                [
                  { id: 'flat', label: 'Direct' },
                  { id: 'warm-tube', label: 'Tube Warmth' },
                  { id: 'late-night', label: '1 AM Low' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setAnalogWarmth(mode.id)}
                  className={`px-2 py-1 rounded text-[10px] font-mono-meta transition-colors cursor-pointer ${
                    analogWarmth === mode.id
                      ? `${theme.elevatedBg} ${theme.accentText} font-semibold`
                      : `${theme.mutedText} hover:${theme.headingText}`
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center 5 Cols: Dual Illuminated Analog VU Meters (L & R Channels) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <AnalogVuMeter
            channelLabel="LEFT CH · ANALOG"
            needleDropped={needleDropped}
            baseAngle={
              analogWarmth === 'warm-tube'
                ? currentRecord.vuPeakLeft + 4
                : analogWarmth === 'late-night'
                ? currentRecord.vuPeakLeft - 8
                : currentRecord.vuPeakLeft
            }
            isDark={theme.isDark}
          />
          <AnalogVuMeter
            channelLabel="RIGHT CH · STEREO"
            needleDropped={needleDropped}
            baseAngle={
              analogWarmth === 'warm-tube'
                ? currentRecord.vuPeakRight + 4
                : analogWarmth === 'late-night'
                ? currentRecord.vuPeakRight - 8
                : currentRecord.vuPeakRight
            }
            isDark={theme.isDark}
          />
        </div>

        {/* Right 3 Cols: 3-Band EQ Level Meters (Bass / Mid / Treble) */}
        <div
          className={`lg:col-span-3 p-3 rounded-xl border space-y-2 ${theme.surfaceBg} ${theme.borderHairline}`}
        >
          <div className="flex items-center justify-between font-mono-meta text-[9.5px] uppercase tracking-wider">
            <span className={theme.mutedText}>EQ CONTOUR</span>
            <span className={theme.accentText}>{analogWarmth.toUpperCase()}</span>
          </div>

          {[
            {
              label: 'BASS (80Hz)',
              val:
                analogWarmth === 'warm-tube'
                  ? Math.min(98, currentRecord.eqProfile.bass + 8)
                  : currentRecord.eqProfile.bass,
            },
            { label: 'MID (1.2kHz)', val: currentRecord.eqProfile.mid },
            {
              label: 'AIR (12kHz)',
              val:
                analogWarmth === 'late-night'
                  ? Math.max(45, currentRecord.eqProfile.treble - 18)
                  : currentRecord.eqProfile.treble,
            },
          ].map((band) => (
            <div key={band.label} className="space-y-0.5">
              <div className="flex justify-between font-mono-meta text-[9px]">
                <span className={theme.mutedText}>{band.label}</span>
                <span className={theme.headingText}>{band.val}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-current/10 overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: `${band.val}%` }}
                  transition={{ duration: 0.35 }}
                  style={{ backgroundColor: theme.accentHex }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================
          BOTTOM DECK: INTERACTIVE VINYL SLEEVE CRATE FLIPPER
          Shows physical record jacket with sliding vinyl disc + A/B Side Notes
          =================================================================== */}
      <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left 5 Cols: Physical Record Jacket with Sliding Vinyl LP */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRecord.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.22 }}
              className="relative w-full max-w-[300px] h-[220px] flex items-center"
            >
              {/* Vinyl Record Disc Sliding Out of the Right Side of the Jacket */}
              <motion.div
                animate={{
                  x: needleDropped ? 64 : 28,
                  rotate: needleDropped ? 360 : 0,
                }}
                transition={{
                  x: { duration: 0.4, ease: 'easeOut' },
                  rotate: needleDropped
                    ? { duration: 14, repeat: Infinity, ease: 'linear' }
                    : { duration: 0.3 },
                }}
                className="absolute right-4 w-[188px] h-[188px] rounded-full bg-[#111112] border-2 border-white/15 shadow-2xl flex items-center justify-center"
              >
                <div className="absolute inset-3 rounded-full border border-white/10" />
                <div className="absolute inset-7 rounded-full border border-white/6" />
                <div className="absolute inset-11 rounded-full border border-white/10" />
                <div
                  style={{ backgroundColor: currentRecord.labelColor }}
                  className="w-16 h-16 rounded-full border-2 border-[#141414] flex flex-col items-center justify-center text-center p-1"
                >
                  <span className="font-mono-meta text-[6.5px] uppercase tracking-widest text-white font-bold">
                    {currentRecord.rpm}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111112] my-1 border border-white/40" />
                  <span className="font-mono-meta text-[6px] uppercase text-white/90 truncate max-w-[46px]">
                    {currentRecord.year}
                  </span>
                </div>
              </motion.div>

              {/* Physical Square Cardboard Record Jacket (Left Foreground) */}
              <div
                style={{ backgroundColor: currentRecord.sleeveColor }}
                className="relative z-10 w-[196px] h-[196px] rounded-xl overflow-hidden border border-white/20 shadow-[12px_0_28px_rgba(0,0,0,0.45)] flex flex-col justify-between p-3.5 text-white"
              >
                {artworkUrl && (
                  <img
                    src={artworkUrl}
                    alt={currentRecord.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {!artworkUrl && (
                  <>
                    <div className="flex items-center justify-between font-mono-meta text-[8px] uppercase tracking-widest opacity-80">
                      <span>{currentRecord.year}</span>
                      <span>STEREO</span>
                    </div>
                    <div className="font-serif-editorial text-base leading-tight font-medium">
                      {currentRecord.title}
                    </div>
                    <div className="font-mono-meta text-[8.5px] uppercase tracking-wider opacity-85 truncate">
                      {currentRecord.artist}
                    </div>
                  </>
                )}
                {/* Cardboard Spine Crease */}
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/35 to-transparent pointer-events-none"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Record Sleeve Flipper Controls */}
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous record in stack"
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${theme.elevatedBg} ${theme.borderHairline} hover:opacity-85`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {FEATURED_VINYL_STACK.map((rec, i) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Select ${rec.title}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === activeIndex ? `w-6 ${theme.accentBg}` : 'w-2 bg-current/25'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next record in stack"
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${theme.elevatedBg} ${theme.borderHairline} hover:opacity-85`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 7 Cols: Active Sleeve Liner Notes, Side A / Side B Tracklist & Quick Crate Jump */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRecord.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono-meta text-[10.5px] uppercase tracking-widest">
                  <span className={theme.accentText}>{currentRecord.catalogNo}</span>
                  <span className={theme.mutedText}>
                     Sleeve {activeIndex + 1} of {FEATURED_VINYL_STACK.length}
                  </span>
                </div>
                <h3 className={`font-serif-editorial text-2xl sm:text-3xl ${theme.headingText}`}>
                  {currentRecord.title}
                </h3>
                <div className={`font-mono-meta text-xs ${theme.mutedText}`}>
                  {currentRecord.artist} · {currentRecord.year}
                </div>
              </div>

              <p className={`font-literary italic text-base leading-relaxed ${theme.bodyText}`}>
                “{currentRecord.linerNote}”
              </p>

              {/* Side A & Side B Pressing Strip */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border ${theme.wrapperBg} ${theme.borderHairline}`}
              >
                <div className="space-y-0.5">
                  <div className={`font-mono-meta text-[9.5px] uppercase tracking-widest ${theme.accentText}`}>
                    SIDE A · NEEDLE DROP
                  </div>
                  <div className={`font-sans-body text-xs sm:text-sm font-medium ${theme.headingText}`}>
                    {currentRecord.sideATrack}
                  </div>
                </div>
                <div className="space-y-0.5 sm:border-l sm:pl-3 border-current/10">
                  <div className={`font-mono-meta text-[9.5px] uppercase tracking-widest ${theme.mutedText}`}>
                    SIDE B · ESSENTIAL CUTS
                  </div>
                  <div className={`font-sans-body text-xs sm:text-sm ${theme.bodyText}`}>
                    {currentRecord.sideBTrack}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
