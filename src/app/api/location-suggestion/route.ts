import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { suggestion, brand } = await request.json();

    if (!suggestion || !suggestion.trim()) {
      return NextResponse.json({ error: 'Suggestion is required' }, { status: 400 });
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
        process.env.EMAIL_USER === 'your-gmail@gmail.com' || 
        process.env.EMAIL_PASS === 'your-app-password') {
      console.log('Email credentials not configured properly');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // Create transporter (you'll need to configure this with your email service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'daleyvisuals@gmail.com',
      subject: `New Location Suggestion for Coney Counter - ${brand}`,
      html: `
        <h2>New Location Suggestion</h2>
        <p><strong>Brand:</strong> ${brand}</p>
        <p><strong>Suggestion:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${suggestion.replace(/\n/g, '<br>')}
        </div>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p><em>This suggestion was submitted through the Coney Counter app.</em></p>
      `,
    };

    // Send email
    console.log('Attempting to send email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending location suggestion:', error);
    return NextResponse.json({ error: 'Failed to send suggestion' }, { status: 500 });
  }
}
