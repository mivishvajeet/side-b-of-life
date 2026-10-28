import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Bookmark,
  Search,
  ArrowUpRight,
  Star,
  Plus,
  Quote,
  Library,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Table,
  LayoutGrid,
  LampDesk,
  Shuffle,
  X,
} from 'lucide-react';
import { ArchiveData, BookEntry, ReadingPassage } from '../types/archive';
import { BOOK_BEST_LINES } from '../data/bookBestLines';

interface BooksSectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
}

export interface GoodreadsBookRecord {
  id: string;
  callNo: string;
  title: string;
  author: string;
  avgRating: number;
  myRating?: number;
  shelf: 'reading' | 'finished' | 'want_to_read';
  progressPercent?: number;
  dateRead: string;
  dateAdded: string;
  language: 'English' | 'Marathi' | 'Hindi' | 'Translated';
  note?: string;
}

const READING_PROGRESS_PRESETS: Record<string, number> = {
  'gr-4': 68,
  'gr-8': 54,
  'gr-10': 74,
  'gr-13': 42,
  'gr-16': 61,
  'gr-18': 82,
  'gr-32': 37,
  'gr-38': 64,
  'gr-49': 48,
  'gr-96': 76,
};

function getBookCompletionProgress(
  book: Pick<GoodreadsBookRecord, 'id' | 'shelf' | 'progressPercent'>
): {
  percent: number;
  statusShort: string;
} {
  if (typeof book.progressPercent === 'number' && !Number.isNaN(book.progressPercent)) {
    const clamped = Math.max(0, Math.min(100, Math.round(book.progressPercent)));
    return {
      percent: clamped,
      statusShort: clamped >= 100 ? 'Completed' : clamped > 0 ? 'Reading' : 'Queued',
    };
  }
  if (book.shelf === 'finished') {
    return { percent: 100, statusShort: 'Completed' };
  }
  if (book.shelf === 'reading') {
    if (READING_PROGRESS_PRESETS[book.id] !== undefined) {
      return { percent: READING_PROGRESS_PRESETS[book.id], statusShort: 'Reading' };
    }
    let hash = 0;
    for (let i = 0; i < book.id.length; i++) {
      hash = (hash * 31 + book.id.charCodeAt(i)) % 45;
    }
    return { percent: 35 + hash, statusShort: 'Reading' };
  }
  return { percent: 0, statusShort: 'Queued' };
}

