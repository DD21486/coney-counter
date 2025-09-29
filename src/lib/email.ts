import nodemailer from 'nodemailer';

function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration missing');
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendNewSignupNotification(userEmail: string, userName: string) {
  const subject = 'New Coney Counter Signup';
  const html = `
    <h2>New User Signup</h2>
    <p><strong>Email:</strong> ${userEmail}</p>
    <p><strong>Name:</strong> ${userName}</p>
    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    <p>Visit the admin panel to approve this user.</p>
  `;

  await sendEmail(process.env.ADMIN_EMAIL!, subject, html);
}

export async function sendApprovalEmail(userEmail: string, userName: string) {
  const subject = 'Welcome to Coney Counter!';
  const html = `
    <h2>Welcome to Coney Counter!</h2>
    <p>Hi ${userName},</p>
    <p>Great news! You've been approved to join Coney Counter.</p>
    <p>You can now sign in and start logging your coneys!</p>
    <p><a href="${process.env.NEXTAUTH_URL}/auth/signin" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sign In Now</a></p>
    <p>Happy counting!</p>
  `;

  await sendEmail(userEmail, subject, html);
}
