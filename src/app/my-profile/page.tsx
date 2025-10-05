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
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('coneyyellow');
  const [availableTitles, setAvailableTitles] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<any>(null);

  // Available avatar images
  const availableAvatars = [
    { id: 'coneyyellow', name: 'Yellow Coney', src: '/avatars/coneyyellow.png' },
    { id: 'coneyblue', name: 'Blue Coney', src: '/avatars/coneyblue.png' },
    { id: 'coneygreen', name: 'Green Coney', src: '/avatars/coneygreen.png' },
    { id: 'coneyred', name: 'Red Coney', src: '/avatars/coneyred.png' }
  ];

  // Get current avatar source
  const getCurrentAvatarSrc = () => {
    return availableAvatars.find(avatar => avatar.id === selectedAvatar)?.src || '/avatars/coneyyellow.png';
  };

  useEffect(() => {
    fetchProfileData();
    fetchTitles();
    fetchAvatar();
  }, []);

  const fetchAvatar = async () => {
    try {
      const response = await fetch('/api/user/avatar');
      if (response.ok) {
        const data = await response.json();
        setSelectedAvatar(data.selectedAvatar || 'coneyyellow');
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  };

  const updateAvatar = async (avatarId: string) => {
    try {
      const response = await fetch('/api/user/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatarId }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedAvatar(data.selectedAvatar);
      } else {
        console.error('Failed to update avatar');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

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
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E40AF 15%, #0C4A6E 30%, #064E3B 45%, #022C22 60%, #7F1D1D 75%, #450A0A 100%)'
    }}>
      {/* Navigation Header */}
      <header className="fixed top-4 z-50 w-full px-4">
        <div className="max-w-7xl mx-auto">
          <div className="floating-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard">
                <Button type="text" icon={<ArrowLeftOutlined />} className="text-white hover:text-white hover:bg-white/10 font-semibold">
                  Back
                </Button>
              </Link>
              <div className="flex items-center justify-center">
                <Title level={4} className="text-white mb-0">My Profile</Title>
              </div>
              <div className="w-32"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        <style jsx global>{`
          .floating-card {
            background: rgba(255, 255, 255, 0.1);
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
          }
        `}</style>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="floating-card rounded-xl p-8 mb-8 text-center">
            <img 
              src={getCurrentAvatarSrc()} 
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4 border-4 border-white shadow-lg object-cover mx-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowAvatarModal(true)}
              onError={(e) => {
                console.log('Profile image failed to load, using fallback');
                e.currentTarget.src = '/Coney_color.svg';
              }}
            />
            <Title level={2} className="text-white mb-2">
              @{profileData.username || session?.user?.username || 'coneycrusher'}
            </Title>
            <div className="text-center mb-4">
              <div className="text-xl text-white/80 mb-2">
                {cleanTitle(selectedTitle?.name || profileData.selectedTitle) || getLevelTitle()}
              </div>
              <div className="text-sm text-white/60 mb-3">
                Member Since: {profileData.memberSince ? new Date(profileData.memberSince).toLocaleDateString() : 'Unknown'}
              </div>
              <Button 
                type="text" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => setShowTitleModal(true)}
                className="text-white/60 hover:text-white text-sm"
              >
                Change Title
              </Button>
            </div>
          </div>

        {/* XP and Level Card */}
        <div className="floating-card rounded-xl p-6 mb-8">
          <div className="text-center">
            {/* Level Display with Animated Gradient */}
            <div className="mb-6">
              <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
                Level {profileData.currentLevel}
              </div>
            </div>

            {/* XP Progress */}
            <div className="text-sm text-white/80 mb-3 flex justify-between items-center max-w-md mx-auto">
              <span>{profileData.totalXP} / {getTotalXPForNextLevel(profileData.currentLevel)}</span>
              <span>{profileData.nextLevelXP - profileData.currentLevelXP} XP To Next Level</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3 mb-2 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(profileData.currentLevelXP / profileData.nextLevelXP) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="floating-card rounded-xl p-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Link href="/account" className="block">
                <Button 
                  type="default" 
                  size="large" 
                  icon={<SettingOutlined />}
                  className="w-full h-16 text-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
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
                  className="w-full h-16 text-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  View Achievements
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
        </div>
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

      {/* Avatar Selection Modal */}
      <Modal
        title="Choose Your Avatar"
        open={showAvatarModal}
        onCancel={() => setShowAvatarModal(false)}
        footer={null}
        width={800}
        className="avatar-selection-modal"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {availableAvatars.map((avatar) => (
            <div
              key={avatar.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedAvatar === avatar.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                updateAvatar(avatar.id);
                setShowAvatarModal(false);
              }}
            >
              <div className="text-center">
                <img
                  src={avatar.src}
                  alt={avatar.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/Coney_color.svg';
                  }}
                />
                <p className="text-sm font-medium text-gray-700">{avatar.name}</p>
              </div>
            </div>
          ))}
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
