import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film,
  Clapperboard,
  ArrowUpRight,
  Shuffle,
  X,
  Star,
  Sparkles,
} from 'lucide-react';
import { ArchiveData } from '../types/archive';

interface CinemaSectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
  onReadBlogPost?: (slug: string) => void;
}

interface FavoriteFilmItem {
  id: string;
  title: string;
  year: number;
  director: string;
  language: string;
  rating: string;
  context: string;
}

interface CuratedListFilm {
  title: string;
  year: number;
  context: string;
}

interface CuratedListEntry {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  url: string;
  films: CuratedListFilm[];
}

interface RandomDialogueLine {
  id: string;
  quote: string;
  film: string;
  year: number;
  character: string;
}

const FAVORITE_FILMS: FavoriteFilmItem[] = [
  {
    id: 'fav-1',
    title: 'The Shawshank Redemption',
    year: 1994,
    director: 'Frank Darabont',
    language: 'English',
    rating: '★★★★★',
    context: 'Patience, quiet dignity, and the kind of hope that survives twenty years behind stone walls.',
  },
  {
    id: 'fav-2',
    title: 'Se7en',
    year: 1995,
    director: 'David Fincher',
    language: 'English',
    rating: '★★★★★',
    context: 'Rain-drenched neo-noir, relentless moral dread, and an ending that rewired modern thrillers forever.',
  },
  {
    id: 'fav-3',
    title: 'Memories of Murder',
    year: 2003,
    director: 'Bong Joon-ho',
    language: 'Korean',
    rating: '★★★★★',
    context: 'Rain-soaked rural procedural with the most haunting final close-up in modern cinema.',
  },
  {
    id: 'fav-4',
    title: 'The Lord of the Rings',
    year: 2001,
    director: 'Peter Jackson',
    language: 'English',
    rating: '★★★★★',
    context: 'Mythic scale, fellowship, and cinema built with a level of craft and heart we may never see again.',
  },
  {
    id: 'fav-5',
    title: 'There Will Be Blood',
    year: 2007,
    director: 'Paul Thomas Anderson',
    language: 'English',
    rating: '★★★★★',
    context: 'Oil, ambition, and Daniel Plainview—a towering character study of obsession and spiritual rot.',
  },
  {
    id: 'fav-6',
    title: 'Ashi Hi Banwa Banwi',
    year: 1988,
    director: 'Sachin Pilgaonkar',
    language: 'Marathi',
    rating: '★★★★★',
    context: 'The undisputed gold standard of Marathi comedy—every single line is permanently etched in memory.',
  },
];

// 18 Iconic, Philosophical & Pure-Aura Dialogues (revealed one at a time via Random Line button)
const RANDOM_FILM_DIALOGUES: RandomDialogueLine[] = [
  {
    id: 'dlg-1',
    quote:
      'A man who doesn’t spend time with his family can never be a real man.',
    film: 'The Godfather',
    year: 1972,
    character: 'Don Vito Corleone',
  },
  {
    id: 'dlg-2',
    quote:
      'Time is a flat circle. Everything we have done or will do we are going to do over and over and over again.',
    film: 'True Detective',
    year: 2014,
    character: 'Rust Cohle',
  },
  {
    id: 'dlg-3',
    quote:
      'All those moments will be lost in time, like tears in rain.',
    film: 'Blade Runner',
    year: 1982,
    character: 'Roy Batty',
  },
  {
    id: 'dlg-4',
    quote:
      'You either die a hero, or you live long enough to see yourself become the villain.',
    film: 'The Dark Knight',
    year: 2008,
    character: 'Harvey Dent',
  },
  {
    id: 'dlg-5',
    quote:
      'Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hain, Senorita.',
    film: 'Dilwale Dulhania Le Jayenge',
    year: 1995,
    character: 'Raj Malhotra',
  },
  {
    id: 'dlg-6',
    quote:
      'Babumoshai, zindagi badi honi chahiye, lambi nahi.',
    film: 'Anand',
    year: 1971,
    character: 'Anand Sehgal',
  },
  {
    id: 'dlg-7',
    quote:
      'You’re waiting for a train. A train that will take you far away. You know where you hope this train will take you, but you can’t know for sure.',
    film: 'Inception',
    year: 2010,
    character: 'Mal / Cobb',
  },
  {
    id: 'dlg-8',
    quote:
      'Are you watching closely? Every great magic trick consists of three parts or acts.',
    film: 'The Prestige',
    year: 2006,
    character: 'Cutter',
  },
  {
    id: 'dlg-9',
    quote:
      'Main udna chahta hoon, daudna chahta hoon, girna bhi chahta hoon... bus rukna nahi chahta.',
    film: 'Yeh Jawaani Hai Deewani',
    year: 2013,
    character: 'Kabir Thapar (Bunny)',
  },
  {
    id: 'dlg-10',
    quote:
      'The greatest trick the Devil ever pulled was convincing the world he didn’t exist.',
    film: 'The Usual Suspects',
    year: 1995,
    character: 'Verbal Kint',
  },
  {
    id: 'dlg-11',
    quote:
      'Get busy living, or get busy dying.',
    film: 'The Shawshank Redemption',
    year: 1994,
    character: 'Andy Dufresne',
  },
  {
    id: 'dlg-12',
    quote:
      'Main apni galtiyon ka hisaab nahi rakhta, par doosron ki galtiyan kabhi nahi bhoolta.',
    film: 'Sarkar',
    year: 2005,
    character: 'Subhash Nagre',
  },
  {
    id: 'dlg-13',
    quote:
      'So we beat on, boats against the current, borne back ceaselessly into the past.',
    film: 'The Great Gatsby',
    year: 2013,
    character: 'Nick Carraway',
  },
  {
    id: 'dlg-14',
    quote:
      'Aaj mere paas bangla hai, gaadi hai, bank balance hai... tumhare paas kya hai? — Mere paas Maa hai.',
    film: 'Deewaar',
    year: 1975,
    character: 'Vijay & Ravi Verma',
  },
  {
    id: 'dlg-15',
    quote:
      'Hope is a good thing, maybe the best of things, and no good thing ever dies.',
    film: 'The Shawshank Redemption',
    year: 1994,
    character: 'Andy Dufresne',
  },
  {
    id: 'dlg-16',
    quote:
      'We accept the love we think we deserve.',
    film: 'The Perks of Being a Wallflower',
    year: 2012,
    character: 'Mr. Anderson',
  },
  {
    id: 'dlg-17',
    quote:
      'Do not go gentle into that good night. Rage, rage against the dying of the light.',
    film: 'Interstellar',
    year: 2014,
    character: 'Professor Brand',
  },
  {
    id: 'dlg-18',
    quote:
      'In another life, I would have really liked just doing laundry and taxes with you.',
    film: 'Everything Everywhere All at Once',
    year: 2022,
    character: 'Waymond Wang',
  },
];

