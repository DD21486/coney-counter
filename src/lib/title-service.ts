import { PrismaClient } from '@prisma/client';
import { getAllTitles, checkTitleUnlock, getTitleById } from '@/lib/titles';

const prisma = new PrismaClient();

export async function checkAndUnlockTitles(userId: string): Promise<{
  newlyUnlockedTitles: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}> {
  try {
    // Get user's current stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentLevel: true,
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
      throw new Error('User not found');
    }

    // Get user's achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
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

    // Get currently unlocked titles
    const currentlyUnlockedTitleIds = user.userTitles.map(ut => ut.titleId);

    // Check all titles for new unlocks
    const allTitles = getAllTitles();
    const newlyUnlockedTitles = [];

    for (const title of allTitles) {
      // Skip if already unlocked
      if (currentlyUnlockedTitleIds.includes(title.id)) {
        continue;
      }

      // Check if newly unlocked
      if (checkTitleUnlock(title, userStats)) {
        // Add to user's unlocked titles
        await prisma.userTitle.create({
          data: {
            userId,
            titleId: title.id,
            titleName: title.name,
            titleType: title.unlockCondition.type
          }
        });

        newlyUnlockedTitles.push({
          id: title.id,
          name: title.name,
          description: title.description
        });
      }
    }

    return { newlyUnlockedTitles };

  } catch (error) {
    console.error('Error checking and unlocking titles:', error);
    throw error;
  }
}
