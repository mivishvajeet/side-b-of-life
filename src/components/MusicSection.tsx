import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowLeft, Disc, Sliders } from 'lucide-react';
import { ArchiveData, NavigationTab } from '../types/archive';
import {
  AlbumCrateSection,
  ALBUM_CACHE_KEY,
  FAVORITE_ALBUMS,
  MinimalArchivalSleeve,
} from './AlbumCrateSection';
import {
  MUSIC_PAGE_THEMES,
  MusicPageThemeId,
  MusicThemeConfig,
  MusicThemeStudioPanel,
  STANDARD_EDITORIAL_MUSIC_THEME,
} from './MusicThemeStudio';

interface MusicSectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  musicThemeActive?: boolean;
  onToggleMusicTheme?: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  onReadBlogPost?: (slug: string) => void;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
}

const SPOTIFY_PROFILE_URL =
  'https://open.spotify.com/user/fv5vyjnkvu7o9o97yo8mgkyvu?si=38f5f11750d446c2';

type SoundscapeSideId = 'side-a-rap' | 'side-b-hindi' | 'side-c-marathi' | 'side-d-wildcard';

interface SoundscapeSide {
  id: SoundscapeSideId;
  sideCode: string;
  sideLabel: string;
  vinylLabel: string;
  vinylAccent: string;
  tonearmAngle: number;
  featuredAlbumId: string;
  title: string;
  paragraphs: string[];
  defendedRecords?: {
    title: string;
    artist: string;
  }[];
  threeTracks?: {
    num: string;
    titleAndArtist: string;
    description: string;
  }[];
  footerTagLabel?: string;
  footerTagValue?: string;
  closingItalic?: string;
  visualRecords: {
    title: string;
    artist: string;
    year: string;
    bg: string;
    accent: string;
    albumRefId?: string;
  }[];
}

