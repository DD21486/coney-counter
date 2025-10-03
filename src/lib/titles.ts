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
  },

  // Skyline Chili Brand Titles
  {
    id: 'skyline-starter-title',
    name: 'Skyline Starter',
    description: 'Unlocked via Skyline Starter Achievement',
    unlockCondition: { type: 'achievement', value: 'skyline-starter' }
  },
  {
    id: 'skyline-regular-title',
    name: 'Skyline Regular',
    description: 'Unlocked via Skyline Regular Achievement',
    unlockCondition: { type: 'achievement', value: 'skyline-regular' }
  },
  {
    id: 'skyline-fan-title',
    name: 'Skyline Fan',
    description: 'Unlocked via Skyline Fan Achievement',
    unlockCondition: { type: 'achievement', value: 'skyline-fan' }
  },
  {
    id: 'skyline-devotee-title',
    name: 'Skyline Devotee',
    description: 'Unlocked via Skyline Devotee Achievement',
    unlockCondition: { type: 'achievement', value: 'skyline-devotee' }
  },
  {
    id: 'skyline-legend-title',
    name: 'Skyline Legend',
    description: 'Unlocked via Skyline Legend Achievement',
    unlockCondition: { type: 'achievement', value: 'skyline-legend' }
  },
  {
    id: 'skyline-coney-champion-title',
    name: 'Skyline Coney Champion',
    description: 'Unlocked via Skyline Coney Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'skyline-coney-champion' }
  },

  // Gold Star Chili Brand Titles
  {
    id: 'goldstar-starter-title',
    name: 'Gold Star Starter',
    description: 'Unlocked via Gold Star Starter Achievement',
    unlockCondition: { type: 'achievement', value: 'goldstar-starter' }
  },
  {
    id: 'goldstar-regular-title',
    name: 'Gold Star Regular',
    description: 'Unlocked via Gold Star Regular Achievement',
    unlockCondition: { type: 'achievement', value: 'goldstar-regular' }
  },
  {
    id: 'goldstar-fan-title',
    name: 'Gold Star Fan',
    description: 'Unlocked via Gold Star Fan Achievement',
    unlockCondition: { type: 'achievement', value: 'goldstar-fan' }
  },
  {
    id: 'goldstar-devotee-title',
    name: 'Gold Star Devotee',
    description: 'Unlocked via Gold Star Devotee Achievement',
    unlockCondition: { type: 'achievement', value: 'goldstar-devotee' }
  },
  {
    id: 'goldstar-legend-title',
    name: 'Gold Star Legend',
    description: 'Unlocked via Gold Star Legend Achievement',
    unlockCondition: { type: 'achievement', value: 'goldstar-legend' }
  },
  {
    id: 'goldstar-coney-champion-title',
    name: 'Gold Star Coney Champion',
    description: 'Unlocked via Gold Star Coney Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'goldstar-coney-champion' }
  },

  // Dixie Chili Brand Titles
  {
    id: 'dixie-starter-title',
    name: 'Dixie Starter',
    description: 'Unlocked via Dixie Starter Achievement',
    unlockCondition: { type: 'achievement', value: 'dixie-starter' }
  },
  {
    id: 'dixie-regular-title',
    name: 'Dixie Regular',
    description: 'Unlocked via Dixie Regular Achievement',
    unlockCondition: { type: 'achievement', value: 'dixie-regular' }
  },
  {
    id: 'dixie-fan-title',
    name: 'Dixie Fan',
    description: 'Unlocked via Dixie Fan Achievement',
    unlockCondition: { type: 'achievement', value: 'dixie-fan' }
  },
  {
    id: 'dixie-devotee-title',
    name: 'Dixie Devotee',
    description: 'Unlocked via Dixie Devotee Achievement',
    unlockCondition: { type: 'achievement', value: 'dixie-devotee' }
  },
  {
    id: 'dixie-legend-title',
    name: 'Dixie Legend',
    description: 'Unlocked via Dixie Legend Achievement',
    unlockCondition: { type: 'achievement', value: 'dixie-legend' }
  },
  {
    id: 'dixie-coney-champion-title',
    name: 'Dixie Coney Champion',
    description: 'Unlocked via Dixie Coney Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'dixie-coney-champion' }
  },

  // Camp Washington Chili Brand Titles
  {
    id: 'camp-washington-starter-title',
    name: 'Camp Washington Starter',
    description: 'Unlocked via Camp Washington Starter Achievement',
    unlockCondition: { type: 'achievement', value: 'camp-washington-starter' }
  },
  {
    id: 'camp-washington-regular-title',
    name: 'Camp Washington Regular',
    description: 'Unlocked via Camp Washington Regular Achievement',
    unlockCondition: { type: 'achievement', value: 'camp-washington-regular' }
  },
  {
    id: 'camp-washington-fan-title',
    name: 'Camp Washington Fan',
    description: 'Unlocked via Camp Washington Fan Achievement',
    unlockCondition: { type: 'achievement', value: 'camp-washington-fan' }
  },
  {
    id: 'camp-washington-devotee-title',
    name: 'Camp Washington Devotee',
    description: 'Unlocked via Camp Washington Devotee Achievement',
    unlockCondition: { type: 'achievement', value: 'camp-washington-devotee' }
  },
  {
    id: 'camp-washington-legend-title',
    name: 'Camp Washington Legend',
    description: 'Unlocked via Camp Washington Legend Achievement',
    unlockCondition: { type: 'achievement', value: 'camp-washington-legend' }
  },
  {
    id: 'camp-washington-coney-champion-title',
    name: 'Camp Washington Coney Champion',
    description: 'Unlocked via Camp Washington Coney Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'camp-washington-coney-champion' }
  },

  // Empress Chili Brand Titles
  {
    id: 'empress-starter-title',
    name: 'Empress Starter',
    description: 'Unlocked via Empress Starter Achievement',
    unlockCondition: { type: 'achievement', value: 'empress-starter' }
  },
  {
    id: 'empress-regular-title',
    name: 'Empress Regular',
    description: 'Unlocked via Empress Regular Achievement',
    unlockCondition: { type: 'achievement', value: 'empress-regular' }
  },
  {
    id: 'empress-fan-title',
    name: 'Empress Fan',
    description: 'Unlocked via Empress Fan Achievement',
    unlockCondition: { type: 'achievement', value: 'empress-fan' }
  },
  {
    id: 'empress-devotee-title',
    name: 'Empress Devotee',
    description: 'Unlocked via Empress Devotee Achievement',
    unlockCondition: { type: 'achievement', value: 'empress-devotee' }
  },
  {
    id: 'empress-legend-title',
    name: 'Empress Legend',
    description: 'Unlocked via Empress Legend Achievement',
    unlockCondition: { type: 'achievement', value: 'empress-legend' }
  },
  {
    id: 'empress-coney-champion-title',
    name: 'Empress Coney Champion',
    description: 'Unlocked via Empress Coney Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'empress-coney-champion' }
  },

  // Price Hill Chili Brand Titles
  {
    id: 'price-hill-starter-title',
    name: 'Price Hill Starter',
    description: 'Unlocked via Price Hill Starter Achievement',
    unlockCondition: { type: 'achievement', value: 'price-hill-starter' }
  },
  {
    id: 'price-hill-regular-title',
    name: 'Price Hill Regular',
    description: 'Unlocked via Price Hill Regular Achievement',
    unlockCondition: { type: 'achievement', value: 'price-hill-regular' }
  },
  {
    id: 'price-hill-fan-title',
    name: 'Price Hill Fan',
    description: 'Unlocked via Price Hill Fan Achievement',
    unlockCondition: { type: 'achievement', value: 'price-hill-fan' }
  },
  {
    id: 'price-hill-devotee-title',
    name: 'Price Hill Devotee',
    description: 'Unlocked via Price Hill Devotee Achievement',
    unlockCondition: { type: 'achievement', value: 'price-hill-devotee' }
  },
  {
    id: 'price-hill-legend-title',
    name: 'Price Hill Legend',
    description: 'Unlocked via Price Hill Legend Achievement',
    unlockCondition: { type: 'achievement', value: 'price-hill-legend' }
  },
  {
    id: 'price-hill-coney-champion-title',
    name: 'Price Hill Coney Champion',
    description: 'Unlocked via Price Hill Coney Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'price-hill-coney-champion' }
  },

  // Pleasant Ridge Chili Brand Titles
  {
    id: 'pleasant-ridge-starter-title',
    name: 'Pleasant Ridge Starter',
    description: 'Unlocked via Pleasant Ridge Starter Achievement',
    unlockCondition: { type: 'achievement', value: 'pleasant-ridge-starter' }
  },
  {
    id: 'pleasant-ridge-regular-title',
    name: 'Pleasant Ridge Regular',
    description: 'Unlocked via Pleasant Ridge Regular Achievement',
    unlockCondition: { type: 'achievement', value: 'pleasant-ridge-regular' }
  },
  {
    id: 'pleasant-ridge-fan-title',
    name: 'Pleasant Ridge Fan',
    description: 'Unlocked via Pleasant Ridge Fan Achievement',
    unlockCondition: { type: 'achievement', value: 'pleasant-ridge-fan' }
  },
  {
    id: 'pleasant-ridge-devotee-title',
    name: 'Pleasant Ridge Devotee',
    description: 'Unlocked via Pleasant Ridge Devotee Achievement',
    unlockCondition: { type: 'achievement', value: 'pleasant-ridge-devotee' }
  },
  {
    id: 'pleasant-ridge-legend-title',
    name: 'Pleasant Ridge Legend',
    description: 'Unlocked via Pleasant Ridge Legend Achievement',
    unlockCondition: { type: 'achievement', value: 'pleasant-ridge-legend' }
  },
  {
    id: 'pleasant-ridge-master-title',
    name: 'Pleasant Ridge Master',
    description: 'Unlocked via Pleasant Ridge Master Achievement',
    unlockCondition: { type: 'achievement', value: 'pleasant-ridge-master' }
  },
  {
    id: 'pleasant-ridge-champion-title',
    name: 'Pleasant Ridge Champion',
    description: 'Unlocked via Pleasant Ridge Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'pleasant-ridge-champion' }
  },
  {
    id: 'pleasant-ridge-coney-champion-title',
    name: 'Pleasant Ridge Coney Champion',
    description: 'Unlocked via Pleasant Ridge Coney Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'pleasant-ridge-coney-champion' }
  },

  // Blue Ash Chili Brand Titles
  {
    id: 'blue-ash-starter-title',
    name: 'Blue Ash Starter',
    description: 'Unlocked via Blue Ash Starter Achievement',
    unlockCondition: { type: 'achievement', value: 'blue-ash-starter' }
  },
  {
    id: 'blue-ash-regular-title',
    name: 'Blue Ash Regular',
    description: 'Unlocked via Blue Ash Regular Achievement',
    unlockCondition: { type: 'achievement', value: 'blue-ash-regular' }
  },
  {
    id: 'blue-ash-fan-title',
    name: 'Blue Ash Fan',
    description: 'Unlocked via Blue Ash Fan Achievement',
    unlockCondition: { type: 'achievement', value: 'blue-ash-fan' }
  },
  {
    id: 'blue-ash-devotee-title',
    name: 'Blue Ash Devotee',
    description: 'Unlocked via Blue Ash Devotee Achievement',
    unlockCondition: { type: 'achievement', value: 'blue-ash-devotee' }
  },
  {
    id: 'blue-ash-legend-title',
    name: 'Blue Ash Legend',
    description: 'Unlocked via Blue Ash Legend Achievement',
    unlockCondition: { type: 'achievement', value: 'blue-ash-legend' }
  },
  {
    id: 'blue-ash-coney-champion-title',
    name: 'Blue Ash Coney Champion',
    description: 'Unlocked via Blue Ash Coney Champion Achievement',
    unlockCondition: { type: 'achievement', value: 'blue-ash-coney-champion' }
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