import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  HeartCrack,
  Flame,
  Mic,
  Radio,
  Compass,
  Clock,
  Shield,
  Users,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { ArchiveData, FootballNote } from '../types/archive';

interface FootballSectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
}

interface IconicFootballIncident {
  id: string;
  chapter: string;
  category: 'Crowning Glory' | 'Heartbreak' | 'Miracle';
  headline: string;
  fixture: string;
  scoreline: string;
  dateAndVenue: string;
  minuteOrMoment: string;
  commentator: string;
  incidentContext: string;
  personalReaction: string;
  quotes: string[];
}

interface CoachPlayerNode {
  id: string;
  number: string;
  name: string;
  positionLabel: string;
  x: number; // 0 to 100 along pitch length (left = own goal, right = opponent goal)
  y: number; // 0 to 100 across pitch width
  targetX?: number; // tactical movement arrow target
  targetY?: number;
  howTheyPlay: string;
  signatureTrait: string;
}

interface CoachPhilosophyProfile {
  id: 'cruyff' | 'pep' | 'luisenrique' | 'flick';
  name: string;
  era: string;
  formation: string;
  tagline: string;
  quote: string;
  corePrinciples: string[];
  styleSummary: string;
  metrics: {
    defensiveLine: string;
    buildupStyle: string;
    pressingTrigger: string;
  };
  players: CoachPlayerNode[];
}

const PitchIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <circle cx="12" cy="12" r="3" />
    <path d="M2 9h3v6H2" />
    <path d="M22 9h-3v6h3" />
  </svg>
);

const FootballIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <polygon points="12 7.5 15.5 10 14.2 14 9.8 14 8.5 10" />
    <line x1="12" y1="7.5" x2="12" y2="2.5" />
    <line x1="15.5" y1="10" x2="20.5" y2="8.5" />
    <line x1="14.2" y1="14" x2="17.5" y2="19.5" />
    <line x1="9.8" y1="14" x2="6.5" y2="19.5" />
    <line x1="8.5" y1="10" x2="3.5" y2="8.5" />
  </svg>
);

