import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';

export type CrateGroupId =
  | 'kanye-kendrick'
  | 'bars-beats'
  | 'late-night'
  | 'modern-rotation'
  | 'desi-hiphop';

export type ListeningRoomFinish = 'atelier-linen' | 'kissa-walnut';

export interface FavoriteAlbumItem {
  id: string;
  title: string;
  artist: string;
  year: string;
  group: CrateGroupId;
  crateTitle: string;
  searchQuery: string;
  spotifySearchUrl: string;
  standoutTrack: string;
  palette: {
    bg: string;
    bgSecondary: string;
    accent: string;
    text: string;
    badgeText?: string;
  };
}

export const CRATE_CATEGORIES: {
  id: CrateGroupId;
  num: string;
  title: string;
  shortLabel: string;
}[] = [
  {
    id: 'kanye-kendrick',
    num: '01',
    title: 'THE KANYE & KENDRICK CRATE',
    shortLabel: 'Kanye & Kendrick',
  },
  {
    id: 'bars-beats',
    num: '02',
    title: 'THE BARS & THE BEATS CRATE',
    shortLabel: 'Bars & Beats',
  },
  {
    id: 'late-night',
    num: '03',
    title: 'THE LATE-NIGHT CRATE',
    shortLabel: 'Late-Night',
  },
  {
    id: 'modern-rotation',
    num: '04',
    title: 'THE MODERN ROTATION',
    shortLabel: 'Modern Rotation',
  },
  {
    id: 'desi-hiphop',
    num: '05',
    title: 'THE DESI HIP-HOP CRATE',
    shortLabel: 'Desi Hip-Hop',
  },
];

