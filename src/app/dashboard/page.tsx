'use client';

import { Button, Card, Statistic, Row, Col, Typography, Space, Avatar, Menu, Segmented, Dropdown, Tooltip, Table } from 'antd';
import { TrophyOutlined, PlusOutlined, BarChartOutlined, UserOutlined, LogoutOutlined, SettingOutlined, ArrowLeftOutlined, MenuOutlined, CrownOutlined } from '@ant-design/icons';
import { ChartBarIcon, RocketLaunchIcon, StarIcon, DocumentTextIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { ChartBarIcon as ChartBarIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { analytics } from '@/lib/analytics';
import { getTotalXPForLevel } from '@/lib/xp-system';

const { Title, Paragraph } = Typography;

// Helper function to get total XP needed for next level
function getTotalXPForNextLevel(currentLevel: number): number {
  return getTotalXPForLevel(currentLevel + 1);
}

// Helper function to get level-based title (same as my-profile page)
function getLevelTitle(currentLevel: number): string {
  if (currentLevel >= 90) return "Coney Legend";
  if (currentLevel >= 75) return "Coney Master";
  if (currentLevel >= 50) return "Coney Expert";
  if (currentLevel >= 25) return "Coney Enthusiast";
  if (currentLevel >= 10) return "Coney Apprentice";
  return "Coney Novice";
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

// Brand color mapping
const brandColors = {
  'Skyline Chili': '#60A5FA', // Lighter Skyline Blue for dark theme
  'Dixie Chili': '#DC2626',   // Dixie Red
  'Gold Star Chili': '#D97706', // Gold Star Yellow (deeper)
  'Camp Washington': '#7C3AED', // Purple
  'Pleasant Ridge': '#059669',  // Green
  'Blue Ash': '#0891B2',        // Cyan
  'Empress': '#EA580C',         // Orange
  'Price Hill': '#BE185D',      // Pink
};

// Generate random colors for other brands
const generateRandomColor = (brand: string) => {
  const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#84CC16'];
  const index = brand.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    totalConeys: 0,
    thisMonthConeys: 0,
    brandsTried: 0,
    brandBreakdown: {},
  });
  const [recentLogs, setRecentLogs] = useState<Array<{ id: string; brand: string; quantity: number; createdAt: string; location?: string }>>([]);
  const [chartData, setChartData] = useState<Array<{ name: string; coneys: number; [key: string]: any }>>([]);
  const [chartBrands, setChartBrands] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState('this-month');
  const [monthlyRank, setMonthlyRank] = useState(0);
  const [allTimeRank, setAllTimeRank] = useState(0);
  const [favoriteBrand, setFavoriteBrand] = useState('');
  const [loading, setLoading] = useState(true);
  const [achievementCount, setAchievementCount] = useState({ unlocked: 0, total: 76 });
  const [xpData, setXpData] = useState({
    totalXP: 0,
    currentLevel: 1,
    currentLevelXP: 0,
    nextLevelXP: 20
  });
  const [achievementLoading, setAchievementLoading] = useState(true);
  const [userTitle, setUserTitle] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('coneyyellow');
  const [showProfile, setShowProfile] = useState(false);
  
  // Animation states for quick links
  const [showQuickLinks, setShowQuickLinks] = useState({
    logConeys: false,
    coneylytics: false,
    leaderboard: false,
    achievements: false,
  });

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/auth/signin'); // Not authenticated
      return;
    }

    // Simple check: if no username, redirect to onboarding
    if (session && !session.user?.username) {
      router.push('/onboarding');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserStats();
      fetchAvatar();
      // Track dashboard view
      analytics.viewDashboard();
    }
  }, [session, timeFilter]);

  // Animation states for rest of content
  const [showContent, setShowContent] = useState({
    chart: false,
    stats: false,
    recentActivity: false,
  });

  // Quick links animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setShowQuickLinks(prev => ({ ...prev, logConeys: true })), 100);
    const timer2 = setTimeout(() => setShowQuickLinks(prev => ({ ...prev, coneylytics: true })), 200);
    const timer3 = setTimeout(() => setShowQuickLinks(prev => ({ ...prev, leaderboard: true })), 300);
    const timer4 = setTimeout(() => setShowQuickLinks(prev => ({ ...prev, achievements: true })), 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Profile animation sequence (delayed for data loading)
  useEffect(() => {
    const timer = setTimeout(() => setShowProfile(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Content animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(prev => ({ ...prev, chart: true })), 600);
    const timer2 = setTimeout(() => setShowContent(prev => ({ ...prev, stats: true })), 800);
    const timer3 = setTimeout(() => setShowContent(prev => ({ ...prev, recentActivity: true })), 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/coney-logs');
      if (response.ok) {
        const data = await response.json();
        setUserStats(data.statistics);
        setRecentLogs(data.coneyLogs.slice(0, 5)); // Get last 5 logs
        
        // Generate chart data
        const chartResult = generateChartData(data.coneyLogs, timeFilter);
        setChartData(chartResult.data);
        setChartBrands(chartResult.brands);
        
        // Fetch monthly rank
        const rankResponse = await fetch('/api/leaderboard?filter=this-month&brand=all-brands');
        if (rankResponse.ok) {
          const rankData = await rankResponse.json();
          // Find current user's rank by userId
          const userRank = rankData.leaderboard.find((user: any) => user.userId === session?.user?.id);
          setMonthlyRank(userRank?.rank || 0);
        }
        
        // Fetch all-time rank
        const allTimeResponse = await fetch('/api/leaderboard?filter=all-time&brand=all-brands');
        if (allTimeResponse.ok) {
          const allTimeData = await allTimeResponse.json();
          // Find current user's rank by userId
          const userRank = allTimeData.leaderboard.find((user: any) => user.userId === session?.user?.id);
          setAllTimeRank(userRank?.rank || 0);
        }
        
        // Determine favorite brand
        const brandBreakdown = data.statistics.brandBreakdown;
        if (Object.keys(brandBreakdown).length > 0) {
          const favorite = Object.entries(brandBreakdown)
            .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];
          setFavoriteBrand(favorite);
        }
        
        // Calculate achievement count
        const achievementResponse = await fetch('/api/achievements');
        if (achievementResponse.ok) {
          const achievementData = await achievementResponse.json();
          setAchievementCount({ 
            unlocked: achievementData.unlockedCount, 
            total: achievementData.totalCount 
          });
        }
        setAchievementLoading(false);
        
        // Fetch XP data
        const xpResponse = await fetch('/api/user-profile');
        if (xpResponse.ok) {
          const xpData = await xpResponse.json();
          setXpData({
            totalXP: xpData.totalXP || 0,
            currentLevel: xpData.currentLevel || 1,
            currentLevelXP: xpData.currentLevelXP || 0,
            nextLevelXP: xpData.nextLevelXP || 20
          });
          setUserTitle(xpData.selectedTitle || 'No Title Selected');
        }
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setAchievementLoading(false);
    } finally {
      setLoading(false);
    }
  };

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

  const generateChartData = (logs: any[], timeFilter: string) => {
    const now = new Date();
    const data = [];
    
    // Get all unique brands from logs
    const allBrands = [...new Set(logs.map((log: any) => log.brand))];
    
    if (timeFilter === 'this-week') {
      // Generate 7 days of data
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayLogs = logs.filter((log: any) => 
          log.createdAt.startsWith(dateStr)
        );
        
        const brandBreakdown = dayLogs.reduce((acc: any, log: any) => {
          acc[log.brand] = (acc[log.brand] || 0) + log.quantity;
          return acc;
        }, {});
        
        const dataPoint: any = {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: dateStr,
          brandBreakdown
        };
        
        // Add individual brand counts for chart rendering
        allBrands.forEach(brand => {
          dataPoint[brand] = brandBreakdown[brand] || 0;
        });
        
        data.push(dataPoint);
      }
    } else if (timeFilter === 'this-month') {
      // Generate 30 days of data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayLogs = logs.filter((log: any) => 
          log.createdAt.startsWith(dateStr)
        );
        
        const brandBreakdown = dayLogs.reduce((acc: any, log: any) => {
          acc[log.brand] = (acc[log.brand] || 0) + log.quantity;
          return acc;
        }, {});
        
        const dataPoint: any = {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: dateStr,
          brandBreakdown
        };
        
        // Add each brand as a separate data property for stacking
        allBrands.forEach(brand => {
          dataPoint[brand] = brandBreakdown[brand] || 0;
        });
        
        data.push(dataPoint);
      }
    } else {
      // Generate monthly data for the year
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toISOString().substring(0, 7);
        
        const monthLogs = logs.filter((log: any) => 
          log.createdAt.startsWith(monthStr)
        );
        
        const brandBreakdown = monthLogs.reduce((acc: any, log: any) => {
          acc[log.brand] = (acc[log.brand] || 0) + log.quantity;
          return acc;
        }, {});
        
        const dataPoint: any = {
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          fullDate: monthStr,
          brandBreakdown
        };
        
        // Add each brand as a separate data property for stacking
        allBrands.forEach(brand => {
          dataPoint[brand] = brandBreakdown[brand] || 0;
        });
        
        data.push(dataPoint);
      }
    }
    
    return { data, brands: allBrands };
  };

  const recentLogsColumns = [
    {
      title: '',
      dataIndex: 'icon',
      key: 'icon',
      width: 50,
      render: () => (
        <div className="flex items-center justify-center">
          <img 
            src="/Coney_color.svg" 
            alt="Coney" 
            className="w-6 h-6 object-contain"
          />
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div className="text-sm">
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}
        </div>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      render: (brand: string, record: any) => {
        const brandColor = brandColors[brand as keyof typeof brandColors] || generateRandomColor(brand);
        return record.location ? (
          <Tooltip title={`📍 ${record.location.name || record.location}`} placement="top">
            <span 
              className="font-medium cursor-help hover:opacity-80 transition-opacity"
              style={{ color: brandColor }}
            >
              {brand}
            </span>
          </Tooltip>
        ) : (
          <span 
            className="font-medium"
            style={{ color: brandColor }}
          >
            {brand}
          </span>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => (
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{quantity}</div>
          <div className="text-xs text-gray-500">coneys</div>
        </div>
      ),
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const brandBreakdown = data.brandBreakdown || {};
      
      // Calculate total coneys for this period
      const totalConeys = Object.values(brandBreakdown).reduce((sum: number, count: any) => sum + count, 0);
      
      return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-white/20">
          <p className="font-semibold text-white mb-2">{label}</p>
          <p className="text-lg font-bold text-red-400 mb-3">
            {totalConeys} {totalConeys === 1 ? 'coney' : 'coneys'}
          </p>
          {Object.keys(brandBreakdown).length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-white/80 mb-2">Brand Breakdown:</p>
              {Object.entries(brandBreakdown)
                .filter(([, count]) => (count as number) > 0)
                .map(([brand, count]) => (
                  <div key={brand} className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: brandColors[brand as keyof typeof brandColors] || generateRandomColor(brand) 
                        }}
                      ></div>
                      <span className="text-white/90">{brand}</span>
                    </div>
                    <span className="font-semibold text-red-400">{count as number}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to sign-in...</p>
        </div>
      </div>
    );
  }

  // If user doesn't have username, redirect immediately (no loading state needed)
  if (!session.user?.username) {
    return null; // Component will redirect via useEffect
  }
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E40AF 15%, #0C4A6E 30%, #064E3B 45%, #022C22 60%, #7F1D1D 75%, #450A0A 100%)'
    }}>
      <style jsx global>{`
        .recharts-tooltip-wrapper {
          z-index: 9999 !important;
        }
        .recharts-tooltip-content {
          z-index: 9999 !important;
        }
        .recharts-legend-wrapper {
          z-index: 1 !important;
        }
        
        .quick-link-button {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s ease-out;
        }
        
        .quick-link-button.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .content-section {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s ease-out;
        }
        
        .content-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .floating-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .quick-link-card {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        
        .quick-link-card:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .quick-link-card:active {
          transform: translateY(0px) scale(0.98);
          transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .quick-link-card.log-coneys:hover {
          background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%), rgba(34, 197, 94, 0.1);
        }
        
        .quick-link-card.other:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        
        .segmented-white .ant-segmented-item {
          color: white !important;
        }
        .segmented-white .ant-segmented-item:hover {
          color: white !important;
        }
        .segmented-white .ant-segmented-item-selected {
          color: white !important;
        }
        .segmented-white .ant-segmented-item-label {
          color: white !important;
        }
        
        .ant-dropdown-menu-item {
          color: white !important;
        }
        .ant-dropdown-menu-item:hover {
          color: white !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .ant-dropdown-menu {
          background-color: rgba(0, 0, 0, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        
        .chart-container {
          overflow: visible !important;
        }
        .recharts-wrapper {
          overflow: visible !important;
        }
        
        .floating-card {
          overflow: visible !important;
        }
        .main-content {
          overflow: visible !important;
        }
      `}</style>
      {/* New Floating Top Bar */}
      <header className="fixed top-4 z-50 w-full px-4">
        <div className="max-w-7xl mx-auto">
          <div className="floating-card rounded-xl px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center">
                <img src="/ConeyCounter_LogoWordmark_White.png" alt="Coney Counter" className="h-8" />
              </div>
              
            {/* Account Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/my-profile">
                <Button 
                  type="text"
                  className="text-white hover:text-white hover:bg-white/10 font-semibold"
                >
                  My Account
                </Button>
              </Link>
              {/* Admin Button - Only show for admins and owners */}
              {(session.user?.role === 'admin' || session.user?.role === 'owner') && (
                <Link href="/admin">
                  <Button 
                    type="text"
                    className="text-white hover:text-white hover:bg-white/10 font-semibold"
                  >
                    Admin
                  </Button>
                </Link>
              )}
              {/* Sign Out Button */}
              <Button 
                type="text"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-white hover:text-white hover:bg-white/10 font-semibold"
              >
                Sign Out
              </Button>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'profile',
                      label: 'My Account',
                      onClick: () => router.push('/my-profile'),
                    },
                    ...(session.user?.role === 'admin' || session.user?.role === 'owner' ? [{
                      key: 'admin',
                      label: 'Admin',
                      onClick: () => router.push('/admin'),
                    }] : []),
                    {
                      key: 'signout',
                      label: 'Sign Out',
                      onClick: () => signOut({ callbackUrl: '/' }),
                    },
                  ],
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button 
                  type="text"
                  className="text-white hover:text-white hover:bg-white/10 font-semibold"
                >
                  <Bars3Icon className="w-6 h-6" />
                </Button>
              </Dropdown>
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Section with Quick Links and Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Side - 2x2 Quick Links Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                {/* Log Coneys */}
                <Link href="/upload-receipt">
                  <div className={`rounded-xl p-4 cursor-pointer quick-link-card log-coneys quick-link-button ${showQuickLinks.logConeys ? 'animate-in' : ''}`} style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    minHeight: '120px'
                  }}>
                    <div className="flex items-center justify-center mb-3 h-12">
                      <DocumentTextIcon className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-white font-black text-xl text-center">Log Coneys</h3>
                  </div>
                </Link>

                {/* Coneylytics */}
                <Link href="/coneylytics">
                  <div className={`floating-card rounded-xl p-4 cursor-pointer quick-link-card other quick-link-button ${showQuickLinks.coneylytics ? 'animate-in' : ''}`} style={{ minHeight: '120px' }}>
                    <div className="flex items-center justify-center mb-3 h-12">
                      <ChartBarIconSolid className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-white font-black text-xl text-center">Coneylytics</h3>
                  </div>
                </Link>

                {/* Leaderboards */}
                <Link href="/leaderboards">
                  <div className={`floating-card rounded-xl p-4 cursor-pointer quick-link-card other quick-link-button ${showQuickLinks.leaderboard ? 'animate-in' : ''}`} style={{ minHeight: '120px' }}>
                    <div className="flex items-center justify-center mb-3 h-12">
                      <RocketLaunchIcon className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-white font-black text-xl text-center">Leaderboards</h3>
                  </div>
                </Link>

                {/* Achievements */}
                <Link href="/achievements">
                  <div className={`floating-card rounded-xl p-4 cursor-pointer quick-link-card other quick-link-button ${showQuickLinks.achievements ? 'animate-in' : ''}`} style={{ minHeight: '120px' }}>
                    <div className="flex items-center justify-center mb-3 h-12">
                      <StarIcon className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-white font-black text-xl text-center">
                      Achievements
                      {achievementLoading ? (
                        <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2 md:ml-2 md:inline-block block md:mt-0 mt-2"></div>
                      ) : (
                        <span className="text-sm font-normal opacity-60 ml-2 md:ml-2 md:inline block md:mt-0 mt-1">({achievementCount.unlocked}/{achievementCount.total})</span>
                      )}
                    </h3>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Side - Profile Section */}
            <div className={`lg:col-span-1 ${showProfile ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
              <div className="floating-card rounded-xl p-6">
                {/* Profile Header */}
                <div className="flex items-center mb-6">
                  {/* Profile Image - Using avatars/coneyyellow */}
                  <img 
                    src={`/avatars/${selectedAvatar}.png`} 
                    alt="Profile"
                    className="w-16 h-16 rounded-full bg-blue-500 object-cover"
                    onError={(e) => {
                      console.log('Profile image failed to load, using fallback');
                      e.currentTarget.src = '/Coney_color.svg';
                    }}
                  />
                  <div className="ml-4">
                    <h2 className="text-white font-bold text-xl">@{session.user?.username?.replace(/[^a-zA-Z0-9_-]/g, '')}</h2>
                    <p className="text-white/80 text-sm">{cleanTitle(userTitle) || getLevelTitle(xpData.currentLevel)}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-white font-bold text-xl">Lv. {xpData.currentLevel}</span>
                  </div>
                </div>

                {/* XP Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-white text-xs mb-2">
                    <span>{xpData.totalXP} / {getTotalXPForNextLevel(xpData.currentLevel)}xp</span>
                    <span>{xpData.nextLevelXP - xpData.currentLevelXP}xp until level {xpData.currentLevel + 1}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(xpData.currentLevelXP / xpData.nextLevelXP) * 100}%`,
                        transitionDelay: '300ms'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left">
                    <div className="text-white font-bold text-2xl">{userStats.totalConeys}</div>
                    <div className="text-white/80 text-sm">Lifetime Coneys Consumed</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-2xl">{allTimeRank || '--'}</div>
                    <div className="text-white/80 text-sm">All-Time Ranking</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dark Background Section - Consumption Trends */}
          <div className="bg-transparent rounded-t-3xl -mx-4 px-2 md:px-4 pt-8 pb-12 main-content">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
              {/* Chart and Activity Section */}
              <div className={`mb-8 content-section ${showContent.chart ? 'animate-in' : ''}`}>
                <div className="floating-card rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-white mb-2 text-lg md:text-2xl font-bold">Coney Consumption Trends</h2>
                      <p className="text-white/80">
                        Track your coney consumption patterns over time
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Segmented
                        options={[
                          { label: 'This Week', value: 'this-week' },
                          { label: 'This Month', value: 'this-month' },
                          { label: 'This Year', value: 'this-year' }
                        ]}
                        value={timeFilter}
                        onChange={setTimeFilter}
                        className="bg-white/10 segmented-white"
                      />
                    </div>
                  </div>
                  {/* Chart */}
                  <div className="relative mb-8 chart-container" style={{ zIndex: 1 }}>
                    <div className="h-64 md:h-80 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.6)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'white' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.6)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    tick={{ fill: 'white' }}
                  />
                  <RechartsTooltip 
                    content={<CustomTooltip />}
                    wrapperStyle={{ zIndex: 1000 }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      zIndex: 1000,
                      color: 'white'
                    }}
                  />
                  <Legend />
                  {chartBrands.map((brand: string, index: number) => (
                    <Bar
                      key={brand}
                      dataKey={brand}
                      stackId="a"
                      fill={brandColors[brand as keyof typeof brandColors] || generateRandomColor(brand)}
                      radius={index === chartBrands.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="border-t border-white/20 pt-6">
                    <h3 className="text-white mb-6 text-lg font-bold">Recent Activity</h3>
                    {recentLogs.length > 0 ? (
                      <div className="space-y-3">
                        {recentLogs.map((log) => (
                          <div key={log.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex-1">
                              <div className="text-white font-medium">{log.brand}</div>
                              <div className="text-white/60 text-sm">{new Date(log.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="text-white font-bold">{log.quantity} coney{log.quantity > 1 ? 's' : ''}</div>
                          </div>
                        ))}
                        <div className="text-center pt-4">
                          <Link href="/log-coney">
                            <Button type="primary" className="coney-button-primary">
                              Log More Coneys
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <UserOutlined className="text-6xl text-white/40 mb-4" />
                        <h4 className="text-white/80 mb-2">No coneys logged yet</h4>
                        <p className="text-white/60 mb-6">
                          Start counting your coneys by logging your first one!
                        </p>
                        <Link href="/upload-receipt">
                          <Button 
                            type="primary" 
                            size="large" 
                            icon={<PlusOutlined />}
                            className="coney-button-primary"
                          >
                            Log Your First Coneys
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
