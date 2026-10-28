import React from 'react';
import {
  Film,
  Trophy,
  BookOpen,
  Feather,
  Camera,
  ChefHat,
  Disc3,
  ArrowUpRight,
} from 'lucide-react';
import { ArchiveData, NavigationTab } from '../types/archive';

interface InterestsHubSectionProps {
  archive: ArchiveData;
  onNavigate: (tab: NavigationTab) => void;
}

export const InterestsHubSection: React.FC<InterestsHubSectionProps> = ({
  archive,
  onNavigate,
}) => {
  const showSamples = archive.settings.showSampleEntries;

  const cinemaCount = archive.cinema.films.filter((f) => showSamples || !f.isSample).length;
  const frameStudyCount = archive.cinema.frameStudies.filter(
    (f) => showSamples || !f.isSample
  ).length;
  const footballCount =
    archive.football.notes.filter((n) => showSamples || !n.isSample).length +
    archive.football.matches.filter((m) => showSamples || !m.isSample).length;
  const booksCount = archive.books.entries.filter((b) => showSamples || !b.isSample).length;
  const philosophyCount = archive.blog.posts.filter(
    (p) => p.status === 'published' && (showSamples || !p.isSample)
  ).length;
  const photoCount = archive.photography.items.filter((p) => showSamples || !p.isSample).length;

  const sections: {
    id: NavigationTab;
    num: string;
    swatch: string;
    title: string;
    badge: string;
    quote: string;
    description: string;
    meta: string;
    cta: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'cinema',
      num: '01',
      swatch: '#C84B31',
      title: 'Cinema',
      badge: 'Includes @mivishvajeet Screening Log Toggle',
      quote:
        'Sometimes I watch a film. Sometimes I spend the next two hours thinking about one frame.',
      description:
        'Story-driven thrillers, regional Indian gems (Marathi, Malayalam, Tamil), frame studies, and an interactive Screening Room mode with my full film diary and 10 curated lists.',
      meta: `${cinemaCount} studio studies · 34+ screening logs · ${frameStudyCount} frame breakdowns`,
      cta: 'Enter Cinema',
      Icon: Film,
    },
    {
      id: 'football',
      num: '02',
      swatch: '#1B5698',
      title: 'Football',
      badge: 'Includes Matchday Pitch Mode Toggle',
      quote:
        'Barcelona, Messi, and the beautiful idea that how you play matters as much as whether you win.',
      description:
        'Iconic Peter Drury commentary calls that gave me goosebumps or tears, positional play geometry, player studies, and classic matches worth revisiting.',
      meta: `4 broadcast chapters · ${footballCount} tactical & match notes`,
      cta: 'Enter Football',
      Icon: Trophy,
    },
    {
      id: 'books',
      num: '03',
      swatch: '#D99B26',
      title: 'Books',
      badge: 'Goodreads Reading Log · Marathi, Hindi & English',
      quote:
        'Stories, ideas, and the occasional book that rearranges the furniture in your head.',
      description:
        'My complete Goodreads reading index across Marathi literature (मृत्युंजय, ययाती, कोसला, बलुतं), Hindi classics (गुनाहों का देवता, गोदान, राग दरबारी), and Non-fiction & Social Thought (Annihilation of Caste, मुसाफिर)—plus 56+ randomizable underlined passages.',
      meta: `${booksCount} logged books · List Catalog & 56+ Underlined Notes`,
      cta: 'Enter Books',
      Icon: BookOpen,
    },
    {
      id: 'writing',
      num: '04',
      swatch: '#5B7A57',
      title: 'Philosophy & Writing',
      badge: 'Essays, Stoic Questioning & Foldable Shared Stories',
      quote:
        'Between an event happening and my reaction to it, there is a small gap where a judgment is formed.',
      description:
        'Long-form Marathi essays in an interactive Kindle reader, foldable stories by revered authors (लोकशाहीर आण्णाभाऊ साठे, पु. ल. देशपांडे), and working notes where I cross-examine my own habits with Epictetus & Marcus Aurelius.',
      meta: `${philosophyCount} essays, foldable stories & Stoic inquiries`,
      cta: 'Enter Philosophy',
      Icon: Feather,
    },
    {
      id: 'music',
      num: '05',
      swatch: '#1DB954',
      title: 'Music',
      badge: 'Old Hindi · Marathi · 90s Rock & Pop · Kendrick Lamar & Kanye',
      quote:
        'From Kishore Kumar & Marathi classics to “Be My Baby” by The Ronettes and Kendrick Lamar at 1 AM.',
      description:
        'Four soundscapes that define my headphones: Golden-era Bollywood Hindi melodies, evergreen Marathi bhavgeet & Ajay-Atul, 60s–90s rock/pop (“Be My Baby”, Oasis, Radiohead), and Kendrick Lamar (#1 favorite artist) & Kanye West.',
      meta: '4 Soundscape Turntables · Liner Notes · Spotify Crates',
      cta: 'Enter Music',
      Icon: Disc3,
    },
  ];

  return (
    <div className="space-y-12">
      <header className="border-b border-[var(--border-hairline)] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="font-mono-meta text-[11px] uppercase tracking-[0.15em] text-[var(--accent-crimson)]">
            Chronically Curious · Things That Make Me Lose Track of Time
          </div>
          <h1 className="font-serif-editorial editorial-hero-display font-normal text-[var(--text-primary)]">
            Things I watch, hear, read &amp; think about.
          </h1>
        </div>
        <p className="font-sans-body editorial-body text-[var(--text-secondary)] max-w-md">
          A little bit of everything, a lot of overthinking—sorted into five dedicated notebooks so my obsessions have somewhere to live.
        </p>
      </header>

      <div className="border-t border-b border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)] bg-[var(--bg-surface)]/30">
        {sections.map((sec) => {
          const Icon = sec.Icon;
          return (
            <article
              key={sec.id}
              onClick={() => onNavigate(sec.id)}
              className="group corridor-flare-row py-8 px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center cursor-pointer"
            >
              <div className="lg:col-span-3 space-y-2">
                <div className="font-mono-meta text-xs text-[var(--text-muted)] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-crimson)] group-hover:bg-[var(--accent-crimson)] group-hover:text-white transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span>INDEX {sec.num}</span>
                </div>
                <h2 className="font-serif-editorial editorial-section-heading font-normal text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)] transition-colors">
                  {sec.title}
                </h2>
                <div className="font-mono-meta text-[11px] text-[var(--accent-olive)]">
                  {sec.meta}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-2.5 lg:border-l lg:border-[var(--border-hairline)] lg:pl-8">
                <div className="font-mono-meta text-[11px] text-[var(--accent-crimson)]">
                  {sec.badge}
                </div>
                <blockquote className="font-literary italic editorial-quote text-[var(--text-primary)]">
                  “{sec.quote}”
                </blockquote>
                <p className="font-sans-body editorial-body text-[var(--text-secondary)]">
                  {sec.description}
                </p>
              </div>

              <div className="lg:col-span-2 lg:text-right">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono-meta uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)] underline underline-offset-4 transition-colors">
                  <span>{sec.cta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Off-Screen & Sound Shelf Quick Jump */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div
          onClick={() => onNavigate('home')}
          className="p-5 rounded-xl bg-[var(--bg-canvas)]/65 border border-[var(--border-hairline)] hover:border-[var(--border-strong)] cursor-pointer flex items-center justify-between gap-4 transition-colors"
        >
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 font-mono-meta text-[11px] text-[var(--accent-crimson)]">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Off-Screen Therapy</span>
            </div>
            <h3 className="font-serif-editorial editorial-card-heading text-[var(--text-primary)]">
              What’s Cooking? (Chicken Lemon & Kolhapuri Chicken + Rassa with Jowar Bhakri)
            </h3>
            <p className="font-sans-body editorial-body-sm text-[var(--text-secondary)]">
              My kitchen counter on the main desk—where cooking slows my mind down.
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
        </div>

        <div
          onClick={() => onNavigate('music')}
          className="p-5 rounded-xl bg-[var(--bg-canvas)]/65 border border-[var(--border-hairline)] hover:border-[var(--border-strong)] cursor-pointer flex items-center justify-between gap-4 transition-colors"
        >
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 font-mono-meta text-[11px] text-[var(--accent-olive)]">
              <Disc3 className="w-3.5 h-3.5" />
              <span>Dedicated Music Room</span>
            </div>
            <h3 className="font-serif-editorial editorial-card-heading text-[var(--text-primary)]">
              Old Hindi, Marathi Classics, “Be My Baby” &amp; Kendrick Lamar
            </h3>
            <p className="font-sans-body editorial-body-sm text-[var(--text-secondary)]">
              Open the redesigned Music page with interactive 4-corner vinyl turntable, liner notes, and Spotify crates.
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
        </div>
      </div>
    </div>
  );
};