export const FAVORITE_ALBUMS: FavoriteAlbumItem[] = [
  // 01 / THE KANYE & KENDRICK CRATE
  {
    id: 'ye-graduation',
    title: 'Graduation',
    artist: 'Kanye West',
    year: '2007',
    group: 'kanye-kendrick',
    crateTitle: 'THE KANYE & KENDRICK CRATE',
    searchQuery: 'Kanye West Graduation',
    spotifySearchUrl: 'https://open.spotify.com/search/Kanye%20West%20Graduation',
    standoutTrack: 'Flashing Lights · I Wonder · Can’t Tell Me Nothing',
    palette: {
      bg: '#3B1D5E',
      bgSecondary: '#9D3B72',
      accent: '#EAB308',
      text: '#FAF5FF',
      badgeText: 'GRADUATION',
    },
  },
  {
    id: 'ye-college-dropout',
    title: 'The College Dropout',
    artist: 'Kanye West',
    year: '2004',
    group: 'kanye-kendrick',
    crateTitle: 'THE KANYE & KENDRICK CRATE',
    searchQuery: 'Kanye West The College Dropout',
    spotifySearchUrl: 'https://open.spotify.com/search/Kanye%20West%20The%20College%20Dropout',
    standoutTrack: 'Through the Wire · All Falls Down · Jesus Walks',
    palette: {
      bg: '#4A2816',
      bgSecondary: '#2C180E',
      accent: '#D97706',
      text: '#FDF6E2',
      badgeText: 'COLLEGE DROPOUT',
    },
  },
  {
    id: 'ye-mbdtf',
    title: 'My Beautiful Dark Twisted Fantasy',
    artist: 'Kanye West',
    year: '2010',
    group: 'kanye-kendrick',
    crateTitle: 'THE KANYE & KENDRICK CRATE',
    searchQuery: 'Kanye West My Beautiful Dark Twisted Fantasy',
    spotifySearchUrl:
      'https://open.spotify.com/search/Kanye%20West%20My%20Beautiful%20Dark%20Twisted%20Fantasy',
    standoutTrack: 'Runaway · Devil in a New Dress · POWER',
    palette: {
      bg: '#8F1D1D',
      bgSecondary: '#541111',
      accent: '#EAB308',
      text: '#FFFBEB',
      badgeText: 'MBDTF',
    },
  },
  {
    id: 'kdot-gkmc',
    title: 'good kid, m.A.A.d city',
    artist: 'Kendrick Lamar',
    year: '2012',
    group: 'kanye-kendrick',
    crateTitle: 'THE KANYE & KENDRICK CRATE',
    searchQuery: 'Kendrick Lamar good kid m.A.A.d city',
    spotifySearchUrl: 'https://open.spotify.com/search/Kendrick%20Lamar%20good%20kid%20maad%20city',
    standoutTrack: 'Sing About Me, I’m Dying of Thirst · Money Trees · Bitch, Don’t Kill My Vibe',
    palette: {
      bg: '#1E2631',
      bgSecondary: '#11161D',
      accent: '#CBD5E1',
      text: '#F8FAFC',
      badgeText: 'g.k.m.c',
    },
  },
  {
    id: 'kdot-damn',
    title: 'DAMN.',
    artist: 'Kendrick Lamar',
    year: '2017',
    group: 'kanye-kendrick',
    crateTitle: 'THE KANYE & KENDRICK CRATE',
    searchQuery: 'Kendrick Lamar DAMN.',
    spotifySearchUrl: 'https://open.spotify.com/search/Kendrick%20Lamar%20DAMN',
    standoutTrack: 'PRIDE. · FEAR. · DUCKWORTH. · DNA.',
    palette: {
      bg: '#6E1818',
      bgSecondary: '#18181B',
      accent: '#DC2626',
      text: '#FFFFFF',
      badgeText: 'DAMN.',
    },
  },
  {
    id: 'kdot-mr-morale',
    title: 'Mr. Morale & the Big Steppers',
    artist: 'Kendrick Lamar',
    year: '2022',
    group: 'kanye-kendrick',
    crateTitle: 'THE KANYE & KENDRICK CRATE',
    searchQuery: 'Kendrick Lamar Mr Morale and the Big Steppers',
    spotifySearchUrl:
      'https://open.spotify.com/search/Kendrick%20Lamar%20Mr%20Morale%20and%20the%20Big%20Steppers',
    standoutTrack: 'The Heart Part 5 · Count Me Out · Father Time',
    palette: {
      bg: '#4E3B2A',
      bgSecondary: '#261D15',
      accent: '#D6B88A',
      text: '#FAF5EE',
      badgeText: 'MR. MORALE',
    },
  },

  // 02 / THE BARS & THE BEATS CRATE
  {
    id: 'cole-2014-fhd',
    title: '2014 Forest Hills Drive',
    artist: 'J. Cole',
    year: '2014',
    group: 'bars-beats',
    crateTitle: 'THE BARS & THE BEATS CRATE',
    searchQuery: 'J. Cole 2014 Forest Hills Drive',
    spotifySearchUrl: 'https://open.spotify.com/search/J%20Cole%202014%20Forest%20Hills%20Drive',
    standoutTrack: 'No Role Modelz · Love Yourz · 03’ Adolescence',
    palette: {
      bg: '#1E3246',
      bgSecondary: '#0F1722',
      accent: '#93C5FD',
      text: '#F8FAFC',
      badgeText: '2014 FHD',
    },
  },
  {
    id: 'cole-kod',
    title: 'KOD',
    artist: 'J. Cole',
    year: '2018',
    group: 'bars-beats',
    crateTitle: 'THE BARS & THE BEATS CRATE',
    searchQuery: 'J. Cole KOD',
    spotifySearchUrl: 'https://open.spotify.com/search/J%20Cole%20KOD',
    standoutTrack: 'Kevin’s Heart · KOD · 1985',
    palette: {
      bg: '#591A28',
      bgSecondary: '#221029',
      accent: '#F472B6',
      text: '#FFF1F2',
      badgeText: 'KOD',
    },
  },
  {
    id: 'metro-not-all-heroes',
    title: 'Not All Heroes Wear Capes',
    artist: 'Metro Boomin',
    year: '2018',
    group: 'bars-beats',
    crateTitle: 'THE BARS & THE BEATS CRATE',
    searchQuery: 'Metro Boomin Not All Heroes Wear Capes',
    spotifySearchUrl:
      'https://open.spotify.com/search/Metro%20Boomin%20Not%20All%20Heroes%20Wear%20Capes',
    standoutTrack: 'Space Cadet · Overdue · Don’t Come Out the House',
    palette: {
      bg: '#161920',
      bgSecondary: '#282E3A',
      accent: '#EA580C',
      text: '#F9FAFB',
      badgeText: 'METRO BOOMIN',
    },
  },
  {
    id: 'metro-spider-verse',
    title: 'Across the Spider-Verse soundtrack',
    artist: 'Metro Boomin',
    year: '2023',
    group: 'bars-beats',
    crateTitle: 'THE BARS & THE BEATS CRATE',
    searchQuery: 'Metro Boomin Across the Spider-Verse',
    spotifySearchUrl:
      'https://open.spotify.com/search/Metro%20Boomin%20Across%20the%20Spider-Verse',
    standoutTrack: 'Am I Dreaming · Annihilate · Calling',
    palette: {
      bg: '#11131A',
      bgSecondary: '#5C1616',
      accent: '#EF4444',
      text: '#FFFFFF',
      badgeText: 'SPIDER-VERSE',
    },
  },
  {
    id: 'drake-21-her-loss',
    title: 'Her Loss',
    artist: 'Drake & 21 Savage',
    year: '2022',
    group: 'bars-beats',
    crateTitle: 'THE BARS & THE BEATS CRATE',
    searchQuery: 'Drake 21 Savage Her Loss',
    spotifySearchUrl: 'https://open.spotify.com/search/Her%20Loss%20Drake%2021%20Savage',
    standoutTrack: 'Rich Flex · Spin Bout U · More M’s',
    palette: {
      bg: '#331A28',
      bgSecondary: '#161416',
      accent: '#DB2777',
      text: '#FDF2F8',
      badgeText: 'HER LOSS',
    },
  },
  {
    id: 'drake-more-life',
    title: 'More Life',
    artist: 'Drake',
    year: '2017',
    group: 'bars-beats',
    crateTitle: 'THE BARS & THE BEATS CRATE',
    searchQuery: 'Drake More Life',
    spotifySearchUrl: 'https://open.spotify.com/search/Drake%20More%20Life',
    standoutTrack: 'Passionfruit · Portland · Do Not Disturb',
    palette: {
      bg: '#23201E',
      bgSecondary: '#141210',
      accent: '#D97706',
      text: '#FAFAFA',
      badgeText: 'MORE LIFE',
    },
  },

  // 03 / THE LATE-NIGHT CRATE
  {
    id: 'frank-blonde',
    title: 'Blonde',
    artist: 'Frank Ocean',
    year: '2016',
    group: 'late-night',
    crateTitle: 'THE LATE-NIGHT CRATE',
    searchQuery: 'Frank Ocean Blonde',
    spotifySearchUrl: 'https://open.spotify.com/search/Frank%20Ocean%20Blonde',
    standoutTrack: 'Nights · Pink + White · Self Control · White Ferrari',
    palette: {
      bg: '#EAE7DF',
      bgSecondary: '#D8D4C8',
      accent: '#2E6F40',
      text: '#18181B',
      badgeText: 'blond',
    },
  },
  {
    id: 'frank-channel-orange',
    title: 'channel ORANGE',
    artist: 'Frank Ocean',
    year: '2012',
    group: 'late-night',
    crateTitle: 'THE LATE-NIGHT CRATE',
    searchQuery: 'Frank Ocean channel ORANGE',
    spotifySearchUrl: 'https://open.spotify.com/search/Frank%20Ocean%20channel%20ORANGE',
    standoutTrack: 'Thinkin Bout You · Pyramids · Pink Matter',
    palette: {
      bg: '#D9531E',
      bgSecondary: '#A83B10',
      accent: '#FFFFFF',
      text: '#FFFFFF',
      badgeText: 'channel ORANGE',
    },
  },
  {
    id: 'mac-kids',
    title: 'K.I.D.S.',
    artist: 'Mac Miller',
    year: '2010',
    group: 'late-night',
    crateTitle: 'THE LATE-NIGHT CRATE',
    searchQuery: 'Mac Miller KIDS',
    spotifySearchUrl: 'https://open.spotify.com/search/Mac%20Miller%20KIDS',
    standoutTrack: 'The Spins · Kool Aid & Frozen Pizza · Nikes on My Feet',
    palette: {
      bg: '#243B6B',
      bgSecondary: '#7A2020',
      accent: '#EAB308',
      text: '#FFFFFF',
      badgeText: 'K.I.D.S.',
    },
  },
  {
    id: 'mac-swimming',
    title: 'Swimming',
    artist: 'Mac Miller',
    year: '2018',
    group: 'late-night',
    crateTitle: 'THE LATE-NIGHT CRATE',
    searchQuery: 'Mac Miller Swimming',
    spotifySearchUrl: 'https://open.spotify.com/search/Mac%20Miller%20Swimming',
    standoutTrack: 'Self Care · Ladders · 2009 · Small Worlds',
    palette: {
      bg: '#D5D0C8',
      bgSecondary: '#94A3B8',
      accent: '#1E293B',
      text: '#1C1917',
      badgeText: 'SWIMMING',
    },
  },

  // 04 / THE MODERN ROTATION
  {
    id: 'don-love-sick',
    title: 'Love Sick',
    artist: 'Don Toliver',
    year: '2023',
    group: 'modern-rotation',
    crateTitle: 'THE MODERN ROTATION',
    searchQuery: 'Don Toliver Love Sick',
    spotifySearchUrl: 'https://open.spotify.com/search/Don%20Toliver%20Love%20Sick',
    standoutTrack: 'Private Landing · No Pole · Embarrassed',
    palette: {
      bg: '#381D15',
      bgSecondary: '#632612',
      accent: '#F59E0B',
      text: '#FEF3C7',
      badgeText: 'LOVE SICK',
    },
  },
  {
    id: 'gunna-one-of-wun',
    title: 'One of Wun',
    artist: 'Gunna',
    year: '2024',
    group: 'modern-rotation',
    crateTitle: 'THE MODERN ROTATION',
    searchQuery: 'Gunna One of Wun',
    spotifySearchUrl: 'https://open.spotify.com/search/Gunna%20One%20of%20Wun',
    standoutTrack: 'one of wun · hakuna matata · on one tonight',
    palette: {
      bg: '#2A1D24',
      bgSecondary: '#422835',
      accent: '#D8B4FE',
      text: '#FDF4FF',
      badgeText: 'ONE OF WUN',
    },
  },
  {
    id: 'asap-long-live',
    title: 'LONG.LIVE.A$AP',
    artist: 'A$AP Rocky',
    year: '2013',
    group: 'modern-rotation',
    crateTitle: 'THE MODERN ROTATION',
    searchQuery: 'ASAP Rocky LONG LIVE ASAP',
    spotifySearchUrl: 'https://open.spotify.com/search/ASAP%20Rocky%20LONG%20LIVE%20ASAP',
    standoutTrack: 'LVL · Fashion Killa · Goldie · 1Train',
    palette: {
      bg: '#18181B',
      bgSecondary: '#2E2E34',
      accent: '#E4E4E7',
      text: '#FFFFFF',
      badgeText: 'LONG.LIVE.A$AP',
    },
  },
  {
    id: 'jayz-blueprint',
    title: 'The Blueprint',
    artist: 'Jay-Z',
    year: '2001',
    group: 'modern-rotation',
    crateTitle: 'THE MODERN ROTATION',
    searchQuery: 'Jay-Z The Blueprint',
    spotifySearchUrl: 'https://open.spotify.com/search/Jay-Z%20The%20Blueprint',
    standoutTrack: 'Heart of the City · Takeover · Song Cry · Izzo',
    palette: {
      bg: '#1A3478',
      bgSecondary: '#112252',
      accent: '#93C5FD',
      text: '#EFF6FF',
      badgeText: 'THE BLUEPRINT',
    },
  },
  {
    id: 'rihanna-loud',
    title: 'Loud',
    artist: 'Rihanna',
    year: '2010',
    group: 'modern-rotation',
    crateTitle: 'THE MODERN ROTATION',
    searchQuery: 'Rihanna Loud',
    spotifySearchUrl: 'https://open.spotify.com/search/Rihanna%20Loud',
    standoutTrack: 'Only Girl (In the World) · What’s My Name? · Love the Way You Lie (Pt. II)',
    palette: {
      bg: '#9E1B34',
      bgSecondary: '#661022',
      accent: '#FDA4AF',
      text: '#FFF1F2',
      badgeText: 'LOUD',
    },
  },
  {
    id: 'katy-teenage-dream',
    title: 'Teenage Dream',
    artist: 'Katy Perry',
    year: '2010',
    group: 'modern-rotation',
    crateTitle: 'THE MODERN ROTATION',
    searchQuery: 'Katy Perry Teenage Dream',
    spotifySearchUrl: 'https://open.spotify.com/search/Katy%20Perry%20Teenage%20Dream',
    standoutTrack: 'Teenage Dream · Last Friday Night · Firework',
    palette: {
      bg: '#C84B7C',
      bgSecondary: '#4B729F',
      accent: '#FEF08A',
      text: '#FFFFFF',
      badgeText: 'TEENAGE DREAM',
    },
  },

  // 05 / THE DESI HIP-HOP CRATE
  {
    id: 'emiway-kots',
    title: 'King of the Streets',
    artist: 'Emiway Bantai',
    year: '2023',
    group: 'desi-hiphop',
    crateTitle: 'THE DESI HIP-HOP CRATE',
    searchQuery: 'Emiway Bantai King of the Streets',
    spotifySearchUrl: 'https://open.spotify.com/search/Emiway%20Bantai%20King%20of%20the%20Streets',
    standoutTrack: 'King of the Streets · Company · Koihh',
    palette: {
      bg: '#1C1917',
      bgSecondary: '#5C2D12',
      accent: '#D97706',
      text: '#FEF3C7',
      badgeText: 'K.O.T.S',
    },
  },
  {
    id: 'seedhe-maut-lunch-break',
    title: 'Lunch Break',
    artist: 'Seedhe Maut',
    year: '2023',
    group: 'desi-hiphop',
    crateTitle: 'THE DESI HIP-HOP CRATE',
    searchQuery: 'Seedhe Maut Lunch Break',
    spotifySearchUrl: 'https://open.spotify.com/search/Seedhe%20Maut%20Lunch%20Break',
    standoutTrack: 'Khatta Flow · Luka Chuppi · Champions',
    palette: {
      bg: '#7F1D1D',
      bgSecondary: '#3B0D0D',
      accent: '#FDE68A',
      text: '#FEF2F2',
      badgeText: 'LUNCH BREAK',
    },
  },
  {
    id: 'mc-stan-tadipaar',
    title: 'Tadipaar',
    artist: 'MC Stan',
    year: '2020',
    group: 'desi-hiphop',
    crateTitle: 'THE DESI HIP-HOP CRATE',
    searchQuery: 'MC Stan Tadipaar',
    spotifySearchUrl: 'https://open.spotify.com/search/MC%20Stan%20Tadipaar',
    standoutTrack: 'Tadipaar · Astagfirullah · Amin · Ek Din Pyaar',
    palette: {
      bg: '#12131A',
      bgSecondary: '#2B142C',
      accent: '#C084FC',
      text: '#F3E8FF',
      badgeText: 'TADIPAAR',
    },
  },
];

