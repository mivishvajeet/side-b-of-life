import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Feather,
  BookOpen,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Landmark,
  Scale,
  Building2,
  Newspaper,
  Users,
  ScrollText,
  ArrowRight,
  Compass,
  Sparkles,
  Quote,
} from 'lucide-react';
import { ArchiveData, BlogPost } from '../types/archive';
import { SHARED_AUTHOR_STORIES, SharedAuthorStory } from '../data/sharedStories';
import {
  calculateReadingStats,
  getMarathiFontClass,
  isDevanagariText,
  KindlePaperTheme,
  MarathiFontStyle,
  ReaderLineSpacing,
  renderEditorialMarkdown,
  updateDocumentMeta,
} from '../utils/readingTime';

import {
  MarcusAureliusFaceCutBust,
  StoicAtmosphereMode,
  StoicPhilosophyStudioPanel,
} from './StoicThemeElements';

interface BlogSectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  activePostSlug: string | null;
  stoicThemeActive?: boolean;
  stoicAtmosphere?: StoicAtmosphereMode;
  onChangeStoicAtmosphere?: (mode: StoicAtmosphereMode) => void;
  onToggleStoicTheme?: () => void;
  onSelectPostSlug: (slug: string | null) => void;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
}

const MARATHI_FONT_OPTIONS: Array<{
  id: MarathiFontStyle;
  label: string;
  shortDevanagari: string;
  marathiName: string;
  desc: string;
}> = [
  {
    id: 'granth',
    label: 'Tiro Marathi',
    shortDevanagari: 'ग्रंथ',
    marathiName: 'ग्रंथ · Tiro',
    desc: 'Sahitya Serif',
  },
  {
    id: 'eczar',
    label: 'Eczar Serif',
    shortDevanagari: 'साहित्य',
    marathiName: 'साहित्य · Eczar',
    desc: 'Expressive Serif',
  },
  {
    id: 'mudran',
    label: 'Noto Bookerly',
    shortDevanagari: 'बुकर्ली',
    marathiName: 'बुकर्ली · Noto',
    desc: 'Kindle Book Serif',
  },
  {
    id: 'rozha',
    label: 'Rozha One',
    shortDevanagari: 'मुद्रण',
    marathiName: 'मुद्रण · Rozha',
    desc: 'Editorial Display',
  },
  {
    id: 'yatra',
    label: 'Yatra One',
    shortDevanagari: 'यात्रा',
    marathiName: 'यात्रा · Yatra',
    desc: 'Calligraphic',
  },
  {
    id: 'kalam',
    label: 'Kalam Script',
    shortDevanagari: 'कलम',
    marathiName: 'कलम · Kalam',
    desc: 'Handwritten',
  },
  {
    id: 'mukta',
    label: 'Mukta Clean',
    shortDevanagari: 'मुक्त',
    marathiName: 'मुक्त · Mukta',
    desc: 'Modern Clean',
  },
];

const KINDLE_PAPER_THEMES: Array<{
  id: KindlePaperTheme;
  label: string;
  shortLabel: string;
  marathiLabel: string;
  swatchBg: string;
  swatchBorder: string;
  pageBg: string;
  pageText: string;
  pageMuted: string;
  pageBorder: string;
  accentColor: string;
  chipBg: string;
}> = [
  {
    id: 'sepia',
    label: 'Kindle Sepia',
    shortLabel: 'Sepia',
    marathiLabel: 'सेपिया',
    swatchBg: '#F4EAD5',
    swatchBorder: '#CBB48C',
    pageBg: 'bg-[#F4EAD5]',
    pageText: 'text-[#231911]',
    pageMuted: 'text-[#6E563B]',
    pageBorder: 'border-[#D5C19D]',
    accentColor: 'text-[#8B2E1D]',
    chipBg: 'bg-[#EADBC0]/80',
  },
  {
    id: 'paperwhite',
    label: 'Paperwhite',
    shortLabel: 'Paper',
    marathiLabel: 'पेपरव्हाईट',
    swatchBg: '#F6F5F0',
    swatchBorder: '#CFCBC0',
    pageBg: 'bg-[#F6F5F0]',
    pageText: 'text-[#181818]',
    pageMuted: 'text-[#5C5A54]',
    pageBorder: 'border-[#D8D5CA]',
    accentColor: 'text-[#7A2418]',
    chipBg: 'bg-[#EAE8DF]',
  },
  {
    id: 'sage',
    label: 'Calm Sage',
    shortLabel: 'Sage',
    marathiLabel: 'हिरवा कागद',
    swatchBg: '#E7F0E7',
    swatchBorder: '#B4CAB4',
    pageBg: 'bg-[#E7F0E7]',
    pageText: 'text-[#152419]',
    pageMuted: 'text-[#48634F]',
    pageBorder: 'border-[#C1D5C1]',
    accentColor: 'text-[#1D5436]',
    chipBg: 'bg-[#DAE6DA]',
  },
  {
    id: 'night',
    label: 'Kindle Night',
    shortLabel: 'Night',
    marathiLabel: 'रात्र मोड',
    swatchBg: '#13161B',
    swatchBorder: '#323946',
    pageBg: 'bg-[#13161B]',
    pageText: 'text-[#DEDAD2]',
    pageMuted: 'text-[#8C95A4]',
    pageBorder: 'border-[#272D37]',
    accentColor: 'text-[#E5A95C]',
    chipBg: 'bg-[#1C2027]',
  },
  {
    id: 'default',
    label: 'Studio Default',
    shortLabel: 'Studio',
    marathiLabel: 'मूळ थीम',
    swatchBg: 'var(--bg-surface)',
    swatchBorder: 'var(--border-strong)',
    pageBg: 'bg-[var(--bg-surface)]',
    pageText: 'text-[var(--text-primary)]',
    pageMuted: 'text-[var(--text-secondary)]',
    pageBorder: 'border-[var(--border-hairline)]',
    accentColor: 'text-[var(--accent-crimson)]',
    chipBg: 'bg-[var(--bg-canvas)]',
  },
];

const FONT_SIZE_PRESETS = [
  { label: 'S', px: 18 },
  { label: 'M', px: 20 },
  { label: 'L', px: 23 },
  { label: 'XL', px: 26 },
  { label: 'XXL', px: 30 },
];

const DEMOCRACY_PILLARS = [
  {
    id: 'legislature',
    num: '01',
    title: 'विधिमंडळ · संसद',
    subtitle: 'Legislature & Accountability',
    Icon: Landmark,
    summary:
      'संसद ही केवळ कायदे मंजूर करण्याची जागा नाही; गंभीर सार्वजनिक प्रश्नांवर चर्चा करणे आणि सरकारला उत्तरदायी धरणे ही तिची मुख्य घटनात्मक जबाबदारी आहे.',
  },
  {
    id: 'executive',
    num: '02',
    title: 'कार्यपालिका व प्रशासन',
    subtitle: 'Executive & Constitutional Duty',
    Icon: Building2,
    summary:
      'सरकारी यंत्रणा आणि नोकरशाहीची जबाबदारी केवळ आदेशांचे पालन करण्यापुरती मर्यादित नसते; कायदा, नियम आणि संवैधानिक मूल्यांच्या चौकटीत राहून नागरिकांचे हक्क जपणे हे त्यांचे कर्तव्य आहे.',
  },
  {
    id: 'judiciary',
    num: '03',
    title: 'न्यायपालिका · सर्वोच्च न्यायालय',
    subtitle: 'Judiciary & Rule of Law',
    Icon: Scale,
    summary:
      'घटनात्मक संस्थांच्या अधिकारांशी आणि नागरिकांच्या मूलभूत हक्कांशी संबंधित प्रश्नांची स्वतंत्र तपासणी व स्पष्ट, निष्पक्ष कारणमीमांसा यांवरच कायद्याच्या राज्याचा विश्वास टिकून असतो.',
  },
  {
    id: 'media',
    num: '04',
    title: 'प्रसारमाध्यमे · चौथा स्तंभ',
    subtitle: 'Fourth Estate & Public Scrutiny',
    Icon: Newspaper,
    summary:
      'सत्तेच्या दाव्यांची स्वतंत्र पडताळणी करणे, विरोधकांचे म्हणणे ऐकणे आणि सत्तेला निर्भयपणे प्रश्न विचारणे हा लोकशाहीतील पत्रकारितेचा गाभा आहे.',
  },
  {
    id: 'citizens',
    num: '05',
    title: 'नागरिकांचा आवाज · खरा आधार',
    subtitle: 'Citizens & Constitutional Rights',
    Icon: Users,
    summary:
      'लोकशाही केवळ मतदानाच्या दिवशी अस्तित्वात नसते. अभिव्यक्तिस्वातंत्र्य, शांततापूर्ण आंदोलन आणि सत्तेला प्रश्न विचारणारे जागरूक नागरिक हाच लोकशाहीचा खरा आधारस्तंभ आहे.',
  },
];

