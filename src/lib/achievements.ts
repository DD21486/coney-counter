import { PrismaClient } from '@prisma/client'
import { addXPToUser, getAchievementXP } from './xp-system'

const prisma = new PrismaClient()

// Achievement data structure with individual brand sections
export const achievementsData = [
  // Total coney achievements
  {
    id: 'first-coney',
    title: 'First Coney',
    description: 'Crush your first coney',
    category: 'total-coney',
    requirement: 1,
    icon: '🎉',
  },
  {
    id: 'coney-novice',
    title: 'Coney Novice',
    description: 'Eat 10 coneys',
    category: 'total-coney',
    requirement: 10,
    icon: '🌭',
  },
  {
    id: 'coney-apprentice',
    title: 'Coney Apprentice',
    description: 'Eat 25 coneys',
    category: 'total-coney',
    requirement: 25,
    icon: '🌭',
  },
  {
    id: 'coney-enthusiast',
    title: 'Coney Enthusiast',
    description: 'Eat 50 coneys',
    category: 'total-coney',
    requirement: 50,
    icon: '🌭',
  },
  {
    id: 'coney-expert',
    title: 'Coney Expert',
    description: 'Eat 100 coneys',
    category: 'total-coney',
    requirement: 100,
    icon: '🌭',
  },
  {
    id: 'coney-master',
    title: 'Coney Master',
    description: 'Eat 200 coneys',
    category: 'total-coney',
    requirement: 200,
    icon: '🌭',
  },
  {
    id: 'coney-champion',
    title: 'Coney Champion',
    description: 'Eat 500 coneys',
    category: 'total-coney',
    requirement: 500,
    icon: '🌭',
  },
  {
    id: 'coney-legend',
    title: 'Coney Legend',
    description: 'Eat 1000 coneys',
    category: 'total-coney',
    requirement: 1000,
    icon: '🌭',
  },
  {
    id: 'coney-god',
    title: 'Coney God',
    description: 'Eat 2000 coneys',
    category: 'total-coney',
    requirement: 2000,
    icon: '🌭',
  },
  {
    id: 'coney-level-3000',
    title: 'Coney Level 3000',
    description: 'Eat 3000 coneys',
    category: 'total-coney',
    requirement: 3000,
    icon: '🌭',
  },
  {
    id: 'coney-level-4000',
    title: 'Coney Level 4000',
    description: 'Eat 4000 coneys',
    category: 'total-coney',
    requirement: 4000,
    icon: '🌭',
  },
  {
    id: 'coney-level-5000',
    title: 'Coney Level 5000',
    description: 'Eat 5000 coneys',
    category: 'total-coney',
    requirement: 5000,
    icon: '🌭',
  },
  {
    id: 'coney-level-10000',
    title: 'Coney Level 10000',
    description: 'Eat 10000 coneys',
    category: 'total-coney',
    requirement: 10000,
    icon: '🌭',
  },
  
  // Quantity achievements
  {
    id: 'triple-threat',
    title: 'Triple Threat',
    description: 'Eat 3 coneys in one sitting',
    category: 'quantity',
    requirement: 3,
    icon: '🔥',
  },
  {
    id: 'quadruple-power',
    title: 'Quadruple Power',
    description: 'Eat 4 coneys in one sitting',
    category: 'quantity',
    requirement: 4,
    icon: '🔥',
  },
  {
    id: 'quintuple-master',
    title: 'Quintuple Master',
    description: 'Eat 5 coneys in one sitting',
    category: 'quantity',
    requirement: 5,
    icon: '🔥',
  },
  
  // Brand diversity achievements
  {
    id: 'brand-explorer',
    title: 'Brand Explorer',
    description: 'Eat at 2 different chili brands',
    category: 'brand-diversity',
    requirement: 2,
    icon: '🗺️',
  },
  {
    id: 'brand-adventurer',
    title: 'Brand Adventurer',
    description: 'Eat at 4 different chili brands',
    category: 'brand-diversity',
    requirement: 4,
    icon: '🗺️',
  },
  {
    id: 'brand-connoisseur',
    title: 'Brand Connoisseur',
    description: 'Eat at 6 different chili brands',
    category: 'brand-diversity',
    requirement: 6,
    icon: '🗺️',
  },
  
  // Time-based achievements
  {
    id: 'daily-warrior',
    title: 'Daily Warrior',
    description: 'Eat coneys 2 days in a row',
    category: 'time-based',
    requirement: 2,
    icon: '📅',
  },
  {
    id: 'weekly-warrior',
    title: 'Weekly Warrior',
    description: 'Eat 4 coneys in one week',
    category: 'time-based',
    requirement: 4,
    icon: '📅',
  },
  {
    id: 'weekly-champion',
    title: 'Weekly Champion',
    description: 'Eat 8 coneys in one week',
    category: 'time-based',
    requirement: 8,
    icon: '📅',
  },
  {
    id: 'weekly-legend',
    title: 'Weekly Legend',
    description: 'Eat 12 coneys in one week',
    category: 'time-based',
    requirement: 12,
    icon: '📅',
  },
  {
    id: 'monthly-master',
    title: 'Monthly Master',
    description: 'Eat 16 coneys in one month',
    category: 'time-based',
    requirement: 16,
    icon: '📅',
  },
  {
    id: 'monthly-champion',
    title: 'Monthly Champion',
    description: 'Eat 16 coneys in one month at one brand',
    category: 'time-based',
    requirement: 16,
    icon: '📅',
  },
  
  // Location achievements
  {
    id: 'location-starter',
    title: 'Location Starter',
    description: 'Eat at 2 different locations',
    category: 'location',
    requirement: 2,
    icon: '📍',
  },
  {
    id: 'location-explorer',
    title: 'Location Explorer',
    description: 'Eat at 5 different locations',
    category: 'location',
    requirement: 5,
    icon: '📍',
  },
  {
    id: 'location-adventurer',
    title: 'Location Adventurer',
    description: 'Eat at 10 different locations',
    category: 'location',
    requirement: 10,
    icon: '📍',
  },
  {
    id: 'location-traveler',
    title: 'Location Traveler',
    description: 'Eat at 15 different locations',
    category: 'location',
    requirement: 15,
    icon: '📍',
  },
  {
    id: 'location-expert',
    title: 'Location Expert',
    description: 'Eat at 20 different locations',
    category: 'location',
    requirement: 20,
    icon: '📍',
  },
  {
    id: 'location-master',
    title: 'Location Master',
    description: 'Eat at 25 different locations',
    category: 'location',
    requirement: 25,
    icon: '📍',
  },
  {
    id: 'location-legend',
    title: 'Location Legend',
    description: 'Eat at 30 different locations',
    category: 'location',
    requirement: 30,
    icon: '📍',
  },
  
  // Special achievements
  {
    id: 'double-brand-day',
    title: 'Double Brand Day',
    description: 'Eat at two different coney brands in the same day',
    category: 'special',
    requirement: 1,
    icon: '🎯',
  },
  
  // Pattern achievements
  {
    id: 'coney-day-monday',
    title: 'Monday Coney',
    description: 'Eat coneys on a Monday',
    category: 'pattern',
    requirement: 1,
    icon: '📅',
  },
  {
    id: 'coney-day-tuesday',
    title: 'Tuesday Coney',
    description: 'Eat coneys on a Tuesday',
    category: 'pattern',
    requirement: 1,
    icon: '📅',
  },
  {
    id: 'coney-day-wednesday',
    title: 'Wednesday Coney',
    description: 'Eat coneys on a Wednesday',
    category: 'pattern',
    requirement: 1,
    icon: '📅',
  },
  {
    id: 'coney-day-thursday',
    title: 'Thursday Coney',
    description: 'Eat coneys on a Thursday',
    category: 'pattern',
    requirement: 1,
    icon: '📅',
  },
  {
    id: 'coney-day-friday',
    title: 'Friday Coney',
    description: 'Eat coneys on a Friday',
    category: 'pattern',
    requirement: 1,
    icon: '📅',
  },
  {
    id: 'coney-day-saturday',
    title: 'Saturday Coney',
    description: 'Eat coneys on a Saturday',
    category: 'pattern',
    requirement: 1,
    icon: '📅',
  },
  {
    id: 'coney-day-sunday',
    title: 'Sunday Coney',
    description: 'Eat coneys on a Sunday',
    category: 'pattern',
    requirement: 1,
    icon: '📅',
  },
  
  // Creative achievements
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Eat coneys between 5 AM - 9 AM',
    category: 'creative',
    requirement: 1,
    icon: '🌅',
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Eat coneys between 10 PM - 2 AM',
    category: 'creative',
    requirement: 1,
    icon: '🦉',
  },
  {
    id: 'weekend-warrior',
    title: 'Weekend Warrior',
    description: 'Eat coneys on consecutive Saturday and Sunday',
    category: 'creative',
    requirement: 1,
    icon: '🏆',
  },

  // Skyline Chili Loyalty (Visit-based)
  {
    id: 'skyline-starter',
    title: 'Skyline Starter',
    description: 'Visit Skyline once',
    category: 'skyline-loyalty',
    requirement: 1,
    icon: '🌭',
  },
  {
    id: 'skyline-regular',
    title: 'Skyline Regular',
    description: 'Visit Skyline 5 times',
    category: 'skyline-loyalty',
    requirement: 5,
    icon: '🌭',
  },
  {
    id: 'skyline-fan',
    title: 'Skyline Fan',
    description: 'Visit Skyline 10 times',
    category: 'skyline-loyalty',
    requirement: 10,
    icon: '🌭',
  },
  {
    id: 'skyline-devotee',
    title: 'Skyline Devotee',
    description: 'Visit Skyline 25 times',
    category: 'skyline-loyalty',
    requirement: 25,
    icon: '🌭',
  },
  {
    id: 'skyline-legend',
    title: 'Skyline Legend',
    description: 'Visit Skyline 50 times',
    category: 'skyline-loyalty',
    requirement: 50,
    icon: '🌭',
  },

  // Skyline Chili Coneys (Coney-based)
  {
    id: 'skyline-coney-novice',
    title: 'Skyline Coney Novice',
    description: 'Eat 5 Skyline coneys',
    category: 'skyline-coneys',
    requirement: 5,
    icon: '🌭',
  },
  {
    id: 'skyline-coney-apprentice',
    title: 'Skyline Coney Apprentice',
    description: 'Eat 10 Skyline coneys',
    category: 'skyline-coneys',
    requirement: 10,
    icon: '🌭',
  },
  {
    id: 'skyline-coney-enthusiast',
    title: 'Skyline Coney Enthusiast',
    description: 'Eat 25 Skyline coneys',
    category: 'skyline-coneys',
    requirement: 25,
    icon: '🌭',
  },
  {
    id: 'skyline-coney-expert',
    title: 'Skyline Coney Expert',
    description: 'Eat 50 Skyline coneys',
    category: 'skyline-coneys',
    requirement: 50,
    icon: '🌭',
  },
  {
    id: 'skyline-coney-master',
    title: 'Skyline Coney Master',
    description: 'Eat 100 Skyline coneys',
    category: 'skyline-coneys',
    requirement: 100,
    icon: '🌭',
  },
  {
    id: 'skyline-coney-champion',
    title: 'Skyline Coney Champion',
    description: 'Eat 200 Skyline coneys',
    category: 'skyline-coneys',
    requirement: 200,
    icon: '🌭',
  },

  // Gold Star Chili Loyalty (Visit-based)
  {
    id: 'goldstar-starter',
    title: 'Gold Star Starter',
    description: 'Visit Gold Star once',
    category: 'goldstar-loyalty',
    requirement: 1,
    icon: '⭐',
  },
  {
    id: 'goldstar-regular',
    title: 'Gold Star Regular',
    description: 'Visit Gold Star 5 times',
    category: 'goldstar-loyalty',
    requirement: 5,
    icon: '⭐',
  },
  {
    id: 'goldstar-fan',
    title: 'Gold Star Fan',
    description: 'Visit Gold Star 10 times',
    category: 'goldstar-loyalty',
    requirement: 10,
    icon: '⭐',
  },
  {
    id: 'goldstar-devotee',
    title: 'Gold Star Devotee',
    description: 'Visit Gold Star 25 times',
    category: 'goldstar-loyalty',
    requirement: 25,
    icon: '⭐',
  },
  {
    id: 'goldstar-legend',
    title: 'Gold Star Legend',
    description: 'Visit Gold Star 50 times',
    category: 'goldstar-loyalty',
    requirement: 50,
    icon: '⭐',
  },

  // Gold Star Chili Coneys (Coney-based)
  {
    id: 'goldstar-coney-novice',
    title: 'Gold Star Coney Novice',
    description: 'Eat 5 Gold Star coneys',
    category: 'goldstar-coneys',
    requirement: 5,
    icon: '⭐',
  },
  {
    id: 'goldstar-coney-apprentice',
    title: 'Gold Star Coney Apprentice',
    description: 'Eat 10 Gold Star coneys',
    category: 'goldstar-coneys',
    requirement: 10,
    icon: '⭐',
  },
  {
    id: 'goldstar-coney-enthusiast',
    title: 'Gold Star Coney Enthusiast',
    description: 'Eat 25 Gold Star coneys',
    category: 'goldstar-coneys',
    requirement: 25,
    icon: '⭐',
  },
  {
    id: 'goldstar-coney-expert',
    title: 'Gold Star Coney Expert',
    description: 'Eat 50 Gold Star coneys',
    category: 'goldstar-coneys',
    requirement: 50,
    icon: '⭐',
  },
  {
    id: 'goldstar-coney-master',
    title: 'Gold Star Coney Master',
    description: 'Eat 100 Gold Star coneys',
    category: 'goldstar-coneys',
    requirement: 100,
    icon: '⭐',
  },
  {
    id: 'goldstar-coney-champion',
    title: 'Gold Star Coney Champion',
    description: 'Eat 200 Gold Star coneys',
    category: 'goldstar-coneys',
    requirement: 200,
    icon: '⭐',
  },

  // Dixie Chili Loyalty
  {
    id: 'dixie-starter',
    title: 'Dixie Starter',
    description: 'Visit Dixie Chili once',
    category: 'dixie-loyalty',
    requirement: 1,
    icon: '🌶️',
  },
  {
    id: 'dixie-regular',
    title: 'Dixie Regular',
    description: 'Visit Dixie Chili 5 times',
    category: 'dixie-loyalty',
    requirement: 5,
    icon: '🌶️',
  },
  {
    id: 'dixie-fan',
    title: 'Dixie Fan',
    description: 'Visit Dixie Chili 10 times',
    category: 'dixie-loyalty',
    requirement: 10,
    icon: '🌶️',
  },
  {
    id: 'dixie-devotee',
    title: 'Dixie Devotee',
    description: 'Visit Dixie Chili 25 times',
    category: 'dixie-loyalty',
    requirement: 25,
    icon: '🌶️',
  },
  {
    id: 'dixie-legend',
    title: 'Dixie Legend',
    description: 'Visit Dixie Chili 50 times',
    category: 'dixie-loyalty',
    requirement: 50,
    icon: '🌶️',
  },

  // Dixie Chili Coneys (Coney-based)
  {
    id: 'dixie-coney-novice',
    title: 'Dixie Coney Novice',
    description: 'Eat 5 Dixie coneys',
    category: 'dixie-coneys',
    requirement: 5,
    icon: '🌶️',
  },
  {
    id: 'dixie-coney-apprentice',
    title: 'Dixie Coney Apprentice',
    description: 'Eat 10 Dixie coneys',
    category: 'dixie-coneys',
    requirement: 10,
    icon: '🌶️',
  },
  {
    id: 'dixie-coney-enthusiast',
    title: 'Dixie Coney Enthusiast',
    description: 'Eat 25 Dixie coneys',
    category: 'dixie-coneys',
    requirement: 25,
    icon: '🌶️',
  },
  {
    id: 'dixie-coney-expert',
    title: 'Dixie Coney Expert',
    description: 'Eat 50 Dixie coneys',
    category: 'dixie-coneys',
    requirement: 50,
    icon: '🌶️',
  },
  {
    id: 'dixie-coney-master',
    title: 'Dixie Coney Master',
    description: 'Eat 100 Dixie coneys',
    category: 'dixie-coneys',
    requirement: 100,
    icon: '🌶️',
  },
  {
    id: 'dixie-coney-champion',
    title: 'Dixie Coney Champion',
    description: 'Eat 200 Dixie coneys',
    category: 'dixie-coneys',
    requirement: 200,
    icon: '🌶️',
  },

  // Camp Washington Chili Loyalty
  {
    id: 'camp-washington-starter',
    title: 'Camp Washington Starter',
    description: 'Visit Camp Washington Chili once',
    category: 'camp-washington-loyalty',
    requirement: 1,
    icon: '🏕️',
  },
  {
    id: 'camp-washington-regular',
    title: 'Camp Washington Regular',
    description: 'Visit Camp Washington Chili 5 times',
    category: 'camp-washington-loyalty',
    requirement: 5,
    icon: '🏕️',
  },
  {
    id: 'camp-washington-fan',
    title: 'Camp Washington Fan',
    description: 'Visit Camp Washington Chili 10 times',
    category: 'camp-washington-loyalty',
    requirement: 10,
    icon: '🏕️',
  },
  {
    id: 'camp-washington-devotee',
    title: 'Camp Washington Devotee',
    description: 'Visit Camp Washington Chili 25 times',
    category: 'camp-washington-loyalty',
    requirement: 25,
    icon: '🏕️',
  },
  {
    id: 'camp-washington-legend',
    title: 'Camp Washington Legend',
    description: 'Visit Camp Washington Chili 50 times',
    category: 'camp-washington-loyalty',
    requirement: 50,
    icon: '🏕️',
  },

  // Camp Washington Chili Coneys (Coney-based)
  {
    id: 'camp-washington-coney-novice',
    title: 'Camp Washington Coney Novice',
    description: 'Eat 5 Camp Washington coneys',
    category: 'camp-washington-coneys',
    requirement: 5,
    icon: '🏕️',
  },
  {
    id: 'camp-washington-coney-apprentice',
    title: 'Camp Washington Coney Apprentice',
    description: 'Eat 10 Camp Washington coneys',
    category: 'camp-washington-coneys',
    requirement: 10,
    icon: '🏕️',
  },
  {
    id: 'camp-washington-coney-enthusiast',
    title: 'Camp Washington Coney Enthusiast',
    description: 'Eat 25 Camp Washington coneys',
    category: 'camp-washington-coneys',
    requirement: 25,
    icon: '🏕️',
  },
  {
    id: 'camp-washington-coney-expert',
    title: 'Camp Washington Coney Expert',
    description: 'Eat 50 Camp Washington coneys',
    category: 'camp-washington-coneys',
    requirement: 50,
    icon: '🏕️',
  },
  {
    id: 'camp-washington-coney-master',
    title: 'Camp Washington Coney Master',
    description: 'Eat 100 Camp Washington coneys',
    category: 'camp-washington-coneys',
    requirement: 100,
    icon: '🏕️',
  },
  {
    id: 'camp-washington-coney-champion',
    title: 'Camp Washington Coney Champion',
    description: 'Eat 200 Camp Washington coneys',
    category: 'camp-washington-coneys',
    requirement: 200,
    icon: '🏕️',
  },

  // Empress Chili Loyalty
  {
    id: 'empress-starter',
    title: 'Empress Starter',
    description: 'Visit Empress Chili once',
    category: 'empress-loyalty',
    requirement: 1,
    icon: '👑',
  },
  {
    id: 'empress-regular',
    title: 'Empress Regular',
    description: 'Visit Empress Chili 5 times',
    category: 'empress-loyalty',
    requirement: 5,
    icon: '👑',
  },
  {
    id: 'empress-fan',
    title: 'Empress Fan',
    description: 'Visit Empress Chili 10 times',
    category: 'empress-loyalty',
    requirement: 10,
    icon: '👑',
  },
  {
    id: 'empress-devotee',
    title: 'Empress Devotee',
    description: 'Visit Empress Chili 25 times',
    category: 'empress-loyalty',
    requirement: 25,
    icon: '👑',
  },
  {
    id: 'empress-legend',
    title: 'Empress Legend',
    description: 'Visit Empress Chili 50 times',
    category: 'empress-loyalty',
    requirement: 50,
    icon: '👑',
  },

  // Empress Chili Coneys (Coney-based)
  {
    id: 'empress-coney-novice',
    title: 'Empress Coney Novice',
    description: 'Eat 5 Empress coneys',
    category: 'empress-coneys',
    requirement: 5,
    icon: '👑',
  },
  {
    id: 'empress-coney-apprentice',
    title: 'Empress Coney Apprentice',
    description: 'Eat 10 Empress coneys',
    category: 'empress-coneys',
    requirement: 10,
    icon: '👑',
  },
  {
    id: 'empress-coney-enthusiast',
    title: 'Empress Coney Enthusiast',
    description: 'Eat 25 Empress coneys',
    category: 'empress-coneys',
    requirement: 25,
    icon: '👑',
  },
  {
    id: 'empress-coney-expert',
    title: 'Empress Coney Expert',
    description: 'Eat 50 Empress coneys',
    category: 'empress-coneys',
    requirement: 50,
    icon: '👑',
  },
  {
    id: 'empress-coney-master',
    title: 'Empress Coney Master',
    description: 'Eat 100 Empress coneys',
    category: 'empress-coneys',
    requirement: 100,
    icon: '👑',
  },
  {
    id: 'empress-coney-champion',
    title: 'Empress Coney Champion',
    description: 'Eat 200 Empress coneys',
    category: 'empress-coneys',
    requirement: 200,
    icon: '👑',
  },

  // Price Hill Chili Loyalty
  {
    id: 'price-hill-starter',
    title: 'Price Hill Starter',
    description: 'Visit Price Hill Chili once',
    category: 'price-hill-loyalty',
    requirement: 1,
    icon: '🏔️',
  },
  {
    id: 'price-hill-regular',
    title: 'Price Hill Regular',
    description: 'Visit Price Hill Chili 5 times',
    category: 'price-hill-loyalty',
    requirement: 5,
    icon: '🏔️',
  },
  {
    id: 'price-hill-fan',
    title: 'Price Hill Fan',
    description: 'Visit Price Hill Chili 10 times',
    category: 'price-hill-loyalty',
    requirement: 10,
    icon: '🏔️',
  },
  {
    id: 'price-hill-devotee',
    title: 'Price Hill Devotee',
    description: 'Visit Price Hill Chili 25 times',
    category: 'price-hill-loyalty',
    requirement: 25,
    icon: '🏔️',
  },
  {
    id: 'price-hill-legend',
    title: 'Price Hill Legend',
    description: 'Visit Price Hill Chili 50 times',
    category: 'price-hill-loyalty',
    requirement: 50,
    icon: '🏔️',
  },

  // Price Hill Chili Coneys (Coney-based)
  {
    id: 'price-hill-coney-novice',
    title: 'Price Hill Coney Novice',
    description: 'Eat 5 Price Hill coneys',
    category: 'price-hill-coneys',
    requirement: 5,
    icon: '🏔️',
  },
  {
    id: 'price-hill-coney-apprentice',
    title: 'Price Hill Coney Apprentice',
    description: 'Eat 10 Price Hill coneys',
    category: 'price-hill-coneys',
    requirement: 10,
    icon: '🏔️',
  },
  {
    id: 'price-hill-coney-enthusiast',
    title: 'Price Hill Coney Enthusiast',
    description: 'Eat 25 Price Hill coneys',
    category: 'price-hill-coneys',
    requirement: 25,
    icon: '🏔️',
  },
  {
    id: 'price-hill-coney-expert',
    title: 'Price Hill Coney Expert',
    description: 'Eat 50 Price Hill coneys',
    category: 'price-hill-coneys',
    requirement: 50,
    icon: '🏔️',
  },
  {
    id: 'price-hill-coney-master',
    title: 'Price Hill Coney Master',
    description: 'Eat 100 Price Hill coneys',
    category: 'price-hill-coneys',
    requirement: 100,
    icon: '🏔️',
  },
  {
    id: 'price-hill-coney-champion',
    title: 'Price Hill Coney Champion',
    description: 'Eat 200 Price Hill coneys',
    category: 'price-hill-coneys',
    requirement: 200,
    icon: '🏔️',
  },

  // Pleasant Ridge Chili Loyalty
  {
    id: 'pleasant-ridge-starter',
    title: 'Pleasant Ridge Starter',
    description: 'Visit Pleasant Ridge Chili once',
    category: 'pleasant-ridge-loyalty',
    requirement: 1,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-regular',
    title: 'Pleasant Ridge Regular',
    description: 'Visit Pleasant Ridge Chili 5 times',
    category: 'pleasant-ridge-loyalty',
    requirement: 5,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-fan',
    title: 'Pleasant Ridge Fan',
    description: 'Visit Pleasant Ridge Chili 10 times',
    category: 'pleasant-ridge-loyalty',
    requirement: 10,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-devotee',
    title: 'Pleasant Ridge Devotee',
    description: 'Visit Pleasant Ridge Chili 25 times',
    category: 'pleasant-ridge-loyalty',
    requirement: 25,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-legend',
    title: 'Pleasant Ridge Legend',
    description: 'Visit Pleasant Ridge Chili 50 times',
    category: 'pleasant-ridge-loyalty',
    requirement: 50,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-master',
    title: 'Pleasant Ridge Master',
    description: 'Visit Pleasant Ridge Chili 100 times',
    category: 'pleasant-ridge-loyalty',
    requirement: 100,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-champion',
    title: 'Pleasant Ridge Champion',
    description: 'Visit Pleasant Ridge Chili 200 times',
    category: 'pleasant-ridge-loyalty',
    requirement: 200,
    icon: '🌳',
  },

  // Pleasant Ridge Chili Coneys (Coney-based)
  {
    id: 'pleasant-ridge-coney-novice',
    title: 'Pleasant Ridge Coney Novice',
    description: 'Eat 5 Pleasant Ridge coneys',
    category: 'pleasant-ridge-coneys',
    requirement: 5,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-coney-apprentice',
    title: 'Pleasant Ridge Coney Apprentice',
    description: 'Eat 10 Pleasant Ridge coneys',
    category: 'pleasant-ridge-coneys',
    requirement: 10,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-coney-enthusiast',
    title: 'Pleasant Ridge Coney Enthusiast',
    description: 'Eat 25 Pleasant Ridge coneys',
    category: 'pleasant-ridge-coneys',
    requirement: 25,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-coney-expert',
    title: 'Pleasant Ridge Coney Expert',
    description: 'Eat 50 Pleasant Ridge coneys',
    category: 'pleasant-ridge-coneys',
    requirement: 50,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-coney-master',
    title: 'Pleasant Ridge Coney Master',
    description: 'Eat 100 Pleasant Ridge coneys',
    category: 'pleasant-ridge-coneys',
    requirement: 100,
    icon: '🌳',
  },
  {
    id: 'pleasant-ridge-coney-champion',
    title: 'Pleasant Ridge Coney Champion',
    description: 'Eat 200 Pleasant Ridge coneys',
    category: 'pleasant-ridge-coneys',
    requirement: 200,
    icon: '🌳',
  },

  // Blue Ash Chili Loyalty
  {
    id: 'blue-ash-starter',
    title: 'Blue Ash Starter',
    description: 'Visit Blue Ash Chili once',
    category: 'blue-ash-loyalty',
    requirement: 1,
    icon: '🔵',
  },
  {
    id: 'blue-ash-regular',
    title: 'Blue Ash Regular',
    description: 'Visit Blue Ash Chili 5 times',
    category: 'blue-ash-loyalty',
    requirement: 5,
    icon: '🔵',
  },
  {
    id: 'blue-ash-fan',
    title: 'Blue Ash Fan',
    description: 'Visit Blue Ash Chili 10 times',
    category: 'blue-ash-loyalty',
    requirement: 10,
    icon: '🔵',
  },
  {
    id: 'blue-ash-devotee',
    title: 'Blue Ash Devotee',
    description: 'Visit Blue Ash Chili 25 times',
    category: 'blue-ash-loyalty',
    requirement: 25,
    icon: '🔵',
  },
  {
    id: 'blue-ash-legend',
    title: 'Blue Ash Legend',
    description: 'Visit Blue Ash Chili 50 times',
    category: 'blue-ash-loyalty',
    requirement: 50,
    icon: '🔵',
  },

  // Blue Ash Chili Coneys (Coney-based)
  {
    id: 'blue-ash-coney-novice',
    title: 'Blue Ash Coney Novice',
    description: 'Eat 5 Blue Ash coneys',
    category: 'blue-ash-coneys',
    requirement: 5,
    icon: '🔵',
  },
  {
    id: 'blue-ash-coney-apprentice',
    title: 'Blue Ash Coney Apprentice',
    description: 'Eat 10 Blue Ash coneys',
    category: 'blue-ash-coneys',
    requirement: 10,
    icon: '🔵',
  },
  {
    id: 'blue-ash-coney-enthusiast',
    title: 'Blue Ash Coney Enthusiast',
    description: 'Eat 25 Blue Ash coneys',
    category: 'blue-ash-coneys',
    requirement: 25,
    icon: '🔵',
  },
  {
    id: 'blue-ash-coney-expert',
    title: 'Blue Ash Coney Expert',
    description: 'Eat 50 Blue Ash coneys',
    category: 'blue-ash-coneys',
    requirement: 50,
    icon: '🔵',
  },
  {
    id: 'blue-ash-coney-master',
    title: 'Blue Ash Coney Master',
    description: 'Eat 100 Blue Ash coneys',
    category: 'blue-ash-coneys',
    requirement: 100,
    icon: '🔵',
  },
  {
    id: 'blue-ash-coney-champion',
    title: 'Blue Ash Coney Champion',
    description: 'Eat 200 Blue Ash coneys',
    category: 'blue-ash-coneys',
    requirement: 200,
    icon: '🔵',
  },
]

