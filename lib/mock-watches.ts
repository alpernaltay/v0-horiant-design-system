// --- Types ---

export interface WatchData {
  id: string
  brand: string
  model: string
  image: string
  reference: string
  movement: string
  price: string
  rating: number
  caseDiameter: string
  thickness: string
  lugToLug: string
  waterResistance: string
  crystal: string
  bracelet: string
  material: string
  powerReserve: string
  frequency: string
  jewels: string
  marketTrend: string
  transactions: number
  year: number
  style: string
  complications: string[]
  legacy: string
  reviewSnippets: string[]
  chrono24Url: string
}

export interface CollectionWatch {
  id: string
  brand: string
  model: string
  image: string
  reference: string
  year: number
  verified: boolean
  complications: string[]
  price: string
}

export interface ExpertReview {
  author: string
  avatar: string
  date: string
  rating: number
  title: string
  body: string
}

export interface CommunityComment {
  author: string
  avatar: string
  timeAgo: string
  body: string
  likes: number
}

// --- Featured Watch ---

export const featuredWatch: WatchData = {
  id: "datograph",
  brand: "A. Lange & S\u00F6hne",
  model: "Datograph",
  image: "/images/datograph-hero.jpg",
  reference: "403.035",
  movement: "L951.6",
  price: "$92,000",
  rating: 5.0,
  caseDiameter: "41.0 mm",
  thickness: "13.1 mm",
  lugToLug: "47.0 mm",
  waterResistance: "30 m",
  crystal: "Sapphire",
  bracelet: "Alligator Leather",
  material: "Platinum 950",
  powerReserve: "60 Hours",
  frequency: "18,000 vph",
  jewels: "40",
  marketTrend: "+12.4%",
  transactions: 24,
  year: 2019,
  style: "Chronograph",
  complications: ["Flyback Chronograph", "Big Date", "Power Reserve"],
  legacy:
    "First unveiled in 1999, the Datograph redefined what a German chronograph could be. Its column-wheel flyback mechanism, designed entirely in-house by Lange master watchmakers, immediately established the Saxon manufacture as a peer to the finest Swiss houses. The oversized date display\u2014a Lange signature\u2014and the perfectly symmetrical dial layout have made it one of the most coveted collector\u2019s pieces of the 21st century. Each movement is assembled twice: once to test, then completely disassembled, cleaned, and rebuilt to final perfection.",
  reviewSnippets: [
    "The hand-engraved balance cock is a work of art unto itself.",
    "Lange understands ergonomics far better than the spec sheet suggests.",
  ],
  chrono24Url: "https://www.chrono24.com/alangesohne/datograph--mod1163.htm",
}

// --- Trending / Discover Watches ---

