import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get OCR analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get real OCR analytics data from training images
    const [
      totalAttempts,
      successfulVerifications,
      failedVerifications,
      averageConfidence,
      coneyCountDistribution,
      brandDistribution,
      userStats,
      recentAttempts
    ] = await Promise.all([
      // Total attempts (images with verification)
      prisma.trainingImage.count({
        where: {
          isVerifiedCorrect: { not: null }
        }
      }),
      // Successful verifications
      prisma.trainingImage.count({
        where: {
          isVerifiedCorrect: true
        }
      }),
      // Failed verifications
      prisma.trainingImage.count({
        where: {
          isVerifiedCorrect: false
        }
      }),
      // Average confidence
      prisma.trainingImage.aggregate({
        where: {
          isVerifiedCorrect: { not: null }
        },
        _avg: {
          confidence: true
        }
      }),
      // Coney count distribution
      prisma.trainingImage.groupBy({
        by: ['coneyCount'],
        where: {
          isVerifiedCorrect: { not: null },
          coneyCount: { not: null }
        },
        _count: { id: true }
      }),
      // Brand distribution
      prisma.trainingImage.groupBy({
        by: ['brand'],
        where: {
          isVerifiedCorrect: { not: null },
          brand: { not: null }
        },
        _count: { id: true }
      }),
      // User statistics
      prisma.trainingImage.groupBy({
        by: ['userId'],
        where: {
          isVerifiedCorrect: { not: null }
        },
        _count: { id: true },
        _sum: { 
          coneyCount: true 
        }
      }),
      // Recent attempts
      prisma.trainingImage.findMany({
        where: {
          isVerifiedCorrect: { not: null }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true
            }
          }
        },
        orderBy: { uploadedAt: 'desc' },
        take: 10
      })
    ]);

    const successRate = totalAttempts > 0 ? (successfulVerifications / totalAttempts) * 100 : 0;
    const avgConfidence = averageConfidence._avg.confidence || 0;


    // Format coney count distribution
    const coneyDistribution: { [key: number]: number } = {};
    coneyCountDistribution.forEach(item => {
      if (item.coneyCount) {
        coneyDistribution[item.coneyCount] = item._count.id;
      }
    });

    // Format brand distribution
    const brandDist: { [key: string]: number } = {};
    brandDistribution.forEach(item => {
      if (item.brand) {
        brandDist[item.brand] = item._count.id;
      }
    });

    // Format user statistics - get user details for each user
    const userIds = userStats.map(stat => stat.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, username: true }
    });
    
    const userMap = new Map(users.map(user => [user.id, user]));
    const formattedUserStats = userStats.map(stat => ({
      userId: stat.userId,
      user: userMap.get(stat.userId),
      totalAttempts: stat._count.id,
      totalConeys: stat._sum.coneyCount || 0
    })).sort((a, b) => b.totalAttempts - a.totalAttempts);


    // Format recent attempts
    const formattedRecentAttempts = recentAttempts.map(attempt => ({
      id: attempt.id,
      timestamp: attempt.uploadedAt.toISOString(),
      isCorrect: attempt.isVerifiedCorrect!,
      coneyCount: attempt.coneyCount,
      confidence: attempt.confidence,
      isValidReceipt: attempt.isValidReceipt,
      warnings: attempt.warnings,
      user: attempt.user,
      brand: attempt.brand,
      location: attempt.location
    }));

    const analyticsData = {
      totalAttempts,
      successfulVerifications,
      failedVerifications,
      successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
      averageConfidence: Math.round(avgConfidence * 100) / 100,
      coneyCountDistribution: coneyDistribution,
      brandDistribution: brandDist,
      userStats: formattedUserStats,
      recentAttempts: formattedRecentAttempts
    };

    return NextResponse.json(analyticsData);

  } catch (error: any) {
    console.error('Error fetching OCR analytics:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch OCR analytics' }, { status: 500 });
  }
}
