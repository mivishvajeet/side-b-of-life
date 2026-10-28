import React from 'react';

export function isDevanagariText(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

export function calculateReadingStats(content: string): {
  words: number;
  minutes: number;
  label: string;
} {
  const cleaned = content
    .replace(/[#>*_`~-]/g, ' ')
    .trim();
  if (!cleaned) {
    return { words: 0, minutes: 1, label: '1 min read' };
  }
  const words = cleaned.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return {
    words,
    minutes,
    label: `${minutes} min read`,
  };
}

export function updateDocumentMeta(title: string, description: string, urlPath?: string) {
  document.title = title;
  const setMeta = (selector: string, content: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.setAttribute('content', content);
    }
  };
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);

  if (urlPath !== undefined) {
    const targetUrl = `${window.location.origin}${urlPath}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', targetUrl);
  }
}

export type MarathiFontStyle =
  | 'granth'
  | 'eczar'
  | 'mudran'
  | 'rozha'
  | 'yatra'
  | 'kalam'
  | 'mukta';

export type KindlePaperTheme = 'default' | 'paperwhite' | 'sepia' | 'sage' | 'night';

export type ReaderLineSpacing = 'compact' | 'relaxed' | 'spacious';

export interface EditorialRenderOptions {
  marathiFontStyle?: MarathiFontStyle;
  fontSizePx?: number;
  lineSpacing?: ReaderLineSpacing;
  kindleTheme?: KindlePaperTheme;
}

export function getMarathiFontClass(style: MarathiFontStyle = 'granth'): string {
  switch (style) {
    case 'eczar':
      return 'font-marathi-eczar';
    case 'mudran':
      return 'font-marathi-mudran';
    case 'rozha':
      return 'font-marathi-display';
    case 'yatra':
      return 'font-marathi-yatra';
    case 'kalam':
      return 'font-marathi-kalam';
    case 'mukta':
      return 'font-marathi-mukta';
    case 'granth':
    default:
      return 'font-marathi-granth';
  }
}

function renderInlineFormatting(
  text: string,
  accentColorClass: string
): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return React.createElement(
        'strong',
        { key: idx, className: 'font-semibold' },
        part.slice(2, -2)
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return React.createElement(
        'em',
        {
          key: idx,
          className: `italic text-[1.03em] font-medium px-0.5 ${accentColorClass}`,
        },
        part.slice(1, -1)
      );
    }
    return part;
  });
}

export function renderEditorialMarkdown(
  markdown: string,
  optionsOrFont: EditorialRenderOptions | MarathiFontStyle = 'granth'
): React.ReactNode {
  const opts: EditorialRenderOptions =
    typeof optionsOrFont === 'string'
      ? { marathiFontStyle: optionsOrFont }
      : optionsOrFont;

  const marathiFontStyle = opts.marathiFontStyle || 'granth';
  const fontSizePx = opts.fontSizePx || 20;
  const lineSpacing = opts.lineSpacing || 'relaxed';
  const kindleTheme = opts.kindleTheme || 'default';

  const blocks = markdown.trim().split(/\n\s*\n/);
  const hasDevanagari = isDevanagariText(markdown);

  const bodyFontClass = hasDevanagari
    ? getMarathiFontClass(marathiFontStyle)
    : 'font-literary';

  const headingFontClass =
    marathiFontStyle === 'yatra'
      ? 'font-marathi-yatra'
      : marathiFontStyle === 'kalam'
      ? 'font-marathi-kalam'
      : marathiFontStyle === 'eczar'
      ? 'font-marathi-eczar font-semibold'
      : marathiFontStyle === 'mukta'
      ? 'font-marathi-mukta font-bold'
      : 'font-marathi-display';

  const lineHeightValue =
    lineSpacing === 'compact'
      ? 1.68
      : lineSpacing === 'spacious'
      ? 2.15
      : hasDevanagari
      ? 1.9
      : 1.8;

  const accentColorClass =
    kindleTheme === 'sepia'
      ? 'text-[#8B2E1D]'
      : kindleTheme === 'paperwhite'
      ? 'text-[#7A2418]'
      : kindleTheme === 'sage'
      ? 'text-[#1D5436]'
      : kindleTheme === 'night'
      ? 'text-[#E5A95C]'
      : 'text-[var(--accent-crimson)]';

  const verseBoxClass =
    kindleTheme === 'sepia'
      ? 'bg-[#EADBC0]/75 border-[#CBB48C]'
      : kindleTheme === 'paperwhite'
      ? 'bg-[#ECEAE2] border-[#D2CFC4]'
      : kindleTheme === 'sage'
      ? 'bg-[#DCE8DC] border-[#B8CEB8]'
      : kindleTheme === 'night'
      ? 'bg-[#1B1E24] border-[#2E343E]'
      : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)]';

  const mobileMinPx = Math.max(16, Math.round(fontSizePx * 0.9));

  return React.createElement(
    'div',
    {
      style: {
        fontSize: `clamp(${mobileMinPx}px, calc(${mobileMinPx}px + 0.6vw), ${fontSizePx}px)`,
        lineHeight: lineHeightValue,
      },
      className: `${bodyFontClass} space-y-5 sm:space-y-6 max-w-[68ch] transition-all duration-200`,
    },
    blocks.map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('### ')) {
        const headingText = trimmed.replace(/^###\s+/, '');
        const isMarathiHeading = isDevanagariText(headingText);
        const h3Max = Math.round(fontSizePx * 1.24);
        const h3Min = Math.max(18, Math.round(fontSizePx * 1.06));
        return React.createElement(
          'h3',
          {
            key: index,
            style: { fontSize: `clamp(${h3Min}px, calc(${h3Min}px + 0.8vw), ${h3Max}px)` },
            className: isMarathiHeading
              ? `${headingFontClass} font-normal ${accentColorClass} pt-5 sm:pt-6 pb-2 border-b border-current/15 flex items-center gap-2 leading-snug`
              : `font-display font-semibold tracking-tight ${accentColorClass} pt-4 pb-1 text-balance`,
          },
          isMarathiHeading
            ? [
                React.createElement(
                  'span',
                  {
                    key: 'ornament',
                    className: 'text-xs opacity-65 font-mono-meta select-none shrink-0',
                  },
                  '॥'
                ),
                React.createElement('span', { key: 'text' }, headingText),
              ]
            : headingText
        );
      }

      if (trimmed.startsWith('## ')) {
        const h2Max = Math.round(fontSizePx * 1.38);
        const h2Min = Math.max(20, Math.round(fontSizePx * 1.14));
        return React.createElement(
          'h2',
          {
            key: index,
            style: { fontSize: `clamp(${h2Min}px, calc(${h2Min}px + 1vw), ${h2Max}px)` },
            className: 'font-serif-editorial font-normal pt-5 pb-1 tracking-tight text-balance',
          },
          trimmed.replace(/^##\s+/, '')
        );
      }

      if (trimmed.startsWith('>')) {
        const lines = trimmed
          .split('\n')
          .map((l) => l.replace(/^>\s?/, '').trim())
          .filter(Boolean);
        const isMarathiBlockquote = lines.some((l) => isDevanagariText(l));
        const isMarathiPoem = isMarathiBlockquote && lines.length >= 5;
        const verseMax = Math.round(fontSizePx * 1.06);
        const verseMin = Math.max(16, Math.round(fontSizePx * 0.92));

        return React.createElement(
          'blockquote',
          {
            key: index,
            className: isMarathiBlockquote
              ? `my-6 sm:my-8 p-4 sm:p-6 md:p-7 rounded-xl border space-y-2 relative overflow-hidden ${verseBoxClass}`
              : 'my-6 sm:my-8 py-5 border-y border-current/15 font-serif-editorial italic text-[1.12em] leading-[1.4]',
          },
          isMarathiBlockquote
            ? [
                ...(isMarathiPoem
                  ? [
                      React.createElement(
                        'div',
                        {
                          key: 'verse-badge',
                          className: `font-mono-meta text-[10px] tracking-wider ${accentColorClass} pb-2 flex items-center justify-between border-b border-current/15 mb-2.5`,
                        },
                        React.createElement('span', null, 'काव्यपंक्ती · Verse'),
                        React.createElement('span', null, '॥ मराठी कविता ॥')
                      ),
                    ]
                  : []),
                ...lines.map((line, lIdx) =>
                  React.createElement(
                    'p',
                    {
                      key: lIdx,
                      style: { fontSize: `clamp(${verseMin}px, calc(${verseMin}px + 0.6vw), ${verseMax}px)` },
                      className: `${headingFontClass} leading-[1.7]`,
                    },
                    renderInlineFormatting(line, accentColorClass)
                  )
                ),
              ]
            : lines.map((line, lIdx) =>
                React.createElement(
                  'p',
                  {
                    key: lIdx,
                    className:
                      line.startsWith('—') || line.startsWith('--')
                        ? `mt-2.5 font-mono-meta not-italic text-xs tracking-wide ${accentColorClass}`
                        : '',
                  },
                  renderInlineFormatting(line, accentColorClass)
                )
              )
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').map((l) => l.replace(/^\d+\.\s+/, '').trim());
        return React.createElement(
          'ol',
          {
            key: index,
            className: 'list-decimal list-inside space-y-2 pl-1',
          },
          items.map((item, iIdx) =>
            React.createElement(
              'li',
              { key: iIdx, className: 'leading-relaxed' },
              renderInlineFormatting(item, accentColorClass)
            )
          )
        );
      }

      if (/^[-*]\s/.test(trimmed)) {
        const items = trimmed.split('\n').map((l) => l.replace(/^[-*]\s+/, '').trim());
        return React.createElement(
          'ul',
          {
            key: index,
            className: 'list-disc list-inside space-y-2 pl-1',
          },
          items.map((item, iIdx) =>
            React.createElement(
              'li',
              { key: iIdx, className: 'leading-relaxed' },
              renderInlineFormatting(item, accentColorClass)
            )
          )
        );
      }

      return React.createElement(
        'p',
        {
          key: index,
          className: 'text-pretty',
        },
        renderInlineFormatting(trimmed, accentColorClass)
      );
    })
  );
}
