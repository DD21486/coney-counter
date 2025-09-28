import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Validate username format
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: 'Username must be 3-20 characters long' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: 'Username can only contain letters, numbers, and underscores' }, { status: 400 });
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    // Update user (for onboarding - no 7-day restriction)
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error setting username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Validate username format
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: 'Username must be 3-20 characters long' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: 'Username can only contain letters, numbers, and underscores' }, { status: 400 });
    }

    // Get current user to check last username change
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true, updatedAt: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    // Check if user is trying to change username (not setting it for the first time)
    if (currentUser.username && currentUser.username !== username) {
      const lastChange = new Date(currentUser.updatedAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      if (lastChange > sevenDaysAgo) {
        const daysLeft = Math.ceil((lastChange.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24));
        return NextResponse.json({ 
          error: `You can only change your username once every 7 days. You can change it again in ${daysLeft} day${daysLeft === 1 ? '' : 's'}.` 
        }, { status: 400 });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
