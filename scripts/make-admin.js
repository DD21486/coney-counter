import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndUpdateUserRole() {
  try {
    // Find your user (replace with your email)
    const user = await prisma.user.findFirst({
      where: {
        email: 'your-email@example.com' // Replace with your actual email
      }
    });

    if (!user) {
      console.log('User not found. Please check your email address.');
      return;
    }

    console.log('Current user:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isApproved: user.isApproved
    });

    if (user.role !== 'admin') {
      console.log('Updating user role to admin...');
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          role: 'admin',
          isApproved: true 
        }
      });
      console.log('✅ User role updated to admin!');
    } else {
      console.log('✅ User is already an admin!');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndUpdateUserRole();
