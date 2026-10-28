import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { ArchiveData, NavigationTab } from '../types/archive';

interface AboutSectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onNavigate,
}) => {
  return (
    <div className="space-y-14 md:space-y-16">
      <header className="border-b border-[var(--border-hairline)] pb-8 sm:pb-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 items-baseline">
        <div className="md:col-span-3 font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-crimson)]">
          STORY · SELF-AUDIT
        </div>
        <div className="md:col-span-9 max-w-3xl space-y-3.5">
          <h1 className="font-serif-editorial halation-heading editorial-hero-display font-normal text-[var(--text-primary)] text-balance">
            Overthinking Things Nobody Asked Me to Think About
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Main Essay Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 text-[15px] sm:text-base md:text-[17px] leading-[1.82] text-[var(--text-primary)] max-w-[66ch]">
          <p>
            I’ve never been someone who could stick to just one thing. I get curious about
            something, spend hours exploring it, convince myself this is going to be my new
            favourite thing, and then, a few days later, find something else to obsess over. It’s a
            bit of a problem, honestly.
          </p>

          <p>
            I like watching films and paying attention to the little things — how a scene is shot,
            why a particular frame works, or how a director can make you feel something without
            spelling it out. I can spend hours watching Barcelona play, listening to music, reading
            about technology, or going down some random rabbit hole that started with a simple
            question.
          </p>

          <p>
            I like understanding things. Why people think the way they do, why we believe certain
            things without questioning them, and whether what we consider normal actually makes
            sense. Sometimes these questions lead somewhere interesting. Sometimes I just end up
            overthinking something that probably wasn't worth that much thought.
          </p>

          <p>
            I'm not great at following through on everything I start, either. There are books I've
            left halfway through, interests I've picked up and forgotten about, and plans I've made
            with the confidence of someone who clearly doesn't know himself very well. I’m working
            on it, though. Slowly, and with mixed results.
          </p>

          <p>
            I’m drawn to Stoic philosophy, especially the idea of questioning my own judgments,
            being a little more thoughtful about how I react to things, and learning to focus on
            what I can control. I like the ideas, even if putting them into practice is a completely
            different story.
          </p>

          <p>
            I don't have a grand philosophy about life, and I'm definitely not trying to present
            myself as someone who has everything figured out. I'm still learning, changing my mind,
            making mistakes, and trying to understand myself a little better along the way.
          </p>

          <p className="font-serif-editorial font-semibold text-xl md:text-2xl text-[var(--text-primary)] leading-snug pt-2 border-l-2 border-[var(--accent-crimson)] pl-4">
            <strong>
              So, this website is basically a place for all the things that catch my attention —
              films, music, books, football, random thoughts, and whatever else I happen to get
              carried away with.
            </strong>
          </p>

          <p className="font-literary italic text-lg md:text-xl text-[var(--text-secondary)] pt-1">
            No big plan. No particular order. Just me, trying to make sense of the things I find
            interesting.
          </p>
        </div>

        {/* Right Column (5 Cols): Properly Framed Portrait & Clean Room Directory */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-8 w-full">
          {/* Properly Adjusted Portrait Card */}
          <div className="w-full max-w-[440px] mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-3 sm:p-4 space-y-3 tactile-card-shadow">
            <div className="flex items-center justify-between px-1 text-[11px] font-mono-meta text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)] font-medium">
                <MapPin className="w-3 h-3 text-[var(--accent-crimson)] shrink-0" />
                <span>Pangong Lake · Ladakh</span>
              </span>
              <span>14,270 ft · 35mm</span>
            </div>

            <div className="relative h-[370px] sm:h-[420px] rounded-xl overflow-hidden bg-[#10243E] border border-[var(--border-hairline)]">
              <img
                src="assets/aistudio/56B251D4-5A1B-4FEF-A335-0F3652A45C71_dbe9f31d.JPG"
                alt="Vishvajeet Dhawale at Pangong Shore, Ladakh"
                loading="lazy"
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
                  objectPosition: '50% 72%',
                  imageOrientation: 'from-image',
                }}
                className="w-full h-full object-cover portrait-theme-grade"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0) 68%, rgba(10,18,30,0.55) 100%)',
                }}
              />
              <div className="pointer-events-none absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-white/95 font-mono-meta">
                <span>Vishvajeet Dhawale</span>
                <span className="px-2 py-0.5 rounded bg-black/45 backdrop-blur-xs text-[10px]">
                  Pangong Shore
                </span>
              </div>
            </div>

            <p className="font-literary italic text-xs sm:text-[13px] text-[var(--text-secondary)] px-1 leading-relaxed">
              “Cobalt water, sunlit terracotta mountains, and clear high-altitude air.”
            </p>
          </div>

          {/* Minimal Room Links (without 01, 02, 03 numbering) */}
          <div className="w-full max-w-[440px] mx-auto lg:max-w-none space-y-2.5 pt-1">
            <div className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-olive)]">
              Explore the Rooms
            </div>
            <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
              {(
                [
                  { tab: 'cinema', label: 'Cinema & Screening Log' },
                  { tab: 'football', label: 'Football · FC Barcelona' },
                  { tab: 'books', label: 'Books & Reading Room' },
                  { tab: 'writing', label: 'Philosophy & Writing' },
                  { tab: 'music', label: 'Music · Hindi, Marathi, Rock & Hip-Hop' },
                ] as const
              ).map((row) => (
                <button
                  key={row.tab}
                  type="button"
                  onClick={() => onNavigate(row.tab)}
                  className="corridor-flare-row w-full py-3 px-2 -mx-2 flex items-center justify-between text-left text-sm text-[var(--text-primary)] hover:text-[var(--accent-crimson)] transition-colors cursor-pointer"
                >
                  <span className="font-serif-editorial text-base sm:text-lg">{row.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
