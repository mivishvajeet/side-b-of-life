import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ArchiveData, PhotoEntry } from '../types/archive';
import { VisualFrameCanvas } from './VisualFrameCanvas';

interface PhotographySectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
}

export const PhotographySection: React.FC<PhotographySectionProps> = ({
  archive,
  authorMode = false,
  onUpdateArchive,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [newPhoto, setNewPhoto] = useState({
    title: '',
    caption: '',
    collection: 'Light & Quiet Streets',
    date: new Date().toISOString().slice(0, 7),
    location: '',
    cameraDetails: '',
    personalNote: '',
    aspectRatio: '16:9' as PhotoEntry['aspectRatio'],
    mediaType: 'photo' as PhotoEntry['mediaType'],
    mediaUrl: '',
    videoUrl: '',
    monochrome: false,
    isFeaturedOnHome: false,
  });

  const showSamples = archive.settings.showSampleEntries;

  const visiblePhotos = useMemo(
    () => archive.photography.items.filter((item) => showSamples || !item.isSample),
    [archive.photography.items, showSamples]
  );

  const collections = useMemo(
    () => ['All', ...Array.from(new Set(visiblePhotos.map((p) => p.collection)))],
    [visiblePhotos]
  );

  const filteredPhotos = useMemo(() => {
    if (selectedCollection === 'All') return visiblePhotos;
    return visiblePhotos.filter((p) => p.collection === selectedCollection);
  }, [visiblePhotos, selectedCollection]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredPhotos.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
        );
      }
    },
    [lightboxIndex, filteredPhotos.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewPhoto((prev) => ({ ...prev, mediaUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.title.trim()) return;
    const entry: PhotoEntry = {
      id: `ph-${Date.now()}`,
      title: newPhoto.title.trim(),
      caption: newPhoto.caption.trim() || newPhoto.title.trim(),
      collection: newPhoto.collection.trim() || 'Light & Quiet Streets',
      date: newPhoto.date.trim() || undefined,
      location: newPhoto.location.trim() || undefined,
      cameraDetails: newPhoto.cameraDetails.trim() || undefined,
      personalNote: newPhoto.personalNote.trim(),
      aspectRatio: newPhoto.aspectRatio,
      mediaType: newPhoto.mediaType,
      mediaUrl: newPhoto.mediaUrl.trim() || undefined,
      videoUrl: newPhoto.videoUrl.trim() || undefined,
      monochrome: newPhoto.monochrome,
      visualCompositionType: 'dusk-streetlamp',
      isFeaturedOnHome: newPhoto.isFeaturedOnHome,
      isSample: false,
    };

    onUpdateArchive((prev) => {
      const updatedItems = prev.photography.items.map((item) =>
        entry.isFeaturedOnHome ? { ...item, isFeaturedOnHome: false } : item
      );
      return {
        ...prev,
        photography: {
          items: [entry, ...updatedItems],
        },
      };
    });

    setNewPhoto({
      title: '',
      caption: '',
      collection: 'Light & Quiet Streets',
      date: new Date().toISOString().slice(0, 7),
      location: '',
      cameraDetails: '',
      personalNote: '',
      aspectRatio: '16:9',
      mediaType: 'photo',
      mediaUrl: '',
      videoUrl: '',
      monochrome: false,
      isFeaturedOnHome: false,
    });
    setShowAddForm(false);
  };

  const handleSetFeaturedOnHome = (id: string) => {
    onUpdateArchive((prev) => ({
      ...prev,
      photography: {
        items: prev.photography.items.map((item) => ({
          ...item,
          isFeaturedOnHome: item.id === id,
        })),
      },
    }));
  };

  const activeLightboxItem =
    lightboxIndex !== null && filteredPhotos[lightboxIndex]
      ? filteredPhotos[lightboxIndex]
      : null;

  return (
    <div className="space-y-20">
      {/* Header */}
      <header className="border-b border-[var(--border-hairline)] pb-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-baseline">
        <div className="md:col-span-2 font-mono-meta text-xs text-[var(--accent-crimson)]">
          05 · FRAMES
        </div>
        <div className="md:col-span-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <h1 className="font-serif-editorial text-4xl md:text-5xl font-normal tracking-tight text-[var(--text-primary)] text-balance">
                Frames
              </h1>
              <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed text-pretty">
                Moments that suggest a story, even when nothing much is happening—photographs,
                light studies, and quiet everyday frames. Click any frame to inspect.
              </p>
            </div>

            {/* Minimal slash-separated collection filter */}
            <div className="flex flex-wrap items-center gap-y-2 text-xs font-mono-meta shrink-0">
              {collections.map((col, idx) => (
                <React.Fragment key={col}>
                  {idx > 0 && <span className="mx-2.5 text-[var(--text-muted)]">/</span>}
                  <button
                    type="button"
                    onClick={() => setSelectedCollection(col)}
                    className={`transition-colors ${
                      selectedCollection === col
                        ? 'text-[var(--accent)] underline underline-offset-4'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {col}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>

          {authorMode && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3.5 py-1.5 text-xs font-mono-meta border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent)]"
              >
                {showAddForm ? 'Close Form' : '+ Add Photograph / Video'}
              </button>
            </div>
          )}

          {authorMode && showAddForm && (
            <form
              onSubmit={handleAddPhoto}
              className="mt-6 p-6 diner-booth-panel space-y-4 max-w-2xl"
            >
              <div className="text-sm font-medium text-[var(--text-primary)]">
                Add a Photograph or Short Video
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhoto.title}
                    onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">
                    Series
                  </label>
                  <input
                    type="text"
                    value={newPhoto.collection}
                    onChange={(e) => setNewPhoto({ ...newPhoto, collection: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={newPhoto.aspectRatio}
                    onChange={(e) =>
                      setNewPhoto({
                        ...newPhoto,
                        aspectRatio: e.target.value as PhotoEntry['aspectRatio'],
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                  >
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="4:3">4:3 (35mm)</option>
                    <option value="3:4">3:4 (Vertical)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">
                    Upload Local Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLocalFileSelect}
                    className="w-full text-xs text-[var(--text-secondary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">
                    Or Image URL
                  </label>
                  <input
                    type="url"
                    value={newPhoto.mediaUrl}
                    onChange={(e) => setNewPhoto({ ...newPhoto, mediaUrl: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Caption</label>
                <input
                  type="text"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-[var(--accent)] text-[#080808]"
                >
                  Save Frame
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

      {/* Asymmetric Contact-Sheet Gallery */}
      <div className="space-y-20">
        {filteredPhotos.map((photo, idx) => (
          <figure
            key={photo.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-16 border-b border-[var(--border-hairline)] last:border-b-0"
          >
            <div
              onClick={() => setLightboxIndex(idx)}
              className="lg:col-span-8 cursor-pointer"
            >
              <VisualFrameCanvas
                title={photo.title}
                caption={photo.caption}
                aspectRatio={photo.aspectRatio}
                mediaType={photo.mediaType}
                mediaUrl={photo.mediaUrl}
                videoUrl={photo.videoUrl}
                monochrome={photo.monochrome}
                compositionType={photo.visualCompositionType}
                onManageClick={authorMode ? () => setShowAddForm(true) : undefined}
              />
            </div>

            <figcaption className="lg:col-span-4 space-y-4">
              <div className="font-mono-meta text-xs text-[var(--accent-crimson)]">
                FRAME 0{idx + 1} · {photo.collection}
              </div>
              <h2 className="font-serif-editorial text-3xl font-normal text-[var(--text-primary)]">
                {photo.title}
              </h2>
              <p className="font-serif-editorial italic text-xl text-[var(--text-secondary)] leading-snug">
                {photo.caption}
              </p>
              {photo.personalNote && (
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {photo.personalNote}
                </p>
              )}
              <div className="pt-2 border-t border-[var(--border-hairline)] font-mono-meta text-xs text-[var(--text-muted)] space-y-1">
                {photo.cameraDetails && <div>{photo.cameraDetails}</div>}
                {photo.date && (
                  <div>
                    {photo.location ? `${photo.location} · ` : ''}
                    {photo.date}
                  </div>
                )}
              </div>

              <div className="pt-1 flex items-center gap-4 text-xs font-mono-meta">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className="text-[var(--accent)] hover:underline underline-offset-4"
                >
                  Inspect frame ↗
                </button>
                {authorMode && !photo.isFeaturedOnHome && (
                  <button
                    type="button"
                    onClick={() => handleSetFeaturedOnHome(photo.id)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
                  >
                    Feature on homepage
                  </button>
                )}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Accessible Keyboard Lightbox */}
      {activeLightboxItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.title}
          className="fixed inset-0 z-50 bg-[#080808]/95 flex flex-col justify-between p-6 md:p-10"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="flex items-center justify-between text-xs font-mono-meta text-[var(--text-secondary)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[var(--accent)]">
                0{lightboxIndex + 1} / 0{filteredPhotos.length}
              </span>
              <span className="mx-3">·</span>
              <span>{activeLightboxItem.title}</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                  )
                }
                className="hover:text-[var(--accent)]"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)}
                className="hover:text-[var(--accent)]"
              >
                Next →
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="text-[var(--text-primary)] hover:text-[var(--accent-crimson)]"
              >
                Close [Esc]
              </button>
            </div>
          </div>

          <div
            className="max-w-4xl w-full mx-auto my-auto py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <VisualFrameCanvas
              title={activeLightboxItem.title}
              caption={activeLightboxItem.caption}
              aspectRatio={activeLightboxItem.aspectRatio}
              mediaType={activeLightboxItem.mediaType}
              mediaUrl={activeLightboxItem.mediaUrl}
              videoUrl={activeLightboxItem.videoUrl}
              monochrome={activeLightboxItem.monochrome}
              compositionType={activeLightboxItem.visualCompositionType}
            />
          </div>

          <div
            className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-serif-editorial italic text-lg text-[var(--text-primary)]">
              {activeLightboxItem.caption}
            </p>
            <span className="font-mono-meta text-[var(--text-muted)]">
              {activeLightboxItem.cameraDetails}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
