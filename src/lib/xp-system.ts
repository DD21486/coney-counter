import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// XP Configuration
export const XP_CONFIG = {
  XP_PER_CONEY: 10,
  ACHIEVEMENT_XP: {
    MINOR: 15,
    STANDARD: 30,
    MAJOR: 45,
    EPIC: 70,
    LEGENDARY: 100
  },
  LEVEL_XP_CURVE: [
    20, 25, 30, 35, 40, 45, 50, 55, 60, 65, // Levels 1-10
  ],
  DEFAULT_XP_PER_LEVEL_AFTER_CURVE: 70, // From Level 11 onward
  MAX_LEVEL: 99,
}

// Level progression curve: 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, then 70 for all remaining levels
export function getXPRequiredForLevel(level: number): number {
  if (level < 1 || level > XP_CONFIG.MAX_LEVEL) {
    throw new Error(`Invalid level: ${level}. Must be between 1 and ${XP_CONFIG.MAX_LEVEL}`)
  }
  
  if (level <= XP_CONFIG.LEVEL_XP_CURVE.length) {
    return XP_CONFIG.LEVEL_XP_CURVE[level - 1]
  }
  return XP_CONFIG.DEFAULT_XP_PER_LEVEL_AFTER_CURVE
}

// Calculate total XP needed to reach a specific level
export function getTotalXPForLevel(level: number): number {
  if (level < 1 || level > XP_CONFIG.MAX_LEVEL) {
    throw new Error(`Invalid level: ${level}. Must be between 1 and ${XP_CONFIG.MAX_LEVEL}`)
  }
  
  if (level === 1) return 0
  
  let total = 0
  for (let i = 1; i < level; i++) {
    total += getXPRequiredForLevel(i)
  }
  return total
}

// Calculate what level a user should be based on their total XP
export function calculateLevelFromXP(totalXP: number): { level: number; currentLevelXP: number; nextLevelXP: number } {
  if (totalXP < 0) {
    throw new Error('Total XP cannot be negative')
  }
  
  let level = 1
  let xpNeededForNextLevel = getXPRequiredForLevel(level)
  let xpInCurrentLevel = totalXP
  
  while (xpInCurrentLevel >= xpNeededForNextLevel && level < XP_CONFIG.MAX_LEVEL) {
    xpInCurrentLevel -= xpNeededForNextLevel
    level++
    xpNeededForNextLevel = getXPRequiredForLevel(level)
  }
  
  return {
    level,
    currentLevelXP: xpInCurrentLevel,
    nextLevelXP: xpNeededForNextLevel
  }
}

// Add XP to a user and handle leveling up
export async function addXPToUser(userId: string, xpAmount: number, source: 'coney' | 'achievement'): Promise<{
  leveledUp: boolean;
  newLevel?: number;
  oldLevel?: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
}> {
  try {
    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalXP: true,
        currentLevel: true,
        currentLevelXP: true,
        nextLevelXP: true
      }
    })
    
    if (!user) {
      throw new Error('User not found')
    }
    
    const oldTotalXP = user.totalXP
    const newTotalXP = oldTotalXP + xpAmount
    
    // Calculate new level based on total XP
    const levelData = calculateLevelFromXP(newTotalXP)
    
    const leveledUp = levelData.level > user.currentLevel
    
    // Update user with new XP and level data
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXP: newTotalXP,
        currentLevel: levelData.level,
        currentLevelXP: levelData.currentLevelXP,
        nextLevelXP: levelData.nextLevelXP
      }
    })
    
    return {
      leveledUp,
      newLevel: leveledUp ? levelData.level : undefined,
      oldLevel: user.currentLevel, // Always include old level for display
      totalXP: newTotalXP,
      currentLevelXP: levelData.currentLevelXP,
      nextLevelXP: levelData.nextLevelXP
    }
    
  } catch (error) {
    console.error('Error adding XP to user:', error)
    throw error
  }
}

