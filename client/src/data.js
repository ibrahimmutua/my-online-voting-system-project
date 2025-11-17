// data.js

// Import election thumbnails
import Thumbnail1 from './assets/404.jfif';
import Thumbnail2 from './assets/403.jfif';
import Thumbnail3 from './assets/404.jfif';

// Import candidate images
import Candidate1 from './assets/kalonzo.jfif';
import Candidate2 from './assets/kindiki.jfif';
import Candidate3 from './assets/ruto.jfif';
import Candidate4 from './assets/rigathi.jfif';
import Candidate5 from './assets/raila.jfif';
import Candidate6 from './assets/mudavadi.jfif';
import Candidate7 from './assets/kibaki.jfif';

// Array of elections
export const elections = [
  {
    id: 'e1',
    title: '2025 Presidential Election',
    description:"Focused on creating opportunities and ensuring every voice is heard.",
    thumbnail: Thumbnail1,
    candidates: ['c1', 'c2', 'c3', 'c4'],
    voters: [],
  },
  {
    id: 'e2',
    title: '2025 Governer Election',
    description: 'Driven by honesty, passion, and a clear vision for positive change.',
    thumbnail: Thumbnail2,
    candidates: ['c5', 'c6', 'c7'],
    voters: [],
  },
  {
    id: 'e3',
    title: '2025 Mp Election',
    description: 'Dedicated to empowering youth and building a stronger, united community.',
    thumbnail: Thumbnail3,
    candidates: [],
    voters: [],
  },
];

// Array of candidates
export const candidates = [
  {
    id: 'c1',
    fullName: 'Kalonzo Musyoka',
    image: Candidate1,
    motto: "Your Voice Counts",
    voteCount: 23,
    election: 'e1',
  },
  {
    id: 'c2',
    fullName: 'Kithure Kindiki',
    image: Candidate2,
    motto: "United We Stand",
    voteCount: 18,
    election: 'e1',
  },
  {
    id: 'c3',
    fullName: 'William Ruto',
    image: Candidate3,
    motto: "Change Begins",
    voteCount: 3,
    election: 'e1',
  },
  {
    id: 'c4',
    fullName: 'Rigathi Gachagua',
    image: Candidate4,
    motto: "Forward Together",
    voteCount: 5,
    election: 'e1',
  },
  {
    id: 'c5',
    fullName: 'Raila Odinga',
    image: Candidate5,
    motto: "Change Begins",
    voteCount: 238,
    election: 'e2',
  },
  {
    id: 'c6',
    fullName: 'Musalia Mudavadi',
    image: Candidate6,
    motto: 'Peace and progress',
    voteCount: 42,
    election: 'e2',
  },
  {
    id: 'c7',
    fullName: 'Mwai Kibaki',
    image: Candidate7,
    motto: 'For the people',
    voteCount: 190,
    election: 'e2',
  },
];

// Array of voters
export const voters = [
  {
    id: 'v1',
    fullName: 'Tapo Mike',
    email: 'tapomike12@gmail.com',
    password: 'Tapo12345',
    isAdmin: true,
    votedElections: ['e2'],
  },
  {
    id: 'v2',
    fullName: 'Yakuza Yako',
    email: 'yakuzayako23@gmail.com',
    password: 'yakuza12345',
    isAdmin: false,
    votedElections: ['e1', 'e2'],
  },
  {
    id: 'v3',
    fullName: 'Israel David',
    email: 'israeldavid45@gmail.com',
    password: 'israel12345',
    isAdmin: false,
    votedElections: ['e1', 'e2'],
  },
  {
    id: 'v4',
    fullName: 'Mirrium Tali',
    email: 'mirriumtali76@gmail.com',
    password: 'mirrium12345',
    isAdmin: true,
    votedElections: ['e1', 'e2'],
  },
];