export const ALBUM_CACHE_KEY = 'vd_album_covers_cache_v5';

/**
 * Minimalist archival Blue Note / ECM inspired vinyl jacket fallback
 * rendered underneath official artwork so no broken image can ever appear.
 */
export const MinimalArchivalSleeve: React.FC<{ album: FavoriteAlbumItem }> = ({ album }) => {
  const { bg, bgSecondary, accent, text, badgeText } = album.palette;

  return (
    <div
      style={{
        background: `linear-gradient(145deg, ${bg} 0%, ${bgSecondary} 100%)`,
        color: text,
      }}
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-3 select-none"
    >
      {/* Subtle physical jacket spine line on the left edge */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-2 w-[1px] bg-white/15 pointer-events-none"
      />
      {/* Subtle vinyl impression ring */}
      <div
        aria-hidden="true"
        className="absolute inset-3 rounded-full border border-current/10 pointer-events-none"
      />

      <div className="relative z-10 flex items-center justify-between text-[8.5px] font-mono-meta uppercase tracking-widest opacity-75 pl-1.5">
        <span>{album.year}</span>
        <span style={{ color: accent }}>33⅓</span>
      </div>

      <div className="relative z-10 my-auto pl-1.5 pr-1">
        <div
          className="font-serif-editorial text-xs sm:text-sm leading-tight line-clamp-2"
          style={{ color: text }}
        >
          {badgeText || album.title}
        </div>
      </div>

      <div className="relative z-10 text-[8px] font-mono-meta uppercase tracking-widest opacity-80 truncate pl-1.5">
        {album.artist}
      </div>
    </div>
  );
};

import { MusicThemeConfig } from './MusicThemeStudio';

interface AlbumCrateSectionProps {
  theme: MusicThemeConfig;
  coverUrls: Record<string, string>;
  failedIds: Record<string, boolean>;
  onMarkFailed: (id: string) => void;
}

export const AlbumCrateSection: React.FC<AlbumCrateSectionProps> = ({
  theme,
  coverUrls,
  failedIds,
  onMarkFailed,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | CrateGroupId>('all');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const accentColor = theme.accentText;
  const mutedText = theme.mutedText;
  const bodyText = theme.bodyText;
  const headingText = theme.headingText;
  const hairlineBorder = theme.borderHairline;

  const selectedAlbum = useMemo(
    () => FAVORITE_ALBUMS.find((a) => a.id === selectedAlbumId) || null,
    [selectedAlbumId]
  );

  const visibleCrates = useMemo(() => {
    if (activeFilter === 'all') return CRATE_CATEGORIES;
    return CRATE_CATEGORIES.filter((c) => c.id === activeFilter);
  }, [activeFilter]);

  return (
    <section
      aria-labelledby="the-record-wall-heading"
      className={`pt-10 border-t space-y-8 ${hairlineBorder}`}
    >
      {/* Header & Editorial Copy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-7 space-y-3">
          <div className={`font-mono-meta text-[11px] uppercase tracking-widest ${accentColor}`}>
            02 · THE RECORD WALL
          </div>
          <h2
            id="the-record-wall-heading"
            className={`font-serif-editorial editorial-section-heading ${headingText}`}
          >
            Albums I keep coming back to.
          </h2>
          <div className={`space-y-2.5 font-sans-body editorial-body ${bodyText}`}>
            <p className={`font-serif-editorial editorial-lead ${headingText}`}>
              Some albums are good for a week. Some become part of your life.
            </p>
            <p>
              This is my current collection of 25 records across hip-hop, rap, pop, and Desi
              hip-hop. Not a definitive ranking, not a claim that these are the greatest albums ever
              made. They&apos;re simply the records that have earned a place here.
            </p>
          </div>
        </div>

        {/* Minimalist Segmented Crate Selector */}
        <div className="lg:col-span-5 flex flex-col lg:items-end gap-2">
          <span className={`font-literary italic text-sm ${mutedText}`}>
            Tap a sleeve to explore its tracks.
          </span>

          <div
            role="group"
            aria-label="Filter crates"
            className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-lg border ${theme.elevatedBg} ${hairlineBorder}`}
          >
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono-meta transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? `${theme.accentBg} text-white font-semibold`
                  : `${mutedText} hover:${headingText}`
              }`}
            >
              All (25)
            </button>
            {CRATE_CATEGORIES.map((crate) => {
              const isActive = activeFilter === crate.id;
              return (
                <button
                  key={crate.id}
                  type="button"
                  onClick={() => setActiveFilter(crate.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono-meta transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? `${theme.accentBg} text-white font-semibold`
                      : `${mutedText} hover:${headingText}`
                  }`}
                >
                  {crate.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Minimalist Sleeve Inspection Bar (When a Record is Selected) */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            key={selectedAlbum.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme.surfaceBg} ${theme.borderStrong} ${headingText}`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-current/15">
                <MinimalArchivalSleeve album={selectedAlbum} />
                {coverUrls[selectedAlbum.id] && !failedIds[selectedAlbum.id] && (
                  <img
                    src={coverUrls[selectedAlbum.id]}
                    alt={`${selectedAlbum.title} — ${selectedAlbum.artist}`}
                    onError={() => onMarkFailed(selectedAlbum.id)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 space-y-1">
                <div className={`font-mono-meta text-[10px] uppercase tracking-widest ${accentColor}`}>
                  {selectedAlbum.crateTitle} · {selectedAlbum.year}
                </div>
                <h3 className="font-serif-editorial text-xl sm:text-2xl leading-tight">
                  {selectedAlbum.title}{' '}
                  <span className={`font-sans-body text-sm font-normal ${mutedText}`}>
                    — {selectedAlbum.artist}
                  </span>
                </h3>
                <p className={`font-sans-body text-xs sm:text-sm ${bodyText}`}>
                  Essential tracks: {selectedAlbum.standoutTrack}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={selectedAlbum.spotifySearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3.5 py-2 rounded-lg font-mono-meta text-xs inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 ${theme.accentBg} text-white font-medium`}
              >
                <span>Open Record</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setSelectedAlbumId(null)}
                aria-label="Close track inspector"
                className={`p-2 rounded-lg border ${hairlineBorder} opacity-70 hover:opacity-100 cursor-pointer`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          THE 5 CRATES — COMPACT GALLERY RECORD SLEEVE GRID
          ===================================================================== */}
      <div className="space-y-8">
        {visibleCrates.map((crate) => {
          const crateAlbums = FAVORITE_ALBUMS.filter((a) => a.group === crate.id);
          return (
            <div key={crate.id} className="space-y-3.5">
              {/* Quiet Architectural Crate Header */}
              <div className={`flex items-baseline justify-between border-b pb-2 ${hairlineBorder}`}>
                <h3 className={`font-mono-meta text-xs uppercase tracking-widest font-medium ${headingText}`}>
                  <span className={`${accentColor} mr-2`}>{crate.num}.</span>
                  {crate.title}
                </h3>
                <span className={`font-mono-meta text-[11px] ${mutedText}`}>
                  {crateAlbums.length} LP{crateAlbums.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Compact Sleeve Grid: 2 cols on mobile, 4 on tablet, 6 on desktop so covers are crisp and compact */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
                {crateAlbums.map((album) => {
                  const isSelected = selectedAlbumId === album.id;
                  const hasImage = Boolean(coverUrls[album.id] && !failedIds[album.id]);

                  return (
                    <button
                      key={album.id}
                      type="button"
                      onClick={() =>
                        setSelectedAlbumId((prev) => (prev === album.id ? null : album.id))
                      }
                      className="group text-left transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer flex flex-col gap-2 focus:outline-none"
                    >
                      {/* Physical Record Jacket with Subtle Peeking Vinyl Edge on Hover */}
                      <div className="relative w-full aspect-square">
                        <div
                          aria-hidden="true"
                          className="absolute inset-y-2 right-0 w-6 rounded-full bg-[#141312] border border-white/15 translate-x-0 group-hover:translate-x-1.5 transition-transform duration-200 pointer-events-none"
                        />

                        {/* Square Album Cover Jacket */}
                        <div
                          className={`relative w-full h-full rounded-lg overflow-hidden border transition-all ${
                            isSelected
                              ? `${theme.borderStrong} ring-2 ring-current`
                              : `${hairlineBorder} shadow-[0_6px_16px_rgba(0,0,0,0.2)]`
                          }`}
                        >
                          <MinimalArchivalSleeve album={album} />

                          {hasImage && (
                            <img
                              src={coverUrls[album.id]}
                              alt={`${album.title} — ${album.artist}`}
                              loading="lazy"
                              onError={() => onMarkFailed(album.id)}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                          )}

                          <div
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/25 to-transparent pointer-events-none"
                          />
                        </div>
                      </div>

                      {/* Clean Unboxed Typography Underneath: Title + Artist */}
                      <div className="min-w-0 space-y-0.5 pt-0.5">
                        <div
                          title={album.title}
                          className={`font-serif-editorial text-sm sm:text-[15px] leading-snug truncate transition-colors ${
                            isSelected ? accentColor : headingText
                          }`}
                        >
                          {album.title}
                        </div>
                        <div
                          title={`${album.artist} · ${album.year}`}
                          className={`font-mono-meta text-[10.5px] truncate ${mutedText}`}
                        >
                          {album.artist} · {album.year}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Closing Reflection */}
      <p className={`font-literary italic editorial-body max-w-3xl pt-2 ${mutedText}`}>
        The collection will change. Something new will find its way in, something old will come back
        around, and I&apos;ll probably spend another evening arguing with myself about which
        Kendrick album I like most.
      </p>
    </section>
  );
};
