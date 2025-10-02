import { PrismaClient } from '@prisma/client'
import { initializeXPForUser } from './src/lib/xp-system'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting XP initialization for existing users...')
    
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    })
    
    console.log(`Found ${users.length} users to initialize`)
    
    // Initialize XP for each user
    for (const user of users) {
      try {
        await initializeXPForUser(user.id)
        console.log(`✅ Initialized XP for ${user.name || user.email}`)
      } catch (error) {
        console.error(`❌ Failed to initialize XP for ${user.name || user.email}:`, error)
      }
    }
    
    console.log('XP initialization complete!')
    
  } catch (error) {
    console.error('Error during XP initialization:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
