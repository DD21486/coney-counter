import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { getAllTitles, getTitleById, checkTitleUnlock } from '@/lib/titles';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's current stats
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        currentLevel: true,
        totalXP: true,
        selectedTitle: true,
        coneyLogs: {
          select: {
            brand: true,
            location: true,
            quantity: true
          }
        },
        userTitles: {
          select: {
            titleId: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      select: { achievementId: true }
    });

    const achievementIds = achievements.map(a => a.achievementId);

    // Calculate stats
    const brandsVisited = new Set(user.coneyLogs.map(log => log.brand)).size;
    const locationsVisited = new Set(
      user.coneyLogs
        .filter(log => log.location)
        .map(log => log.location)
    ).size;

    const userStats = {
      level: user.currentLevel,
      achievements: achievementIds,
      totalConeys: user.coneyLogs.reduce((sum, log) => sum + log.quantity, 0),
      brandsVisited,
      locationsVisited
    };

    // Get all titles and check which are unlocked
    const allTitles = getAllTitles();
    const unlockedTitles = allTitles.filter(title => 
      checkTitleUnlock(title, userStats)
    );

    // Get current selected title
    const selectedTitle = user.selectedTitle ? getTitleById(user.selectedTitle) : null;

    return NextResponse.json({
      unlockedTitles,
      selectedTitle,
      allTitles: allTitles.map(title => ({
        ...title,
        unlocked: checkTitleUnlock(title, userStats)
      }))
    });

  } catch (error) {
    console.error('Error fetching titles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { titleId } = await request.json();

    if (!titleId) {
      return NextResponse.json({ error: 'Title ID is required' }, { status: 400 });
    }

    // Verify the title exists
    const title = getTitleById(titleId);
    if (!title) {
      return NextResponse.json({ error: 'Title not found' }, { status: 404 });
    }

    // Get user's current stats to verify they have unlocked this title
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        currentLevel: true,
        coneyLogs: {
          select: {
            brand: true,
            location: true,
            quantity: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      select: { achievementId: true }
    });

    const achievementIds = achievements.map(a => a.achievementId);

    // Calculate stats
    const brandsVisited = new Set(user.coneyLogs.map(log => log.brand)).size;
    const locationsVisited = new Set(
      user.coneyLogs
        .filter(log => log.location)
        .map(log => log.location)
    ).size;

    const userStats = {
      level: user.currentLevel,
      achievements: achievementIds,
      totalConeys: user.coneyLogs.reduce((sum, log) => sum + log.quantity, 0),
      brandsVisited,
      locationsVisited
    };

    // Check if user has unlocked this title
    if (!checkTitleUnlock(title, userStats)) {
      return NextResponse.json({ error: 'Title not unlocked' }, { status: 403 });
    }

    // Update user's selected title
    await prisma.user.update({
      where: { id: session.user.id },
      data: { selectedTitle: titleId }
    });

    return NextResponse.json({ 
      success: true, 
      selectedTitle: title 
    });

  } catch (error) {
    console.error('Error updating title:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