export const trendingWatches: WatchData[] = [
  {
    id: "submariner",
    brand: "Rolex",
    model: "Submariner Date",
    image: "/images/watch-submariner.jpg",
    reference: "126610LN",
    movement: "Cal. 3235",
    price: "$14,200",
    rating: 4.7,
    caseDiameter: "41.0 mm",
    thickness: "12.7 mm",
    lugToLug: "47.5 mm",
    waterResistance: "300 m",
    crystal: "Sapphire (Cyclops)",
    bracelet: "Oyster / Oystersteel",
    material: "Oystersteel",
    powerReserve: "70 Hours",
    frequency: "28,800 vph",
    jewels: "31",
    marketTrend: "+3.6%",
    transactions: 214,
    year: 2023,
    style: "Diver",
    complications: ["Date", "Rotating Bezel"],
    legacy:
      "Born in 1953 as the world\u2019s first divers\u2019 watch waterproof to 100 metres, the Submariner defined an entire category of timepiece. It has accompanied explorers to the ocean floor and secret agents to the silver screen. Six decades of continuous evolution have refined every detail\u2014from the Cerachrom bezel to the Glidelock clasp\u2014while its essential character remains unchanged: the quintessential tool watch.",
    reviewSnippets: [
      "The quintessential tool watch that needs no introduction.",
      "70-hour power reserve is a game-changer for weekend wear.",
    ],
    chrono24Url: "https://www.chrono24.com/rolex/submariner-date--mod79.htm",
  },
  {
    id: "speedmaster",
    brand: "Omega",
    model: "Speedmaster Professional",
    image: "/images/watch-speedmaster.jpg",
    reference: "310.30.42.50.01.001",
    movement: "Cal. 3861",
    price: "$6,500",
    rating: 4.8,
    caseDiameter: "42.0 mm",
    thickness: "13.2 mm",
    lugToLug: "47.0 mm",
    waterResistance: "50 m",
    crystal: "Hesalite",
    bracelet: "Stainless Steel",
    material: "Stainless Steel",
    powerReserve: "50 Hours",
    frequency: "21,600 vph",
    jewels: "26",
    marketTrend: "+2.1%",
    transactions: 178,
    year: 2024,
    style: "Chronograph",
    complications: ["Chronograph", "Tachymeter"],
    legacy:
      "On July 20, 1969, Buzz Aldrin stepped onto the lunar surface with a Speedmaster strapped to his wrist over his spacesuit. That moment immortalised this chronograph as the Moonwatch\u2014the only watch flight-qualified by NASA for extravehicular activity. The modern Cal. 3861 movement is a worthy successor to the legendary 321, maintaining the hand-wound soul that collectors revere while adding a co-axial escapement and Master Chronometer certification.",
    reviewSnippets: [
      "The only watch certified for extravehicular activity by NASA.",
      "The hesalite crystal adds vintage charm you can feel on the wrist.",
    ],
    chrono24Url: "https://www.chrono24.com/omega/speedmaster-professional-moonwatch--mod174.htm",
  },
  {
    id: "nautilus",
    brand: "Patek Philippe",
    model: "Nautilus 5711/1A",
    image: "/images/watch-nautilus.jpg",
    reference: "5711/1A-010",
    movement: "Cal. 26-330 S C",
    price: "$148,500",
    rating: 4.9,
    caseDiameter: "40.0 mm",
    thickness: "8.3 mm",
    lugToLug: "44.6 mm",
    waterResistance: "120 m",
    crystal: "Sapphire",
    bracelet: "Integrated Steel",
    material: "Stainless Steel",
    powerReserve: "45 Hours",
    frequency: "28,800 vph",
    jewels: "29",
    marketTrend: "+8.2%",
    transactions: 89,
    year: 2021,
    style: "Dress",
    complications: ["Date", "Sweep Seconds"],
    legacy:
      "G\u00E9rald Genta sketched the Nautilus on a napkin in 1976, and in doing so, invented the luxury sports watch category. Inspired by a ship\u2019s porthole, its distinctive octagonal bezel and horizontally embossed dial broke every rule of haute horlogerie\u2014and rewrote them. The 5711/1A, discontinued by Patek Philippe in 2021, has become the single most coveted reference in modern watchmaking, with waitlists stretching into legend.",
    reviewSnippets: [
      "At 8.3mm thick it practically disappears under a cuff.",
      "The blue dial shifts from navy to teal depending on the light.",
    ],
    chrono24Url: "https://www.chrono24.com/patekphilippe/nautilus--mod34.htm",
  },
  {
    id: "snowflake",
    brand: "Grand Seiko",
    model: "Snowflake SBGA211",
    image: "/images/watch-snowflake.jpg",
    reference: "SBGA211",
    movement: "Cal. 9R65",
    price: "$5,800",
    rating: 4.8,
    caseDiameter: "41.0 mm",
    thickness: "12.5 mm",
    lugToLug: "48.0 mm",
    waterResistance: "100 m",
    crystal: "Sapphire (Dual-Curved)",
    bracelet: "Titanium",
    material: "Titanium",
    powerReserve: "72 Hours",
    frequency: "28,800 vph",
    jewels: "30",
    marketTrend: "+2.9%",
    transactions: 156,
    year: 2022,
    style: "Dress",
    complications: ["Date", "Power Reserve Indicator"],
    legacy:
      "The Snowflake\u2019s textured dial is not stamped, pressed, or printed. It is hand-finished through a process inspired by the deep, powdery snow of the Shinshu mountains visible from Grand Seiko\u2019s Studio Shizukuishi. Beneath its surface lies the Spring Drive caliber 9R65\u2014a movement that exists in a category of one, combining a mainspring with a tri-synchro regulator for the smoothest sweep hand in all of horology. It glides without ticking.",
    reviewSnippets: [
      "The Spring Drive sweep is absolutely hypnotic in person.",
      "Arguably the best dial finishing under $10,000 anywhere.",
    ],
    chrono24Url: "https://www.chrono24.com/grandseiko/ref-sbga211.htm",
  },
  {
    id: "reverso",
    brand: "Jaeger-LeCoultre",
    model: "Reverso Classic",
    image: "/images/watch-reverso.jpg",
    reference: "Q3858520",
    movement: "Cal. 822/2",
    price: "$5,500",
    rating: 4.6,
    caseDiameter: "45.6 \u00D7 27.4 mm",
    thickness: "9.1 mm",
    lugToLug: "45.6 mm",
    waterResistance: "30 m",
    crystal: "Sapphire",
    bracelet: "Alligator Leather",
    material: "Stainless Steel",
    powerReserve: "42 Hours",
    frequency: "21,600 vph",
    jewels: "19",
    marketTrend: "+1.8%",
    transactions: 132,
    year: 2020,
    style: "Dress",
    complications: ["Small Seconds"],
    legacy:
      "Created in 1931 for British polo officers in colonial India who needed a watch that could survive a chukker, the Reverso\u2019s reversible case is one of the most iconic industrial designs of the Art Deco era. The blank caseback was originally meant to shield the crystal from mallet blows\u2014today, it invites personal engravings and, in dual-face models, a second time zone. Nearly a century on, it remains the definitive rectangular watch.",
    reviewSnippets: [
      "One of the greatest industrial designs of the Art Deco era.",
      "The click-and-slide mechanism is endlessly satisfying.",
    ],
    chrono24Url: "https://www.chrono24.com/jaegerlecoultre/reverso--mod22.htm",
  },
  {
    id: "royal-oak",
    brand: "Audemars Piguet",
    model: 'Royal Oak "Jumbo"',
    image: "/images/watch-royal-oak.jpg",
    reference: "16202ST.OO.1240ST.01",
    movement: "Cal. 7121",
    price: "$72,000",
    rating: 4.9,
    caseDiameter: "39.0 mm",
    thickness: "8.1 mm",
    lugToLug: "44.5 mm",
    waterResistance: "50 m",
    crystal: "Sapphire",
    bracelet: "Integrated Steel",
    material: "Stainless Steel",
    powerReserve: "55 Hours",
    frequency: "28,800 vph",
    jewels: "37",
    marketTrend: "+5.4%",
    transactions: 67,
    year: 2022,
    style: "Dress",
    complications: ["Date"],
    legacy:
      "Another G\u00E9rald Genta masterwork, the Royal Oak debuted at Baselworld 1972 and scandalised the industry: a stainless steel watch priced above gold. Its octagonal bezel with eight hexagonal screws, integrated bracelet, and \u2018Petite Tapisserie\u2019 dial became the template for luxury sports watchmaking. The 16202, part of AP\u2019s 50th anniversary update, replaces the legendary 15202 with a thinner, more refined caliber while preserving every millimetre of the Jumbo\u2019s iconic silhouette.",
    reviewSnippets: [
      "At 8.1mm thick, it wears like a second skin under a cuff.",
      "The Tapisserie dial is a masterclass in light manipulation.",
    ],
    chrono24Url: "https://www.chrono24.com/audemarspiguet/royal-oak--mod24.htm",
  },
]

