import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's XP and level data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        totalXP: true,
        currentLevel: true,
        currentLevelXP: true,
        nextLevelXP: true,
        selectedTitle: true,
        name: true,
        email: true,
        username: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      totalXP: user.totalXP,
      currentLevel: user.currentLevel,
      currentLevelXP: user.currentLevelXP,
      nextLevelXP: user.nextLevelXP,
      selectedTitle: user.selectedTitle,
      name: user.name,
      email: user.email,
      username: user.username,
      memberSince: user.createdAt
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch user profile' 
    }, { status: 500 })
  }
}
