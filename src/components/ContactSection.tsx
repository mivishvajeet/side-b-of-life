import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Mail,
  ArrowUpRight,
  Sparkles,
  Film,
  BookOpen,
  Trophy,
  Feather,
  MessageSquare,
  CheckCircle2,
  Inbox,
  Plus,
  Trash2,
} from 'lucide-react';
import { ArchiveData, SocialLink } from '../types/archive';

interface ContactSectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
}

interface DeliveryConfig {
  externalProviderConfigured: boolean;
  providerType: 'resend_email' | 'webhook' | 'local_inbox_only';
}

interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  deliveryMode: string;
  externalDelivered: boolean;
}

const TOPIC_STAMPS = [
  {
    id: 'cinema',
    label: 'Film recommendation',
    defaultSubject: 'A film you should watch',
    prompt: 'Tell me the film, director, or a scene you couldn’t stop thinking about...',
    Icon: Film,
  },
  {
    id: 'books',
    label: 'Book on my desk',
    defaultSubject: 'A book recommendation / reading note',
    prompt: 'Marathi literature, Russian fiction, history, or a book that stayed with you...',
    Icon: BookOpen,
  },
  {
    id: 'football',
    label: 'Football & Barça',
    defaultSubject: 'Talking football & Champions League nights',
    prompt: 'Camp Nou memories, tactical debates, or shared Champions League heartbreak...',
    Icon: Trophy,
  },
  {
    id: 'philosophy',
    label: 'Philosophy & life',
    defaultSubject: 'A thought or question worth sitting with',
    prompt: 'Stoicism, overthinking at 2 AM, or an idea you’ve been turning over...',
    Icon: Feather,
  },
  {
    id: 'hello',
    label: 'Just saying hello',
    defaultSubject: 'Hello from the archive',
    prompt: 'Write whatever is on your mind — no formal intro needed...',
    Icon: MessageSquare,
  },
] as const;

