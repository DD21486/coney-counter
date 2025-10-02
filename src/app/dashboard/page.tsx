'use client';

import { Button, Card, Statistic, Row, Col, Typography, Space, Avatar, Menu, Segmented, Dropdown, Tooltip, Table } from 'antd';
import { TrophyOutlined, PlusOutlined, BarChartOutlined, UserOutlined, LogoutOutlined, SettingOutlined, ArrowLeftOutlined, MenuOutlined, CrownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { analytics } from '@/lib/analytics';

const { Title, Paragraph } = Typography;

// Brand color mapping
const brandColors = {
  'Skyline Chili': '#1C3FAA', // Skyline Blue
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
  const [achievementLoading, setAchievementLoading] = useState(true);
  
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
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setAchievementLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (logs: any[], timeFilter: string) => {
    const now = new Date();
    const data = [];
    
    // Get all unique brands from logs
    const allBrands = [...new Set(logs.map((log: any) => log.brand))];
    
    if (timeFilter === 'this-month') {
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
      const brandBreakdown = data.brandBreakdown;
      
      // Calculate total coneys for this period
      const totalConeys = Object.values(brandBreakdown).reduce((sum: number, count: any) => sum + count, 0);
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-lg font-bold text-chili-red mb-3">
            {totalConeys} {totalConeys === 1 ? 'coney' : 'coneys'}
          </p>
          {Object.keys(brandBreakdown).length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Brand Breakdown:</p>
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
                      <span className="text-gray-700">{brand}</span>
                    </div>
                    <span className="font-semibold text-chili-red">{count as number}</span>
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
    <div className="min-h-screen bg-gray-50">
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
      `}</style>
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo - Always visible */}
            <div className="flex items-center">
              <img src="/ConeyCounterLogo_Medium.png" alt="Coney Counter" className="h-8" />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {session.user?.username || 'Coney Enthusiast'}</span>
              <Link href="/account">
                <Button 
                  icon={<SettingOutlined />} 
                  size="small"
                  type="text"
                >
                  Settings
                </Button>
              </Link>
              {/* Admin Button - Only show for admins and owners */}
              {(session.user?.role === 'admin' || session.user?.role === 'owner') && (
                <Link href="/admin">
                  <Button 
                    icon={<CrownOutlined />} 
                    size="small"
                    type="text"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Admin
                  </Button>
                </Link>
              )}
              <Button 
                icon={<LogoutOutlined />} 
                size="small"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className="md:hidden">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'user',
                      label: (
                        <div className="flex items-center space-x-2 py-2">
                          <Avatar 
                            size="small" 
                            src={session.user?.image} 
                            icon={<UserOutlined />} 
                          />
                          <span className="text-gray-700">{session.user?.name || 'Coney Enthusiast'}</span>
                        </div>
                      ),
                      disabled: true,
                    },
                    {
                      type: 'divider',
                    },
                    {
                      key: 'settings',
                      label: 'Account Settings',
                      icon: <SettingOutlined />,
                      onClick: () => router.push('/account'),
                    },
                    // Admin option - Only show for admins and owners
                    ...(session.user?.role === 'admin' || session.user?.role === 'owner' ? [{
                      key: 'admin',
                      label: 'Admin Panel',
                      icon: <CrownOutlined />,
                      onClick: () => router.push('/admin/users'),
                    }] : []),
                    {
                      key: 'signout',
                      label: 'Sign Out',
                      icon: <LogoutOutlined />,
                      onClick: () => signOut({ callbackUrl: '/' }),
                    },
                  ],
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button 
                  type="text" 
                  icon={<MenuOutlined />}
                  className="text-gray-600 hover:text-chili-red"
                />
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Alpha Test Message */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">α</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Welcome to the Alpha Test!
                </h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>
                    <strong>What you can do:</strong> Test receipt upload when you go grab some coneys. 
                    Also you can test manual entry of coneys to unlock achievements, leaderboards, and coney analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Title level={2} className="text-chili-red mb-6">Your Coney Dashboard</Title>
          
          {/* Quick Actions - Thin Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href="/upload-receipt">
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />}
                className={`coney-button-primary h-12 px-6 quick-link-button ${showQuickLinks.logConeys ? 'animate-in' : ''}`}
              >
                Log Some Coneys
              </Button>
            </Link>
            <Link href="/coneylytics">
              <Button 
                size="large"
                icon={<BarChartOutlined />}
                className={`h-12 px-6 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white quick-link-button ${showQuickLinks.coneylytics ? 'animate-in' : ''}`}
              >
                Coneylytics
              </Button>
            </Link>
            <Link href="/leaderboards">
              <Button 
                size="large"
                icon={<TrophyOutlined />}
                className={`h-12 px-6 border-skyline-blue text-skyline-blue hover:bg-skyline-blue hover:text-white quick-link-button ${showQuickLinks.leaderboard ? 'animate-in' : ''}`}
              >
                Leaderboards
              </Button>
            </Link>
            <Link href="/achievements">
              <Button 
                size="large"
                icon={<CrownOutlined />}
                className={`h-12 px-6 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white quick-link-button ${showQuickLinks.achievements ? 'animate-in' : ''}`}
              >
                Achievements {achievementLoading ? (
                  <span className="ml-2">
                    <div className="inline-block w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </span>
                ) : (
                  `(${achievementCount.unlocked}/${achievementCount.total})`
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Chart Section */}
        <div className={`mb-8 content-section ${showContent.chart ? 'animate-in' : ''}`}>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <Title level={2} className="text-gray-900 mb-2 text-lg md:text-2xl">Coney Consumption Trends</Title>
                <Paragraph className="text-gray-600">
                  Track your coney consumption patterns over time
                </Paragraph>
              </div>
              <div className="flex items-center space-x-4">
                <Segmented
                  options={[
                    { label: 'This Month', value: 'this-month' },
                    { label: 'This Year', value: 'this-year' }
                  ]}
                  value={timeFilter}
                  onChange={setTimeFilter}
                  className="bg-gray-100"
                />
              </div>
            </div>
          </div>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card className="shadow-sm border-0 relative" style={{ zIndex: 1 }}>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <RechartsTooltip 
                        content={<CustomTooltip />}
                        wrapperStyle={{ zIndex: 1000 }}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                          zIndex: 1000
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
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <div className={`grid grid-cols-2 gap-4 content-section ${showContent.stats ? 'animate-in' : ''}`}>
                <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title="Total Coneys Consumed"
                    value={userStats.totalConeys}
                    prefix="🌭"
                    valueStyle={{ color: '#B22222', fontSize: '1.5rem' }}
                  />
                </Card>
                <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title="All Time Ranking"
                    value={allTimeRank || '--'}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#1C3FAA', fontSize: '1.5rem' }}
                    suffix={allTimeRank ? 'th' : ''}
                  />
                </Card>
                <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title="Monthly Ranking"
                    value={monthlyRank || '--'}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#FFD447', fontSize: '1.5rem' }}
                    suffix={monthlyRank ? 'th' : ''}
                  />
                </Card>
                <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title="Favorite Brand"
                    value={favoriteBrand || '--'}
                    prefix="🏆"
                    valueStyle={{ color: '#B22222', fontSize: '1rem' }}
                  />
                </Card>
              </div>
            </Col>
          </Row>
        </div>


        {/* Recent Activity */}
        <div className={`mb-8 content-section ${showContent.recentActivity ? 'animate-in' : ''}`}>
          <Title level={3} className="mb-6">Recent Activity</Title>
          <Card className="coney-card">
            {recentLogs.length > 0 ? (
              <div className="px-2 md:px-0">
                <Table
                  columns={recentLogsColumns}
                  dataSource={recentLogs}
                  pagination={false}
                  rowKey="id"
                  size="small"
                  scroll={{ x: 400 }}
                />
                <div className="text-center pt-4">
                  <Link href="/upload-receipt">
                    <Button type="primary" className="coney-button-primary">
                      Log More Coneys
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserOutlined className="text-6xl text-gray-300 mb-4" />
                <Title level={4} className="text-gray-500">No coneys logged yet</Title>
                <Paragraph className="text-gray-400 mb-6">
                  Start counting your coneys by logging your first one!
                </Paragraph>
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
          </Card>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/Coney_color.svg" alt="Coney Counter" className="w-8 h-8" />
              <h3 className="text-xl font-bold text-chili-red">Coney Counter</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Track your coney consumption, earn achievements, and compete with other coney crushers in Cincinnati.
            </p>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <div className="space-y-2">
              <Link href="/terms" className="block text-gray-300 hover:text-chili-red transition-colors text-sm">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="block text-gray-300 hover:text-chili-red transition-colors text-sm">
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
