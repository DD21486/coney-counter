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
    const userId = searchParams.get('userId');
    const brand = searchParams.get('brand');
    const method = searchParams.get('method');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const searchTerm = searchParams.get('searchTerm');

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Build where clause
    const whereClause: any = {};
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (brand) {
      whereClause.brand = brand;
    }
    
    if (method) {
      if (method === 'receipt') {
        whereClause.method = 'receipt';
      } else if (method === 'manual') {
        whereClause.method = 'manual';
      }
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(`${endDate}T23:59:59.999Z`)
      };
    }

    if (searchTerm) {
      whereClause.OR = [
        { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { user: { email: { contains: searchTerm, mode: 'insensitive' } } },
        { location: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    // Get total count with filters
    const totalCount = await prisma.coneyLog.count({
      where: whereClause
    });

    // Get coney logs with user information and filters
    const logs = await prisma.coneyLog.findMany({
      skip,
      take: pageSize,
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            currentLevel: true,
          },
        },
      },
    });

    // Transform data for the frontend
    const entries = logs.map(log => ({
      id: log.id,
      userId: log.userId,
      userName: log.user.username || log.user.name || 'Unknown', // Use username, fallback to name
      userLevel: log.user.currentLevel || 1, // Include user level
      userEmail: log.user.email || '',
      createdAt: log.createdAt.toISOString(),
      quantity: log.quantity,
      brand: log.brand,
      isReceiptScanned: log.method === 'receipt', // Boolean indicating if receipt was scanned
      method: log.method,
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
