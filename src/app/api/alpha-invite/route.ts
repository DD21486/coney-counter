import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, isApproved: true }
    });

    if (existingUser) {
      if (existingUser.isApproved) {
        return NextResponse.json({ error: 'Email already approved for alpha access' }, { status: 400 });
      } else {
        return NextResponse.json({ error: 'Email already on waitlist' }, { status: 400 });
      }
    }

    // Create user record for waitlist (not approved yet)
    const newUser = await prisma.user.create({
      data: {
        email,
        name: email.split('@')[0], // Use email prefix as name
        isApproved: false,
        role: 'user',
        isBanned: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isApproved: true,
        createdAt: true,
      }
    });

    console.log(`Waitlist user created: ${email}`);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to you with the waitlist signup
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'daleyvisuals@gmail.com',
      subject: 'Coney Counter Waitlist Signup',
      html: `
        <h2>New Waitlist Signup</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Name:</strong> ${newUser.name}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Source:</strong> Coney Counter Landing Page</p>
        <p><strong>User ID:</strong> ${newUser.id}</p>
        <hr>
        <p><em>You can now approve this user in the admin panel at <a href="${process.env.NEXTAUTH_URL}/admin/users">${process.env.NEXTAUTH_URL}/admin/users</a></em></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Waitlist signup email sent for: ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending waitlist email:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