// --- The Collection ---

export const sotcWatches: CollectionWatch[] = [
  {
    id: "submariner",
    brand: "Rolex",
    model: "Submariner Date",
    image: "/images/watch-submariner.jpg",
    reference: "126610LN",
    year: 2023,
    verified: true,
    complications: ["Date", "Rotating Bezel"],
    price: "$14,200",
  },
  {
    id: "snowflake",
    brand: "Grand Seiko",
    model: "Snowflake SBGA211",
    image: "/images/watch-snowflake.jpg",
    reference: "SBGA211",
    year: 2022,
    verified: true,
    complications: ["Date", "Power Reserve Indicator"],
    price: "$5,800",
  },
  {
    id: "speedmaster",
    brand: "Omega",
    model: "Speedmaster Professional",
    image: "/images/watch-speedmaster.jpg",
    reference: "310.30.42.50.01.001",
    year: 2024,
    verified: false,
    complications: ["Chronograph", "Tachymeter"],
    price: "$6,500",
  },
  {
    id: "reverso",
    brand: "Jaeger-LeCoultre",
    model: "Reverso Classic",
    image: "/images/watch-reverso.jpg",
    reference: "Q3858520",
    year: 2020,
    verified: false,
    complications: ["Small Seconds"],
    price: "$5,500",
  },
]

// --- Reviews ---

export const expertReviews: ExpertReview[] = [
  {
    author: "WatchScholar_CH",
    avatar: "WS",
    date: "14 Feb 2026",
    rating: 5,
    title: "Caliber finishing is beyond reproach",
    body: "Having examined this reference under a loupe, the level of hand-finishing on the movement is extraordinary. The three-quarter plate features impeccable Glashutte ribbing, and the hand-engraved balance cock is a work of art unto itself. The column-wheel chronograph operates with a tactile precision that puts most Swiss competitors to shame.",
  },
  {
    author: "HorologistMark",
    avatar: "HM",
    date: "3 Jan 2026",
    rating: 4,
    title: "Lug-to-lug wearability is the surprise standout",
    body: "On paper, 41mm with 13.1mm thickness sounds chunky for a dress chronograph. In practice, the case is superbly sculpted. The downturned lugs hug a 17cm wrist beautifully, and the slim bezel makes the dial feel expansive. Lange understands ergonomics far better than the spec sheet suggests.",
  },
]

