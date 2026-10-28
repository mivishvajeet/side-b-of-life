/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clapperboard,
  BookOpen,
  Sparkles,
  Compass,
  User,
  Layers,
  Film,
  Trophy,
  Camera,
  Cpu,
  Feather,
  Mail,
  ArrowUpRight,
  SlidersHorizontal,
  Menu,
  X,
} from 'lucide-react';
import { ArchiveData, NavigationTab } from './types/archive';
import { INITIAL_ARCHIVE_DATA } from './data/initialArchive';
import { updateDocumentMeta } from './utils/readingTime';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { InterestsHubSection } from './components/InterestsHubSection';
import { CinemaSection } from './components/CinemaSection';
import { FootballSection } from './components/FootballSection';
import { Disc3 } from 'lucide-react';
import { BooksSection } from './components/BooksSection';
import { MusicSection } from './components/MusicSection';
import { PhotographySection } from './components/PhotographySection';
import { TechnologySection } from './components/TechnologySection';
import { BlogSection } from './components/BlogSection';
import { QuizSection } from './components/QuizSection';
import { ContactSection } from './components/ContactSection';
import {
  GlobalStoicThemeBanner,
  StoicAtmosphereMode,
} from './components/StoicThemeElements';

type StudioTheme = 'kyoto' | 'stoic' | 'fjord' | 'stone' | 'budapest' | 'noir';

const VALID_TABS: NavigationTab[] = [
  'home',
  'about',
  'interests',
  'cinema',
  'football',
  'books',
  'music',
  'photography',
  'technology',
  'writing',
  'quiz',
  'contact',
];

function parseUrlState(): { tab: NavigationTab; postSlug: string | null } {
  const params = new URLSearchParams(window.location.search);
  const rawSection = params.get('section') as NavigationTab | null;
  const postSlug = params.get('post');
  if (postSlug) {
    return { tab: 'writing', postSlug };
  }
  if (rawSection && VALID_TABS.includes(rawSection)) {
    return { tab: rawSection, postSlug: null };
  }
  return { tab: 'home', postSlug: null };
}

const ROTATING_WATCHING_MOVIES: string[] = [
  'Zodiac (2007)',
  'The Shawshank Redemption (1994)',
  'Se7en (1995)',
  'Memories of Murder (2003)',
  'The Lord of the Rings (2001)',
  'There Will Be Blood (2007)',
  'Ashi Hi Banwa Banwi (1988)',
  'Killa (2014)',
  'Kumbalangi Nights (2019)',
  'Court (2014)',
  'The Silence of the Lambs (1991)',
  'Sarpatta Parambarai (2021)',
  'Meiyazhagan (2024)',
  'Manchester by the Sea (2016)',
  'The Prestige (2006)',
  'Incendies (2010)',
  'The Usual Suspects (1995)',
  'Shutter Island (2010)',
  'Whiplash (2014)',
  'Andhadhun (2018)',
  'Oldboy (2003)',
  'Kahaani (2012)',
  'Super Deluxe (2019)',
  'Karnan (2021)',
  'Vada Chennai (2018)',
  'Natsamrat (2016)',
  'Katyar Kaljat Ghusali (2015)',
  'Sairat (2016)',
  'Pinjra (1972)',
  'Deool (2011)',
  'Fandry (2013)',
  'Harishchandrachi Factory (2009)',
  'Masaan (2015)',
  'A Death in the Gunj (2016)',
  'In the Mood for Love (2000)',
  'Parasite (2019)',
  'Prisoners (2013)',
  'Ankhon Dekhi (2013)',
];

const ROTATING_DESK_BOOKS: string[] = [
  'Annihilation of Caste — Dr. B. R. Ambedkar',
  'मृत्युंजय (Mrutyunjay) — Shivaji Sawant',
  'कोसला (Kosala) — Bhalchandra Nemade',
  'गुनाहों का देवता — Dharamvir Bharati',
  'दीवार में एक खिड़की रहती थी — Vinod Kumar Shukla',
  'गोदान (Godaan) — Munshi Premchand',
  'मुसाफिर (Musafir) — Achyut Godbole',
  'ययाती (Yayati) — V. S. Khandekar',
  'श्रीमान योगी (Shriman Yogi) — Ranjit Desai',
  'स्वामी (Swami) — Ranjit Desai',
  'राधेय (Radheya) — Ranjit Desai',
  'राऊ (Rau) — N. S. Inamdar',
  'झाडाझडती (Zadazadti) — Vishwas Patil',
  'शिवाजी कोण होता? — Govind Pansare',
  'सूरज का सातवाँ घोड़ा — Dharamvir Bharati',
  'राग दरबारी — Shrilal Shukla',
  'गबन (Gaban) — Munshi Premchand',
  'बनारस टॉकीज — Satya Vyas',
  'एक गधे की आत्मकथा — Krishan Chander',
  'आपण सारे अर्जुन — V. P. Kale',
  'Meditations — Marcus Aurelius',
];