export const ContactSection: React.FC<ContactSectionProps> = ({
  archive,
  authorMode = false,
  onUpdateArchive,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('cinema');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('A film you should watch');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    deliveryMode: string;
    externalDelivered: boolean;
    deliveryError?: string | null;
  } | null>(null);

  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfig | null>(null);
  const [showInbox, setShowInbox] = useState(false);
  const [messages, setMessages] = useState<StoredMessage[]>([]);

  const [showSocialEditor, setShowSocialEditor] = useState(false);
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  useEffect(() => {
    fetch('/api/contact/config')
      .then((r) => r.json())
      .then((data) => setDeliveryConfig(data))
      .catch(() => {});
  }, []);

  const activeTopic =
    TOPIC_STAMPS.find((t) => t.id === selectedTopicId) || TOPIC_STAMPS[0];

  const handleSelectTopic = (topic: (typeof TOPIC_STAMPS)[number]) => {
    setSelectedTopicId(topic.id);
    setSubject(topic.defaultSubject);
  };

  const loadInboxMessages = () => {
    fetch('/api/contact/messages')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmittedResult(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (cleanName.length < 2) {
      setErrorMessage('Please enter your name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address so I can write back.');
      return;
    }
    if (cleanMessage.length < 10) {
      setErrorMessage('Please write a slightly longer note (at least 10 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          subject: subject.trim() || activeTopic.defaultSubject,
          message: cleanMessage,
          website_honeypot: honeypot,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setErrorMessage(data.error || 'Could not submit your message. Please try again.');
      } else {
        setSubmittedResult({
          deliveryMode: data.deliveryMode,
          externalDelivered: Boolean(data.externalDelivered),
          deliveryError: data.deliveryError,
        });
        setName('');
        setEmail('');
        setMessage('');
        if (showInbox) {
          loadInboxMessages();
        }
      }
    } catch {
      setErrorMessage('Network error while sending your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialLabel.trim() || !newSocialUrl.trim()) return;
    const entry: SocialLink = {
      id: `soc-${Date.now()}`,
      label: newSocialLabel.trim(),
      url: newSocialUrl.trim(),
    };
    onUpdateArchive((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        socialLinks: [...prev.settings.socialLinks, entry],
      },
    }));
    setNewSocialLabel('');
    setNewSocialUrl('');
  };

  const handleRemoveSocialLink = (id: string) => {
    onUpdateArchive((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        socialLinks: prev.settings.socialLinks.filter((s) => s.id !== id),
      },
    }));
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="border-b border-[var(--border-hairline)] pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-crimson)]">
            <Mail className="w-3.5 h-3.5" />
            <span>03 · Personal Correspondence</span>
          </div>
          <h1 className="font-serif-editorial editorial-hero-display font-normal text-[var(--text-primary)]">
            Send a note to my desk
          </h1>
          <p className="editorial-body text-[var(--text-secondary)]">
            An underrated film, a Marathi or Russian novel worth reading, a Champions League memory,
            or a question you’ve been thinking about — I read every note personally.
          </p>
        </div>

        <div className="font-mono-meta text-[11px] text-[var(--text-muted)] flex items-center gap-3 self-start lg:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-olive)]" />
            <span>Direct Inbox · Replies from India</span>
          </span>
        </div>
      </header>

      {/* Main Two-Column Correspondence Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Interactive Postcard & Dispatch Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[var(--bg-canvas)]/70 border border-[var(--border-hairline)] p-5 sm:p-7 space-y-6 tactile-card-shadow relative overflow-hidden">
            {/* Top Postcard Stamp Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-4">
              <div>
                <div className="font-mono-meta text-[11px] uppercase tracking-wider text-[var(--accent-crimson)]">
                  Step 01 · Pick a Conversation Stamp
                </div>
                <p className="editorial-body-sm text-[var(--text-secondary)] mt-0.5">
                  Choose what your note is about, or write freely below.
                </p>
              </div>
              <div className="px-2.5 py-1 rounded border border-dashed border-[var(--border-strong)] font-mono-meta text-[10px] text-[var(--text-muted)]">
                TO: VISHVAJEET DHAWALE
              </div>
            </div>

            {/* Interactive Topic Stamps */}
            <div className="flex flex-wrap gap-2">
              {TOPIC_STAMPS.map((topic) => {
                const Icon = topic.Icon;
                const isSelected = selectedTopicId === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-meta border transition-all ${
                      isSelected
                        ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)] shadow-xs'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{topic.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5 pt-1">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_honeypot">Leave this field blank</label>
                <input
                  id="website_honeypot"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-name"
                    className="block font-mono-meta text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How should I address you?"
                    className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-crimson)] focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-email"
                    className="block font-mono-meta text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
                  >
                    Reply-To Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-crimson)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Subject Line */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-subject"
                  className="block font-mono-meta text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
                >
                  Subject Line
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="A film recommendation, a question, or nothing in particular"
                  className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-crimson)] focus:outline-none transition-colors"
                />
              </div>

              {/* Message Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="contact-message"
                    className="block font-mono-meta text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
                  >
                    Your Note *
                  </label>
                  <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                    {message.length > 0 ? `${message.length} chars` : 'Min 10 chars'}
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={activeTopic.prompt}
                  className="w-full px-3.5 py-3 rounded-xl text-base sm:text-sm bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-crimson)] focus:outline-none transition-colors leading-relaxed resize-y"
                />
              </div>

              {/* Validation Error */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    role="alert"
                    className="p-3.5 rounded-xl border border-[var(--accent-crimson)]/40 bg-[var(--accent-crimson)]/10 text-xs text-[var(--text-primary)]"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Confirmation */}
              <AnimatePresence>
                {submittedResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    role="status"
                    className="p-4 rounded-xl border border-[var(--accent-olive)]/50 bg-[var(--bg-surface)] space-y-1.5"
                  >
                    <div className="inline-flex items-center gap-2 text-xs font-mono-meta text-[var(--accent-olive)]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>DISPATCH RECORDED · THANK YOU</span>
                    </div>
                    <p className="font-serif-editorial text-lg text-[var(--text-primary)]">
                      Your note has been placed on my desk.
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {submittedResult.externalDelivered
                        ? 'Delivered straight to my inbox. I’ll read it and write back soon.'
                        : 'Saved safely in the archive inbox. I’ll read it soon.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-hairline)]">
                <span className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                  No mailing lists · Just one-to-one conversation
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-display font-medium bg-[var(--text-primary)] text-[var(--bg-surface)] hover:bg-[var(--accent-crimson)] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Sending Note...' : 'Send Note'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 5 Cols: Elsewhere & What to Write About */}
        <aside className="lg:col-span-5 space-y-5">
          {/* Card 1: Good Excuses to Write */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-canvas)]/55 border border-[var(--border-hairline)] space-y-4">
            <div className="inline-flex items-center gap-1.5 font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-crimson)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Good Excuses to Write</span>
            </div>

            <h2 className="font-serif-editorial editorial-sub-heading text-[var(--text-primary)]">
              Not sure what to say? Start with one of these:
            </h2>

            <ul className="space-y-3.5 editorial-body-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2.5">
                <span className="font-mono-meta text-xs text-[var(--accent-crimson)] mt-0.5 shrink-0">
                  01
                </span>
                <span>
                  A movie scene you still think about, even though it's been years since you watched
                  it.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono-meta text-xs text-[var(--accent-crimson)] mt-0.5 shrink-0">
                  02
                </span>
                <span>
                  A song you discovered by accident and now refuse to let anyone forget.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono-meta text-xs text-[var(--accent-crimson)] mt-0.5 shrink-0">
                  03
                </span>
                <span>
                  A completely unnecessary debate about football, philosophy, or why your favourite
                  book deserves more attention than it gets.
                </span>
              </li>
            </ul>
          </div>

          {/* Card 2: External Notebooks & Social Channels */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono-meta text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Public Notebooks & Links
              </span>
              {authorMode && (
                <button
                  type="button"
                  onClick={() => setShowSocialEditor(!showSocialEditor)}
                  className="text-[11px] font-mono-meta text-[var(--accent-crimson)] underline underline-offset-4"
                >
                  {showSocialEditor ? 'Done' : '+ Edit Links'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="https://letterboxd.com/mivishvajeet/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[var(--bg-canvas)]/70 border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                    557 FILMS · 11 LISTS
                  </div>
                  <div className="font-serif-editorial text-base text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)]">
                    Letterboxd
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-crimson)]" />
              </a>

              <a
                href="https://www.goodreads.com/user/show/72865569-vishvajeet-dhawale"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[var(--bg-canvas)]/70 border border-[var(--border-hairline)] hover:border-[var(--accent-crimson)] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                    READING ARCHIVE
                  </div>
                  <div className="font-serif-editorial text-base text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)]">
                    Goodreads
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-crimson)]" />
              </a>
            </div>

            {archive.settings.socialLinks.length > 0 && (
              <div className="pt-2 border-t border-[var(--border-hairline)] space-y-2">
                {archive.settings.socialLinks.map((soc) => (
                  <div
                    key={soc.id}
                    className="flex items-center justify-between text-xs py-1 text-[var(--text-secondary)]"
                  >
                    <a
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--accent-crimson)] inline-flex items-center gap-1.5"
                    >
                      <span>{soc.label}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                    {authorMode && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(soc.id)}
                        className="text-[var(--text-muted)] hover:text-[var(--accent-crimson)]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {authorMode && showSocialEditor && (
              <form
                onSubmit={handleAddSocialLink}
                className="pt-3 border-t border-[var(--border-hairline)] space-y-2.5"
              >
                <input
                  type="text"
                  placeholder="Label (e.g. Instagram, X)"
                  value={newSocialLabel}
                  onChange={(e) => setNewSocialLabel(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono-meta bg-[var(--text-primary)] text-[var(--bg-surface)]"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Link</span>
                </button>
              </form>
            )}
          </div>

          {/* Author Mode Local Inbox Drawer */}
          {authorMode && (
            <div className="p-5 rounded-2xl bg-[var(--bg-canvas)]/55 border border-[var(--border-hairline)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono-meta text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Archive Inbox ({deliveryConfig?.providerType || 'local'})</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !showInbox;
                    setShowInbox(next);
                    if (next) loadInboxMessages();
                  }}
                  className="text-xs font-mono-meta text-[var(--accent-crimson)] underline underline-offset-4"
                >
                  {showInbox ? 'Hide Messages' : 'View Messages'}
                </button>
              </div>

              {showInbox && (
                <div className="space-y-2.5 pt-2 border-t border-[var(--border-hairline)] max-h-72 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] italic">
                      No messages recorded yet.
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono-meta text-[var(--text-muted)]">
                          <span>
                            {msg.name} ({msg.email})
                          </span>
                          <span>{new Date(msg.submittedAt).toLocaleDateString()}</span>
                        </div>
                        {msg.subject && (
                          <div className="text-xs font-medium text-[var(--text-primary)]">
                            {msg.subject}
                          </div>
                        )}
                        <p className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
