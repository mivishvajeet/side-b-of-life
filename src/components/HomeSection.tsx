import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clapperboard,
  BookOpen,
  Sparkles,
  Film,
  Trophy,
  Camera,
  Cpu,
  Feather,
  ArrowRight,
  ArrowUpRight,
  Shuffle,
  HeartCrack,
  Mic,
  Radio,
  Flame,
  ChefHat,
  UtensilsCrossed,
  Play,
  Square,
  Disc3,
  Headphones,
  Sliders,
  Link2,
  Clock,
  MapPin,
  Plus,
  X,
} from 'lucide-react';
import {
  ArchiveData,
  NavigationTab,
  RandomThought,
  YoutubePlaylistEntry,
  SpotifyPlaylistEntry,
} from '../types/archive';
import { calculateReadingStats } from '../utils/readingTime';
import { QuizSection } from './QuizSection';

interface HomeSectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  onNavigate: (tab: NavigationTab) => void;
  onReadBlogPost: (slug: string) => void;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
}

type PortraitLutMode = 'theme' | 'kodak' | 'fjord' | 'mono';

interface PersonalMediaItem {
  id: string;
  slot: string;
  shortLabel: string;
  title: string;
  location: string;
  altitudeOrTime: string;
  cameraMeta: string;
  caption: string;
  mediaType: 'photo';
  src: string;
  objectPosition: string;
}

const FEATURED_PORTRAIT: PersonalMediaItem = {
  id: 'cam-01',
  slot: '01',
  shortLabel: 'Pangong',
  title: 'High Altitude Blue · Pangong Shore',
  location: 'Pangong Lake · Ladakh',
  altitudeOrTime: '14,270 ft',
  cameraMeta: 'iPhone 15 Pro Max · 35mm',
  caption: 'Cobalt water, sunlit terracotta mountains, and clear high-altitude air.',
  mediaType: 'photo',
  src: 'assets/aistudio/56B251D4-5A1B-4FEF-A335-0F3652A45C71_dbe9f31d.JPG',
  objectPosition: '50% 76%',
};

const DEFAULT_YOUTUBE_PLAYLISTS: YoutubePlaylistEntry[] = [
  {
    id: 'yt-1',
    slotNumber: '01',
    title: 'Rare Finds',
    category: 'Uncommon Gems & Deep Cuts',
    description:
      'Underrated videos, forgotten interviews, visual essays, and rare internet corners worth bookmarking.',
    playlistUrl: 'https://www.youtube.com/playlist?list=PL5232E91B125E9422',
  },
  {
    id: 'yt-2',
    slotNumber: '02',
    title: 'G(old) Songs',
    category: 'Timeless Classics & Nostalgia',
    description:
      'Songs that never age—old Hindi and Marathi melodies, acoustic sessions, and tracks that still hit the same years later.',
    playlistUrl: 'https://www.youtube.com/playlist?list=PL3F8C2A8E89A67411',
  },
  {
    id: 'yt-3',
    slotNumber: '03',
    title: 'Short Films',
    category: 'Independent Cinema & Storytelling',
    description:
      'Tightly written short films, thriller studies, and twenty-minute stories where every frame counts.',
    playlistUrl: 'https://www.youtube.com/playlist?list=PL8dPuuaLjXtNgK6MZucdYldNkMybYIHKR',
  },
];

const DEFAULT_SPOTIFY_PLAYLISTS: SpotifyPlaylistEntry[] = [
  {
    id: 'sp-1',
    slotNumber: '01',
    title: 'Desi Hip Hop',
    category: 'Bars, Storytelling & Indian Rap',
    description:
      'Raw lyricism, boom-bap and modern beats, and Desi Hip Hop tracks that stay on repeat.',
    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX2RahGIyQXcJ',
  },
  {
    id: 'sp-2',
    slotNumber: '02',
    title: 'Pop',
    category: 'Melodies & Late-Night Drives',
    description:
      'Clean production, hooks, and everyday Pop essentials for coding, walking, or unwinding.',
    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M',
  },
  {
    id: 'sp-3',
    slotNumber: '03',
    title: 'Marathi Golden Songs',
    category: 'Evergreen Roots & Nostalgia',
    description:
      'Timeless Marathi classics, soulful compositions, and songs that feel like home.',
    spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWTwzVdyRpXm1',
  },
];

function toYoutubeEmbedUrl(rawUrl: string): string | null {
  try {
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;
    if (trimmed.includes('youtube.com/embed/')) return trimmed;
    const url = new URL(trimmed);
    const listId = url.searchParams.get('list');
    const videoId = url.searchParams.get('v');
    if (listId && videoId) {
      return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?list=${encodeURIComponent(listId)}`;
    }
    if (listId) {
      return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(listId)}`;
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
    }
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    }
    return null;
  } catch {
    return null;
  }
}

function toSpotifyEmbedUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return DEFAULT_SPOTIFY_PLAYLISTS[0].spotifyUrl;
  if (trimmed.includes('open.spotify.com/embed/')) return trimmed;
  if (trimmed.includes('open.spotify.com/')) {
    return trimmed
      .replace('open.spotify.com/', 'open.spotify.com/embed/')
      .split('?')[0];
  }
  return trimmed;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  archive,
  authorMode = false,
  onNavigate,
  onReadBlogPost,
  onUpdateArchive,
}) => {
  const [thoughtIndex, setThoughtIndex] = useState<number | null>(null);
  const [showAddThought, setShowAddThought] = useState<boolean>(false);
  const [newThoughtText, setNewThoughtText] = useState<string>('');
  const [newThoughtContext, setNewThoughtContext] = useState<string>('');

  // Portrait Color Grade Mode (Synced to site theme by default, or manually switchable)
  const [portraitLut, setPortraitLut] = useState<PortraitLutMode>('theme');
  // Lightbox modal for viewing the portrait in full resolution
  const [activeLightboxMedia, setActiveLightboxMedia] = useState<PersonalMediaItem | null>(
    null
  );

  // Football Goosebumps / Heartbreak Chapter State
  const [activeFootballMoment, setActiveFootballMoment] = useState<
    'roma' | 'messi' | 'stamford' | 'remuntada'
  >('messi');

  // Kitchen / "What's Cooking?" Interactive State
  const [highFlame, setHighFlame] = useState<boolean>(false);
  const [activeDishId, setActiveDishId] = useState<string>('kolhapuri-chicken');

  // YouTube 3-Playlists Editor & Active Player State
  const [activeYoutubeEmbedId, setActiveYoutubeEmbedId] = useState<string | null>(null);
  const [editingYoutubeId, setEditingYoutubeId] = useState<string | null>(null);
  const [ytForm, setYtForm] = useState({
    title: '',
    category: '',
    description: '',
    playlistUrl: '',
  });

  // Spotify 3-Playlists Active Crate & Editor State
  const [activeSpotifySlotId, setActiveSpotifySlotId] = useState<string>('sp-1');
  const [editingSpotifyId, setEditingSpotifyId] = useState<string | null>(null);
  const [spForm, setSpForm] = useState({
    title: '',
    category: '',
    description: '',
    spotifyUrl: '',
  });

  const showSamples = archive.settings.showSampleEntries;

  const availableThoughts = useMemo(
    () => archive.randomThoughts.filter((t) => showSamples || !t.isSample),
    [archive.randomThoughts, showSamples]
  );

  const recentPublishedPosts = useMemo(
    () =>
      archive.blog.posts
        .filter(
          (p) =>
            p.status === 'published' &&
            p.id !== 'post-desi-hip-hop-shot' &&
            (showSamples || !p.isSample)
        )
        .slice(0, 3),
    [archive.blog.posts, showSamples]
  );

  const latestFilm = useMemo(() => {
    const visible = archive.cinema.films.filter((f) => showSamples || !f.isSample);
    return visible.find((f) => f.title.includes('Zodiac')) || visible[0] || null;
  }, [archive.cinema.films, showSamples]);

  const currentBook = useMemo(() => {
    const visible = archive.books.entries.filter(
      (b) => b.status === 'reading' && (showSamples || !b.isSample)
    );
    return visible[0] || null;
  }, [archive.books.entries, showSamples]);

  const youtubePlaylists = useMemo(() => {
    if (
      archive.youtubePlaylists &&
      archive.youtubePlaylists.length === 3 &&
      archive.youtubePlaylists[0].title === 'Rare Finds'
    ) {
      return archive.youtubePlaylists;
    }
    return DEFAULT_YOUTUBE_PLAYLISTS;
  }, [archive.youtubePlaylists]);

  const spotifyPlaylists = useMemo(() => {
    if (archive.spotifyPlaylists && archive.spotifyPlaylists.length === 3) {
      return archive.spotifyPlaylists;
    }
    return DEFAULT_SPOTIFY_PLAYLISTS;
  }, [archive.spotifyPlaylists]);

  const activeSpotifyCrate = useMemo(() => {
    return (
      spotifyPlaylists.find((s) => s.id === activeSpotifySlotId) || spotifyPlaylists[0]
    );
  }, [spotifyPlaylists, activeSpotifySlotId]);

  const interestCounts = useMemo(() => {
    const films = archive.cinema.films.filter((f) => showSamples || !f.isSample).length;
    const frames = archive.cinema.frameStudies.filter((f) => showSamples || !f.isSample).length;
    const football =
      archive.football.notes.filter((n) => showSamples || !n.isSample).length +
      archive.football.matches.filter((m) => showSamples || !m.isSample).length;
    const books = archive.books.entries.filter((b) => showSamples || !b.isSample).length;
    const photos = archive.photography.items.filter((p) => showSamples || !p.isSample).length;
    const tech = archive.technology.items.filter((t) => showSamples || !t.isSample).length;
    return {
      cinema: `${films} films · ${frames} studies`,
      football: `${football} match notes`,
      books: `${books} books logged`,
      photography: `${photos} visual frames`,
      technology: `${tech} experiments`,
    };
  }, [archive, showSamples]);

  const handleCycleRandomThought = () => {
    if (availableThoughts.length === 0) {
      setThoughtIndex(0);
      return;
    }
    setThoughtIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % availableThoughts.length;
    });
  };

  const handleAddThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThoughtText.trim()) return;
    const entry: RandomThought = {
      id: `rt-${Date.now()}`,
      text: newThoughtText.trim(),
      context: newThoughtContext.trim() || 'Personal notebook thought',
      dateAdded: new Date().toISOString().slice(0, 10),
      isSample: false,
    };
    onUpdateArchive((prev) => ({
      ...prev,
      randomThoughts: [entry, ...prev.randomThoughts],
    }));
    setNewThoughtText('');
    setNewThoughtContext('');
    setShowAddThought(false);
    setThoughtIndex(0);
  };

  const toggleRandomThoughtFeature = () => {
    onUpdateArchive((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        randomThoughtEnabled: !prev.settings.randomThoughtEnabled,
      },
    }));
    setThoughtIndex(null);
  };

  const startEditingYoutube = (pl: YoutubePlaylistEntry) => {
    setEditingYoutubeId(pl.id);
    setYtForm({
      title: pl.title,
      category: pl.category,
      description: pl.description,
      playlistUrl: pl.playlistUrl,
    });
  };

  const handleSaveYoutubePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingYoutubeId || !ytForm.title.trim()) return;
    onUpdateArchive((prev) => {
      const currentList =
        prev.youtubePlaylists && prev.youtubePlaylists.length === 3
          ? prev.youtubePlaylists
          : DEFAULT_YOUTUBE_PLAYLISTS;
      const updated = currentList.map((item) =>
        item.id === editingYoutubeId
          ? {
              ...item,
              title: ytForm.title.trim(),
              category: ytForm.category.trim() || item.category,
              description: ytForm.description.trim() || item.description,
              playlistUrl: ytForm.playlistUrl.trim() || item.playlistUrl,
            }
          : item
      );
      return {
        ...prev,
        youtubePlaylists: updated,
      };
    });
    setEditingYoutubeId(null);
  };

  const startEditingSpotify = (sp: SpotifyPlaylistEntry) => {
    setEditingSpotifyId(sp.id);
    setSpForm({
      title: sp.title,
      category: sp.category,
      description: sp.description,
      spotifyUrl: sp.spotifyUrl,
    });
  };

  const handleSaveSpotifyPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpotifyId || !spForm.title.trim()) return;
    onUpdateArchive((prev) => {
      const currentList =
        prev.spotifyPlaylists && prev.spotifyPlaylists.length === 3
          ? prev.spotifyPlaylists
          : DEFAULT_SPOTIFY_PLAYLISTS;
      const updated = currentList.map((item) =>
        item.id === editingSpotifyId
          ? {
              ...item,
              title: spForm.title.trim(),
              category: spForm.category.trim() || item.category,
              description: spForm.description.trim() || item.description,
              spotifyUrl: spForm.spotifyUrl.trim() || item.spotifyUrl,
            }
          : item
      );
      return {
        ...prev,
        spotifyPlaylists: updated,
      };
    });
    setEditingSpotifyId(null);
  };

  const currentThought =
    thoughtIndex !== null && availableThoughts[thoughtIndex]
      ? availableThoughts[thoughtIndex]
      : null;

  const kitchenSpecialties = [
    {
      id: 'lemon-chicken',
      num: '01',
      name: 'Chicken Lemon',
      status: 'Signature · 10/10',
      proficiency: 100,
      prepTime: '35 mins',
      heatLevel: 'High Citrus Sear',
      aromatics: ['Crushed Garlic', 'Cracked Black Pepper', 'Fresh Lemon Zest', 'Pan Sear'],
      stages: [
        'Marinate with cracked pepper, ginger-garlic & pinch of salt',
        'High-heat pan sear until golden crust locks in the juices',
        'Finish off-flame with fresh lemon juice & coriander stems',
      ],
      summary:
        'Bright lemon zest, cracked black pepper, crushed garlic, and pan-seared juiciness. The dish I can cook with my eyes closed.',
      secretNote: 'Timing the lemon juice at the very end so it stays fresh and never turns bitter.',
    },
    {
      id: 'kolhapuri-chicken',
      num: '02',
      name: 'Kolhapuri Chicken + Chicken Rassa (with Jowar Bhakri)',
      status: 'Maharashtrian Specialty · 10/10',
      proficiency: 100,
      prepTime: '65 mins',
      heatLevel: 'Fiery Kanda-Lasun Tadka',
      aromatics: [
        'Kolhapuri Kanda-Lasun Masala',
        'Roasted Dry Coconut (Khobra)',
        'Spicy Tambda Rassa Tari',
        'Hot Hand-Patted Jowar Bhakri',
      ],
      stages: [
        'Roast dry coconut, sesame, dagad phool, coriander & Lavangi chilies for the ground Kolhapuri vatan',
        'Sear marinated chicken in fiery Kanda-Lasun masala and simmer until deep crimson kat (tari) rises on the Chicken Rassa',
        'Enjoy piping hot by tearing flame-puffed Jowar Bhakri (ज्वारीची भाकरी) and soaking it in the spicy rassa alongside raw onion & lemon',
      ],
      summary:
        'Unapologetically bold Maharashtrian Kolhapuri Sukka Chicken and fiery Chicken Rassa with deep red tari—best enjoyed with hot, hand-patted Jowar Bhakri straight off the tawa.',
      secretNote:
        'Freshly roasted khobra-sesame vatan and Kanda-Lasun masala paired with hot Jowar Bhakri is unmatched Maharashtrian comfort.',
    },
    {
      id: 'mutton-disclaimer',
      num: '03',
      name: 'Mutton Curry',
      status: 'Work in Progress',
      proficiency: 45,
      prepTime: '90+ mins',
      heatLevel: 'Pressure Cooker Diplomacy',
      aromatics: ['Whole Garam Masala', 'Caramelized Onions', 'Slow Bhuna', 'Patience'],
      stages: [
        'Slow-brown sliced onions until deep mahogany without burning',
        'Negotiate peace treaties with pressure cooker whistles',
        'Check tenderness and accept that good mutton refuses to be rushed',
      ],
      summary:
        'Not that much hand in mutton yet. Still negotiating peace treaties with pressure cooker whistles and slow-braising times.',
      secretNote:
        'Stick to ordering my Lemon Chicken or Kolhapuri Chicken + Chicken Rassa with Jowar Bhakri if you are hungry tonight.',
    },
  ];

  const activeDish =
    kitchenSpecialties.find((d) => d.id === activeDishId) || kitchenSpecialties[0];

  const portraitFilterClass =
    portraitLut === 'kodak'
      ? 'portrait-lut-kodak'
      : portraitLut === 'fjord'
      ? 'portrait-lut-fjord'
      : portraitLut === 'mono'
      ? 'portrait-lut-mono'
      : 'portrait-theme-grade';

  return (
    <div className="space-y-14 md:space-y-16">
      {/* =====================================================================
          1. HERO SECTION — EDITORIAL INTRO & VISHVAJEET'S PANGONG PORTRAIT
          ===================================================================== */}
      <section aria-labelledby="hero-heading">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left 7 Cols: Editorial Intro, Bio & Action Bar */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-xs text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-crimson)]" />
              <span className="font-serif-editorial italic text-[var(--text-primary)]">
                Hello, I’m Vishvajeet Dhawale
              </span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                India
              </span>
            </div>

            <h1
              id="hero-heading"
              className="editorial-hero-display font-normal text-[var(--text-primary)]"
            >
              Curious about a little{' '}
              <span className="italic text-[var(--accent-crimson)]">too much.</span>
            </h1>

            <div className="space-y-4 font-literary text-base sm:text-[17.5px] text-[var(--text-primary)] leading-[1.72] max-w-2xl">
              <p>
                I tend to get interested in too many things at once and then wonder why I never have
                enough time for any of them. I overthink things, change my mind, start things I
                don&apos;t always finish, and pretend I have a plan when I really don&apos;t.
              </p>

              <p>
                This website is basically a place to keep all of that.{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('cinema')}
                  className="underline decoration-[var(--accent-crimson)]/45 hover:decoration-[var(--accent-crimson)] hover:text-[var(--accent-crimson)] underline-offset-4 transition-colors cursor-pointer"
                >
                  Films I love
                </button>
                ,{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('books')}
                  className="underline decoration-[var(--accent-crimson)]/45 hover:decoration-[var(--accent-crimson)] hover:text-[var(--accent-crimson)] underline-offset-4 transition-colors cursor-pointer"
                >
                  books lying around
                </button>
                ,{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('music')}
                  className="underline decoration-[var(--accent-crimson)]/45 hover:decoration-[var(--accent-crimson)] hover:text-[var(--accent-crimson)] underline-offset-4 transition-colors cursor-pointer"
                >
                  music I&apos;ve been listening to
                </button>
                ,{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('football')}
                  className="underline decoration-[var(--accent-crimson)]/45 hover:decoration-[var(--accent-crimson)] hover:text-[var(--accent-crimson)] underline-offset-4 transition-colors cursor-pointer"
                >
                  Barcelona breaking my heart
                </button>
                , and{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('writing')}
                  className="underline decoration-[var(--accent-crimson)]/45 hover:decoration-[var(--accent-crimson)] hover:text-[var(--accent-crimson)] underline-offset-4 transition-colors cursor-pointer"
                >
                  the occasional thing I felt like writing
                </button>
                .
              </p>

              <p className="font-sans-body editorial-body-sm text-[var(--text-secondary)]">
                Nothing particularly figured out. Just things I like, things I think about, and a
                few things I probably think about too much.
              </p>
            </div>

            {/* Current state of mind — plain, un-highlighted right above Read my story */}
            <div className="pt-1 space-y-3">
              <p className="font-sans-body editorial-body-sm text-[var(--text-secondary)]">
                Current state of mind — “A little bit of everything. A lot of overthinking.”
              </p>

              {/* Symmetrical Action Buttons (2-col on mobile, inline on sm+) */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-surface)] hover:bg-[var(--accent-crimson)] hover:text-white text-xs sm:text-[13px] font-display font-medium transition-colors cursor-pointer"
                >
                  <span>Read my story</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>

                {archive.settings.randomThoughtEnabled && (
                  <button
                    type="button"
                    onClick={handleCycleRandomThought}
                    className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-[var(--border-strong)] border border-[var(--border-hairline)] text-xs sm:text-[13px] font-display font-medium transition-colors cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-[var(--accent-crimson)] shrink-0" />
                    <span>
                      {thoughtIndex === null ? 'Random desk note' : 'Another note'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Pinned Note Reveal for "A random thought" */}
            <AnimatePresence mode="wait">
              {archive.settings.randomThoughtEnabled && thoughtIndex !== null && (
                <motion.div
                  key="thought-sticky"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] space-y-2 max-w-xl"
                >
                  {currentThought ? (
                    <>
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                        <span className="font-mono-meta text-[11px] text-[var(--accent-crimson)]">
                          Note #{thoughtIndex + 1} of {availableThoughts.length}
                        </span>
                        <span>{currentThought.context || 'Notebook'}</span>
                      </div>
                      <blockquote className="font-literary italic text-base sm:text-lg text-[var(--text-primary)] leading-relaxed">
                        “{currentThought.text}”
                      </blockquote>
                      <div className="flex items-center justify-end gap-4 text-xs text-[var(--text-secondary)]">
                        {authorMode && (
                          <>
                            <button
                              type="button"
                              onClick={() => setShowAddThought(!showAddThought)}
                              className="inline-flex items-center gap-1 underline underline-offset-4"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add note</span>
                            </button>
                            <button
                              type="button"
                              onClick={toggleRandomThoughtFeature}
                              className="hover:text-[var(--text-primary)]"
                            >
                              Disable
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setThoughtIndex(null)}
                          className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]"
                        >
                          <X className="w-3 h-3" />
                          <span>Close</span>
                        </button>
                      </div>
                    </>
                  ) : null}

                  {authorMode && showAddThought && (
                    <form
                      onSubmit={handleAddThought}
                      className="pt-3 border-t border-[var(--border-hairline)] space-y-2.5"
                    >
                      <textarea
                        rows={2}
                        required
                        placeholder="Write a thought or question..."
                        value={newThoughtText}
                        onChange={(e) => setNewThoughtText(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)]"
                      />
                      <input
                        type="text"
                        value={newThoughtContext}
                        onChange={(e) => setNewThoughtContext(e.target.value)}
                        placeholder="Context (Optional)"
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)]"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-xs rounded-lg bg-[var(--accent-crimson)] text-white"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddThought(false)}
                          className="text-xs text-[var(--text-secondary)]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right 5 Cols: Vishvajeet's Featured Portrait (Pangong Lake, Ladakh) — Flush & Symmetrical */}
          <div className="lg:col-span-5">
            <div className="w-full max-w-[440px] mx-auto lg:max-w-none rounded-2xl bg-[var(--bg-canvas)]/75 border border-[var(--border-hairline)] p-3.5 space-y-3 tactile-card-shadow">
              {/* Top Camera Contact Sheet Metadata Bar */}
              <div className="flex items-center justify-between px-1 text-xs font-mono-meta text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)] font-medium truncate">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-crimson)] shrink-0" />
                  <span className="truncate">{FEATURED_PORTRAIT.location}</span>
                </span>
                <span className="shrink-0 text-[11px]">{FEATURED_PORTRAIT.cameraMeta}</span>
              </div>

              {/* Properly Sized & Cropped Portrait Frame */}
              <div
                onClick={() => setActiveLightboxMedia(FEATURED_PORTRAIT)}
                className="relative overflow-hidden rounded-xl border border-[var(--border-hairline)] bg-[#10243E] h-[340px] sm:h-[385px] group cursor-pointer"
              >
                <img
                  src={FEATURED_PORTRAIT.src}
                  alt={FEATURED_PORTRAIT.title}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.dataset.fallbackTried) {
                      img.dataset.fallbackTried = '1';
                      img.src =
                        'public/assets/aistudio/56B251D4-5A1B-4FEF-A335-0F3652A45C71_dbe9f31d.JPG';
                    } else if (img.dataset.fallbackTried === '1') {
                      img.dataset.fallbackTried = '2';
                      img.src =
                        '../public/assets/aistudio/56B251D4-5A1B-4FEF-A335-0F3652A45C71_dbe9f31d.JPG';
                    }
                  }}
                  style={{
                    objectPosition: FEATURED_PORTRAIT.objectPosition,
                    imageOrientation: 'from-image',
                  }}
                  className={`w-full h-full object-cover group-hover:scale-[1.02] ${portraitFilterClass}`}
                />

                {/* Subtle theme-harmonized atmospheric overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0) 64%, rgba(10,18,30,0.56) 100%)',
                  }}
                />

                {/* Bottom overlay caption inside the frame */}
                <div className="pointer-events-none absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/95 font-mono-meta">
                  <span className="truncate pr-2">{FEATURED_PORTRAIT.title}</span>
                  <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs text-[10px] shrink-0">
                    {FEATURED_PORTRAIT.altitudeOrTime}
                  </span>
                </div>
              </div>

              {/* Symmetrical Color-Grade LUT Bar */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div
                  role="group"
                  aria-label="Portrait color grade"
                  className="grid grid-cols-4 sm:inline-flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-hairline)] flex-1 sm:flex-initial"
                >
                  {(
                    [
                      { id: 'theme', label: 'Auto' },
                      { id: 'fjord', label: 'Cobalt' },
                      { id: 'kodak', label: 'Warm' },
                      { id: 'mono', label: 'B&W' },
                    ] as const
                  ).map((lut) => (
                    <button
                      key={lut.id}
                      type="button"
                      onClick={() => setPortraitLut(lut.id)}
                      className={`min-h-[28px] px-2.5 py-0.5 rounded-lg text-[11px] font-mono-meta transition-colors text-center cursor-pointer ${
                        portraitLut === lut.id
                          ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {lut.label}
                    </button>
                  ))}
                </div>

                <span className="hidden sm:inline font-mono-meta text-[11px] text-[var(--text-muted)] shrink-0">
                  Tap photo to enlarge
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Inspecting the Featured Pangong Portrait */}
      <AnimatePresence>
        {activeLightboxMedia && (
          <motion.div
            key="camera-roll-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveLightboxMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 sm:p-5 space-y-4 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-3">
                <div>
                  <div className="font-mono-meta text-[11px] text-[var(--accent-crimson)]">
                    Frame #{activeLightboxMedia.slot} · {activeLightboxMedia.location} ·{' '}
                    {activeLightboxMedia.altitudeOrTime}
                  </div>
                  <h3 className="font-serif-editorial text-xl text-[var(--text-primary)]">
                    {activeLightboxMedia.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLightboxMedia(null)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg-canvas)] text-xs font-mono-meta text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden bg-[#0B111A] max-h-[70vh] flex items-center justify-center">
                <img
                  src={activeLightboxMedia.src}
                  alt={activeLightboxMedia.title}
                  style={{ imageOrientation: 'from-image' }}
                  className={`max-h-[68vh] w-auto object-contain ${portraitFilterClass}`}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
                <p className="font-literary italic text-sm text-[var(--text-primary)]">
                  “{activeLightboxMedia.caption}”
                </p>
                <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                  {activeLightboxMedia.cameraMeta}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          2. EXPLORE CURIOSITIES — SYMMETRICAL 5-ROOM EDITORIAL BENTO GRID
          ===================================================================== */}
      <section
        aria-labelledby="explore-curiosities-heading"
        className="pt-8 border-t border-[var(--border-hairline)] space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-crimson)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chronically Curious · Things That Make Me Lose Track of Time</span>
            </div>
            <h2
              id="explore-curiosities-heading"
              className="editorial-section-heading text-[var(--text-primary)]"
            >
              Things I watch, hear, read &amp; think about.
            </h2>
            <p className="font-sans-body editorial-body text-[var(--text-secondary)] max-w-2xl">
              Too many tabs open in my head at once—sorted into five rooms so the overthinking at least looks organized.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('interests')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)] text-xs font-display font-medium text-[var(--text-primary)] hover:text-[var(--accent-crimson)] transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <span>Open full directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
          {[
            {
              id: 'cinema' as NavigationTab,
              num: '01',
              title: 'Cinema',
              meta: '557 Films · 11 Lists',
              desc: 'Watching a two-hour thriller and spending the next four hours dissecting one lighting choice.',
              icon: Clapperboard,
            },
            {
              id: 'football' as NavigationTab,
              num: '02',
              title: 'Football',
              meta: 'FC Barcelona · 4 Eras',
              desc: 'Cruyff, Pep, Luis Enrique & Hansi Flick live tactical boards—plus matches that broke or healed me.',
              icon: Trophy,
            },
            {
              id: 'books' as NavigationTab,
              num: '03',
              title: 'Books',
              meta: '117 Books · 56+ Notes',
              desc: 'Stories, ideas, and the occasional book that rearranges the furniture in your head.',
              icon: BookOpen,
            },
            {
              id: 'writing' as NavigationTab,
              num: '04',
              title: 'Philosophy & Writing',
              meta: 'Essays & Stories',
              desc: 'Marathi essays, Stoic cross-examinations of my own reactions, and stories by authors I revere.',
              icon: Feather,
            },
            {
              id: 'music' as NavigationTab,
              num: '05',
              title: 'Music',
              meta: 'Hindi · Marathi · Rock · Hip-Hop',
              desc: 'Old Bollywood Hindi songs, evergreen Marathi melodies, 90s rock/pop & “Be My Baby” classics, and Kendrick Lamar & Kanye.',
              icon: Headphones,
            },
          ].map((room, idx) => {
            const IconComponent = room.icon;
            // On 2-column (sm) viewports, span the 5th card across both columns so there is never an asymmetrical half-empty row
            const spanClass = idx === 4 ? 'sm:col-span-2 lg:col-span-1' : '';
            return (
              <motion.button
                key={room.id}
                type="button"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18 }}
                onClick={() => onNavigate(room.id)}
                className={`group h-full p-4 sm:p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)] text-left flex flex-col justify-between gap-4 tactile-card-shadow transition-all cursor-pointer ${spanClass}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-meta text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)] font-medium">
                      <IconComponent className="w-4 h-4 text-[var(--accent-crimson)]" />
                      <span>{room.num}</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-crimson)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  <div>
                    <h3 className="editorial-card-heading text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)] transition-colors">
                      {room.title}
                    </h3>
                    <div className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-olive)] mt-1">
                      {room.meta}
                    </div>
                  </div>

                  <p className="font-sans-body editorial-body-sm text-[var(--text-secondary)]">
                    {room.desc}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs font-mono-meta text-[var(--text-muted)] group-hover:text-[var(--accent-crimson)]">
                  <span>Enter room</span>
                  <span>→</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          3. FOOTBALL — UNIFIED HOME THEME COLORS (2x2 MOBILE / 4-COL DESKTOP)
          ===================================================================== */}
      <section
        aria-labelledby="football-goosebumps-heading"
        className="pt-8 border-t border-[var(--border-hairline)] space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-crimson)]">
              <Radio className="w-3.5 h-3.5" />
              <span>02 · Football · Unhealthy Emotional Investment</span>
            </div>
            <h2
              id="football-goosebumps-heading"
              className="editorial-section-heading text-[var(--text-primary)]"
            >
              Ninety minutes of geometry, twenty years of emotional damage.
            </h2>
            <p className="font-sans-body editorial-body text-[var(--text-secondary)]">
              Four nights etched in memory — Messi shaking hands with paradise in Lusail, staring at the screen in disbelief in Rome, Iniesta rescuing us at Stamford Bridge, and Sergi Roberto defying physics at 94:50.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('football')}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bg-canvas)] hover:bg-[var(--accent-crimson)] hover:text-white border border-[var(--border-hairline)] text-xs font-display font-medium text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <span>Open Football Page &amp; Pitch Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Symmetrical 2x2 Mobile / 4-Column Desktop Match Timeline Selector Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 items-stretch">
          {(
            [
              {
                id: 'messi',
                minute: '18 Dec 2022',
                tag: 'Crowning Peak',
                title: 'Messi in Lusail',
                score: 'ARG 3–3 (4–2) FRA',
                Icon: Trophy,
              },
              {
                id: 'roma',
                minute: '10 Apr 2018 · 82’',
                tag: 'Heartbreak',
                title: 'Manolas in Rome',
                score: 'ROMA 3–0 BARÇA',
                Icon: HeartCrack,
              },
              {
                id: 'stamford',
                minute: '06 May 2009 · 93’',
                tag: 'Miracle',
                title: 'Iniesta at Chelsea',
                score: 'CHE 1–1 BARÇA',
                Icon: Sparkles,
              },
              {
                id: 'remuntada',
                minute: '08 Mar 2017 · 95’',
                tag: 'La Remuntada',
                title: 'Sergi Roberto 6–1',
                score: 'BARÇA 6–1 PSG',
                Icon: Flame,
              },
            ] as const
          ).map((item) => {
            const isActive = activeFootballMoment === item.id;
            const Icon = item.Icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveFootballMoment(item.id)}
                className={`h-full p-3.5 sm:p-4 rounded-xl text-left transition-all border relative overflow-hidden flex flex-col justify-between gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--accent-crimson)] tactile-card-shadow'
                    : 'bg-[var(--bg-canvas)]/55 text-[var(--text-secondary)] border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent-crimson)]" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-mono-meta">
                    <span className="inline-flex items-center gap-1 text-[var(--accent-crimson)] font-medium truncate">
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.minute}</span>
                    </span>
                    <span className="text-[var(--text-muted)] hidden sm:inline shrink-0">
                      {item.tag}
                    </span>
                  </div>
                  <div className="font-serif-editorial text-base sm:text-lg text-[var(--text-primary)] leading-snug">
                    {item.title}
                  </div>
                </div>
                <div className="font-mono-meta text-[11px] text-[var(--accent-olive)] tabular-nums">
                  {item.score}
                </div>
              </button>
            );
          })}
        </div>

        {/* Unified Single-Container Incident & Commentary Stage in Home Page Theme */}
        <AnimatePresence mode="wait">
          {activeFootballMoment === 'messi' && (
            <motion.article
              key="messi-card"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] tactile-card-shadow grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              <div className="lg:col-span-5 space-y-3 lg:pr-6 lg:border-r lg:border-[var(--border-hairline)]">
                <div className="inline-flex items-center gap-1.5 font-mono-meta text-xs text-[var(--accent-crimson)]">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Lusail Stadium · FIFA World Cup Final</span>
                </div>
                <h3 className="font-serif-editorial text-xl sm:text-2xl text-[var(--text-primary)] leading-snug">
                  When Lionel Messi Shook Hands With Paradise
                </h3>
                <p className="font-sans-body editorial-body text-[var(--text-secondary)]">
                  After 120 breathless minutes and a penalty shootout against France, Lionel Messi
                  lifted the World Cup trophy—completing football.
                </p>
                <div className="p-3.5 rounded-xl bg-[var(--bg-canvas)]/75 border border-[var(--border-hairline)] space-y-1">
                  <div className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-crimson)]">
                    Personal Memory
                  </div>
                  <p className="font-sans-body editorial-body-sm text-[var(--text-primary)]">
                    The happiest moment of my life watching football. Hearing Peter Drury speak
                    these lines felt like twenty years of devotion finding its rightful ending.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono-meta text-[var(--text-muted)] border-b border-[var(--border-hairline)] pb-2">
                  <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)]">
                    <Mic className="w-3.5 h-3.5 text-[var(--accent-crimson)]" />
                    <span>Verbatim Broadcast Transcript</span>
                  </span>
                  <span className="text-[var(--accent-crimson)]">Peter Drury</span>
                </div>
                <blockquote className="space-y-2.5 font-literary italic text-base sm:text-[17.5px] text-[var(--text-primary)] leading-[1.68]">
                  <p>
                    “Lionel Messi has conquered his final peak. Lionel Messi has shaken hands with
                    paradise. The little boy from Rosario, Santa Fe, has just pitched up in heaven.
                    He climbs into a galaxy of his own. He has his crowning moment and, of course,
                    he is not alone.”
                  </p>
                  <p>
                    “He was beautiful. He was the point of difference. He has always been the point
                    of difference. Unparalleled, and maybe today there will, of course, always be
                    those who argue, always be those who debate. And the debate could rage on if
                    you like.”
                  </p>
                  <p className="text-[var(--accent-crimson)]">
                    “But as he falls in love with the object in the world that his heart most
                    desired, it is hard to escape the supposition that he has rendered himself
                    today, the greatest of all time.”
                  </p>
                </blockquote>
              </div>
            </motion.article>
          )}

          {activeFootballMoment === 'roma' && (
            <motion.article
              key="roma-card"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] tactile-card-shadow grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              <div className="lg:col-span-5 space-y-3 lg:pr-6 lg:border-r lg:border-[var(--border-hairline)]">
                <div className="inline-flex items-center gap-1.5 font-mono-meta text-xs text-[var(--accent-crimson)]">
                  <HeartCrack className="w-3.5 h-3.5" />
                  <span>10 April 2018 · Stadio Olimpico · 82nd Minute</span>
                </div>
                <h3 className="font-serif-editorial text-xl sm:text-2xl text-[var(--text-primary)] leading-snug">
                  “How Could We Not Win This?!” — Heartbreak in Rome
                </h3>
                <p className="font-sans-body editorial-body text-[var(--text-secondary)]">
                  Holding a 4–1 first-leg lead, Barcelona froze in Rome. When Kostas Manolas headed
                  in the decisive third goal in the 82nd minute, Peter Drury delivered one of the
                  greatest commentary calls in football history.
                </p>
                <div className="p-3.5 rounded-xl bg-[var(--bg-canvas)]/75 border border-[var(--border-hairline)] space-y-1">
                  <div className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-crimson)]">
                    Personal Memory
                  </div>
                  <p className="font-sans-body editorial-body-sm text-[var(--text-primary)]">
                    I was literally crying at the screen wondering how we could possibly lose from
                    there. Even through the heartbreak, these words give me goosebumps every time.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono-meta text-[var(--text-muted)] border-b border-[var(--border-hairline)] pb-2">
                  <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)]">
                    <Mic className="w-3.5 h-3.5 text-[var(--accent-crimson)]" />
                    <span>Verbatim Broadcast Call · 82’</span>
                  </span>
                  <span className="text-[var(--accent-crimson)]">Peter Drury</span>
                </div>
                <blockquote className="font-literary italic text-base sm:text-[18px] text-[var(--text-primary)] leading-[1.68]">
                  “Roma have risen from their ruins! Manolas, the Greek God in Rome. The
                  unthinkable unfolds before our eyes. This was not meant to happen, this could not
                  happen, this is happening! Barcelona, extraordinarily, (are) eight minutes from
                  elimination. Roma boss Eusebio Di Francesco does not know where to go, (Andres)
                  Iniesta does not know where to look. It’s a Greek from Mount Olympus, who has
                  come to the Seven Hills of Rome and pulled off a miracle!”
                </blockquote>
              </div>
            </motion.article>
          )}

          {activeFootballMoment === 'stamford' && (
            <motion.article
              key="stamford-card"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] tactile-card-shadow grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              <div className="lg:col-span-5 space-y-2.5 lg:pr-6 lg:border-r lg:border-[var(--border-hairline)]">
                <div className="inline-flex items-center gap-1.5 font-mono-meta text-xs text-[var(--accent-crimson)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>6 May 2009 · Stamford Bridge · 90+3rd Minute</span>
                </div>
                <h3 className="font-serif-editorial text-xl sm:text-2xl text-[var(--text-primary)] leading-snug">
                  Andrés Iniesta Two Minutes From Time
                </h3>
                <p className="font-sans-body text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  Down to ten men and seconds from going out, Messi rolled one final pass across
                  the edge of the area. Iniesta met it on the run and sent it into the top corner.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono-meta text-[var(--text-muted)] border-b border-[var(--border-hairline)] pb-2">
                  <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)]">
                    <Mic className="w-3.5 h-3.5 text-[var(--accent-crimson)]" />
                    <span>Verbatim Broadcast Call · 90+3’</span>
                  </span>
                  <span className="text-[var(--accent-crimson)]">Stamford Bridge</span>
                </div>
                <blockquote className="font-literary italic text-lg sm:text-xl text-[var(--text-primary)] leading-[1.6]">
                  “Iniestaaa! And the Chelsea fans cover their eyes in horror, two minutes from
                  time and its heartbreak at Stamford Bridge!”
                </blockquote>
              </div>
            </motion.article>
          )}

          {activeFootballMoment === 'remuntada' && (
            <motion.article
              key="remuntada-card"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] tactile-card-shadow grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              <div className="lg:col-span-5 space-y-2.5 lg:pr-6 lg:border-r lg:border-[var(--border-hairline)]">
                <div className="inline-flex items-center gap-1.5 font-mono-meta text-xs text-[var(--accent-crimson)]">
                  <Flame className="w-3.5 h-3.5" />
                  <span>8 March 2017 · Camp Nou · 90+5th Minute</span>
                </div>
                <h3 className="font-serif-editorial text-xl sm:text-2xl text-[var(--text-primary)] leading-snug">
                  Three Goals in Seven Minutes &amp; Sergi Roberto’s Stretch
                </h3>
                <p className="font-sans-body text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  Trailing 4–0 from the first leg and needing three goals after the 88th minute,
                  Neymar lifted one last ball over the defense in the 95th minute for Sergi Roberto
                  to volley home.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono-meta text-[var(--text-muted)] border-b border-[var(--border-hairline)] pb-2">
                  <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)]">
                    <Mic className="w-3.5 h-3.5 text-[var(--accent-crimson)]" />
                    <span>Verbatim Broadcast Call · 90+5’</span>
                  </span>
                  <span className="text-[var(--accent-crimson)]">Camp Nou</span>
                </div>
                <blockquote className="font-literary italic text-lg sm:text-xl text-[var(--text-primary)] leading-[1.6]">
                  “Neymar... chipped towards the back post! SERGI ROBERTO! IT HAS COME OUT OF THE
                  STARS! ... Barcelona have risen from the dead!”
                </blockquote>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </section>

      {/* =====================================================================
          4. "WHAT'S COOKING?" — REDESIGNED INTERACTIVE CHEF'S COUNTER & ANIMATIONS
          ===================================================================== */}
      <section
        id="whats-cooking-section"
        aria-labelledby="whats-cooking-heading"
        className="pt-8 border-t border-[var(--border-hairline)] space-y-6"
      >
        {/* Top Row: Section Header + Interactive Stove Flame Controller */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-crimson)]">
              <ChefHat className="w-3.5 h-3.5" />
              <span>03 · Off-Screen Therapy · Chef’s Counter</span>
            </div>
            <h2
              id="whats-cooking-heading"
              className="editorial-section-heading text-[var(--text-primary)]"
            >
              The only place my brain actually closes its browser tabs.
            </h2>
            <p className="font-sans-body editorial-body text-[var(--text-secondary)]">
              You can’t overthink life while roasting khobra-lasun vatan over an open flame. Select a dish below to inspect my actual backup career.
            </p>
          </div>

          {/* Interactive Stove Burner & Flame Animation Toggle — Full-width symmetrical on mobile */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] self-start lg:self-auto">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] overflow-hidden shrink-0">
                <motion.div
                  animate={
                    highFlame
                      ? { scale: [1, 1.24, 1.08, 1.28, 1], rotate: [-4, 4, -3, 3, 0] }
                      : { scale: [1, 1.07, 1], opacity: [0.8, 1, 0.8] }
                  }
                  transition={{
                    duration: highFlame ? 0.9 : 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Flame
                    className={`w-4 h-4 ${
                      highFlame ? 'text-[var(--accent-crimson)]' : 'text-[var(--accent-mustard)]'
                    }`}
                  />
                </motion.div>
              </div>

              <div className="pr-1">
                <div className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Burner State
                </div>
                <div className="font-display text-xs font-medium text-[var(--text-primary)]">
                  {highFlame ? 'High Flame · Tadka Sear' : 'Slow Simmer · Gravy Mode'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHighFlame((prev) => !prev)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-mono-meta border transition-all shrink-0 cursor-pointer ${
                highFlame
                  ? 'bg-[var(--accent-crimson)] text-white border-[var(--accent-crimson)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--accent-crimson)]'
              }`}
            >
              {highFlame ? 'Simmer Down' : 'Turn Up Heat'}
            </button>
          </div>
        </div>

        {/* Interactive Two-Column Chef's Counter Pass */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left 5 Cols: Interactive Dish Menu Selector */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            <div className="space-y-2.5">
              {kitchenSpecialties.map((dish) => {
                const isSelected = activeDish.id === dish.id;
                return (
                  <motion.button
                    key={dish.id}
                    type="button"
                    onClick={() => setActiveDishId(dish.id)}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--bg-surface)] border-[var(--accent-crimson)] tactile-card-shadow'
                        : 'bg-[var(--bg-canvas)]/55 border-[var(--border-hairline)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-kitchen-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-crimson)]"
                      />
                    )}

                    <div className="flex items-center justify-between gap-2 font-mono-meta text-[11px]">
                      <span className="text-[var(--accent-crimson)] font-medium">
                        {dish.num} · {dish.status}
                      </span>
                      <span className="text-[var(--text-muted)]">{dish.prepTime}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1">
                      <h3 className="font-serif-editorial text-lg sm:text-xl text-[var(--text-primary)] leading-snug">
                        {dish.name}
                      </h3>
                      <span className="font-mono-meta text-[11px] px-2 py-0.5 rounded bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-secondary)] shrink-0 tabular-nums">
                        {dish.proficiency}%
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Unofficial Career Backup Note */}
            <div className="p-4 rounded-xl bg-[var(--bg-canvas)]/65 border border-[var(--border-hairline)] space-y-1.5">
              <div className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-crimson)]">
                Unofficial Career Backup
              </div>
              <p className="font-literary italic text-sm text-[var(--text-primary)] leading-relaxed">
                “Yes, you can officially hire me for cooking if this whole figuring-out-life thing
                takes too long. My hourly rates are unreasonable and I don’t take shortcuts on the
                gravy.”
              </p>
            </div>
          </div>

          {/* Right 7 Cols: Animated Active Dish Tasting Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDish.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24 }}
                className="h-full p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] tactile-card-shadow flex flex-col justify-between gap-5 relative overflow-hidden"
              >
                {/* Animated Rising Steam / Aroma Wisps */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3 right-5 flex items-center gap-2"
                >
                  {[0, 1, 2].map((idx) => (
                    <motion.span
                      key={idx}
                      animate={{
                        y: [0, -14, -24],
                        opacity: [0, highFlame ? 0.55 : 0.3, 0],
                        scaleX: [1, 1.15, 0.9],
                      }}
                      transition={{
                        duration: highFlame ? 1.6 : 2.6,
                        repeat: Infinity,
                        delay: idx * 0.45,
                        ease: 'easeOut',
                      }}
                      className="w-1.5 h-5 rounded-full bg-[var(--accent-crimson)]/40 blur-[1px]"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-hairline)] pb-3">
                    <div className="inline-flex items-center gap-2 font-mono-meta text-xs text-[var(--accent-crimson)]">
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>
                        COURSE {activeDish.num} · {activeDish.heatLevel.toUpperCase()}
                      </span>
                    </div>
                    <span className="font-mono-meta text-xs text-[var(--text-muted)]">
                      PREP: {activeDish.prepTime}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight">
                      {activeDish.name}
                    </h3>
                    <p className="font-sans-body editorial-body text-[var(--text-secondary)] mt-2">
                      {activeDish.summary}
                    </p>
                  </div>

                  {/* Animated Proficiency & Confidence Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-mono-meta text-[11px] text-[var(--text-muted)]">
                      <span>KITCHEN CONFIDENCE</span>
                      <span className="text-[var(--text-primary)] tabular-nums">
                        {activeDish.proficiency}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--bg-canvas)] overflow-hidden border border-[var(--border-hairline)]">
                      <motion.div
                        key={`${activeDish.id}-bar`}
                        initial={{ width: 0 }}
                        animate={{ width: `${activeDish.proficiency}%` }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                        className="h-full bg-[var(--accent-crimson)] rounded-full"
                      />
                    </div>
                  </div>

                  {/* Aromatics & Spice Profile Pills */}
                  <div className="space-y-1.5">
                    <div className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                      Aromatics &amp; Core Elements
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDish.aromatics.map((spice, i) => (
                        <motion.span
                          key={spice}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono-meta bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                        >
                          {spice}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* 3-Step Process Breakdown */}
                  <div className="space-y-2 pt-1">
                    <div className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                      How It Comes Together
                    </div>
                    <div className="space-y-2">
                      {activeDish.stages.map((step, idx) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          className="flex items-start gap-2.5 editorial-body-sm text-[var(--text-secondary)]"
                        >
                          <span className="font-mono-meta text-xs text-[var(--accent-crimson)] mt-0.5 shrink-0">
                            0{idx + 1}
                          </span>
                          <span>{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Secret Note */}
                <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-3">
                  <p className="font-literary italic text-sm text-[var(--accent-olive)]">
                    Chef’s note: “{activeDish.secretNote}”
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. YOUTUBE & SPOTIFY — SYMMETRICAL DUAL-DECK SCREENING & VINYL BOOTH
          ===================================================================== */}
      <section
        aria-labelledby="youtube-playlists-heading"
        className="pt-8 border-t border-[var(--border-hairline)] space-y-6"
      >
        {/* Console Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-crimson)]">
              <Radio className="w-3.5 h-3.5" />
              <span>04 · Late-Night Screening &amp; Sound Booth</span>
            </div>
            <h2
              id="youtube-playlists-heading"
              className="editorial-section-heading text-[var(--text-primary)]"
            >
              2 AM YouTube rabbit holes &amp; songs I’ve played to death.
            </h2>
            <p className="font-sans-body editorial-body text-[var(--text-secondary)] max-w-xl">
              Screen a YouTube reel inline on Deck A, spin a Spotify crate on Deck B, or step into the Music room for “DESI HIP-HOP — AISA KUCH SHOT NAHI.”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
            <a
              href="https://open.spotify.com/user/fv5vyjnkvu7o9o97yo8mgkyvu?si=38f5f11750d446c2"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-canvas)] hover:border-[var(--accent-olive)] border border-[var(--border-hairline)] text-xs font-mono-meta text-[var(--text-primary)] transition-colors"
            >
              <Disc3 className="w-3.5 h-3.5 text-[var(--accent-olive)]" />
              <span>My Spotify Profile</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => onNavigate('music')}
              className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-surface)] hover:bg-[var(--accent-crimson)] hover:text-white text-xs font-display font-medium transition-colors cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Open Music Page &amp; Hip-Hop Essay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Inline Edit Modals for YouTube or Spotify when active */}
        {editingYoutubeId && (
          <form
            onSubmit={handleSaveYoutubePlaylist}
            className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-2.5">
              <span className="font-display text-xs font-medium text-[var(--text-primary)]">
                Update YouTube Reel URL
              </span>
              <button
                type="button"
                onClick={() => setEditingYoutubeId(null)}
                className="text-xs font-mono-meta text-[var(--text-secondary)]"
              >
                Cancel ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Reel Title *
                </label>
                <input
                  type="text"
                  required
                  value={ytForm.title}
                  onChange={(e) => setYtForm({ ...ytForm, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={ytForm.category}
                  onChange={(e) => setYtForm({ ...ytForm, category: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  YouTube Playlist or Video URL *
                </label>
                <input
                  type="url"
                  required
                  value={ytForm.playlistUrl}
                  onChange={(e) => setYtForm({ ...ytForm, playlistUrl: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm font-mono-meta rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={ytForm.description}
                  onChange={(e) => setYtForm({ ...ytForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-1.5 text-xs rounded-lg font-display font-medium bg-[var(--accent-crimson)] text-white"
              >
                Save Reel
              </button>
              <button
                type="button"
                onClick={() => setEditingYoutubeId(null)}
                className="text-xs text-[var(--text-secondary)]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {editingSpotifyId && (
          <form
            onSubmit={handleSaveSpotifyPlaylist}
            className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-2.5">
              <span className="font-display text-xs font-medium text-[var(--text-primary)]">
                Update Spotify Crate Link
              </span>
              <button
                type="button"
                onClick={() => setEditingSpotifyId(null)}
                className="text-xs font-mono-meta text-[var(--text-secondary)]"
              >
                Cancel ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Crate Title *
                </label>
                <input
                  type="text"
                  required
                  value={spForm.title}
                  onChange={(e) => setSpForm({ ...spForm, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Vibe / Category
                </label>
                <input
                  type="text"
                  value={spForm.category}
                  onChange={(e) => setSpForm({ ...spForm, category: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Spotify URL *
                </label>
                <input
                  type="url"
                  required
                  value={spForm.spotifyUrl}
                  onChange={(e) => setSpForm({ ...spForm, spotifyUrl: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm font-mono-meta rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={spForm.description}
                  onChange={(e) => setSpForm({ ...spForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-1.5 text-xs rounded-lg font-display font-medium bg-[var(--accent-olive)] text-white"
              >
                Save Spotify Crate
              </button>
              <button
                type="button"
                onClick={() => setEditingSpotifyId(null)}
                className="text-xs text-[var(--text-secondary)]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Dual-Deck Studio Layout: Deck A (YouTube VHS Screening Deck) + Deck B (Spotify Vinyl Listening Booth) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* DECK A (6 Cols): YouTube Screening Deck */}
          <div className="lg:col-span-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-5 sm:p-6 flex flex-col justify-between gap-5 tactile-card-shadow">
            <div className="flex-1 flex flex-col gap-4">
              {/* Deck Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-crimson)]" />
                  <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-crimson)]">
                    Deck A · YouTube Screening Reels
                  </span>
                </div>
                <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                  3 Curated Channels
                </span>
              </div>

              {/* 3 Cassette / Reel Spine Rows — Distributed Evenly to Match Deck B */}
              <div className="flex-1 flex flex-col justify-between gap-3">
                {youtubePlaylists.map((pl) => {
                  const embedUrl = toYoutubeEmbedUrl(pl.playlistUrl);
                  const isPlaying = activeYoutubeEmbedId === pl.id;

                  return (
                    <div
                      key={pl.id}
                      className={`flex-1 flex flex-col justify-center rounded-xl border transition-all overflow-hidden ${
                        isPlaying
                          ? 'bg-[var(--bg-elevated)] border-[var(--accent-crimson)]'
                          : 'bg-[var(--bg-canvas)]/60 border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex flex-col items-center justify-center shrink-0 font-mono-meta">
                            <span className="text-[9px] text-[var(--text-muted)] leading-none">
                              REEL
                            </span>
                            <span className="text-xs font-semibold text-[var(--accent-crimson)]">
                              {pl.slotNumber}
                            </span>
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-serif-editorial text-lg text-[var(--text-primary)] leading-tight">
                                {pl.title}
                              </h3>
                              <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                                · {pl.category}
                              </span>
                            </div>
                            <p className="font-sans-body editorial-body-sm text-[var(--text-secondary)] line-clamp-2">
                              {pl.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t border-[var(--border-hairline)] sm:border-t-0">
                          {embedUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveYoutubeEmbedId(isPlaying ? null : pl.id)
                              }
                              className={`min-h-[34px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono-meta text-[11px] transition-colors cursor-pointer ${
                                isPlaying
                                  ? 'bg-[var(--accent-crimson)] text-white'
                                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)]'
                              }`}
                            >
                              {isPlaying ? (
                                <>
                                  <Square className="w-3 h-3" />
                                  <span>Stop</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Screen</span>
                                </>
                              )}
                            </button>
                          )}

                          <a
                            href={pl.playlistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[34px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)] font-mono-meta text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent-crimson)] transition-colors"
                            title="Open on YouTube"
                          >
                            <span>YT</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>

                          <button
                            type="button"
                            onClick={() => startEditingYoutube(pl)}
                            className="min-h-[34px] p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                            title="Edit playlist link"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Monitor Drawer when active */}
                      {isPlaying && embedUrl && (
                        <div className="px-4 pb-4 pt-1 border-t border-[var(--border-hairline)] bg-black/90">
                          <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10">
                            <iframe
                              src={embedUrl}
                              title={pl.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs font-mono-meta text-[var(--text-muted)]">
              <span>Rare Finds · G(old) Songs · Short Films</span>
              <span>Click Screen for inline monitor</span>
            </div>
          </div>

          {/* DECK B (6 Cols): Spotify Turntable & Vinyl Sleeve Rack */}
          <div className="lg:col-span-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-5 sm:p-6 flex flex-col justify-between gap-5 tactile-card-shadow">
            <div className="space-y-4">
              {/* Deck Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
                <div className="flex items-center gap-2">
                  <Disc3 className="w-3.5 h-3.5 text-[var(--accent-olive)] animate-spin" />
                  <span className="font-mono-meta text-xs uppercase tracking-widest text-[var(--accent-olive)]">
                    Deck B · Spotify Vinyl Listening Booth
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('music')}
                  className="font-mono-meta text-[11px] text-[var(--accent-crimson)] hover:underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Enter Music Page</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              {/* 3 Vinyl Sleeve Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-stretch">
                {spotifyPlaylists.map((sp) => {
                  const isSelected = activeSpotifyCrate.id === sp.id;
                  return (
                    <div
                      key={sp.id}
                      onClick={() => setActiveSpotifySlotId(sp.id)}
                      className={`h-full p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-[var(--bg-diner-olive)]/85 border-[var(--accent-olive)] shadow-sm'
                          : 'bg-[var(--bg-canvas)]/60 border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono-meta">
                          <span className="text-[var(--accent-olive)] font-semibold">
                            CRATE {sp.slotNumber}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingSpotify(sp);
                            }}
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            title="Edit Spotify URL"
                          >
                            <Link2 className="w-3 h-3" />
                          </button>
                        </div>
                        <h3 className="font-serif-editorial text-base text-[var(--text-primary)] leading-snug">
                          {sp.title}
                        </h3>
                        <p className="font-sans-body editorial-body-sm text-[var(--text-secondary)] line-clamp-2">
                          {sp.description}
                        </p>
                      </div>

                      <div className="pt-1.5 border-t border-[var(--border-hairline)] flex items-center justify-between text-[10px] font-mono-meta">
                        <span
                          className={
                            isSelected
                              ? 'text-[var(--accent-olive)] font-medium'
                              : 'text-[var(--text-muted)]'
                          }
                        >
                          {isSelected ? '● Spinning' : 'Load Crate'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Integrated Vinyl Platter & Spotify Embed */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-canvas)]/80 border border-[var(--border-hairline)] space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 shrink-0 rounded-full bg-[#14181F] border-2 border-[#27303F] flex items-center justify-center shadow-sm vinyl-spin-slow"
                      aria-hidden="true"
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent-crimson)] flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-[#FAF8F3]" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-olive)]">
                        Now Playing · Crate {activeSpotifyCrate.slotNumber}
                      </div>
                      <div className="font-serif-editorial text-base text-[var(--text-primary)] truncate">
                        {activeSpotifyCrate.title}
                      </div>
                    </div>
                  </div>

                  <a
                    href={activeSpotifyCrate.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--accent-olive)] font-mono-meta text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0"
                  >
                    <span>Spotify</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

                <iframe
                  key={activeSpotifyCrate.spotifyUrl}
                  title={activeSpotifyCrate.title}
                  src={toSpotifyEmbedUrl(activeSpotifyCrate.spotifyUrl)}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg border border-[var(--border-hairline)] block"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs font-mono-meta text-[var(--text-muted)]">
              <span>Desi Hip Hop · Pop · Marathi Golden Songs</span>
              <span>Select any crate above</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. RECENT WRITING — MINIMAL EDITORIAL JOURNAL CARDS
          ===================================================================== */}
      <section
        aria-labelledby="recent-writing-heading"
        className="pt-8 border-t border-[var(--border-hairline)] space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 font-mono-meta text-xs uppercase tracking-wider text-[var(--accent-olive)]">
              <Feather className="w-3.5 h-3.5" />
              <span>05 · Writing &amp; Unsolicited Self-Cross-Examination</span>
            </div>
            <h2
              id="recent-writing-heading"
              className="editorial-section-heading text-[var(--text-primary)]"
            >
              Arguing with myself on paper so I don’t do it out loud.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('writing')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)] text-xs font-display font-medium text-[var(--text-primary)] hover:text-[var(--accent-crimson)] transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <span>All essays &amp; notes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {recentPublishedPosts.map((post, idx) => {
            const stats = calculateReadingStats(post.content);
            const isMarathi = /[\u0900-\u097F]/.test(post.title);
            return (
              <motion.article
                key={post.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18 }}
                onClick={() => onReadBlogPost(post.slug)}
                className="group h-full p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)] tactile-card-shadow flex flex-col justify-between gap-4 cursor-pointer transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-meta text-[var(--text-muted)]">
                    <span className="text-[var(--accent-crimson)] font-medium">
                      {isMarathi ? `मराठी निबंध 0${idx + 1}` : `Essay 0${idx + 1}`}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{stats.label}</span>
                    </span>
                  </div>
                  <h3
                    className={`${
                      isMarathi
                        ? 'font-marathi-display text-xl sm:text-[22px]'
                        : 'font-serif-editorial text-xl sm:text-[22px]'
                    } text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)] transition-colors leading-snug`}
                  >
                    {post.title}
                  </h3>
                  <p
                    className={`${
                      isMarathi ? 'font-marathi-granth editorial-body-sm' : 'font-sans-body editorial-body-sm'
                    } text-[var(--text-secondary)] line-clamp-3`}
                  >
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs">
                  <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                    {post.publishedAt}
                  </span>
                  <span className="inline-flex items-center gap-1 font-display font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)]">
                    <span>Read essay</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          7. BOTTOM OF THE PAGE: "OKAY, BUT HOW WELL DO YOU ACTUALLY KNOW ME?"
          ===================================================================== */}
      <section
        id="know-me-quiz"
        className="pt-8 border-t border-[var(--border-hairline)]"
      >
        <QuizSection
          archive={archive}
          authorMode={authorMode}
          onNavigate={onNavigate}
          onUpdateArchive={onUpdateArchive}
        />
      </section>
    </div>
  );
};