// All 11 Lists synced from https://letterboxd.com/mivishvajeet/lists/
const LETTERBOXD_11_LISTS: CuratedListEntry[] = [
  {
    id: 'list-01',
    num: '01',
    title: 'Bollywood Underrated Gems !',
    subtitle: 'Hindi films that deserved a much louder theatre',
    url: 'https://letterboxd.com/mivishvajeet/list/bollywood-underrated-gems/',
    films: [
      { title: 'Karwaan', year: 2018, context: 'Irrfan Khan’s effortless deadpan warmth on a road trip through Kerala.' },
      { title: '404: Error Not Found', year: 2011, context: 'Psychological campus thriller blurring hallucination and ragging trauma.' },
      { title: 'No Smoking', year: 2007, context: 'Anurag Kashyap’s surreal Kafkaesque nightmare about control.' },
      { title: 'Ugly', year: 2013, context: 'Bleak procedural where adult ego eclipses a missing child.' },
      { title: 'Manorama Six Feet Under', year: 2007, context: 'Dusty Rajasthani neo-noir inspired by Chinatown.' },
      { title: 'Raincoat', year: 2004, context: 'Rituparno Ghosh’s chamber drama on pride and unspoken love.' },
      { title: 'Madras Cafe', year: 2013, context: 'Grounded espionage thriller treated as journalism rather than jingoism.' },
      { title: 'Masaan', year: 2015, context: 'Grief, caste, and quiet redemption along the ghats of Varanasi.' },
      { title: 'A Death in the Gunj', year: 2016, context: 'Konkona Sen Sharma’s haunting study of fragility and casual cruelty.' },
      { title: 'Johnny Gaddaar', year: 2007, context: 'Sriram Raghavan’s pulpy crime domino effect where every lie compounds.' },
    ],
  },
  {
    id: 'list-02',
    num: '02',
    title: 'Beauty of Regional Cinema',
    subtitle: 'Malayalam, Tamil, Marathi, Bengali & Assamese masterworks',
    url: 'https://letterboxd.com/mivishvajeet/list/beauty-of-regional-cinema/',
    films: [
      { title: 'Super Deluxe', year: 2019, context: 'Four intersecting moral crises in Chennai balanced between absurdity and grace.' },
      { title: 'Killa', year: 2014, context: 'Avinash Arun’s monsoon-drenched Marathi portrait of a boy adapting to a new town.' },
      { title: 'Karnan', year: 2021, context: 'Mari Selvaraj’s mythic, visceral uprising for dignity in a forgotten village.' },
      { title: 'Kumbalangi Nights', year: 2019, context: 'Four dysfunctional brothers in the backwaters learning tenderness.' },
      { title: 'The Golden Fortress (Sonar Kella)', year: 1974, context: 'Satyajit Ray’s Feluda mystery across the golden forts of Rajasthan.' },
      { title: 'Vada Chennai', year: 2018, context: 'Vetrimaaran’s sprawling decades-long gangland epic in North Chennai.' },
      { title: 'Thithi', year: 2015, context: 'Three generations reacting to a 101-year-old patriarch’s funeral in rural Karnataka.' },
      { title: 'Village Rockstars', year: 2017, context: 'Rima Das’s poetic Assamese story of a girl dreaming of a real guitar.' },
      { title: 'Soorarai Pottru', year: 2020, context: 'Relentless conviction against entrenched class barriers in aviation.' },
      { title: 'Meri Nimmo', year: 2018, context: 'Innocent childhood devotion told without a single false note.' },
    ],
  },
  {
    id: 'list-03',
    num: '03',
    title: 'Watched With Mom',
    subtitle: 'Living-room screenings that needed zero explanation',
    url: 'https://letterboxd.com/mivishvajeet/list/watched-with-mom/',
    films: [
      { title: 'Nil Battey Sannata', year: 2015, context: 'A mother enrolling in her daughter’s math class so she never gives up.' },
      { title: 'Lapachhapi', year: 2017, context: 'Marathi horror thriller set inside tall sugarcane fields.' },
      { title: 'Secret Superstar', year: 2017, context: 'Quiet maternal courage protecting a daughter’s voice.' },
      { title: '102 Not Out', year: 2018, context: 'Lighthearted warmth on aging without losing curiosity.' },
      { title: 'Sairat', year: 2016, context: 'Nagraj Manjule’s sweeping romance and its unforgettable silent final seconds.' },
      { title: 'Natsamrat', year: 2016, context: 'Nana Patekar as an aging Shakespearean stage titan confronting ingratitude.' },
      { title: 'Drishyam', year: 2015, context: 'The ultimate family alibi thriller watched on the edge of the sofa.' },
      { title: 'Katyar Kaljat Ghusali', year: 2015, context: 'Classical Hindustani vocal rivalry brought to the Marathi screen.' },
      { title: 'Duniyadari', year: 2013, context: 'Nostalgic college friendship and heartbreak in Maharashtra.' },
      { title: '3 Idiots', year: 2009, context: 'The rare film the entire household rewatches from any scene.' },
    ],
  },
  {
    id: 'list-04',
    num: '04',
    title: 'Must Watch Marathi Movies',
    subtitle: 'The heart of Marathi storytelling, theatre & social realism',
    url: 'https://letterboxd.com/mivishvajeet/list/must-watch-marathi-movies/',
    films: [
      { title: 'Pinjra', year: 1972, context: 'V. Shantaram’s tragic classic on moral rigidity and Tamasha folk art.' },
      { title: 'Natsamrat', year: 2016, context: 'Towering theatrical monologues on stage glory and family exile.' },
      { title: 'Katyar Kaljat Ghusali', year: 2015, context: 'Subodh Bhave’s musical drama where devotion battles ego.' },
      { title: 'Deool', year: 2011, context: 'Umesh Kulkarni’s razor-sharp satire on commercialization of faith in a quiet village.' },
      { title: 'Court', year: 2014, context: 'Chaitanya Tamhane’s deadpan anatomy of the Indian lower judiciary.' },
      { title: 'Fandry', year: 2013, context: 'A boy’s crush colliding with the brutal reality of caste hierarchy.' },
      { title: 'Harishchandrachi Factory', year: 2009, context: 'Joyful biopic on Dadasaheb Phalke and the birth of Indian cinema.' },
      { title: 'Shwaas', year: 2004, context: 'A grandfather and grandson’s final days before an eye operation.' },
      { title: 'Mulshi Pattern', year: 2018, context: 'Gritty examination of farmers losing land to rapid urban expansion.' },
      { title: 'Kaksparsh', year: 2012, context: 'Period drama set in 1930s Konkan with powerhouse performances.' },
    ],
  },
  {
    id: 'list-05',
    num: '05',
    title: 'Masterpiece Which Are Less Known',
    subtitle: 'Quietly extraordinary films outside the mainstream radar',
    url: 'https://letterboxd.com/mivishvajeet/list/masterpiece-which-are-less-known/',
    films: [
      { title: 'Eeb Allay Ooo!', year: 2019, context: 'Absurdist, tender portrait of a migrant hired to scare monkeys in Lutyens’ Delhi.' },
      { title: 'Aamis (Ravening)', year: 2019, context: 'Bhaskar Hazarika’s Assamese romance that slowly mutates into forbidden obsession.' },
      { title: 'Cat Sticks (Patakha)', year: 2019, context: 'Stark black-and-white nocturnal odyssey through rainy Kolkata streets.' },
      { title: 'c/o Kancharapalem', year: 2018, context: 'Four unconventional love stories across age and religion in a Telugu town.' },
      { title: 'Ankhon Dekhi', year: 2013, context: 'Sanjay Mishra resolving to believe only what he witnesses with his own eyes.' },
      { title: 'Ship of Theseus', year: 2012, context: 'Three philosophical vignettes on identity, ethics, and wholeness.' },
      { title: 'Soni', year: 2018, context: 'Long-take realism following two women officers navigating Delhi at night.' },
      { title: 'Kadvi Hawa', year: 2017, context: 'A blind father and a bank recovery agent caught in climate despair.' },
      { title: 'Gamak Ghar', year: 2019, context: 'Achal Mishra’s meditative Maithili portrait of an ancestral house over two decades.' },
      { title: 'Hamid', year: 2018, context: 'A Kashmiri boy dialing 786 hoping to speak directly to God.' },
    ],
  },
  {
    id: 'list-06',
    num: '06',
    title: 'Best Documentaries',
    subtitle: 'Non-fiction cinema, investigative archives & real lives',
    url: 'https://letterboxd.com/mivishvajeet/list/best-documentaries/',
    films: [
      { title: 'House of Secrets: The Burari Deaths', year: 2021, context: 'Chilling examination of silence, shared delusion, and generational control.' },
      { title: 'Wild Wild Country', year: 2018, context: 'Archival footage of how a utopian commune in Oregon spiraled into conflict.' },
      { title: 'Senna', year: 2010, context: 'Asif Kapadia’s pure-archive portrait of Ayrton Senna at 300 km/h.' },
      { title: 'Diego Maradona', year: 2019, context: 'Genius and chaos in Naples — two halves of the same man.' },
      { title: '14 Peaks: Nothing Is Impossible', year: 2021, context: 'Nimsdai Purja scaling all fourteen 8,000-meter Himalayan summits.' },
      { title: 'The Act of Killing', year: 2012, context: 'Joshua Oppenheimer’s surreal confrontation with unrepentant history.' },
      { title: 'Searching for Sugar Man', year: 2012, context: 'A forgotten Detroit musician who unknowingly became an icon across the ocean.' },
      { title: 'Reason (Vivek)', year: 2018, context: 'Anand Patwardhan’s four-hour documentary inquiry into rationalism in India.' },
    ],
  },
  {
    id: 'list-07',
    num: '07',
    title: 'Movies With Best Ending !',
    subtitle: 'Final five minutes that rewire everything before them',
    url: 'https://letterboxd.com/mivishvajeet/list/movies-with-best-ending/',
    films: [
      { title: 'The Prestige', year: 2006, context: '“Are you watching closely?” — sacrifice hidden in plain sight.' },
      { title: 'Incendies', year: 2010, context: 'Denis Villeneuve’s mathematical gasp of a final revelation (1 + 1 = 1).' },
      { title: 'The Usual Suspects', year: 1995, context: 'A coffee cup dropping in slow motion as a limp disappears on the sidewalk.' },
      { title: 'Se7en', year: 1995, context: 'High-voltage desert sun and a cardboard box that breaks every rule.' },
      { title: 'Memories of Murder', year: 2003, context: 'Detective Park looking straight through the camera lens at the audience.' },
      { title: 'Shutter Island', year: 2010, context: '“Which would be worse — to live as a monster, or to die as a good man?”' },
      { title: 'Whiplash', year: 2014, context: 'Nine wordless minutes of drums and a nod of mutual destruction.' },
      { title: 'Andhadhun', year: 2018, context: 'A blind man’s cane knocking a soda can out of the way in Europe.' },
      { title: 'Oldboy', year: 2003, context: 'Snowy hypnosis and a smile that holds both relief and horror.' },
      { title: 'Kahaani', year: 2012, context: 'Durga Puja crowds in Kolkata concealing a masterstroke of misdirection.' },
    ],
  },
  {
    id: 'list-08',
    num: '08',
    title: 'Movies Based on True Events',
    subtitle: 'Real investigations, history & human endurance on screen',
    url: 'https://letterboxd.com/mivishvajeet/list/movies-based-on-true-events/',
    films: [
      { title: 'Zodiac', year: 2007, context: 'Meticulous newspaperroom procedural where the obsession outlives the clues.' },
      { title: 'Spotlight', year: 2015, context: 'Quiet, unglamorous investigative journalism knocking on doors.' },
      { title: 'Talvar', year: 2015, context: 'Rashomon-style anatomy of a botched double-murder investigation.' },
      { title: 'Shahid', year: 2012, context: 'Hansal Mehta and Rajkummar Rao tracing lawyer Shahid Azmi’s life.' },
      { title: 'Black Friday', year: 2004, context: 'Forensic reconstruction of the 1993 Bombay blasts investigation.' },
      { title: 'Schindler’s List', year: 1993, context: 'Monochrome history where every name on paper meant a human life.' },
      { title: 'Catch Me If You Can', year: 2002, context: 'Loneliness disguised as a high-flying cat-and-mouse chase.' },
      { title: 'Paan Singh Tomar', year: 2012, context: 'How a national steeplechase champion was pushed into the Chambal ravines.' },
    ],
  },
  {
    id: 'list-09',
    num: '09',
    title: 'Feel Good Movies',
    subtitle: 'Warmth, road trips & quiet comfort when the week is heavy',
    url: 'https://letterboxd.com/mivishvajeet/list/feel-good-movies/',
    films: [
      { title: 'Zindagi Na Milegi Dobara', year: 2011, context: 'Spanish highways, poetry, and friendships that need honest air.' },
      { title: 'Wake Up Sid', year: 2009, context: 'Mumbai monsoon rains, photography, and figuring out adulthood slowly.' },
      { title: 'Piku', year: 2015, context: 'A Delhi-to-Kolkata road trip built on bickering and unspoken care.' },
      { title: 'The Secret Life of Walter Mitty', year: 2013, context: 'Leaving the darkroom behind to actually step into the frame.' },
      { title: 'Dear Zindagi', year: 2016, context: 'Learning that you don’t have to carry every chair in the room.' },
      { title: ' Dil Chahta Hai', year: 2001, context: 'Three friends growing up at different speeds between Mumbai and Goa.' },
      { title: 'Qarib Qarib Singlle', year: 2017, context: 'Irrfan and Parvathy turning mismatched travel into quiet charm.' },
      { title: 'Udaan', year: 2010, context: 'Breaking free in a sprint down an open road with nothing but a notebook.' },
    ],
  },
  {
    id: 'list-10',
    num: '10',
    title: 'Mind-Bending & Psychological Thrillers',
    subtitle: 'Unreliable narrators, labyrinths & moral puzzles',
    url: 'https://letterboxd.com/mivishvajeet/list/mind-bending-thrillers/',
    films: [
      { title: 'Prisoners', year: 2013, context: 'Moral desperation in the rain where every choice darkens the room.' },
      { title: 'Memento', year: 2000, context: 'Polaroids, tattoos, and a mystery told backward to mirror memory loss.' },
      { title: 'Gone Girl', year: 2014, context: 'Media performance and marriage dissected with surgical coldness.' },
      { title: 'Kaun?', year: 1999, context: 'Three actors, one stormy house, and a doorbell that keeps changing the truth.' },
      { title: 'Ratsasan', year: 2018, context: 'Relentless Tamil procedural that never lets the tension drop for a minute.' },
      { title: 'Table No. 21', year: 2013, context: 'A game show in Fiji that circles back to an unforgivable college sin.' },
      { title: '13B: Fear Has a New Address', year: 2009, context: 'A television soap opera broadcasting what is about to happen inside the flat.' },
      { title: 'Karthik Calling Karthik', year: 2010, context: 'A 5:00 AM phone call from a voice that knows your every insecurity.' },
    ],
  },
  {
    id: 'list-11',
    num: '11',
    title: 'Directors Whose Frames Stay With Me',
    subtitle: 'Filmmakers whose blocking, light & silence I study closely',
    url: 'https://letterboxd.com/mivishvajeet/list/directors-whose-frames-stay-with-me/',
    films: [
      { title: 'In the Mood for Love', year: 2000, context: 'Wong Kar-wai · Doorways, staircase shadows, and everything left unsaid.' },
      { title: 'Parasite', year: 2019, context: 'Bong Joon-ho · Architectural staircases used as a vertical measure of class.' },
      { title: 'There Will Be Blood', year: 2007, context: 'Paul Thomas Anderson · Wide-angle isolation and ambition turning to oil.' },
      { title: 'Pather Panchali', year: 1955, context: 'Satyajit Ray · Train smoke across white kash flowers and human grace.' },
      { title: 'Cure', year: 1997, context: 'Kiyoshi Kurosawa · Static master shots that make an empty room feel hypnotic.' },
      { title: 'Guru Dutt’s Pyaasa', year: 1957, context: 'Guru Dutt · High-contrast chiaroscuro lighting in a world that values poets only after death.' },
      { title: 'Sardar Udham', year: 2021, context: 'Shoojit Sircar · Winter stillness and the unbearable weight of carrying survivors.' },
      { title: 'Iruvar', year: 1997, context: 'Mani Ratnam · Santosh Sivan’s light capturing friendship fracturing into politics.' },
    ],
  },
];

