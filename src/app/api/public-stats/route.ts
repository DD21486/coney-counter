import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get total users
    const totalUsers = await prisma.user.count()
    
    // Get total coneys logged
    const totalConeysResult = await prisma.coneyLog.aggregate({
      _sum: {
        quantity: true
      }
    })
    const totalConeys = totalConeysResult._sum.quantity || 0
    
    // Get total logs
    const totalLogs = await prisma.coneyLog.count()
    
    // Get most popular brands this month (using UTC to avoid timezone issues)
    const now = new Date()
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))
    
    const brandStats = await prisma.coneyLog.groupBy({
      by: ['brand'],
      where: {
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        quantity: true
      },
      _count: {
        brand: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 3
    })
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentActivity = await prisma.coneyLog.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })
    
    // Get top users this month (for leaderboard preview)
    const topUsers = await prisma.coneyLog.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 3
    })
    
    // Get user names for top users
    const topUsersWithNames = await Promise.all(
      topUsers.map(async (user) => {
        const userData = await prisma.user.findUnique({
          where: { id: user.userId },
          select: { name: true, username: true, image: true, currentLevel: true }
        })
        return {
          ...user,
          name: userData?.username || userData?.name || 'Anonymous',
          image: userData?.image,
          currentLevel: userData?.currentLevel
        }
      })
    )

    return NextResponse.json({
      totalUsers,
      totalConeys,
      totalLogs,
      recentActivity,
      topBrands: brandStats.map(brand => ({
        name: brand.brand,
        totalConeys: brand._sum.quantity || 0,
        totalLogs: brand._count.brand
      })),
      topUsers: topUsersWithNames.map(user => ({
        name: user.name,
        image: user.image,
        totalConeys: user._sum.quantity || 0,
        currentLevel: user.currentLevel
      }))
    })

  } catch (error) {
    console.error('Error fetching public stats:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch public statistics' 
    }, { status: 500 })
  }
}
