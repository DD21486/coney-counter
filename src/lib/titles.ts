// Title System Configuration
export interface Title {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockCondition: {
    type: 'level' | 'achievement' | 'coney_count' | 'brand_count' | 'location_count';
    value: number | string;
  };
  emoji: string;
  color: string;
}

export const TITLES: Title[] = [
  // Level-based titles
  {
    id: 'coney-novice',
    name: 'Coney Novice',
    description: 'Just starting your coney journey',
    rarity: 'common',
    unlockCondition: { type: 'level', value: 1 },
    emoji: '🌭',
    color: '#6B7280'
  },
  {
    id: 'coney-apprentice',
    name: 'Coney Apprentice',
    description: 'Learning the ways of the coney',
    rarity: 'uncommon',
    unlockCondition: { type: 'level', value: 10 },
    emoji: '🎓',
    color: '#3B82F6'
  },
  {
    id: 'coney-enthusiast',
    name: 'Coney Enthusiast',
    description: 'A true lover of coneys',
    rarity: 'rare',
    unlockCondition: { type: 'level', value: 25 },
    emoji: '❤️',
    color: '#EF4444'
  },
  {
    id: 'coney-expert',
    name: 'Coney Expert',
    description: 'Master of the coney arts',
    rarity: 'epic',
    unlockCondition: { type: 'level', value: 50 },
    emoji: '🧠',
    color: '#8B5CF6'
  },
  {
    id: 'coney-master',
    name: 'Coney Master',
    description: 'Legendary coney knowledge',
    rarity: 'legendary',
    unlockCondition: { type: 'level', value: 75 },
    emoji: '👑',
    color: '#F59E0B'
  },
  {
    id: 'coney-legend',
    name: 'Coney Legend',
    description: 'The ultimate coney crusher',
    rarity: 'legendary',
    unlockCondition: { type: 'level', value: 90 },
    emoji: '🏆',
    color: '#10B981'
  },

  // Achievement-based titles
  {
    id: 'skyline-specialist',
    name: 'Skyline Specialist',
    description: 'Master of Skyline Chili',
    rarity: 'rare',
    unlockCondition: { type: 'achievement', value: 'skyline-master' },
    emoji: '🔵',
    color: '#1C3FAA'
  },
  {
    id: 'gold-star-champion',
    name: 'Gold Star Champion',
    description: 'Champion of Gold Star Chili',
    rarity: 'rare',
    unlockCondition: { type: 'achievement', value: 'goldstar-master' },
    emoji: '⭐',
    color: '#D97706'
  },
  {
    id: 'brand-explorer',
    name: 'Brand Explorer',
    description: 'Explored many coney brands',
    rarity: 'uncommon',
    unlockCondition: { type: 'brand_count', value: 5 },
    emoji: '🗺️',
    color: '#059669'
  },
  {
    id: 'location-traveler',
    name: 'Location Traveler',
    description: 'Traveled far for coneys',
    rarity: 'rare',
    unlockCondition: { type: 'location_count', value: 10 },
    emoji: '✈️',
    color: '#0891B2'
  },
  {
    id: 'coney-counter',
    name: 'Coney Counter',
    description: 'Counted many coneys',
    rarity: 'epic',
    unlockCondition: { type: 'coney_count', value: 100 },
    emoji: '🔢',
    color: '#DC2626'
  },
  {
    id: 'coney-god',
    name: 'Coney God',
    description: 'The ultimate coney deity',
    rarity: 'legendary',
    unlockCondition: { type: 'coney_count', value: 1000 },
    emoji: '⚡',
    color: '#7C3AED'
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

// Get titles by rarity
export function getTitlesByRarity(rarity: Title['rarity']): Title[] {
  return TITLES.filter(title => title.rarity === rarity);
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

// Get rarity color
export function getRarityColor(rarity: Title['rarity']): string {
  const colors = {
    common: '#6B7280',
    uncommon: '#3B82F6',
    rare: '#8B5CF6',
    epic: '#F59E0B',
    legendary: '#EF4444'
  };
  return colors[rarity];
}

// Get rarity display name
export function getRarityDisplayName(rarity: Title['rarity']): string {
  const names = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary'
  };
  return names[rarity];
}
