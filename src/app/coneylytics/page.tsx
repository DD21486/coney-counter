'use client';

import { Button, Card, Typography, Row, Col, Space, Statistic, Table, Tag, DatePicker, Segmented, Collapse, Tooltip } from 'antd';
import { BarChartOutlined, ArrowLeftOutlined, CalendarOutlined, TrophyOutlined, FireOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import ContributionChart from '../../components/ContributionChart';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

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

// Calorie calculation constants
const CALORIES_PER_CONEY = 328;

export default function ConeylyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState('all-time');

  // Get current month name
  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleString('default', { month: 'long' });
  };
  const [chartData, setChartData] = useState<any[]>([]);
  const [contributionData, setContributionData] = useState<{ date: string; count: number }[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalConeys: 0,
    thisMonthConeys: 0,
    thisYearConeys: 0,
    brandBreakdown: {},
    recentLogs: [],
    averagePerMonth: 0,
    longestStreak: 0,
    currentStreak: 0,
    totalCalories: 0,
    thisMonthCalories: 0,
    thisYearCalories: 0,
    // New statistics
    favoriteDayOfWeek: '',
    favoriteLocation: '',
    averageConeysPerSitting: 0,
    averageConeysPerWeek: 0,
    uniqueLocationsVisited: 0,
    longestBreakBetweenConeys: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/signin');
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchAnalyticsData();
    }
  }, [session, timeFilter]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/coney-logs');
      if (response.ok) {
        const data = await response.json();
        
        // Calculate additional analytics
        const logs = data.coneyLogs;
        const now = new Date();
        const thisYear = new Date(now.getFullYear(), 0, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Filter logs based on time period
        let filteredLogs = logs;
        if (timeFilter === 'this-week') {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredLogs = logs.filter((log: any) => new Date(log.createdAt) >= oneWeekAgo);
        } else if (timeFilter === 'this-month') {
          filteredLogs = logs.filter((log: any) => new Date(log.createdAt) >= thisMonth);
        } else if (timeFilter === 'this-year') {
          filteredLogs = logs.filter((log: any) => new Date(log.createdAt) >= thisYear);
        } else if (timeFilter === 'all-time') {
          filteredLogs = logs; // No filtering for all time
        }
        
        // Calculate stats
        const totalConeys = filteredLogs.reduce((sum: number, log: any) => sum + log.quantity, 0);
        const thisMonthConeys = logs.filter((log: any) => new Date(log.createdAt) >= thisMonth)
          .reduce((sum: number, log: any) => sum + log.quantity, 0);
        const thisYearConeys = logs.filter((log: any) => new Date(log.createdAt) >= thisYear)
          .reduce((sum: number, log: any) => sum + log.quantity, 0);
        
        // Calculate calorie stats
        const totalCalories = logs.reduce((sum: number, log: any) => sum + (log.quantity * CALORIES_PER_CONEY), 0);
        const thisMonthCalories = logs.filter((log: any) => new Date(log.createdAt) >= thisMonth)
          .reduce((sum: number, log: any) => sum + (log.quantity * CALORIES_PER_CONEY), 0);
        const thisYearCalories = logs.filter((log: any) => new Date(log.createdAt) >= thisYear)
          .reduce((sum: number, log: any) => sum + (log.quantity * CALORIES_PER_CONEY), 0);
        
        // Brand breakdown for filtered data
        const brandBreakdown = filteredLogs.reduce((acc: any, log: any) => {
          acc[log.brand] = (acc[log.brand] || 0) + log.quantity;
          return acc;
        }, {});
        
        // Calculate streaks (simplified)
        const sortedLogs = logs.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        
        for (let i = 0; i < sortedLogs.length; i++) {
          if (i === 0 || new Date(sortedLogs[i].createdAt).getTime() - new Date(sortedLogs[i-1].createdAt).getTime() <= 2 * 24 * 60 * 60 * 1000) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 1;
          }
        }
        currentStreak = tempStreak;

        // Generate chart data
        const chartData = generateChartData(filteredLogs, timeFilter);
        
        // Generate contribution data for the current year
        const currentYear = new Date().getFullYear();
        const contributionData = generateContributionData(logs, currentYear);
        
        // Calculate additional statistics
        const dayOfWeekCounts: { [key: string]: number } = {};
        const locationCounts: { [key: string]: number } = {};
        const uniqueLocations = new Set<string>();
        let totalQuantity = 0;
        let logCount = 0;
        
        logs.forEach((log: any) => {
          // Day of week analysis
          const dayOfWeek = new Date(log.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
          dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;
          
          // Location analysis
          if (log.location) {
            const locationName = typeof log.location === 'string' ? log.location : log.location.name || log.location;
            const brandLocationKey = `${log.brand} - ${locationName}`;
            locationCounts[brandLocationKey] = (locationCounts[brandLocationKey] || 0) + 1;
            uniqueLocations.add(brandLocationKey);
          }
          
          totalQuantity += log.quantity;
          logCount++;
        });
        
        // Find favorite day of week
        const favoriteDayOfWeek = Object.keys(dayOfWeekCounts).reduce((a, b) => 
          dayOfWeekCounts[a] > dayOfWeekCounts[b] ? a : b, 'Monday'
        );
        
        // Find favorite location
        const favoriteLocation = Object.keys(locationCounts).reduce((a, b) => 
          locationCounts[a] > locationCounts[b] ? a : b, 'Not specified'
        );
        
        // Calculate averages
        const averageConeysPerSitting = logCount > 0 ? Math.round((totalQuantity / logCount) * 10) / 10 : 0;
        const averageConeysPerWeek = logs.length > 0 ? Math.round((totalQuantity / Math.max(1, Math.ceil((now.getTime() - new Date(logs[logs.length-1].createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)))) * 10) / 10 : 0;
        
        // Calculate longest break between coneys
        let longestBreakBetweenConeys = 0;
        if (sortedLogs.length > 1) {
          for (let i = 1; i < sortedLogs.length; i++) {
            const daysDiff = Math.floor((new Date(sortedLogs[i].createdAt).getTime() - new Date(sortedLogs[i-1].createdAt).getTime()) / (24 * 60 * 60 * 1000));
            longestBreakBetweenConeys = Math.max(longestBreakBetweenConeys, daysDiff);
          }
        }
        
        setChartData(chartData);
        setContributionData(contributionData);
        setAnalyticsData({
          totalConeys,
          thisMonthConeys,
          thisYearConeys,
          brandBreakdown,
          recentLogs: filteredLogs.slice(0, 10),
          averagePerMonth: logs.length > 0 ? Math.round(totalConeys / Math.max(1, Math.ceil((now.getTime() - new Date(logs[logs.length-1].createdAt).getTime()) / (30 * 24 * 60 * 60 * 1000)))) : 0,
          longestStreak,
          currentStreak,
          totalCalories,
          thisMonthCalories,
          thisYearCalories,
          // New statistics
          favoriteDayOfWeek,
          favoriteLocation,
          averageConeysPerSitting,
          averageConeysPerWeek,
          uniqueLocationsVisited: uniqueLocations.size,
          longestBreakBetweenConeys,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (logs: any[], timeFilter: string) => {
    const now = new Date();
    const data = [];
    
    if (timeFilter === 'this-week') {
      // Generate 7 days of data
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayLogs = logs.filter((log: any) => 
          log.createdAt.startsWith(dateStr)
        );
        
        const totalConeys = dayLogs.reduce((sum: number, log: any) => sum + log.quantity, 0);
        const brandBreakdown = dayLogs.reduce((acc: any, log: any) => {
          acc[log.brand] = (acc[log.brand] || 0) + log.quantity;
          return acc;
        }, {});
        
        data.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          coneys: totalConeys,
          brandBreakdown,
          fullDate: dateStr
        });
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
        
        const totalConeys = dayLogs.reduce((sum: number, log: any) => sum + log.quantity, 0);
        const brandBreakdown = dayLogs.reduce((acc: any, log: any) => {
          acc[log.brand] = (acc[log.brand] || 0) + log.quantity;
          return acc;
        }, {});
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          coneys: totalConeys,
          brandBreakdown,
          fullDate: dateStr
        });
      }
    } else if (timeFilter === 'this-year') {
      // Generate monthly data for the year
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toISOString().substring(0, 7);
        
        const monthLogs = logs.filter((log: any) => 
          log.createdAt.startsWith(monthStr)
        );
        
        const totalConeys = monthLogs.reduce((sum: number, log: any) => sum + log.quantity, 0);
        const brandBreakdown = monthLogs.reduce((acc: any, log: any) => {
          acc[log.brand] = (acc[log.brand] || 0) + log.quantity;
          return acc;
        }, {});
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          coneys: totalConeys,
          brandBreakdown,
          fullDate: monthStr
        });
      }
    } else {
      // Generate yearly data for all time
      const years = new Set(logs.map((log: any) => new Date(log.createdAt).getFullYear()));
      const sortedYears = Array.from(years).sort();
      
      for (const year of sortedYears) {
        const yearLogs = logs.filter((log: any) => 
          new Date(log.createdAt).getFullYear() === year
        );
        
        const totalConeys = yearLogs.reduce((sum: number, log: any) => sum + log.quantity, 0);
        const brandBreakdown = yearLogs.reduce((acc: any, log: any) => {
          acc[log.brand] = (acc[log.brand] || 0) + log.quantity;
          return acc;
        }, {});
        
        data.push({
          date: year.toString(),
          coneys: totalConeys,
          brandBreakdown,
          fullDate: year.toString()
        });
      }
    }
    
    return data;
  };

  const generateContributionData = (logs: any[], year: number) => {
    const contributionMap = new Map<string, number>();
    
    // Count coneys per day
    logs.forEach((log: any) => {
      const logDate = new Date(log.createdAt);
      if (logDate.getFullYear() === year) {
        const dateStr = logDate.toISOString().split('T')[0];
        contributionMap.set(dateStr, (contributionMap.get(dateStr) || 0) + log.quantity);
      }
    });
    
    // Convert to array format
    return Array.from(contributionMap.entries()).map(([date, count]) => ({
      date,
      count
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const brandBreakdown = data.brandBreakdown;
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-lg font-bold text-chili-red mb-3">
            {data.coneys} {data.coneys === 1 ? 'coney' : 'coneys'}
          </p>
          {Object.keys(brandBreakdown).length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Brand Breakdown:</p>
              {Object.entries(brandBreakdown).map(([brand, count]) => (
                <div key={brand} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">{brand}</span>
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
          <p className="text-gray-600">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-red-500">
                Back
              </Button>
            </Link>
            <div className="flex-1 flex justify-center">
              <img src="/ConeyCounterLogo_Medium.png" alt="Coney Counter" className="h-8 w-auto max-w-[200px]" />
            </div>
            <div className="w-32"></div> {/* Spacer to balance the back button */}
          </div>
        </div>
      </header>


      {/* Time Period Filters */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <Segmented
              value={timeFilter}
              onChange={setTimeFilter}
              options={[
                { label: 'This Week', value: 'this-week' },
                { label: 'This Month', value: 'this-month' },
                { label: 'Year To Date', value: 'this-year' },
                { label: 'All Time', value: 'all-time' },
              ]}
              size="large"
              className="bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Main Analytics */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="mb-8">
          <Title level={2} className="text-gray-900 mb-6">Key Metrics</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
              <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title="Total Coneys"
                  value={analyticsData.totalConeys}
                  prefix="🌭"
                  valueStyle={{ color: '#B22222', fontSize: '2rem' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={getCurrentMonth()}
                  value={analyticsData.thisMonthConeys}
                  prefix="📅"
                  valueStyle={{ color: '#FFD447', fontSize: '2rem' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="text-center shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title="Avg/Month"
                  value={analyticsData.averagePerMonth}
                  prefix="📊"
                  valueStyle={{ color: '#1C3FAA', fontSize: '2rem' }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Brand Breakdown */}
        <div className="mb-8">
          <Title level={3} className="text-gray-900 mb-6">Brand Breakdown ({timeFilter === 'this-week' ? 'This Week' : timeFilter === 'this-month' ? getCurrentMonth() : timeFilter === 'this-year' ? 'Year To Date' : 'All Time'})</Title>
          <Card className="shadow-sm">
            {Object.keys(analyticsData.brandBreakdown).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(analyticsData.brandBreakdown)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([brand, count]) => {
                    const totalConeys = Object.values(analyticsData.brandBreakdown).reduce((sum: number, c: any) => sum + c, 0);
                    const percentage = ((count as number) / totalConeys * 100).toFixed(1);
                    const brandColor = brandColors[brand as keyof typeof brandColors] || generateRandomColor(brand);
                    
                    return (
                      <div key={brand} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: brandColor }}
                            ></div>
                            <span className="font-semibold text-gray-900">{brand}</span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">{percentage}%</span>
                        </div>
                        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: brandColor
                            }}
                          ></div>
                          <div 
                            className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm"
                            style={{ 
                              left: `calc(${percentage}% - 4px)`,
                              backgroundColor: 'white'
                            }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500 text-right">
                          {count as number} {count === 1 ? 'coney' : 'coneys'}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChartOutlined className="text-6xl text-gray-300 mb-4" />
                <Title level={4} className="text-gray-500">No data for selected filters</Title>
                <Paragraph className="text-gray-400">
                  Try adjusting your filters to see brand breakdown data.
                </Paragraph>
              </div>
            )}
          </Card>
        </div>

        {/* Dashed Line Separator */}
        <div className="mb-8">
          <div className="border-t border-dashed border-gray-300"></div>
        </div>

        {/* Recent Logs */}
        <div className="mb-8">
          <Title level={3} className="text-gray-900 mb-6">Recent Activity</Title>
          <Card className="shadow-sm">
            <div className="px-2 md:px-0">
              <Table
                columns={recentLogsColumns}
                dataSource={analyticsData.recentLogs}
                pagination={false}
                rowKey="id"
                size="small"
                scroll={{ x: 400 }}
              />
            </div>
          </Card>
        </div>

        {/* Contribution Chart */}
        <div className="mb-8">
          <ContributionChart 
            data={contributionData} 
            year={new Date().getFullYear()} 
          />
        </div>

        {/* Fun Statistics Grid */}
        <div className="mb-8">
          <Title level={3} className="text-gray-900 mb-6">Fun Statistics</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                <Statistic
                  title="Your Coney Day"
                  value={analyticsData.favoriteDayOfWeek}
                  prefix="📅"
                  valueStyle={{ color: '#3B82F6', fontSize: '1.5rem' }}
                />
                <div className="text-sm text-gray-500 mt-2">
                  Most frequent day for coneys
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                <Statistic
                  title="Favorite Location"
                  value={analyticsData.favoriteLocation}
                  prefix="📍"
                  valueStyle={{ color: '#10B981', fontSize: '1.5rem' }}
                />
                <div className="text-sm text-gray-500 mt-2">
                  Most visited spot
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                <Statistic
                  title="Avg Coneys per Sitting"
                  value={analyticsData.averageConeysPerSitting}
                  prefix="🍽️"
                  valueStyle={{ color: '#8B5CF6', fontSize: '1.5rem' }}
                />
                <div className="text-sm text-gray-500 mt-2">
                  Average per log entry
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                <Statistic
                  title="Avg Coneys per Week"
                  value={analyticsData.averageConeysPerWeek}
                  prefix="📊"
                  valueStyle={{ color: '#F97316', fontSize: '1.5rem' }}
                />
                <div className="text-sm text-gray-500 mt-2">
                  Weekly consumption rate
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-cyan-500">
                <Statistic
                  title="Unique Locations"
                  value={analyticsData.uniqueLocationsVisited}
                  prefix="🏪"
                  valueStyle={{ color: '#06B6D4', fontSize: '1.5rem' }}
                />
                <div className="text-sm text-gray-500 mt-2">
                  Different spots visited
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                <Statistic
                  title="Longest Break"
                  value={analyticsData.longestBreakBetweenConeys}
                  prefix="⏰"
                  valueStyle={{ color: '#EF4444', fontSize: '1.5rem' }}
                  suffix="days"
                />
                <div className="text-sm text-gray-500 mt-2">
                  Between coney sessions
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Nutritional Statistics */}
        <div className="mb-8">
          <Title level={3} className="text-gray-900 mb-6">Health & Nutrition</Title>
          <Card className="shadow-sm">
            <Collapse 
              ghost
              expandIconPosition="right"
              className="nutrition-collapse"
            >
              <Panel 
                header={
                  <div className="flex items-center space-x-3">
                    <ExclamationCircleOutlined className="text-orange-500 text-xl" />
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        View Estimated Coney Calorie Intake?
                      </div>
                      <div className="text-sm text-gray-600">
                        These rough estimates might surprise you with how many coney calories you&apos;ve consumed. Click to show.
                      </div>
                    </div>
                  </div>
                }
                key="calories"
                className="nutrition-panel"
              >
                <div className="pt-4">
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={8}>
                      <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                        <Statistic
                          title="Estimated All Time Calories"
                          value={analyticsData.totalCalories.toLocaleString()}
                          suffix="cal"
                          prefix="🔥"
                          valueStyle={{ color: '#DC2626', fontSize: '1.8rem' }}
                        />
                        <div className="text-sm text-gray-500 mt-2">
                          From {analyticsData.totalConeys} coneys
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          ~{analyticsData.totalCalories.toLocaleString()} calories
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                        <Statistic
                          title="Estimated This Year Calories"
                          value={analyticsData.thisYearCalories.toLocaleString()}
                          suffix="cal"
                          prefix="📅"
                          valueStyle={{ color: '#EA580C', fontSize: '1.8rem' }}
                        />
                        <div className="text-sm text-gray-500 mt-2">
                          From {analyticsData.thisYearConeys} coneys
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          ~{analyticsData.thisYearCalories.toLocaleString()} calories
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Card className="text-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
                        <Statistic
                          title="Estimated This Month Calories"
                          value={analyticsData.thisMonthCalories.toLocaleString()}
                          suffix="cal"
                          prefix="🌭"
                          valueStyle={{ color: '#EAB308', fontSize: '1.8rem' }}
                        />
                        <div className="text-sm text-gray-500 mt-2">
                          From {analyticsData.thisMonthConeys} coneys
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          ~{analyticsData.thisMonthCalories.toLocaleString()} calories
                        </div>
                      </Card>
                    </Col>
                  </Row>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 text-center">
                      <div className="mb-2">
                        <strong>Estimation Methodology:</strong> The average calorie count for one coney is around 320-335 calories, 
                        so we estimate every coney as ~328 calories. These are rough estimates and this methodology is planned to be made more accurate in the future.
                      </div>
                      <div className="text-gray-400">
                        * Calorie estimates are based on typical Cincinnati-style cheese coneys and may vary significantly by brand and preparation.
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </Card>
        </div>
      </main>
    </div>
  );
}
