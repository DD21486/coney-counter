'use client';

import { Button, Card, Typography, Row, Col, Space, Avatar, Progress, Divider } from 'antd';
import { ArrowLeftOutlined, SettingOutlined, TrophyOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getTotalXPForLevel } from '@/lib/xp-system';

const { Title, Paragraph, Text } = Typography;

// Helper function to get total XP needed for next level
function getTotalXPForNextLevel(currentLevel: number): number {
  return getTotalXPForLevel(currentLevel + 1);
}

export default function MyProfile() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState({
    totalXP: 0,
    currentLevel: 1,
    currentLevelXP: 0,
    nextLevelXP: 20,
    selectedTitle: null,
    name: '',
    email: '',
    username: '',
    memberSince: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/user-profile');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    return (profileData.currentLevelXP / profileData.nextLevelXP) * 100;
  };

  const getLevelTitle = () => {
    if (profileData.currentLevel >= 90) return "Coney Legend";
    if (profileData.currentLevel >= 75) return "Coney Master";
    if (profileData.currentLevel >= 50) return "Coney Expert";
    if (profileData.currentLevel >= 25) return "Coney Enthusiast";
    if (profileData.currentLevel >= 10) return "Coney Apprentice";
    return "Coney Novice";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <UserOutlined className="text-chili-red text-xl" />
              <Title level={4} className="text-chili-red mb-0">My Profile</Title>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar 
            size={120} 
            src={session?.user?.image} 
            icon={<UserOutlined />}
            className="mb-4 border-4 border-white shadow-lg"
          />
          <Title level={2} className="text-gray-900 mb-2">
            @{profileData.username || session?.user?.username || 'coneycrusher'}
          </Title>
          <Paragraph className="text-lg text-gray-600 mb-4">
            {profileData.selectedTitle || getLevelTitle()}
          </Paragraph>
        </div>

        {/* XP and Level Card */}
        <Card className="shadow-sm border-0 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            {/* Level Display with Animated Gradient */}
            <div className="mb-6">
              <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                Level {profileData.currentLevel}
              </div>
            </div>

            {/* XP Progress */}
            <div className="text-sm text-gray-600 mb-3 flex justify-between items-center max-w-md mx-auto">
              <span>{profileData.totalXP} / {getTotalXPForNextLevel(profileData.currentLevel)}</span>
              <span>{profileData.nextLevelXP - profileData.currentLevelXP} XP To Next Level</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(profileData.currentLevelXP / profileData.nextLevelXP) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="shadow-sm border-0 mb-8">
          <Title level={4} className="text-gray-800 mb-4">📋 Profile Information</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <div className="space-y-4">
                <div>
                  <Text strong className="text-gray-700">Email:</Text>
                  <div className="text-gray-600">{profileData.email || session?.user?.email}</div>
                </div>
                <div>
                  <Text strong className="text-gray-700">Username:</Text>
                  <div className="text-gray-600">{profileData.username || 'Not set'}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="space-y-4">
                <div>
                  <Text strong className="text-gray-700">Member Since:</Text>
                  <div className="text-gray-600">
                    {profileData.memberSince ? new Date(profileData.memberSince).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
                <div>
                  <Text strong className="text-gray-700">Current Title:</Text>
                  <div className="text-gray-600">{profileData.selectedTitle || getLevelTitle()}</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm border-0">
          <Title level={4} className="text-gray-800 mb-4">⚙️ Quick Actions</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Link href="/settings" className="block">
                <Button 
                  type="default" 
                  size="large" 
                  icon={<SettingOutlined />}
                  className="w-full h-16 text-lg"
                >
                  My Settings
                </Button>
              </Link>
            </Col>
            <Col xs={24} sm={12}>
              <Link href="/achievements" className="block">
                <Button 
                  type="default" 
                  size="large" 
                  icon={<TrophyOutlined />}
                  className="w-full h-16 text-lg"
                >
                  View Achievements
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
      </main>
    </div>
  );
}
