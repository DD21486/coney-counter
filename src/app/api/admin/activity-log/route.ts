import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin or owner
    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'owner')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Get total count
    const totalCount = await prisma.coneyLog.count();

    // Get coney logs with user information
    const logs = await prisma.coneyLog.findMany({
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Transform data for the frontend
    const entries = logs.map(log => ({
      id: log.id,
      userId: log.userId,
      userName: log.user.name || 'Anonymous',
      userEmail: log.user.email || '',
      createdAt: log.createdAt.toISOString(),
      quantity: log.quantity,
      brand: log.brand,
      isReceiptScanned: !!log.receiptImageUrl, // Boolean indicating if receipt was scanned
      receiptImageUrl: log.receiptImageUrl,
      location: log.location,
    }));

    return NextResponse.json({
      entries,
      total: totalCount,
      pagination: {
        page,
        pageSize,
        total: totalCount,
      },
    });

  } catch (error) {
    console.error('Error fetching activity log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
