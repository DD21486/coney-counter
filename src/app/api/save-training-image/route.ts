import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Upload limits per user
const UPLOAD_LIMITS = {
  daily: 10,    // 10 images per day
  weekly: 50,   // 50 images per week
  monthly: 200  // 200 images per month
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const coneyCount = formData.get('coneyCount') as string;
    const date = formData.get('date') as string;
    const isCorrect = formData.get('isCorrect') as string;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Only save if user confirmed the data is correct
    if (isCorrect !== 'true') {
      return NextResponse.json({ message: 'Image not saved - user indicated incorrect data' }, { status: 200 });
    }

    // Check upload limits
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [dailyCount, weeklyCount, monthlyCount] = await Promise.all([
      prisma.trainingImage.count({
        where: {
          userId: session.user.id,
          uploadedAt: { gte: today }
        }
      }),
      prisma.trainingImage.count({
        where: {
          userId: session.user.id,
          uploadedAt: { gte: weekAgo }
        }
      }),
      prisma.trainingImage.count({
        where: {
          userId: session.user.id,
          uploadedAt: { gte: monthAgo }
        }
      })
    ]);

    // Check limits
    if (dailyCount >= UPLOAD_LIMITS.daily) {
      return NextResponse.json({ 
        error: `Daily upload limit reached (${UPLOAD_LIMITS.daily} images). Try again tomorrow.` 
      }, { status: 429 });
    }
    if (weeklyCount >= UPLOAD_LIMITS.weekly) {
      return NextResponse.json({ 
        error: `Weekly upload limit reached (${UPLOAD_LIMITS.weekly} images). Try again next week.` 
      }, { status: 429 });
    }
    if (monthlyCount >= UPLOAD_LIMITS.monthly) {
      return NextResponse.json({ 
        error: `Monthly upload limit reached (${UPLOAD_LIMITS.monthly} images). Try again next month.` 
      }, { status: 429 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate filename with timestamp and metadata
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `receipt-${timestamp}-${coneyCount}coneys-${date || 'nodate'}.jpg`;

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.type,
    });

    // Save metadata to database
    const trainingImage = await prisma.trainingImage.create({
      data: {
        userId: session.user.id,
        filename: file.name,
        blobUrl: blob.url,
        blobKey: blob.pathname,
        coneyCount: coneyCount ? parseInt(coneyCount) : null,
        date: date || null,
        confidence: 0.8, // Default confidence, could be passed from frontend
        fileSize: file.size,
        fileType: file.type,
      }
    });

    console.log('Training image saved:', {
      id: trainingImage.id,
      userId: session.user.id,
      filename: trainingImage.filename,
      blobUrl: blob.url,
      coneyCount: trainingImage.coneyCount,
      fileSize: file.size
    });

    return NextResponse.json({ 
      message: 'Training image saved successfully',
      imageId: trainingImage.id,
      blobUrl: blob.url,
      limits: {
        daily: UPLOAD_LIMITS.daily - dailyCount - 1,
        weekly: UPLOAD_LIMITS.weekly - weeklyCount - 1,
        monthly: UPLOAD_LIMITS.monthly - monthlyCount - 1
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving training image:', error);
    return NextResponse.json({ error: error.message || 'Failed to save training image' }, { status: 500 });
  }
}
