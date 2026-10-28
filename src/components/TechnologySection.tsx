import React, { useState, useMemo } from 'react';
import { ArchiveData, TechEntry } from '../types/archive';

interface TechnologySectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
}

export const TechnologySection: React.FC<TechnologySectionProps> = ({
  archive,
  authorMode = false,
  onUpdateArchive,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Concept Explored' as TechEntry['category'],
    summary: '',
    details: '',
    linkUrl: '',
    tags: 'Web, Architecture',
  });

  const showSamples = archive.settings.showSampleEntries;

  const visibleItems = useMemo(
    () => archive.technology.items.filter((i) => showSamples || !i.isSample),
    [archive.technology.items, showSamples]
  );

  const categories = [
    'All',
    'Interesting Technology',
    'Concept Explored',
    'Small Experiment',
    'Learning Note',
  ];

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return visibleItems;
    return visibleItems.filter((i) => i.category === selectedCategory);
  }, [visibleItems, selectedCategory]);

  const handleAddTechItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim() || !newItem.summary.trim()) return;
    const entry: TechEntry = {
      id: `tc-${Date.now()}`,
      title: newItem.title.trim(),
      category: newItem.category,
      summary: newItem.summary.trim(),
      details: newItem.details.trim(),
      linkUrl: newItem.linkUrl.trim() || undefined,
      date: new Date().toISOString().slice(0, 10),
      tags: newItem.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isSample: false,
    };
    onUpdateArchive((prev) => ({
      ...prev,
      technology: {
        items: [entry, ...prev.technology.items],
      },
    }));
    setNewItem({
      title: '',
      category: 'Concept Explored',
      summary: '',
      details: '',
      linkUrl: '',
      tags: 'Web, Architecture',
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-20">
      <header className="border-b border-[var(--border-hairline)] pb-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-baseline">
        <div className="md:col-span-2 font-mono-meta text-xs text-[var(--accent-crimson)]">
          05 · TECHNOLOGY
        </div>
        <div className="md:col-span-10 space-y-6">
          <div className="max-w-2xl space-y-4">
            <h1 className="font-serif-editorial halation-heading text-4xl md:text-5xl font-normal tracking-tight text-[var(--text-primary)] text-balance">
              I don’t remember everything I learn. I still want to know how things work.
            </h1>
            <p className="text-base md:text-[17px] text-[var(--text-secondary)] leading-relaxed text-pretty">
              A notebook for technology discoveries, unfamiliar concepts I have recently explored,
              small experiments, and learning notes—without inflated claims of mastery.
            </p>
          </div>

          {/* Minimal slash-separated filter line */}
          <div className="flex flex-wrap items-center gap-y-2 text-xs font-mono-meta pt-2">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat}>
                {idx > 0 && <span className="mx-2.5 text-[var(--text-muted)]">/</span>}
                <button
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`transition-colors ${
                    selectedCategory === cat
                      ? 'text-[var(--accent)] underline underline-offset-4'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {cat}
                </button>
              </React.Fragment>
            ))}
          </div>

          {authorMode && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3.5 py-1.5 text-xs font-mono-meta border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent)]"
              >
                {showAddForm ? 'Close Form' : '+ Log a Concept / Experiment'}
              </button>
            </div>
          )}

          {authorMode && showAddForm && (
            <form
              onSubmit={handleAddTechItem}
              className="mt-6 p-6 diner-booth-panel space-y-4 max-w-2xl"
            >
              <div className="text-sm font-medium text-[var(--text-primary)]">
                Add a Technology Note
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">Type</label>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        category: e.target.value as TechEntry['category'],
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                  >
                    <option value="Interesting Technology">Interesting Technology</option>
                    <option value="Concept Explored">Concept Explored</option>
                    <option value="Small Experiment">Small Experiment</option>
                    <option value="Learning Note">Learning Note</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Short Summary *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.summary}
                  onChange={(e) => setNewItem({ ...newItem, summary: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  What I learned / explored
                </label>
                <textarea
                  rows={3}
                  value={newItem.details}
                  onChange={(e) => setNewItem({ ...newItem, details: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-[var(--accent)] text-[#080808]"
                >
                  Save Note
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </header>

      <div className="divide-y divide-[var(--border-hairline)] border-b border-[var(--border-hairline)]">
        {filteredItems.map((item, idx) => (
          <article
            key={item.id}
            className="corridor-flare-row py-10 px-3 -mx-3 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline"
          >
            <div className="md:col-span-4 space-y-1.5">
              <div className="font-mono-meta text-xs text-[var(--accent-crimson)]">
                0{idx + 1} · {item.category}
              </div>
              <div className="font-mono-meta text-xs text-[var(--text-muted)]">{item.date}</div>
              <div className="font-mono-meta text-[11px] text-[var(--accent-olive)] pt-1">
                {item.tags.join(' · ')}
              </div>
            </div>

            <div className="md:col-span-8 space-y-3 max-w-2xl">
              <h2 className="font-serif-editorial text-2xl md:text-3xl font-normal text-[var(--text-primary)] leading-snug">
                {item.title}
              </h2>
              <p className="font-serif-editorial italic text-xl text-[var(--accent)] leading-snug">
                {item.summary}
              </p>
              {item.details && (
                <p className="text-sm md:text-[15px] text-[var(--text-secondary)] leading-[1.85]">
                  {item.details}
                </p>
              )}
              {item.linkUrl && (
                <div className="pt-1">
                  <a
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono-meta text-[var(--accent)] underline underline-offset-4"
                  >
                    Reference / Source ↗
                  </a>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
