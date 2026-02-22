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
  material: string
  powerReserve: string
  frequency: string
  jewels: string
  marketTrend: string
  transactions: number
}

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
  material: "Platinum 950",
  powerReserve: "60 Hours",
  frequency: "18,000 vph",
  jewels: "40",
  marketTrend: "+12.4%",
  transactions: 24,
}

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
    material: "Oystersteel",
    powerReserve: "70 Hours",
    frequency: "28,800 vph",
    jewels: "31",
    marketTrend: "+3.6%",
    transactions: 214,
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
    material: "Stainless Steel",
    powerReserve: "50 Hours",
    frequency: "21,600 vph",
    jewels: "26",
    marketTrend: "+2.1%",
    transactions: 178,
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
    material: "Stainless Steel",
    powerReserve: "45 Hours",
    frequency: "28,800 vph",
    jewels: "29",
    marketTrend: "+8.2%",
    transactions: 89,
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
    material: "Titanium",
    powerReserve: "72 Hours",
    frequency: "28,800 vph",
    jewels: "30",
    marketTrend: "+2.9%",
    transactions: 156,
  },
]

export interface CollectionWatch {
  id: string
  brand: string
  model: string
  image: string
  reference: string
  price: string
  verified: boolean
}

export const sotcWatches: CollectionWatch[] = [
  {
    id: "submariner",
    brand: "Rolex",
    model: "Submariner Date",
    image: "/images/watch-submariner.jpg",
    reference: "126610LN",
    price: "$14,200",
    verified: true,
  },
  {
    id: "snowflake",
    brand: "Grand Seiko",
    model: "Snowflake SBGA211",
    image: "/images/watch-snowflake.jpg",
    reference: "SBGA211",
    price: "$5,800",
    verified: true,
  },
  {
    id: "speedmaster",
    brand: "Omega",
    model: "Speedmaster Professional",
    image: "/images/watch-speedmaster.jpg",
    reference: "310.30.42.50.01.001",
    price: "$6,500",
    verified: false,
  },
  {
    id: "reverso",
    brand: "Jaeger-LeCoultre",
    model: "Reverso Classic",
    image: "/images/watch-reverso.jpg",
    reference: "Q3858520",
    price: "$5,500",
    verified: false,
  },
]

export const expertReviews = [
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

export const communityComments = [
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
    body: "The Snowflake is the real hero of this SOTC. Arguably the best finishing under $10k. And that Spring Drive sweep is hypnotic. Pair it with a navy suit and you will get compliments every single time.",
    likes: 23,
  },
  {
    author: "CasebackEnthusiast",
    avatar: "CE",
    timeAgo: "8h ago",
    body: "Solid spread across price points. You have your daily beater (Sub), your conversation starter (Snowflake), your moonwatch (Speedy), and your dress piece (Reverso). The $32k total value is very well allocated. This is the collection of someone who actually wears their watches.",
    likes: 41,
  },
]

/** Look up full watch data for a SOTC item */
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
    material: "Steel",
    powerReserve: "70 Hours",
    frequency: "28,800 vph",
    jewels: "31",
    marketTrend: "+4.0%",
    transactions: 100,
  }
}