export const communityReviewSnippets = [
  {
    author: "WristCheck_Berlin",
    avatar: "WB",
    snippet:
      "Wore the Snowflake to a board meeting\u2014three people asked about it. That Spring Drive sweep is a conversation starter like no other.",
    watchId: "snowflake",
    timeAgo: "45m ago",
  },
  {
    author: "CaliberConnoisseur",
    avatar: "CC",
    snippet:
      "The Submariner\u2019s Cerachrom bezel has survived two years of daily wear without a single mark. Rolex engineering at its finest.",
    watchId: "submariner",
    timeAgo: "2h ago",
  },
  {
    author: "DialPursuit",
    avatar: "DP",
    snippet:
      "Picked up the Royal Oak Jumbo in Geneva last month. At 8.1mm thick, it genuinely disappears under a shirt cuff. Perfection.",
    watchId: "royal-oak",
    timeAgo: "4h ago",
  },
  {
    author: "MovementMatters",
    avatar: "MM",
    snippet:
      "The Datograph\u2019s flyback reset is the most satisfying mechanical click I\u2019ve experienced. Worth every penny of the entry price.",
    watchId: "datograph",
    timeAgo: "6h ago",
  },
]

// --- Community Comments ---

export const communityComments: CommunityComment[] = [
  {
    author: "VintageHorology",
    avatar: "VH",
    timeAgo: "2h ago",
    body: "Great three-watch collection, but you need a dress watch! That Reverso is nice, but consider a Cartier Tank or a Lange Saxonia for formal occasions. You are heavily leaning sport/tool right now.",
    likes: 14,
  },
  {
    author: "DialPursuit",
    avatar: "DP",
    timeAgo: "5h ago",
    body: "The Snowflake is the real hero of this collection. Arguably the best finishing under $10k. And that Spring Drive sweep is hypnotic. Pair it with a navy suit and you will get compliments every single time.",
    likes: 23,
  },
  {
    author: "CasebackEnthusiast",
    avatar: "CE",
    timeAgo: "8h ago",
    body: "Solid spread across price points. You have your daily beater (Sub), your conversation starter (Snowflake), your moonwatch (Speedy), and your dress piece (Reverso). This is the collection of someone who actually wears their watches.",
    likes: 41,
  },
]

// --- Category Constants ---

export const watchStyles = ["Diver", "Dress", "GMT", "Chronograph", "Pilot"] as const
export const movementTypes = ["Manual", "Automatic", "Spring Drive", "Hi-Beat"] as const
export const materials = ["Steel", "Gold", "Titanium", "Ceramic"] as const

export const brandGroups = {
  "The Holy Trinity": ["Patek Philippe", "Audemars Piguet", "Vacheron Constantin"],
  Independents: ["A. Lange & S\u00F6hne", "F.P. Journe", "MB&F", "Moser & Cie"],
  "Heritage Manufactures": ["Rolex", "Omega", "Jaeger-LeCoultre", "Grand Seiko"],
} as const

export const databaseStats = {
  watches: "45,231",
  reviews: "2.4M",
  online: "7,000",
} as const

// --- Helpers ---

export function getFullWatchData(collectionWatch: CollectionWatch): WatchData {
  const found = trendingWatches.find((w) => w.id === collectionWatch.id)
  if (found) return found
  return {
    id: collectionWatch.id,
    brand: collectionWatch.brand,
    model: collectionWatch.model,
    image: collectionWatch.image,
    reference: collectionWatch.reference,
    movement: "---",
    price: collectionWatch.price,
    rating: 4.8,
    caseDiameter: "41.0 mm",
    thickness: "12.0 mm",
    lugToLug: "48.0 mm",
    waterResistance: "100 m",
    crystal: "Sapphire",
    bracelet: "Steel",
    material: "Steel",
    powerReserve: "70 Hours",
    frequency: "28,800 vph",
    jewels: "31",
    marketTrend: "+4.0%",
    transactions: 100,
    year: collectionWatch.year,
    style: "Dress",
    complications: collectionWatch.complications,
    legacy: "A distinguished timepiece with a rich heritage in the art of horology.",
    reviewSnippets: ["A solid choice for any discerning collector."],
    chrono24Url: "https://www.chrono24.com",
  }
}

export function getTotalComplications(watches: CollectionWatch[]): number {
  return watches.reduce((sum, w) => sum + w.complications.length, 0)
}