export const BlogSection: React.FC<BlogSectionProps> = ({
  archive,
  authorMode = false,
  activePostSlug,
  stoicThemeActive: externalStoicTheme,
  stoicAtmosphere: externalAtmosphere,
  onChangeStoicAtmosphere,
  onToggleStoicTheme,
  onSelectPostSlug,
  onUpdateArchive,
}) => {
  const [internalStoicTheme, setInternalStoicTheme] = useState<boolean>(false);
  const [internalAtmosphere, setInternalAtmosphere] =
    useState<StoicAtmosphereMode>('obsidian');

  const stoicThemeActive =
    externalStoicTheme !== undefined ? externalStoicTheme : internalStoicTheme;
  const stoicAtmosphere =
    externalAtmosphere !== undefined ? externalAtmosphere : internalAtmosphere;

  const handleToggleStoicTheme = () => {
    if (onToggleStoicTheme) {
      onToggleStoicTheme();
    } else {
      setInternalStoicTheme((prev) => !prev);
    }
  };

  const handleChangeAtmosphere = (mode: StoicAtmosphereMode) => {
    if (onChangeStoicAtmosphere) {
      onChangeStoicAtmosphere(mode);
    } else {
      setInternalAtmosphere(mode);
    }
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewFilter, setViewFilter] = useState<'published' | 'drafts' | 'all'>('published');
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Kindle / Book Reader Interactive Controls
  const [marathiFontStyle, setMarathiFontStyle] = useState<MarathiFontStyle>('granth');
  const [kindleTheme, setKindleTheme] = useState<KindlePaperTheme>('sepia');
  const [fontSizePx, setFontSizePx] = useState<number>(20);
  const [lineSpacing, setLineSpacing] = useState<ReaderLineSpacing>('relaxed');
  const [showReaderDrawer, setShowReaderDrawer] = useState<boolean>(true);

  // Featured Marathi Essay Switcher & Interactive Pillar Selector
  const [selectedMarathiShowcaseId, setSelectedMarathiShowcaseId] = useState<string>(
    'post-marathi-lokshahi-stambh'
  );
  const [activePillarId, setActivePillarId] = useState<string>('citizens');

  // Shared Stories by Different Authors State (Foldable 4-Line Preview by Default)
  const [selectedSharedStoryId, setSelectedSharedStoryId] = useState<string>(
    SHARED_AUTHOR_STORIES[0].id
  );
  const [expandSharedStoryInline, setExpandSharedStoryInline] = useState<boolean>(false);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [draftForm, setDraftForm] = useState({
    title: '',
    subtitle: '',
    slug: '',
    category: 'Philosophy' as BlogPost['category'],
    tags: 'Stoicism, Question Everything',
    excerpt: '',
    content: '',
    status: 'published' as BlogPost['status'],
    stoicQuestionRef: '',
  });

  const showSamples = archive.settings.showSampleEntries;

  useEffect(() => {
    if (!activePostSlug) {
      setScrollProgress(0);
      return;
    }
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const ratio = Math.min(1, Math.max(0, scrollTop / docHeight));
      setScrollProgress(ratio);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePostSlug]);

  const allAccessiblePosts = useMemo(
    () =>
      archive.blog.posts.filter(
        (p) => p.id !== 'post-desi-hip-hop-shot' && (showSamples || !p.isSample)
      ),
    [archive.blog.posts, showSamples]
  );

  const activeSharedStoryBySlug = useMemo(
    () => SHARED_AUTHOR_STORIES.find((s) => s.slug === activePostSlug) || null,
    [activePostSlug]
  );

  const activePost = useMemo<BlogPost | null>(() => {
    const found = archive.blog.posts.find((p) => p.slug === activePostSlug);
    if (found) return found;
    if (activeSharedStoryBySlug) {
      return {
        id: activeSharedStoryBySlug.id,
        slug: activeSharedStoryBySlug.slug,
        title: activeSharedStoryBySlug.title,
        subtitle: activeSharedStoryBySlug.subtitle,
        excerpt: activeSharedStoryBySlug.excerpt,
        content: activeSharedStoryBySlug.content,
        category: 'Books',
        tags: [activeSharedStoryBySlug.author, activeSharedStoryBySlug.categoryLabel],
        publishedAt: activeSharedStoryBySlug.dateNote,
        status: 'published',
        stoicQuestionRef: activeSharedStoryBySlug.contextNote,
      };
    }
    return null;
  }, [archive.blog.posts, activePostSlug, activeSharedStoryBySlug]);

  useEffect(() => {
    if (activePost) {
      updateDocumentMeta(
        `${activePost.title} — Question Everything · Vishvajeet Dhawale`,
        activePost.excerpt,
        `/?section=writing&post=${encodeURIComponent(activePost.slug)}`
      );
    } else {
      updateDocumentMeta(
        'Question Everything — Writing by Vishvajeet Dhawale',
        'Essays, Marathi literary & political reflections, working notes, and thoughts on cinema, philosophy, football, and books.',
        '/?section=writing'
      );
    }
  }, [activePost]);

  const filteredPosts = useMemo(() => {
    return allAccessiblePosts.filter((post) => {
      if (!authorMode && post.status !== 'published') return false;
      if (authorMode && viewFilter === 'published' && post.status !== 'published') return false;
      if (authorMode && viewFilter === 'drafts' && post.status !== 'draft') return false;
      if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(q);
        const inExcerpt = post.excerpt.toLowerCase().includes(q);
        const inContent = post.content.toLowerCase().includes(q);
        const inTags = post.tags.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inExcerpt && !inContent && !inTags) return false;
      }
      return true;
    });
  }, [allAccessiblePosts, authorMode, viewFilter, selectedCategory, searchQuery]);

  const marathiPosts = useMemo(
    () => allAccessiblePosts.filter((p) => isDevanagariText(p.title)),
    [allAccessiblePosts]
  );

  const activeFeaturedMarathiPost = useMemo(
    () =>
      marathiPosts.find((p) => p.id === selectedMarathiShowcaseId) ||
      marathiPosts[0] ||
      null,
    [marathiPosts, selectedMarathiShowcaseId]
  );

  const relatedPosts = useMemo(() => {
    if (!activePost) return [];
    return allAccessiblePosts
      .filter((p) => p.id !== activePost.id && p.status === 'published')
      .slice(0, 2);
  }, [allAccessiblePosts, activePost]);

  const startNewDraft = (stoicPrompt?: string) => {
    setEditingPostId(null);
    setDraftForm({
      title: stoicPrompt || '',
      subtitle: '',
      slug: stoicPrompt
        ? stoicPrompt
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : '',
      category: stoicPrompt ? 'Philosophy' : 'Observations',
      tags: stoicPrompt ? 'Stoicism, Question Everything' : 'Observations',
      excerpt: '',
      content: stoicPrompt
        ? `### Starting with the question\n\n> "${stoicPrompt}"\n\nWrite your thoughts here in Markdown...`
        : '',
      status: 'draft',
      stoicQuestionRef: stoicPrompt || '',
    });
    setPreviewMode(false);
    setEditorOpen(true);
    onSelectPostSlug(null);
  };

  const startEditingPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setDraftForm({
      title: post.title,
      subtitle: post.subtitle || '',
      slug: post.slug,
      category: post.category,
      tags: post.tags.join(', '),
      excerpt: post.excerpt,
      content: post.content,
      status: post.status,
      stoicQuestionRef: post.stoicQuestionRef || '',
    });
    setPreviewMode(false);
    setEditorOpen(true);
  };

  const handleSavePost = (targetStatus: 'draft' | 'published') => {
    if (!draftForm.title.trim() || !draftForm.content.trim()) return;
    const computedSlug =
      draftForm.slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/(^-|-$)/g, '') || `note-${Date.now()}`;

    const computedExcerpt =
      draftForm.excerpt.trim() ||
      draftForm.content
        .replace(/[#>*_`~-]/g, '')
        .trim()
        .slice(0, 180) + '...';

    const entry: BlogPost = {
      id: editingPostId || `post-${Date.now()}`,
      slug: computedSlug,
      title: draftForm.title.trim(),
      subtitle: draftForm.subtitle.trim() || undefined,
      excerpt: computedExcerpt,
      content: draftForm.content.trim(),
      category: draftForm.category,
      tags: draftForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      publishedAt: new Date().toISOString().slice(0, 10),
      status: targetStatus,
      stoicQuestionRef: draftForm.stoicQuestionRef.trim() || undefined,
      isSample: false,
    };

    onUpdateArchive((prev) => {
      const exists = prev.blog.posts.some((p) => p.id === entry.id);
      const nextPosts = exists
        ? prev.blog.posts.map((p) => (p.id === entry.id ? entry : p))
        : [entry, ...prev.blog.posts];
      return {
        ...prev,
        blog: {
          ...prev.blog,
          posts: nextPosts,
        },
      };
    });

    setEditorOpen(false);
    if (targetStatus === 'published') {
      onSelectPostSlug(entry.slug);
    } else {
      setViewFilter('drafts');
    }
  };

  const handleDeletePost = (id: string) => {
    onUpdateArchive((prev) => ({
      ...prev,
      blog: {
        ...prev.blog,
        posts: prev.blog.posts.filter((p) => p.id !== id),
      },
    }));
    onSelectPostSlug(null);
  };

  const handleCopyShareLink = (slug: string) => {
    const url = `${window.location.origin}/?section=writing&post=${encodeURIComponent(slug)}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const activeFontClass = getMarathiFontClass(marathiFontStyle);
  const marathiTitleFontClass =
    marathiFontStyle === 'yatra'
      ? 'font-marathi-yatra'
      : marathiFontStyle === 'kalam'
      ? 'font-marathi-kalam'
      : marathiFontStyle === 'eczar'
      ? 'font-marathi-eczar font-semibold'
      : marathiFontStyle === 'mukta'
      ? 'font-marathi-mukta font-bold'
      : 'font-marathi-display';

  const activeKindlePaper =
    KINDLE_PAPER_THEMES.find((t) => t.id === kindleTheme) || KINDLE_PAPER_THEMES[0];

  const activePillar =
    DEMOCRACY_PILLARS.find((p) => p.id === activePillarId) || DEMOCRACY_PILLARS[4];

  // =========================================================================
  // REUSABLE INTERACTIVE "PILLARS OF DEMOCRACY" ANIMATED EXPLORER
  // =========================================================================
  const renderDemocracyPillarsExplorer = (insideBookPage: boolean) => (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`rounded-xl border p-3.5 sm:p-4 space-y-3 ${
        insideBookPage
          ? `border-current/20 ${activeKindlePaper.chipBg}`
          : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-current/15 pb-2">
        <div className="flex items-center gap-1.5">
          <Scale className={`w-3.5 h-3.5 ${activeKindlePaper.accentColor}`} />
          <span
            className={`font-mono-meta text-[10px] tracking-wider font-semibold ${activeKindlePaper.accentColor}`}
          >
            लोकशाहीचे स्तंभ व नागरिक · Interactive Constitutional Pillars
          </span>
        </div>
        <span className="font-mono-meta text-[9px] opacity-70">Tap any pillar</span>
      </div>

      {/* 5 Animated Pillar Tabs */}
      <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
        {DEMOCRACY_PILLARS.map((pillar) => {
          const IconComponent = pillar.Icon;
          const isSelected = activePillarId === pillar.id;
          return (
            <motion.button
              key={pillar.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActivePillarId(pillar.id)}
              className={`py-2 px-1.5 rounded-lg border text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                isSelected
                  ? 'bg-[#8B2E1D] text-[#FAF3E6] border-[#8B2E1D] shadow-2xs'
                  : 'border-current/15 hover:border-current/35 opacity-85 hover:opacity-100'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="font-marathi-granth text-[11px] sm:text-xs leading-tight truncate max-w-full">
                {pillar.title.split(' · ')[0]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Animated Detail Box for Selected Pillar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePillar.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.18 }}
          className="pt-1 space-y-1"
        >
          <div className="flex items-center justify-between font-mono-meta text-[10px]">
            <span className={`font-semibold ${activeKindlePaper.accentColor}`}>
              {activePillar.num}. {activePillar.title}
            </span>
            <span className="opacity-70">{activePillar.subtitle}</span>
          </div>
          <p className={`${activeFontClass} editorial-body-sm opacity-95`}>
            {activePillar.summary}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // =========================================================================
  // REUSABLE ALL-DEVICE COMPACT KINDLE CONTROL DOCK
  // Shows ALL 5 Paper Themes, Font Size (A-/A+ & Presets), Line Spacing & ALL 7 Marathi Fonts
  // =========================================================================
  const renderKindleControlDock = (isFullReader: boolean) => (
    <div className="p-3 sm:p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] tactile-card-shadow space-y-3">
      {/* Row 1: Paper Themes (5) + Text Size (A-/A+/Presets) + Line Spacing (3) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 md:gap-4 items-center">
        {/* 1. 5 Paper Themes — Single compact 5-column row on mobile */}
        <div className="md:col-span-5 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-mono-meta text-[10px] text-[var(--text-secondary)]">
              01. Paper Theme · कागद रंग
            </span>
            <span className="font-mono-meta text-[10px] text-[var(--accent-crimson)]">
              {activeKindlePaper.label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {KINDLE_PAPER_THEMES.map((t) => {
              const isSelected = kindleTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setKindleTheme(t.id)}
                  className={`py-1.5 px-1 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'ring-1.5 ring-[var(--accent-crimson)] border-[var(--accent-crimson)] bg-[var(--bg-canvas)] font-medium'
                      : 'border-[var(--border-hairline)] hover:border-[var(--border-strong)] opacity-85 hover:opacity-100'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border shrink-0"
                    style={{
                      backgroundColor: t.swatchBg,
                      borderColor: t.swatchBorder,
                    }}
                  />
                  <span className="font-mono-meta text-[10px] text-[var(--text-primary)] truncate">
                    {t.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Font Size Stepper + Presets */}
        <div className="md:col-span-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-mono-meta text-[10px] text-[var(--text-secondary)]">
              02. Text Size · अक्षर आकार
            </span>
            <span className="font-mono-meta text-[10px] font-semibold text-[var(--accent-crimson)] tabular-nums">
              {fontSizePx}px
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFontSizePx((prev) => Math.max(16, prev - 1))}
              className="h-8 px-2.5 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)] text-[var(--text-primary)] font-mono-meta text-xs cursor-pointer shrink-0 flex items-center justify-center"
              aria-label="Decrease font size"
            >
              A-
            </button>

            <div className="flex-1 grid grid-cols-5 gap-1">
              {FONT_SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFontSizePx(preset.px)}
                  className={`h-8 rounded-lg font-mono-meta text-[10px] border transition-colors cursor-pointer ${
                    fontSizePx === preset.px
                      ? 'bg-[var(--accent-crimson)] text-white border-[var(--accent-crimson)] font-semibold'
                      : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setFontSizePx((prev) => Math.min(34, prev + 1))}
              className="h-8 px-2.5 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)] text-[var(--text-primary)] font-mono-meta text-xs font-semibold cursor-pointer shrink-0 flex items-center justify-center"
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>
        </div>

        {/* 3. Line Spacing */}
        <div className="md:col-span-3 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-mono-meta text-[10px] text-[var(--text-secondary)]">
              03. Line Spacing · अंतर
            </span>
            <span className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {lineSpacing}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(
              [
                { id: 'compact', label: '1.7x जवळ' },
                { id: 'relaxed', label: '1.9x सहज' },
                { id: 'spacious', label: '2.2x मोकळे' },
              ] as const
            ).map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => setLineSpacing(sp.id)}
                className={`h-8 px-1.5 rounded-lg font-mono-meta text-[10px] border transition-colors cursor-pointer truncate ${
                  lineSpacing === sp.id
                    ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)] font-medium'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: All 7 Selectable Marathi Fonts Visible Together in Compact Grid */}
      <div className="pt-2.5 border-t border-[var(--border-hairline)] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-mono-meta text-[10px] text-[var(--text-secondary)]">
            04. Marathi Typography · ७ मराठी अक्षरशैली निवडा
          </span>
          {isFullReader && (
            <span className="font-mono-meta text-[10px] text-[var(--text-muted)] hidden sm:inline">
              Active: {MARATHI_FONT_OPTIONS.find((f) => f.id === marathiFontStyle)?.label}
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
          {MARATHI_FONT_OPTIONS.map((font) => {
            const isSelected = marathiFontStyle === font.id;
            const previewClass = getMarathiFontClass(font.id);
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => setMarathiFontStyle(font.id)}
                className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-[var(--accent-crimson)] text-white border-[var(--accent-crimson)] shadow-2xs'
                    : 'bg-[var(--bg-canvas)]/80 text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                }`}
              >
                <span className={`${previewClass} text-sm sm:text-base leading-tight truncate max-w-full`}>
                  {font.shortDevanagari}
                </span>
                <span
                  className={`font-mono-meta text-[9px] leading-none truncate max-w-full ${
                    isSelected ? 'text-white/90' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {font.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // 1. INDIVIDUAL ARTICLE PAGE VIEW — KINDLE E-READER & MARATHI BOOK MODE
  // =========================================================================
  if (activePost && !editorOpen) {
    const stats = calculateReadingStats(activePost.content);
    const isMarathiArticle =
      isDevanagariText(activePost.title) || isDevanagariText(activePost.content);
    const isDemocracyArticle =
      activePost.id === 'post-marathi-lokshahi-stambh' ||
      activePost.slug === 'lokshahiche-stambh-ani-sattecha-khara-aadharstambh';

    const totalLocations = Math.max(12, Math.ceil(stats.words / 25));
    const currentLocation = Math.max(
      1,
      Math.min(totalLocations, Math.round(scrollProgress * totalLocations) || 1)
    );

    const titleMinPx = Math.max(22, Math.round(fontSizePx * 1.25));
    const titleMaxPx = Math.round(fontSizePx * 1.75);
    const subMinPx = Math.max(14, Math.round(fontSizePx * 0.92));
    const subMaxPx = Math.round(fontSizePx * 1.12);

    return (
      <article className="film-cut-enter space-y-4 sm:space-y-6">
        {/* Top Reading Progress Indicator */}
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent pointer-events-none"
        >
          <div
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            className="h-full bg-gradient-to-r from-[#8b0000] to-[#c87d32] transition-[width] duration-100"
          />
        </div>

        {/* Sticky/Compact Top Navigation & Kindle Aa Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-hairline)] pb-3 text-xs font-mono-meta">
          <button
            type="button"
            onClick={() => onSelectPostSlug(null)}
            className="inline-flex items-center gap-1.5 py-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-crimson)] transition-colors cursor-pointer"
          >
            <span>← सर्व निबंध (Back to Writing)</span>
          </button>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Quick Switcher between Marathi Essays */}
            {isMarathiArticle && marathiPosts.length > 1 && (
              <div className="hidden md:inline-flex items-center gap-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-0.5">
                {marathiPosts.map((mp, idx) => (
                  <button
                    key={mp.id}
                    type="button"
                    onClick={() => {
                      onSelectPostSlug(mp.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-2.5 py-1 rounded-lg font-marathi-granth text-xs transition-colors cursor-pointer ${
                      mp.id === activePost.id
                        ? 'bg-[var(--accent-crimson)] text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    0{idx + 1}. {mp.title.slice(0, 18)}…
                  </button>
                ))}
              </div>
            )}

            {/* Toggle Kindle Aa Typography & Theme Dock */}
            <button
              type="button"
              onClick={() => setShowReaderDrawer(!showReaderDrawer)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono-meta text-xs border transition-all cursor-pointer ${
                showReaderDrawer
                  ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)] font-medium'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--accent-crimson)]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Aa Reader</span>
              {showReaderDrawer ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Quick A- / A+ Buttons right on top bar */}
            <div className="inline-flex items-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-0.5">
              <button
                type="button"
                onClick={() => setFontSizePx((prev) => Math.max(16, prev - 2))}
                className="px-2 py-1 rounded-lg hover:bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono-meta text-xs cursor-pointer"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="px-1.5 text-[11px] text-[var(--text-muted)] tabular-nums">
                {fontSizePx}
              </span>
              <button
                type="button"
                onClick={() => setFontSizePx((prev) => Math.min(34, prev + 2))}
                className="px-2 py-1 rounded-lg hover:bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono-meta text-xs font-semibold cursor-pointer"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleCopyShareLink(activePost.slug)}
              className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--accent-crimson)] transition-colors cursor-pointer"
            >
              {copiedUrl ? 'Copied ✓' : 'Share ↗'}
            </button>

            {authorMode && (
              <>
                <button
                  type="button"
                  onClick={() => startEditingPost(activePost)}
                  className="px-2 py-1 text-[var(--accent-crimson)] hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePost(activePost.id)}
                  className="px-2 py-1 text-[var(--accent-crimson)] hover:underline"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Compact All-Device Kindle Reader Controls */}
        {showReaderDrawer && renderKindleControlDock(true)}

        {/* =====================================================================
            KINDLE BOOK PAGE SHEET + RESPONSIVE SIDEBAR
            ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Kindle Book Page Sheet (First on Mobile/Tablet, 9 Cols on Desktop) */}
          <motion.div
            key={`${activePost.id}-${kindleTheme}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-9 order-1 lg:order-2"
          >
            <div
              className={`rounded-2xl sm:rounded-3xl border px-4 sm:px-9 md:px-14 py-5 sm:py-9 md:py-12 transition-colors duration-300 shadow-[0_14px_40px_rgba(0,0,0,0.09)] ${activeKindlePaper.pageBg} ${activeKindlePaper.pageText} ${activeKindlePaper.pageBorder}`}
            >
              {/* Kindle Top Running Book Header */}
              <div
                className={`flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono-meta pb-3.5 sm:pb-5 mb-5 sm:mb-7 border-b border-current/15 ${activeKindlePaper.pageMuted}`}
              >
                <span className="truncate flex items-center gap-1.5">
                  {isDemocracyArticle ? (
                    <Landmark className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>
                    {activeSharedStoryBySlug
                      ? `${activeSharedStoryBySlug.categoryLabel} · मूळ लेखक: ${activeSharedStoryBySlug.author}`
                      : isDemocracyArticle
                      ? 'लोकशाही आणि संविधान चिंतन · विश्वजीत ढवळे'
                      : isMarathiArticle
                      ? 'मराठी साहित्य निबंध · विश्वजीत ढवळे'
                      : `${activePost.category} · विश्वजीत ढवळे`}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums">
                  {activeKindlePaper.shortLabel} · {fontSizePx}px
                </span>
              </div>

              {/* Essay Title & Subtitle inside Book Page */}
              <header className="space-y-3 border-b border-current/15 pb-5 sm:pb-7 mb-6 sm:mb-8">
                <div
                  className={`flex flex-wrap items-center gap-2 font-mono-meta text-[10px] sm:text-[11px] ${activeKindlePaper.accentColor}`}
                >
                  {isDemocracyArticle ? (
                    <Scale className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Feather className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>
                    {activeSharedStoryBySlug
                      ? `मूळ लेखक: ${activeSharedStoryBySlug.author}`
                      : isDemocracyArticle
                      ? 'राज्यसंस्था, संविधान आणि नागरिकांचे अधिकार · विश्वजीत ढवळे'
                      : isMarathiArticle
                      ? 'मराठी साहित्य आणि समाज · विश्वजीत ढवळे'
                      : `${activePost.category} · ${activePost.publishedAt}`}
                  </span>
                  <span>·</span>
                  <span>{stats.label}</span>
                </div>

                <h1
                  style={{
                    fontSize: `clamp(${titleMinPx}px, calc(${titleMinPx}px + 1.4vw), ${titleMaxPx}px)`,
                  }}
                  className={
                    isMarathiArticle
                      ? `${marathiTitleFontClass} font-normal leading-[1.24] tracking-normal text-balance`
                      : 'font-display font-medium tracking-tight leading-[1.14] text-balance'
                  }
                >
                  {activePost.title}
                </h1>

                {activePost.subtitle && (
                  <p
                    style={{
                      fontSize: `clamp(${subMinPx}px, calc(${subMinPx}px + 0.6vw), ${subMaxPx}px)`,
                    }}
                    className={`${
                      isMarathiArticle ? activeFontClass : 'font-literary italic'
                    } ${activeKindlePaper.pageMuted} leading-relaxed`}
                  >
                    {activePost.subtitle}
                  </p>
                )}

                {/* Interactive Pillars of Democracy Explorer inside the Democracy Essay */}
                {isDemocracyArticle && (
                  <div className="pt-3">{renderDemocracyPillarsExplorer(true)}</div>
                )}
              </header>

              {/* Essay Body Rendered with Selected Marathi Font, Dynamic Size & Kindle Theme */}
              <div>
                {renderEditorialMarkdown(activePost.content, {
                  marathiFontStyle,
                  fontSizePx,
                  lineSpacing,
                  kindleTheme,
                })}
              </div>

              {/* Kindle Bottom E-Reader Status Footer */}
              <div
                className={`mt-8 sm:mt-12 pt-4 border-t border-current/15 flex flex-wrap items-center justify-between gap-2 font-mono-meta text-[10px] sm:text-[11px] tabular-nums ${activeKindlePaper.pageMuted}`}
              >
                <span>
                  Loc {currentLocation} of {totalLocations} · {stats.words} words
                </span>
                <span>
                  {MARATHI_FONT_OPTIONS.find((f) => f.id === marathiFontStyle)?.marathiName} (
                  {fontSizePx}px)
                </span>
                <span>{Math.max(1, Math.round(scrollProgress * 100))}% read</span>
              </div>
            </div>
          </motion.div>

          {/* Left Margin Metadata & Contextual Themes (Compact Grid on Mobile/Tablet, Sticky Sidebar on Desktop) */}
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24 order-2 lg:order-1">
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] font-mono-meta text-xs space-y-1.5">
              <div className="text-[var(--accent-crimson)] flex items-center gap-1.5">
                {isDemocracyArticle ? (
                  <Landmark className="w-3.5 h-3.5" />
                ) : (
                  <BookOpen className="w-3.5 h-3.5" />
                )}
                <span>
                  {activeSharedStoryBySlug
                    ? activeSharedStoryBySlug.categoryLabel
                    : isDemocracyArticle
                    ? 'लोकशाही व संविधान चिंतन'
                    : isMarathiArticle
                    ? 'मराठी साहित्य चिंतन'
                    : activePost.category}
                </span>
              </div>
              <div className="text-[var(--text-primary)] font-medium">
                {activeSharedStoryBySlug
                  ? `मूळ लेखक: ${activeSharedStoryBySlug.author}`
                  : 'लेखक: विश्वजीत ढवळे'}
              </div>
              <div className="text-[var(--text-secondary)]">
                {activePost.publishedAt} · {stats.label} ({stats.words} शब्द)
              </div>
            </div>

            {activePost.stoicQuestionRef && (
              <div className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] space-y-1.5">
                <div className="font-mono-meta text-[10px] tracking-wider text-[var(--accent-crimson)]">
                  {activeSharedStoryBySlug
                    ? 'कथेचा संदर्भ · Editorial Note'
                    : isMarathiArticle
                    ? 'कळीचा प्रश्न · Core Question'
                    : 'Prompt Examined'}
                </div>
                <p
                  className={`${
                    isMarathiArticle ? activeFontClass : 'font-literary italic'
                  } text-sm sm:text-base text-[var(--text-primary)] leading-relaxed`}
                >
                  “{activePost.stoicQuestionRef}”
                </p>
              </div>
            )}

            {isDemocracyArticle ? (
              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-2">
                <div className="font-mono-meta text-[10px] tracking-wider text-[var(--accent-olive)]">
                  निबंधातील कळीचे मुद्दे · Key Pillars
                </div>
                <ul className="font-marathi-granth text-xs sm:text-sm text-[var(--text-secondary)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 leading-snug">
                  <li>• अधिकार विभाजन: विधिमंडळ, कार्यपालिका व न्यायपालिका</li>
                  <li>• निवडणूक प्रक्रियेची निष्पक्षता व विश्वासार्हता</li>
                  <li>• शांततापूर्ण आंदोलनाचा संवैधानिक अधिकार</li>
                  <li>• सर्वोच्च न्यायालयाची स्वायत्तता व कायद्याचे राज्य</li>
                  <li>• प्रसारमाध्यमे (चौथा स्तंभ) व सत्तेची चिकित्सा</li>
                  <li>• नोकरशाहीची संवैधानिक जबाबदारी</li>
                  <li>• नागरिकांचा विश्वास हाच सत्तेचा खरा आधारस्तंभ</li>
                </ul>
              </div>
            ) : (
              isMarathiArticle && !activeSharedStoryBySlug && (
                <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-2">
                  <div className="font-mono-meta text-[10px] tracking-wider text-[var(--accent-olive)]">
                    निबंधातील संदर्भ · Referenced Works
                  </div>
                  <ul className="font-marathi-granth text-xs sm:text-sm text-[var(--text-secondary)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 leading-snug">
                    <li>• जेव्हा मी जात चोरली होती — बाबुराव बागुल</li>
                    <li>• बलुतं — दया पवार</li>
                    <li>• उपरा — लक्ष्मण माने</li>
                    <li>• उचल्या — लक्ष्मण गायकवाड</li>
                    <li>• गोलपीठा — नामदेव ढसाळ</li>
                    <li>• माझ्या जल्माची चित्तरकथा — शांताबाई कांबळे</li>
                    <li>• जिणं आमुचं — बेबी कांबळे</li>
                    <li>• अक्करमाशी — शरणकुमार लिंबाळे</li>
                  </ul>
                </div>
              )
            )}
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="pt-8 border-t border-[var(--border-hairline)] grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 font-mono-meta text-xs text-[var(--accent-olive)]">
              Continue Reading
            </div>
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectPostSlug(rel.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer space-y-1.5 p-4 rounded-xl border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)] transition-colors"
                >
                  <div className="font-mono-meta text-xs text-[var(--text-muted)]">
                    {rel.category} · {rel.publishedAt}
                  </div>
                  <h3
                    className={`${
                      isDevanagariText(rel.title)
                        ? `${marathiTitleFontClass} text-xl`
                        : 'font-serif-editorial text-lg sm:text-xl'
                    } text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)] transition-colors`}
                  >
                    {rel.title} →
                  </h3>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    );
  }

  // =========================================================================
  // 2. MARKDOWN WRITING STUDIO (AUTHOR MODE)
  // =========================================================================
  if (authorMode && editorOpen) {
    const liveStats = calculateReadingStats(draftForm.content);
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-4">
          <div>
            <div className="font-mono-meta text-xs text-[var(--accent-crimson)]">
              Question Everything · Studio
            </div>
            <h1 className="font-serif-editorial text-2xl sm:text-3xl text-[var(--text-primary)]">
              {editingPostId ? 'Edit Essay / Working Note' : 'New Essay / Working Note'}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono-meta">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-1.5 border border-[var(--border-strong)] text-[var(--text-primary)]"
            >
              {previewMode ? 'Edit Markdown' : 'Preview'}
            </button>
            <button
              type="button"
              onClick={() => setEditorOpen(false)}
              className="px-3 py-1.5 text-[var(--text-secondary)]"
            >
              Cancel
            </button>
          </div>
        </div>

        {previewMode ? (
          <div className="p-6 sm:p-8 diner-booth-panel space-y-6">
            <div className="font-mono-meta text-xs text-[var(--accent-crimson)]">
              Preview · {liveStats.label}
            </div>
            <h2 className="font-marathi-display text-3xl sm:text-4xl text-[var(--text-primary)]">
              {draftForm.title || 'Untitled Note'}
            </h2>
            <div>
              {renderEditorialMarkdown(draftForm.content, {
                marathiFontStyle,
                fontSizePx,
                lineSpacing,
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Title *</label>
                <input
                  type="text"
                  value={draftForm.title}
                  onChange={(e) => setDraftForm({ ...draftForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-hairline)]"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Category
                </label>
                <select
                  value={draftForm.category}
                  onChange={(e) =>
                    setDraftForm({
                      ...draftForm,
                      category: e.target.value as BlogPost['category'],
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-hairline)]"
                >
                  <option value="Cinema">Cinema</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Football">Football</option>
                  <option value="Books">Books</option>
                  <option value="Technology">Technology</option>
                  <option value="Observations">Observations</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1">
                Content (Markdown) *
              </label>
              <textarea
                rows={14}
                value={draftForm.content}
                onChange={(e) => setDraftForm({ ...draftForm, content: e.target.value })}
                className="w-full px-4 py-3 text-sm font-mono-meta bg-[var(--bg-surface)] border border-[var(--border-hairline)] leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSavePost('published')}
                className="px-4 py-2 text-xs font-medium bg-[var(--accent-crimson)] text-white rounded-lg"
              >
                Publish Essay
              </button>
              <button
                type="button"
                onClick={() => handleSavePost('draft')}
                className="px-4 py-2 text-xs font-mono-meta border border-[var(--border-strong)] text-[var(--text-primary)] rounded-lg"
              >
                Save as Draft
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. MAIN WRITING & PHILOSOPHY PAGE — STOIC MANIFESTO + FEATURED ESSAYS
  // =========================================================================
  const categories = ['All', 'Books', 'Philosophy', 'Cinema', 'Football', 'Observations'];

  const previewTitleMin = Math.max(20, Math.round(fontSizePx * 1.15));
  const previewTitleMax = Math.round(fontSizePx * 1.55);
  const previewBodyMin = Math.max(15, Math.round(fontSizePx * 0.85));
  const isSelectedDemocracy =
    activeFeaturedMarathiPost?.id === 'post-marathi-lokshahi-stambh';

  return (
    <div className="space-y-10 sm:space-y-14 transition-all duration-300">
      {/* =====================================================================
          00 / OPENING PHILOSOPHY MANIFESTO — "A WAY OF SEEING THINGS."
          ===================================================================== */}
      <article
        aria-labelledby="philosophy-opening-heading"
        className="space-y-9 sm:space-y-12 border-b border-[var(--border-hairline)] pb-10 sm:pb-14"
      >
        {/* 1. Hero & Personal Introduction + Marcus Aurelius Face-Cut Relief */}
        <header className="space-y-6 border-b border-[var(--border-hairline)] pb-7 sm:pb-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-crimson)]">
              <Compass className="w-3.5 h-3.5" />
              <span>04 · Philosophy · Stoic Notes</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Interactive Marcus Aurelius / Stoic Theme Toggle */}
              <button
                type="button"
                onClick={handleToggleStoicTheme}
                className={`min-h-[38px] inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono-meta text-xs border transition-all cursor-pointer ${
                  stoicThemeActive
                    ? stoicAtmosphere === 'obsidian'
                      ? 'bg-[#D4AF37] text-[#141210] border-[#D4AF37] shadow-xs font-semibold'
                      : 'bg-[#7C2D26] text-[#F8F4EC] border-[#7C2D26] shadow-xs font-medium'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--accent-crimson)]'
                }`}
              >
                <Landmark className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {stoicThemeActive
                    ? 'Marcus Aurelius · Stoic Theme: ON'
                    : 'Toggle Marcus Aurelius · Stoic Theme'}
                </span>
              </button>

              {authorMode && (
                <button
                  type="button"
                  onClick={() => startNewDraft()}
                  className="px-3.5 py-2 rounded-lg text-xs font-mono-meta bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium shrink-0 cursor-pointer"
                >
                  + Write Essay / Note
                </button>
              )}
            </div>
          </div>

          {/* 12-Column Opening Hero: Left 7 Cols Manifesto + Right 5 Cols Marcus Aurelius Face-Cut Medallion */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h1
                id="philosophy-opening-heading"
                className="font-serif-editorial editorial-hero-display font-normal text-[var(--text-primary)]"
              >
                A way of seeing things.
              </h1>

              <div className="space-y-4 font-sans-body editorial-body text-[var(--text-secondary)]">
                <p className="font-serif-editorial editorial-lead text-[var(--text-primary)]">
                  I follow Stoicism. Or at least, I try to.
                </p>
                <p>
                  I'm not particularly good at staying calm, accepting things as they are, or knowing when to let go. I overthink, get frustrated, take things personally, and occasionally spend far too much time worrying about things that haven't even happened.
                </p>
                <p className="text-[var(--text-primary)] font-medium">
                  But that's partly why I keep coming back to Stoicism.
                </p>
                <p>
                  It reminds me that I don't have to react to everything, that not every thought deserves my attention, and that I can choose how I respond even when I can't choose what happens to me.
                </p>
                <p className="font-literary italic text-[var(--text-primary)]">
                  I'm still learning. Probably always will be.
                </p>
              </div>
            </div>

            {/* Right 5 Cols: Marcus Aurelius Face-Cut Portrait Card */}
            <div className="lg:col-span-5">
              <div
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col items-center text-center space-y-3.5 transition-all ${
                  stoicThemeActive && stoicAtmosphere === 'obsidian'
                    ? 'bg-gradient-to-b from-[#1B1814] to-[#110F0D] border-[#D4AF37]/40 text-[#EDE5D5] shadow-[0_18px_40px_rgba(0,0,0,0.45)]'
                    : stoicThemeActive
                    ? 'bg-gradient-to-b from-[#FAF5EB] to-[#EAE0CE] border-[#7C2D26]/35 text-[#1A1614] shadow-sm'
                    : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-primary)]'
                }`}
              >
                <div className="w-full flex items-center justify-between font-mono-meta text-[10px] uppercase tracking-widest opacity-75">
                  <span>Μ·ΑΥΡΗΛΙΟΣ</span>
                  <span>Face-Cut Relief · IV.3</span>
                </div>

                <MarcusAureliusFaceCutBust
                  atmosphere={
                    stoicThemeActive ? stoicAtmosphere : 'obsidian'
                  }
                  interactiveSlice={true}
                  className="w-48 h-56 sm:w-52 sm:h-60"
                />

                <blockquote className="font-literary italic text-xs sm:text-sm leading-relaxed max-w-xs opacity-90">
                  “Nowhere can man find a quieter or more untroubled retreat than in his own soul.”
                </blockquote>

                <div className="w-full pt-2 border-t border-current/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-meta">
                  <span className="opacity-75">Stoic Atmosphere:</span>
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!stoicThemeActive) handleToggleStoicTheme();
                        handleChangeAtmosphere('marble');
                      }}
                      className={`px-2 py-1 rounded border cursor-pointer transition-all ${
                        stoicThemeActive && stoicAtmosphere === 'marble'
                          ? 'bg-[#7C2D26] text-white border-[#7C2D26] font-semibold'
                          : 'border-current/20 opacity-80 hover:opacity-100'
                      }`}
                    >
                      Marble
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!stoicThemeActive) handleToggleStoicTheme();
                        handleChangeAtmosphere('obsidian');
                      }}
                      className={`px-2 py-1 rounded border cursor-pointer transition-all ${
                        stoicThemeActive && stoicAtmosphere === 'obsidian'
                          ? 'bg-[#D4AF37] text-[#141210] border-[#D4AF37] font-semibold'
                          : 'border-current/20 opacity-80 hover:opacity-100'
                      }`}
                    >
                      Obsidian &amp; Gold
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Stoic Philosophy Studio (Full Face-Cut Inspector, 4 Cardinal Virtues & Dichotomy of Control) */}
          <StoicPhilosophyStudioPanel
            stoicThemeActive={stoicThemeActive}
            atmosphere={stoicAtmosphere}
            onToggleStoicTheme={handleToggleStoicTheme}
            onChangeAtmosphere={handleChangeAtmosphere}
          />
        </header>

        {/* 2. So, what is Stoicism? */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start border-b border-[var(--border-hairline)] pb-8 sm:pb-10">
          <div className="lg:col-span-4 space-y-1.5">
            <div className="font-mono-meta text-[10px] uppercase tracking-widest text-[var(--accent-crimson)]">
              The Foundation
            </div>
            <h2 className="font-serif-editorial editorial-section-heading text-[var(--text-primary)]">
              So, what is Stoicism?
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-4 font-sans-body editorial-body text-[var(--text-secondary)] max-w-3xl">
            <p>
              Stoicism is an ancient Greek philosophy that began in Athens around the third century BCE. It was later developed by Roman thinkers like Seneca, Epictetus, and Marcus Aurelius.
            </p>
            <p>
              At its heart, Stoicism is about learning to live well. Not by controlling everything around you, chasing constant happiness, or pretending nothing bothers you, but by paying attention to what is actually within your control.
            </p>
            <p className="font-serif-editorial editorial-quote text-[var(--text-primary)] py-1 border-l-2 border-[var(--accent-crimson)] pl-4">
              Your choices. Your actions. Your judgments. The kind of person you decide to be.
            </p>
            <p>
              A lot of life isn't up to us. Other people's opinions, unexpected failures, bad luck, the past, and sometimes even the outcomes of our best efforts.
            </p>
            <p className="text-[var(--text-primary)]">
              Stoicism asks a simple question: if you can't control the outcome, what can you do with the part that is yours to control?
            </p>
            <p className="font-literary italic text-[var(--text-primary)]">
              It's a simple idea. Living by it is another matter entirely.
            </p>
          </div>
        </section>

        {/* 3. The things I keep coming back to (01 - 05) */}
        <section className="space-y-6 border-b border-[var(--border-hairline)] pb-8 sm:pb-10">
          <div className="space-y-1">
            <div className="font-mono-meta text-[10px] uppercase tracking-widest text-[var(--accent-crimson)]">
              Five Anchors
            </div>
            <h2 className="font-serif-editorial editorial-section-heading text-[var(--text-primary)]">
              The things I keep coming back to.
            </h2>
          </div>

          <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
            {/* 01 */}
            <div className="py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8 items-start">
              <div className="lg:col-span-4 flex items-baseline gap-2.5">
                <span className="font-mono-meta text-xs text-[var(--accent-crimson)] font-semibold shrink-0">
                  01.
                </span>
                <h3 className="font-serif-editorial editorial-card-heading text-[var(--text-primary)]">
                  Control what you can. Let the rest be.
                </h3>
              </div>
              <div className="lg:col-span-8 space-y-3 font-sans-body editorial-body text-[var(--text-secondary)] max-w-3xl">
                <p>
                  I can't control how people see me, whether things go according to plan, or how the world decides to behave today.
                </p>
                <p className="text-[var(--text-primary)]">
                  I can control how I prepare, how I treat people, whether I keep my word, and what I do next.
                </p>
                <p>
                  I still get caught up in the first list more often than I'd like. The point is to notice it and return to the second.
                </p>
              </div>
            </div>

            {/* 02 */}
            <div className="py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8 items-start">
              <div className="lg:col-span-4 flex items-baseline gap-2.5">
                <span className="font-mono-meta text-xs text-[var(--accent-crimson)] font-semibold shrink-0">
                  02.
                </span>
                <h3 className="font-serif-editorial editorial-card-heading text-[var(--text-primary)]">
                  Pause before you react.
                </h3>
              </div>
              <div className="lg:col-span-8 space-y-3 font-sans-body editorial-body text-[var(--text-secondary)] max-w-3xl">
                <p>
                  Not every insult needs an answer. Not every disagreement needs to be won. Not every bad day needs to become a bad week.
                </p>
                <p>
                  There's a little space between what happens and what I do about it. I'm trying to get better at using that space instead of reacting on impulse.
                </p>
                <p className="text-[var(--text-primary)]">
                  Sometimes the wisest thing to do is nothing — at least until the first wave of emotion passes.
                </p>
              </div>
            </div>

            {/* 03 */}
            <div className="py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8 items-start">
              <div className="lg:col-span-4 flex items-baseline gap-2.5">
                <span className="font-mono-meta text-xs text-[var(--accent-crimson)] font-semibold shrink-0">
                  03.
                </span>
                <h3 className="font-serif-editorial editorial-card-heading text-[var(--text-primary)]">
                  Remember that things don't last.
                </h3>
              </div>
              <div className="lg:col-span-8 space-y-3 font-sans-body editorial-body text-[var(--text-secondary)] max-w-3xl">
                <p>Good days end. Bad days end, too.</p>
                <p>
                  People change, plans fall apart, things we take for granted disappear, and nothing stays exactly as it is. I don't find that particularly comforting all the time, but it does make me pay more attention to what's here right now.
                </p>
                <p className="font-literary italic text-[var(--text-primary)]">
                  Memento mori — remember that you will die.
                </p>
                <p>
                  Not the most cheerful reminder, perhaps. But a useful one. Time is limited. I'd rather spend less of it worrying about trivial things and more of it being present for the things that matter.
                </p>
              </div>
            </div>

            {/* 04 */}
            <div className="py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8 items-start">
              <div className="lg:col-span-4 flex items-baseline gap-2.5">
                <span className="font-mono-meta text-xs text-[var(--accent-crimson)] font-semibold shrink-0">
                  04.
                </span>
                <h3 className="font-serif-editorial editorial-card-heading text-[var(--text-primary)]">
                  Character over reputation.
                </h3>
              </div>
              <div className="lg:col-span-8 space-y-3 font-sans-body editorial-body text-[var(--text-secondary)] max-w-3xl">
                <p>
                  It's easy to worry about looking intelligent, successful, or impressive. It's harder to focus on actually being honest, fair, patient, and dependable when nobody is watching.
                </p>
                <p>
                  I can't always decide what people think of me. I can make an effort to become someone whose actions I can stand behind.
                </p>
                <p className="text-[var(--text-primary)]">
                  I'd like to care a little less about appearing to have my life together and a little more about how I'm actually living it.
                </p>
              </div>
            </div>

            {/* 05 */}
            <div className="py-5 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8 items-start">
              <div className="lg:col-span-4 flex items-baseline gap-2.5">
                <span className="font-mono-meta text-xs text-[var(--accent-crimson)] font-semibold shrink-0">
                  05.
                </span>
                <h3 className="font-serif-editorial editorial-card-heading text-[var(--text-primary)]">
                  Get comfortable being uncomfortable.
                </h3>
              </div>
              <div className="lg:col-span-8 space-y-3 font-sans-body editorial-body text-[var(--text-secondary)] max-w-3xl">
                <p>
                  Discomfort isn't always a sign that something is wrong. Sometimes it means I'm doing something difficult, hearing something I don't want to hear, or learning to live without a convenience I've become too dependent on.
                </p>
                <p>
                  Stoicism reminds me that I don't need to escape every uncomfortable feeling immediately.
                </p>
                <p className="text-[var(--text-primary)]">
                  Sometimes I need to sit with it, understand it, and get on with what needs to be done.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. A few people worth reading + 5. The books on my desk */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start border-b border-[var(--border-hairline)] pb-8 sm:pb-10">
          {/* Left 7 Cols: A few people worth reading */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="font-mono-meta text-[10px] uppercase tracking-widest text-[var(--accent-crimson)]">
                Voices Across Centuries
              </div>
              <h2 className="font-serif-editorial editorial-section-heading text-[var(--text-primary)]">
                A few people worth reading.
              </h2>
            </div>

            <div className="space-y-4 font-sans-body editorial-body text-[var(--text-secondary)]">
              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-1">
                <p>
                  <strong className="font-serif-editorial text-lg text-[var(--text-primary)] font-normal">
                    Marcus Aurelius
                  </strong>{' '}
                  — a Roman emperor who kept reminding himself to act with discipline, fairness, and perspective. His{' '}
                  <em className="font-literary text-[var(--text-primary)]">Meditations</em> wasn't written to impress an audience. It was a series of private reflections, which makes reading it feel strangely personal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-1">
                <p>
                  <strong className="font-serif-editorial text-lg text-[var(--text-primary)] font-normal">
                    Epictetus
                  </strong>{' '}
                  — a former enslaved man who taught that our judgments and choices matter more than circumstances we cannot control. His ideas are a good place to start if you're prone to overthinking.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-1">
                <p>
                  <strong className="font-serif-editorial text-lg text-[var(--text-primary)] font-normal">
                    Seneca
                  </strong>{' '}
                  — a Roman philosopher who wrote about anger, time, wealth, grief, and the strange ways people make their own lives difficult. Uncomfortably relevant, even now.
                </p>
              </div>

              <p className="pt-1">
                You don't have to agree with everything they wrote. I certainly don't think philosophy should be treated as a set of instructions you follow without question. Read, think, disagree, and figure out what holds up in your own life.
              </p>
            </div>
          </div>

          {/* Right 5 Cols: The books on my desk */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] tactile-card-shadow space-y-4">
            <div className="space-y-1 border-b border-[var(--border-hairline)] pb-3">
              <div className="font-mono-meta text-[10px] uppercase tracking-widest text-[var(--accent-olive)]">
                Essential Reading
              </div>
              <h2 className="font-serif-editorial editorial-sub-heading text-[var(--text-primary)]">
                The books on my desk.
              </h2>
            </div>

            <ul className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)] font-sans-body editorial-body text-[var(--text-primary)]">
              <li className="py-2.5 flex items-baseline justify-between gap-2">
                <em className="font-serif-editorial text-lg">Meditations</em>
                <span className="font-mono-meta text-xs text-[var(--text-secondary)]">
                  — Marcus Aurelius
                </span>
              </li>
              <li className="py-2.5 flex items-baseline justify-between gap-2">
                <em className="font-serif-editorial text-lg">Discourses and Selected Writings</em>
                <span className="font-mono-meta text-xs text-[var(--text-secondary)]">
                  — Epictetus
                </span>
              </li>
              <li className="py-2.5 flex items-baseline justify-between gap-2">
                <em className="font-serif-editorial text-lg">Letters from a Stoic</em>
                <span className="font-mono-meta text-xs text-[var(--text-secondary)]">
                  — Seneca
                </span>
              </li>
            </ul>

            <div className="space-y-3 font-sans-body editorial-body-sm text-[var(--text-secondary)]">
              <p>
                These aren't books you necessarily finish and move on from. Sometimes a single paragraph is enough to make you stop and reconsider something you've been doing for years.
              </p>
              <p className="text-[var(--text-primary)]">
                And sometimes you read the same advice ten times and still fail to follow it on the eleventh day. That's life, I suppose.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Not a finished product */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-4 space-y-1.5">
            <div className="font-mono-meta text-[10px] uppercase tracking-widest text-[var(--accent-crimson)]">
              In Practice
            </div>
            <h2 className="font-serif-editorial editorial-section-heading text-[var(--text-primary)]">
              Not a finished product.
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-4 font-sans-body editorial-body text-[var(--text-secondary)] max-w-3xl">
            <p>
              I don't see Stoicism as a way to become emotionless, tolerate everything, or act like nothing matters.
            </p>
            <p>
              It's not about suppressing sadness, accepting injustice without resistance, or pretending that every setback is secretly a gift. It's about responding to reality with a little more clarity and a little less unnecessary suffering.
            </p>
            <p>
              I'll still get annoyed over stupid things. I'll still worry about the future, take things personally, and occasionally let my emotions get the better of me.
            </p>
            <p className="text-[var(--text-primary)]">
              The difference I'm hoping for isn't perfection. It's awareness. Catching myself a little sooner. Making a better choice the next time. Learning to distinguish between what deserves my energy and what doesn't.
            </p>
            <p>No grand transformation. No perfectly peaceful life.</p>
            <p>Just an ongoing attempt to live with a little more intention.</p>

            <blockquote className="pt-3 mt-2 border-t border-[var(--border-hairline)] font-literary italic editorial-quote text-[var(--text-primary)]">
              Amor fati — love your fate. Not because everything that happens is good, but because this is the life you have to work with.
            </blockquote>
          </div>
        </section>
      </article>

      {/* =====================================================================
          BELOW: EXISTING WRITING, MARATHI ESSAYS, FOLDABLE STORIES & ARCHIVE
          ===================================================================== */}
      <div className="space-y-2">
        <div className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-crimson)]">
          Writing, Sahitya &amp; Unsolicited Self-Critique
        </div>
        <h2 className="font-serif-editorial editorial-section-heading font-normal text-[var(--text-primary)]">
          Arguing with myself on paper so I don’t do it out loud.
        </h2>
        <p className="editorial-body text-[var(--text-secondary)] max-w-2xl">
          Long-form Marathi essays in an interactive Kindle reader, foldable stories by writers I revere, and Stoic notes where I cross-examine my own habits.
        </p>
      </div>

      {/* =====================================================================
          01 / FEATURED MARATHI ESSAYS + COMPACT ALL-DEVICE KINDLE READER
          ===================================================================== */}
      {activeFeaturedMarathiPost && (
        <section aria-label="Featured Marathi Essays" className="space-y-3">
          {/* Interactive Switcher between the 2 Marathi Essays */}
          {marathiPosts.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {marathiPosts.map((mp, idx) => {
                const isActive = mp.id === activeFeaturedMarathiPost.id;
                const isDem = mp.id === 'post-marathi-lokshahi-stambh';
                const IconComp = isDem ? Landmark : BookOpen;
                return (
                  <motion.button
                    key={mp.id}
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedMarathiShowcaseId(mp.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)] shadow-xs'
                        : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--accent-crimson)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[var(--accent-crimson)] text-white'
                            : 'bg-[var(--bg-canvas)] text-[var(--accent-crimson)]'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div
                          className={`font-mono-meta text-[10px] ${
                            isActive ? 'opacity-80' : 'text-[var(--text-muted)]'
                          }`}
                        >
                          मराठी निबंध 0{idx + 1} · {isDem ? 'लोकशाही व संविधान' : 'मराठी दलित साहित्य'}
                        </div>
                        <div className={`${marathiTitleFontClass} text-base sm:text-lg truncate`}>
                          {mp.title}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono-meta text-[10px] shrink-0 px-2 py-1 rounded-md border border-current/20">
                      {isActive ? 'Active' : 'Preview'}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Compact All-Device Kindle Reader Control Dock */}
          {renderKindleControlDock(false)}

          {/* Featured Kindle Book Preview Card — Animated when switching essays or paper themes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFeaturedMarathiPost.id}-${kindleTheme}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              onClick={() => {
                onSelectPostSlug(activeFeaturedMarathiPost.slug);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group rounded-2xl p-4 sm:p-6 lg:p-8 border tactile-card-shadow cursor-pointer transition-colors ${activeKindlePaper.pageBg} ${activeKindlePaper.pageText} ${activeKindlePaper.pageBorder}`}
            >
              {/* Top Kindle Running Strip */}
              <div
                className={`flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-current/15 font-mono-meta text-[10px] sm:text-xs ${activeKindlePaper.pageMuted}`}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  {isSelectedDemocracy ? (
                    <Landmark className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className={`font-medium ${activeKindlePaper.accentColor}`}>
                    {isSelectedDemocracy
                      ? 'लोकशाही व संविधान चिंतन'
                      : 'मराठी साहित्य निबंध'}
                  </span>
                  <span>·</span>
                  <span>विश्वजीत ढवळे</span>
                  <span>·</span>
                  <span>{calculateReadingStats(activeFeaturedMarathiPost.content).label}</span>
                </div>
                <span className="tabular-nums">
                  {activeKindlePaper.shortLabel} ·{' '}
                  {MARATHI_FONT_OPTIONS.find((f) => f.id === marathiFontStyle)?.shortDevanagari} ·{' '}
                  {fontSizePx}px
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
                {/* Left 7 Cols: Title, Subtitle, Excerpt & Read CTA */}
                <div className="lg:col-span-7 space-y-3">
                  <h2
                    style={{
                      fontSize: `clamp(${previewTitleMin}px, calc(${previewTitleMin}px + 1.2vw), ${previewTitleMax}px)`,
                    }}
                    className={`${marathiTitleFontClass} leading-[1.24] text-balance transition-all`}
                  >
                    {activeFeaturedMarathiPost.title}
                  </h2>

                  {activeFeaturedMarathiPost.subtitle && (
                    <p
                      style={{
                        fontSize: `clamp(15px, calc(15px + 0.4vw), ${Math.round(fontSizePx * 0.94)}px)`,
                      }}
                      className={`${activeFontClass} ${activeKindlePaper.pageMuted} leading-relaxed`}
                    >
                      {activeFeaturedMarathiPost.subtitle}
                    </p>
                  )}

                  <p
                    style={{
                      fontSize: `clamp(${previewBodyMin}px, calc(${previewBodyMin}px + 0.5vw), ${fontSizePx}px)`,
                    }}
                    className={`${activeFontClass} opacity-95 leading-[1.82] line-clamp-4 sm:line-clamp-none`}
                  >
                    {isSelectedDemocracy
                      ? 'मानवी समाजात स्थायी शेती आणि संपत्तीची निर्मिती सुरू झाली, तेव्हा राज्यसंस्थेच्या उदयाला चालना मिळाली. आधुनिक लोकशाहीच्या विकासासोबत विधिमंडळ, कार्यपालिका, न्यायपालिका आणि प्रसारमाध्यमे हे लोकशाहीचे चार स्तंभ मानले गेले. पण जेव्हा नागरिकांच्या हक्कांचे रक्षण करणाऱ्या संस्था कमकुवत होतात, तेव्हा सत्तेचा खरा आधारस्तंभ कोणता उरतो?'
                      : 'समाजाची गोष्ट नेहमी कोण सांगत आलं आहे? इतिहास लिहिणारे, साहित्य निर्माण करणारे, माणसांना समजून घेणारे आणि त्यांच्याबद्दल मत बनवणारे लोक नेहमीच समाजातील प्रत्येक घटकाचा भाग होते का? की काही लोकांच्या आयुष्याबद्दल इतरांनी भरपूर लिहिलं, पण त्या लोकांना स्वतःच्या आयुष्याबद्दल बोलण्याची संधीच मिळाली नाही?'}
                  </p>

                  {/* Quick Tags / Context Strip */}
                  <div
                    className={`pt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-marathi-granth text-xs ${activeKindlePaper.pageMuted}`}
                  >
                    <span className="font-mono-meta text-[10px] tracking-wider">
                      {isSelectedDemocracy ? 'मुख्य संकल्पना:' : 'संदर्भ:'}
                    </span>
                    {isSelectedDemocracy ? (
                      <>
                        <span>विधिमंडळ</span>
                        <span>·</span>
                        <span>न्यायपालिका</span>
                        <span>·</span>
                        <span>प्रसारमाध्यमे</span>
                        <span>·</span>
                        <span>निवडणूक आयोग</span>
                        <span>·</span>
                        <span>संवैधानिक अधिकार</span>
                      </>
                    ) : (
                      <>
                        <span>बाबुराव बागुल</span>
                        <span>·</span>
                        <span>दया पवार (बलुतं)</span>
                        <span>·</span>
                        <span>नामदेव ढसाळ (गोलपीठा)</span>
                        <span>·</span>
                        <span>लक्ष्मण माने (उपरा)</span>
                        <span>·</span>
                        <span>शांताबाई कांबळे</span>
                      </>
                    )}
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B2E1D] text-[#FAF3E6] font-mono-meta text-xs font-medium shadow-2xs group-hover:translate-x-0.5 transition-transform">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>किंडल मोडमध्ये संपूर्ण निबंध वाचा (Read Full Essay)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Right 5 Cols: Interactive Democracy Pillars OR Poem Verse Box */}
                <div className="lg:col-span-5">
                  {isSelectedDemocracy ? (
                    renderDemocracyPillarsExplorer(true)
                  ) : (
                    <div
                      className={`p-4 sm:p-5 rounded-xl border border-current/20 ${activeKindlePaper.chipBg} space-y-2`}
                    >
                      <div
                        className={`flex items-center justify-between font-mono-meta text-[10px] tracking-wider border-b border-current/15 pb-1.5 ${activeKindlePaper.accentColor}`}
                      >
                        <span>निबंधातील कविता · Poem from Essay</span>
                        <span>॥ काव्य ॥</span>
                      </div>
                      <blockquote
                        style={{
                          fontSize: `clamp(15px, calc(15px + 0.4vw), ${Math.round(fontSizePx * 0.92)}px)`,
                        }}
                        className={`${marathiTitleFontClass} leading-[1.68] space-y-0.5`}
                      >
                        <p>ही वाट माझी नव्हती, असं म्हणत म्हणत मी चालत राहिलो.</p>
                        <p>प्रत्येक वळणावर कुणीतरी नाव विचारलं, प्रत्येक दाराने माझी जात ओळखली.</p>
                        <p>एक दिवस मी माझी गोष्ट लिहिली, आणि पहिल्यांदा कळलं—</p>
                        <p className={`pt-0.5 font-medium ${activeKindlePaper.accentColor}`}>
                          माझं आयुष्य कुणाच्या परवानगीवर उभं नव्हतं.
                        </p>
                      </blockquote>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {/* =====================================================================
          02 / FOLDABLE STORIES & REFLECTIONS BY REVERED AUTHORS
               (ONLY 4 LINES VISIBLE BY DEFAULT -> CLICK "READ MORE" TO UNFOLD)
          ===================================================================== */}
      <section
        aria-labelledby="shared-stories-heading"
        className="space-y-4 border-t border-[var(--border-hairline)] pt-7"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 font-mono-meta text-[11px] tracking-wider text-[var(--accent-crimson)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>02 · Foldable Literary Archive · इतर लेखकांच्या कथा व चिंतन</span>
            </div>
            <h2
              id="shared-stories-heading"
              className="font-serif-editorial editorial-section-heading text-[var(--text-primary)]"
            >
              Stories by writers who understood human nature far better than I do
            </h2>
            <p className="editorial-body-sm text-[var(--text-secondary)] max-w-2xl">
              Folded to 4 lines by default so the page stays calm—click{' '}
              <span className="font-mono-meta text-[var(--accent-crimson)]">Read more</span> on
              Lokshahir Annabhau Sathe’s{' '}
              <span className="font-marathi-granth text-[var(--text-primary)]">
                ‘स्मशानातील सोनं’
              </span>{' '}
              or P. L. Deshpande’s{' '}
              <span className="font-marathi-granth text-[var(--text-primary)]">
                ‘मराठी माऊली… पु. लंच्या शब्दात’
              </span>{' '}
              to unfold the full text.
            </p>
          </div>

          {/* Story Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {SHARED_AUTHOR_STORIES.map((story, idx) => {
              const isSelected = story.id === selectedSharedStoryId;
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => {
                    setSelectedSharedStoryId(story.id);
                    setExpandSharedStoryInline(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[var(--accent-crimson)] text-white border-[var(--accent-crimson)] shadow-xs'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--accent-crimson)]'
                  }`}
                >
                  <span className="font-mono-meta text-[10px] tabular-nums opacity-85">
                    0{idx + 1}
                  </span>
                  <span className={`${marathiTitleFontClass} text-sm sm:text-base`}>
                    {story.title.split(' – ')[0].split('…')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Shared Story Card — Strictly 4 Lines When Folded + "Read more" Toggle */}
        {(() => {
          const activeStory: SharedAuthorStory =
            SHARED_AUTHOR_STORIES.find((s) => s.id === selectedSharedStoryId) ||
            SHARED_AUTHOR_STORIES[0];
          const storyStats = calculateReadingStats(activeStory.content);
          const storyParagraphs = activeStory.content.split(/\n\s*\n/).filter(Boolean);

          return (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeStory.id}-${kindleTheme}-${expandSharedStoryInline}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className={`rounded-2xl border p-5 sm:p-7 space-y-5 tactile-card-shadow transition-colors ${activeKindlePaper.pageBg} ${activeKindlePaper.pageText} ${activeKindlePaper.pageBorder}`}
              >
                {/* Top Metadata Strip */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-current/15 font-mono-meta text-[10px] sm:text-xs ${activeKindlePaper.pageMuted}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Quote className={`w-3.5 h-3.5 ${activeKindlePaper.accentColor}`} />
                    <span className={`font-semibold ${activeKindlePaper.accentColor}`}>
                      {activeStory.categoryLabel}
                    </span>
                    <span>·</span>
                    <span>मूळ लेखक: {activeStory.author}</span>
                  </div>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span>{storyStats.words} शब्द</span>
                    <span>·</span>
                    <span>{storyStats.label}</span>
                    <span>·</span>
                    <span className={activeKindlePaper.accentColor}>
                      {expandSharedStoryInline ? 'Unfolded (Full Text)' : 'Folded (4-Line Preview)'}
                    </span>
                  </div>
                </div>

                {/* Story Header & Editorial Context */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  <div className="lg:col-span-8 space-y-2">
                    <h3
                      style={{
                        fontSize: `clamp(${previewTitleMin}px, calc(${previewTitleMin}px + 1.1vw), ${previewTitleMax}px)`,
                      }}
                      className={`${marathiTitleFontClass} leading-[1.24]`}
                    >
                      {activeStory.title}
                    </h3>
                    <p
                      className={`${activeFontClass} text-base sm:text-lg ${activeKindlePaper.pageMuted}`}
                    >
                      {activeStory.subtitle}
                    </p>
                  </div>

                  <div
                    className={`lg:col-span-4 p-3.5 rounded-xl border border-current/15 ${activeKindlePaper.chipBg} space-y-1`}
                  >
                    <div
                      className={`font-mono-meta text-[10px] uppercase tracking-wider font-semibold ${activeKindlePaper.accentColor}`}
                    >
                      साहित्य संदर्भ · Why I Saved This
                    </div>
                    <p className={`${activeFontClass} editorial-body-sm line-clamp-2`}>
                      {activeStory.contextNote}
                    </p>
                  </div>
                </div>

                {/* Foldable Story Body: Strictly 4 Lines (`line-clamp-4`) when folded, Full Paragraphs when expanded */}
                <div className="pt-3 border-t border-current/15 space-y-3">
                  {!expandSharedStoryInline ? (
                    <div className="relative">
                      <p
                        style={{
                          fontSize: `clamp(${previewBodyMin}px, calc(${previewBodyMin}px + 0.5vw), ${fontSizePx}px)`,
                          lineHeight: 1.85,
                        }}
                        className={`${activeFontClass} line-clamp-4 max-w-[72ch] text-pretty`}
                      >
                        {storyParagraphs.join(' ')}
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: `clamp(${previewBodyMin}px, calc(${previewBodyMin}px + 0.5vw), ${fontSizePx}px)`,
                        lineHeight:
                          lineSpacing === 'compact'
                            ? 1.7
                            : lineSpacing === 'spacious'
                            ? 2.15
                            : 1.9,
                      }}
                      className={`${activeFontClass} space-y-4 max-w-[72ch]`}
                    >
                      {storyParagraphs.map((para, pIdx) => (
                        <p key={pIdx} className="text-pretty">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Prominent Read More / Fold Toggle Button */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setExpandSharedStoryInline((prev) => !prev)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B2E1D] text-[#FAF3E6] font-mono-meta text-xs font-medium shadow-2xs hover:opacity-95 cursor-pointer transition-all"
                      >
                        <span>
                          {expandSharedStoryInline
                            ? 'Show less · कथा दुमडा (Fold to 4 lines)'
                            : `Read more · संपूर्ण कथा वाचा (${storyParagraphs.length} paragraphs)`}
                        </span>
                        {expandSharedStoryInline ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectPostSlug(activeStory.slug);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-current/25 font-mono-meta text-xs hover:border-current cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>किंडल बुक रीडरमध्ये उघडा (Full Kindle Reader)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className={`font-mono-meta text-[11px] ${activeKindlePaper.pageMuted}`}>
                      — {activeStory.author}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          );
        })()}
      </section>

      {/* =====================================================================
          03 / ESSAYS & WORKING NOTES DIRECTORY (SLEEK EDITORIAL LIST)
          ===================================================================== */}
      <section
        aria-labelledby="toc-heading"
        className="space-y-4 border-t border-[var(--border-hairline)] pt-7"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-mono-meta text-[11px] tracking-wider text-[var(--accent-crimson)]">
              03 · All Essays &amp; Working Notes
            </div>
            <h2
              id="toc-heading"
              className="font-serif-editorial text-xl sm:text-2xl text-[var(--text-primary)] mt-0.5"
            >
              Late-night essays, unfinished arguments &amp; notes to my future self
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1 text-xs font-mono-meta">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] border transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]'
                      : 'border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays..."
              aria-label="Search essays and notes"
              className="w-full sm:w-44 px-3 py-1 text-xs rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)] focus:border-[var(--accent-crimson)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-6 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)]/45">
            <p className="font-serif-editorial text-lg text-[var(--text-primary)]">
              No matching essays or notes.
            </p>
          </div>
        ) : (
          <div className="border-y border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
            {filteredPosts.map((post, idx) => {
              const stats = calculateReadingStats(post.content);
              const isMarathi = isDevanagariText(post.title);
              const isDem = post.id === 'post-marathi-lokshahi-stambh';
              const PostIcon = isDem ? Landmark : isMarathi ? BookOpen : ScrollText;

              return (
                <article
                  key={post.id}
                  onClick={() => {
                    onSelectPostSlug(post.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group py-4 px-2 -mx-2 hover:bg-[var(--bg-canvas)]/65 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-6 items-baseline transition-colors"
                >
                  <div className="lg:col-span-5 flex items-baseline gap-3 min-w-0">
                    <span className="font-mono-meta text-xs text-[var(--accent-crimson)] tabular-nums shrink-0 inline-flex items-center gap-1">
                      <PostIcon className="w-3 h-3" />
                      <span>{String(idx + 1).padStart(2, '0')}</span>
                    </span>
                    <div className="min-w-0">
                      <h3
                        className={`${
                          isMarathi
                            ? `${marathiTitleFontClass} text-xl sm:text-2xl`
                            : 'font-serif-editorial text-lg sm:text-xl'
                        } text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)] transition-colors leading-snug`}
                      >
                        {post.title}
                      </h3>
                      <div className="font-mono-meta text-[10px] text-[var(--text-muted)] mt-0.5">
                        {isDem
                          ? 'लोकशाही व संविधान'
                          : isMarathi
                          ? 'मराठी साहित्य'
                          : post.category}{' '}
                        · {post.publishedAt} · {stats.label}
                      </div>
                    </div>
                  </div>

                  <p
                    className={`lg:col-span-5 ${
                      isMarathi ? `${activeFontClass} text-base` : 'editorial-body-sm'
                    } text-[var(--text-secondary)] line-clamp-2`}
                  >
                    {post.excerpt}
                  </p>

                  <div className="lg:col-span-2 lg:text-right font-mono-meta text-[11px] text-[var(--accent-crimson)] group-hover:underline shrink-0">
                    {isMarathi ? 'किंडल मोडमध्ये वाचा →' : 'Read essay →'}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