const BARCA_COACH_PHILOSOPHIES: CoachPhilosophyProfile[] = [
  {
    id: 'cruyff',
    name: 'Johan Cruyff',
    era: '1988–1996 · The Dream Team',
    formation: '3-4-3 Diamond',
    tagline: 'Total Football, Midfield Diamond & Numerical Superiority',
    quote: 'Playing football is very simple, but playing simple football is the hardest thing there is.',
    styleSummary:
      'Cruyff tore up conservative Spanish football by sacrificing a defender to pack the midfield in a 3-4-3 diamond. Every player was expected to understand geometry: stretch the pitch as wide as possible in possession, form constant passing triangles (rondos), and recover the ball high up the pitch instead of running backward.',
    corePrinciples: [
      'Sacrifice a fourth defender to create a 4-man midfield diamond',
      'Wingers hug the chalk to stretch the opponent’s backline horizontally',
      'The No. 4 (Guardiola) dictates tempo through one- and two-touch angles',
      'Constant third-man rotations between striker and attacking interior',
    ],
    metrics: {
      defensiveLine: 'High 3-Man Line + Libero',
      buildupStyle: 'Rondo Triangles & Diagonal Switches',
      pressingTrigger: 'Immediate 6-Second Forward Press',
    },
    players: [
      {
        id: 'cruyff-zubi',
        number: '1',
        name: 'Zubizarreta',
        positionLabel: 'Sweeper-Keeper',
        x: 9,
        y: 50,
        howTheyPlay:
          'Initiates buildup calmly from the back rather than punting long, serving as the extra passing outlet behind the three defenders.',
        signatureTrait: 'First pass of the rondo',
      },
      {
        id: 'cruyff-koeman',
        number: '4',
        name: 'Ronald Koeman',
        positionLabel: 'Libero / Ball-Playing CB',
        x: 23,
        y: 50,
        targetX: 35,
        targetY: 50,
        howTheyPlay:
          'Steps into midfield with the ball at his feet to launch 60-yard laser diagonals directly to Stoichkov or Begiristain on the wing, plus lethal free-kicks.',
        signatureTrait: '60-yard diagonal switches & thunderous strikes',
      },
      {
        id: 'cruyff-ferrer',
        number: '2',
        name: 'Albert Ferrer',
        positionLabel: 'Right Stopper',
        x: 25,
        y: 78,
        howTheyPlay:
          'Uses blistering recovery pace to defend 1v1 in wide channels when Barcelona commits seven players into the opposition half.',
        signatureTrait: '1v1 wide recovery speed',
      },
      {
        id: 'cruyff-sergi',
        number: '12',
        name: 'Sergi Barjuan',
        positionLabel: 'Left Stopper',
        x: 25,
        y: 22,
        howTheyPlay:
          'Aggressive left-sided defender who steps high to intercept counter-attacks and overlaps into midfield when space opens.',
        signatureTrait: 'Relentless left-channel anticipation',
      },
      {
        id: 'cruyff-pep',
        number: '3',
        name: 'Pep Guardiola',
        positionLabel: 'The Pivot (Base of Diamond)',
        x: 42,
        y: 50,
        howTheyPlay:
          'Scans the pitch three times before receiving; plays one-touch passes to beat the press and sets the exact heartbeat of the team.',
        signatureTrait: 'La Pausa & one-touch metronome',
      },
      {
        id: 'cruyff-eusebio',
        number: '8',
        name: 'Eusebio',
        positionLabel: 'Right Interior',
        x: 54,
        y: 72,
        howTheyPlay:
          'Balances the right side of the diamond, drifting wide to combine with the winger or dropping next to Guardiola to secure possession.',
        signatureTrait: 'Positional glue in the right half-space',
      },
      {
        id: 'cruyff-amor',
        number: '5',
        name: 'Guillermo Amor',
        positionLabel: 'Left Interior',
        x: 54,
        y: 28,
        howTheyPlay:
          'Tireless two-way La Masia midfielder who links Guardiola’s passes to the front line and presses immediately on turnover.',
        signatureTrait: 'Seamless combination play',
      },
      {
        id: 'cruyff-bakero',
        number: '6',
        name: 'José Mari Bakero',
        positionLabel: 'Tip of the Diamond (No. 10)',
        x: 68,
        y: 50,
        targetX: 80,
        targetY: 50,
        howTheyPlay:
          'Arrives late into the penalty box as Romário or Laudrup drops deep, heading home crosses and leading the first wave of pressing.',
        signatureTrait: 'Late box crashes & vertical link play',
      },
      {
        id: 'cruyff-laudrup',
        number: '9',
        name: 'Michael Laudrup',
        positionLabel: 'Fluid Playmaker / False Wing',
        x: 78,
        y: 78,
        targetX: 72,
        targetY: 60,
        howTheyPlay:
          'Glides between the lines and delivers signature no-look scooped through-balls while looking the opposite way, freezing entire defenses.',
        signatureTrait: 'Disguised no-look through passes',
      },
      {
        id: 'cruyff-stoichkov',
        number: '8S',
        name: 'Hristo Stoichkov',
        positionLabel: 'Wide Left / Inside Forward',
        x: 80,
        y: 20,
        targetX: 89,
        targetY: 40,
        howTheyPlay:
          'Starts wide on the chalk and explodes diagonally toward goal at full sprint whenever Romário vacates the central zone.',
        signatureTrait: 'Explosive diagonal runs into the box',
      },
      {
        id: 'cruyff-romario',
        number: '10',
        name: 'Romário',
        positionLabel: 'Center-Forward Genius',
        x: 87,
        y: 50,
        targetX: 75,
        targetY: 50,
        howTheyPlay:
          'Drops deep to drag center-backs out of position, spins with his signature “cola de vaca” turn, and finishes with toe-pokes in zero space.',
        signatureTrait: 'Cola de vaca turn & ice-cold finishing',
      },
    ],
  },
  {
    id: 'pep',
    name: 'Pep Guardiola',
    era: '2008–2012 · Peak Juego de Posición',
    formation: '4-3-3 False Nine',
    tagline: 'Positional Play, Half-Space Overloads & The False 9',
    quote: 'Take the ball, pass the ball. We don’t pass to move the ball; we pass to move the opponent.',
    styleSummary:
      'Pep perfected Cruyff’s blueprint into mathematical poetry. By moving Lionel Messi from the wing into the False 9 role, Barcelona created an unstoppable 4v3 overload in midfield with Busquets, Xavi, and Iniesta. Opposing center-backs faced an impossible dilemma: step up with Messi and leave space in behind for Pedro and Villa, or stay back and let Messi run at them untouched.',
    corePrinciples: [
      'Juego de Posición: never more than two players on the same vertical or horizontal line',
      '15-pass buildup sequences in midfield to disorganize the opponent’s block before striking',
      'Lionel Messi drops into the False 9 pocket to create a 4v3 midfield overload',
      '6-second counter-pressing rule: swarm the ball carrier immediately after losing possession',
    ],
    metrics: {
      defensiveLine: 'High Asymmetric Line (Abidal Tucks In)',
      buildupStyle: '70%+ Possession · Third-Man Triangles',
      pressingTrigger: 'Instant 6-Second Swarm on Turnover',
    },
    players: [
      {
        id: 'pep-valdes',
        number: '1',
        name: 'Víctor Valdés',
        positionLabel: 'Sweeper-Keeper',
        x: 9,
        y: 50,
        howTheyPlay:
          'Splits Piqué and Puyol to the edges of the penalty box and baits the opponent’s striker before slipping a pass into Busquets.',
        signatureTrait: 'Fearless short buildup under pressure',
      },
      {
        id: 'pep-alves',
        number: '2',
        name: 'Dani Alves',
        positionLabel: 'Attacking Right-Back / Winger',
        x: 56,
        y: 88,
        targetX: 78,
        targetY: 88,
        howTheyPlay:
          'Operates practically as a right winger and fourth midfielder, playing rapid wall-passes with Xavi and Messi along the touchline.',
        signatureTrait: 'Relentless overlaps & telepathic Messi 1-2s',
      },
      {
        id: 'pep-pique',
        number: '3',
        name: 'Gerard Piqué',
        positionLabel: 'Ball-Playing Center-Back',
        x: 26,
        y: 64,
        targetX: 40,
        targetY: 64,
        howTheyPlay:
          'Steps boldly into midfield with the ball to provoke an opposition midfielder to jump, opening the passing lane to Xavi or Messi.',
        signatureTrait: 'Line-breaking carries from the back',
      },
      {
        id: 'pep-puyol',
        number: '5',
        name: 'Carles Puyol',
        positionLabel: 'Captain & Recovery Stopper',
        x: 24,
        y: 38,
        howTheyPlay:
          'Commands the defensive line’s concentration and wins every duel in wide transition zones when Barcelona’s fullbacks are high.',
        signatureTrait: 'Unconditional intensity & leadership',
      },
      {
        id: 'pep-abidal',
        number: '22',
        name: 'Éric Abidal',
        positionLabel: 'Tucked-In Left-Back',
        x: 32,
        y: 16,
        howTheyPlay:
          'Tucks inside to form a situational back three alongside Piqué and Puyol whenever Dani Alves bombs forward on the right.',
        signatureTrait: 'Asymmetric defensive balance',
      },
      {
        id: 'pep-busquets',
        number: '16',
        name: 'Sergio Busquets',
        positionLabel: 'Single Pivot (Mediocentro)',
        x: 44,
        y: 50,
        howTheyPlay:
          'Uses subtle body feints and sole-of-the-boot drags to erase two pressing opponents at once, then disguises vertical passes into the interiors.',
        signatureTrait: 'One-touch press resistance & disguised passes',
      },
      {
        id: 'pep-xavi',
        number: '6',
        name: 'Xavi Hernández',
        positionLabel: 'Right Interior · The Mastermind',
        x: 58,
        y: 66,
        howTheyPlay:
          'Receives on the half-turn 120+ times a match, using his 360-degree pivot (la pelopina) to protect the ball and dictate the exact tempo of the game.',
        signatureTrait: '360° turns & absolute tempo control',
      },
      {
        id: 'pep-iniesta',
        number: '8',
        name: 'Andrés Iniesta',
        positionLabel: 'Left Interior · Illusionist',
        x: 62,
        y: 34,
        targetX: 76,
        targetY: 36,
        howTheyPlay:
          'Floats in the left half-space and waits until the defender commits before gliding past with La Croqueta to destabilize the entire low block.',
        signatureTrait: 'La Croqueta & effortless half-space dribbling',
      },
      {
        id: 'pep-messi',
        number: '10',
        name: 'Lionel Messi',
        positionLabel: 'The False Nine',
        x: 72,
        y: 50,
        targetX: 58,
        targetY: 50,
        howTheyPlay:
          'Drops from striker into midfield to create a 4v3 overload with Xavi, Iniesta, and Busquets, then turns to run straight at the exposed backline.',
        signatureTrait: 'Dropping deep to overload, then slaloming through',
      },
      {
        id: 'pep-pedro',
        number: '17',
        name: 'Pedro Rodríguez',
        positionLabel: 'Right Inside Forward',
        x: 84,
        y: 76,
        targetX: 90,
        targetY: 58,
        howTheyPlay:
          'Starts wide to pin the opponent’s left-back, then makes razor-sharp diagonal runs into the central space vacated by Messi.',
        signatureTrait: 'Two-footed finishing & off-ball diagonal runs',
      },
      {
        id: 'pep-villa',
        number: '7',
        name: 'David Villa',
        positionLabel: 'Left Inside Forward',
        x: 84,
        y: 22,
        targetX: 90,
        targetY: 42,
        howTheyPlay:
          'Hugs the left touchline before curling diagonal runs behind the right center-back to receive Messi’s through-balls or bend curlers into the far corner.',
        signatureTrait: 'Far-post curlers & blindside runs in behind',
      },
    ],
  },
  {
    id: 'luisenrique',
    name: 'Luis Enrique',
    era: '2014–2017 · The MSN Treble Era',
    formation: '4-3-3 Vertical Trident',
    tagline: 'Direct Verticality, Counter-Transition & MSN Chaos',
    quote: 'Why take twenty passes to reach the box when Messi, Suárez, and Neymar can destroy you in three?',
    styleSummary:
      'Luis Enrique evolved Barcelona from pure midfield control into the most lethal vertical attack in football history. Instead of suffocating opponents solely with 80% possession, Barça willingly invited opponents to press slightly higher so ter Stegen, Busquets, or Rakitić could launch rapid balls into Messi, Suárez, and Neymar in open space with devastating 3v3 transitions.',
    corePrinciples: [
      'Direct vertical progression: get the ball to Messi, Suárez, and Neymar before the defense sets',
      'Midfielders (Rakitić & Iniesta) compensate wide to cover for the front three and overlapping fullbacks',
      'Messi’s diagonal switches from right half-space to Neymar and Jordi Alba on the left',
      'Relentless counter-pressing led by Suárez’s physicality in the central channel',
    ],
    metrics: {
      defensiveLine: 'Medium-High Compact Block',
      buildupStyle: 'Vertical 3-Pass Transitions to MSN',
      pressingTrigger: 'Aggressive Traps to Launch Instant Counters',
    },
    players: [
      {
        id: 'le-mats',
        number: '1',
        name: 'ter Stegen',
        positionLabel: 'Ball-Playing Keeper',
        x: 9,
        y: 50,
        howTheyPlay:
          'Hits flat, 50-yard clipped passes over the opponent’s first pressing wave straight onto Suárez’s chest or Jordi Alba’s touchline',
        signatureTrait: 'Mid-range clipped distribution',
      },
      {
        id: 'le-alves',
        number: '6',
        name: 'Dani Alves',
        positionLabel: 'Inverted / Overlapping RB',
        x: 48,
        y: 84,
        howTheyPlay:
          'Alternates between tucking into central midfield alongside Busquets and overlapping outside Messi to keep the right flank unpredictable.',
        signatureTrait: 'Playmaking fullback in the right channel',
      },
      {
        id: 'le-pique',
        number: '3',
        name: 'Gerard Piqué',
        positionLabel: 'Right Center-Back',
        x: 25,
        y: 63,
        howTheyPlay:
          'Dominates aerial balls in the box and steps out calmly to feed vertical passes directly into Messi’s feet between the lines.',
        signatureTrait: 'Box dominance & vertical ground passes',
      },
      {
        id: 'le-mascherano',
        number: '14',
        name: 'Mascherano',
        positionLabel: 'Left Center-Back · El Jefecito',
        x: 25,
        y: 37,
        howTheyPlay:
          'Reads danger two seconds early and executes last-ditch sliding tackles whenever teams try to counter behind Jordi Alba.',
        signatureTrait: 'Anticipation & surgical recovery tackles',
      },
      {
        id: 'le-alba',
        number: '18',
        name: 'Jordi Alba',
        positionLabel: 'Overlapping Left-Back',
        x: 56,
        y: 12,
        targetX: 82,
        targetY: 12,
        howTheyPlay:
          'Times his blindside sprints down the left touchline to the exact millisecond Messi lifts his head on the right wing.',
        signatureTrait: 'Blindside sprints & cutbacks from the byline',
      },
      {
        id: 'le-busquets',
        number: '5',
        name: 'Sergio Busquets',
        positionLabel: 'Defensive Pivot',
        x: 42,
        y: 50,
        howTheyPlay:
          'Anchors the center alone during rapid transitions, intercepting second balls and feeding immediate vertical passes to the front three.',
        signatureTrait: 'Transition shield & first-time vertical release',
      },
      {
        id: 'le-rakitic',
        number: '4',
        name: 'Ivan Rakitić',
        positionLabel: 'Box-to-Box Right Interior',
        x: 56,
        y: 70,
        howTheyPlay:
          'Covers the entire right flank defensively when Messi drifts inside and Dani Alves attacks, while arriving at the edge of the box for long-range strikes.',
        signatureTrait: 'Selfless right-flank coverage & late box runs',
      },
      {
        id: 'le-iniesta',
        number: '8',
        name: 'Andrés Iniesta',
        positionLabel: 'Left Interior Captain',
        x: 58,
        y: 32,
        howTheyPlay:
          'Combines with Neymar and Jordi Alba in tight triangles on the left, carrying the ball through midfield traffic to release MSN.',
        signatureTrait: 'Press-breaking carries in the left half-space',
      },
      {
        id: 'le-messi',
        number: '10',
        name: 'Lionel Messi',
        positionLabel: 'Right-Wing Playmaker',
        x: 78,
        y: 76,
        targetX: 76,
        targetY: 54,
        howTheyPlay:
          'Starts on the right wing to isolate defenders 1v1, cuts inside onto his left foot, and either curls into the far corner or whips a diagonal to Neymar/Alba.',
        signatureTrait: 'Right-to-center dribbles & cross-field diagonals',
      },
      {
        id: 'le-suarez',
        number: '9',
        name: 'Luis Suárez',
        positionLabel: 'No. 9 · El Pistolero',
        x: 88,
        y: 50,
        howTheyPlay:
          'Pins both opposing center-backs simultaneously, makes decoy runs to open lanes for Messi and Neymar, and finishes acrobatics on the first touch.',
        signatureTrait: 'Relentless movement, dummy runs & lethal finishing',
      },
      {
        id: 'le-neymar',
        number: '11',
        name: 'Neymar Jr.',
        positionLabel: 'Left Wing Creator & Finisher',
        x: 82,
        y: 20,
        targetX: 88,
        targetY: 38,
        howTheyPlay:
          'Isolates the right-back with fearless 1v1 flair, plays lightning one-twos with Suárez and Messi on the edge of the box, and attacks the far post.',
        signatureTrait: '1v1 sambas, nutmegs & combination speed',
      },
    ],
  },
  {
    id: 'flick',
    name: 'Hansi Flick',
    era: '2024–Present · High-Voltage Modern Barça',
    formation: '4-2-3-1 High Line',
    tagline: '50-Meter Offside Trap, Double Pivot & Vertical Pressing',
    quote: 'We want to be active with and without the ball — high intensity, zero hesitation, always looking forward.',
    styleSummary:
      'Hansi Flick fused German vertical pressing intensity with La Masia technical brilliance. Playing the boldest defensive line in world football right on the halfway line, Cubarsí and Iñigo Martínez compress the entire pitch into a 35-meter zone. Pedri and Casadó run a dynamic double pivot that feeds Lamine Yamal, Raphinha, Dani Olmo, and Lewandowski in seconds.',
    corePrinciples: [
      'Ultra-high defensive line at the halfway line with synchronized offside traps',
      'Double pivot (Casadó + Pedri) providing both defensive bite and press-resistant vertical passes',
      'Raphinha acts as an inside-running second striker while Balde holds the left width',
      'Lamine Yamal isolates two defenders wide right and delivers curling trivelas to the far post',
    ],
    metrics: {
      defensiveLine: 'Ultra-High (45–50m · Synchronized Offside Trap)',
      buildupStyle: 'Double Pivot + Fast Vertical Half-Space Attacks',
      pressingTrigger: 'Relentless Full-Pitch Man-Oriented Press',
    },
    players: [
      {
        id: 'flick-keeper',
        number: '13',
        name: 'Iñaki Peña / Szczęsny',
        positionLabel: 'High Sweeper-Keeper',
        x: 16,
        y: 50,
        howTheyPlay:
          'Patrols 30–35 yards outside the penalty area to sweep up any long ball chipped over Barcelona’s ultra-high defensive line.',
        signatureTrait: 'Aggressive sweeping behind the halfway line',
      },
      {
        id: 'flick-kounde',
        number: '23',
        name: 'Jules Koundé',
        positionLabel: 'Hybrid Right-Back',
        x: 46,
        y: 84,
        howTheyPlay:
          'Locks down the opponent’s left winger 1v1 while making intelligent underlapping and overlapping runs to free Lamine Yamal.',
        signatureTrait: '1v1 defensive lockdown & late overlaps',
      },
      {
        id: 'flick-cubarsi',
        number: '2',
        name: 'Pau Cubarsí',
        positionLabel: 'Right Center-Back',
        x: 40,
        y: 62,
        targetX: 52,
        targetY: 60,
        howTheyPlay:
          'Holds his nerve on the halfway line and threads laser-guided ground passes straight through two opponent lines into Pedri or Olmo.',
        signatureTrait: 'Laser line-breaking passes from the halfway line',
      },
      {
        id: 'flick-inigo',
        number: '5',
        name: 'Iñigo Martínez',
        positionLabel: 'Left Center-Back · Line Commander',
        x: 40,
        y: 38,
        howTheyPlay:
          'Commands the millisecond timing of the offside trap with a step-up signal and launches booming left-footed diagonals to Lamine Yamal.',
        signatureTrait: 'Offside-trap general & left-footed diagonals',
      },
      {
        id: 'flick-balde',
        number: '3',
        name: 'Alejandro Balde',
        positionLabel: 'Attacking Left-Back',
        x: 58,
        y: 12,
        targetX: 82,
        targetY: 14,
        howTheyPlay:
          'Provides the entire width on the left flank as Raphinha drifts inside, using explosive acceleration to carry the ball 50 yards upfield.',
        signatureTrait: 'Explosive left-wing ball carries',
      },
      {
        id: 'flick-casado',
        number: '17',
        name: 'Marc Casadó',
        positionLabel: 'Right Pivot · Destroyer & Distributor',
        x: 52,
        y: 60,
        howTheyPlay:
          'Snaps into duels to win second balls in midfield and immediately plays vertical passes in behind before the opponent can reset.',
        signatureTrait: 'Ball-winning bite & instant vertical balls',
      },
      {
        id: 'flick-pedri',
        number: '8',
        name: 'Pedri',
        positionLabel: 'Left Pivot / Deep Orchestrator',
        x: 56,
        y: 40,
        howTheyPlay:
          'Controls the entire rhythm from the double pivot—gliding past pressers with effortless body feints and dictating when to speed up or pause.',
        signatureTrait: 'Effortless press resistance & tempo mastery',
      },
      {
        id: 'flick-olmo',
        number: '20',
        name: 'Dani Olmo',
        positionLabel: 'Attacking Midfielder (No. 10)',
        x: 72,
        y: 52,
        howTheyPlay:
          'Operates in the tightest pockets between midfield and defense, spinning on the half-turn with his first touch to shoot or slip Lewandowski through.',
        signatureTrait: 'First-touch half-turn in tight pockets',
      },
      {
        id: 'flick-yamal',
        number: '19',
        name: 'Lamine Yamal',
        positionLabel: 'Right Winger · La Masia Jewel',
        x: 78,
        y: 84,
        targetX: 84,
        targetY: 66,
        howTheyPlay:
          'Draws two defenders on the right touchline, beats them with sudden pauses and body feints, and whips outside-of-the-boot trivelas to the back post.',
        signatureTrait: '1v2 dribbling & signature trivela assists',
      },
      {
        id: 'flick-raphinha',
        number: '11',
        name: 'Raphinha',
        positionLabel: 'Inside Left Forward / Captain',
        x: 78,
        y: 28,
        targetX: 89,
        targetY: 42,
        howTheyPlay:
          'Leads the press like a man possessed and makes relentless diagonal sprints from the left half-space directly behind the opponent’s defense.',
        signatureTrait: 'Relentless pressing & lethal runs in behind',
      },
      {
        id: 'flick-lewy',
        number: '9',
        name: 'Lewandowski',
        positionLabel: 'Striker (No. 9)',
        x: 88,
        y: 50,
        howTheyPlay:
          'Drops a step to link play with one-touch lay-offs to Olmo and Raphinha, then attacks crosses in the six-yard box with clinical precision.',
        signatureTrait: 'One-touch wall passes & clinical box finishing',
      },
    ],
  },
];

