import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendNewSignupNotification } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Create new user (unapproved)
    const newUser = await prisma.user.create({
      data: {
        email,
        name: email.split('@')[0], // Use email prefix as name
        isApproved: false,
        role: 'user',
        isBanned: false,
      },
    });

    // Send notification email to admin
    try {
      await sendNewSignupNotification(email, email.split('@')[0]);
    } catch (emailError) {
      console.error('Failed to send signup notification email:', emailError);
      // Don't fail the signup if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully added to waitlist' 
    });

  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}