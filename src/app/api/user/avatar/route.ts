import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { avatarId } = await request.json();

    if (!avatarId) {
      return NextResponse.json({ error: 'Avatar ID is required' }, { status: 400 });
    }

    // Validate avatar ID
    const validAvatars = ['coneyyellow', 'coneyblue', 'coneygreen', 'coneyred'];
    if (!validAvatars.includes(avatarId)) {
      return NextResponse.json({ error: 'Invalid avatar ID' }, { status: 400 });
    }

    // Update user's selected avatar
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { selectedAvatar: avatarId },
      select: {
        id: true,
        email: true,
        username: true,
        selectedAvatar: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      selectedAvatar: updatedUser.selectedAvatar 
    });

  } catch (error) {
    console.error('Error updating avatar:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        selectedAvatar: true,
      },
    });

    return NextResponse.json({ 
      selectedAvatar: user?.selectedAvatar || 'coneyyellow' 
    });

  } catch (error) {
    console.error('Error fetching avatar:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