const ICONIC_FOOTBALL_INCIDENTS: IconicFootballIncident[] = [
  {
    id: 'inc-messi-2022',
    chapter: '01',
    category: 'Crowning Glory',
    headline: 'Lionel Messi in Lusail',
    fixture: 'Argentina vs. France',
    scoreline: '3–3 (4–2 pen.)',
    dateAndVenue: '18 Dec 2022 · Lusail Stadium',
    minuteOrMoment: 'Full-Time · FIFA World Cup Final',
    commentator: 'Peter Drury',
    incidentContext:
      'After 120 breathless minutes and a penalty shootout, Lionel Messi lifted the one trophy that had eluded him.',
    personalReaction:
      'The single best moment of my life watching football. Hearing Peter Drury deliver these lines felt like watching twenty years of devotion find its rightful ending.',
    quotes: [
      'Lionel Messi has conquered his final peak. Lionel Messi has shaken hands with paradise. The little boy from Rosario, Santa Fe, has just pitched up in heaven. He climbs into a galaxy of his own. He has his crowning moment and, of course, he is not alone.',
      'He was beautiful. He was the point of difference. He has always been the point of difference. Unparalleled, and maybe today there will, of course, always be those who argue, always be those who debate. And the debate could rage on if you like.',
      'But as he falls in love with the object in the world that his heart most desired, it is hard to escape the supposition that he has rendered himself today, the greatest of all time.',
    ],
  },
  {
    id: 'inc-roma-2018',
    chapter: '02',
    category: 'Heartbreak',
    headline: 'Manolas in Rome — “How Could We Not Win This?!”',
    fixture: 'AS Roma vs. FC Barcelona',
    scoreline: '3–0 (4–4 agg.)',
    dateAndVenue: '10 Apr 2018 · Stadio Olimpico',
    minuteOrMoment: '82nd Minute · Champions League QF',
    commentator: 'Peter Drury',
    incidentContext:
      'Leading 4–1 from the first leg at Camp Nou, Barcelona froze in Rome as Kostas Manolas glanced home the decisive third goal at the near post.',
    personalReaction:
      'My most heartbreaking night watching football—literally crying at the screen asking how we could lose from there, yet Drury’s words still give me goosebumps every time.',
    quotes: [
      'Roma have risen from their ruins! Manolas, the Greek God in Rome. The unthinkable unfolds before our eyes. This was not meant to happen, this could not happen, this is happening! Barcelona, extraordinarily, (are) eight minutes from elimination. Roma boss Eusebio Di Francesco does not know where to go, (Andres) Iniesta does not know where to look. It’s a Greek from Mount Olympus, who has come to the Seven Hills of Rome and pulled off a miracle!',
    ],
  },
  {
    id: 'inc-iniesta-2009',
    chapter: '03',
    category: 'Miracle',
    headline: 'Andrés Iniesta at Stamford Bridge',
    fixture: 'Chelsea vs. FC Barcelona',
    scoreline: '1–1 (Away Goals)',
    dateAndVenue: '6 May 2009 · Stamford Bridge',
    minuteOrMoment: '90+3rd Minute · Champions League SF',
    commentator: 'Broadcast Call',
    incidentContext:
      'Down to ten men and two minutes from elimination, Messi squared the ball across the eighteen-yard line for Iniesta to strike first-time into the top corner.',
    personalReaction:
      'Pure disbelief turning into euphoria in half a second—the strike that launched the sextuple.',
    quotes: [
      'Iniestaaa! And the Chelsea fans cover their eyes in horror, two minutes from time and its heartbreak at Stamford Bridge!',
    ],
  },
  {
    id: 'inc-remuntada-2017',
    chapter: '04',
    category: 'Miracle',
    headline: 'La Remuntada — Sergi Roberto 6–1',
    fixture: 'FC Barcelona vs. Paris Saint-Germain',
    scoreline: '6–1 (6–5 agg.)',
    dateAndVenue: '8 Mar 2017 · Camp Nou',
    minuteAndMoment: '90+5th Minute · Champions League R16',
    minuteOrMoment: '90+5th Minute · Champions League R16',
    commentator: 'Broadcast Call',
    incidentContext:
      'Needing three goals in the final seven minutes after losing the first leg 4–0, Neymar lifted one last diagonal chip into the box in the 95th minute for Sergi Roberto.',
    personalReaction:
      'Proof that ninety minutes at Camp Nou can defy every law of probability.',
    quotes: [
      'Neymar... chipped towards the back post! SERGI ROBERTO! IT HAS COME OUT OF THE STARS! ... Barcelona have risen from the dead!',
    ],
  } as IconicFootballIncident,
];