const FOUR_SIDES: SoundscapeSide[] = [
  {
    id: 'side-a-rap',
    sideCode: 'SIDE A',
    sideLabel: 'SIDE A — THE RAP SHELF',
    vinylLabel: 'K.DOT / YE',
    vinylAccent: '#C84B31',
    tonearmAngle: 22,
    featuredAlbumId: 'kdot-gkmc',
    title: 'Kendrick Lamar, Kanye West & the rest',
    paragraphs: [
      'I like rap that gives you something to come back for. A line that hits differently six months later. A beat that changes the way you hear the verse. An album that makes more sense when you listen to it from beginning to end.',
      'Kendrick is my favourite artist. good kid, m.A.A.d city feels like a film you can hear, while To Pimp a Butterfly keeps pulling me back into its arguments about identity, ego, race, and survival. And then there’s Mr. Morale & the Big Steppers, which is uncomfortable in ways I appreciate.',
      'Kanye is a different kind of obsession. The soul samples on The College Dropout, the ridiculous scale of Graduation, the maximalism of My Beautiful Dark Twisted Fantasy. His music has given me some of my favourite listening experiences, even when the person behind it makes that admiration complicated.',
      'Then there’s Nas, J. Cole, Jay-Z, Eminem, Frank Ocean, Mac Miller, and plenty of others. Different reasons, different moods. I don’t need them all to do the same thing.',
    ],
    defendedRecords: [
      { title: 'good kid, m.A.A.d city', artist: 'Kendrick Lamar' },
      { title: 'To Pimp a Butterfly', artist: 'Kendrick Lamar' },
      { title: 'Mr. Morale & the Big Steppers', artist: 'Kendrick Lamar' },
      { title: 'The College Dropout', artist: 'Kanye West' },
      { title: 'Graduation', artist: 'Kanye West' },
      { title: 'My Beautiful Dark Twisted Fantasy', artist: 'Kanye West' },
      { title: '2014 Forest Hills Drive', artist: 'J. Cole' },
      { title: 'Blonde', artist: 'Frank Ocean' },
      { title: 'Swimming', artist: 'Mac Miller' },
      { title: 'The Blueprint', artist: 'Jay-Z' },
    ],
    threeTracks: [
      {
        num: '01.',
        titleAndArtist: "Sing About Me, I'm Dying of Thirst — Kendrick Lamar",
        description:
          'Twelve minutes that never feel like twelve minutes. Different voices, different perspectives, and a story that stays with you after the music stops.',
      },
      {
        num: '02.',
        titleAndArtist: 'Runaway — Kanye West ft. Pusha T',
        description:
          "That piano, the confession, the long, strange outro. It's a beautiful song about a person who knows something is wrong with him and isn't sure what to do about it.",
      },
      {
        num: '03.',
        titleAndArtist: 'PRIDE. — Kendrick Lamar',
        description:
          "One of those songs that sounds better when you're alone with your headphones. Quietly devastating, without needing to announce itself.",
      },
    ],
    visualRecords: [
      {
        title: 'good kid, m.A.A.d city',
        artist: 'Kendrick Lamar',
        year: '2012',
        bg: '#1E2631',
        accent: '#CBD5E1',
        albumRefId: 'kdot-gkmc',
      },
      {
        title: 'My Beautiful Dark Twisted Fantasy',
        artist: 'Kanye West',
        year: '2010',
        bg: '#8F1D1D',
        accent: '#EAB308',
        albumRefId: 'ye-mbdtf',
      },
      {
        title: 'Blonde',
        artist: 'Frank Ocean',
        year: '2016',
        bg: '#EAE7DF',
        accent: '#2E6F40',
        albumRefId: 'frank-blonde',
      },
    ],
  },
  {
    id: 'side-b-hindi',
    sideCode: 'SIDE B',
    sideLabel: 'SIDE B — THE OLD HINDI SHELF',
    vinylLabel: 'HINDI ANALOG',
    vinylAccent: '#C88A32',
    tonearmAngle: 26,
    featuredAlbumId: 'ye-college-dropout',
    title: 'Kishore Kumar, Mohammed Rafi, Lata Mangeshkar & R. D. Burman',
    paragraphs: [
      "I don't have a particularly clever explanation for this one. Some melodies just stay with you.",
      'Kishore Kumar has that effortless warmth. Mohammed Rafi can make a song feel impossibly tender. Lata Mangeshkar has a voice that seems to belong to the melody itself. And R. D. Burman could make a composition feel playful, restless, romantic, or completely out of its time.',
      "I also pay attention to the writing. Gulzar, Sahir Ludhianvi, Anand Bakshi — there's a lot to return to in these songs beyond nostalgia.",
      "Some of these tracks remind me of a time I actually remember. Others remind me of a time I never lived through. I don't think a song needs to belong to your generation to feel personal.",
    ],
    footerTagLabel: 'The usual suspects:',
    footerTagValue: 'Kishore Kumar, Mohammed Rafi, Lata Mangeshkar, Asha Bhosle, R. D. Burman.',
    closingItalic: 'For long drives, quiet evenings, and those days when newer music can wait.',
    visualRecords: [
      {
        title: 'Amar Prem · Kuch Toh Log Kahenge',
        artist: 'Kishore Kumar & R. D. Burman',
        year: '1972',
        bg: '#4A2C1D',
        accent: '#E5A93C',
      },
      {
        title: 'Hum Dono · Abhi Na Jao Chhod Kar',
        artist: 'Mohammed Rafi & Asha Bhosle',
        year: '1961',
        bg: '#2D241E',
        accent: '#D4A373',
      },
      {
        title: 'Woh Kaun Thi · Lag Ja Gale',
        artist: 'Lata Mangeshkar & Madan Mohan',
        year: '1964',
        bg: '#3B2322',
        accent: '#E09F67',
      },
    ],
  },
  {
    id: 'side-c-marathi',
    sideCode: 'SIDE C',
    sideLabel: 'SIDE C — मराठी गाणी',
    vinylLabel: 'मराठी गाणी',
    vinylAccent: '#9A6B3B',
    tonearmAngle: 30,
    featuredAlbumId: 'cole-2014-fhd',
    title: 'भावगीत, नाट्यसंगीत आणि अजून बरंच काही',
    paragraphs: [
      "Marathi music deserves more than a little corner labelled regional favourites. There's too much variety for that.",
      "There's the intimacy of bhavgeet, the theatricality of natyasangeet, the compositions of Sudhir Phadke, the unmistakable voices of Asha Bhosle, and the larger-than-life sound of Ajay–Atul.",
      "These aren't all the same kind of listening experience. One song might be perfect for a quiet morning; another needs to be heard at full volume. Some carry a sense of familiarity that's difficult to explain unless you've grown up around the language.",
      "I like the fact that I can go from an old Marathi composition to an Ajay–Atul soundtrack without feeling like I've changed musical worlds entirely.",
    ],
    footerTagLabel: 'On this side:',
    footerTagValue: 'Sudhir Phadke, Asha Bhosle, Ajay–Atul, Marathi bhavgeet and natyasangeet.',
    closingItalic: 'मराठी गाणी ऐकण्यासाठी नेहमी काही खास कारण लागत नाही.',
    visualRecords: [
      {
        title: 'गीत रामायण · भावगीत',
        artist: 'Sudhir Phadke',
        year: 'Classic LP',
        bg: '#3D2B1F',
        accent: '#D9A05B',
      },
      {
        title: 'केव्हा तरी पहाटे',
        artist: 'Asha Bhosle & Hridaynath Mangeshkar',
        year: 'Ghazal / Bhavgeet',
        bg: '#263228',
        accent: '#A3B899',
      },
      {
        title: 'जोगवा · कट्यार काळजात घुसली',
        artist: 'Ajay–Atul & Rahul Deshpande',
        year: 'Symphonic Folk',
        bg: '#4A1F1B',
        accent: '#E29578',
      },
    ],
  },
  {
    id: 'side-d-wildcard',
    sideCode: 'SIDE D',
    sideLabel: 'SIDE D — THE WILD CARD',
    vinylLabel: '60s–90s PRESS',
    vinylAccent: '#4B6B8A',
    tonearmAngle: 34,
    featuredAlbumId: 'jayz-blueprint',
    title: 'The Ronettes, Oasis, Radiohead, Queen & whatever comes next',
    paragraphs: [
      "Somewhere between old Hindi melodies and hip-hop, there's a whole shelf of English-language music that I keep returning to.",
      "The Ronettes' Be My Baby is probably the best example. That drum intro alone is enough to make me stop whatever I'm doing. Phil Spector's wall-of-sound production can feel enormous without losing the simplicity of a great pop song.",
      "Then there's Oasis, Radiohead, Queen, and the kind of 90s rock and pop that makes you want to turn the volume up a little more than necessary.",
      "This side doesn't follow a particularly coherent path. That's sort of the point. Sometimes I want layered production and big guitars. Sometimes I just want a chorus that gets stuck in my head for three days.",
    ],
    footerTagLabel: 'A few regulars:',
    footerTagValue: 'The Ronettes, Oasis, Radiohead, Queen, and the occasional detour into pop.',
    closingItalic: 'No genre loyalty. No apologies for the occasional guilty pleasure.',
    visualRecords: [
      {
        title: 'Be My Baby · Presenting the Fabulous Ronettes',
        artist: 'The Ronettes',
        year: '1963 · Philles',
        bg: '#2B3A4A',
        accent: '#93C5FD',
      },
      {
        title: "(What's the Story) Morning Glory?",
        artist: 'Oasis',
        year: '1995 · Creation',
        bg: '#2D3136',
        accent: '#CBD5E1',
      },
      {
        title: 'OK Computer / The Bends',
        artist: 'Radiohead',
        year: '1995–1997',
        bg: '#1E293B',
        accent: '#7DD3FC',
      },
    ],
  },
];

