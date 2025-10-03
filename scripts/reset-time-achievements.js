import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetTimeBasedAchievements() {
  try {
    console.log('🔄 Resetting time-based achievements for all users...')
    
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    })
    
    console.log(`📊 Found ${users.length} users to process`)
    
    let successCount = 0
    let errorCount = 0
    
    // Time-based achievement IDs that need to be reset
    const timeBasedAchievements = [
      'early-bird',
      'night-owl', 
      'weekend-warrior',
      'coney-day-monday',
      'coney-day-tuesday',
      'coney-day-wednesday',
      'coney-day-thursday',
      'coney-day-friday',
      'coney-day-saturday',
      'coney-day-sunday'
    ]
    
    // Process each user
    for (const user of users) {
      try {
        console.log(`\n👤 Processing ${user.name || user.email}...`)
        
        // Delete existing time-based achievements
        const deleteResult = await prisma.userAchievement.deleteMany({
          where: {
            userId: user.id,
            achievementId: {
              in: timeBasedAchievements
            }
          }
        })
        
        console.log(`   🗑️ Deleted ${deleteResult.count} time-based achievements`)
        
        successCount++
        
      } catch (error) {
        console.error(`   ❌ Failed to process ${user.name || user.email}:`, error)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Time-based achievement reset complete!`)
    console.log(`✅ Successfully processed: ${successCount} users`)
    console.log(`❌ Errors: ${errorCount} users`)
    console.log(`\n📝 Next steps:`)
    console.log(`   1. The timezone fix has been applied to the achievement system`)
    console.log(`   2. Users will re-earn time-based achievements based on their local time`)
    console.log(`   3. Test by logging coneys at different times to verify correct behavior`)
    
  } catch (error) {
    console.error('💥 Error during time-based achievement reset:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
resetTimeBasedAchievements()
