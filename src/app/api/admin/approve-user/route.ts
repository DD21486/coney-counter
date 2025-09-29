import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { sendApprovalEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, approved } = await request.json();

    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid approval status' }, { status: 400 });
    }

    // Update user approval status
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: approved },
    });

    // Send approval email if user is being approved
    if (approved && user.email) {
      try {
        await sendApprovalEmail(user.email, user.name || 'User');
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the approval if email fails
      }
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user approval:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
