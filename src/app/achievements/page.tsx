'use client'

import { useState, useEffect } from 'react'
import { Row, Col, Typography, Progress, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import AchievementCard from '@/components/AchievementCard'

const { Title, Text } = Typography

interface Achievement {
  id: string
  title: string
  description: string
  category: string
  requirement: number
  icon: string
  unlocked: boolean
  unlockedAt?: string | null
  progress?: {
    visits: number
    coneys: number
  }
}

export default function AchievementsPage() {
  const { data: session } = useSession()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setAchievements(data.achievements || [])
        }
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const lockedCount = achievements.filter(a => !a.unlocked).length
  const totalCount = achievements.length
  const progressPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

  // Group achievements by category
  const categoryOrder = [
    'total-coneys',
    'brand-diversity', 
    'streak',
    'time-based',
    'pattern',
    'creative',
    'location',
    'skyline',
    'goldstar',
    'dixie',
    'camp-washington',
    'empress',
    'price-hill',
    'pleasant-ridge',
    'blue-ash'
  ]

  const categoryTitles: { [key: string]: string } = {
    'total-coneys': 'Total Coneys',
    'brand-diversity': 'Brand Diversity',
    'streak': 'Streaks',
    'time-based': 'Time Based',
    'location': 'Location',
    'pattern': 'Patterns',
    'creative': 'Challenges',
    'skyline': 'Skyline Chili',
    'goldstar': 'Gold Star Chili',
    'dixie': 'Dixie Chili',
    'camp-washington': 'Camp Washington Chili',
    'empress': 'Empress Chili',
    'price-hill': 'Price Hill Chili',
    'pleasant-ridge': 'Pleasant Ridge Chili',
    'blue-ash': 'Blue Ash Chili'
  }

  const getCategoryAchievements = (category: string) => {
    return achievements.filter(achievement => {
      if (category === 'skyline') {
        return achievement.category === 'skyline-loyalty' || achievement.category === 'skyline-coneys'
      } else if (category === 'goldstar') {
        return achievement.category === 'goldstar-loyalty' || achievement.category === 'goldstar-coneys'
      } else if (category === 'dixie') {
        return achievement.category === 'dixie-loyalty' || achievement.category === 'dixie-coneys'
      } else if (category === 'camp-washington') {
        return achievement.category === 'camp-washington-loyalty' || achievement.category === 'camp-washington-coneys'
      } else if (category === 'empress') {
        return achievement.category === 'empress-loyalty' || achievement.category === 'empress-coneys'
      } else if (category === 'price-hill') {
        return achievement.category === 'price-hill-loyalty' || achievement.category === 'price-hill-coneys'
      } else if (category === 'pleasant-ridge') {
        return achievement.category === 'pleasant-ridge-loyalty' || achievement.category === 'pleasant-ridge-coneys'
      } else if (category === 'blue-ash') {
        return achievement.category === 'blue-ash-loyalty' || achievement.category === 'blue-ash-coneys'
      }
      return achievement.category === category
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading achievements...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="relative mb-8">
          <Link href="/dashboard">
            <Button icon={<ArrowLeftOutlined />} type="text" size="large" className="absolute left-0">
              Back
            </Button>
          </Link>
          <div className="text-center">
            <Title level={2} className="!mb-0">Achievements</Title>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div 
              className="text-6xl font-black mb-2"
              style={{ 
                fontFamily: 'Satoshi, sans-serif',
                background: 'linear-gradient(135deg, #1C3FAA 0%, #3B82F6 50%, #1E40AF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {unlockedCount} / {totalCount}
            </div>
          </div>
          <div className="flex justify-center">
            <Progress 
              percent={Math.round(progressPercent)} 
              strokeColor={{
                '0%': '#1C3FAA',
                '100%': '#10B981',
              }}
              className="w-1/3"
              showInfo={false}
            />
          </div>
        </div>

        {/* Achievement Categories */}
        <div className="space-y-8">
          {categoryOrder.map(category => {
            const categoryAchievements = getCategoryAchievements(category)
            if (categoryAchievements.length === 0) return null

            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-4">
                  <Title level={4} className="!mb-0 text-left">
                    {categoryTitles[category]}
                  </Title>
                  {categoryAchievements.length > 0 && categoryAchievements[0].progress && (
                    <div className="text-sm text-gray-500 text-right">
                      {category === 'location' ? (
                        <div>Visited {categoryAchievements[0].progress.visits} Locations</div>
                      ) : (
                        <>
                          <div>Visited {categoryAchievements[0].progress.visits} Times</div>
                          <div>Crushed {categoryAchievements[0].progress.coneys} Coneys</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <Row gutter={[16, 16]}>
                  {categoryAchievements.map(achievement => (
                    <Col key={achievement.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                      <AchievementCard
                        title={achievement.title}
                        description={achievement.description}
                        isAchieved={achievement.unlocked}
                        unlockedAt={achievement.unlockedAt}
                        className="h-full"
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}