export default function App() {
  const [theme, setTheme] = useState<StudioTheme>(() => {
    try {
      const saved = localStorage.getItem('vd_studio_theme_v3') as StudioTheme | null;
      if (
        saved === 'kyoto' ||
        saved === 'stoic' ||
        saved === 'stone' ||
        saved === 'budapest' ||
        saved === 'fjord' ||
        saved === 'noir'
      ) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'kyoto';
  });

  const [stoicAtmosphere, setStoicAtmosphere] = useState<StoicAtmosphereMode>(() => {
    try {
      const saved = localStorage.getItem('vd_stoic_atmosphere_v1');
      if (saved === 'marble' || saved === 'obsidian') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'obsidian';
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>(() => parseUrlState().tab);
  const [activePostSlug, setActivePostSlug] = useState<string | null>(
    () => parseUrlState().postSlug
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [authorMode, setAuthorMode] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [nowTick, setNowTick] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowTick(Date.now());
    }, 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  const [archive, setArchive] = useState<ArchiveData>(() => {
    try {
      const cached = localStorage.getItem('vd_archive_cache_v17');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Ignore cache error
    }
    return INITIAL_ARCHIVE_DATA;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'noir') {
      root.classList.add('dark');
      root.removeAttribute('data-palette');
    } else if (theme === 'kyoto') {
      root.classList.remove('dark');
      root.setAttribute('data-palette', 'kyoto');
    } else if (theme === 'stoic') {
      root.classList.remove('dark');
      root.setAttribute(
        'data-palette',
        stoicAtmosphere === 'obsidian' ? 'stoic-obsidian' : 'stoic'
      );
    } else if (theme === 'budapest') {
      root.classList.remove('dark');
      root.setAttribute('data-palette', 'budapest');
    } else if (theme === 'fjord') {
      root.classList.remove('dark');
      root.setAttribute('data-palette', 'fjord');
    } else {
      root.classList.remove('dark');
      root.removeAttribute('data-palette');
    }
    try {
      localStorage.setItem('vd_studio_theme_v3', theme);
      localStorage.setItem('vd_stoic_atmosphere_v1', stoicAtmosphere);
    } catch {
      // Ignore
    }
  }, [theme, stoicAtmosphere]);

  // Keyboard shortcut Shift + E to toggle Author Mode quietly
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.shiftKey &&
        e.key.toLowerCase() === 'e' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setAuthorMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Load persisted archive from Express backend on mount
  useEffect(() => {
    fetch('/api/archive')
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (serverData && serverData.blog && serverData.cinema) {
          const hasAllFields =
            Array.isArray(serverData.quiz) &&
            serverData.quiz.length >= 10 &&
            Array.isArray(serverData.quizRoasts) &&
            Array.isArray(serverData.youtubePlaylists) &&
            serverData.youtubePlaylists[0]?.title === 'Rare Finds' &&
            Array.isArray(serverData.spotifyPlaylists) &&
            Array.isArray(serverData.photography?.items) &&
            serverData.photography.items.some((p: { id: string }) => p.id === 'ph-0b') &&
            serverData.blog.posts?.[0]?.title &&
            !String(serverData.blog.posts[0].title).startsWith('[Sample Note]');
          let merged: ArchiveData = hasAllFields ? serverData : INITIAL_ARCHIVE_DATA;
          const requiredMarathiIds = [
            'post-marathi-lokshahi-stambh',
            'post-marathi-sahitya-jaat',
          ];
          const missingMarathiPosts = INITIAL_ARCHIVE_DATA.blog.posts.filter(
            (p) =>
              requiredMarathiIds.includes(p.id) &&
              !merged.blog.posts.some((existing) => existing.id === p.id)
          );
          const cleanedPosts = [
            ...missingMarathiPosts,
            ...merged.blog.posts.filter((p) => p.id !== 'post-desi-hip-hop-shot'),
          ];
          merged = {
            ...merged,
            blog: {
              ...merged.blog,
              posts: cleanedPosts,
            },
          };
          setArchive(merged);
          try {
            localStorage.setItem('vd_archive_cache_v17', JSON.stringify(merged));
          } catch {
            // Ignore
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const next = parseUrlState();
      setActiveTab(next.tab);
      setActivePostSlug(next.postSlug);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (activeTab === 'writing' && activePostSlug) return;
    const metaMap: Record<NavigationTab, { title: string; desc: string; path: string }> = {
      home: {
        title: 'Vishvajeet Dhawale — Curious About a Little Too Much',
        desc: 'Personal journal, film notebook, reading log, and archive of curiosity by Vishvajeet Dhawale.',
        path: '/',
      },
      about: {
        title: 'About — Vishvajeet Dhawale',
        desc: 'An honest introduction to Vishvajeet Dhawale: cinema, FC Barcelona, books, photography, technology, and Stoic questioning.',
        path: '/?section=about',
      },
      interests: {
        title: 'Interests — Vishvajeet Dhawale',
        desc: 'Five areas of curiosity: Cinema, Football, Books, Photography, and Technology.',
        path: '/?section=interests',
      },
      cinema: {
        title: 'Cinema & Frame Studies — Vishvajeet Dhawale',
        desc: 'Personal film journal exploring story-driven thrillers, action, Shah Rukh Khan, David Fincher, Marathi and Malayalam cinema.',
        path: '/?section=cinema',
      },
      football: {
        title: 'Football — More Than a Scoreboard · Vishvajeet Dhawale',
        desc: 'Notes on FC Barcelona, Lionel Messi, positional play, and memorable matches worth revisiting.',
        path: '/?section=football',
      },
      books: {
        title: 'Books & Reading Log — Vishvajeet Dhawale',
        desc: 'Reading journal, books in progress, finished books, and passages from Stoic philosophy and film books.',
        path: '/?section=books',
      },
      music: {
        title: 'Music · Desi Hip-Hop — Aisa Kuch Shot Nahi · Vishvajeet Dhawale',
        desc: 'How one random Emiway Bantai song turned into a Desi and Global Hip-Hop rabbit hole, plus my Spotify sound crates.',
        path: '/?section=music',
      },
      photography: {
        title: 'Photography & Visual Storytelling — Vishvajeet Dhawale',
        desc: 'Photographs, short videos, light studies, and quiet everyday moments that suggest a story.',
        path: '/?section=photography',
      },
      technology: {
        title: 'Technology & Curiosity — Vishvajeet Dhawale',
        desc: 'Technology discoveries, unfamiliar concepts explored, and small experiments.',
        path: '/?section=technology',
      },
      writing: {
        title: 'Question Everything — Writing by Vishvajeet Dhawale',
        desc: 'Essays, working notes, and reflections on cinema, philosophy, football, books, and everyday observations.',
        path: '/?section=writing',
      },
      quiz: {
        title: 'Okay, but how well do you actually know me? — Vishvajeet Dhawale',
        desc: '10 questions. 100 points. One friendship under investigation.',
        path: '/?section=quiz',
      },
      contact: {
        title: 'Contact — Vishvajeet Dhawale',
        desc: 'Have an interesting film, a book worth reading, or a question on your mind? Start a conversation.',
        path: '/?section=contact',
      },
    };
    const info = metaMap[activeTab];
    updateDocumentMeta(info.title, info.desc, info.path);
  }, [activeTab, activePostSlug]);

  const handleUpdateArchive = useCallback((updater: (prev: ArchiveData) => ArchiveData) => {
    setArchive((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('vd_archive_cache_v17', JSON.stringify(next));
      } catch {
        // Ignore
      }
      fetch('/api/archive', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      }).catch(() => {});
      return next;
    });
  }, []);

  const handleNavigate = useCallback((tab: NavigationTab) => {
    setActiveTab(tab);
    setActivePostSlug(null);
    setMobileMenuOpen(false);
    const basePath = window.location.pathname || '/';
    const url = tab === 'home' ? basePath : `${basePath}?section=${tab}`;
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReadBlogPost = useCallback((slug: string) => {
    setActiveTab('writing');
    setActivePostSlug(slug);
    setMobileMenuOpen(false);
    const basePath = window.location.pathname || '/';
    const url = `${basePath}?section=writing&post=${encodeURIComponent(slug)}`;
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectPostSlug = useCallback((slug: string | null) => {
    setActivePostSlug(slug);
    const basePath = window.location.pathname || '/';
    const url = slug
      ? `${basePath}?section=writing&post=${encodeURIComponent(slug)}`
      : `${basePath}?section=writing`;
    window.history.pushState({}, '', url);
  }, []);

  // Rotate Watching movie automatically every 1 hour across 38+ movies
  const latestFilmTitle = useMemo(() => {
    const hourSlot = Math.floor(nowTick / (1000 * 60 * 60));
    return ROTATING_WATCHING_MOVIES[hourSlot % ROTATING_WATCHING_MOVIES.length];
  }, [nowTick]);

  // Rotate On Desk book automatically every 4 days across 21+ books
  const currentBookTitle = useMemo(() => {
    const fourDaySlot = Math.floor(nowTick / (1000 * 60 * 60 * 24 * 4));
    return ROTATING_DESK_BOOKS[fourDaySlot % ROTATING_DESK_BOOKS.length];
  }, [nowTick]);

  const navItems: {
    id: NavigationTab;
    num: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'about', num: '01', label: 'Story', Icon: User },
    { id: 'interests', num: '02', label: 'Curiosities', Icon: Layers },
    { id: 'contact', num: '03', label: 'Contact', Icon: Mail },
  ];

  const curiositySubTabs: {
    id: NavigationTab;
    num: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'interests', num: '00', label: 'All Curiosities', Icon: Layers },
    { id: 'cinema', num: '01', label: 'Cinema', Icon: Film },
    { id: 'football', num: '02', label: 'Football', Icon: Trophy },
    { id: 'books', num: '03', label: 'Books', Icon: BookOpen },
    { id: 'writing', num: '04', label: 'Philosophy & Writing', Icon: Feather },
    { id: 'music', num: '05', label: 'Music', Icon: Disc3 },
  ];

  const isCuriositySection =
    activeTab === 'interests' ||
    activeTab === 'cinema' ||
    activeTab === 'football' ||
    activeTab === 'books' ||
    activeTab === 'writing' ||
    activeTab === 'music';

  const themeOptions: {
    id: StudioTheme;
    label: string;
    mobileLabel: string;
    dot: string;
    badge?: string;
  }[] = [
    { id: 'kyoto', label: 'Kyoto Press', mobileLabel: 'Kyoto', dot: '#C83E2B' },
    { id: 'stoic', label: 'Aurelius · Stoic', mobileLabel: 'Stoic', dot: '#7C2D26', badge: 'STOIC' },
    { id: 'fjord', label: 'Fjord', mobileLabel: 'Fjord', dot: '#1B5698' },
    { id: 'stone', label: 'Stone', mobileLabel: 'Stone', dot: '#B85D3B' },
    { id: 'budapest', label: 'Budapest', mobileLabel: 'Budapest', dot: '#8C2D38' },
    { id: 'noir', label: 'Noir', mobileLabel: 'Noir', dot: '#E59843' },
  ];

  const mobileBottomTabs: {
    id: NavigationTab;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Desk', Icon: Compass },
    { id: 'about', label: 'Story', Icon: User },
    { id: 'interests', label: 'Curiosities', Icon: Layers },
    { id: 'music', label: 'Music', Icon: Disc3 },
    { id: 'contact', label: 'Contact', Icon: Mail },
  ];

  return (
    <div className="min-h-screen text-[var(--text-primary)] selection:bg-[var(--accent-crimson)] selection:text-white p-2 sm:p-4 md:p-6 pb-20 md:pb-6">
      {/* Framed Architectural Studio Sheet */}
      <div className="max-w-[1220px] mx-auto bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-2xl tactile-card-shadow overflow-hidden">
        {/* =================================================================
            DESKTOP TOP TIER 1: COMPACT CURRENT LOG TICKER & 5-THEME SWITCHER
            ================================================================= */}
        <div className="hidden md:flex px-7 py-2.5 bg-[var(--bg-diner-olive)]/55 border-b border-[var(--border-hairline)] items-center justify-between gap-4 text-xs">
          {/* Small Current Log Ticker */}
          <div
            aria-label="Current log"
            className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs"
          >
            <span className="inline-flex items-center gap-1.5 font-mono-meta text-[11px] text-[var(--accent-crimson)] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-crimson)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-crimson)]" />
              </span>
              LOG
            </span>
            <button
              type="button"
              onClick={() => handleNavigate('cinema')}
              title="Rotates automatically every hour from 38+ films"
              className="group inline-flex items-center gap-1.5 hover:text-[var(--accent-crimson)] transition-colors cursor-pointer"
            >
              <motion.span
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center"
              >
                <Clapperboard className="w-3.5 h-3.5 text-[var(--accent-crimson)]" />
              </motion.span>
              <span className="text-[var(--text-muted)]">Watching:</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={latestFilmTitle}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)] transition-colors"
                >
                  {latestFilmTitle}
                </motion.span>
              </AnimatePresence>
            </button>
            <span className="text-[var(--border-strong)]">·</span>
            <button
              type="button"
              onClick={() => handleNavigate('books')}
              title="Rotates automatically every 4 days"
              className="inline-flex items-center gap-1.5 hover:text-[var(--accent-crimson)] transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[var(--accent-olive)]" />
              <span className="text-[var(--text-muted)]">On desk:</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentBookTitle}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="font-medium text-[var(--text-primary)] max-w-[240px] xl:max-w-[320px] truncate"
                >
                  {currentBookTitle}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* 5-Theme Switcher (Including Kyoto Monograph UI/UX Showcase Theme) */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              role="group"
              aria-label="Select color theme"
              className="inline-flex items-center p-0.5 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
            >
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-display flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    theme === t.id
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium shadow-2xs border border-[var(--border-hairline)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: t.dot }}
                  />
                  <span>{t.label}</span>
                  {t.badge && (
                    <span className="font-mono-meta text-[9px] uppercase tracking-wider px-1 py-0.2 rounded bg-[var(--accent-crimson)]/15 text-[var(--accent-crimson)] font-semibold">
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================================
            SIGNATURE MASTHEAD & NAVIGATION (SYMMETRICAL ON MOBILE & DESKTOP)
            ================================================================= */}
        <header className="px-4 sm:px-7 py-3.5 md:py-4 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] flex items-center justify-between gap-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('home');
            }}
            className="group flex items-center gap-2.5 shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent-crimson)]" />
            <span className="font-serif-editorial text-xl sm:text-2xl text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)] transition-colors">
              Vishvajeet Dhawale
            </span>
          </a>

          {/* Desktop Horizontal Index Tabs — Strictly Story, Curiosities, Contact */}
          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center gap-2 justify-end"
          >
            {navItems.map((item) => {
              const isActive =
                activeTab === item.id ||
                (item.id === 'interests' && isCuriositySection);
              const Icon = item.Icon;
              return (
                <a
                  key={item.id}
                  href={`/?section=${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(item.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-diner-olive)]/55'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-[var(--bg-surface)]' : 'text-[var(--accent-crimson)]'
                    }`}
                  />
                  <span className="font-display">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle (Min 40px touch height, paired with Bottom Tab Bar) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3.5 py-1.5 text-xs font-display font-medium rounded-lg bg-[var(--text-primary)] text-[var(--bg-surface)] active:scale-95 transition-transform"
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </>
            ) : (
              <>
                <Menu className="w-3.5 h-3.5" />
                <span>Index</span>
              </>
            )}
          </button>
        </header>

        {/* =================================================================
            MOBILE-ONLY SYMMETRICAL 5-THEME BAR & 2-COLUMN LIVE STATUS STRIP
            ================================================================= */}
        <div className="md:hidden bg-[var(--bg-diner-olive)]/45 border-b border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
          {/* Row 1: Symmetrical 6-Column Theme Switcher (Includes Marcus Aurelius Stoic Theme) */}
          <div className="px-3 py-2">
            <div
              role="group"
              aria-label="Select color theme"
              className="grid grid-cols-6 gap-1 p-0.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
            >
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`min-h-[34px] px-1 py-1 rounded-lg text-[10.5px] font-display flex items-center justify-center gap-1 transition-all ${
                    theme === t.id
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold shadow-2xs border border-[var(--border-hairline)]'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: t.dot }}
                  />
                  <span className="truncate">{t.mobileLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Symmetrical 2-Column Live Status (Watching | On Desk) */}
          <div className="grid grid-cols-2 divide-x divide-[var(--border-hairline)] text-[11px]">
            <button
              type="button"
              onClick={() => handleNavigate('cinema')}
              className="px-3 py-2 flex items-center gap-1.5 min-w-0 text-left active:bg-[var(--bg-canvas)] transition-colors"
            >
              <Clapperboard className="w-3.5 h-3.5 text-[var(--accent-crimson)] shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-mono-meta text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Watching
                </div>
                <div className="font-medium text-[var(--text-primary)] truncate">
                  {latestFilmTitle}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('books')}
              className="px-3 py-2 flex items-center gap-1.5 min-w-0 text-left active:bg-[var(--bg-canvas)] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[var(--accent-olive)] shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-mono-meta text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  On Desk
                </div>
                <div className="font-medium text-[var(--text-primary)] truncate">
                  {currentBookTitle}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Strip when inside Curiosities or any Curiosity Notebook */}
        {isCuriositySection && (
          <div className="px-4 sm:px-7 py-2.5 bg-[var(--bg-canvas)]/75 border-b border-[var(--border-hairline)] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="font-mono-meta text-[10px] text-[var(--text-muted)] mr-1 shrink-0 hidden sm:inline">
              CURIOSITIES /
            </span>
            {curiositySubTabs.map((sub) => {
              const isSubActive = activeTab === sub.id;
              const SubIcon = sub.Icon;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleNavigate(sub.id)}
                  className={`min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-mono-meta inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                    isSubActive
                      ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)]/70 border border-[var(--border-hairline)]'
                  }`}
                >
                  <SubIcon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile Full Directory Drawer (Symmetrical 2x4 Grid of All Notebooks) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-3.5 space-y-3"
            >
              <div className="flex items-center justify-between text-[10px] font-mono-meta uppercase tracking-wider text-[var(--text-muted)]">
                <span>All Notebooks & Rooms</span>
                <span className="text-[var(--accent-crimson)]">Tap to jump</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    { id: 'home' as NavigationTab, label: 'Main Desk', Icon: Compass },
                    { id: 'about' as NavigationTab, label: 'My Story', Icon: User },
                    { id: 'cinema' as NavigationTab, label: 'Cinema (557)', Icon: Film },
                    { id: 'football' as NavigationTab, label: 'Football & Barça', Icon: Trophy },
                    { id: 'books' as NavigationTab, label: 'Books (117)', Icon: BookOpen },
                    { id: 'music' as NavigationTab, label: 'Music & Vinyl', Icon: Disc3 },
                    { id: 'writing' as NavigationTab, label: 'Philosophy & Essays', Icon: Feather },
                    { id: 'contact' as NavigationTab, label: 'Send a Note', Icon: Mail },
                  ] as const
                ).map((item) => {
                  const Icon = item.Icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      className={`min-h-[42px] text-left py-2 px-3 rounded-xl flex items-center gap-2 border transition-all ${
                        isActive
                          ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)] font-medium'
                          : 'bg-[var(--bg-canvas)] text-[var(--text-primary)] border-[var(--border-hairline)]'
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive ? 'text-[var(--bg-surface)]' : 'text-[var(--accent-crimson)]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Global Marcus Aurelius Face-Cut & Stoic Sanctuary Banner when Stoic Theme is Active */}
        {theme === 'stoic' && (
          <GlobalStoicThemeBanner
            atmosphere={stoicAtmosphere}
            onChangeAtmosphere={setStoicAtmosphere}
            onOpenPhilosophyRoom={() => handleNavigate('writing')}
            isPhilosophyRoomActive={activeTab === 'writing'}
          />
        )}

        {/* MAIN CONTENT SHEET */}
        <main
          key={`${activeTab}-${activePostSlug || 'index'}`}
          className="film-cut-enter px-4 sm:px-7 md:px-10 py-6 sm:py-8 md:py-10 bg-[var(--bg-surface)]"
        >
          {activeTab === 'home' && (
            <HomeSection
              archive={archive}
              authorMode={authorMode}
              onNavigate={handleNavigate}
              onReadBlogPost={handleReadBlogPost}
              onUpdateArchive={handleUpdateArchive}
            />
          )}

          {activeTab === 'about' && (
            <AboutSection
              archive={archive}
              authorMode={authorMode}
              onUpdateArchive={handleUpdateArchive}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'interests' && (
            <InterestsHubSection archive={archive} onNavigate={handleNavigate} />
          )}

          {activeTab === 'cinema' && (
            <CinemaSection
              archive={archive}
              authorMode={authorMode}
              onUpdateArchive={handleUpdateArchive}
              onReadBlogPost={handleReadBlogPost}
            />
          )}

          {activeTab === 'football' && (
            <FootballSection
              archive={archive}
              authorMode={authorMode}
              onUpdateArchive={handleUpdateArchive}
            />
          )}

          {activeTab === 'books' && (
            <BooksSection
              archive={archive}
              authorMode={authorMode}
              onUpdateArchive={handleUpdateArchive}
            />
          )}

          {activeTab === 'music' && (
            <MusicSection
              archive={archive}
              authorMode={authorMode}
              onNavigate={handleNavigate}
              onUpdateArchive={handleUpdateArchive}
              onReadBlogPost={handleReadBlogPost}
            />
          )}

          {activeTab === 'photography' && (
            <PhotographySection
              archive={archive}
              authorMode={authorMode}
              onUpdateArchive={handleUpdateArchive}
            />
          )}

          {activeTab === 'writing' && (
            <BlogSection
              archive={archive}
              authorMode={authorMode}
              activePostSlug={activePostSlug}
              stoicThemeActive={theme === 'stoic'}
              stoicAtmosphere={stoicAtmosphere}
              onChangeStoicAtmosphere={setStoicAtmosphere}
              onToggleStoicTheme={() =>
                setTheme((prev) => (prev === 'stoic' ? 'kyoto' : 'stoic'))
              }
              onSelectPostSlug={handleSelectPostSlug}
              onUpdateArchive={handleUpdateArchive}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizSection
              archive={archive}
              authorMode={authorMode}
              onNavigate={handleNavigate}
              onUpdateArchive={handleUpdateArchive}
              defaultExpanded={true}
            />
          )}

          {activeTab === 'contact' && (
            <ContactSection
              archive={archive}
              authorMode={authorMode}
              onUpdateArchive={handleUpdateArchive}
            />
          )}
        </main>

        {/* REFINED ARCHITECTURAL COLOPHON FOOTER — TWO-TIER SYMMETRICAL EDITORIAL DESIGN */}
        <footer className="px-5 sm:px-7 md:px-10 py-8 sm:py-10 border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)]/55 space-y-6">
          {/* Top Tier: Identity & Page Quote (Left) + Symmetrical Room & Section Directory (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start justify-between">
            {/* Left 5 Cols: Identity, Tagline & Contextual Page Quote */}
            <div className="lg:col-span-5 space-y-2.5 text-center sm:text-left">
              <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-crimson)]" />
                <span className="font-serif-editorial text-lg sm:text-xl text-[var(--text-primary)]">
                  Vishvajeet Dhawale
                </span>
                <span className="text-[var(--border-strong)]">·</span>
                <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[var(--accent-crimson)]">
                  Still looking. Still questioning.
                </span>
              </div>

              {activeTab === 'about' ? (
                <p className="font-literary italic editorial-body-sm text-[var(--text-secondary)] max-w-md mx-auto sm:mx-0">
                  “Made this mostly for myself. A place for things I like, thoughts I can't quite shake, and interests that may or may not last.”
                </p>
              ) : activeTab === 'contact' ? (
                <p className="font-literary italic editorial-body-sm text-[var(--text-secondary)] max-w-md mx-auto sm:mx-0">
                  “Not everything needs a purpose. Sometimes being interested is enough.”
                </p>
              ) : (
                <p className="font-sans-body editorial-body-sm text-[var(--text-secondary)] max-w-md mx-auto sm:mx-0">
                  A personal notebook of films, books, music, football, and thoughts I’m still figuring out.
                </p>
              )}
            </div>

            {/* Right 7 Cols: Symmetrical Navigation & Curiosity Rooms */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 lg:pt-0 border-t border-[var(--border-hairline)] lg:border-t-0 text-center sm:text-left">
              <div className="space-y-2">
                <div className="font-mono-meta text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                  Primary Index
                </div>
                <div className="flex flex-col gap-1.5 font-sans-body text-xs sm:text-[13px] text-[var(--text-secondary)]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('home')}
                    className="hover:text-[var(--accent-crimson)] transition-colors cursor-pointer sm:text-left"
                  >
                    Main Desk
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('about')}
                    className="hover:text-[var(--accent-crimson)] transition-colors cursor-pointer sm:text-left"
                  >
                    My Story
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('interests')}
                    className="hover:text-[var(--accent-crimson)] transition-colors cursor-pointer sm:text-left"
                  >
                    All Curiosities
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('contact')}
                    className="hover:text-[var(--accent-crimson)] transition-colors cursor-pointer sm:text-left"
                  >
                    Contact
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-mono-meta text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                  Five Rooms
                </div>
                <div className="flex flex-col gap-1.5 font-sans-body text-xs sm:text-[13px] text-[var(--text-secondary)]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('cinema')}
                    className="hover:text-[var(--accent-crimson)] transition-colors cursor-pointer sm:text-left"
                  >
                    01 · Cinema
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('football')}
                    className="hover:text-[var(--accent-crimson)] transition-colors cursor-pointer sm:text-left"
                  >
                    02 · Football
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('books')}
                    className="hover:text-[var(--accent-crimson)] transition-colors cursor-pointer sm:text-left"
                  >
                    03 · Books
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('writing')}
                    className="hover:text-[var(--accent-crimson)] transition-colors cursor-pointer sm:text-left"
                  >
                    04 · Philosophy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('music')}
                    className="hover:text-[var(--accent-crimson)] transition-colors cursor-pointer sm:text-left"
                  >
                    05 · Music
                  </button>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-2 pt-2 sm:pt-0 border-t border-[var(--border-hairline)] sm:border-t-0">
                <div className="font-mono-meta text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                  Archives &amp; Theme
                </div>
                <div className="flex flex-row sm:flex-col justify-center sm:justify-start flex-wrap gap-3 sm:gap-1.5 font-mono-meta text-xs text-[var(--text-secondary)]">
                  <a
                    href="https://letterboxd.com/mivishvajeet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--accent-crimson)] transition-colors"
                  >
                    <span>Letterboxd</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.goodreads.com/user/show/72865569-vishvajeet-dhawale"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--accent-crimson)] transition-colors"
                  >
                    <span>Goodreads</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      setTheme((prev) => (prev === 'stoic' ? 'kyoto' : 'stoic'))
                    }
                    className="inline-flex items-center gap-1 text-[var(--accent-crimson)] hover:underline underline-offset-4 cursor-pointer sm:text-left"
                  >
                    <span>
                      {theme === 'stoic' ? '● Stoic Theme: ON' : '○ Stoic Theme'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tier: Symmetrical Colophon Bar */}
          <div className="pt-4 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3 font-mono-meta text-[11px] text-[var(--text-muted)]">
            <span>Vishvajeet Dhawale · Personal Notebook</span>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-[var(--accent-crimson)] transition-colors cursor-pointer"
              >
                ↑ Back to top
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setAuthorMode(!authorMode)}
                className="inline-flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Toggle Author Mode"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{authorMode ? 'Author: On' : 'Author'}</span>
              </button>
              {authorMode && (
                <button
                  type="button"
                  onClick={() => setShowGuideModal(true)}
                  className="text-[var(--accent-crimson)] underline underline-offset-4 cursor-pointer"
                >
                  Settings
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>

      {/* =====================================================================
          MOBILE FIXED BOTTOM NAVIGATION BAR (5 SYMMETRICAL THUMB-ZONE TABS)
          ===================================================================== */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-hairline)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <div className="grid grid-cols-5 h-full max-w-lg mx-auto">
          {mobileBottomTabs.map((tab) => {
            const Icon = tab.Icon;
            const isTabActive =
              activeTab === tab.id ||
              (tab.id === 'interests' &&
                isCuriositySection &&
                activeTab !== 'music');
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleNavigate(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors ${
                  isTabActive
                    ? 'text-[var(--accent-crimson)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isTabActive && (
                  <span className="absolute top-0 left-3 right-3 h-0.5 rounded-full bg-[var(--accent-crimson)]" />
                )}
                <Icon className="w-4 h-4" />
                <span className="text-[10.5px] font-display tracking-tight leading-none mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Archive Settings Modal */}
      {showGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Archive settings and content guide"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="diner-booth-panel max-w-xl w-full p-6 space-y-5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-3">
              <h2 className="font-serif-editorial text-xl text-[var(--text-primary)]">
                Notebook Settings & Export
              </h2>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-xs font-mono-meta text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              <div className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] space-y-3">
                <div className="font-medium text-[var(--text-primary)]">Preferences</div>
                <label className="flex items-center justify-between gap-4 cursor-pointer text-xs">
                  <span>Show starter entries</span>
                  <input
                    type="checkbox"
                    checked={archive.settings.showSampleEntries}
                    onChange={() =>
                      handleUpdateArchive((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          showSampleEntries: !prev.settings.showSampleEntries,
                        },
                      }))
                    }
                  />
                </label>
                <label className="flex items-center justify-between gap-4 cursor-pointer text-xs">
                  <span>Enable “A random thought” note on the Studio Desk</span>
                  <input
                    type="checkbox"
                    checked={archive.settings.randomThoughtEnabled}
                    onChange={() =>
                      handleUpdateArchive((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          randomThoughtEnabled: !prev.settings.randomThoughtEnabled,
                        },
                      }))
                    }
                  />
                </label>
              </div>

              <div className="pt-2 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(archive, null, 2)], {
                      type: 'application/json',
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `vishvajeet-archive-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 text-xs font-mono-meta rounded-lg border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent)]"
                >
                  Export Archive JSON
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-1.5 text-xs rounded-lg bg-[var(--accent)] text-white font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
