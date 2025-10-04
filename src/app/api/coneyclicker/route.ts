import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get or create user's clicker progress
    let progress = await prisma.clickerProgress.findUnique({
      where: { userId: session.user.id }
    });

    // If no progress exists, create new record
    if (!progress) {
      progress = await prisma.clickerProgress.create({
        data: {
          userId: session.user.id,
          totalClicks: 0,
          totalMoney: 0,
          currentMoney: 0,
          autoClickers: 0,
          clickMultiplier: 1,
          upgrades: []
        }
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching clicker progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { clicks, money, autoClickers, clickMultiplier, upgrades } = body;

    // Update user's clicker progress
    const progress = await prisma.clickerProgress.upsert({
      where: { userId: session.user.id },
      update: {
        totalClicks: clicks || undefined,
        totalMoney: money !== undefined ? money : undefined,
        currentMoney: money !== undefined ? money : undefined,
        autoClickers: autoClickers || undefined,
        clickMultiplier: clickMultiplier || undefined,
        upgrades: upgrades || undefined,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        totalClicks: clicks || 0,
        totalMoney: money || 0,
        currentMoney: money || 0,
        autoClickers: autoClickers || 0,
        clickMultiplier: clickMultiplier || 1,
        upgrades: upgrades || []
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating clicker progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
