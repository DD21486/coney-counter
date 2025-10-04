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
          baseClickPower: 1,
          generators: {},
          multipliers: {},
          specialUpgrades: [],
          baseClickPurchases: {},
          totalCPS: 0
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
    const { clicks, money, baseClickPower, generators, multipliers, specialUpgrades, baseClickPurchases, totalCPS } = body;

    // Update user's clicker progress
    const progress = await prisma.clickerProgress.upsert({
      where: { userId: session.user.id },
      update: {
        totalClicks: clicks || undefined,
        totalMoney: money !== undefined ? money : undefined,
        currentMoney: money !== undefined ? money : undefined,
        baseClickPower: baseClickPower !== undefined ? baseClickPower : undefined,
        generators: generators !== undefined ? generators : undefined,
        multipliers: multipliers !== undefined ? multipliers : undefined,
        specialUpgrades: specialUpgrades !== undefined ? specialUpgrades : undefined,
        baseClickPurchases: baseClickPurchases !== undefined ? baseClickPurchases : undefined,
        totalCPS: totalCPS !== undefined ? totalCPS : undefined,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        totalClicks: clicks || 0,
        totalMoney: money || 0,
        currentMoney: money || 0,
        baseClickPower: baseClickPower || 1,
        generators: generators || {},
        multipliers: multipliers || {},
        specialUpgrades: specialUpgrades || [],
        baseClickPurchases: baseClickPurchases || {},
        totalCPS: totalCPS || 0
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating clicker progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
