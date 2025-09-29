import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { checkAndUnlockAchievements } from '@/lib/achievements'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { brand, quantity, location } = body

    // Validate input
    if (!brand || !quantity || quantity < 1 || quantity > 20) {
      return NextResponse.json({ 
        error: 'Invalid input. Brand is required and quantity must be between 1 and 20.' 
      }, { status: 400 })
    }

    // Prepare location data
    let locationString = null;
    if (location) {
      locationString = JSON.stringify(location);
    }

    // Save coney log to database
    const coneyLog = await prisma.coneyLog.create({
      data: {
        userId: session.user.id,
        brand,
        quantity: parseInt(quantity),
        location: locationString,
      },
    })

    // Check and unlock achievements
    const newlyUnlockedAchievements = await checkAndUnlockAchievements(session.user.id)

    return NextResponse.json({ 
      success: true, 
      coneyLog,
      newlyUnlockedAchievements,
      message: 'Coneys logged successfully!' 
    })

  } catch (error) {
    console.error('Error saving coney log:', error)
    return NextResponse.json({ 
      error: 'Failed to save coney log' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's coney logs
    const coneyLogs = await prisma.coneyLog.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Parse location data for each log
    const parsedLogs = coneyLogs.map(log => ({
      ...log,
      location: log.location ? JSON.parse(log.location) : null,
    }))

    // Calculate statistics
    const totalConeys = coneyLogs.reduce((sum, log) => sum + log.quantity, 0)
    const brandsTried = new Set(coneyLogs.map(log => log.brand)).size
    
    // Get this month's coneys (using Eastern timezone)
    const now = new Date()
    
    // Convert to Eastern timezone (handles both EST and EDT automatically)
    const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
    
    const thisMonth = new Date(easternTime.getFullYear(), easternTime.getMonth(), 1)
    thisMonth.setHours(0, 0, 0, 0)
    
    const thisMonthConeys = coneyLogs
      .filter(log => {
        // Convert log date to Eastern timezone for comparison
        const logDate = new Date(log.createdAt)
        const logEasternTime = new Date(logDate.toLocaleString("en-US", {timeZone: "America/New_York"}))
        return logEasternTime >= thisMonth
      })
      .reduce((sum, log) => sum + log.quantity, 0)

    // Get brand breakdown
    const brandBreakdown = coneyLogs.reduce((acc, log) => {
      acc[log.brand] = (acc[log.brand] || 0) + log.quantity
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      coneyLogs: parsedLogs,
      statistics: {
        totalConeys,
        thisMonthConeys,
        brandsTried,
        brandBreakdown,
      }
    })

  } catch (error) {
    console.error('Error fetching coney logs:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch coney logs' 
    }, { status: 500 })
  }
}
