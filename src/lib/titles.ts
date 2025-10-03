// Title System Configuration
export interface Title {
  id: string;
  name: string;
  description: string;
  unlockCondition: {
    type: 'level' | 'achievement' | 'coney_count' | 'brand_count' | 'location_count';
    value: number | string;
  };
}

export const TITLES: Title[] = [
  // Level-based titles (every 3 levels)
  {
    id: 'rookie-relisher',
    name: 'Rookie Relisher',
    description: 'Unlocked via hitting Level 1',
    unlockCondition: { type: 'level', value: 1 }
  },
  {
    id: 'chili-trainee',
    name: 'Chili Trainee',
    description: 'Unlocked via hitting Level 3',
    unlockCondition: { type: 'level', value: 3 }
  },
  {
    id: 'cheese-rookie',
    name: 'Cheese Rookie',
    description: 'Unlocked via hitting Level 6',
    unlockCondition: { type: 'level', value: 6 }
  },
  {
    id: 'coney-bro',
    name: 'Coney Bro',
    description: 'Unlocked via hitting Level 9',
    unlockCondition: { type: 'level', value: 9 }
  },
  {
    id: 'mustard-master',
    name: 'Mustard Master',
    description: 'Unlocked via hitting Level 12',
    unlockCondition: { type: 'level', value: 12 }
  },
  {
    id: 'onion-knight',
    name: 'Onion Knight',
    description: 'Unlocked via hitting Level 15',
    unlockCondition: { type: 'level', value: 15 }
  },
  {
    id: 'bun-handler',
    name: 'Bun Handler',
    description: 'Unlocked via hitting Level 18',
    unlockCondition: { type: 'level', value: 18 }
  },
  {
    id: 'chili-devotee',
    name: 'Chili Devotee',
    description: 'Unlocked via hitting Level 21',
    unlockCondition: { type: 'level', value: 21 }
  },
  {
    id: 'sausage-slayer',
    name: 'Sausage Slayer',
    description: 'Unlocked via hitting Level 24',
    unlockCondition: { type: 'level', value: 24 }
  },
  {
    id: 'triple-threat',
    name: 'Triple Threat',
    description: 'Unlocked via hitting Level 27',
    unlockCondition: { type: 'level', value: 27 }
  },
  {
    id: 'chili-challenger',
    name: 'Chili Challenger',
    description: 'Unlocked via hitting Level 30',
    unlockCondition: { type: 'level', value: 30 }
  },
  {
    id: 'counter-captain',
    name: 'Counter Captain',
    description: 'Unlocked via hitting Level 33',
    unlockCondition: { type: 'level', value: 33 }
  },
  {
    id: 'chili-conqueror',
    name: 'Chili Conqueror',
    description: 'Unlocked via hitting Level 36',
    unlockCondition: { type: 'level', value: 36 }
  },
  {
    id: 'spice-sprinter',
    name: 'Spice Sprinter',
    description: 'Unlocked via hitting Level 39',
    unlockCondition: { type: 'level', value: 39 }
  },
  {
    id: 'flavor-foreman',
    name: 'Flavor Foreman',
    description: 'Unlocked via hitting Level 42',
    unlockCondition: { type: 'level', value: 42 }
  },
  {
    id: 'counter-commander',
    name: 'Counter Commander',
    description: 'Unlocked via hitting Level 45',
    unlockCondition: { type: 'level', value: 45 }
  },
  {
    id: 'snack-strategist',
    name: 'Snack Strategist',
    description: 'Unlocked via hitting Level 48',
    unlockCondition: { type: 'level', value: 48 }
  },
  {
    id: 'blue-ribbon-biter',
    name: 'Blue-Ribbon Biter',
    description: 'Unlocked via hitting Level 51',
    unlockCondition: { type: 'level', value: 51 }
  },
  {
    id: 'coneynoisseur',
    name: 'Coneynoisseur',
    description: 'Unlocked via hitting Level 54',
    unlockCondition: { type: 'level', value: 54 }
  },
  {
    id: '3-way-warrior',
    name: '3-Way Warrior',
    description: 'Unlocked via hitting Level 57',
    unlockCondition: { type: 'level', value: 57 }
  },
  {
    id: 'hot-dog-hero',
    name: 'Hot Dog Hero',
    description: 'Unlocked via hitting Level 60',
    unlockCondition: { type: 'level', value: 60 }
  },
  {
    id: 'mustard-monarch',
    name: 'Mustard Monarch',
    description: 'Unlocked via hitting Level 63',
    unlockCondition: { type: 'level', value: 63 }
  },
  {
    id: 'chili-king',
    name: 'Chili King',
    description: 'Unlocked via hitting Level 66',
    unlockCondition: { type: 'level', value: 66 }
  },
  {
    id: 'cheddar-lord',
    name: 'Cheddar Lord',
    description: 'Unlocked via hitting Level 69',
    unlockCondition: { type: 'level', value: 69 }
  },
  {
    id: 'coneypocalypse-survivor',
    name: 'Coneypocalypse Survivor',
    description: 'Unlocked via hitting Level 72',
    unlockCondition: { type: 'level', value: 72 }
  },
  {
    id: 'bun-overlord',
    name: 'Bun Overlord',
    description: 'Unlocked via hitting Level 75',
    unlockCondition: { type: 'level', value: 75 }
  },
  {
    id: 'dog-devourer',
    name: 'Dog Devourer',
    description: 'Unlocked via hitting Level 78',
    unlockCondition: { type: 'level', value: 78 }
  },
  {
    id: 'coney-commander',
    name: 'Coney Commander',
    description: 'Unlocked via hitting Level 81',
    unlockCondition: { type: 'level', value: 81 }
  },
  {
    id: 'coney-crusader',
    name: 'Coney Crusader',
    description: 'Unlocked via hitting Level 84',
    unlockCondition: { type: 'level', value: 84 }
  },
  {
    id: 'chili-champion',
    name: 'Chili Champion',
    description: 'Unlocked via hitting Level 87',
    unlockCondition: { type: 'level', value: 87 }
  },
  {
    id: 'coney-legend',
    name: 'Coney Legend',
    description: 'Unlocked via hitting Level 90',
    unlockCondition: { type: 'level', value: 90 }
  },
  {
    id: 'chili-emperor',
    name: 'Chili Emperor',
    description: 'Unlocked via hitting Level 93',
    unlockCondition: { type: 'level', value: 93 }
  },
  {
    id: 'coney-god',
    name: 'Coney God',
    description: 'Unlocked via hitting Level 96',
    unlockCondition: { type: 'level', value: 96 }
  },
  {
    id: 'eternal-coney',
    name: 'Eternal Coney',
    description: 'Unlocked via hitting Level 99',
    unlockCondition: { type: 'level', value: 99 }
  },

  // Achievement-based titles
  {
    id: 'coney-initiate',
    name: 'Coney Initiate',
    description: 'Unlocked via First Coney Achievement',
    unlockCondition: { type: 'achievement', value: 'first-coney' }
  },
  {
    id: 'coney-novice',
    name: 'Coney Novice',
    description: 'Unlocked via Coney Novice Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-novice' }
  },
  {
    id: 'coney-apprentice',
    name: 'Coney Apprentice',
    description: 'Unlocked via Coney Apprentice Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-apprentice' }
  },
  {
    id: 'coney-enthusiast',
    name: 'Coney Enthusiast',
    description: 'Unlocked via Coney Enthusiast Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-enthusiast' }
  },
  {
    id: 'coney-expert',
    name: 'Coney Expert',
    description: 'Unlocked via Coney Expert Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-expert' }
  },
  {
    id: 'coney-master',
    name: 'Coney Master',
    description: 'Unlocked via Coney Master Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-master' }
  },
  {
    id: 'coney-champion',
    name: 'Coney Champion',
    description: 'Unlocked via Coney Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-champion' }
  },
  {
    id: 'legend-of-the-link',
    name: 'Legend of the Link',
    description: 'Unlocked via Legend of the Link Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-level-1000' }
  },
  {
    id: 'grand-gulp',
    name: 'Grand Gulp',
    description: 'Unlocked via Grand Gulp Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-level-2000' }
  },
  {
    id: 'chili-marathoner',
    name: 'Chili Marathoner',
    description: 'Unlocked via Chili Marathoner Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-level-3000' }
  },
  {
    id: 'endless-eater',
    name: 'Endless Eater',
    description: 'Unlocked via Endless Eater Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-level-4000' }
  },
  {
    id: 'bottomless-bite',
    name: 'Bottomless Bite',
    description: 'Unlocked via Bottomless Bite Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-level-5000' }
  },
  {
    id: 'apex-appetite',
    name: 'Apex Appetite',
    description: 'Unlocked via Apex Appetite Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-level-10000' }
  },

  // Quantity-based titles
  {
    id: 'triple-threat-quantity',
    name: 'Triple Threat',
    description: 'Unlocked via Triple Threat Achievement',
    unlockCondition: { type: 'achievement', value: 'triple-threat' }
  },
  {
    id: 'quad-squad',
    name: 'Quad Squad',
    description: 'Unlocked via Quad Squad Achievement',
    unlockCondition: { type: 'achievement', value: 'quadruple-power' }
  },
  {
    id: 'high-five-hero',
    name: 'High-Five Hero',
    description: 'Unlocked via High-Five Hero Achievement',
    unlockCondition: { type: 'achievement', value: 'quintuple-master' }
  },

  // Brand diversity titles
  {
    id: 'passport-to-flavor',
    name: 'Passport to Flavor',
    description: 'Unlocked via Brand Explorer Achievement',
    unlockCondition: { type: 'achievement', value: 'brand-explorer' }
  },
  {
    id: 'cross-counter-crusader',
    name: 'Cross-Counter Crusader',
    description: 'Unlocked via Brand Adventurer Achievement',
    unlockCondition: { type: 'achievement', value: 'brand-adventurer' }
  },
  {
    id: 'citywide-connoisseur',
    name: 'Citywide Connoisseur',
    description: 'Unlocked via Brand Connoisseur Achievement',
    unlockCondition: { type: 'achievement', value: 'brand-connoisseur' }
  },

  // Time-based titles
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    description: 'Unlocked via Daily Warrior Achievement',
    unlockCondition: { type: 'achievement', value: 'daily-warrior' }
  },
  {
    id: 'weekday-warrior',
    name: 'Weekday Warrior',
    description: 'Unlocked via Weekly Warrior Achievement',
    unlockCondition: { type: 'achievement', value: 'weekly-warrior' }
  },
  {
    id: 'seven-day-slayer',
    name: 'Seven-Day Slayer',
    description: 'Unlocked via Weekly Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'weekly-champion' }
  },
  {
    id: 'calendar-crusher',
    name: 'Calendar Crusher',
    description: 'Unlocked via Weekly Legend Achievement',
    unlockCondition: { type: 'achievement', value: 'weekly-legend' }
  },
  {
    id: 'monthlong-muncher',
    name: 'Monthlong Muncher',
    description: 'Unlocked via Monthly Master Achievement',
    unlockCondition: { type: 'achievement', value: 'monthly-master' }
  },
  {
    id: 'loyalist-of-the-month',
    name: 'Loyalist of the Month',
    description: 'Unlocked via Monthly Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'monthly-champion' }
  },

  // Location titles
  {
    id: 'local-tourist',
    name: 'Local Tourist',
    description: 'Unlocked via Location Starter Achievement',
    unlockCondition: { type: 'achievement', value: 'location-starter' }
  },
  {
    id: 'route-runner',
    name: 'Route Runner',
    description: 'Unlocked via Location Explorer Achievement',
    unlockCondition: { type: 'achievement', value: 'location-explorer' }
  },
  {
    id: 'chili-trailblazer',
    name: 'Chili Trailblazer',
    description: 'Unlocked via Location Adventurer Achievement',
    unlockCondition: { type: 'achievement', value: 'location-adventurer' }
  },
  {
    id: 'coney-voyager',
    name: 'Coney Voyager',
    description: 'Unlocked via Location Traveler Achievement',
    unlockCondition: { type: 'achievement', value: 'location-traveler' }
  },
  {
    id: 'citywide-snacker',
    name: 'Citywide Snacker',
    description: 'Unlocked via Location Expert Achievement',
    unlockCondition: { type: 'achievement', value: 'location-expert' }
  },
  {
    id: 'itinerary-ironman',
    name: 'Itinerary Ironman',
    description: 'Unlocked via Location Master Achievement',
    unlockCondition: { type: 'achievement', value: 'location-master' }
  },
  {
    id: 'map-marker-monarch',
    name: 'Map Marker Monarch',
    description: 'Unlocked via Location Legend Achievement',
    unlockCondition: { type: 'achievement', value: 'location-legend' }
  },

  // Day-of-week pattern titles
  {
    id: 'monday-muncher',
    name: 'Monday Muncher',
    description: 'Unlocked via Coney Day Monday Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-day-monday' }
  },
  {
    id: 'tuesday-taster',
    name: 'Tuesday Taster',
    description: 'Unlocked via Coney Day Tuesday Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-day-tuesday' }
  },
  {
    id: 'wednesday-warrior',
    name: 'Wednesday Warrior',
    description: 'Unlocked via Coney Day Wednesday Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-day-wednesday' }
  },
  {
    id: 'thursday-thrasher',
    name: 'Thursday Thrasher',
    description: 'Unlocked via Coney Day Thursday Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-day-thursday' }
  },
  {
    id: 'friday-feaster',
    name: 'Friday Feaster',
    description: 'Unlocked via Coney Day Friday Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-day-friday' }
  },
  {
    id: 'saturday-snacker',
    name: 'Saturday Snacker',
    description: 'Unlocked via Coney Day Saturday Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-day-saturday' }
  },
  {
    id: 'sunday-supper-club',
    name: 'Sunday Supper Club',
    description: 'Unlocked via Coney Day Sunday Achievement',
    unlockCondition: { type: 'achievement', value: 'coney-day-sunday' }
  },

  // Creative pattern titles
  {
    id: 'sunrise-snacker',
    name: 'Sunrise Snacker',
    description: 'Unlocked via Early Bird Achievement',
    unlockCondition: { type: 'achievement', value: 'early-bird' }
  },
  {
    id: 'midnight-muncher',
    name: 'Midnight Muncher',
    description: 'Unlocked via Night Owl Achievement',
    unlockCondition: { type: 'achievement', value: 'night-owl' }
  },
  {
    id: 'weekend-warrior-title',
    name: 'Weekend Warrior',
    description: 'Unlocked via Weekend Warrior Achievement',
    unlockCondition: { type: 'achievement', value: 'weekend-warrior' }
  },

  // Special titles
  {
    id: 'two-chain-day',
    name: 'Two-Chain Day',
    description: 'Unlocked via Double Brand Day Achievement',
    unlockCondition: { type: 'achievement', value: 'double-brand-day' }
  }
];