/**
 * Minimalist Dieter Rams Braun SK-55 ("Snow White's Coffin") & Tokyo Jazz Kissa
 * architectural turntable illustration with live album art center label.
 */
const BraunAtelierTurntable: React.FC<{
  theme: MusicThemeConfig;
  activeSide: SoundscapeSide;
  centerArtworkUrl?: string;
}> = ({ theme, activeSide, centerArtworkUrl }) => {
  return (
    <div
      className={`relative w-full max-w-[330px] rounded-2xl p-5 border transition-colors ${theme.surfaceBg} ${theme.borderHairline} shadow-lg`}
    >
      {/* Top Hardware Plate Inscription */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-current/10 font-mono-meta text-[9.5px] uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.accentHex }}
          />
          <span className="opacity-80">SK-55 · PHONOGRAPH</span>
        </div>
        <span className="opacity-60">33⅓ RPM · STEREO</span>
      </div>

      {/* Platter + Tonearm Assembly */}
      <div className="relative aspect-square w-full flex items-center justify-center">
        {/* Recessed Platter Well */}
        <div
          className={`w-[86%] h-[86%] rounded-full border flex items-center justify-center ${theme.elevatedBg} ${theme.borderHairline}`}
        >
          {/* Vinyl Record Disc */}
          <div className="relative w-[92%] h-[92%] rounded-full bg-[#121110] border border-white/10 shadow-inner flex items-center justify-center vinyl-spin-slow">
            <div className="absolute inset-3 rounded-full border border-white/6" />
            <div className="absolute inset-6 rounded-full border border-white/5" />
            <div className="absolute inset-9 rounded-full border border-white/8" />
            <div className="absolute inset-12 rounded-full border border-white/5" />

            {/* Center Record Label with Real Album Cover Art */}
            <div
              style={{ backgroundColor: activeSide.vinylAccent }}
              className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#1C1917] flex items-center justify-center shadow-md"
            >
              {centerArtworkUrl && (
                <img
                  src={centerArtworkUrl}
                  alt={activeSide.vinylLabel}
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
              )}
              <div className="relative z-10 w-full h-full bg-black/35 flex flex-col items-center justify-center text-center p-1">
                <span className="font-mono-meta text-[6.5px] uppercase tracking-widest text-white font-semibold leading-none">
                  {activeSide.sideCode}
                </span>
                <div className="w-2.5 h-2.5 rounded-full bg-[#121110] my-1 border border-white/40" />
                <span className="font-mono-meta text-[6px] uppercase tracking-wider text-white/90 leading-none truncate max-w-[54px]">
                  {activeSide.vinylLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Dieter Rams Brushed Aluminum Tonearm */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <circle
            cx="84"
            cy="18"
            r="7"
            fill={theme.isDark ? '#2C2621' : '#D8D0C2'}
            stroke={theme.accentHex}
            strokeWidth="1"
          />
          <circle cx="84" cy="18" r="3" fill={theme.accentHex} />

          <g
            style={{
              transformOrigin: '84px 18px',
              transform: `rotate(${activeSide.tonearmAngle - 24}deg)`,
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <line
              x1="84"
              y1="12"
              x2="84"
              y2="68"
              stroke={theme.isDark ? '#D6CEC2' : '#3F3A34'}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <line
              x1="84"
              y1="68"
              x2="74"
              y2="78"
              stroke={theme.isDark ? '#D6CEC2' : '#3F3A34'}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="74" cy="78" r="1.5" fill={theme.accentHex} />
          </g>
        </svg>

        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 font-mono-meta text-[9px] opacity-75">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: activeSide.vinylAccent }}
          />
          <span>{activeSide.sideCode}</span>
        </div>
      </div>

      {/* Bottom Caption Bar */}
      <div className="pt-3.5 mt-3 border-t border-current/10 flex items-center justify-between font-mono-meta text-[10px]">
        <span className="opacity-70">ON PLATTER</span>
        <span className="font-medium truncate max-w-[180px]">{activeSide.title}</span>
      </div>
    </div>
  );
};

export const MusicSection: React.FC<MusicSectionProps> = ({ onNavigate }) => {
  // Master "Music Sanctuary" Theme Toggle (Scoped strictly to MusicSection)
  const [isSanctuaryActive, setIsSanctuaryActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vd_music_sanctuary_active_v1');
      if (saved === 'false') return false;
      if (saved === 'true') return true;
    } catch {
      // Ignore
    }
    return true;
  });

  // Acoustic Finish within the Music Sanctuary
  const [musicThemeId, setMusicThemeId] = useState<MusicPageThemeId>(() => {
    try {
      const saved = localStorage.getItem('vd_music_page_theme_v3') as MusicPageThemeId | null;
      if (
        saved === 'sanctuary-slate' ||
        saved === 'bluenote-archival' ||
        saved === 'kissa-walnut'
      ) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'sanctuary-slate';
  });

  const handleToggleSanctuary = () => {
    setIsSanctuaryActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vd_music_sanctuary_active_v1', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleSelectMusicTheme = (next: MusicPageThemeId) => {
    setMusicThemeId(next);
    if (!isSanctuaryActive) {
      setIsSanctuaryActive(true);
      try {
        localStorage.setItem('vd_music_sanctuary_active_v1', 'true');
      } catch {
        // Ignore
      }
    }
    try {
      localStorage.setItem('vd_music_page_theme_v3', next);
    } catch {
      // Ignore
    }
  };

  const activeTheme: MusicThemeConfig = isSanctuaryActive
    ? MUSIC_PAGE_THEMES[musicThemeId]
    : STANDARD_EDITORIAL_MUSIC_THEME;

  // Shared high-resolution album cover dictionary fetched once from Apple Music public CORS API
  const [coverUrls, setCoverUrls] = useState<Record<string, string>>(() => {
    try {
      const cached = localStorage.getItem(ALBUM_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // Ignore
    }
    return {};
  });
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    const missingAlbums = FAVORITE_ALBUMS.filter((a) => !coverUrls[a.id]);
    if (missingAlbums.length === 0) return;

    const fetchCovers = async () => {
      const updates: Record<string, string> = {};
      await Promise.all(
        missingAlbums.map(async (album) => {
          try {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
              album.searchQuery
            )}&entity=album&limit=3`;
            const res = await fetch(url);
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data?.results) && data.results.length > 0) {
              const best = data.results[0];
              if (best?.artworkUrl100) {
                updates[album.id] = String(best.artworkUrl100).replace(
                  '100x100bb',
                  '600x600bb'
                );
              }
            }
          } catch {
            // Keep bespoke sleeve graphic
          }
        })
      );

      if (!cancelled && Object.keys(updates).length > 0) {
        setCoverUrls((prev) => {
          const merged = { ...prev, ...updates };
          try {
            localStorage.setItem(ALBUM_CACHE_KEY, JSON.stringify(merged));
          } catch {
            // Ignore
          }
          return merged;
        });
      }
    };

    fetchCovers();
    return () => {
      cancelled = true;
    };
  }, [coverUrls]);

  const handleMarkFailed = (id: string) => {
    setFailedIds((prev) => ({ ...prev, [id]: true }));
  };

  const [activeSideId, setActiveSideId] = useState<SoundscapeSideId>('side-a-rap');
  const [showAllSidesExpanded, setShowAllSidesExpanded] = useState<boolean>(false);

  const activeSide = useMemo(
    () => FOUR_SIDES.find((s) => s.id === activeSideId) || FOUR_SIDES[0],
    [activeSideId]
  );

  const accentColor = activeTheme.accentText;
  const mutedText = activeTheme.mutedText;
  const bodyText = activeTheme.bodyText;
  const headingText = activeTheme.headingText;
  const hairlineBorder = activeTheme.borderHairline;
  const surfaceBg = activeTheme.surfaceBg;

  const heroShowcaseAlbums = useMemo(
    () =>
      ['kdot-gkmc', 'ye-graduation', 'frank-blonde', 'seedhe-maut-lunch-break']
        .map((id) => FAVORITE_ALBUMS.find((a) => a.id === id))
        .filter((a): a is NonNullable<typeof a> => Boolean(a)),
    []
  );

  const renderSideCard = (side: SoundscapeSide) => (
    <div
      key={side.id}
      className={`rounded-2xl border p-5 sm:p-8 space-y-7 ${surfaceBg} ${hairlineBorder} ${
        isSanctuaryActive ? 'music-sanctuary-card-surface' : ''
      }`}
    >
      {/* Side Header + Minimalist 3-Record Visual Strip */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b pb-6 ${hairlineBorder}`}
      >
        <div className="lg:col-span-7 space-y-1.5">
          <div className={`font-mono-meta text-xs uppercase tracking-widest ${accentColor}`}>
            {side.sideLabel}
          </div>
          <h3 className={`font-serif-editorial editorial-sub-heading ${headingText}`}>
            {side.title}
          </h3>
        </div>

        {/* Minimal 3-Record Sleeve Strip for this Side */}
        <div className="lg:col-span-5 flex items-center lg:justify-end gap-3">
          {side.visualRecords.map((vr) => {
            const linkedAlbum = vr.albumRefId
              ? FAVORITE_ALBUMS.find((a) => a.id === vr.albumRefId)
              : undefined;
            const imgUrl =
              vr.albumRefId && coverUrls[vr.albumRefId] && !failedIds[vr.albumRefId]
                ? coverUrls[vr.albumRefId]
                : undefined;

            return (
              <div
                key={vr.title}
                title={`${vr.title} — ${vr.artist}`}
                className="flex items-center gap-2.5 min-w-0"
              >
                <div
                  style={{ backgroundColor: vr.bg }}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 border ${hairlineBorder}`}
                >
                  {linkedAlbum ? (
                    <MinimalArchivalSleeve album={linkedAlbum} />
                  ) : (
                    <div className="w-full h-full p-1.5 flex flex-col justify-between text-left">
                      <span
                        className="font-mono-meta text-[7px] uppercase tracking-wider"
                        style={{ color: vr.accent }}
                      >
                        {vr.year}
                      </span>
                      <span className="font-serif-editorial text-[9px] text-white leading-tight line-clamp-2">
                        {vr.title.split(' · ')[0]}
                      </span>
                    </div>
                  )}
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={vr.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Narrative Paragraphs + Right Side Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div
          className={`${
            side.defendedRecords ? 'lg:col-span-6' : 'lg:col-span-12 max-w-3xl'
          } space-y-4 font-sans-body editorial-body ${bodyText}`}
        >
          {side.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}

          {side.footerTagLabel && side.footerTagValue && (
            <p className="pt-2">
              <strong className={`font-semibold ${headingText}`}>{side.footerTagLabel}</strong>{' '}
              <span>{side.footerTagValue}</span>
            </p>
          )}

          {side.closingItalic && (
            <p className={`font-literary italic pt-1 ${accentColor}`}>{side.closingItalic}</p>
          )}
        </div>

        {/* Side A Specific Lists: "The records I'd defend first" & "Three tracks I'd make you sit through" */}
        {side.defendedRecords && side.threeTracks && (
          <div className="lg:col-span-6 space-y-6">
            <div
              className={`p-5 rounded-xl border space-y-3 ${activeTheme.wrapperBg} ${hairlineBorder}`}
            >
              <h4 className={`font-mono-meta text-xs uppercase tracking-widest ${accentColor}`}>
                The records I&apos;d defend first
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {side.defendedRecords.map((rec) => (
                  <li key={rec.title} className="flex items-baseline gap-2">
                    <span className={`font-mono-meta text-[10px] ${accentColor}`}>—</span>
                    <span className={headingText}>
                      <em className="font-serif-editorial text-base">{rec.title}</em>{' '}
                      <span className={`font-mono-meta text-xs ${mutedText}`}>
                        · {rec.artist}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3.5">
              <h4
                className={`font-mono-meta text-xs uppercase tracking-widest border-b pb-2 ${accentColor} ${hairlineBorder}`}
              >
                Three tracks I&apos;d make you sit through
              </h4>
              <div className="divide-y divide-current/10">
                {side.threeTracks.map((tr) => (
                  <div key={tr.num} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <div className={`font-serif-editorial text-lg ${headingText}`}>
                      <span className={`font-mono-meta text-xs mr-2 ${accentColor}`}>
                        {tr.num}
                      </span>
                      {tr.titleAndArtist}
                    </div>
                    <p className={`font-sans-body editorial-body-sm ${bodyText}`}>
                      {tr.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      data-music-sanctuary={isSanctuaryActive ? musicThemeId : 'off'}
      className={`rounded-2xl transition-all duration-300 p-5 sm:p-8 md:p-10 border ${
        activeTheme.wrapperBg
      } ${headingText} ${hairlineBorder} ${activeTheme.textureClass} ${
        isSanctuaryActive
          ? 'shadow-[0_24px_60px_rgba(0,0,0,0.28)]'
          : 'shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
      }`}
    >
      <div className="space-y-12">
        {/* =====================================================================
            1. TOP ARCHITECTURAL HEADER & "MUSIC SANCTUARY" THEME TOGGLE
            ===================================================================== */}
        <header className={`pb-10 border-b space-y-7 ${hairlineBorder}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {onNavigate ? (
              <button
                type="button"
                onClick={() => onNavigate('interests')}
                className={`inline-flex items-center gap-1.5 text-xs font-mono-meta transition-colors cursor-pointer ${mutedText} hover:${headingText}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Curiosities</span>
              </button>
            ) : (
              <span className={`font-mono-meta text-xs uppercase tracking-widest ${accentColor}`}>
                05 · THE LISTENING ROOM
              </span>
            )}

            {/* Dedicated "Music Sanctuary" Theme Toggle + Acoustic Tuning Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Primary Music Sanctuary Master Toggle Button */}
              <button
                type="button"
                aria-pressed={isSanctuaryActive}
                onClick={handleToggleSanctuary}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-meta inline-flex items-center gap-2 border transition-all cursor-pointer ${
                  isSanctuaryActive
                    ? `${activeTheme.accentBg} text-white border-transparent font-semibold shadow-xs`
                    : `${surfaceBg} ${headingText} ${hairlineBorder} hover:opacity-90`
                }`}
              >
                <Disc
                  className={`w-3.5 h-3.5 ${isSanctuaryActive ? 'vinyl-spin-slow' : ''}`}
                />
                <span>Music Sanctuary</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9.5px] uppercase tracking-wider ${
                    isSanctuaryActive
                      ? 'bg-black/25 text-white'
                      : 'bg-current/10 opacity-75'
                  }`}
                >
                  {isSanctuaryActive ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Acoustic Finish Selector (Visible when Music Sanctuary is active) */}
              {isSanctuaryActive && (
                <div
                  role="group"
                  aria-label="Select Music Sanctuary Acoustic Finish"
                  className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-xl border ${activeTheme.elevatedBg} ${hairlineBorder}`}
                >
                  <span
                    className={`px-2 font-mono-meta text-[10px] uppercase tracking-wider hidden xl:inline ${mutedText}`}
                  >
                    <Sliders className="w-3 h-3 inline mr-1" />
                    Acoustic Tuning:
                  </span>
                  {(Object.values(MUSIC_PAGE_THEMES) as MusicThemeConfig[]).map((t) => {
                    const isSelected = t.id === activeTheme.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectMusicTheme(t.id as MusicPageThemeId)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono-meta inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? `${activeTheme.surfaceBg} ${headingText} font-semibold border ${activeTheme.borderStrong}`
                            : `${mutedText} hover:${headingText}`
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: t.dotColor }}
                        />
                        <span>{t.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <a
                href={SPOTIFY_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono-meta border transition-colors ${hairlineBorder} ${surfaceBg} hover:opacity-85`}
              >
                <span>Spotify Archive</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Minimalist Sanctuary Acoustic Spec & Harmonic Waveform Strip when Active */}
          {isSanctuaryActive && (
            <div
              className={`px-4 py-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${activeTheme.surfaceBg} ${hairlineBorder}`}
            >
              <div className="flex flex-wrap items-center gap-2.5 font-mono-meta text-[10.5px]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: activeTheme.accentHex }}
                />
                <span className={`uppercase tracking-widest font-semibold ${accentColor}`}>
                  MUSIC SANCTUARY ACTIVE
                </span>
                <span className={mutedText}>·</span>
                <span className={headingText}>{activeTheme.subtitle}</span>
                <span className={`hidden md:inline ${mutedText}`}>
                  · {activeTheme.inspiration}
                </span>
              </div>

              {/* Minimalist SVG Acoustic Room Harmonic Curve */}
              <div className="flex items-center gap-3">
                <svg
                  viewBox="0 0 120 18"
                  className="w-24 h-3.5 opacity-75 hidden sm:block"
                  aria-hidden="true"
                >
                  <path
                    d="M 2 9 Q 16 2, 30 9 T 58 9 T 86 9 T 118 9"
                    fill="none"
                    stroke={activeTheme.accentHex}
                    strokeWidth="1.4"
                  />
                  <path
                    d="M 2 9 Q 16 15, 30 9 T 58 9 T 86 9 T 118 9"
                    fill="none"
                    stroke={activeTheme.secondaryHex}
                    strokeWidth="1"
                    strokeOpacity="0.55"
                  />
                </svg>
                <span className={`font-mono-meta text-[9.5px] uppercase tracking-widest ${mutedText}`}>
                  BAFFLE · 20Hz–20kHz
                </span>
              </div>
            </div>
          )}

          {/* 12-Column Editorial Hero: Left 7 Cols Manifesto + Right 5 Cols Braun SK-55 Turntable & 4-Record Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`font-mono-meta text-xs uppercase tracking-widest ${accentColor}`}>
                  THE LISTENING ROOM
                </span>
                <span className={`font-mono-meta text-[10px] ${mutedText}`}>
                  · {activeTheme.name}
                </span>
              </div>

              <h1 className={`font-serif-editorial editorial-hero-display ${headingText}`}>
                My music taste has no adult supervision.
              </h1>

              <div className={`space-y-4 font-sans-body editorial-body max-w-2xl ${bodyText}`}>
                <p className={`font-serif-editorial editorial-lead ${headingText}`}>
                  Some days it&apos;s Kishore Kumar. Some days it&apos;s Kendrick Lamar explaining
                  his own contradictions over a beat. Sometimes it&apos;s a Marathi song I&apos;ve
                  heard a hundred times, The Ronettes singing <em className="italic">Be My Baby</em>
                  , or Oasis being unnecessarily loud in my headphones.
                </p>

                <p className={`font-medium ${headingText}`}>
                  I&apos;ve never been good at sticking to one genre. I don&apos;t really see the
                  point, either.
                </p>

                <p>
                  This is where I keep the music I return to, the albums I consider worth sitting
                  with, and the songs that somehow made it into my life and refused to leave. No
                  rankings based on streams. No pretending I listen to everything. Just the records,
                  artists, and rabbit holes that have made their way into my rotation.
                </p>

                <div className={`pt-3 border-t ${hairlineBorder}`}>
                  <span className={`font-mono-meta text-xs uppercase tracking-wider ${accentColor}`}>
                    Currently in heavy rotation:
                  </span>{' '}
                  <span className={headingText}>
                    Kendrick Lamar, Kanye West, old Hindi melodies, Marathi classics. The order
                    depends on the day.
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Minimalist Braun SK-55 Turntable + 4-Sleeve Preview Strip */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-3">
              <BraunAtelierTurntable
                theme={activeTheme}
                activeSide={activeSide}
                centerArtworkUrl={
                  coverUrls[activeSide.featuredAlbumId] &&
                  !failedIds[activeSide.featuredAlbumId]
                    ? coverUrls[activeSide.featuredAlbumId]
                    : undefined
                }
              />

              {/* Minimal 4-Sleeve Visual Strip under the Plinth */}
              <div className="w-full max-w-[330px] grid grid-cols-4 gap-2">
                {heroShowcaseAlbums.map((alb) => {
                  const hasArt = Boolean(coverUrls[alb.id] && !failedIds[alb.id]);
                  return (
                    <div
                      key={alb.id}
                      title={`${alb.title} — ${alb.artist}`}
                      className={`relative aspect-square rounded-lg overflow-hidden border ${hairlineBorder}`}
                    >
                      <MinimalArchivalSleeve album={alb} />
                      {hasArt && (
                        <img
                          src={coverUrls[alb.id]}
                          alt={alb.title}
                          onError={() => handleMarkFailed(alb.id)}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =================================================================
              ANALOG HI-FI PREAMPLIFIER CONSOLE, DUAL VU METERS & SLEEVE STACK
              ================================================================= */}
          <MusicThemeStudioPanel
            theme={activeTheme}
            coverUrls={coverUrls}
            failedIds={failedIds}
          />
        </header>

        {/* =====================================================================
            2. FOUR SIDES OF MY MUSIC TASTE
            ===================================================================== */}
        <section aria-labelledby="four-sides-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <div className={`font-mono-meta text-[11px] uppercase tracking-widest ${accentColor}`}>
                01 · FOUR SIDES OF MY MUSIC TASTE
              </div>
              <h2
                id="four-sides-heading"
                className={`font-serif-editorial editorial-section-heading ${headingText}`}
              >
                Pick a side. There&apos;s a fair chance you&apos;ll end up somewhere else.
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowAllSidesExpanded((prev) => !prev)}
              className={`self-start sm:self-auto px-3 py-1.5 rounded-lg font-mono-meta text-xs border cursor-pointer transition-colors ${hairlineBorder} ${surfaceBg} ${headingText}`}
            >
              {showAllSidesExpanded ? 'Single Turntable View' : 'Read All 4 Sides Together'}
            </button>
          </div>

          {/* 4 Architectural Side Tabs */}
          {!showAllSidesExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {FOUR_SIDES.map((side) => {
                const isSelected = side.id === activeSide.id;
                return (
                  <button
                    key={side.id}
                    type="button"
                    onClick={() => setActiveSideId(side.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? `${activeTheme.elevatedBg} ${activeTheme.borderStrong} shadow-sm`
                        : `${surfaceBg} ${hairlineBorder} hover:opacity-90`
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 font-mono-meta text-[10px] uppercase tracking-widest">
                        <span className={isSelected ? accentColor : mutedText}>
                          {side.sideLabel}
                        </span>
                        <span
                          style={{ backgroundColor: side.vinylAccent }}
                          className="w-2 h-2 rounded-full shrink-0"
                        />
                      </div>

                      <h3 className={`font-serif-editorial text-lg leading-snug ${headingText}`}>
                        {side.title}
                      </h3>
                    </div>

                    <div
                      className={`pt-2 border-t ${hairlineBorder} flex items-center justify-between font-mono-meta text-[10px]`}
                    >
                      <span className={isSelected ? accentColor : mutedText}>
                        {isSelected ? 'On Platter' : 'Select Side'}
                      </span>
                      <span className={mutedText}>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Side or All 4 Sides */}
          {showAllSidesExpanded ? (
            <div className="space-y-6">{FOUR_SIDES.map((s) => renderSideCard(s))}</div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSide.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                {renderSideCard(activeSide)}
              </motion.div>
            </AnimatePresence>
          )}
        </section>

        {/* =====================================================================
            3. THE RECORD WALL — 25 ESSENTIAL ALBUMS ACROSS 5 CRATES
            ===================================================================== */}
        <AlbumCrateSection
          theme={activeTheme}
          coverUrls={coverUrls}
          failedIds={failedIds}
          onMarkFailed={handleMarkFailed}
        />

        {/* =====================================================================
            4. FIELD NOTE 01 & FIELD NOTE 02
            ===================================================================== */}
        <section
          aria-label="Field Notes on Desi Hip-Hop and Kendrick Lamar"
          className={`pt-10 border-t grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start ${hairlineBorder}`}
        >
          {/* FIELD NOTE 01: Bombay to Compton */}
          <article
            className={`lg:col-span-5 rounded-2xl p-5 sm:p-7 border space-y-4 ${surfaceBg} ${hairlineBorder}`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${hairlineBorder}`}>
              <span className={`font-mono-meta text-xs uppercase tracking-widest ${accentColor}`}>
                FIELD NOTE 01
              </span>
              <span className={`font-mono-meta text-[10px] uppercase tracking-wider ${mutedText}`}>
                Bombay to Compton
              </span>
            </div>

            <h2 className={`font-serif-editorial editorial-sub-heading ${headingText}`}>
              Bombay to Compton: how I fell into Desi hip-hop.
            </h2>

            <div className={`space-y-3.5 font-sans-body editorial-body ${bodyText}`}>
              <p className={`font-medium ${headingText}`}>
                It started with Emiway Bantai&apos;s <em className="italic">Aisa Kuch Shot Nahi</em>.
              </p>
              <p>
                One random listen. The Bombay slang, the delivery, the energy. I played it on loop
                and then went looking for more.
              </p>
              <p>
                That led me to Divine and Naezy, then Raftaar, and eventually the whole scene around
                them. The Emiway–Raftaar beef pulled me further in. Suddenly, I wasn&apos;t just
                listening to songs. I was following rivalries, decoding bars, discovering artists,
                and trying to understand the culture behind the music.
              </p>
              <p className={`font-medium ${headingText}`}>Then the rabbit hole got bigger.</p>
              <p>
                Lil Wayne, 50 Cent, Eminem, Jay-Z, Kanye West, Kendrick Lamar, J. Cole, Future,
                Travis Scott. One artist led to another, and every new discovery opened another door.
              </p>
              <p className={`font-literary italic ${accentColor}`}>
                Desi hip-hop was my entry point, but storytelling is what kept me there.
              </p>
            </div>

            <div className={`pt-3 border-t space-y-1 ${hairlineBorder}`}>
              <div className={`font-mono-meta text-[10px] uppercase tracking-widest ${accentColor}`}>
                The Indian rap rotation
              </div>
              <div className={`font-mono-meta text-xs ${headingText}`}>
                Emiway Bantai · Divine · Naezy · Raftaar · Seedhe Maut · MC Stan
              </div>
            </div>
          </article>

          {/* FIELD NOTE 02: Why Kendrick is my favourite artist */}
          <article
            className={`lg:col-span-7 rounded-2xl p-5 sm:p-8 border space-y-4 ${surfaceBg} ${hairlineBorder}`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${hairlineBorder}`}>
              <span className={`font-mono-meta text-xs uppercase tracking-widest ${accentColor}`}>
                FIELD NOTE 02
              </span>
              <span className={`font-mono-meta text-[10px] uppercase tracking-wider ${mutedText}`}>
                Storyteller &amp; Sound
              </span>
            </div>

            <h2 className={`font-serif-editorial editorial-section-heading ${headingText}`}>
              Why Kendrick is my favourite artist.
            </h2>

            <div className={`space-y-4 font-sans-body editorial-body ${bodyText}`}>
              <p className={`font-serif-editorial editorial-lead ${headingText}`}>
                It&apos;s not just the writing. It&apos;s what he does with an album.
              </p>
              <p>
                Kendrick can build a story around a young man growing up in Compton, turn an album
                into an argument with himself, or make a song feel like a conversation you&apos;re
                not supposed to be overhearing.
              </p>
              <p>
                He lets the contradictions stay. The good intentions and the bad decisions. The
                confidence and the insecurity. The person he wants to be and the person he actually
                is.
              </p>
              <p>
                That&apos;s what keeps me listening. I don&apos;t always agree with his conclusions,
                and I don&apos;t think every verse needs to be treated like a puzzle with a secret
                answer. But his music rewards attention.
              </p>
              <p>
                <em className="italic">good kid, m.A.A.d city</em> got me invested in the
                storytelling. <em className="italic">To Pimp a Butterfly</em> showed me how ambitious
                a rap album could be. <em className="italic">DAMN.</em> made me return to individual
                songs, and <em className="italic">Mr. Morale &amp; the Big Steppers</em> gave me a
                much messier, more uncomfortable kind of listening experience.
              </p>
              <p className={`font-medium ${headingText}`}>
                I like artists who leave something to think about after the song ends. Kendrick does
                that better than anyone else in my rotation.
              </p>
              <p>
                Kanye comes close for a different reason. His production can make a song feel bigger
                than the room you&apos;re listening in. The samples, the arrangements, the sheer
                nerve of some of those records — I keep coming back to them.
              </p>
              <p className={`font-medium ${headingText}`}>
                One is my favourite storyteller. The other has made some of my favourite sounds.
              </p>
              <p className={`font-literary italic ${accentColor}`}>
                That&apos;s probably the simplest way I can put it.
              </p>
            </div>
          </article>
        </section>

        {/* =====================================================================
            5. THE ROTATION, IN FOUR LINES
            ===================================================================== */}
        <section
          aria-labelledby="rotation-four-lines-heading"
          className={`pt-10 border-t space-y-6 ${hairlineBorder}`}
        >
          <div className="space-y-1">
            <div className={`font-mono-meta text-xs uppercase tracking-widest ${accentColor}`}>
              04 · THE ROTATION, IN FOUR LINES
            </div>
            <h2
              id="rotation-four-lines-heading"
              className={`font-serif-editorial editorial-section-heading ${headingText}`}
            >
              Four corners of what I listen to.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: '01 — Rap & hip-hop',
                desc: 'For the writing, the production, the personalities, the storytelling, and the occasional bar that sends me down another rabbit hole.',
              },
              {
                num: '02 — Old Hindi melodies',
                desc: "For the voices, the lyrics, and songs that somehow feel familiar even when I haven't heard them in years.",
              },
              {
                num: '03 — Marathi music',
                desc: 'For the language, the compositions, the theatre, and the different ways a song can feel like home.',
              },
              {
                num: '04 — Rock, pop & old-school classics',
                desc: 'For the melodies, the guitars, the big choruses, and songs like Be My Baby that need no introduction.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className={`p-5 rounded-xl border space-y-2 ${surfaceBg} ${hairlineBorder}`}
              >
                <h3 className={`font-serif-editorial text-lg ${headingText}`}>{item.num}</h3>
                <p className={`font-sans-body editorial-body-sm ${bodyText}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            6. THE CRATE IS NEVER REALLY CLOSED.
            ===================================================================== */}
        <section
          aria-labelledby="crate-never-closed-heading"
          className={`pt-10 border-t ${hairlineBorder}`}
        >
          <div
            className={`rounded-2xl p-6 sm:p-8 border grid grid-cols-1 lg:grid-cols-12 gap-6 items-center ${surfaceBg} ${hairlineBorder}`}
          >
            <div className="lg:col-span-8 space-y-3.5">
              <div className={`font-mono-meta text-xs uppercase tracking-widest ${accentColor}`}>
                THE CRATE IS NEVER REALLY CLOSED.
              </div>

              <h2
                id="crate-never-closed-heading"
                className={`font-serif-editorial editorial-section-heading ${headingText}`}
              >
                Either way, there&apos;s always something playing.
              </h2>

              <div className={`space-y-3 font-sans-body editorial-body ${bodyText}`}>
                <p>
                  I&apos;m always looking for something new, but I have no real ambition to keep up
                  with every release or pretend my listening habits are more organised than they
                  are.
                </p>
                <p>
                  Sometimes I find an album and listen to it obsessively for a week. Sometimes I
                  return to the same old song for the hundredth time. Sometimes the algorithm gets
                  it right. Sometimes it has absolutely no idea what I&apos;m doing.
                </p>
                <p className={`font-literary italic pt-1 ${mutedText}`}>
                  Currently accepting recommendations. Especially Marathi songs, overlooked rap
                  albums, and records you think deserve a proper listen.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3">
              <div className={`font-serif-editorial text-lg ${headingText}`}>
                Find me on Spotify.
              </div>
              <a
                href={SPOTIFY_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono-meta transition-opacity hover:opacity-90 ${activeTheme.accentBg} text-white font-semibold`}
              >
                <Disc className="w-3.5 h-3.5" />
                <span>Open my Spotify profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
