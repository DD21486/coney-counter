'use client';

import { Button, Card, Typography, Row, Col, Space, Avatar, Progress, Divider, Modal, List, Badge } from 'antd';
import { ArrowLeftOutlined, SettingOutlined, TrophyOutlined, CrownOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getTotalXPForLevel } from '@/lib/xp-system';

const { Title, Paragraph, Text } = Typography;

// Helper function to get total XP needed for next level
function getTotalXPForNextLevel(currentLevel: number): number {
  return getTotalXPForLevel(currentLevel + 1);
}

// Helper function to clean title (remove hash symbols and capitalize words)
function cleanTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/[#@]/g, '') // Remove hash and @ symbols
    .split(/[\s-]+/) // Split on spaces and hyphens
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' '); // Join with spaces instead of hyphens
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
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [availableTitles, setAvailableTitles] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<any>(null);

  useEffect(() => {
    fetchProfileData();
    fetchTitles();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showTitleModal) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showTitleModal]);

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

  const fetchTitles = async () => {
    try {
      const response = await fetch('/api/titles');
      if (response.ok) {
        const data = await response.json();
        setAvailableTitles(data.allTitles || []);
        setSelectedTitle(data.selectedTitle || null);
      }
    } catch (error) {
      console.error('Error fetching titles:', error);
    }
  };

  const handleTitleSelect = async (titleId: string) => {
    try {
      const response = await fetch('/api/titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titleId }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedTitle(data.selectedTitle);
        setShowTitleModal(false);
        // Refresh profile data to update the display
        fetchProfileData();
      } else {
        console.error('Failed to update title');
      }
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                Back
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
          <div className="text-center mb-4">
            <div className="text-xl text-gray-600 mb-2">
              {cleanTitle(selectedTitle?.name || profileData.selectedTitle) || getLevelTitle()}
            </div>
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => setShowTitleModal(true)}
              className="text-gray-400 hover:text-blue-600 text-sm"
            >
              Change Title
            </Button>
          </div>
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
                  <div className="text-gray-600">{cleanTitle(profileData.selectedTitle) || getLevelTitle()}</div>
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

      {/* Title Selection Modal */}
      <Modal
        title="Change Your Title"
        open={showTitleModal}
        onCancel={() => setShowTitleModal(false)}
        footer={null}
        width={600}
        destroyOnClose={true}
        maskClosable={true}
        style={{ top: 20 }}
        bodyStyle={{ padding: '16px 0' }}
      >
        <div className="max-h-96 overflow-y-auto px-1 sm:px-4">
          <List
            dataSource={availableTitles.filter(title => title.unlocked)}
            renderItem={(title) => (
              <List.Item
                className={`cursor-pointer hover:bg-gray-50 rounded-lg transition-colors mx-0 sm:mx-2 ${
                  selectedTitle?.id === title.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                onClick={() => handleTitleSelect(title.id)}
                style={{ padding: '12px 16px' }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div>
                      <div className="font-semibold text-gray-800">{title.name}</div>
                      <div className="text-sm text-gray-600">{title.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedTitle?.id === title.id && (
                      <Badge status="success" text="Selected" />
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>

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
  );
}
