import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { del } from '@vercel/blob';

const prisma = new PrismaClient();

// GET - List all training images with user info
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');

    const where = userId ? { userId } : {};

    const [images, totalCount, userStats] = await Promise.all([
      prisma.trainingImage.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.trainingImage.count({ where }),
      // Get user stats separately since groupBy doesn't support include
      prisma.trainingImage.groupBy({
        by: ['userId'],
        _count: { id: true },
        _sum: { fileSize: true }
      })
    ]);

    // Get user info for stats
    const userIds = userStats.map(stat => stat.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        email: true,
        username: true
      }
    });

    const userStatsWithInfo = userStats.map(stat => ({
      userId: stat.userId,
      uploadCount: stat._count.id,
      totalSize: stat._sum.fileSize || 0,
      user: users.find(user => user.id === stat.userId) || null
    }));

    return NextResponse.json({
      images,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      userStats: userStatsWithInfo
    });

  } catch (error: any) {
    console.error('Error fetching training images:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch training images' }, { status: 500 });
  }
}

// DELETE - Delete specific training image
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    // Get image record
    const image = await prisma.trainingImage.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete from Vercel Blob
    try {
      await del(image.blobKey);
    } catch (blobError) {
      console.warn('Failed to delete blob:', blobError);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await prisma.trainingImage.delete({
      where: { id: imageId }
    });

    return NextResponse.json({ message: 'Image deleted successfully' });

  } catch (error: any) {
    console.error('Error deleting training image:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete training image' }, { status: 500 });
  }
}

// POST - Bulk delete images
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, imageIds } = await request.json();

    if (action === 'bulk-delete' && Array.isArray(imageIds)) {
      const deletedCount = await prisma.trainingImage.deleteMany({
        where: {
          id: { in: imageIds }
        }
      });

      return NextResponse.json({ 
        message: `${deletedCount.count} images deleted successfully` 
      });
    }

    if (action === 'export-data') {
      // Export all training data as JSON
      const images = await prisma.trainingImage.findMany({
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
        orderBy: { uploadedAt: 'desc' }
      });

      const exportData = {
        exportedAt: new Date().toISOString(),
        totalImages: images.length,
        images: images.map(img => ({
          id: img.id,
          filename: img.filename,
          blobUrl: img.blobUrl,
          coneyCount: img.coneyCount,
          date: img.date,
          confidence: img.confidence,
          isValidReceipt: img.isValidReceipt,
          warnings: img.warnings,
          fileSize: img.fileSize,
          fileType: img.fileType,
          uploadedAt: img.uploadedAt,
          user: {
            id: img.user.id,
            name: img.user.name,
            email: img.user.email,
            username: img.user.username
          }
        }))
      };

      return NextResponse.json(exportData);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Error processing bulk action:', error);
    return NextResponse.json({ error: error.message || 'Failed to process action' }, { status: 500 });
  }
}