// Get all available titles
export function getAllTitles(): Title[] {
  return TITLES;
}

// Get title by ID
export function getTitleById(id: string): Title | undefined {
  return TITLES.find(title => title.id === id);
}

// Check if user has unlocked a title based on their stats
export function checkTitleUnlock(title: Title, userStats: {
  level: number;
  achievements: string[];
  totalConeys: number;
  brandsVisited: number;
  locationsVisited: number;
}): boolean {
  switch (title.unlockCondition.type) {
    case 'level':
      return userStats.level >= (title.unlockCondition.value as number);
    case 'achievement':
      return userStats.achievements.includes(title.unlockCondition.value as string);
    case 'coney_count':
      return userStats.totalConeys >= (title.unlockCondition.value as number);
    case 'brand_count':
      return userStats.brandsVisited >= (title.unlockCondition.value as number);
    case 'location_count':
      return userStats.locationsVisited >= (title.unlockCondition.value as number);
    default:
      return false;
  }
}

// Get newly unlocked titles for a user
export function getNewlyUnlockedTitles(
  oldStats: {
    level: number;
    achievements: string[];
    totalConeys: number;
    brandsVisited: number;
    locationsVisited: number;
  },
  newStats: {
    level: number;
    achievements: string[];
    totalConeys: number;
    brandsVisited: number;
    locationsVisited: number;
  },
  previouslyUnlockedTitles: string[]
): Title[] {
  const newlyUnlocked: Title[] = [];
  
  for (const title of TITLES) {
    // Skip if already unlocked
    if (previouslyUnlockedTitles.includes(title.id)) {
      continue;
    }
    
    // Check if newly unlocked
    const wasUnlocked = checkTitleUnlock(title, oldStats);
    const isNowUnlocked = checkTitleUnlock(title, newStats);
    
    if (!wasUnlocked && isNowUnlocked) {
      newlyUnlocked.push(title);
    }
  }
  
  return newlyUnlocked;
}