import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'year';

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
      default:
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    // Get total counts
    const [totalConeys, totalUsers] = await Promise.all([
      prisma.coneyLog.count(),
      prisma.user.count()
    ]);

    // Generate chart data based on time range
    let chartData: Array<{ period: string; coneys: number; users: number }> = [];

    if (range === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

        const [coneysCount, usersCount] = await Promise.all([
          prisma.coneyLog.count({
            where: {
              createdAt: {
                gte: dayStart,
                lt: dayEnd
              }
            }
          }),
          prisma.user.count({
            where: {
              createdAt: {
                gte: dayStart,
                lt: dayEnd
              }
            }
          })
        ]);

        chartData.push({
          period: date.toLocaleDateString('en-US', { weekday: 'short' }),
          coneys: coneysCount,
          users: usersCount
        });
      }
    } else if (range === 'month') {
      // Last 30 days (grouped by week)
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);

        const [coneysCount, usersCount] = await Promise.all([
          prisma.coneyLog.count({
            where: {
              createdAt: {
                gte: weekStart,
                lt: weekEnd
              }
            }
          }),
          prisma.user.count({
            where: {
              createdAt: {
                gte: weekStart,
                lt: weekEnd
              }
            }
          })
        ]);

        chartData.push({
          period: `Week ${4 - i}`,
          coneys: coneysCount,
          users: usersCount
        });
      }
    } else {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

        const [coneysCount, usersCount] = await Promise.all([
          prisma.coneyLog.count({
            where: {
              createdAt: {
                gte: monthStart,
                lt: monthEnd
              }
            }
          }),
          prisma.user.count({
            where: {
              createdAt: {
                gte: monthStart,
                lt: monthEnd
              }
            }
          })
        ]);

        chartData.push({
          period: monthStart.toLocaleDateString('en-US', { month: 'short' }),
          coneys: coneysCount,
          users: usersCount
        });
      }
    }

    return NextResponse.json({
      totalConeys,
      totalUsers,
      chartData
    });

  } catch (error: any) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch analytics data' }, { status: 500 });
  }
}