export async function checkAndUnlockAchievements(userId: string, timezoneOffset?: number) {
  try {
    console.log('Checking achievements for user:', userId)
    
    // Get user's coney logs
    const coneyLogs = await prisma.coneyLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    })

    if (coneyLogs.length === 0) {
      console.log('No coney logs found for user')
      return []
    }

    // Calculate user stats
    const totalConeys = coneyLogs.reduce((sum, log) => sum + log.quantity, 0)
    const brandsTried = new Set(coneyLogs.map(log => log.brand)).size
    
    // Get brand-specific counts (number of visits, not total coneys)
    const brandCounts = coneyLogs.reduce((acc, log) => {
      acc[log.brand] = (acc[log.brand] || 0) + 1  // Count visits, not coneys
      return acc
    }, {} as Record<string, number>)

    // Get brand-specific coney counts (total coneys per brand)
    const brandConeyCounts = coneyLogs.reduce((acc, log) => {
      acc[log.brand] = (acc[log.brand] || 0) + log.quantity  // Count total coneys
      return acc
    }, {} as Record<string, number>)

    console.log('Brand counts:', brandCounts)

    // Get unique locations
    const uniqueLocations = new Set(
      coneyLogs
        .filter(log => log.location)
        .map(log => JSON.parse(log.location as string))
        .map(loc => `${loc.name} - ${loc.address}`)
    ).size

    // Get this month's coneys
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    
    const thisMonthConeys = coneyLogs
      .filter(log => log.createdAt >= thisMonth)
      .reduce((sum, log) => sum + log.quantity, 0)

    // Get this week's coneys
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay())
    thisWeek.setHours(0, 0, 0, 0)
    
    const thisWeekConeys = coneyLogs
      .filter(log => log.createdAt >= thisWeek)
      .reduce((sum, log) => sum + log.quantity, 0)

    // Get user's existing achievements
    const existingAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true }
    })
    
    const unlockedAchievementIds = new Set(existingAchievements.map(a => a.achievementId))
    
    const newlyUnlocked: string[] = []

    // Check each achievement
    for (const achievement of achievementsData) {
      if (unlockedAchievementIds.has(achievement.id)) {
        continue // Already unlocked
      }

      let shouldUnlock = false

      switch (achievement.category) {
        case 'skyline-loyalty':
        case 'goldstar-loyalty':
        case 'dixie-loyalty':
        case 'camp-washington-loyalty':
        case 'empress-loyalty':
        case 'price-hill-loyalty':
        case 'pleasant-ridge-loyalty':
        case 'blue-ash-loyalty':
          // Map category to actual brand names
          const brandMap: { [key: string]: string } = {
            'skyline-loyalty': 'Skyline Chili',
            'goldstar-loyalty': 'Gold Star Chili',
            'dixie-loyalty': 'Dixie Chili',
            'camp-washington-loyalty': 'Camp Washington Chili',
            'empress-loyalty': 'Empress Chili',
            'price-hill-loyalty': 'Price Hill Chili',
            'pleasant-ridge-loyalty': 'Pleasant Ridge Chili',
            'blue-ash-loyalty': 'Blue Ash Chili'
          }
          
          const brandName = brandMap[achievement.category]
          const brandCount = brandCounts[brandName] || 0
          shouldUnlock = brandCount >= achievement.requirement
          break

        case 'skyline-coneys':
        case 'goldstar-coneys':
        case 'dixie-coneys':
        case 'camp-washington-coneys':
        case 'empress-coneys':
        case 'price-hill-coneys':
        case 'pleasant-ridge-coneys':
        case 'blue-ash-coneys':
          // Map category to actual brand names
          const coneyBrandMap: { [key: string]: string } = {
            'skyline-coneys': 'Skyline Chili',
            'goldstar-coneys': 'Gold Star Chili',
            'dixie-coneys': 'Dixie Chili',
            'camp-washington-coneys': 'Camp Washington Chili',
            'empress-coneys': 'Empress Chili',
            'price-hill-coneys': 'Price Hill Chili',
            'pleasant-ridge-coneys': 'Pleasant Ridge Chili',
            'blue-ash-coneys': 'Blue Ash Chili'
          }
          
          const coneyBrandName = coneyBrandMap[achievement.category]
          const brandConeyCount = brandConeyCounts[coneyBrandName] || 0
          shouldUnlock = brandConeyCount >= achievement.requirement
          break

        case 'total-coney':
          shouldUnlock = totalConeys >= achievement.requirement
          break

        case 'brand-diversity':
          shouldUnlock = brandsTried >= achievement.requirement
          break

        case 'quantity':
          // Check if any single log meets the requirement
          shouldUnlock = coneyLogs.some(log => log.quantity >= achievement.requirement)
          break

        case 'time-based':
          if (achievement.id === 'daily-warrior') {
            // Check if user has eaten coneys on 2 consecutive days
            const sortedLogs = coneyLogs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            const uniqueDates = [...new Set(sortedLogs.map(log => log.createdAt.toISOString().split('T')[0]))];
            
            let consecutiveDays = 0;
            let maxConsecutiveDays = 0;
            
            for (let i = 0; i < uniqueDates.length - 1; i++) {
              const currentDate = new Date(uniqueDates[i]);
              const nextDate = new Date(uniqueDates[i + 1]);
              const dayDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
              
              if (dayDiff === 1) {
                consecutiveDays++;
                maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays + 1);
              } else {
                consecutiveDays = 0;
              }
            }
            
            shouldUnlock = maxConsecutiveDays >= achievement.requirement;
          } else if (achievement.id === 'weekly-warrior' || achievement.id === 'weekly-champion' || achievement.id === 'weekly-legend') {
            shouldUnlock = thisWeekConeys >= achievement.requirement
          } else if (achievement.id === 'monthly-master' || achievement.id === 'monthly-champion') {
            shouldUnlock = thisMonthConeys >= achievement.requirement
          }
          break

        case 'location':
          shouldUnlock = uniqueLocations >= achievement.requirement
          break

        case 'special':
          if (achievement.id === 'double-brand-day') {
            // Check if user ate at two different brands on the same day
            const logsByDate = coneyLogs.reduce((acc, log) => {
              const date = log.createdAt.toISOString().split('T')[0]
              if (!acc[date]) acc[date] = new Set()
              acc[date].add(log.brand)
              return acc
            }, {} as Record<string, Set<string>>)
            
            shouldUnlock = Object.values(logsByDate).some(brands => brands.size >= 2)
          }
          break

        case 'pattern':
          // Check if user has eaten coneys on the specific day
          const dayName = achievement.id.split('-')[2] // e.g., 'monday' from 'coney-day-monday'
          const dayMap: Record<string, number> = {
            'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
            'friday': 5, 'saturday': 6, 'sunday': 0
          }
          const targetDay = dayMap[dayName]
          shouldUnlock = coneyLogs.some(log => {
            // Convert UTC timestamp to user's local time for day-of-week achievements
            const logDate = new Date(log.createdAt);
            
            // Apply timezone offset if provided
            if (timezoneOffset !== undefined) {
              const localTime = new Date(logDate.getTime() + (timezoneOffset * 60 * 1000));
              const dayOfWeek = localTime.getUTCDay();
              const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
              
              // Debug logging
              console.log(`Achievement check - Log time: ${log.createdAt}, Timezone offset: ${timezoneOffset}, Local day: ${dayOfWeek} (${dayName}), Target day: ${targetDay}`);
              
              return dayOfWeek === targetDay;
            } else {
              // Fallback to server timezone interpretation
              const dayOfWeek = logDate.getDay();
              const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
              
              console.log(`Achievement check (no timezone) - Log time: ${log.createdAt}, Server day: ${dayOfWeek} (${dayName}), Target day: ${targetDay}`);
              
              return dayOfWeek === targetDay;
            }
          })
          break

        case 'creative':
          if (achievement.id === 'early-bird') {
            // Check if user has eaten coneys between 5 AM - 9 AM local time
            shouldUnlock = coneyLogs.some(log => {
              const logTime = new Date(log.createdAt);
              
              // Apply timezone offset if provided
              if (timezoneOffset !== undefined) {
                const localTime = new Date(logTime.getTime() + (timezoneOffset * 60 * 1000));
                const hour = localTime.getUTCHours();
                const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][localTime.getUTCDay()];
                
                // Debug logging
                console.log(`Early Bird check - Log time: ${log.createdAt}, Timezone offset: ${timezoneOffset}, Local time: ${hour}:${localTime.getUTCMinutes()}, Day: ${dayName}`);
                
                return hour >= 5 && hour < 9;
              } else {
                // Fallback to server timezone interpretation
                const hour = logTime.getHours();
                const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][logTime.getDay()];
                
                console.log(`Early Bird check (no timezone) - Log time: ${log.createdAt}, Server time: ${hour}:${logTime.getMinutes()}, Day: ${dayName}`);
                
                return hour >= 5 && hour < 9;
              }
            });
          } else if (achievement.id === 'night-owl') {
            // Check if user has eaten coneys between 10 PM - 2 AM local time
            shouldUnlock = coneyLogs.some(log => {
              const logTime = new Date(log.createdAt);
              
              // Apply timezone offset if provided
              if (timezoneOffset !== undefined) {
                const localTime = new Date(logTime.getTime() + (timezoneOffset * 60 * 1000));
                const hour = localTime.getUTCHours();
                const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][localTime.getUTCDay()];
                
                // Debug logging
                console.log(`Night Owl check - Log time: ${log.createdAt}, Timezone offset: ${timezoneOffset}, Local time: ${hour}:${localTime.getUTCMinutes()}, Day: ${dayName}`);
                
                return hour >= 22 || hour < 2;
              } else {
                // Fallback to server timezone interpretation
                const hour = logTime.getHours();
                const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][logTime.getDay()];
                
                console.log(`Night Owl check (no timezone) - Log time: ${log.createdAt}, Server time: ${hour}:${logTime.getMinutes()}, Day: ${dayName}`);
                
                return hour >= 22 || hour < 2;
              }
            });
          } else if (achievement.id === 'weekend-warrior') {
            // Check if user has eaten coneys on consecutive Saturday and Sunday
            const sortedLogs = coneyLogs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            
            for (let i = 0; i < sortedLogs.length - 1; i++) {
              const currentLog = sortedLogs[i];
              const nextLog = sortedLogs[i + 1];
              
              const currentDate = new Date(currentLog.createdAt);
              const nextDate = new Date(nextLog.createdAt);
              
              // Check if current log is Saturday and next log is Sunday (using local time)
              if (currentDate.getDay() === 6 && nextDate.getDay() === 0) {
                // Check if they are consecutive days (next day)
                const timeDiff = nextDate.getTime() - currentDate.getTime();
                const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                
                if (daysDiff === 1) {
                  shouldUnlock = true;
                  break;
                }
              }
            }
          }
          break
      }

      if (shouldUnlock) {
        try {
          // Unlock the achievement
          await prisma.userAchievement.create({
            data: {
              userId,
              achievementId: achievement.id,
            },
          })
          
          // Award XP for the achievement
          const achievementXP = getAchievementXP(achievement.id)
          await addXPToUser(userId, achievementXP, 'achievement')
          
          newlyUnlocked.push(achievement.id)
          console.log(`Unlocked achievement: ${achievement.title} (+${achievementXP} XP)`)
        } catch (error: any) {
          // Handle duplicate achievement error gracefully
          if (error.code === 'P2002') {
            console.log(`Achievement ${achievement.title} already unlocked`)
          } else {
            console.error(`Error unlocking achievement ${achievement.title}:`, error)
          }
        }
      }
    }

    return newlyUnlocked

  } catch (error) {
    console.error('Error checking achievements:', error)
    return []
  }
}