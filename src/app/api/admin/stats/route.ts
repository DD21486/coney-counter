import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.role === 'admin';

    // Get user statistics
    const totalUsers = await prisma.user.count();
    const approvedUsers = await prisma.user.count({
      where: { isApproved: true }
    });
    const pendingUsers = await prisma.user.count({
      where: { isApproved: false }
    });

    // Get coney log statistics
    const totalConeys = await prisma.coneyLog.aggregate({
      _sum: { quantity: true }
    });

    // Get OCR statistics
    const totalOcrAttempts = await prisma.trainingImage.count();
    const successfulOcrAttempts = await prisma.trainingImage.count({
      where: { 
        coneyCount: { not: null },
        confidence: { gte: 0.7 }
      }
    });

    const ocrSuccessRate = totalOcrAttempts > 0 
      ? (successfulOcrAttempts / totalOcrAttempts) * 100 
      : 0;

    return NextResponse.json({
      users: {
        total: totalUsers,
        approved: approvedUsers,
        pending: pendingUsers
      },
      coneys: {
        total: totalConeys._sum.quantity || 0
      },
      ocr: {
        totalAttempts: totalOcrAttempts,
        successfulAttempts: successfulOcrAttempts,
        successRate: Math.round(ocrSuccessRate * 10) / 10 // Round to 1 decimal place
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch admin stats' }, { status: 500 });
  }
}
