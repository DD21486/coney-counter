import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send approval email
async function sendApprovalEmail(userEmail: string, userName: string) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '🎉 Welcome to Coney Counter Alpha!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #B22222; font-size: 28px; margin-bottom: 10px;">🎉 Welcome to Coney Counter!</h1>
            <p style="color: #666; font-size: 16px;">You've been approved to start crushing coneys!</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">What's Next?</h2>
            <p style="color: #555; line-height: 1.6;">
              Great news, ${userName || 'Coney Enthusiast'}! You've been approved to participate in the Coney Counter alpha. 
              You can now sign in and start tracking your coney adventures.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/auth/signin" 
               style="background-color: #B22222; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Sign In & Start Counting
            </a>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0; font-size: 16px;">🚀 Alpha Features</h3>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Log your coney adventures</li>
              <li>Track your stats and progress</li>
              <li>Compete on leaderboards</li>
              <li>Unlock achievements</li>
              <li>Discover your favorite spots</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Questions? Just reply to this email and we'll help you out!
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
              Happy coney crushing! 🌭
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
    return false;
  }
}

// Helper function to check admin access
async function checkAdminAccess(sessionEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { role: true, isApproved: true }
  });
  
  return user?.role === 'owner' || user?.role === 'admin';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin access
    const hasAccess = await checkAdminAccess(session.user.email);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { email, action, role } = await request.json();

    if (!email || !action) {
      return NextResponse.json({ error: 'Email and action required' }, { status: 400 });
    }

    // Check if trying to modify owner
    const targetUser = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    });

    if (targetUser?.role === 'owner' && (action === 'ban' || action === 'unapprove')) {
      return NextResponse.json({ error: 'Cannot ban or unapprove the owner' }, { status: 403 });
    }

    let updatedUser;
    let message;

    switch (action) {
      case 'approve':
        updatedUser = await prisma.user.update({
          where: { email },
          data: { 
            isApproved: true,
            approvedAt: new Date()
          },
          select: { 
            email: true, 
            name: true, 
            isApproved: true, 
            approvedAt: true,
            role: true,
            isBanned: true
          }
        });
        
        // Send approval email
        const emailSent = await sendApprovalEmail(updatedUser.email, updatedUser.name);
        message = emailSent 
          ? 'User approved successfully and notification email sent'
          : 'User approved successfully (email notification failed)';
        break;

      case 'unapprove':
        updatedUser = await prisma.user.update({
          where: { email },
          data: { 
            isApproved: false,
            approvedAt: null
          },
          select: { 
            email: true, 
            name: true, 
            isApproved: true, 
            approvedAt: true,
            role: true,
            isBanned: true
          }
        });
        message = 'User unapproved successfully';
        break;

      case 'ban':
        updatedUser = await prisma.user.update({
          where: { email },
          data: { 
            isBanned: true,
            bannedAt: new Date()
          },
          select: { 
            email: true, 
            name: true, 
            isApproved: true, 
            approvedAt: true,
            role: true,
            isBanned: true,
            bannedAt: true
          }
        });
        message = 'User banned successfully';
        break;

      case 'unban':
        updatedUser = await prisma.user.update({
          where: { email },
          data: { 
            isBanned: false,
            bannedAt: null
          },
          select: { 
            email: true, 
            name: true, 
            isApproved: true, 
            approvedAt: true,
            role: true,
            isBanned: true,
            bannedAt: true
          }
        });
        message = 'User unbanned successfully';
        break;

      case 'setRole':
        if (!role || !['user', 'admin'].includes(role)) {
          return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }
        
        // Only owners can set admin roles
        const currentUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { role: true }
        });
        
        if (role === 'admin' && currentUser?.role !== 'owner') {
          return NextResponse.json({ error: 'Only owners can set admin roles' }, { status: 403 });
        }

        updatedUser = await prisma.user.update({
          where: { email },
          data: { role },
          select: { 
            email: true, 
            name: true, 
            isApproved: true, 
            approvedAt: true,
            role: true,
            isBanned: true,
            bannedAt: true
          }
        });
        message = `User role set to ${role} successfully`;
        break;

      case 'delete':
        // Only owners can delete users
        const currentUserForDelete = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { role: true }
        });
        
        if (currentUserForDelete?.role !== 'owner') {
          return NextResponse.json({ error: 'Only owners can delete users' }, { status: 403 });
        }

        // Check if trying to delete owner
        if (targetUser?.role === 'owner') {
          return NextResponse.json({ error: 'Cannot delete the owner' }, { status: 403 });
        }

        // Delete user and all related data
        const userToDelete = await prisma.user.findUnique({
          where: { email },
          select: { id: true }
        });

        if (!userToDelete) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Delete related data first (due to foreign key constraints)
        await prisma.userAchievement.deleteMany({
          where: { userId: userToDelete.id }
        });
        
        await prisma.coneyLog.deleteMany({
          where: { userId: userToDelete.id }
        });
        
        await prisma.user.delete({
          where: { email }
        });
        
        message = 'User deleted successfully';
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin access
    const hasAccess = await checkAdminAccess(session.user.email);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Get all users with search functionality
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: search } },
          { name: { contains: search } },
          { username: { contains: search } }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        isApproved: true,
        role: true,
        isBanned: true,
        approvedAt: true,
        bannedAt: true,
        createdAt: true,
        currentLevel: true,
        totalXP: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ users });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}