type TacticalPhase = 'base' | 'possession' | 'attack';

interface RolePhaseMovement {
  possessionX: number;
  possessionY: number;
  attackX: number;
  attackY: number;
  movementNote: string;
}

// Role-specific coordinates for EVERY SINGLE PLAYER (44 players across Cruyff, Pep, Luis Enrique, and Flick)
const PLAYER_ROLE_MOVEMENTS: Record<string, RolePhaseMovement> = {
  // 1. JOHAN CRUYFF (3-4-3 Diamond)
  'cruyff-zubi': {
    possessionX: 14,
    possessionY: 50,
    attackX: 18,
    attackY: 50,
    movementNote: 'Steps outside penalty box as extra sweeping outlet for back-three triangles',
  },
  'cruyff-koeman': {
    possessionX: 33,
    possessionY: 52,
    attackX: 42,
    attackY: 54,
    movementNote: 'Steps boldly into midfield as Libero to launch 60-yard diagonals or shoot from range',
  },
  'cruyff-ferrer': {
    possessionX: 32,
    possessionY: 80,
    attackX: 40,
    attackY: 76,
    movementNote: 'Pushes high into right channel to lock down wide counter-attacks 1v1',
  },
  'cruyff-sergi': {
    possessionX: 34,
    possessionY: 20,
    attackX: 46,
    attackY: 16,
    movementNote: 'Advances aggressively up the left touchline to compress the pitch',
  },
  'cruyff-pep': {
    possessionX: 47,
    possessionY: 48,
    attackX: 55,
    attackY: 50,
    movementNote: 'Orchestrates the rondo at the base of the diamond through constant one-touch angles',
  },
  'cruyff-eusebio': {
    possessionX: 60,
    possessionY: 74,
    attackX: 68,
    attackY: 70,
    movementNote: 'Shifts into the right half-space to overload the flank with Laudrup',
  },
  'cruyff-amor': {
    possessionX: 60,
    possessionY: 26,
    attackX: 70,
    attackY: 30,
    movementNote: 'Supports Stoichkov in the left half-space and counter-presses on loss',
  },
  'cruyff-bakero': {
    possessionX: 72,
    possessionY: 50,
    attackX: 85,
    attackY: 52,
    movementNote: 'Crashes the penalty box vertically whenever Romário drops deep',
  },
  'cruyff-laudrup': {
    possessionX: 74,
    possessionY: 68,
    attackX: 78,
    attackY: 60,
    movementNote: 'Drifts from wide right into the central #10 pocket to scoop no-look passes',
  },
  'cruyff-stoichkov': {
    possessionX: 82,
    possessionY: 18,
    attackX: 90,
    attackY: 38,
    movementNote: 'Hugs left chalk in build-up, then explodes diagonally into the goalmouth',
  },
  'cruyff-romario': {
    possessionX: 76,
    possessionY: 46,
    attackX: 91,
    attackY: 50,
    movementNote: 'Drops deep to drag center-backs out in build-up, then darts to the six-yard box',
  },

  // 2. PEP GUARDIOLA (4-3-3 False Nine)
  'pep-valdes': {
    possessionX: 15,
    possessionY: 50,
    attackX: 20,
    attackY: 50,
    movementNote: 'Splits center-backs wide and acts as 11th outfielder to bait the press',
  },
  'pep-alves': {
    possessionX: 64,
    possessionY: 90,
    attackX: 82,
    attackY: 88,
    movementNote: 'Bombs high up the right touchline as an auxiliary winger for Messi wall-passes',
  },
  'pep-pique': {
    possessionX: 36,
    possessionY: 65,
    attackX: 46,
    attackY: 62,
    movementNote: 'Drives into midfield with the ball to provoke an opposition midfielder to step out',
  },
  'pep-puyol': {
    possessionX: 32,
    possessionY: 42,
    attackX: 40,
    attackY: 45,
    movementNote: 'Shifts centrally to command the high defensive line alongside Abidal and Piqué',
  },
  'pep-abidal': {
    possessionX: 33,
    possessionY: 22,
    attackX: 41,
    attackY: 26,
    movementNote: 'Tucks inside as a third center-back so Dani Alves has total freedom on the right',
  },
  'pep-busquets': {
    possessionX: 49,
    possessionY: 50,
    attackX: 57,
    attackY: 50,
    movementNote: 'Steps into the center circle to break lines with one-touch disguised passes',
  },
  'pep-xavi': {
    possessionX: 62,
    possessionY: 64,
    attackX: 70,
    attackY: 62,
    movementNote: 'Controls the right interior pocket, dictating tempo with 360-degree turns',
  },
  'pep-iniesta': {
    possessionX: 68,
    possessionY: 34,
    attackX: 78,
    attackY: 36,
    movementNote: 'Glides through the left half-space to destabilize the low block with La Croqueta',
  },
  'pep-messi': {
    possessionX: 63,
    possessionY: 48,
    attackX: 83,
    attackY: 50,
    movementNote: 'Drops deep into midfield for a 4v3 overload, then slaloms straight at goal',
  },
  'pep-pedro': {
    possessionX: 82,
    possessionY: 80,
    attackX: 90,
    attackY: 58,
    movementNote: 'Pins the fullback wide in build-up, then cuts diagonally into the space Messi vacates',
  },
  'pep-villa': {
    possessionX: 82,
    possessionY: 18,
    attackX: 90,
    attackY: 40,
    movementNote: 'Starts on the left touchline and curls blindside diagonal runs into the penalty box',
  },

  // 3. LUIS ENRIQUE (4-3-3 Vertical MSN Trident)
  'le-mats': {
    possessionX: 14,
    possessionY: 50,
    attackX: 17,
    attackY: 50,
    movementNote: 'Steps up to clip flat 50-yard passes over the first pressing wave to MSN',
  },
  'le-alves': {
    possessionX: 55,
    possessionY: 78,
    attackX: 74,
    attackY: 86,
    movementNote: 'Inverts into right midfield in build-up, then overlaps outside Messi in attack',
  },
  'le-pique': {
    possessionX: 32,
    possessionY: 62,
    attackX: 40,
    attackY: 60,
    movementNote: 'Advances to the halfway line to feed direct vertical passes into Messi’s feet',
  },
  'le-mascherano': {
    possessionX: 32,
    possessionY: 36,
    attackX: 40,
    attackY: 34,
    movementNote: 'Shifts left to cover the wide space behind Jordi Alba’s relentless overlaps',
  },
  'le-alba': {
    possessionX: 66,
    possessionY: 10,
    attackX: 86,
    attackY: 12,
    movementNote: 'Sprints blindside down the left touchline to meet Messi’s cross-field diagonals',
  },
  'le-busquets': {
    possessionX: 46,
    possessionY: 50,
    attackX: 54,
    attackY: 52,
    movementNote: 'Anchors the transition zone and releases immediate vertical passes to the trident',
  },
  'le-rakitic': {
    possessionX: 58,
    possessionY: 74,
    attackX: 68,
    attackY: 72,
    movementNote: 'Shifts wide right to balance Messi & Alves while arriving for edge-of-box strikes',
  },
  'le-iniesta': {
    possessionX: 62,
    possessionY: 30,
    attackX: 72,
    attackY: 28,
    movementNote: 'Forms tight left-triangle combinations with Neymar and Jordi Alba',
  },
  'le-messi': {
    possessionX: 74,
    possessionY: 72,
    attackX: 82,
    attackY: 56,
    movementNote: 'Isolates defenders on the right wing, then cuts inside to curl or switch to Alba',
  },
  'le-suarez': {
    possessionX: 84,
    possessionY: 52,
    attackX: 91,
    attackY: 48,
    movementNote: 'Bully-pins both center-backs and makes dummy runs to open lanes for Messi & Neymar',
  },
  'le-neymar': {
    possessionX: 78,
    possessionY: 22,
    attackX: 89,
    attackY: 36,
    movementNote: 'Receives wide left in 1v1 isolation, then combines with Suárez and Messi inside the box',
  },

  // 4. HANSI FLICK (4-2-3-1 High-Voltage 50m Line)
  'flick-keeper': {
    possessionX: 22,
    possessionY: 50,
    attackX: 28,
    attackY: 50,
    movementNote: 'Patrols 35 yards from goal to sweep every chipped ball behind the 50m offside line',
  },
  'flick-kounde': {
    possessionX: 54,
    possessionY: 84,
    attackX: 72,
    attackY: 86,
    movementNote: 'Locks down the right flank and makes late overlapping runs to free Lamine Yamal',
  },
  'flick-cubarsi': {
    possessionX: 47,
    possessionY: 62,
    attackX: 52,
    attackY: 60,
    movementNote: 'Steps right onto the halfway line to thread laser line-breaking passes into Olmo',
  },
  'flick-inigo': {
    possessionX: 47,
    possessionY: 38,
    attackX: 52,
    attackY: 38,
    movementNote: 'Commands the millisecond step-up for the offside trap at the halfway line',
  },
  'flick-balde': {
    possessionX: 68,
    possessionY: 12,
    attackX: 85,
    attackY: 12,
    movementNote: 'Holds the entire left touchline as Raphinha drifts inside into a second-striker role',
  },
  'flick-casado': {
    possessionX: 56,
    possessionY: 58,
    attackX: 63,
    attackY: 56,
    movementNote: 'Snaps into midfield duels and triggers instant vertical balls into the front four',
  },
  'flick-pedri': {
    possessionX: 62,
    possessionY: 42,
    attackX: 70,
    attackY: 42,
    movementNote: 'Dictates tempo from the left pivot, gliding past pressers to feed the half-spaces',
  },
  'flick-olmo': {
    possessionX: 75,
    possessionY: 52,
    attackX: 83,
    attackY: 52,
    movementNote: 'Receives on the half-turn between the lines and slips Lewandowski through on goal',
  },
  'flick-yamal': {
    possessionX: 80,
    possessionY: 84,
    attackX: 85,
    attackY: 68,
    movementNote: 'Draws two defenders wide right, then cuts in for trivelas and far-post curlers',
  },
  'flick-raphinha': {
    possessionX: 78,
    possessionY: 32,
    attackX: 89,
    attackY: 40,
    movementNote: 'Drifts inside from the left wing to make explosive diagonal runs behind the backline',
  },
  'flick-lewy': {
    possessionX: 82,
    possessionY: 50,
    attackX: 91,
    attackY: 50,
    movementNote: 'Drops a step for one-touch wall passes in build-up, then attacks the six-yard box',
  },
};

