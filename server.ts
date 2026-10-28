import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { INITIAL_ARCHIVE_DATA } from './src/data/initialArchive.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const ARCHIVE_FILE = path.join(DATA_DIR, 'archive.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ARCHIVE_FILE)) {
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(INITIAL_ARCHIVE_DATA, null, 2), 'utf-8');
  }
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readArchive() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(ARCHIVE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const firstTitle = String(parsed?.blog?.posts?.[0]?.title || '');
    const firstYtTitle = String(parsed?.youtubePlaylists?.[0]?.title || '');
    const hasTenQuiz = Array.isArray(parsed?.quiz) && parsed.quiz.length >= 10;
    const hasQuizRoasts = Array.isArray(parsed?.quizRoasts) && parsed.quizRoasts.length >= 10;
    const hasSpotifyPlaylists =
      Array.isArray(parsed?.spotifyPlaylists) && parsed.spotifyPlaylists.length === 3;
    if (
      firstTitle.startsWith('[Sample Note]') ||
      firstYtTitle !== 'Rare Finds' ||
      !hasTenQuiz ||
      !hasQuizRoasts ||
      !hasSpotifyPlaylists
    ) {
      fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(INITIAL_ARCHIVE_DATA, null, 2), 'utf-8');
      return INITIAL_ARCHIVE_DATA;
    }
    return parsed;
  } catch {
    return INITIAL_ARCHIVE_DATA;
  }
}

function writeArchive(data: unknown) {
  ensureDataDir();
  fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  deliveryMode: 'resend_email' | 'webhook' | 'local_inbox_only';
  externalDelivered: boolean;
}

function readMessages(): ContactSubmission[] {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeMessages(messages: ContactSubmission[]) {
  ensureDataDir();
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}

// Simple in-memory rate limit per IP for spam protection
const rateLimitMap = new Map<string, number[]>();

async function startServer() {
  ensureDataDir();
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // API: Archive CRUD
  app.get('/api/archive', (_req, res) => {
    const data = readArchive();
    res.json(data);
  });

  app.put('/api/archive', (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || !body.blog || !body.cinema) {
      res.status(400).json({ error: 'Invalid archive payload.' });
      return;
    }
    writeArchive(body);
    res.json({ ok: true, data: body });
  });

  app.post('/api/archive/reset', (_req, res) => {
    writeArchive(INITIAL_ARCHIVE_DATA);
    res.json({ ok: true, data: INITIAL_ARCHIVE_DATA });
  });

  // API: Contact delivery status & submissions
  app.get('/api/contact/config', (_req, res) => {
    const hasResend = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
    const hasWebhook = Boolean(process.env.CONTACT_WEBHOOK_URL);
    res.json({
      externalProviderConfigured: hasResend || hasWebhook,
      providerType: hasResend ? 'resend_email' : hasWebhook ? 'webhook' : 'local_inbox_only',
    });
  });

  app.get('/api/contact/messages', (_req, res) => {
    res.json({ messages: readMessages() });
  });

  app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message, website_honeypot } = req.body || {};

    // Honeypot check
    if (website_honeypot && String(website_honeypot).trim().length > 0) {
      res.status(200).json({ ok: true, spamFiltered: true });
      return;
    }

    // Rate limiting check (max 5 submissions per 10 minutes per IP)
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const recent = (rateLimitMap.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
    if (recent.length >= 5) {
      res.status(429).json({
        error: 'Too many messages sent recently. Please wait a few minutes and try again.',
      });
      return;
    }

    // Server-side validation
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim() : '';
    const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
    const cleanMessage = typeof message === 'string' ? message.trim() : '';

    if (cleanName.length < 2) {
      res.status(400).json({ error: 'Please enter your name (at least 2 characters).' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      res.status(400).json({ error: 'Please provide a valid email address so I can reply.' });
      return;
    }
    if (cleanMessage.length < 10) {
      res.status(400).json({
        error: 'Please write a slightly longer message (at least 10 characters).',
      });
      return;
    }
    if (cleanMessage.length > 5000) {
      res.status(400).json({ error: 'Message is too long (maximum 5,000 characters).' });
      return;
    }

    recent.push(now);
    rateLimitMap.set(ip, recent);

    const hasResend = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
    const hasWebhook = Boolean(process.env.CONTACT_WEBHOOK_URL);

    let deliveryMode: ContactSubmission['deliveryMode'] = 'local_inbox_only';
    let externalDelivered = false;
    let deliveryError: string | null = null;

    if (hasResend) {
      deliveryMode = 'resend_email';
      try {
        const resp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev',
            to: [process.env.CONTACT_TO_EMAIL],
            reply_to: cleanEmail,
            subject: cleanSubject
              ? `[Website Note] ${cleanSubject}`
              : `[Website Note] Message from ${cleanName}`,
            text: `From: ${cleanName} <${cleanEmail}>\nSubject: ${cleanSubject || '(None)'}\n\n${cleanMessage}`,
          }),
        });
        if (resp.ok) {
          externalDelivered = true;
        } else {
          const errText = await resp.text();
          deliveryError = `External email provider returned an error (${resp.status}): ${errText}`;
        }
      } catch (err) {
        deliveryError = err instanceof Error ? err.message : 'Failed to reach Resend API.';
      }
    } else if (hasWebhook && process.env.CONTACT_WEBHOOK_URL) {
      deliveryMode = 'webhook';
      try {
        const resp = await fetch(process.env.CONTACT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: cleanMessage,
            submittedAt: new Date().toISOString(),
          }),
        });
        if (resp.ok) {
          externalDelivered = true;
        } else {
          deliveryError = `Configured webhook returned HTTP ${resp.status}.`;
        }
      } catch (err) {
        deliveryError = err instanceof Error ? err.message : 'Failed to reach webhook URL.';
      }
    }

    const entry: ContactSubmission = {
      id: `msg-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      submittedAt: new Date().toISOString(),
      deliveryMode,
      externalDelivered,
    };

    const existing = readMessages();
    existing.unshift(entry);
    writeMessages(existing);

    res.status(200).json({
      ok: true,
      submission: entry,
      deliveryMode,
      externalDelivered,
      deliveryError,
    });
  });

  // SEO: robots.txt & sitemap.xml
  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const archive = readArchive();
    const staticSections = [
      '',
      '/?section=about',
      '/?section=interests',
      '/?section=cinema',
      '/?section=football',
      '/?section=books',
      '/?section=photography',
      '/?section=technology',
      '/?section=writing',
      '/?section=contact',
    ];
    const postUrls = (archive?.blog?.posts || [])
      .filter((p: { status: string }) => p.status === 'published')
      .map((p: { slug: string }) => `/?section=writing&post=${encodeURIComponent(p.slug)}`);

    const allUrls = [...staticSections, ...postUrls];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${baseUrl}${u}</loc>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;
    res.type('application/xml').send(xml);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