// Complete 98-book Goodreads catalog fetched from Vishvajeet Dhawale's Goodreads (72865569-vishvajeet-dhawale)
// Stats: All (98) · Read (35) · Currently Reading (10) · Want to Read (53)
const GOODREADS_BOOKS_ARCHIVE: GoodreadsBookRecord[] = [
  {
    id: 'gr-1',
    callNo: '001 · HUM',
    title: 'Is This Anything?',
    author: 'Jerry Seinfeld',
    avgRating: 3.71,
    shelf: 'finished',
    dateRead: 'Feb 18, 2026',
    dateAdded: 'Dec 27, 2025',
    language: 'English',
    note: 'Decades of legal pads distilled into rhythm, observational precision, and the craft of noticing the absurd in everyday life.',
  },
  {
    id: 'gr-2',
    callNo: '002 · FIC',
    title: 'The Stationery Shop of Tehran',
    author: 'Marjan Kamali',
    avgRating: 4.23,
    shelf: 'finished',
    dateRead: 'Jan 11, 2026',
    dateAdded: 'Dec 15, 2025',
    language: 'English',
    note: 'A tender, nostalgic story set amidst the 1953 political upheaval in Tehran—love, ink, books, and the quiet ache of missed timing.',
  },
  {
    id: 'gr-3',
    callNo: '003 · ECO',
    title: 'Freakonomics: A Rogue Economist Explores the Hidden Side of Everything',
    author: 'Steven D. Levitt',
    avgRating: 4.01,
    myRating: 3,
    shelf: 'finished',
    dateRead: 'Aug 04, 2025',
    dateAdded: 'Jul 26, 2025',
    language: 'English',
    note: 'Incentives beneath the surface of human behavior and why conventional wisdom is so often built on shaky assumptions.',
  },
  {
    id: 'gr-4',
    callNo: '004 · HIN',
    title: 'October Junction (Preview Edition)',
    author: 'Divya Prakash Dubey',
    avgRating: 4.06,
    shelf: 'reading',
    dateRead: 'not set',
    dateAdded: 'Mar 07, 2025',
    language: 'Hindi',
    note: 'Modern Hindi storytelling—two lives intersecting once a year every October, written with conversational intimacy.',
  },
  {
    id: 'gr-5',
    callNo: '005 · HIN',
    title: 'गुनाहों का देवता [Gunahon Ka Devta]',
    author: 'Dharamvir Bharati',
    avgRating: 4.31,
    myRating: 4,
    shelf: 'finished',
    dateRead: 'May 29, 2025',
    dateAdded: 'Mar 07, 2025',
    language: 'Hindi',
    note: 'Chandar and Sudha in Allahabad. One of the most emotionally devastating classics in Hindi literature.',
  },
  {
    id: 'gr-6',
    callNo: '006 · PSY',
    title: 'Frames Of Mind: The Theory Of Multiple Intelligences',
    author: 'Howard Gardner',
    avgRating: 3.94,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jan 07, 2025',
    language: 'English',
  },
  {
    id: 'gr-7',
    callNo: '007 · HIN',
    title: 'इश्क में शहर होना [Ishq Mein Shahar Hona]',
    author: 'Ravish Kumar',
    avgRating: 3.73,
    myRating: 3,
    shelf: 'finished',
    dateRead: 'Feb 21, 2025',
    dateAdded: 'Jan 07, 2025',
    language: 'Hindi',
    note: 'Short, poetic micro-stories (Laghukatha) about Delhi, love, public spaces, and the loneliness of modern cities.',
  },
  {
    id: 'gr-8',
    callNo: '008 · POL',
    title: 'The Free Voice: On Democracy, Culture and the Nation',
    author: 'Ravish Kumar',
    avgRating: 4.18,
    shelf: 'finished',
    dateRead: 'Mar 07, 2025',
    dateAdded: 'Jan 07, 2025',
    language: 'English',
    note: 'On public discourse, journalism, institutional courage, and why questioning authority is a citizen’s first duty.',
  },
  {
    id: 'gr-9',
    callNo: '009 · RUS',
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    avgRating: 4.29,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Dec 31, 2024',
    language: 'Translated',
    note: 'Raskolnikov in St. Petersburg—conscience, alienation, and psychological fever.',
  },
  {
    id: 'gr-10',
    callNo: '010 · HIN',
    title: 'अतिरिक्त नहीं [Atirikt Nahin]',
    author: 'Vinod Kumar Shukla',
    avgRating: 4.29,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2024',
    dateAdded: 'Aug 27, 2024',
    language: 'Hindi',
    note: 'Vinod Kumar Shukla’s quiet, contemplative Hindi verse—nothing extra, only essential human warmth and wonder.',
  },
  {
    id: 'gr-11',
    callNo: '011 · HIN',
    title: 'दीवार में एक खिड़की रहती थी [Deewar Mein Ek Khidki Rahti Thi]',
    author: 'Vinod Kumar Shukla',
    avgRating: 4.24,
    myRating: 4,
    shelf: 'finished',
    dateRead: 'Jan 07, 2025',
    dateAdded: 'Aug 27, 2024',
    language: 'Hindi',
    note: 'Raghuvar Prasad and Sonbahra. Magical realism woven out of ordinary middle-class stillness and tender domestic life.',
  },
  {
    id: 'gr-12',
    callNo: '012 · PHI',
    title: 'Introducing Philosophy: A Graphic Guide',
    author: 'Dave Robinson',
    avgRating: 3.50,
    shelf: 'reading',
    dateRead: 'not set',
    dateAdded: 'Jan 02, 2024',
    language: 'English',
    note: 'Visual map through Western epistemology, metaphysics, and ethics from the Pre-Socratics to existentialism.',
  },
  {
    id: 'gr-13',
    callNo: '013 · FOL',
    title: 'Tenali Raman (Illustrated)',
    author: 'Maple Press',
    avgRating: 4.35,
    shelf: 'reading',
    dateRead: 'not set',
    dateAdded: 'Dec 31, 2023',
    language: 'English',
  },
  {
    id: 'gr-14',
    callNo: '014 · INV',
    title: 'University of Berkshire Hathaway: 30 Years of Lessons Learned from Warren Buffett & Charlie Munger',
    author: 'Daniel Pecaut',
    avgRating: 4.18,
    shelf: 'reading',
    dateRead: 'not set',
    dateAdded: 'Dec 25, 2023',
    language: 'English',
    note: 'Three decades of shareholder meeting notes—mental models, patience, and rational capital allocation.',
  },
  {
    id: 'gr-15',
    callNo: '015 · MAR',
    title: 'Aapan Sare Arjun (Marathi) [आपण सारे अर्जुन]',
    author: 'V.P. Kale (व.पु. काळे)',
    avgRating: 4.08,
    shelf: 'reading',
    dateRead: 'not set',
    dateAdded: 'Dec 24, 2023',
    language: 'Marathi',
    note: 'Vapu Kale’s philosophy that every ordinary person stands on their own Kurukshetra facing everyday moral dilemmas.',
  },
  {
    id: 'gr-16',
    callNo: '016 · DES',
    title: 'Hooked: How to Build Habit-Forming Products',
    author: 'Nir Eyal',
    avgRating: 4.12,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Apr 13, 2022',
    language: 'English',
  },
  {
    id: 'gr-17',
    callNo: '017 · MUS',
    title: 'The Music Room',
    author: 'Namita Devidayal',
    avgRating: 4.10,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jan 21, 2022',
    language: 'English',
  },
  {
    id: 'gr-18',
    callNo: '018 · MYT',
    title: 'Olympus: An Indian Retelling of the Greek Myths',
    author: 'Devdutt Pattanaik',
    avgRating: 3.52,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Oct 14, 2021',
    language: 'English',
  },
  {
    id: 'gr-19',
    callNo: '019 · MYT',
    title: 'Myth = Mithya: A Handbook of Hindu Mythology',
    author: 'Devdutt Pattanaik',
    avgRating: 3.82,
    myRating: 3,
    shelf: 'finished',
    dateRead: '2021',
    dateAdded: 'Oct 14, 2021',
    language: 'English',
    note: 'Understanding myth not as falsehood, but as a subjective cultural lens through which societies make sense of reality.',
  },
  {
    id: 'gr-20',
    callNo: '020 · SCI',
    title: "The Drunkard's Walk: How Randomness Rules Our Lives",
    author: 'Leonard Mlodinow',
    avgRating: 3.95,
    shelf: 'finished',
    dateRead: '2021',
    dateAdded: 'Aug 01, 2021',
    language: 'English',
    note: 'Probability, cognitive illusions, and how much of what we call skill or destiny is shaped by chance.',
  },
  {
    id: 'gr-21',
    callNo: '021 · PHI',
    title: 'My Gita',
    author: 'Devdutt Pattanaik',
    avgRating: 3.98,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2021',
    dateAdded: 'Aug 01, 2021',
    language: 'English',
    note: 'A thematic, non-linear reading of the Bhagavad Gita focusing on empathy, darshan, and relationships.',
  },
  {
    id: 'gr-22',
    callNo: '022 · MAR',
    title: 'शाळा [Shala]',
    author: 'Milind Bokil',
    avgRating: 4.28,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Aug 01, 2021',
    language: 'Marathi',
  },
  {
    id: 'gr-23',
    callNo: '023 · MAR',
    title: 'पानिपत [Panipat]',
    author: 'Vishwas Patil (विश्वास पाटील)',
    avgRating: 4.38,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2021',
    dateAdded: 'Aug 01, 2021',
    language: 'Marathi',
    note: 'Towering historical epic of the Third Battle of Panipat—courage, sacrifice, and tragedy rendered on an unforgettable canvas.',
  },
  {
    id: 'gr-24',
    callNo: '024 · MAR',
    title: 'Kosala (कोसला)',
    author: 'Bhalchandra Nemade (भालचंद्र नेमाडे)',
    avgRating: 4.12,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2021',
    dateAdded: 'Aug 01, 2021',
    language: 'Marathi',
    note: 'Pandurang Sangvikar’s existential diary in Pune—the novel that transformed modern Marathi literature forever.',
  },
  {
    id: 'gr-25',
    callNo: '025 · INV',
    title: 'Coffee Can Investing: The Low Risk Road to Stupendous Wealth',
    author: 'Saurabh Mukherjea',
    avgRating: 4.03,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Aug 01, 2021',
    language: 'English',
  },
  {
    id: 'gr-26',
    callNo: '026 · PSY',
    title: 'The Courage to Be Disliked',
    author: 'Ichiro Kishimi',
    avgRating: 3.90,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Aug 01, 2021',
    language: 'Translated',
  },
  {
    id: 'gr-27',
    callNo: '027 · PHI',
    title: 'The Almanack of Naval Ravikant: A Guide to Wealth and Happiness',
    author: 'Eric Jorgenson',
    avgRating: 4.37,
    myRating: 4,
    shelf: 'finished',
    dateRead: 'Dec 31, 2024',
    dateAdded: 'Jul 10, 2021',
    language: 'English',
    note: 'Specific knowledge, leverage, judgment, and treating peace of mind as the highest dividend.',
  },
  {
    id: 'gr-28',
    callNo: '028 · PHI',
    title: 'The Way of the Superior Man',
    author: 'David Deida',
    avgRating: 4.04,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 10, 2021',
    language: 'English',
  },
  {
    id: 'gr-29',
    callNo: '029 · PSY',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    avgRating: 4.16,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 06, 2021',
    language: 'English',
  },
  {
    id: 'gr-30',
    callNo: '030 · ECO',
    title: 'Nudge: Improving Decisions About Health, Wealth, and Happiness',
    author: 'Richard H. Thaler',
    avgRating: 3.84,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 06, 2021',
    language: 'English',
  },
  {
    id: 'gr-31',
    callNo: '031 · JPN',
    title: 'The Wind-Up Bird Chronicle',
    author: 'Haruki Murakami',
    avgRating: 4.14,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 06, 2021',
    language: 'Translated',
  },
  {
    id: 'gr-32',
    callNo: '032 · FIC',
    title: 'Harry Potter and the Goblet of Fire (Harry Potter, #4)',
    author: 'J.K. Rowling',
    avgRating: 4.57,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 06, 2021',
    language: 'English',
  },
  {
    id: 'gr-33',
    callNo: '033 · FIC',
    title: 'And the Mountains Echoed',
    author: 'Khaled Hosseini',
    avgRating: 4.08,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 06, 2021',
    language: 'English',
  },
  {
    id: 'gr-34',
    callNo: '034 · MEM',
    title: "Memorial Drive: A Daughter's Memoir",
    author: 'Natasha Trethewey',
    avgRating: 4.25,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 06, 2021',
    language: 'English',
  },
  {
    id: 'gr-35',
    callNo: '035 · MEM',
    title: 'Greenlights',
    author: 'Matthew McConaughey',
    avgRating: 4.19,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 06, 2021',
    language: 'English',
  },
  {
    id: 'gr-36',
    callNo: '036 · NAT',
    title: 'A Life on Our Planet: My Witness Statement and a Vision for the Future',
    author: 'David Attenborough',
    avgRating: 4.49,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 06, 2021',
    language: 'English',
  },
  {
    id: 'gr-37',
    callNo: '037 · MEM',
    title: 'A Promised Land',
    author: 'Barack Obama',
    avgRating: 4.31,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 06, 2021',
    language: 'English',
  },
  {
    id: 'gr-38',
    callNo: '038 · MEM',
    title: 'Shoe Dog: A Memoir by the Creator of Nike',
    author: 'Phil Knight',
    avgRating: 4.45,
    myRating: 3,
    shelf: 'finished',
    dateRead: '2021',
    dateAdded: 'Jun 03, 2021',
    language: 'English',
    note: 'The messy, near-bankrupt early years of building Blue Ribbon Sports into Nike.',
  },
  {
    id: 'gr-39',
    callNo: '039 · FIC',
    title: 'The Monk Who Sold His Ferrari',
    author: 'Robin S. Sharma',
    avgRating: 3.88,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2021',
    dateAdded: 'May 31, 2021',
    language: 'English',
  },
  {
    id: 'gr-40',
    callNo: '040 · PSY',
    title: 'The Power of Your Subconscious Mind',
    author: 'Joseph Murphy',
    avgRating: 4.06,
    myRating: 3,
    shelf: 'reading',
    dateRead: 'not set',
    dateAdded: 'May 31, 2021',
    language: 'English',
  },
  {
    id: 'gr-41',
    callNo: '041 · BIO',
    title: 'The Autobiography of Malcolm X',
    author: 'Malcolm X',
    avgRating: 4.37,
    shelf: 'reading',
    dateRead: 'not set',
    dateAdded: 'May 31, 2021',
    language: 'English',
    note: 'A fierce, unflinching testament of self-education, reinvention, and moral courage.',
  },
  {
    id: 'gr-42',
    callNo: '042 · ECO',
    title: 'The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness',
    author: 'Morgan Housel',
    avgRating: 4.27,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'May 26, 2021',
    language: 'English',
  },
  {
    id: 'gr-43',
    callNo: '043 · FIC',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    avgRating: 3.92,
    shelf: 'finished',
    dateRead: '2021',
    dateAdded: 'May 23, 2021',
    language: 'Translated',
  },
  {
    id: 'gr-44',
    callNo: '044 · PHI',
    title: 'The Power of Now: A Guide to Spiritual Enlightenment',
    author: 'Eckhart Tolle',
    avgRating: 4.15,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'May 23, 2021',
    language: 'English',
  },
  {
    id: 'gr-45',
    callNo: '045 · FIC',
    title: 'A Thousand Splendid Suns',
    author: 'Khaled Hosseini',
    avgRating: 4.46,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2021',
    dateAdded: 'May 16, 2021',
    language: 'English',
    note: 'Mariam and Laila in Kabul—endurance, female solidarity, and heartbreaking grace.',
  },
  {
    id: 'gr-46',
    callNo: '046 · BIO',
    title: 'The Autobiography of Benjamin Franklin',
    author: 'Benjamin Franklin',
    avgRating: 3.85,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'May 09, 2021',
    language: 'English',
  },
  {
    id: 'gr-47',
    callNo: '047 · BIO',
    title: 'Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future',
    author: 'Ashlee Vance',
    avgRating: 4.11,
    myRating: 3,
    shelf: 'finished',
    dateRead: '2021',
    dateAdded: 'Jan 01, 2021',
    language: 'English',
  },
  {
    id: 'gr-48',
    callNo: '048 · SCI',
    title: 'Why We Sleep: Unlocking the Power of Sleep and Dreams',
    author: 'Matthew Walker',
    avgRating: 4.36,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jan 01, 2021',
    language: 'English',
  },
  {
    id: 'gr-49',
    callNo: '049 · MEM',
    title: "Can't Hurt Me: Master Your Mind and Defy the Odds",
    author: 'David Goggins',
    avgRating: 4.30,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jan 01, 2021',
    language: 'English',
  },
  {
    id: 'gr-50',
    callNo: '050 · WRK',
    title: 'Linchpin: Are You Indispensable?',
    author: 'Seth Godin',
    avgRating: 3.83,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jan 01, 2021',
    language: 'English',
  },
  {
    id: 'gr-51',
    callNo: '051 · PHI',
    title: 'The Art of Happiness',
    author: 'Dalai Lama XIV',
    avgRating: 4.17,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jan 01, 2021',
    language: 'English',
  },
  {
    id: 'gr-52',
    callNo: '052 · FIC',
    title: 'The White Tiger',
    author: 'Aravind Adiga',
    avgRating: 3.77,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Oct 28, 2020',
    language: 'English',
  },
  {
    id: 'gr-53',
    callNo: '053 · JPN',
    title: 'A Wild Sheep Chase (The Rat, #3)',
    author: 'Haruki Murakami',
    avgRating: 3.94,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Aug 12, 2020',
    language: 'Translated',
  },
  {
    id: 'gr-54',
    callNo: '054 · JPN',
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    avgRating: 3.98,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Aug 12, 2020',
    language: 'Translated',
  },
  {
    id: 'gr-55',
    callNo: '055 · JPN',
    title: 'Kafka on the Shore',
    author: 'Haruki Murakami',
    avgRating: 4.11,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2020',
    dateAdded: 'Aug 12, 2020',
    language: 'Translated',
    note: 'A surreal labyrinth of talking cats, libraries by the sea, and metaphysical riddles.',
  },
  {
    id: 'gr-56',
    callNo: '056 · FIC',
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    avgRating: 4.36,
    shelf: 'finished',
    dateRead: '2020',
    dateAdded: 'Jun 18, 2020',
    language: 'English',
    note: 'Amir and Hassan—betrayal, childhood memory, and the long road to redemption.',
  },
  {
    id: 'gr-57',
    callNo: '057 · CLA',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    avgRating: 4.26,
    myRating: 4,
    shelf: 'finished',
    dateRead: 'Aug 04, 2020',
    dateAdded: 'Jun 18, 2020',
    language: 'English',
    note: 'Atticus Finch and Scout—conscience standing quiet and firm against the prejudice of a whole town.',
  },
  {
    id: 'gr-58',
    callNo: '058 · CLA',
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
    avgRating: 4.13,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 18, 2020',
    language: 'Translated',
  },
  {
    id: 'gr-59',
    callNo: '059 · PHI',
    title: "Man's Search for Meaning",
    author: 'Viktor E. Frankl',
    avgRating: 4.36,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 18, 2020',
    language: 'Translated',
  },
  {
    id: 'gr-60',
    callNo: '060 · THR',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    avgRating: 4.16,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 18, 2020',
    language: 'English',
  },
  {
    id: 'gr-61',
    callNo: '061 · CIN',
    title: 'Inception: The Shooting Script',
    author: 'Christopher J. Nolan',
    avgRating: 4.34,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 11, 2020',
    language: 'English',
  },
  {
    id: 'gr-62',
    callNo: '062 · FIC',
    title: "Harry Potter and the Sorcerer's Stone (Harry Potter, #1)",
    author: 'J.K. Rowling',
    avgRating: 4.47,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2020',
    dateAdded: 'May 27, 2020',
    language: 'English',
  },
  {
    id: 'gr-63',
    callNo: '063 · MAR',
    title: 'छावा [Chhava]',
    author: 'Shivaji Sawant (शिवाजी सावंत)',
    avgRating: 4.38,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'May 13, 2020',
    language: 'Marathi',
  },
  {
    id: 'gr-64',
    callNo: '064 · FIN',
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    avgRating: 4.08,
    shelf: 'finished',
    dateRead: '2020',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
  },
  {
    id: 'gr-65',
    callNo: '065 · WRK',
    title: 'The One Thing: The Surprisingly Simple Truth Behind Extraordinary Results',
    author: 'Gary Keller',
    avgRating: 4.12,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
  },
  {
    id: 'gr-66',
    callNo: '066 · FIN',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    avgRating: 4.16,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
  },
  {
    id: 'gr-67',
    callNo: '067 · PSY',
    title: 'How to Win Friends & Influence People',
    author: 'Dale Carnegie',
    avgRating: 4.21,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
  },
  {
    id: 'gr-68',
    callNo: '068 · SOC',
    title: 'Outliers: The Story of Success',
    author: 'Malcolm Gladwell',
    avgRating: 4.19,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2020',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
    note: 'Context, timing, cultural legacy, and the hidden architecture behind mastery.',
  },
  {
    id: 'gr-69',
    callNo: '069 · ART',
    title: 'Steal Like an Artist: 10 Things Nobody Told You About Being Creative',
    author: 'Austin Kleon',
    avgRating: 3.97,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2020',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
    note: 'Short, punchy manifesto on curiosity, collecting influences, and making things with your hands.',
  },
  {
    id: 'gr-70',
    callNo: '070 · SOC',
    title: 'Annihilation of Caste',
    author: 'Dr. B. R. Ambedkar',
    avgRating: 4.61,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2020',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
    note: 'Unmatched moral clarity and intellectual rigor. One of the most essential texts on social justice, democracy, and constitutional morality ever written in modern India.',
  },
  {
    id: 'gr-71',
    callNo: '071 · NEU',
    title: 'Incognito: The Secret Lives of the Brain',
    author: 'David Eagleman',
    avgRating: 4.09,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
  },
  {
    id: 'gr-72',
    callNo: '072 · PHI',
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    avgRating: 3.85,
    shelf: 'finished',
    dateRead: '2020',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
  },
  {
    id: 'gr-73',
    callNo: '073 · PSY',
    title: 'The Power of Habit: Why We Do What We Do in Life and Business',
    author: 'Charles Duhigg',
    avgRating: 4.13,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
  },
  {
    id: 'gr-74',
    callNo: '074 · PSY',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    avgRating: 4.30,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
  },
  {
    id: 'gr-75',
    callNo: '075 · WRK',
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    avgRating: 4.15,
    shelf: 'reading',
    dateRead: 'not set',
    dateAdded: 'Apr 17, 2020',
    language: 'English',
    note: 'Protecting long, uninterrupted stretches of attention in an economy built to fragment it.',
  },
  {
    id: 'gr-76',
    callNo: '076 · PSY',
    title: 'Emotional Intelligence 2.0',
    author: 'Travis Bradberry',
    avgRating: 3.85,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2020',
    dateAdded: 'Jan 14, 2020',
    language: 'English',
  },
  {
    id: 'gr-77',
    callNo: '077 · MEM',
    title: 'When Breath Becomes Air',
    author: 'Paul Kalanithi',
    avgRating: 4.41,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jan 14, 2020',
    language: 'English',
  },
  {
    id: 'gr-78',
    callNo: '078 · HIS',
    title: 'Writings And Speeches: A Ready Reference Manual',
    author: 'D.C. Ahir',
    avgRating: 4.33,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Nov 25, 2019',
    language: 'English',
  },
  {
    id: 'gr-79',
    callNo: '079 · HIS',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    avgRating: 4.32,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2019',
    dateAdded: 'May 29, 2019',
    language: 'English',
    note: 'Shared myths, cognitive revolutions, and how intersubjective fictions allowed Homo sapiens to organize at scale.',
  },
  {
    id: 'gr-80',
    callNo: '080 · POL',
    title: 'Broken Republic',
    author: 'Arundhati Roy',
    avgRating: 4.06,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Sep 01, 2018',
    language: 'English',
  },
  {
    id: 'gr-81',
    callNo: '081 · POL',
    title: 'Broken Republic: Three Essays',
    author: 'Arundhati Roy',
    avgRating: 4.06,
    shelf: 'reading',
    dateRead: 'not set',
    dateAdded: 'Sep 01, 2018',
    language: 'English',
  },
  {
    id: 'gr-82',
    callNo: '082 · MAR',
    title: 'कॅनव्हास [Canvas]',
    author: 'Achyut Godbole (अच्युत गोडबोले)',
    avgRating: 3.82,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Jun 06, 2018',
    language: 'Marathi',
  },
  {
    id: 'gr-83',
    callNo: '083 · MAR',
    title: 'गोलपिठा [Golpitha]',
    author: 'Namdeo Dhasal (नामदेव ढसाळ)',
    avgRating: 4.15,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Mar 03, 2018',
    language: 'Marathi',
  },
  {
    id: 'gr-84',
    callNo: '084 · MAR',
    title: 'बलुतं [Baluta - Marathi]',
    author: 'Daya Pawar (दया पवार)',
    avgRating: 4.13,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2018',
    dateAdded: 'Mar 03, 2018',
    language: 'Marathi',
    note: 'A watershed autobiography in Marathi Dalit literature—raw, courageous, and impossible to forget.',
  },
  {
    id: 'gr-85',
    callNo: '085 · MAR',
    title: 'चावडी [Chavadi]',
    author: 'Daya Pawar (दया पवार)',
    avgRating: 4.00,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Mar 03, 2018',
    language: 'Marathi',
  },
  {
    id: 'gr-86',
    callNo: '086 · MAR',
    title: 'कोंडवाडा [Kondwada]',
    author: 'Daya Pawar (दया पवार)',
    avgRating: 4.41,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Mar 03, 2018',
    language: 'Marathi',
  },
  {
    id: 'gr-87',
    callNo: '087 · MAR',
    title: 'Baluta',
    author: 'Daya Pawar',
    avgRating: 4.13,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Mar 03, 2018',
    language: 'Marathi',
  },
  {
    id: 'gr-88',
    callNo: '088 · MAR',
    title: 'झपुर्झा [Zapoorza]',
    author: 'Achyut Godbole (अच्युत गोडबोले)',
    avgRating: 4.17,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Mar 03, 2018',
    language: 'Marathi',
  },
  {
    id: 'gr-89',
    callNo: '089 · HIN',
    title: 'गोदान [Godaan]',
    author: 'Munshi Premchand (मुंशी प्रेमचंद)',
    avgRating: 4.44,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2024',
    dateAdded: 'Jan 18, 2018',
    language: 'Hindi',
    note: 'Hori and Dhaniya—Munshi Premchand’s immortal masterpiece on peasant dignity, debt, and rural Indian life.',
  },
  {
    id: 'gr-90',
    callNo: '090 · MEM',
    title: 'How to Murder Your Life',
    author: 'Cat Marnell',
    avgRating: 3.88,
    shelf: 'finished',
    dateRead: '2017',
    dateAdded: 'Nov 27, 2017',
    language: 'English',
  },
  {
    id: 'gr-91',
    callNo: '091 · MAR',
    title: 'बोर्डरूम [Boardroom]',
    author: 'Achyut Godbole (अच्युत गोडबोले)',
    avgRating: 4.25,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Nov 18, 2017',
    language: 'Marathi',
  },
  {
    id: 'gr-92',
    callNo: '092 · MAR',
    title: 'अर्थात [Arthaat]',
    author: 'Achyut Godbole (अच्युत गोडबोले)',
    avgRating: 4.25,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Nov 18, 2017',
    language: 'Marathi',
  },
  {
    id: 'gr-93',
    callNo: '093 · MAR',
    title: 'मनात [Manaat]',
    author: 'Achyut Godbole (अच्युत गोडबोले)',
    avgRating: 3.99,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2017',
    dateAdded: 'Nov 18, 2017',
    language: 'Marathi',
    note: 'A lucid Marathi exploration of psychology, human cognition, and the inner workings of the mind.',
  },
  {
    id: 'gr-94',
    callNo: '094 · MAR',
    title: 'मुसाफिर (Musafir) — Biography / Autobiography',
    author: 'Achyut Godbole (अच्युत गोडबोले)',
    avgRating: 4.28,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2022',
    dateAdded: 'Nov 18, 2017',
    language: 'Marathi',
    note: 'Achyut Godbole’s unforgettable Marathi autobiography—from Solapur and IIT Bombay to software leadership, tribal activism, music, and a relentless thirst for knowledge.',
  },
  {
    id: 'gr-95',
    callNo: '095 · MAR',
    title: 'किमयागार [Kimayagar]',
    author: 'Achyut Godbole (अच्युत गोडबोले)',
    avgRating: 4.23,
    shelf: 'want_to_read',
    dateRead: 'not set',
    dateAdded: 'Nov 18, 2017',
    language: 'Marathi',
  },
  {
    id: 'gr-96',
    callNo: '096 · MAR',
    title: 'कोल्ह्याट्याचं पोर [Kolhyatyache Por]',
    author: 'Kishor Shantabai Kale',
    avgRating: 4.06,
    shelf: 'finished',
    dateRead: '2017',
    dateAdded: 'Nov 08, 2017',
    language: 'Marathi',
    note: 'Deeply moving Marathi memoir of struggle, dignity, and becoming a doctor against overwhelming social odds.',
  },
  {
    id: 'gr-97',
    callNo: '097 · PSY',
    title: 'The Secret (The Secret, #1)',
    author: 'Rhonda Byrne',
    avgRating: 3.74,
    myRating: 5,
    shelf: 'reading',
    dateRead: 'not set',
    dateAdded: 'Oct 22, 2017',
    language: 'English',
  },
  {
    id: 'gr-98',
    callNo: '098 · FIC',
    title: 'Abraham Lincoln: Vampire Hunter',
    author: 'Seth Grahame-Smith',
    avgRating: 3.72,
    shelf: 'finished',
    dateRead: '2017',
    dateAdded: 'Oct 22, 2017',
    language: 'English',
  },
  {
    id: 'gr-99',
    callNo: '099 · MAR',
    title: 'Mrutyunjay (मृत्युंजय)',
    author: 'Shivaji Sawant (शिवाजी सावंत)',
    avgRating: 4.49,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2023',
    dateAdded: 'Jan 12, 2023',
    language: 'Marathi',
    note: 'Karna’s inner monologue of dignity, generosity, fate, and tragic heroism—an immortal masterpiece of Marathi literature.',
  },
  {
    id: 'gr-100',
    callNo: '100 · MAR',
    title: 'Yayati (ययाती)',
    author: 'V. S. Khandekar (वि. स. खांडेकर)',
    avgRating: 4.27,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2023',
    dateAdded: 'Feb 18, 2023',
    language: 'Marathi',
    note: 'Jnanpith Award-winning philosophical novel reimagining King Yayati, Kacha, and Devayani to examine human desire and moral responsibility.',
  },
  {
    id: 'gr-101',
    callNo: '101 · MAR',
    title: 'Shriman Yogi (श्रीमान योगी)',
    author: 'Ranjit Desai (रणजित देसाई)',
    avgRating: 4.53,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2023',
    dateAdded: 'Apr 05, 2023',
    language: 'Marathi',
    note: 'Monumental historical biography-novel on Chhatrapati Shivaji Maharaj, capturing Swarajya, statecraft, and human leadership.',
  },
  {
    id: 'gr-102',
    callNo: '102 · MAR',
    title: 'Swami (स्वामी)',
    author: 'Ranjit Desai (रणजित देसाई)',
    avgRating: 4.42,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2023',
    dateAdded: 'Jun 19, 2023',
    language: 'Marathi',
    note: 'Thorle Madhavrao Peshwe and Ramabai—a deeply moving portrait of duty, integrity, and rebuilding an empire after Panipat.',
  },
  {
    id: 'gr-103',
    callNo: '103 · MAR',
    title: 'Radheya (राधेय)',
    author: 'Ranjit Desai (रणजित देसाई)',
    avgRating: 4.34,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2024',
    dateAdded: 'Jan 14, 2024',
    language: 'Marathi',
    note: 'A poignant, deeply human exploration of Karna—the son of Radha—caught between loyalty, identity, and destiny.',
  },
  {
    id: 'gr-104',
    callNo: '104 · MAR',
    title: 'Rau (राऊ)',
    author: 'N. S. Inamdar (ना. सं. इनामदार)',
    avgRating: 4.29,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2024',
    dateAdded: 'Mar 22, 2024',
    language: 'Marathi',
    note: 'Peshwa Bajirao I and Mastani—unmatched battlefield brilliance alongside a defiant, tragic love story against orthodox society.',
  },
  {
    id: 'gr-105',
    callNo: '105 · MAR',
    title: 'Zadazadti (झाडाझडती)',
    author: 'Vishwas Patil (विश्वास पाटील)',
    avgRating: 4.36,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2024',
    dateAdded: 'Jul 09, 2024',
    language: 'Marathi',
    note: 'Sahitya Akademi Award-winning novel on dam-displaced villagers—an unflinching, heartbreaking reckoning with development and human cost.',
  },
  {
    id: 'gr-106',
    callNo: '106 · MAR',
    title: 'Shivaji Kon Hota? (शिवाजी कोण होता?)',
    author: 'Govind Pansare (गोविंद पानसरे)',
    avgRating: 4.44,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2024',
    dateAdded: 'Oct 02, 2024',
    language: 'Marathi',
    note: 'A sharp, rational, and historically grounded work examining Chhatrapati Shivaji Maharaj as a people’s king (Rayatecha Raja) who stood for farmers, women, and social justice.',
  },
  {
    id: 'gr-107',
    callNo: '107 · HIN',
    title: 'सूरज का सातवाँ घोड़ा [Suraj Ka Satvan Ghoda]',
    author: 'Dharamvir Bharati (धर्मवीर भारती)',
    avgRating: 4.26,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2024',
    dateAdded: 'Nov 10, 2024',
    language: 'Hindi',
    note: 'Manik Mulla’s afternoon storytelling sessions—a brilliant metafictional Hindi novella on love, class, disillusionment, and hope.',
  },
  {
    id: 'gr-108',
    callNo: '108 · HIN',
    title: 'राग दरबारी [Raag Darbari]',
    author: 'Shrilal Shukla (श्रीलाल शुक्ल)',
    avgRating: 4.42,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2024',
    dateAdded: 'Nov 18, 2024',
    language: 'Hindi',
    note: 'Sahitya Akademi Award-winning razor-sharp political and social satire set in Shivpalganj—unmatched wit in Hindi literature.',
  },
  {
    id: 'gr-109',
    callNo: '109 · HIN',
    title: 'गबन [Gaban]',
    author: 'Munshi Premchand (मुंशी प्रेमचंद)',
    avgRating: 4.22,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2024',
    dateAdded: 'Dec 02, 2024',
    language: 'Hindi',
    note: 'Ramnath and Jalpa—Premchand’s psychological exploration of middle-class vanity, moral weakness, and redemption.',
  },
  {
    id: 'gr-110',
    callNo: '110 · HIN',
    title: 'बनारस टॉकीज [Banaras Talkies]',
    author: 'Satya Vyas (सत्य व्यास)',
    avgRating: 4.09,
    myRating: 4,
    shelf: 'finished',
    dateRead: '2025',
    dateAdded: 'Jan 04, 2025',
    language: 'Hindi',
    note: 'Warm, hilarious, and nostalgic portrait of BHU hostel life, friendship, exams, and Banarasi campus banter.',
  },
  {
    id: 'gr-111',
    callNo: '111 · HIN',
    title: 'एक गधे की आत्मकथा [Ek Gadhe Ki Atmakatha]',
    author: 'Krishan Chander (कृश्न चंदर)',
    avgRating: 4.25,
    myRating: 5,
    shelf: 'finished',
    dateRead: '2025',
    dateAdded: 'Jan 19, 2025',
    language: 'Hindi',
    note: 'Biting, hilarious satirical classic where a talking donkey navigates the absurdities of bureaucracy, politics, and polite society in Delhi.',
  },
];