export const FootballSection: React.FC<FootballSectionProps> = ({
  archive,
  authorMode = false,
  onUpdateArchive,
}) => {
  const [pitchMode, setPitchMode] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState<CoachPhilosophyProfile['id']>('pep');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('pep-messi');
  const [tacticalPhase, setTacticalPhase] = useState<TacticalPhase>('possession');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [incidentFilter, setIncidentFilter] = useState<'all' | IconicFootballIncident['category']>(
    'all'
  );
  const [activeForm, setActiveForm] = useState<'none' | 'note'>('none');

  const [newNote, setNewNote] = useState({
    title: '',
    category: 'Barcelona Note' as FootballNote['category'],
    body: '',
  });

  // Auto-cycle tactical phases when live role simulation is enabled
  useEffect(() => {
    if (!isSimulating) return;
    const phases: TacticalPhase[] = ['base', 'possession', 'attack'];
    const interval = window.setInterval(() => {
      setTacticalPhase((prev) => {
        const idx = phases.indexOf(prev);
        return phases[(idx + 1) % phases.length];
      });
    }, 2600);
    return () => window.clearInterval(interval);
  }, [isSimulating]);

  const activeCoach = useMemo(
    () =>
      BARCA_COACH_PHILOSOPHIES.find((c) => c.id === selectedCoachId) ||
      BARCA_COACH_PHILOSOPHIES[1],
    [selectedCoachId]
  );

  const activePlayer = useMemo(() => {
    return (
      activeCoach.players.find((p) => p.id === selectedPlayerId) ||
      activeCoach.players[activeCoach.players.length - 1]
    );
  }, [activeCoach, selectedPlayerId]);

  const getPlayerCoordinates = (pl: CoachPlayerNode, phase: TacticalPhase) => {
    const move = PLAYER_ROLE_MOVEMENTS[pl.id];
    if (!move || phase === 'base') {
      return { x: pl.x, y: pl.y };
    }
    if (phase === 'possession') {
      return { x: move.possessionX, y: move.possessionY };
    }
    return { x: move.attackX, y: move.attackY };
  };

  const handleSelectCoach = (coachId: CoachPhilosophyProfile['id']) => {
    setSelectedCoachId(coachId);
    const found = BARCA_COACH_PHILOSOPHIES.find((c) => c.id === coachId);
    if (found && found.players.length > 0) {
      const defaultStar =
        coachId === 'cruyff'
          ? 'cruyff-pep'
          : coachId === 'pep'
          ? 'pep-messi'
          : coachId === 'luisenrique'
          ? 'le-messi'
          : 'flick-yamal';
      setSelectedPlayerId(defaultStar);
    }
  };

  const showSamples = archive.settings.showSampleEntries;

  const visibleNotes = useMemo(
    () => archive.football.notes.filter((n) => showSamples || !n.isSample),
    [archive.football.notes, showSamples]
  );

  const visibleMatches = useMemo(
    () => archive.football.matches.filter((m) => showSamples || !m.isSample),
    [archive.football.matches, showSamples]
  );

  const filteredIncidents = useMemo(() => {
    if (incidentFilter === 'all') return ICONIC_FOOTBALL_INCIDENTS;
    return ICONIC_FOOTBALL_INCIDENTS.filter((inc) => inc.category === incidentFilter);
  }, [incidentFilter]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.body.trim()) return;
    const entry: FootballNote = {
      id: `fn-${Date.now()}`,
      title: newNote.title.trim(),
      category: newNote.category,
      date: new Date().toISOString().slice(0, 10),
      summary: newNote.body.trim().slice(0, 120),
      body: newNote.body.trim(),
      isSample: false,
    };
    onUpdateArchive((prev) => ({
      ...prev,
      football: {
        ...prev.football,
        notes: [entry, ...prev.football.notes],
      },
    }));
    setNewNote({ title: '', category: 'Barcelona Note', body: '' });
    setActiveForm('none');
  };

  return (
    <div
      style={
        pitchMode
          ? {
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(16, 61, 39, 0.96) 0px, rgba(16, 61, 39, 0.96) 72px, rgba(11, 45, 29, 0.98) 72px, rgba(11, 45, 29, 0.98) 144px)',
            }
          : undefined
      }
      className={`space-y-14 transition-all duration-300 relative overflow-hidden ${
        pitchMode
          ? 'p-5 sm:p-8 rounded-2xl bg-[#0B2D1D] text-[#F3FAF6] border-2 border-[#34D399]/45 shadow-2xl'
          : ''
      }`}
    >
      {/* Full-Page Stadium Chalk Markings Backdrop when Pitch Mode is ON */}
      {pitchMode && (
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 1600"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.11]"
        >
          {/* Outer Touchlines */}
          <rect
            x="24"
            y="24"
            width="952"
            height="1552"
            rx="12"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          {/* Halfway Line & Center Circle */}
          <line x1="24" y1="800" x2="976" y2="800" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="500" cy="800" r="120" fill="none" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="500" cy="800" r="6" fill="#FFFFFF" />
          {/* Top Penalty Box */}
          <rect
            x="250"
            y="24"
            width="500"
            height="190"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <rect
            x="370"
            y="24"
            width="260"
            height="75"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          {/* Bottom Penalty Box */}
          <rect
            x="250"
            y="1386"
            width="500"
            height="190"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <rect
            x="370"
            y="1501"
            width="260"
            height="75"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
        </svg>
      )}

      {/* =====================================================================
          HEADER — STRICTLY "FOOTBALL" + PROMINENT PITCH MODE TOGGLE
          ===================================================================== */}
      <header
        className={`relative z-10 border-b pb-8 space-y-6 ${
          pitchMode ? 'border-white/20' : 'border-[var(--border-hairline)]'
        }`}
      >
        {/* Live Matchday Stadium Banner when Pitch Mode is ON */}
        {pitchMode && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#071C12]/90 border border-[#34D399]/40 text-xs font-mono-meta">
            <div className="inline-flex items-center gap-2 text-[#6EE7B7]">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
              <span className="font-semibold tracking-wider uppercase">
                CAMP NOU · FLOODLIT TACTICAL PITCH MODE ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <span>105m × 68m Turf</span>
              <span className="text-[#EDBB00]">·</span>
              <span className="text-[#EDBB00]">Més que un club</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 font-mono-meta text-xs ${
                pitchMode ? 'text-[#EDBB00]' : 'text-[var(--accent-crimson)]'
              }`}
            >
              <FootballIcon className="w-3.5 h-3.5" />
              <span>02 · FOOTBALL NOTEBOOK · FC BARCELONA</span>
            </div>

            <h1
              className={`font-serif-editorial editorial-hero-display font-normal ${
                pitchMode ? 'text-white' : 'text-[var(--text-primary)]'
              }`}
            >
              Letting Eleven Men in Blaugrana Dictate My Weekend Mood
            </h1>

            <p
              className={`editorial-lead ${
                pitchMode ? 'text-white/85' : 'text-[var(--text-secondary)]'
              }`}
            >
              FC Barcelona, Lionel Messi, tactical blueprints from Cruyff to Flick, and the
              commentary lines that stay in your head long after the final whistle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
            <button
              type="button"
              aria-pressed={pitchMode}
              onClick={() => setPitchMode((prev) => !prev)}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono-meta border transition-all cursor-pointer shadow-sm ${
                pitchMode
                  ? 'bg-[#EDBB00] text-[#071C12] border-[#FDE047] font-semibold shadow-lg scale-[1.02]'
                  : 'bg-[#0E3522] text-[#A7F3D0] border-[#2D6A4F] hover:bg-[#14452D] hover:border-[#34D399]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  pitchMode ? 'bg-[#071C12] animate-pulse' : 'bg-[#34D399]'
                }`}
              />
              <PitchIcon className="w-4 h-4" />
              <span>{pitchMode ? 'Pitch Mode: ON (Exit Turf)' : 'Transform into Pitch Mode'}</span>
            </button>

            {authorMode && (
              <button
                type="button"
                onClick={() => setActiveForm(activeForm === 'note' ? 'none' : 'note')}
                className="px-3.5 py-2.5 rounded-xl text-xs font-mono-meta bg-[var(--text-primary)] text-[var(--bg-surface)]"
              >
                + Add Note
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Author Mode Form */}
      {authorMode && activeForm === 'note' && (
        <form
          onSubmit={handleAddNote}
          className="relative z-10 p-6 diner-booth-panel space-y-4 max-w-2xl"
        >
          <div className="text-sm font-medium text-[var(--text-primary)]">
            New Football Observation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Title *"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
            />
            <select
              value={newNote.category}
              onChange={(e) =>
                setNewNote({
                  ...newNote,
                  category: e.target.value as FootballNote['category'],
                })
              }
              className="px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
            >
              <option value="Barcelona Note">Barcelona Note</option>
              <option value="Football Philosophy">Football Philosophy</option>
              <option value="Positional Play">Positional Play</option>
            </select>
          </div>
          <textarea
            rows={3}
            required
            placeholder="Observation *"
            value={newNote.body}
            onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium bg-[var(--accent-crimson)] text-white rounded-lg"
          >
            Save Observation
          </button>
        </form>
      )}

      {/* =====================================================================
          01 · INTERACTIVE BARCELONA MANAGERIAL PHILOSOPHY & PLAYER DASHBOARD
               (CRUYFF · PEP GUARDIOLA · LUIS ENRIQUE · HANSI FLICK)
          ===================================================================== */}
      <section aria-labelledby="coaches-dashboard-heading" className="relative z-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <div
              className={`inline-flex items-center gap-1.5 font-mono-meta text-xs uppercase tracking-wider ${
                pitchMode ? 'text-[#EDBB00]' : 'text-[var(--accent-crimson)]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>01 · Interactive Tactical Philosophy & Role Movement Board</span>
            </div>
            <h2
              id="coaches-dashboard-heading"
              className={`font-serif-editorial editorial-section-heading ${
                pitchMode ? 'text-white' : 'text-[var(--text-primary)]'
              }`}
            >
              Four Coaches Who Convinced Me Geometry Is a Religion
            </h2>
            <p
              className={`editorial-body-sm ${
                pitchMode ? 'text-white/80' : 'text-[var(--text-secondary)]'
              }`}
            >
              Select a manager, switch tactical phases (or let the live board auto-animate), and
              watch every single player shift position according to their exact role.
            </p>
          </div>
        </div>

        {/* 4 Coach Selector Cards */}
        <div
          role="tablist"
          aria-label="Barcelona Managers Philosophy Selector"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {BARCA_COACH_PHILOSOPHIES.map((coach) => {
            const isSelected = coach.id === activeCoach.id;
            return (
              <button
                key={coach.id}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => handleSelectCoach(coach.id)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? pitchMode
                      ? 'bg-[#071C12] border-[#EDBB00] text-white shadow-lg'
                      : 'bg-[var(--bg-surface)] border-[var(--accent-crimson)] text-[var(--text-primary)] tactile-card-shadow'
                    : pitchMode
                    ? 'bg-[#0F3522]/90 border-white/15 text-white/80 hover:border-[#EDBB00]/60 hover:text-white'
                    : 'bg-[var(--bg-canvas)]/60 border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-coach-bar"
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      pitchMode ? 'bg-[#EDBB00]' : 'bg-[var(--accent-crimson)]'
                    }`}
                  />
                )}
                <div className="flex items-center justify-between gap-2 font-mono-meta text-[10px]">
                  <span
                    className={
                      isSelected
                        ? pitchMode
                          ? 'text-[#EDBB00] font-semibold'
                          : 'text-[var(--accent-crimson)] font-semibold'
                        : 'opacity-75'
                    }
                  >
                    {coach.formation}
                  </span>
                  <span className="opacity-70 truncate">{coach.era.split('·')[0]}</span>
                </div>
                <div className="font-serif-editorial text-xl mt-1 leading-snug">{coach.name}</div>
                <div className="text-[11px] opacity-80 mt-1 line-clamp-1">{coach.tagline}</div>
              </button>
            );
          })}
        </div>

        {/* Active Coach Tactical Board & Player Role Inspector */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCoach.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className={`rounded-2xl border p-5 sm:p-6 space-y-6 ${
              pitchMode
                ? 'bg-[#071E13]/92 border-[#34D399]/35 text-white shadow-xl'
                : 'bg-[var(--bg-canvas)]/55 border-[var(--border-hairline)]'
            }`}
          >
            {/* Top Philosophy Summary & Tactical Metrics Strip */}
            <div
              className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start border-b pb-6 ${
                pitchMode ? 'border-white/15' : 'border-[var(--border-hairline)]/80'
              }`}
            >
              <div className="lg:col-span-7 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2 font-mono-meta text-[11px]">
                  <span
                    className={`px-2.5 py-0.5 rounded font-medium ${
                      pitchMode
                        ? 'bg-[#EDBB00] text-[#091A12]'
                        : 'bg-[var(--accent-crimson)] text-white'
                    }`}
                  >
                    {activeCoach.formation}
                  </span>
                  <span className={pitchMode ? 'text-[#EDBB00]' : 'text-[var(--accent-crimson)]'}>
                    {activeCoach.era}
                  </span>
                </div>

                <h3
                  className={`font-serif-editorial editorial-sub-heading ${
                    pitchMode ? 'text-white' : 'text-[var(--text-primary)]'
                  }`}
                >
                  {activeCoach.name}: {activeCoach.tagline}
                </h3>

                <p
                  className={`editorial-body ${
                    pitchMode ? 'text-white/85' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {activeCoach.styleSummary}
                </p>

                <blockquote
                  className={`font-literary italic editorial-quote pt-1 border-l-2 pl-3 ${
                    pitchMode
                      ? 'border-[#EDBB00] text-white/95'
                      : 'border-[var(--accent-crimson)] text-[var(--text-primary)]'
                  }`}
                >
                  “{activeCoach.quote}”
                </blockquote>
              </div>

              {/* Right 5 Cols: 3 Tactical Metrics */}
              <div className="lg:col-span-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                  <div
                    className={`p-3 rounded-xl border ${
                      pitchMode
                        ? 'bg-[#0E3120] border-white/15 text-white'
                        : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div
                      className={`font-mono-meta text-[10px] uppercase ${
                        pitchMode ? 'text-[#6EE7B7]' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      Defensive Line & Structure
                    </div>
                    <div className="text-xs font-medium mt-0.5">
                      {activeCoach.metrics.defensiveLine}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-xl border ${
                      pitchMode
                        ? 'bg-[#0E3120] border-white/15 text-white'
                        : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div
                      className={`font-mono-meta text-[10px] uppercase ${
                        pitchMode ? 'text-[#6EE7B7]' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      Buildup & Progression
                    </div>
                    <div className="text-xs font-medium mt-0.5">
                      {activeCoach.metrics.buildupStyle}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-xl border ${
                      pitchMode
                        ? 'bg-[#0E3120] border-white/15 text-white'
                        : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div
                      className={`font-mono-meta text-[10px] uppercase ${
                        pitchMode ? 'text-[#6EE7B7]' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      Out-of-Possession Trigger
                    </div>
                    <div className="text-xs font-medium mt-0.5">
                      {activeCoach.metrics.pressingTrigger}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Interactive Area: 11-Player Animated Tactical Pitch + Player Role Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 Cols: Interactive 11-Player SVG Pitch with Live Role Movement */}
              <div className="lg:col-span-7 space-y-3">
                {/* Interactive Tactical Phase & Auto-Movement Controls */}
                <div
                  className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 ${
                    pitchMode
                      ? 'bg-[#0E3120] border-white/15 text-white'
                      : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { id: 'base', label: '1. Base Kick-Off' },
                        { id: 'possession', label: '2. Build-Up Rotation' },
                        { id: 'attack', label: '3. Final-Third Overload' },
                      ] as const
                    ).map((ph) => {
                      const active = tacticalPhase === ph.id;
                      return (
                        <button
                          key={ph.id}
                          type="button"
                          onClick={() => {
                            setIsSimulating(false);
                            setTacticalPhase(ph.id);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-mono-meta text-[11px] border transition-all cursor-pointer ${
                            active
                              ? pitchMode
                                ? 'bg-[#EDBB00] text-[#071C12] border-[#EDBB00] font-semibold shadow-xs'
                                : 'bg-[var(--accent-crimson)] text-white border-[var(--accent-crimson)] font-semibold'
                              : pitchMode
                              ? 'bg-[#071C12]/70 text-white/80 border-white/15 hover:text-white'
                              : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {ph.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsSimulating((prev) => !prev)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono-meta text-[11px] border transition-all cursor-pointer ${
                        isSimulating
                          ? 'bg-[#10B981] text-[#052E16] border-[#34D399] font-semibold'
                          : pitchMode
                          ? 'bg-[#071C12] text-[#EDBB00] border-[#EDBB00]/50'
                          : 'bg-[var(--bg-canvas)] text-[var(--text-primary)] border-[var(--border-hairline)]'
                      }`}
                    >
                      {isSimulating ? (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>Live Movement: ON</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Animate All 11 Roles</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSimulating(false);
                        setTacticalPhase('base');
                      }}
                      title="Reset to Base Formation"
                      className="p-1.5 rounded-lg border border-current/20 opacity-75 hover:opacity-100 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div
                  className={`flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-meta ${
                    pitchMode ? 'text-[#A7F3D0]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  <span>
                    ATTACKING DIRECTION → · PHASE:{' '}
                    <strong className={pitchMode ? 'text-[#EDBB00]' : 'text-[var(--accent-crimson)]'}>
                      {tacticalPhase === 'base'
                        ? 'BASE FORMATION'
                        : tacticalPhase === 'possession'
                        ? 'BUILD-UP & POSITIONAL ROTATION'
                        : 'FINAL-THIRD ATTACK & OVERLOAD'}
                    </strong>
                  </span>
                  <span>ALL 11 POSITIONS MOVE BY ROLE · CLICK ANY PLAYER</span>
                </div>

                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border-2 border-[#34D399]/40 bg-[#0B2418] shadow-inner select-none">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                    aria-label={`${activeCoach.name} interactive tactical pitch formation`}
                  >
                    <defs>
                      <marker
                        id="role-arrow-gold"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="3.5"
                        markerHeight="3.5"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#EDBB00" />
                      </marker>
                      <marker
                        id="role-arrow-subtle"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="3"
                        markerHeight="3"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 2 L 8 5 L 0 8 z" fill="rgba(237,187,0,0.55)" />
                      </marker>
                    </defs>

                    {/* Subtle Turf Mow Stripes */}
                    {[0, 20, 40, 60, 80].map((stripeX) => (
                      <rect
                        key={stripeX}
                        x={stripeX}
                        y="0"
                        width="10"
                        height="100"
                        fill="rgba(255,255,255,0.025)"
                      />
                    ))}

                    {/* Pitch Boundary & Markings */}
                    <rect
                      x="3"
                      y="4"
                      width="94"
                      height="92"
                      fill="none"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="0.55"
                    />
                    <line
                      x1="50"
                      y1="4"
                      x2="50"
                      y2="96"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="0.55"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="12"
                      fill="none"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="0.55"
                    />
                    <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.5)" />

                    {/* Left & Right Penalty Boxes */}
                    <rect
                      x="3"
                      y="24"
                      width="14"
                      height="52"
                      fill="none"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="0.55"
                    />
                    <rect
                      x="83"
                      y="24"
                      width="14"
                      height="52"
                      fill="none"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="0.55"
                    />

                    {/* Half-Space Tactical Channels (Dashed) */}
                    <line
                      x1="3"
                      y1="30"
                      x2="97"
                      y2="30"
                      stroke="rgba(237,187,0,0.16)"
                      strokeDasharray="1.5 1.5"
                      strokeWidth="0.35"
                    />
                    <line
                      x1="3"
                      y1="70"
                      x2="97"
                      y2="70"
                      stroke="rgba(237,187,0,0.16)"
                      strokeDasharray="1.5 1.5"
                      strokeWidth="0.35"
                    />

                    {/* Hansi Flick Dynamic Ultra-High Offside Trap Line */}
                    {activeCoach.id === 'flick' && (
                      <g>
                        <line
                          x1={tacticalPhase === 'base' ? 40 : tacticalPhase === 'possession' ? 47 : 52}
                          y1="4"
                          x2={tacticalPhase === 'base' ? 40 : tacticalPhase === 'possession' ? 47 : 52}
                          y2="96"
                          stroke="#EDBB00"
                          strokeDasharray="2 1.5"
                          strokeWidth="0.65"
                        />
                      </g>
                    )}

                    {/* Role Movement Trails for ALL 11 Players (Base Ghost Node -> Current Active Position) */}
                    {activeCoach.players.map((pl) => {
                      const currentPos = getPlayerCoordinates(pl, tacticalPhase);
                      const moveData = PLAYER_ROLE_MOVEMENTS[pl.id];
                      const targetPos =
                        tacticalPhase === 'base' && moveData
                          ? { x: moveData.attackX, y: moveData.attackY }
                          : currentPos;
                      const isSel = activePlayer.id === pl.id;
                      const dx = targetPos.x - pl.x;
                      const dy = targetPos.y - pl.y;
                      const dist = Math.hypot(dx, dy);

                      return (
                        <g key={`${pl.id}-trail`}>
                          {/* Ghost Base Position Dot when moved */}
                          {tacticalPhase !== 'base' && (
                            <circle
                              cx={pl.x}
                              cy={pl.y}
                              r={isSel ? '1.3' : '0.85'}
                              fill="rgba(255,255,255,0.22)"
                              stroke={isSel ? '#EDBB00' : 'rgba(255,255,255,0.35)'}
                              strokeWidth="0.3"
                            />
                          )}
                          {/* Role Movement Vector Line */}
                          {dist > 1.5 && (
                            <line
                              x1={pl.x}
                              y1={pl.y}
                              x2={targetPos.x}
                              y2={targetPos.y}
                              stroke={isSel ? '#EDBB00' : 'rgba(237,187,0,0.42)'}
                              strokeWidth={isSel ? '0.85' : '0.42'}
                              strokeDasharray="1.2 1"
                              markerEnd={
                                isSel ? 'url(#role-arrow-gold)' : 'url(#role-arrow-subtle)'
                              }
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Interactive Animated Player Nodes Overlaid on Pitch (Every Position Moves!) */}
                  {activeCoach.players.map((pl) => {
                    const isSel = activePlayer.id === pl.id;
                    const pos = getPlayerCoordinates(pl, tacticalPhase);
                    return (
                      <motion.button
                        key={pl.id}
                        type="button"
                        onClick={() => setSelectedPlayerId(pl.id)}
                        initial={false}
                        animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        transition={{ type: 'spring', stiffness: 105, damping: 17, mass: 0.75 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none cursor-pointer z-10"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono-meta text-[10px] sm:text-[11px] font-bold border-2 transition-transform ${
                              isSel
                                ? 'bg-[#EDBB00] text-[#091A12] border-white scale-125 shadow-lg ring-2 ring-[#EDBB00]/50'
                                : 'bg-[#A50044] text-white border-[#004D98] group-hover:scale-110'
                            }`}
                          >
                            {pl.number}
                          </div>
                          <span
                            className={`mt-0.5 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-mono-meta whitespace-nowrap transition-colors ${
                              isSel
                                ? 'bg-[#EDBB00] text-[#091A12] font-semibold'
                                : 'bg-black/75 text-white/95 group-hover:bg-black'
                            }`}
                          >
                            {pl.name}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Right 5 Cols: Selected Player Role Card + Quick Squad Strip */}
              <div className="lg:col-span-5 space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePlayer.id}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.18 }}
                    className={`p-5 rounded-xl border space-y-3 ${
                      pitchMode
                        ? 'bg-[#0E3120] border-[#EDBB00] text-white shadow-lg'
                        : 'bg-[var(--bg-surface)] border-[var(--accent-crimson)] text-[var(--text-primary)] tactile-card-shadow'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between gap-2 border-b pb-2.5 ${
                        pitchMode ? 'border-white/15' : 'border-[var(--border-hairline)]'
                      }`}
                    >
                      <div className="inline-flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-mono-meta text-xs font-bold ${
                            pitchMode
                              ? 'bg-[#EDBB00] text-[#091A12]'
                              : 'bg-[var(--accent-crimson)] text-white'
                          }`}
                        >
                          {activePlayer.number}
                        </span>
                        <div>
                          <div
                            className={`font-mono-meta text-[10px] uppercase ${
                              pitchMode ? 'text-[#6EE7B7]' : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {activePlayer.positionLabel}
                          </div>
                          <h4 className="font-serif-editorial text-2xl leading-none">
                            {activePlayer.name}
                          </h4>
                        </div>
                      </div>
                      <span
                        className={`font-mono-meta text-[10px] px-2 py-0.5 rounded border ${
                          pitchMode
                            ? 'border-[#EDBB00]/50 text-[#EDBB00]'
                            : 'border-[var(--border-hairline)] text-[var(--accent-crimson)]'
                        }`}
                      >
                        {activeCoach.name} XI
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div
                        className={`font-mono-meta text-[11px] uppercase tracking-wider ${
                          pitchMode ? 'text-[#EDBB00]' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        How {activePlayer.name} Plays in This System
                      </div>
                      <p
                        className={`editorial-body-sm ${
                          pitchMode ? 'text-white/95' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {activePlayer.howTheyPlay}
                      </p>
                    </div>

                    {/* Active Role Movement Breakdown across the Pitch */}
                    {PLAYER_ROLE_MOVEMENTS[activePlayer.id] && (
                      <div
                        className={`p-3.5 rounded-lg border editorial-body-sm space-y-1.5 ${
                          pitchMode
                            ? 'bg-[#071C12]/80 border-[#34D399]/30 text-[#A7F3D0]'
                            : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono-meta text-[10px] uppercase">
                          <span className={pitchMode ? 'text-[#EDBB00]' : 'text-[var(--accent-crimson)]'}>
                            On-Pitch Role Shift ({tacticalPhase.toUpperCase()})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSimulating(false);
                              setTacticalPhase((prev) =>
                                prev === 'base'
                                  ? 'possession'
                                  : prev === 'possession'
                                  ? 'attack'
                                  : 'base'
                              );
                            }}
                            className="underline cursor-pointer"
                          >
                            Step Phase →
                          </button>
                        </div>
                        <p className="leading-relaxed">
                          {PLAYER_ROLE_MOVEMENTS[activePlayer.id].movementNote}
                        </p>
                      </div>
                    )}

                    <div
                      className={`pt-2.5 border-t text-xs flex items-center justify-between gap-2 ${
                        pitchMode ? 'border-white/15' : 'border-[var(--border-hairline)]'
                      }`}
                    >
                      <span className="font-mono-meta text-[10px] uppercase opacity-75">
                        Signature Trait:
                      </span>
                      <span
                        className={`font-serif-editorial italic text-sm ${
                          pitchMode ? 'text-[#EDBB00]' : 'text-[var(--accent-olive)]'
                        }`}
                      >
                        {activePlayer.signatureTrait}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* All 11 Players Quick Selector List */}
                <div className="space-y-2">
                  <div
                    className={`flex items-center justify-between font-mono-meta text-[10px] uppercase ${
                      pitchMode ? 'text-[#A7F3D0]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Full Tactical XI — Click Any Player</span>
                    </span>
                    <span>11 Active Roles</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCoach.players.map((pl) => {
                      const isSel = activePlayer.id === pl.id;
                      return (
                        <button
                          key={pl.id}
                          type="button"
                          onClick={() => setSelectedPlayerId(pl.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono-meta border transition-colors cursor-pointer ${
                            isSel
                              ? pitchMode
                                ? 'bg-[#EDBB00] text-[#091A12] border-[#EDBB00] font-semibold'
                                : 'bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)] font-medium'
                              : pitchMode
                              ? 'bg-[#0E3120] text-white/85 border-white/15 hover:border-[#EDBB00] hover:text-white'
                              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          #{pl.number} {pl.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* =====================================================================
          02 · ICONIC BROADCAST CALLS (4 CHAPTERS — ZERO REPETITION)
          ===================================================================== */}
      <section
        aria-labelledby="iconic-calls-heading"
        className={`relative z-10 space-y-6 pt-6 border-t ${
          pitchMode ? 'border-white/20' : 'border-[var(--border-hairline)]'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 ${
            pitchMode ? 'border-white/15' : 'border-[var(--border-hairline)]'
          }`}
        >
          <div className="space-y-1">
            <div
              className={`inline-flex items-center gap-1.5 font-mono-meta text-xs uppercase tracking-wider ${
                pitchMode ? 'text-[#EDBB00]' : 'text-[var(--accent-crimson)]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>02 · Broadcast Moments</span>
            </div>
            <h2
              id="iconic-calls-heading"
              className={`font-serif-editorial text-2xl sm:text-3xl ${
                pitchMode ? 'text-white' : 'text-[var(--text-primary)]'
              }`}
            >
              Nights That Healed My Soul (And One Away Leg in Rome I Still Haven’t Forgiven)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 font-mono-meta text-xs">
            {(
              [
                { key: 'all', label: 'All 4' },
                { key: 'Crowning Glory', label: 'Lusail 2022' },
                { key: 'Heartbreak', label: 'Rome 2018' },
                { key: 'Miracle', label: 'Barça Miracles' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setIncidentFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  incidentFilter === tab.key
                    ? pitchMode
                      ? 'border-[#EDBB00] bg-[#EDBB00] text-[#071C12] font-semibold'
                      : 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-surface)] font-medium'
                    : pitchMode
                    ? 'border-white/15 bg-[#071E13] text-white/80 hover:text-white'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {filteredIncidents.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border overflow-hidden transition-colors ${
                pitchMode
                  ? 'bg-[#071E13]/92 border-[#34D399]/35 shadow-lg'
                  : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] hover:border-[var(--border-strong)] tactile-card-shadow'
              }`}
            >
              <div
                className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 font-mono-meta text-xs ${
                  pitchMode
                    ? 'bg-[#0E3120] border-white/15 text-white'
                    : 'bg-[var(--bg-canvas)]/70 border-[var(--border-hairline)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      pitchMode ? 'text-[#EDBB00]' : 'text-[var(--accent-crimson)]'
                    }`}
                  >
                    {item.category === 'Crowning Glory' ? (
                      <Trophy className="w-3.5 h-3.5" />
                    ) : item.category === 'Heartbreak' ? (
                      <HeartCrack className="w-3.5 h-3.5" />
                    ) : (
                      <Flame className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {item.chapter} · {item.category}
                    </span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.fixture}</span>
                  <span
                    className={
                      pitchMode
                        ? 'text-[#EDBB00] font-semibold'
                        : 'text-[var(--accent-olive)] font-semibold'
                    }
                  >
                    ({item.scoreline})
                  </span>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 ${
                    pitchMode ? 'text-white/75' : 'text-[var(--text-muted)]'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{item.dateAndVenue}</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-3">
                  <div
                    className={`font-mono-meta text-[11px] uppercase tracking-wider ${
                      pitchMode ? 'text-[#6EE7B7]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {item.minuteOrMoment}
                  </div>
                  <h3
                    className={`font-serif-editorial editorial-sub-heading ${
                      pitchMode ? 'text-white' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {item.headline}
                  </h3>
                  <p
                    className={`font-sans-body editorial-body ${
                      pitchMode ? 'text-white/80' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {item.incidentContext}
                  </p>
                  <div
                    className={`pt-2.5 border-t editorial-body ${
                      pitchMode
                        ? 'border-white/15 text-white/95'
                        : 'border-[var(--border-hairline)] text-[var(--text-primary)]'
                    }`}
                  >
                    <span
                      className={`font-mono-meta text-[11px] uppercase tracking-wider block mb-1 ${
                        pitchMode ? 'text-[#EDBB00]' : 'text-[var(--accent-crimson)]'
                      }`}
                    >
                      My Reaction
                    </span>
                    {item.personalReaction}
                  </div>
                </div>

                <div
                  className={`lg:col-span-7 p-5 rounded-xl border border-l-2 space-y-3 ${
                    pitchMode
                      ? 'bg-[#0E3120] border-white/15 border-l-[#EDBB00]'
                      : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] border-l-[var(--accent-crimson)]'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between font-mono-meta text-[11px] border-b pb-2 ${
                      pitchMode
                        ? 'border-white/15 text-white/75'
                        : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 uppercase tracking-wider ${
                        pitchMode ? 'text-[#EDBB00]' : 'text-[var(--accent-crimson)]'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Verbatim Commentary Call</span>
                    </span>
                    <span>{item.commentator}</span>
                  </div>

                  <blockquote
                    className={`space-y-3 font-literary italic editorial-quote ${
                      pitchMode ? 'text-white' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {item.quotes.map((paragraph, pIdx) => (
                      <p key={pIdx}>“{paragraph}”</p>
                    ))}
                  </blockquote>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