// Get XP amount for achievement based on its tier
export function getAchievementXP(achievementId: string): number {
  // Map achievement IDs to their XP tiers
  const achievementTiers: { [key: string]: 'MINOR' | 'STANDARD' | 'MAJOR' | 'EPIC' | 'LEGENDARY' } = {
    // Minor achievements (25 XP)
    'first-coney': 'MINOR',
    'coney-day-monday': 'MINOR',
    'coney-day-tuesday': 'MINOR',
    'coney-day-wednesday': 'MINOR',
    'coney-day-thursday': 'MINOR',
    'coney-day-friday': 'MINOR',
    'coney-day-saturday': 'MINOR',
    'coney-day-sunday': 'MINOR',
    'early-bird': 'MINOR',
    'night-owl': 'MINOR',
    'double-brand-day': 'MINOR',
    
    // Standard achievements (50 XP)
    'coney-novice': 'STANDARD',
    'brand-explorer': 'STANDARD',
    'location-starter': 'STANDARD',
    'daily-warrior': 'STANDARD',
    'triple-threat': 'STANDARD',
    'skyline-starter': 'STANDARD',
    'skyline-coney-novice': 'MINOR',
    'goldstar-starter': 'STANDARD',
    'dixie-starter': 'STANDARD',
    'camp-washington-starter': 'STANDARD',
    'empress-starter': 'STANDARD',
    'price-hill-starter': 'STANDARD',
    'pleasant-ridge-starter': 'STANDARD',
    'blue-ash-starter': 'STANDARD',
    
    // Major achievements (100 XP)
    'coney-apprentice': 'MAJOR',
    'coney-enthusiast': 'MAJOR',
    'brand-adventurer': 'MAJOR',
    'location-explorer': 'MAJOR',
    'location-adventurer': 'MAJOR',
    'weekly-warrior': 'MAJOR',
    'quadruple-power': 'MAJOR',
    'quintuple-master': 'MAJOR',
    'weekend-warrior': 'MAJOR',
    
    // Epic achievements (250 XP)
    'coney-expert': 'EPIC',
    'coney-master': 'EPIC',
    'brand-connoisseur': 'EPIC',
    'location-traveler': 'EPIC',
    'location-expert': 'EPIC',
    'weekly-champion': 'EPIC',
    'weekly-legend': 'EPIC',
    'monthly-master': 'EPIC',
    'monthly-champion': 'EPIC',
    
    // Legendary achievements (500 XP)
    'coney-champion': 'LEGENDARY',
    'coney-legend': 'LEGENDARY',
    'coney-god': 'LEGENDARY',
    'coney-level-3000': 'LEGENDARY',
    'coney-level-4000': 'LEGENDARY',
    'coney-level-5000': 'LEGENDARY',
    'coney-level-10000': 'LEGENDARY',
    'location-master': 'LEGENDARY',
    'location-legend': 'LEGENDARY'
  }
  
  const tier = achievementTiers[achievementId]
  if (!tier) {
    console.warn(`No XP tier found for achievement: ${achievementId}, defaulting to MINOR`)
    return XP_CONFIG.ACHIEVEMENT_XP.MINOR
  }
  
  return XP_CONFIG.ACHIEVEMENT_XP[tier]
}

// Initialize XP system for existing users (migration helper)
export async function initializeXPForUser(userId: string): Promise<void> {
  try {
    // Get user's coney logs and achievements
    const [coneyLogs, achievements] = await Promise.all([
      prisma.coneyLog.findMany({
        where: { userId },
        select: { quantity: true }
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true }
      })
    ])
    
    // Calculate total XP from coneys
    const coneyXP = coneyLogs.reduce((total, log) => total + (log.quantity * XP_CONFIG.XP_PER_CONEY), 0)
    
    // Calculate total XP from achievements
    const achievementXP = achievements.reduce((total, achievement) => {
      return total + getAchievementXP(achievement.achievementId)
    }, 0)
    
    const totalXP = coneyXP + achievementXP
    
    // Calculate level data
    const levelData = calculateLevelFromXP(totalXP)
    
    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXP,
        currentLevel: levelData.level,
        currentLevelXP: levelData.currentLevelXP,
        nextLevelXP: levelData.nextLevelXP
      }
    })
    
    console.log(`Initialized XP for user ${userId}: Level ${levelData.level}, Total XP: ${totalXP}`)
    
  } catch (error) {
    console.error('Error initializing XP for user:', error)
    throw error
  }
}

// Get achievement XP with readable tier name
export function getAchievementXPWithTier(achievementId: string): { xp: number; tier: string } {
  const xp = getAchievementXP(achievementId);
  let tier = 'Minor';
  
  if (xp === XP_CONFIG.ACHIEVEMENT_XP.STANDARD) tier = 'Standard';
  else if (xp === XP_CONFIG.ACHIEVEMENT_XP.MAJOR) tier = 'Major';
  else if (xp === XP_CONFIG.ACHIEVEMENT_XP.EPIC) tier = 'Epic';
  else if (xp === XP_CONFIG.ACHIEVEMENT_XP.LEGENDARY) tier = 'Legendary';
  
  return { xp, tier };
}
