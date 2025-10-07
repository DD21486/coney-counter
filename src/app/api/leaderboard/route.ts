import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all-time'
    const brand = searchParams.get('brand') || 'all-brands'
    
    console.log('Leaderboard API - Filter:', filter, 'Brand:', brand)

    // Build where clause based on filters
    const whereClause: Record<string, any> = {}
    
    if (filter === 'this-month') {
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)
      whereClause.createdAt = {
        gte: thisMonth
      }
    } else if (filter === 'last-30-days') {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      whereClause.createdAt = {
        gte: thirtyDaysAgo
      }
    } else if (filter === 'this-year') {
      const thisYear = new Date()
      thisYear.setMonth(0, 1)
      thisYear.setHours(0, 0, 0, 0)
      whereClause.createdAt = {
        gte: thisYear
      }
    }

    if (brand !== 'all-brands') {
      // Map frontend brand values to database values
      const brandMapping: Record<string, string> = {
        'skyline': 'Skyline Chili',
        'gold-star': 'Gold Star Chili', 
        'dixie': 'Dixie Chili',
        'camp-washington': 'Camp Washington Chili',
        'empress': 'Empress Chili',
        'price-hill': 'Price Hill Chili',
        'pleasant-ridge': 'Pleasant Ridge Chili',
        'blue-ash': 'Blue Ash Chili',
        'other': 'Other'
      }
      
      const mappedBrand = brandMapping[brand] || brand
      whereClause.brand = mappedBrand
      console.log('Brand filtering - Original:', brand, 'Mapped:', mappedBrand)
    }

    console.log('Where clause:', whereClause)

    // Get all coney logs with user information, excluding owner account
    const coneyLogs = await prisma.coneyLog.findMany({
      where: {
        ...whereClause,
        user: {
          email: {
            not: 'daleyvisuals@gmail.com' // Exclude owner account
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            username: true,
            currentLevel: true,
            totalXP: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Aggregate data by user
    const userStats = coneyLogs.reduce((acc, log) => {
      const userId = log.userId
      if (!acc[userId]) {
        acc[userId] = {
          user: log.user,
          totalConeys: 0,
          thisMonth: 0,
          brandsTried: new Set(),
          favoriteBrand: '',
          brandCounts: {},
        }
      }
      
      acc[userId].totalConeys += log.quantity
      acc[userId].brandsTried.add(log.brand)
      acc[userId].brandCounts[log.brand] = (acc[userId].brandCounts[log.brand] || 0) + log.quantity
      
      // Calculate this month's coneys
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)
      if (log.createdAt >= thisMonth) {
        acc[userId].thisMonth += log.quantity
      }
      
      return acc
    }, {} as Record<string, { user: any; totalConeys: number; thisMonth: number; brandCounts: Record<string, number> }>)

    // Find favorite brand for each user and convert to array
    const leaderboard = Object.values(userStats).map((user) => {
      // Find favorite brand (most consumed)
      const favoriteBrand = Object.entries(user.brandCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'Unknown'
      
      return {
        userId: user.user.id,
        name: user.user.username || user.user.name || 'Anonymous',
        email: user.user.email,
        image: user.user.image,
        totalConeys: user.totalConeys,
        thisMonth: user.thisMonth,
        brandsTried: user.brandsTried.size,
        favoriteBrand,
        currentLevel: user.user.currentLevel,
        totalXP: user.user.totalXP,
      }
    })

    // Sort by total coneys and add rank
    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.totalConeys - a.totalConeys)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
        rankBadge: getRankBadge(index + 1),
        rankColor: getRankColor(index + 1),
      }))

    return NextResponse.json({
      leaderboard: sortedLeaderboard,
      totalPlayers: sortedLeaderboard.length,
    })

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch leaderboard' 
    }, { status: 500 })
  }
}

function getRankBadge(rank: number): string {
  if (rank === 1) return 'Coney Legend'
  if (rank === 2) return 'Coney Master'
  if (rank === 3) return 'Coney Expert'
  if (rank <= 10) return 'Coney Enthusiast'
  if (rank <= 50) return 'Coney Fan'
  return 'Coney Newbie'
}

function getRankColor(rank: number): string {
  if (rank === 1) return '#FFD700'
  if (rank === 2) return '#C0C0C0'
  if (rank === 3) return '#CD7F32'
  if (rank <= 10) return 'blue'
  if (rank <= 50) return 'green'
  return 'cyan'
}
