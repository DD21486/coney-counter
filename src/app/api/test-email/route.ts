import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    console.log('Test email API called via GET');
    
    // Check environment variables
    const envCheck = {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
    };
    
    console.log('Environment variables check:', envCheck);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ 
        error: 'Email environment variables not configured',
        envCheck 
      }, { status: 500 });
    }
    
    // Send test email
    await sendEmail(
      process.env.ADMIN_EMAIL || 'daleyvisuals@gmail.com',
      'Test Email from Coney Counter',
      '<h2>Test Email</h2><p>This is a test email to verify email configuration.</p>'
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      envCheck 
    });
    
  } catch (error) {
    console.error('Test email failed:', error);
    return NextResponse.json({ 
      error: 'Test email failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
