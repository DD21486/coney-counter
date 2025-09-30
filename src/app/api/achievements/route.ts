import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { achievementsData as achievements } from '@/lib/achievements';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Achievements API GET called');
    const session = await getServerSession(authOptions);
    console.log('Session:', session?.user?.id);
    if (!session?.user?.id) {
      console.log('No session found, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's unlocked achievements
    const unlockedAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' }
    });

    const unlockedIds = new Set(unlockedAchievements.map(a => a.achievementId));

    // Get user's brand progress data
    const brandProgress = await prisma.coneyLog.groupBy({
      by: ['brand'],
      where: { userId },
      _count: {
        id: true
      }
    });

    // Create a map of brand progress
    const brandProgressMap = new Map();
    brandProgress.forEach(item => {
      brandProgressMap.set(item.brand, {
        visits: item._count.id,
        coneys: item._count.id // For now, visits = coneys since each log is a visit
      });
    });

    // Return achievements with unlocked status and progress data
    const achievementsWithStatus = achievements.map(achievement => {
      const baseAchievement = {
        ...achievement,
        unlocked: unlockedIds.has(achievement.id),
        unlockedAt: unlockedIds.has(achievement.id) 
          ? unlockedAchievements.find(a => a.achievementId === achievement.id)?.unlockedAt
          : null
      };

      // Add progress data for brand achievements
      if (achievement.category.includes('-loyalty') || achievement.category.includes('-coneys')) {
        // Map category to actual brand names
        const brandMap: { [key: string]: string } = {
          'skyline-loyalty': 'Skyline Chili',
          'goldstar-loyalty': 'Gold Star Chili',
          'dixie-loyalty': 'Dixie Chili',
          'camp-washington-loyalty': 'Camp Washington Chili',
          'empress-loyalty': 'Empress Chili',
          'price-hill-loyalty': 'Price Hill Chili',
          'pleasant-ridge-loyalty': 'Pleasant Ridge Chili',
          'blue-ash-loyalty': 'Blue Ash Chili',
          'skyline-coneys': 'Skyline Chili',
          'goldstar-coneys': 'Gold Star Chili',
          'dixie-coneys': 'Dixie Chili',
          'camp-washington-coneys': 'Camp Washington Chili',
          'empress-coneys': 'Empress Chili',
          'price-hill-coneys': 'Price Hill Chili',
          'pleasant-ridge-coneys': 'Pleasant Ridge Chili',
          'blue-ash-coneys': 'Blue Ash Chili'
        };
        
        const brandName = brandMap[achievement.category];
        const progress = brandProgressMap.get(brandName) || { visits: 0, coneys: 0 };
        
        return {
          ...baseAchievement,
          progress: {
            visits: progress.visits,
            coneys: progress.coneys
          }
        };
      }

      return baseAchievement;
    });

    return NextResponse.json({
      achievements: achievementsWithStatus,
      unlockedCount: unlockedAchievements.length,
      totalCount: achievements.length
    });

  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { achievementId } = await request.json();

    if (!achievementId) {
      return NextResponse.json({ message: 'Achievement ID is required' }, { status: 400 });
    }

    const existingAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: session.user.id,
          achievementId: achievementId,
        },
      },
    });

    if (existingAchievement) {
      return NextResponse.json({ message: 'Achievement already unlocked' }, { status: 200 });
    }

    await prisma.userAchievement.create({
      data: {
        userId: session.user.id,
        achievementId: achievementId,
      },
    });

    return NextResponse.json({ message: 'Achievement unlocked successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}