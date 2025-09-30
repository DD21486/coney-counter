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

    // Format recent attempts
    const formattedRecentAttempts = recentAttempts.map(attempt => ({
      id: attempt.id,
      timestamp: attempt.uploadedAt.toISOString(),
      isCorrect: attempt.isVerifiedCorrect!,
      coneyCount: attempt.coneyCount,
      confidence: attempt.confidence,
      isValidReceipt: attempt.isValidReceipt,
      warnings: attempt.warnings,
      user: attempt.user
    }));

    const analyticsData = {
      totalAttempts,
      successfulVerifications,
      failedVerifications,
      successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
      averageConfidence: Math.round(avgConfidence * 100) / 100,
      coneyCountDistribution: coneyDistribution,
      brandDistribution: {}, // We don't track brands in OCR yet
      recentAttempts: formattedRecentAttempts
    };

    return NextResponse.json(analyticsData);

  } catch (error: any) {
    console.error('Error fetching OCR analytics:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch OCR analytics' }, { status: 500 });
  }
}