export const CinemaSection: React.FC<CinemaSectionProps> = () => {
  const [theaterMode, setTheaterMode] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>(LETTERBOXD_11_LISTS[0].id);
  const [dialogueIndex, setDialogueIndex] = useState<number | null>(null);

  const activeList = useMemo(
    () => LETTERBOXD_11_LISTS.find((l) => l.id === selectedListId) || LETTERBOXD_11_LISTS[0],
    [selectedListId]
  );

  const handleRollDialogue = () => {
    setDialogueIndex((prev) => {
      if (prev === null) {
        return Math.floor(Math.random() * RANDOM_FILM_DIALOGUES.length);
      }
      return (prev + 1) % RANDOM_FILM_DIALOGUES.length;
    });
  };

  const activeDialogue =
    dialogueIndex !== null ? RANDOM_FILM_DIALOGUES[dialogueIndex] : null;

  return (
    <div
      className={`rounded-2xl transition-all duration-500 ${
        theaterMode
          ? 'bg-[#060608] text-[#F2EDE4] p-4 sm:p-8 border border-[#2C181B] shadow-[0_25px_70px_rgba(0,0,0,0.92)] relative overflow-hidden'
          : 'space-y-12'
      }`}
    >
      {/* =====================================================================
          IMMERSIVE 35MM THEATER PROJECTION ATMOSPHERE (WHEN THEATER MODE IS ON)
          ===================================================================== */}
      {theaterMode && (
        <>
          {/* Top CinemaScope Anamorphic Black Velvet Valance + Overhead Projector Lens */}
          <div
            aria-hidden="true"
            className="pointer-events-none flex items-center justify-between px-4 py-2 mb-6 rounded-lg bg-black/90 border border-[#E5B869]/25 text-[10px] font-mono-meta text-[#E5B869]"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D9383A] animate-pulse" />
              <span>AUDITORIUM 01 · 35MM ANAMORPHIC PROJECTION</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[#A39887]">
              <span>ASPECT 2.39:1</span>
              <span>24 FPS</span>
              <span className="text-[#E5B869]">ROW F · CENTER SEAT</span>
            </div>
          </div>

          {/* Overhead Projector Light Cone Beam */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-96 opacity-35"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(229, 184, 105, 0.34) 0%, rgba(168, 42, 49, 0.10) 45%, transparent 75%)',
            }}
          />

          {/* Left & Right 35mm Sprocket Perforation Strips */}
          <div
            aria-hidden="true"
            className="pointer-events-none hidden xl:flex flex-col justify-between absolute top-16 bottom-16 left-2 w-2.5 opacity-20"
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="w-2 h-3 rounded-[2px] border border-[#E5B869]" />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none hidden xl:flex flex-col justify-between absolute top-16 bottom-16 right-2 w-2.5 opacity-20"
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="w-2 h-3 rounded-[2px] border border-[#E5B869]" />
            ))}
          </div>
        </>
      )}

      <div className="relative z-10 space-y-10">
        {/* =====================================================================
            1. HEADER + STATS (557 FILMS · 19 THIS YEAR · 11 LISTS) + RANDOM DIALOGUE
            ===================================================================== */}
        <header
          className={`border-b pb-7 space-y-6 ${
            theaterMode ? 'border-[#26201B]' : 'border-[var(--border-hairline)]'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-1.5 max-w-xl">
              <div
                className={`inline-flex items-center gap-2 font-mono-meta text-[11px] uppercase tracking-wider ${
                  theaterMode ? 'text-[#E5B869]' : 'text-[var(--accent-crimson)]'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>01 · Cinema &amp; Letterboxd Notebook · 557 Logged</span>
              </div>
              <h1
                className={`font-serif-editorial editorial-hero-display ${
                  theaterMode ? 'text-[#FAF5EC]' : 'text-[var(--text-primary)]'
                }`}
              >
                Two hours watching a film, four hours overthinking one frame.
              </h1>
              <p
                className={`editorial-body ${
                  theaterMode ? 'text-[#B8AFA0]' : 'text-[var(--text-secondary)]'
                }`}
              >
                Psychological thrillers, regional Indian masterpieces (Marathi, Malayalam, Tamil), and films whose final shot refuses to leave my head.
              </p>
            </div>

            {/* Right Controls: Random Dialogue Button + Theater Mode Toggle + Letterboxd */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
              {/* Random Dialogue Button (Just like Random Thought in Hero) */}
              <button
                type="button"
                onClick={handleRollDialogue}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono-meta border transition-all cursor-pointer ${
                  theaterMode
                    ? 'bg-[#151210] text-[#E5B869] border-[#E5B869]/40 hover:border-[#E5B869]'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--accent-crimson)]'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{dialogueIndex === null ? 'Random dialogue' : 'Another dialogue'}</span>
              </button>

              {/* Enter Screening Room / Theater Toggle */}
              <button
                type="button"
                onClick={() => setTheaterMode((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono-meta border transition-all cursor-pointer ${
                  theaterMode
                    ? 'bg-[#8B1E24] text-white border-[#E5B869]/60 shadow-[0_0_25px_rgba(229,184,105,0.22)]'
                    : 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)] hover:bg-[var(--accent-crimson)] hover:border-[var(--accent-crimson)]'
                }`}
              >
                <Clapperboard className="w-3.5 h-3.5" />
                <span>{theaterMode ? 'Leave Theater' : 'Enter Theater'}</span>
              </button>

              <a
                href="https://letterboxd.com/mivishvajeet/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono-meta border transition-colors ${
                  theaterMode
                    ? 'bg-[#121010] text-[#EAE2D6] border-[#2B241D] hover:border-[#E5B869]'
                    : 'bg-[var(--bg-canvas)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--accent-crimson)]'
                }`}
              >
                <span>@mivishvajeet</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Pop-Up Random Dialogue Card (Only visible when clicked, zero dedicated section clutter) */}
          <AnimatePresence mode="wait">
            {activeDialogue && (
              <motion.div
                key={activeDialogue.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  theaterMode
                    ? 'bg-[#110E0D] border-[#E5B869]/40 text-[#FAF5EC]'
                    : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-primary)]'
                }`}
              >
                <div className="space-y-1.5 max-w-3xl">
                  <blockquote className="font-serif-editorial italic editorial-quote">
                    “{activeDialogue.quote}”
                  </blockquote>
                  <div
                    className={`font-mono-meta text-[11px] ${
                      theaterMode ? 'text-[#E5B869]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    — {activeDialogue.character} · {activeDialogue.film} ({activeDialogue.year})
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={handleRollDialogue}
                    className={`text-xs font-mono-meta underline underline-offset-4 ${
                      theaterMode ? 'text-[#E5B869]' : 'text-[var(--accent-crimson)]'
                    }`}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={() => setDialogueIndex(null)}
                    className="inline-flex items-center gap-1 text-xs font-mono-meta opacity-65 hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Letterboxd Stats Strip: 557 Films · 19 This year · 11 Lists */}
          <div
            className={`grid grid-cols-3 gap-4 p-4 rounded-xl border ${
              theaterMode
                ? 'bg-[#0E0D10] border-[#28211B] shadow-[inset_0_1px_0_rgba(229,184,105,0.12)]'
                : 'bg-[var(--bg-canvas)]/60 border-[var(--border-hairline)]'
            }`}
          >
            <a
              href="https://letterboxd.com/mivishvajeet/films/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div
                className={`font-serif-editorial text-2xl sm:text-3xl leading-none transition-colors tabular-nums ${
                  theaterMode
                    ? 'text-[#E5B869] group-hover:text-white'
                    : 'text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)]'
                }`}
              >
                557
              </div>
              <div
                className={`font-mono-meta text-[10px] sm:text-xs uppercase tracking-wider mt-1 ${
                  theaterMode ? 'text-[#9F9587]' : 'text-[var(--text-muted)]'
                }`}
              >
                Films
              </div>
            </a>

            <a
              href="https://letterboxd.com/mivishvajeet/films/diary/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group block border-l pl-4 sm:pl-6 ${
                theaterMode ? 'border-[#28211B]' : 'border-[var(--border-hairline)]'
              }`}
            >
              <div
                className={`font-serif-editorial text-2xl sm:text-3xl leading-none transition-colors tabular-nums ${
                  theaterMode
                    ? 'text-[#E5B869] group-hover:text-white'
                    : 'text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)]'
                }`}
              >
                19
              </div>
              <div
                className={`font-mono-meta text-[10px] sm:text-xs uppercase tracking-wider mt-1 ${
                  theaterMode ? 'text-[#9F9587]' : 'text-[var(--text-muted)]'
                }`}
              >
                This year
              </div>
            </a>

            <a
              href="https://letterboxd.com/mivishvajeet/lists/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group block border-l pl-4 sm:pl-6 ${
                theaterMode ? 'border-[#28211B]' : 'border-[var(--border-hairline)]'
              }`}
            >
              <div
                className={`font-serif-editorial text-2xl sm:text-3xl leading-none transition-colors tabular-nums ${
                  theaterMode
                    ? 'text-[#E5B869] group-hover:text-white'
                    : 'text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)]'
                }`}
              >
                11
              </div>
              <div
                className={`font-mono-meta text-[10px] sm:text-xs uppercase tracking-wider mt-1 ${
                  theaterMode ? 'text-[#9F9587]' : 'text-[var(--text-muted)]'
                }`}
              >
                Lists Created
              </div>
            </a>
          </div>
        </header>

        {/* =====================================================================
            2. FAVORITE FILMS (MINIMAL EDITORIAL INDEX — NO SQUARE BOXES)
            ===================================================================== */}
        <section aria-labelledby="fav-films-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star
                className={`w-3.5 h-3.5 ${
                  theaterMode ? 'text-[#E5B869]' : 'text-[var(--accent-crimson)]'
                }`}
              />
              <h2
                id="fav-films-heading"
                className={`font-serif-editorial editorial-section-heading ${
                  theaterMode ? 'text-[#FAF5EC]' : 'text-[var(--text-primary)]'
                }`}
              >
                Stories I still think about
              </h2>
            </div>
            <span
              className={`font-mono-meta text-[10px] uppercase tracking-wider ${
                theaterMode ? 'text-[#9F9587]' : 'text-[var(--text-muted)]'
              }`}
            >
              6 All-Time Anchors
            </span>
          </div>

          <ol
            className={`divide-y border-y ${
              theaterMode
                ? 'divide-[#26201B] border-[#26201B]'
                : 'divide-[var(--border-hairline)] border-[var(--border-hairline)]'
            }`}
          >
            {FAVORITE_FILMS.map((film, idx) => (
              <li
                key={film.id}
                className={`py-4 sm:py-4.5 px-2 -mx-2 transition-colors grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-6 items-baseline ${
                  theaterMode ? 'hover:bg-white/[0.02]' : 'hover:bg-[var(--bg-canvas)]/45'
                }`}
              >
                {/* Left 5 Cols: Index, Film Title & Director */}
                <div className="lg:col-span-5 flex items-baseline gap-3.5 min-w-0">
                  <span
                    className={`font-mono-meta text-xs tabular-nums shrink-0 ${
                      theaterMode ? 'text-[#E5B869]' : 'text-[var(--accent-crimson)]'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                      <h3
                        className={`font-serif-editorial editorial-card-heading ${
                          theaterMode ? 'text-[#FAF5EC]' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {film.title}
                      </h3>
                      <span
                        className={`font-mono-meta text-xs ${
                          theaterMode ? 'text-[#9F9587]' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        ({film.year})
                      </span>
                    </div>
                    <div
                      className={`font-mono-meta text-xs mt-0.5 ${
                        theaterMode ? 'text-[#C2B6A3]' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      Dir. {film.director} · {film.language}
                    </div>
                  </div>
                </div>

                {/* Middle 5 Cols: Editorial One-Line Reflection */}
                <p
                  className={`lg:col-span-5 font-literary editorial-body-sm pl-7 lg:pl-0 ${
                    theaterMode ? 'text-[#B8AFA0]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {film.context}
                </p>

                {/* Right 2 Cols: Rating */}
                <div className="lg:col-span-2 flex lg:justify-end items-center pl-7 lg:pl-0">
                  <span
                    className={`font-mono-meta text-xs tracking-widest ${
                      theaterMode ? 'text-[#E5B869]' : 'text-[var(--accent-mustard)]'
                    }`}
                  >
                    {film.rating}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* =====================================================================
            3. FILM LISTS — CREATIVE FILM-REEL SCREENING LEDGER (ZERO BOXES)
            ===================================================================== */}
        <section
          aria-labelledby="curated-lists-heading"
          className={`pt-7 border-t space-y-5 ${
            theaterMode ? 'border-[#26201B]' : 'border-[var(--border-hairline)]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-2 max-w-2xl">
              <div
                className={`font-mono-meta text-[10px] uppercase tracking-wider ${
                  theaterMode ? 'text-[#E5B869]' : 'text-[var(--accent-crimson)]'
                }`}
              >
                02 · Film Lists · Things I Keep Coming Back To
              </div>
              <h2
                id="curated-lists-heading"
                className={`font-serif-editorial editorial-section-heading ${
                  theaterMode ? 'text-[#FAF5EC]' : 'text-[var(--text-primary)]'
                }`}
              >
                Film lists I made because apparently watching movies wasn’t enough.
              </h2>
              <p
                className={`editorial-body ${
                  theaterMode ? 'text-[#B8AFA0]' : 'text-[var(--text-secondary)]'
                }`}
              >
                Some are favourites, some are films I think deserve more attention, and some exist
                because I couldn&apos;t stop thinking about a particular kind of cinema.
              </p>
              <p
                className={`editorial-body-sm ${
                  theaterMode ? 'text-[#9F9587]' : 'text-[var(--text-secondary)]'
                }`}
              >
                Pick a list below and have a look around. No rankings carved in stone, just films
                I&apos;ve watched, loved, and wanted to keep track of.
              </p>
            </div>
            <a
              href="https://letterboxd.com/mivishvajeet/lists/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 font-mono-meta text-[11px] hover:underline shrink-0 ${
                theaterMode ? 'text-[#E5B869]' : 'text-[var(--accent-crimson)]'
              }`}
            >
              <span>All 11 on Letterboxd</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 4 Cols: Editorial Index Ledger of the 11 Created Lists (No boxy buttons) */}
            <div
              className={`lg:col-span-4 border-y divide-y ${
                theaterMode
                  ? 'border-[#28211B] divide-[#221D18]'
                  : 'border-[var(--border-hairline)] divide-[var(--border-hairline)]'
              }`}
            >
              {LETTERBOXD_11_LISTS.map((list) => {
                const isSelected = list.id === activeList.id;
                return (
                  <button
                    key={list.id}
                    type="button"
                    onClick={() => setSelectedListId(list.id)}
                    className={`w-full text-left py-2.5 px-3 transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? theaterMode
                          ? 'bg-[#8B1E24]/90 text-white font-medium'
                          : 'bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium'
                        : theaterMode
                        ? 'text-[#C8BFA8] hover:bg-white/[0.04] hover:text-white'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-canvas)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-baseline gap-2.5 min-w-0">
                      <span
                        className={`font-mono-meta text-[10px] tabular-nums shrink-0 ${
                          isSelected
                            ? theaterMode
                              ? 'text-[#E5B869]'
                              : 'opacity-80'
                            : theaterMode
                            ? 'text-[#E5B869]'
                            : 'text-[var(--accent-crimson)]'
                        }`}
                      >
                        REEL {list.num}
                      </span>
                      <span className="text-sm sm:text-[15px] truncate">{list.title}</span>
                    </div>
                    <span className="font-mono-meta text-[11px] tabular-nums opacity-75 shrink-0">
                      {list.films.length} films →
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right 8 Cols: Creative Film-Program Screening Sheet (Sleek Editorial List, Zero Boxes) */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeList.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  {/* Top Program Masthead */}
                  <div
                    className={`flex flex-wrap items-end justify-between gap-3 border-b-2 pb-3.5 ${
                      theaterMode ? 'border-[#E5B869]/40' : 'border-[var(--text-primary)]'
                    }`}
                  >
                    <div>
                      <div
                        className={`font-mono-meta text-[10px] uppercase tracking-widest ${
                          theaterMode ? 'text-[#E5B869]' : 'text-[var(--accent-crimson)]'
                        }`}
                      >
                        SCREENING PROGRAM {activeList.num} OF 11 · {activeList.films.length} SELECTED WORKS
                      </div>
                      <h3
                        className={`font-serif-editorial editorial-sub-heading mt-0.5 ${
                          theaterMode ? 'text-white' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {activeList.title}
                      </h3>
                      <p
                        className={`font-literary italic editorial-body-sm mt-0.5 ${
                          theaterMode ? 'text-[#B8AFA0]' : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {activeList.subtitle}
                      </p>
                    </div>

                    <a
                      href={activeList.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 font-mono-meta text-[11px] underline underline-offset-4 ${
                        theaterMode ? 'text-[#E5B869]' : 'text-[var(--accent-crimson)]'
                      }`}
                    >
                      <span>Open reel on Letterboxd</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Creative Numbered Screening Ledger Rows — Zero Boxes */}
                  <ol
                    className={`divide-y border-b ${
                      theaterMode
                        ? 'divide-[#241E19] border-[#241E19]'
                        : 'divide-[var(--border-hairline)] border-[var(--border-hairline)]'
                    }`}
                  >
                    {activeList.films.map((film, idx) => (
                      <li
                        key={`${activeList.id}-${film.title}`}
                        className={`group py-3 px-2 -mx-2 transition-colors grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline ${
                          theaterMode
                            ? 'hover:bg-white/[0.03]'
                            : 'hover:bg-[var(--bg-canvas)]/70'
                        }`}
                      >
                        {/* Left 5 Cols: Reel Number + Film Title + Year */}
                        <div className="sm:col-span-5 flex items-baseline gap-2.5 min-w-0">
                          <span
                            className={`font-mono-meta text-[11px] tabular-nums shrink-0 ${
                              theaterMode ? 'text-[#E5B869]' : 'text-[var(--accent-crimson)]'
                            }`}
                          >
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <span
                            className={`font-serif-editorial text-base sm:text-lg leading-snug truncate ${
                              theaterMode
                                ? 'text-[#FAF5EC] group-hover:text-[#E5B869]'
                                : 'text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)]'
                            } transition-colors`}
                          >
                            {film.title}
                          </span>
                          <span
                            className={`font-mono-meta text-[10px] tabular-nums shrink-0 ${
                              theaterMode ? 'text-[#9F9587]' : 'text-[var(--text-muted)]'
                            }`}
                          >
                            ({film.year})
                          </span>
                        </div>

                        {/* Right 7 Cols: Personal Frame / Curation Note */}
                        <p
                          className={`sm:col-span-7 editorial-body-sm pl-6 sm:pl-0 ${
                            theaterMode ? 'text-[#B8AFA0]' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          {film.context}
                        </p>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Bottom Velvet Curtain Footlights when Theater Mode is ON */}
        {theaterMode && (
          <div
            aria-hidden="true"
            className="pt-4 border-t border-[#2A1D1D] flex items-center justify-between text-[10px] font-mono-meta text-[#9F9587]"
          >
            <span className="inline-flex items-center gap-1.5 text-[#E5B869]">
              <Sparkles className="w-3 h-3" />
              <span>AISLE LIGHTS DIMMED · SCREENING IN PROGRESS</span>
            </span>
            <span>@MIVISHVAJEET ARCHIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};
