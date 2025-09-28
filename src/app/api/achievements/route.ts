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

    // Return achievements with unlocked status
    const achievementsWithStatus = achievements.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.has(achievement.id),
      unlockedAt: unlockedIds.has(achievement.id) 
        ? unlockedAchievements.find(a => a.achievementId === achievement.id)?.unlockedAt
        : null
    }));

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