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

    // For now, return mock data since we don't have OCR verification tracking yet
    const mockData = {
      totalAttempts: 0,
      successfulVerifications: 0,
      failedVerifications: 0,
      successRate: 0,
      averageConfidence: 0,
      coneyCountDistribution: {},
      brandDistribution: {},
      recentAttempts: []
    };

    return NextResponse.json(mockData);

  } catch (error: any) {
    console.error('Error fetching OCR analytics:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch OCR analytics' }, { status: 500 });
  }
}
