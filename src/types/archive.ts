export type NavigationTab =
  | 'home'
  | 'about'
  | 'interests'
  | 'work'
  | 'cinema'
  | 'football'
  | 'books'
  | 'music'
  | 'photography'
  | 'technology'
  | 'writing'
  | 'quiz'
  | 'contact';

export interface QuizQuestion {
  id: string;
  question: string;
  category: string;
  options: string[];
  correctIndex: number;
  points?: number;
  personalNote: string;
  isEditablePlaceholder?: boolean;
}

export interface QuizRoastBand {
  id: string;
  minScore: number;
  maxScore: number;
  rangeLabel: string;
  shortLabel: string;
  roastMessage: string;
}

export interface YoutubePlaylistEntry {
  id: string;
  slotNumber: '01' | '02' | '03';
  title: string;
  category: string;
  description: string;
  playlistUrl: string;
  embedId?: string;
}

export interface SpotifyConfig {
  title: string;
  subtitle: string;
  spotifyUrl: string;
  currentTrackOrMood: string;
}

export interface SpotifyPlaylistEntry {
  id: string;
  slotNumber: '01' | '02' | '03';
  title: string;
  category: string;
  description: string;
  spotifyUrl: string;
}

export interface RandomThought {
  id: string;
  text: string;
  context?: string;
  dateAdded: string;
  isSample?: boolean;
}

export interface FilmEntry {
  id: string;
  title: string;
  director: string;
  year: number;
  language: string;
  personalRating?: string;
  commentary: string;
  topicTags: string[];
  dateAdded: string;
  isSample?: boolean;
}

export interface FrameStudy {
  id: string;
  filmTitle: string;
  director: string;
  year: number;
  aspectRatio: '2.39:1' | '1.85:1' | '1.66:1' | '4:3';
  timestampOrScene: string;
  compositionNote: string;
  lightingNote: string;
  colorPalette: string[];
  cameraPlacement: string;
  imageUrl?: string;
  studyDiagramType:
    | 'fincher-symmetry'
    | 'low-key-practical'
    | 'deep-focus-corridor'
    | 'natural-window-frame';
  isSample?: boolean;
}

export interface CinematographyNote {
  id: string;
  title: string;
  category: string;
  observation: string;
  date: string;
  isSample?: boolean;
}

export interface CinemaCuriosity {
  id: string;
  subject: string;
  category: 'Director' | 'Film' | 'Technique' | 'Language / Movement';
  note: string;
  isSample?: boolean;
}

export interface FootballNote {
  id: string;
  title: string;
  category: 'Barcelona Note' | 'Football Philosophy' | 'Positional Play';
  summary: string;
  body: string;
  date: string;
  isSample?: boolean;
}

export interface MemorableMatch {
  id: string;
  fixture: string;
  competition: string;
  seasonOrDate: string;
  scoreline?: string;
  whyItStayedWithMe: string;
  tacticalObservation: string;
  worthRevisitingFor: string;
  isSample?: boolean;
}

export interface PlayerThought {
  id: string;
  player: string;
  roleOrEra: string;
  observation: string;
  isSample?: boolean;
}

export interface BookEntry {
  id: string;
  title: string;
  author: string;
  status: 'reading' | 'finished' | 'want_to_read';
  progressPercent?: number;
  startedDate?: string;
  finishedDate?: string;
  coverUrl?: string;
  personalNote: string;
  ideaThatStayed?: string;
  isSample?: boolean;
}

export interface ReadingPassage {
  id: string;
  bookTitle: string;
  author: string;
  quoteOrIdea: string;
  reflection: string;
  pageOrChapter?: string;
  date: string;
  isSample?: boolean;
}

export interface PhotoEntry {
  id: string;
  title: string;
  caption: string;
  collection: string;
  date?: string;
  location?: string;
  cameraDetails?: string;
  personalNote: string;
  aspectRatio: '16:9' | '4:3' | '3:4' | '1:1';
  mediaType: 'photo' | 'video';
  mediaUrl?: string;
  videoUrl?: string;
  monochrome?: boolean;
  visualCompositionType?:
    | 'monsoon-courtyard'
    | 'dusk-streetlamp'
    | 'window-blinds'
    | 'train-platform';
  isFeaturedOnHome?: boolean;
  isSample?: boolean;
}

export interface TechEntry {
  id: string;
  title: string;
  category:
    | 'Interesting Technology'
    | 'Concept Explored'
    | 'Small Experiment'
    | 'Learning Note';
  summary: string;
  details: string;
  linkUrl?: string;
  date: string;
  tags: string[];
  isSample?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  category:
    | 'Cinema'
    | 'Philosophy'
    | 'Football'
    | 'Books'
    | 'Technology'
    | 'Observations';
  tags: string[];
  publishedAt: string;
  status: 'published' | 'draft';
  stoicQuestionRef?: string;
  isSample?: boolean;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface ArchiveData {
  settings: {
    randomThoughtEnabled: boolean;
    showSampleEntries: boolean;
    currentlyCuriousAbout: string[];
    thingsFiguringOut: string[];
    gettingBackToReadingNote: string;
    socialLinks: SocialLink[];
  };
  randomThoughts: RandomThought[];
  quiz?: QuizQuestion[];
  quizRoasts?: QuizRoastBand[];
  youtubePlaylists?: YoutubePlaylistEntry[];
  spotify?: SpotifyConfig;
  spotifyPlaylists?: SpotifyPlaylistEntry[];
  cinema: {
    films: FilmEntry[];
    frameStudies: FrameStudy[];
    cinematographyNotes: CinematographyNote[];
    curiosities: CinemaCuriosity[];
  };
  football: {
    notes: FootballNote[];
    matches: MemorableMatch[];
    players: PlayerThought[];
  };
  books: {
    entries: BookEntry[];
    passages: ReadingPassage[];
  };
  photography: {
    items: PhotoEntry[];
  };
  technology: {
    items: TechEntry[];
  };
  blog: {
    posts: BlogPost[];
    stoicPrompts: string[];
  };
}
