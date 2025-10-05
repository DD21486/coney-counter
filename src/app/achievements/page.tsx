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
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E40AF 15%, #0C4A6E 30%, #064E3B 45%, #022C22 60%, #7F1D1D 75%, #450A0A 100%)' }}
    >
      {/* Floating Top Bar */}
      <header className="fixed top-4 z-50 w-full px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <Link href="/dashboard">
                <Button type="text" icon={<ArrowLeftOutlined />} className="text-white hover:text-white hover:bg-white/10 font-semibold">
                  Back
                </Button>
              </Link>
              <div className="flex-1 flex justify-center">
                <img src="/ConeyCounter_LogoWordmark_White.png" alt="Coney Counter" className="h-8 w-auto max-w-[200px]" />
              </div>
              <div className="w-32"></div> {/* Spacer to balance the back button */}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 pt-24">
        {/* Page Title */}
        <div className="text-center mb-8">
          <Title level={3} className="!mb-0 !text-white">Your Achievements</Title>
        </div>

        {/* Progress Stats */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div 
              className="text-6xl font-black mb-2 text-white"
              style={{ 
                fontFamily: 'Satoshi, sans-serif'
              }}
            >
              {unlockedCount} / {totalCount}
            </div>
          </div>
          <div className="flex justify-center">
            <Progress 
              percent={Math.round(progressPercent)} 
              strokeColor={{
                '0%': '#60A5FA',
                '50%': '#3B82F6',
                '100%': '#1D4ED8',
              }}
              className="w-1/3"
              showInfo={false}
              trailColor="rgba(255, 255, 255, 0.2)"
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
                  <Title level={4} className="!mb-0 text-left !text-white">
                    {categoryTitles[category]}
                  </Title>
                  {categoryAchievements.length > 0 && categoryAchievements[0].progress && (
                    <div className="text-sm text-white/60 text-right">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/ConeyCounter_LogoWordmark_White.png" alt="Coney Counter" className="h-8 w-auto" />
            </div>
            <p className="text-gray-300 text-sm">
              Track your coney consumption, earn achievements, and compete with other coney crushers in Cincinnati.
            </p>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <div className="space-y-2">
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-chili-red transition-colors text-sm">
                Terms & Conditions
              </Link>
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-chili-red transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Coney Counter. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mt-2 md:mt-0">
                Made with ❤️ for Cincinnati's coney community
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}