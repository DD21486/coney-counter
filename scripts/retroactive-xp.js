import { PrismaClient } from '@prisma/client'
import { initializeXPForUser } from '../src/lib/xp-system'

const prisma = new PrismaClient()

async function retroactivelyAttributeXP() {
  try {
    console.log('🚀 Starting retroactive XP attribution for all users...')
    
    // Get all users
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        email: true,
        totalXP: true,
        currentLevel: true
      }
    })
    
    console.log(`📊 Found ${users.length} users to process`)
    
    let successCount = 0
    let errorCount = 0
    
    // Process each user
    for (const user of users) {
      try {
        console.log(`\n👤 Processing ${user.name || user.email}...`)
        console.log(`   Current XP: ${user.totalXP}, Level: ${user.currentLevel}`)
        
        // Initialize XP based on their existing coney logs and achievements
        await initializeXPForUser(user.id)
        
        // Get updated user data to show the change
        const updatedUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { totalXP: true, currentLevel: true, currentLevelXP: true, nextLevelXP: true }
        })
        
        if (updatedUser) {
          console.log(`   ✅ Updated XP: ${updatedUser.totalXP}, Level: ${updatedUser.currentLevel}`)
          console.log(`   📈 Progress: ${updatedUser.currentLevelXP}/${updatedUser.nextLevelXP} XP to next level`)
        }
        
        successCount++
        
      } catch (error) {
        console.error(`   ❌ Failed to process ${user.name || user.email}:`, error)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Retroactive XP attribution complete!`)
    console.log(`✅ Successfully processed: ${successCount} users`)
    console.log(`❌ Errors: ${errorCount} users`)
    
    // Show summary statistics
    const allUsers = await prisma.user.findMany({
      select: { totalXP: true, currentLevel: true }
    })
    
    const totalXP = allUsers.reduce((sum, user) => sum + user.totalXP, 0)
    const avgLevel = allUsers.reduce((sum, user) => sum + user.currentLevel, 0) / allUsers.length
    const maxLevel = Math.max(...allUsers.map(user => user.currentLevel))
    
    console.log(`\n📊 Summary Statistics:`)
    console.log(`   Total XP across all users: ${totalXP}`)
    console.log(`   Average level: ${avgLevel.toFixed(1)}`)
    console.log(`   Highest level: ${maxLevel}`)
    
  } catch (error) {
    console.error('💥 Error during retroactive XP attribution:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
retroactivelyAttributeXP()