// Bookcloth spine accent colors for Folio Cards in Library Mode
const FOLIO_SPINE_COLORS = [
  '#8B2E1D', // Terracotta / Venetian Red
  '#1E4631', // British Library Racing Green
  '#233B5D', // Oxford Prussian Blue
  '#7A4B24', // Warm Chestnut Leather
  '#5A2D48', // Burgundy Plum
  '#5C4E28', // Antique Olive Brass
];

export const BooksSection: React.FC<BooksSectionProps> = ({
  archive,
  authorMode = false,
  onUpdateArchive,
}) => {
  // Redesigned Library Mode: Warm Parchment & Bookshop Atelier (with an optional Warm Walnut Study evening mode)
  const [libraryMode, setLibraryMode] = useState<boolean>(true);
  const [librarySubView, setLibrarySubView] = useState<'stacks' | 'ledger'>('stacks');
  const [lampShade, setLampShade] = useState<'parchment' | 'walnut'>('parchment');

  // 56+ Random Best Lines from Books state (located at the end of the page)
  const [bestLineLangFilter, setBestLineLangFilter] = useState<
    'all' | 'Marathi' | 'Hindi' | 'English'
  >('all');
  const [bestLineIndex, setBestLineIndex] = useState<number>(0);

  // Underlined Passages 50+ Random Notes state
  const [underlinedSeed, setUnderlinedSeed] = useState<number>(0);
  const [showAllUnderlined, setShowAllUnderlined] = useState<boolean>(false);

  // Shortened "All Books" state with Read More toggles
  const [expandedAisles, setExpandedAisles] = useState<Record<string, boolean>>({});
  const [showAllCatalogBooks, setShowAllCatalogBooks] = useState<boolean>(false);

  const toggleAisleExpand = (key: string) => {
    setExpandedAisles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [shelfFilter, setShelfFilter] = useState<
    'all' | 'reading' | 'finished' | 'want_to_read'
  >('all');
  const [languageFilter, setLanguageFilter] = useState<
    'all' | 'Marathi' | 'Hindi' | 'English' | 'Translated'
  >('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBookId, setSelectedBookId] = useState<string>('gr-99');

  const [activeForm, setActiveForm] = useState<'none' | 'book' | 'passage'>('none');

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    status: 'reading' as BookEntry['status'],
    progressPercent: '50',
    rating: '4',
    reflection: '',
    dateFinished: '',
  });

  const [newPassage, setNewPassage] = useState({
    quote: '',
    bookTitle: '',
    author: '',
    personalNote: '',
  });

  const showSamples = archive.settings.showSampleEntries;

  // Filtered 56+ Best Lines from Books
  const filteredBestLines = useMemo(() => {
    if (bestLineLangFilter === 'all') return BOOK_BEST_LINES;
    return BOOK_BEST_LINES.filter((item) => item.language === bestLineLangFilter);
  }, [bestLineLangFilter]);

  const activeBestLine = useMemo(() => {
    if (filteredBestLines.length === 0) return BOOK_BEST_LINES[0];
    const safeIdx =
      ((bestLineIndex % filteredBestLines.length) + filteredBestLines.length) %
      filteredBestLines.length;
    return filteredBestLines[safeIdx];
  }, [filteredBestLines, bestLineIndex]);

  const handleShuffleBestLine = () => {
    if (filteredBestLines.length <= 1) return;
    let next = Math.floor(Math.random() * filteredBestLines.length);
    const currentSafe =
      ((bestLineIndex % filteredBestLines.length) + filteredBestLines.length) %
      filteredBestLines.length;
    if (next === currentSafe) {
      next = (next + 1) % filteredBestLines.length;
    }
    setBestLineIndex(next);
  };

  // Merge user-added custom books with the Goodreads records
  const allCatalogBooks = useMemo(() => {
    const customEntries = archive.books.entries
      .filter((b) => !b.isSample)
      .map(
        (b, idx): GoodreadsBookRecord => ({
          id: b.id,
          callNo: `USR-${idx + 1}`,
          title: b.title,
          author: b.author,
          avgRating: 4.15,
          shelf: b.status,
          progressPercent: b.progressPercent,
          dateRead: b.finishedDate || 'Logged',
          dateAdded: b.startedDate || 'Personal Log',
          language: 'English',
          note: b.personalNote,
        })
      );
    return [...customEntries, ...GOODREADS_BOOKS_ARCHIVE];
  }, [archive.books.entries]);

  const catalogById = useMemo(() => {
    const map = new Map<string, GoodreadsBookRecord>();
    for (const book of allCatalogBooks) {
      map.set(book.id, book);
    }
    return map;
  }, [allCatalogBooks]);

  const filteredBooks = useMemo(() => {
    return allCatalogBooks.filter((b) => {
      const matchesShelf = shelfFilter === 'all' || b.shelf === shelfFilter;
      const matchesLang = languageFilter === 'all' || b.language === languageFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.note && b.note.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesShelf && matchesLang && matchesSearch;
    });
  }, [allCatalogBooks, shelfFilter, languageFilter, searchQuery]);

  const activeBook = useMemo(() => {
    return (
      filteredBooks.find((b) => b.id === selectedBookId) ||
      allCatalogBooks.find((b) => b.id === selectedBookId) ||
      filteredBooks[0] ||
      allCatalogBooks[0]
    );
  }, [filteredBooks, allCatalogBooks, selectedBookId]);

  const activeBookIndexInFiltered = useMemo(() => {
    return filteredBooks.findIndex((b) => b.id === activeBook?.id);
  }, [filteredBooks, activeBook]);

  const handleStepBook = (delta: number) => {
    if (filteredBooks.length === 0) return;
    const currentIdx = activeBookIndexInFiltered >= 0 ? activeBookIndexInFiltered : 0;
    const nextIdx = (currentIdx + delta + filteredBooks.length) % filteredBooks.length;
    setSelectedBookId(filteredBooks[nextIdx].id);
  };

  const visiblePassages = useMemo(
    () => archive.books.passages.filter((p) => showSamples || !p.isSample),
    [archive.books.passages, showSamples]
  );

  const shelfCounts = useMemo(() => {
    return {
      all: allCatalogBooks.length,
      reading: allCatalogBooks.filter((b) => b.shelf === 'reading').length,
      finished: allCatalogBooks.filter((b) => b.shelf === 'finished').length,
      want_to_read: allCatalogBooks.filter((b) => b.shelf === 'want_to_read').length,
    };
  }, [allCatalogBooks]);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) return;
    const parsedProgress =
      newBook.status === 'finished'
        ? 100
        : newBook.status === 'want_to_read'
        ? 0
        : Math.max(0, Math.min(100, Number(newBook.progressPercent) || 50));
    const entry: BookEntry = {
      id: `bk-${Date.now()}`,
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      status: newBook.status,
      progressPercent: parsedProgress,
      personalNote: newBook.reflection.trim(),
      finishedDate: newBook.dateFinished.trim() || undefined,
      isSample: false,
    };
    onUpdateArchive((prev) => ({
      ...prev,
      books: {
        ...prev.books,
        entries: [entry, ...prev.books.entries],
      },
    }));
    setNewBook({
      title: '',
      author: '',
      status: 'reading',
      progressPercent: '50',
      rating: '4',
      reflection: '',
      dateFinished: '',
    });
    setActiveForm('none');
  };

  const handleAddPassage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassage.quote.trim() || !newPassage.bookTitle.trim()) return;
    const entry: ReadingPassage = {
      id: `bp-${Date.now()}`,
      quoteOrIdea: newPassage.quote.trim(),
      bookTitle: newPassage.bookTitle.trim(),
      author: newPassage.author.trim() || 'Unknown',
      reflection: newPassage.personalNote.trim(),
      date: new Date().toISOString().slice(0, 10),
      isSample: false,
    };
    onUpdateArchive((prev) => ({
      ...prev,
      books: {
        ...prev.books,
        passages: [entry, ...prev.books.passages],
      },
    }));
    setNewPassage({ quote: '', bookTitle: '', author: '', personalNote: '' });
    setActiveForm('none');
  };

  const isWalnutLibrary = libraryMode && lampShade === 'walnut';
  const isParchmentLibrary = libraryMode && lampShade === 'parchment';

  // Combine 56+ BOOK_BEST_LINES and custom reading passages for the 50+ Random Underlined Passages section
  const allUnderlinedNotes = useMemo(() => {
    const customMapped = visiblePassages.map((p, idx) => ({
      id: `custom-p-${p.id}-${idx}`,
      line: p.quoteOrIdea,
      book: p.bookTitle,
      author: p.author,
      language: 'English' as const,
      note: p.reflection,
    }));
    const bestMapped = BOOK_BEST_LINES.map((b) => ({
      id: b.id,
      line: b.line,
      book: b.book,
      author: b.author,
      language: b.language,
      note: undefined as string | undefined,
    }));
    return [...customMapped, ...bestMapped];
  }, [visiblePassages]);

  const displayedUnderlinedNotes = useMemo(() => {
    if (showAllUnderlined) return allUnderlinedNotes;
    const total = allUnderlinedNotes.length;
    if (total <= 10) return allUnderlinedNotes;
    const start = (underlinedSeed * 7) % total;
    const picked = [];
    for (let i = 0; i < 10; i++) {
      picked.push(allUnderlinedNotes[(start + i * 5) % total]);
    }
    return picked;
  }, [allUnderlinedNotes, underlinedSeed, showAllUnderlined]);

  // Refined Archival Rare Bookshop & Reading Room Theme Tokens
  const libShellClass = isParchmentLibrary
    ? 'bg-[#FAF6EE] text-[#1A1410] p-5 sm:p-8 lg:p-10 border border-[#D8C7A8] shadow-[0_24px_60px_rgba(48,32,16,0.09)] relative overflow-hidden'
    : isWalnutLibrary
    ? 'bg-[#16130F] text-[#F4ECE1] p-5 sm:p-8 lg:p-10 border border-[#3A2E23] shadow-[0_28px_70px_rgba(0,0,0,0.55)] relative overflow-hidden'
    : 'space-y-10';

  const libBorderClass = isParchmentLibrary
    ? 'border-[#DFD0B6]'
    : isWalnutLibrary
    ? 'border-[#33281E]'
    : 'border-[var(--border-hairline)]';

  const libCardBgClass = isParchmentLibrary
    ? 'bg-[#FFFDF9] border-[#DFD0B6]'
    : isWalnutLibrary
    ? 'bg-[#1E1914] border-[#362B20]'
    : 'bg-[var(--bg-surface)] border-[var(--border-hairline)]';

  const libSubtleBgClass = isParchmentLibrary
    ? 'bg-[#F2E9D8]/80 border-[#D8C7A8]'
    : isWalnutLibrary
    ? 'bg-[#120F0C] border-[#2C231A]'
    : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)]';

  const libAccentText = isParchmentLibrary
    ? 'text-[#7A1C1C]'
    : isWalnutLibrary
    ? 'text-[#E5B869]'
    : 'text-[var(--accent-crimson)]';

  const libMutedText = isParchmentLibrary
    ? 'text-[#6A553F]'
    : isWalnutLibrary
    ? 'text-[#B2A18E]'
    : 'text-[var(--text-secondary)]';

  const renderProgressIndicator = (
    book: Pick<GoodreadsBookRecord, 'id' | 'shelf' | 'progressPercent'>,
    compact = false
  ) => {
    const { percent } = getBookCompletionProgress(book);
    const fillClass =
      percent === 100
        ? isParchmentLibrary
          ? 'bg-[#1E5638]'
          : isWalnutLibrary
          ? 'bg-[#56B37F]'
          : 'bg-[var(--accent-olive)]'
        : percent > 0
        ? isParchmentLibrary
          ? 'bg-[#8B2E1D]'
          : isWalnutLibrary
          ? 'bg-[#E5B869]'
          : 'bg-[var(--accent-crimson)]'
        : 'bg-current/20';

    const trackClass = isParchmentLibrary
      ? 'bg-[#DFD0B6]'
      : isWalnutLibrary
      ? 'bg-[#33281E]'
      : 'bg-[var(--border-hairline)]';

    return (
      <div
        className={`inline-flex items-center gap-1.5 shrink-0 font-mono-meta tabular-nums ${
          compact ? 'text-[10px]' : 'text-[11px]'
        }`}
        title={`Reading completion: ${percent}%`}
      >
        <div
          className={`${
            compact ? 'w-11 sm:w-14 h-1.5' : 'w-14 sm:w-16 h-1.5'
          } rounded-full overflow-hidden ${trackClass}`}
        >
          <div
            style={{ width: `${percent}%` }}
            className={`h-full rounded-full transition-all duration-300 ${fillClass}`}
          />
        </div>
        <span
          className={`w-8 text-right font-semibold ${
            percent === 100
              ? isParchmentLibrary
                ? 'text-[#1E5638]'
                : isWalnutLibrary
                ? 'text-[#56B37F]'
                : 'text-[var(--accent-olive)]'
              : percent > 0
              ? libAccentText
              : libMutedText
          }`}
        >
          {percent}%
        </span>
      </div>
    );
  };

  return (
    <div className={`rounded-3xl transition-all duration-300 ${libShellClass}`}>
      {/* Subtle Top Archival Bookshop Trim when Library Theme is ON */}
      {libraryMode && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 inset-x-0 h-2 ${
            isParchmentLibrary
              ? 'bg-gradient-to-r from-[#8B2E1D] via-[#B8863B] to-[#1E4631]'
              : 'bg-gradient-to-r from-[#2D5A3F] via-[#D8AD60] to-[#2D5A3F]'
          }`}
        />
      )}

      <div className="relative z-10 space-y-8">
        {/* =====================================================================
            1. HEADER & NEW LITERARY BOOKSHOP / READING ROOM THEME CONTROLS
            ===================================================================== */}
        <header className={`pb-6 border-b space-y-6 ${libBorderClass}`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono-meta uppercase tracking-widest border ${
                    isParchmentLibrary
                      ? 'bg-[#EDE2CC] text-[#8B2E1D] border-[#CBB692]'
                      : isWalnutLibrary
                      ? 'bg-[#263329] text-[#E3B86B] border-[#3E5242]'
                      : 'bg-[var(--bg-surface)] text-[var(--accent-olive)] border-[var(--border-hairline)]'
                  }`}
                >
                  <Library className="w-3.5 h-3.5" />
                  <span>
                    {libraryMode
                      ? lampShade === 'parchment'
                        ? 'Literary Bookshop Atelier · Sunlit Parchment Room'
                        : 'British Reading Room · Forest & Brass Study'
                      : '03 · Reading & Goodreads Notebook'}
                  </span>
                </span>

                {libraryMode && (
                  <button
                    type="button"
                    onClick={() =>
                      setLampShade((prev) => (prev === 'parchment' ? 'walnut' : 'parchment'))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono-meta uppercase tracking-wider border transition-colors cursor-pointer ${
                      isParchmentLibrary
                        ? 'bg-[#1E4631] text-[#F5EFE2] border-[#1E4631]'
                        : 'bg-[#F5EFE2] text-[#1F1812] border-[#D4C3A3]'
                    }`}
                  >
                    <LampDesk className="w-3 h-3" />
                    <span>
                      Room Tone: {lampShade === 'parchment' ? 'Warm Parchment' : 'Forest & Brass'}
                    </span>
                  </button>
                )}
              </div>

              <h1 className="font-serif-editorial editorial-hero-display font-normal">
                Buying Books Faster Than I Can Read Them
              </h1>

              <p
                className={`font-serif-editorial italic editorial-lead ${libAccentText}`}
              >
                An ever-growing collection of books, and a very questionable record of finishing them.
              </p>

              <div className={`space-y-3 font-literary editorial-body max-w-3xl ${libMutedText}`}>
                <p>
                  I keep buying books with the best intentions. Some I&apos;ve read, some I&apos;m halfway through, and some have been sitting on my shelf long enough to start judging me.
                </p>
                <p>
                  The collection has a bit of everything — non-fiction and social thought, Marathi literature, Hindi novels, biographies, and books I picked up simply because the title caught my attention.
                </p>
              </div>
            </div>

            {/* Right Controls: Library Mode Switcher + Goodreads Profile */}
            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end">
              <button
                type="button"
                onClick={() => setLibraryMode(!libraryMode)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono-meta transition-all cursor-pointer border ${
                  libraryMode
                    ? isParchmentLibrary
                      ? 'bg-[#8B2E1D] text-[#FAF3E6] border-[#8B2E1D] font-semibold shadow-sm'
                      : 'bg-[#E3B86B] text-[#172019] border-[#E3B86B] font-semibold shadow-sm'
                    : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--accent-olive)]'
                }`}
              >
                <Library className="w-3.5 h-3.5" />
                <span>{libraryMode ? 'Reading Room Theme: ON' : 'Transform into Library'}</span>
              </button>

              <a
                href="https://www.goodreads.com/user/show/72865569-vishvajeet-dhawale"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono-meta border transition-colors ${libCardBgClass}`}
              >
                <span>Goodreads · {shelfCounts.all} Books</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {authorMode && (
                <button
                  type="button"
                  onClick={() => setActiveForm(activeForm === 'book' ? 'none' : 'book')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl font-display font-medium bg-[var(--accent-crimson)] text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Book</span>
                </button>
              )}
            </div>
          </div>

          {/* =====================================================================
              2. GOODREADS STATS PLAQUES
              ===================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: 'all' as const,
                count: shelfCounts.all,
                label: 'All Volumes',
                sub: 'Complete Catalog',
                code: `CAT · 01–${shelfCounts.all}`,
              },
              {
                id: 'finished' as const,
                count: shelfCounts.finished,
                label: 'Read Shelf',
                sub: 'Completed Logs',
                code: 'SHF · READ',
              },
              {
                id: 'reading' as const,
                count: shelfCounts.reading,
                label: 'Currently Reading',
                sub: 'On Nightstand',
                code: 'SHF · CURR',
              },
              {
                id: 'want_to_read' as const,
                count: shelfCounts.want_to_read,
                label: 'Want to Read',
                sub: 'Reading Queue',
                code: 'SHF · QUEUE',
              },
            ].map((stat) => {
              const isSelected = shelfFilter === stat.id;
              return (
                <button
                  key={stat.id}
                  type="button"
                  onClick={() => setShelfFilter(stat.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? isParchmentLibrary
                        ? 'bg-[#8B2E1D] text-[#FAF3E6] border-[#8B2E1D] shadow-sm'
                        : isWalnutLibrary
                        ? 'bg-[#2E3D31] text-white border-[#E3B86B]'
                        : 'bg-[var(--bg-elevated)] border-[var(--accent-olive)] tactile-card-shadow'
                      : `${libCardBgClass} hover:opacity-95`
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-mono-meta text-[10px] uppercase tracking-widest ${
                        isSelected ? 'opacity-85' : libMutedText
                      }`}
                    >
                      {stat.code}
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-current" />}
                  </div>

                  <div className="font-serif-editorial text-3xl sm:text-4xl leading-none tracking-tight">
                    {stat.count}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-display font-medium">{stat.label}</span>
                    <span className="font-mono-meta text-[10px] opacity-75">{stat.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </header>

        {/* Author Mode Form */}
        {authorMode && activeForm === 'book' && (
          <form
            onSubmit={handleAddBook}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-strong)] space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
              <h3 className="font-serif-editorial text-lg">Add Book to Personal Shelf</h3>
              <button
                type="button"
                onClick={() => setActiveForm('none')}
                className="text-xs font-mono-meta text-[var(--text-secondary)]"
              >
                Close ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  required
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Shelf
                </label>
                <select
                  value={newBook.status}
                  onChange={(e) => {
                    const nextStatus = e.target.value as BookEntry['status'];
                    setNewBook({
                      ...newBook,
                      status: nextStatus,
                      progressPercent:
                        nextStatus === 'finished'
                          ? '100'
                          : nextStatus === 'want_to_read'
                          ? '0'
                          : '50',
                    });
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                >
                  <option value="reading">Currently Reading</option>
                  <option value="finished">Read (100%)</option>
                  <option value="want_to_read">Want to Read (0%)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Completion ({newBook.progressPercent}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={newBook.progressPercent}
                  onChange={(e) =>
                    setNewBook({ ...newBook, progressPercent: e.target.value })
                  }
                  className="w-full accent-[var(--accent-crimson)] mt-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1">
                Reading Notes
              </label>
              <textarea
                rows={2}
                value={newBook.reflection}
                onChange={(e) => setNewBook({ ...newBook, reflection: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs rounded-lg font-display font-medium bg-[var(--accent-crimson)] text-white"
            >
              Save Book
            </button>
          </form>
        )}

        {/* =====================================================================
            2.5 CURATED ESSENTIAL SHELVES (COMPACT NUMBERED LIST FORMAT — ZERO BOXES):
                01. NON-FICTION & SOCIAL THOUGHT
                02. MARATHI LITERATURE (9 CLASSICS)
                03. HINDI LITERATURE (8 CLASSICS)
            ===================================================================== */}
        <section
          aria-label="Curated Shelves: Non-fiction, Marathi Literature, and Hindi Literature"
          className={`p-5 sm:p-7 rounded-2xl border space-y-6 ${libCardBgClass}`}
        >
          <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b pb-3.5 ${libBorderClass}`}>
            <div>
              <div className={`font-mono-meta text-[10px] uppercase tracking-[0.18em] ${libAccentText}`}>
                ARCHIVAL INDEX · ESSENTIAL INDIAN & SOCIAL LITERATURE
              </div>
              <h2 className="font-serif-editorial editorial-section-heading mt-0.5">
                The Spine of My Shelf: Non-Fiction, मराठी & हिंदी Classics
              </h2>
            </div>
            <span className={`font-mono-meta text-[11px] ${libMutedText}`}>
              Click any title row to inspect its catalog card
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (5 Cols): 01 Non-Fiction + 03 Hindi Literature List */}
            <div className="lg:col-span-6 space-y-6">
              {/* List 01: Non-fiction & Social Thought */}
              <div className="space-y-2">
                <div className={`flex items-center justify-between border-b pb-1.5 ${libBorderClass}`}>
                  <span className={`font-mono-meta text-xs uppercase tracking-wider font-semibold ${libAccentText}`}>
                    01 · Non-fiction & Social Thought
                  </span>
                  <span className={`font-mono-meta text-[10px] tabular-nums ${libMutedText}`}>
                    02 Volumes
                  </span>
                </div>

                <ol className={`divide-y ${libBorderClass}`}>
                  {[
                    {
                      id: 'gr-70',
                      num: '01',
                      title: 'Annihilation of Caste',
                      author: 'Dr. B. R. Ambedkar',
                      sub: 'Social Philosophy',
                    },
                    {
                      id: 'gr-94',
                      num: '02',
                      title: 'मुसाफिर (Musafir)',
                      author: 'Achyut Godbole (अच्युत गोडबोले)',
                      sub: 'Autobiography',
                    },
                  ].map((item) => {
                    const isSelected = activeBook?.id === item.id;
                    const catalogMatch = catalogById.get(item.id) || {
                      id: item.id,
                      shelf: 'finished' as const,
                    };
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedBookId(item.id)}
                          className={`w-full py-2.5 px-2 text-left transition-colors cursor-pointer flex items-center justify-between gap-3 rounded-lg ${
                            isSelected
                              ? isParchmentLibrary
                                ? 'bg-[#7A1C1C]/10 text-[#7A1C1C] font-semibold'
                                : 'bg-current/10 font-semibold'
                              : 'hover:bg-current/5'
                          }`}
                        >
                          <div className="flex items-baseline gap-2.5 min-w-0">
                            <span className={`font-mono-meta text-xs tabular-nums shrink-0 ${libAccentText}`}>
                              {item.num}.
                            </span>
                            <span className="font-serif-editorial text-base sm:text-lg truncate">
                              {item.title}
                            </span>
                            <span className={`text-xs truncate ${libMutedText}`}>
                              — {item.author}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className={`font-mono-meta text-[10px] tabular-nums hidden sm:inline ${libMutedText}`}>
                              {item.sub}
                            </span>
                            {renderProgressIndicator(catalogMatch, true)}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* List 03: Hindi Literature (8 Classics — Compact Numbered List) */}
              <div className="space-y-2">
                <div className={`flex items-center justify-between border-b pb-1.5 ${libBorderClass}`}>
                  <span className={`font-mono-meta text-xs uppercase tracking-wider font-semibold ${libAccentText}`}>
                    03 · Hindi Literature (हिंदी साहित्य सूची)
                  </span>
                  <span className={`font-mono-meta text-[10px] tabular-nums ${libMutedText}`}>
                    08 Classics
                  </span>
                </div>

                <ol className={`divide-y ${libBorderClass}`}>
                  {[
                    {
                      id: 'gr-107',
                      title: 'सूरज का सातवाँ घोड़ा',
                      sub: 'Suraj Ka Satvan Ghoda',
                      author: 'धर्मवीर भारती (Dharamvir Bharati)',
                    },
                    {
                      id: 'gr-5',
                      title: 'गुनाहों का देवता',
                      sub: 'Gunahon Ka Devta',
                      author: 'धर्मवीर भारती (Dharamvir Bharati)',
                    },
                    {
                      id: 'gr-89',
                      title: 'गोदान',
                      sub: 'Godaan',
                      author: 'मुंशी प्रेमचंद (Munshi Premchand)',
                    },
                    {
                      id: 'gr-11',
                      title: 'दीवार में एक खिड़की रहती थी',
                      sub: 'Deewar Mein Ek Khidki Rahti Thi',
                      author: 'विनोद कुमार शुक्ल (Vinod Kumar Shukla)',
                    },
                    {
                      id: 'gr-108',
                      title: 'राग दरबारी',
                      sub: 'Raag Darbari',
                      author: 'श्रीलाल शुक्ल (Shrilal Shukla)',
                    },
                    {
                      id: 'gr-109',
                      title: 'गबन',
                      sub: 'Gaban',
                      author: 'मुंशी प्रेमचंद (Munshi Premchand)',
                    },
                    {
                      id: 'gr-110',
                      title: 'बनारस टॉकीज',
                      sub: 'Banaras Talkies',
                      author: 'सत्य व्यास (Satya Vyas)',
                    },
                    {
                      id: 'gr-111',
                      title: 'एक गधे की आत्मकथा',
                      sub: 'Ek Gadhe Ki Atmakatha',
                      author: 'कृश्न चंदर (Krishan Chander)',
                    },
                  ].map((book, idx) => {
                    const isSelected = activeBook?.id === book.id;
                    const catalogMatch = catalogById.get(book.id) || {
                      id: book.id,
                      shelf: 'finished' as const,
                    };
                    return (
                      <li key={book.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedBookId(book.id)}
                          className={`w-full py-2 px-2 text-left transition-colors cursor-pointer flex items-center justify-between gap-3 rounded-lg ${
                            isSelected
                              ? isParchmentLibrary
                                ? 'bg-[#7A1C1C]/10 text-[#7A1C1C] font-semibold'
                                : 'bg-current/10 font-semibold'
                              : 'hover:bg-current/5'
                          }`}
                        >
                          <div className="flex items-baseline gap-2.5 min-w-0">
                            <span className={`font-mono-meta text-xs tabular-nums shrink-0 ${libAccentText}`}>
                              {String(idx + 1).padStart(2, '0')}.
                            </span>
                            <div className="min-w-0">
                              <span className="font-marathi-granth text-base sm:text-lg font-medium truncate block sm:inline">
                                {book.title}
                              </span>
                              <span className={`font-mono-meta text-xs sm:ml-2 block sm:inline truncate ${libMutedText}`}>
                                ({book.sub})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className={`text-xs hidden md:inline truncate max-w-[160px] ${libMutedText}`}>
                              {book.author}
                            </span>
                            {renderProgressIndicator(catalogMatch, true)}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Right Column (6 Cols): 02 Marathi Literature (9 Classics — Compact Numbered List) */}
            <div className="lg:col-span-6 space-y-2">
              <div className={`flex items-center justify-between border-b pb-1.5 ${libBorderClass}`}>
                <span className={`font-mono-meta text-xs uppercase tracking-wider font-semibold ${libAccentText}`}>
                  02 · Marathi Literature (मराठी अभिजात साहित्य यादी)
                </span>
                <span className={`font-mono-meta text-[10px] tabular-nums ${libMutedText}`}>
                  09 Essential Classics
                </span>
              </div>

              <ol className={`divide-y ${libBorderClass}`}>
                {[
                  { id: 'gr-99', title: 'Mrutyunjay (मृत्युंजय)', author: 'Shivaji Sawant' },
                  { id: 'gr-100', title: 'Yayati (ययाती)', author: 'V. S. Khandekar' },
                  { id: 'gr-101', title: 'Shriman Yogi (श्रीमान योगी)', author: 'Ranjit Desai' },
                  { id: 'gr-102', title: 'Swami (स्वामी)', author: 'Ranjit Desai' },
                  { id: 'gr-24', title: 'Kosala (कोसला)', author: 'Bhalchandra Nemade' },
                  { id: 'gr-103', title: 'Radheya (राधेय)', author: 'Ranjit Desai' },
                  { id: 'gr-104', title: 'Rau (राऊ)', author: 'N. S. Inamdar' },
                  { id: 'gr-105', title: 'Zadazadti (झाडाझडती)', author: 'Vishwas Patil' },
                  {
                    id: 'gr-106',
                    title: 'Shivaji Kon Hota? (शिवाजी कोण होता?)',
                    author: 'Govind Pansare',
                  },
                ].map((book, idx) => {
                  const isSelected = activeBook?.id === book.id;
                  const catalogMatch = catalogById.get(book.id) || {
                    id: book.id,
                    shelf: 'finished' as const,
                  };
                  return (
                    <li key={book.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedBookId(book.id)}
                        className={`w-full py-2.5 px-2 text-left transition-colors cursor-pointer flex items-center justify-between gap-3 rounded-lg ${
                          isSelected
                            ? isParchmentLibrary
                              ? 'bg-[#7A1C1C]/10 text-[#7A1C1C] font-semibold'
                              : 'bg-current/10 font-semibold'
                            : 'hover:bg-current/5'
                        }`}
                      >
                        <div className="flex items-baseline gap-2.5 min-w-0">
                          <span className={`font-mono-meta text-xs tabular-nums shrink-0 ${libAccentText}`}>
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <div className="min-w-0">
                            <span className="font-marathi-granth text-base sm:text-lg font-medium truncate block sm:inline">
                              {book.title}
                            </span>
                            <span className={`text-xs sm:hidden block truncate ${libMutedText}`}>
                              {book.author}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className={`text-xs hidden sm:inline ${libMutedText}`}>— {book.author}</span>
                          {renderProgressIndicator(catalogMatch, true)}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>

        {/* =====================================================================
            3. FILTER BAR: LANGUAGE BAYS, SEARCH & VIEW MODE (FOLIO SHELVES vs LEDGER)
            ===================================================================== */}
        <div
          className={`p-3.5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 ${libCardBgClass}`}
        >
          {/* Language / Section Aisles */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: `All Aisles (${shelfCounts.all})` },
                { id: 'Marathi', label: 'Marathi · मराठी' },
                { id: 'Hindi', label: 'Hindi · हिंदी' },
                { id: 'English', label: 'English' },
                { id: 'Translated', label: 'World / Translated' },
              ] as const
            ).map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguageFilter(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-meta transition-all cursor-pointer ${
                  languageFilter === lang.id
                    ? isParchmentLibrary
                      ? 'bg-[#8B2E1D] text-white font-semibold'
                      : isWalnutLibrary
                      ? 'bg-[#E3B86B] text-[#172019] font-semibold'
                      : 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium'
                    : `${libSubtleBgClass} opacity-85 hover:opacity-100`
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Right: Search & Sub-View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:w-60">
              <Search
                className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${libMutedText}`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${shelfCounts.all} titles or authors...`}
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none ${libSubtleBgClass}`}
              />
            </div>

            {libraryMode && (
              <div className={`inline-flex items-center rounded-xl p-1 border ${libSubtleBgClass}`}>
                <button
                  type="button"
                  onClick={() => setLibrarySubView('stacks')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono-meta transition-colors cursor-pointer ${
                    librarySubView === 'stacks'
                      ? isParchmentLibrary
                        ? 'bg-[#8B2E1D] text-white'
                        : 'bg-[#E3B86B] text-[#172019]'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>Bookshop Folios</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLibrarySubView('ledger')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono-meta transition-colors cursor-pointer ${
                    librarySubView === 'ledger'
                      ? isParchmentLibrary
                        ? 'bg-[#8B2E1D] text-white'
                        : 'bg-[#E3B86B] text-[#172019]'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <Table className="w-3 h-3" />
                  <span>Catalog Ledger</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
            4. REDESIGNED READING ROOM & BOOKSHOP FOLIO EXPERIENCE
            ===================================================================== */}
        {libraryMode ? (
          librarySubView === 'stacks' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              {/* LEFT 7 COLS: AISLE I, II, III — COMPACT NUMBERED CATALOG LISTS (NO BULKY BOXES) */}
              <div className="lg:col-span-7 space-y-6">
                {(
                  [
                    {
                      shelfKey: 'reading' as const,
                      brassLabel: 'AISLE I · CURRENTLY ON THE NIGHTSTAND',
                      books: filteredBooks.filter((b) => b.shelf === 'reading'),
                    },
                    {
                      shelfKey: 'finished' as const,
                      brassLabel: 'AISLE II · FINISHED & ARCHIVED VOLUMES',
                      books: filteredBooks.filter((b) => b.shelf === 'finished'),
                    },
                    {
                      shelfKey: 'want_to_read' as const,
                      brassLabel: 'AISLE III · THE UNREAD GUILT PILE (WANT TO READ)',
                      books: filteredBooks.filter((b) => b.shelf === 'want_to_read'),
                    },
                  ] as const
                )
                  .filter((bay) => bay.books.length > 0)
                  .map((bay) => {
                    const isAisleExpanded = Boolean(expandedAisles[bay.shelfKey]);
                    const visibleBayBooks = isAisleExpanded
                      ? bay.books
                      : bay.books.slice(0, 5);
                    const hiddenCount = bay.books.length - visibleBayBooks.length;

                    return (
                      <div
                        key={bay.shelfKey}
                        className={`rounded-2xl border overflow-hidden ${libCardBgClass}`}
                      >
                        {/* Brass Aisle Header */}
                        <div
                          className={`px-4 py-3 border-b flex items-center justify-between gap-2 ${
                            isParchmentLibrary
                              ? 'bg-[#EFE5D2] border-[#D8C6A5]'
                              : 'bg-[#120F0C] border-[#33281E]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Bookmark className={`w-3.5 h-3.5 ${libAccentText}`} />
                            <span className="font-mono-meta text-[11px] uppercase tracking-[0.15em] font-semibold">
                              {bay.brassLabel}
                            </span>
                          </div>
                          <span className={`font-mono-meta text-[10px] tabular-nums ${libMutedText}`}>
                            {bay.books.length} {bay.books.length === 1 ? 'volume' : 'volumes'}
                          </span>
                        </div>

                        {/* Sleek Numbered Catalog List for Aisle I / II / III (Short by default with Read More) */}
                        <ol className={`divide-y ${libBorderClass}`}>
                          {visibleBayBooks.map((book, idx) => {
                            const spineColor =
                              FOLIO_SPINE_COLORS[idx % FOLIO_SPINE_COLORS.length];
                            const isSelected = activeBook?.id === book.id;

                            return (
                              <li key={book.id}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedBookId(book.id)}
                                  className={`w-full px-4 py-2.5 text-left transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                                    isSelected
                                      ? isParchmentLibrary
                                        ? 'bg-[#7A1C1C]/10 text-[#7A1C1C] font-semibold'
                                        : 'bg-[#E5B869]/15 text-[#E5B869] font-semibold'
                                      : 'hover:bg-current/5'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <span
                                      style={{ backgroundColor: spineColor }}
                                      className="w-1.5 h-5 rounded-full shrink-0"
                                      aria-hidden="true"
                                    />
                                    <span
                                      className={`font-mono-meta text-xs tabular-nums shrink-0 ${libMutedText}`}
                                    >
                                      {String(idx + 1).padStart(2, '0')}.
                                    </span>
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-baseline gap-x-2">
                                        <span className="font-serif-editorial text-base sm:text-lg leading-snug truncate">
                                          {book.title}
                                        </span>
                                        <span className={`text-xs truncate ${libMutedText}`}>
                                          — {book.author}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2.5 shrink-0 font-mono-meta text-[10px] tabular-nums">
                                    <span
                                      className={`hidden sm:inline-block px-1.5 py-0.5 rounded border ${
                                        isParchmentLibrary
                                          ? 'bg-[#F3E9D7] border-[#D8C7A8] text-[#5C4731]'
                                          : 'bg-[#262019] border-[#3D3126] text-[#D7C7B2]'
                                      }`}
                                    >
                                      {book.language}
                                    </span>
                                    {renderProgressIndicator(book)}
                                    {book.myRating ? (
                                      <span className={`font-semibold hidden md:inline ${libAccentText}`}>
                                        ★ {book.myRating}/5
                                      </span>
                                    ) : (
                                      <span className={`hidden md:inline ${libMutedText}`}>
                                        ★ {book.avgRating.toFixed(1)}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              </li>
                            );
                          })}
                        </ol>

                        {bay.books.length > 5 && (
                          <div className={`px-4 py-2.5 border-t ${libBorderClass} flex justify-between items-center`}>
                            <span className={`font-mono-meta text-[10px] ${libMutedText}`}>
                              Showing {visibleBayBooks.length} of {bay.books.length} books
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleAisleExpand(bay.shelfKey)}
                              className={`font-mono-meta text-xs font-semibold hover:underline cursor-pointer ${libAccentText}`}
                            >
                              {isAisleExpanded
                                ? 'Show less ↑'
                                : `Read more (+${hiddenCount} books) ↓`}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* RIGHT 5 COLS: READING DESK — OPEN BOOK SPREAD & STAMPED BORROWER'S CARD */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                {activeBook && (
                  <div className={`rounded-2xl border p-4 sm:p-5 shadow-lg space-y-4 ${libCardBgClass}`}>
                    {/* Desk Top Bar + Prev/Next Volume Stepper */}
                    <div className={`flex items-center justify-between gap-2 border-b pb-3 ${libBorderClass}`}>
                      <div className="flex items-center gap-2">
                        <BookOpen className={`w-4 h-4 ${libAccentText}`} />
                        <span className={`font-mono-meta text-[10px] uppercase tracking-[0.16em] font-semibold ${libAccentText}`}>
                          Reading Lectern · Volume {activeBook.callNo}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStepBook(-1)}
                          className={`p-1.5 rounded-lg border cursor-pointer ${libSubtleBgClass}`}
                          title="Previous volume"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className={`font-mono-meta text-[10px] px-1.5 ${libMutedText}`}>
                          {activeBookIndexInFiltered + 1}/{filteredBooks.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStepBook(1)}
                          className={`p-1.5 rounded-lg border cursor-pointer ${libSubtleBgClass}`}
                          title="Next volume"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stamped Manila Library Borrower's Card */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeBook.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-xl bg-[#FDF9F0] text-[#1E1710] p-5 border border-[#D5C29F] shadow-inner relative overflow-hidden space-y-4"
                      >
                        {/* Red Library Ink Stamp in Corner */}
                        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded border border-[#8B261D]/70 text-[#8B261D] font-mono-meta text-[10px] uppercase tracking-widest -rotate-3 font-bold select-none">
                          {activeBook.shelf === 'reading'
                            ? 'ON DESK · ACTIVE'
                            : activeBook.shelf === 'finished'
                            ? 'READ · ARCHIVED'
                            : 'RESERVED · QUEUE'}
                        </div>

                        {/* Top Index Header */}
                        <div className="border-b border-[#1E1710]/15 pb-3 pr-24 space-y-1">
                          <div className="font-mono-meta text-[10px] uppercase tracking-widest text-[#6E563A]">
                            CALL NO. {activeBook.callNo} · {activeBook.language.toUpperCase()}
                          </div>
                          <h3 className="font-serif-editorial text-xl sm:text-2xl text-[#17110B] leading-snug">
                            {activeBook.title}
                          </h3>
                          <div className="font-literary italic text-sm text-[#4A3928]">
                            by {activeBook.author}
                          </div>
                        </div>

                        {/* Typewritten Library Card Grid */}
                        <div className="grid grid-cols-2 gap-2.5 font-mono-meta text-xs border-b border-[#1E1710]/15 pb-3.5">
                          <div className="p-2.5 rounded-lg bg-[#F3E9D2]/75">
                            <span className="block text-[9px] uppercase tracking-wider text-[#6E563A]">
                              Goodreads Avg
                            </span>
                            <span className="font-semibold text-[#17110B]">
                              ★ {activeBook.avgRating.toFixed(2)} / 5.00
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#F3E9D2]/75">
                            <span className="block text-[9px] uppercase tracking-wider text-[#6E563A]">
                              Vishvajeet’s Rating
                            </span>
                            <span className="font-semibold text-[#8B261D]">
                              {activeBook.myRating
                                ? `${'★'.repeat(activeBook.myRating)}${'☆'.repeat(
                                    5 - activeBook.myRating
                                  )} (${activeBook.myRating}/5)`
                                : 'Logged on Shelf'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#F3E9D2]/75">
                            <span className="block text-[9px] uppercase tracking-wider text-[#6E563A]">
                              Date Added
                            </span>
                            <span className="text-[#17110B]">{activeBook.dateAdded}</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#F3E9D2]/75">
                            <span className="block text-[9px] uppercase tracking-wider text-[#6E563A]">
                              Date Read
                            </span>
                            <span className="text-[#17110B]">
                              {activeBook.dateRead !== 'not set'
                                ? activeBook.dateRead
                                : activeBook.shelf === 'reading'
                                ? 'In Progress'
                                : 'On Queue'}
                            </span>
                          </div>
                        </div>

                        {/* Visual Reading Progress Bar on Borrower Card */}
                        {(() => {
                          const prog = getBookCompletionProgress(activeBook);
                          return (
                            <div className="p-3 rounded-lg bg-[#F3E9D2]/90 border border-[#D8C6A3] space-y-1.5">
                              <div className="flex items-center justify-between font-mono-meta text-[10px] uppercase tracking-wider">
                                <span className="text-[#6E563A]">
                                  Reading Completion · {prog.statusShort}
                                </span>
                                <span
                                  className={`font-bold ${
                                    prog.percent === 100
                                      ? 'text-[#1E5638]'
                                      : prog.percent > 0
                                      ? 'text-[#8B261D]'
                                      : 'text-[#6E563A]'
                                  }`}
                                >
                                  {prog.percent}% Complete
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-[#DFD0B6] overflow-hidden">
                                <div
                                  style={{ width: `${prog.percent}%` }}
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    prog.percent === 100
                                      ? 'bg-[#1E5638]'
                                      : prog.percent > 0
                                      ? 'bg-[#8B261D]'
                                      : 'bg-[#9E8B70]/40'
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })()}

                        {/* Reader's Marginalia / Note */}
                        <div className="space-y-1.5">
                          <div className="font-mono-meta text-[11px] uppercase tracking-widest text-[#6E563A]">
                            Reader’s Marginalia & Catalog Note
                          </div>
                          <p className="font-literary editorial-body-sm text-[#241B12]">
                            {activeBook.note ||
                              `Cataloged on the ${
                                activeBook.shelf === 'finished'
                                  ? 'Read'
                                  : activeBook.shelf === 'reading'
                                  ? 'Currently Reading'
                                  : 'Want to Read'
                              } shelf (${activeBook.language} collection). Community rating ${activeBook.avgRating.toFixed(
                                2
                              )} across Goodreads readers.`}
                          </p>
                        </div>

                        {/* Bottom Card Punch Hole & Goodreads Link */}
                        <div className="pt-2 flex items-center justify-between text-[11px] font-mono-meta text-[#5E4931]">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full border border-[#B39D7B] bg-[#1A130D]/10 inline-block" />
                            <span>Ex Libris · Vishvajeet Dhawale</span>
                          </span>
                          <a
                            href="https://www.goodreads.com/user/show/72865569-vishvajeet-dhawale"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#8B261D] hover:underline font-semibold"
                          >
                            <span>Goodreads Card</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* =====================================================================
               LIBRARY SUB-VIEW B: ARCHIVAL LEDGER TABLE
               ===================================================================== */
            <div className={`rounded-2xl border overflow-hidden shadow-lg ${libCardBgClass}`}>
              <div
                className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-2 ${libSubtleBgClass}`}
              >
                <div className="flex items-center gap-2">
                  <Table className={`w-4 h-4 ${libAccentText}`} />
                  <span className={`font-mono-meta text-xs uppercase tracking-widest font-semibold ${libAccentText}`}>
                    Archival Master Ledger · Showing{' '}
                    {showAllCatalogBooks ? filteredBooks.length : Math.min(12, filteredBooks.length)}{' '}
                    of {filteredBooks.length} Volumes
                  </span>
                </div>
                <span className={`font-mono-meta text-[11px] ${libMutedText}`}>
                  Click any row to inspect borrower card
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead
                    className={`border-b font-mono-meta text-[10px] uppercase tracking-wider ${libSubtleBgClass}`}
                  >
                    <tr>
                      <th className="py-3 px-4">Call No.</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Avg</th>
                      <th className="py-3 px-4">My Rating</th>
                      <th className="py-3 px-4">Shelf</th>
                      <th className="py-3 px-4">Progress</th>
                      <th className="py-3 px-4">Date Read</th>
                      <th className="py-3 px-4">Date Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/10 text-xs">
                    {(showAllCatalogBooks ? filteredBooks : filteredBooks.slice(0, 12)).map(
                      (book) => {
                        const isSelected = activeBook?.id === book.id;
                        return (
                          <tr
                            key={book.id}
                            onClick={() => {
                              setSelectedBookId(book.id);
                              setLibrarySubView('stacks');
                            }}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#8B2E1D]/15 font-medium' : 'hover:bg-current/5'
                            }`}
                          >
                            <td className={`py-3 px-4 font-mono-meta text-[11px] whitespace-nowrap ${libAccentText}`}>
                              {book.callNo}
                            </td>
                            <td className="py-3 px-4 font-serif-editorial text-base max-w-xs">
                              {book.title}
                            </td>
                            <td className={`py-3 px-4 font-sans-body text-xs whitespace-nowrap ${libMutedText}`}>
                              {book.author}
                            </td>
                            <td className="py-3 px-4 font-mono-meta text-xs whitespace-nowrap">
                              {book.avgRating.toFixed(2)}
                            </td>
                            <td className={`py-3 px-4 font-mono-meta text-xs whitespace-nowrap ${libAccentText}`}>
                              {book.myRating ? '★'.repeat(book.myRating) : '—'}
                            </td>
                            <td className="py-3 px-4 font-mono-meta text-[10px] uppercase whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded border border-current/20">
                                {book.shelf === 'finished'
                                  ? 'read'
                                  : book.shelf === 'reading'
                                  ? 'currently-reading'
                                  : 'to-read'}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {renderProgressIndicator(book)}
                            </td>
                            <td className={`py-3 px-4 font-mono-meta text-[11px] whitespace-nowrap ${libMutedText}`}>
                              {book.dateRead}
                            </td>
                            <td className={`py-3 px-4 font-mono-meta text-[11px] whitespace-nowrap ${libMutedText}`}>
                              {book.dateAdded}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {filteredBooks.length > 12 && (
                <div className={`px-5 py-3 border-t ${libBorderClass} flex items-center justify-between`}>
                  <span className={`font-mono-meta text-xs ${libMutedText}`}>
                    Showing {showAllCatalogBooks ? filteredBooks.length : 12} of {filteredBooks.length} books
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAllCatalogBooks((prev) => !prev)}
                    className={`font-mono-meta text-xs font-semibold hover:underline cursor-pointer ${libAccentText}`}
                  >
                    {showAllCatalogBooks
                      ? 'Show less ↑'
                      : `Read more (Show all ${filteredBooks.length} books) ↓`}
                  </button>
                </div>
              )}
            </div>
          )
        ) : (
          /* =====================================================================
             STANDARD STUDIO EDITORIAL LIST VIEW (WHEN LIBRARY THEME IS OFF)
             ===================================================================== */
          <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden">
            <ol className="divide-y divide-[var(--border-hairline)]">
              {(showAllCatalogBooks ? filteredBooks : filteredBooks.slice(0, 10)).map(
                (book, idx) => (
                  <li
                    key={book.id}
                    className="px-5 py-3.5 hover:bg-[var(--bg-canvas)]/60 transition-colors flex flex-col sm:flex-row sm:items-baseline justify-between gap-2"
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="font-mono-meta text-xs tabular-nums text-[var(--accent-crimson)] shrink-0">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <div className="min-w-0">
                        <span className="font-serif-editorial editorial-card-heading text-[var(--text-primary)]">
                          {book.title}
                        </span>
                        <span className="text-xs sm:text-sm font-mono-meta text-[var(--text-secondary)] ml-2">
                          — {book.author}
                        </span>
                        {book.note && (
                          <p className="font-literary editorial-body-sm text-[var(--text-secondary)] line-clamp-2 sm:line-clamp-1 mt-1">
                            {book.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono-meta text-[11px] tabular-nums text-[var(--text-muted)]">
                      <span className="text-[var(--accent-olive)] uppercase">{book.language}</span>
                      <span>
                        {book.shelf === 'finished'
                          ? 'Read'
                          : book.shelf === 'reading'
                          ? 'Reading'
                          : 'Queue'}
                      </span>
                      {renderProgressIndicator(book)}
                      <span className="text-[var(--accent-crimson)] font-semibold">
                        {book.myRating ? `★ ${book.myRating}/5` : `★ ${book.avgRating.toFixed(1)}`}
                      </span>
                    </div>
                  </li>
                )
              )}
            </ol>

            {filteredBooks.length > 10 && (
              <div className="px-5 py-3.5 border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)]/40 flex items-center justify-between">
                <span className="font-mono-meta text-xs text-[var(--text-muted)]">
                  Showing {showAllCatalogBooks ? filteredBooks.length : 10} of {filteredBooks.length}{' '}
                  books
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllCatalogBooks((prev) => !prev)}
                  className="font-mono-meta text-xs font-semibold text-[var(--accent-crimson)] hover:underline cursor-pointer"
                >
                  {showAllCatalogBooks
                    ? 'Show less ↑'
                    : `Read more (Show all ${filteredBooks.length} books) ↓`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            5. END OF PAGE: LINES THAT FOLLOWED ME OUT OF THE BOOK (56+ NOTES)
            ===================================================================== */}
        <section
          aria-labelledby="saved-passages-heading"
          className={`pt-8 border-t space-y-6 ${libBorderClass}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div
                className={`inline-flex items-center gap-1.5 font-mono-meta text-[11px] uppercase tracking-wider ${libAccentText}`}
              >
                <Quote className="w-3.5 h-3.5" />
                <span>
                  Dog-Eared Pages & Underlined Ink · {allUnderlinedNotes.length}+ Saved Passages
                </span>
              </div>
              <h2 id="saved-passages-heading" className="font-serif-editorial editorial-section-heading">
                Things I Read and Had to Write Down.
              </h2>
            </div>

            {authorMode && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveForm(activeForm === 'passage' ? 'none' : 'passage')
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-meta border ${libCardBgClass}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Passage</span>
                </button>
              </div>
            )}
          </div>

          {/* Spotlight Single Random Line Switcher (Marathi / Hindi / English) */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
              isParchmentLibrary
                ? 'bg-[#FDFBF6] border-[#C9B38C]'
                : isWalnutLibrary
                ? 'bg-[#242F26] border-[#3F5343]'
                : 'bg-[var(--bg-canvas)]/75 border-[var(--border-hairline)]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-current/10 pb-3">
              <span className={`font-mono-meta text-[11px] uppercase tracking-wider ${libAccentText}`}>
                Featured Underlined Line · {(bestLineIndex % filteredBestLines.length) + 1} of{' '}
                {filteredBestLines.length}
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'all', label: `All (${BOOK_BEST_LINES.length})` },
                    { id: 'Hindi', label: 'हिंदी' },
                    { id: 'Marathi', label: 'मराठी' },
                    { id: 'English', label: 'English' },
                  ] as const
                ).map((lf) => (
                  <button
                    key={lf.id}
                    type="button"
                    onClick={() => {
                      setBestLineLangFilter(lf.id);
                      setBestLineIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono-meta text-[10px] border transition-colors cursor-pointer ${
                      bestLineLangFilter === lf.id
                        ? isParchmentLibrary
                          ? 'bg-[#8B2E1D] text-white border-[#8B2E1D]'
                          : 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)]'
                        : 'border-current/15 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {lf.label}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeBestLine.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="space-y-3"
              >
                <blockquote
                  className={`${
                    activeBestLine.language === 'Marathi' || activeBestLine.language === 'Hindi'
                      ? 'font-marathi-granth text-xl sm:text-2xl leading-[1.68]'
                      : 'font-serif-editorial italic text-xl sm:text-2xl leading-[1.52]'
                  } max-w-4xl`}
                >
                  “{activeBestLine.line}”
                </blockquote>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 font-mono-meta text-xs">
                    <span className={`font-semibold ${libAccentText}`}>{activeBestLine.book}</span>
                    <span className="opacity-50">·</span>
                    <span className={libMutedText}>— {activeBestLine.author}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] border border-current/15 opacity-75">
                      {activeBestLine.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setBestLineIndex(
                          (prev) =>
                            (prev - 1 + filteredBestLines.length) % filteredBestLines.length
                        )
                      }
                      className="p-1.5 rounded-lg border border-current/20 hover:border-current cursor-pointer"
                      title="Previous line"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBestLineIndex((prev) => (prev + 1) % filteredBestLines.length)
                      }
                      className="p-1.5 rounded-lg border border-current/20 hover:border-current cursor-pointer"
                      title="Next line"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {authorMode && activeForm === 'passage' && (
            <form
              onSubmit={handleAddPassage}
              className="p-5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-strong)] space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Book Title *"
                  value={newPassage.bookTitle}
                  onChange={(e) =>
                    setNewPassage({ ...newPassage, bookTitle: e.target.value })
                  }
                  className="px-3 py-2 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={newPassage.author}
                  onChange={(e) =>
                    setNewPassage({ ...newPassage, author: e.target.value })
                  }
                  className="px-3 py-2 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                />
              </div>
              <textarea
                rows={2}
                required
                placeholder="Quote or passage *"
                value={newPassage.quote}
                onChange={(e) =>
                  setNewPassage({ ...newPassage, quote: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs rounded-lg font-display font-medium bg-[var(--accent-crimson)] text-white"
              >
                Save Passage
              </button>
            </form>
          )}

        </section>
      </div>
    </div>
  );
};

