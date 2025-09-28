'use client';

import { Button, Card, Typography, Row, Col, Space, Select, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const { Title, Text } = Typography;
const { Option } = Select;

export default function LeaderboardsPage() {
  const { data: session } = useSession();
  const [selectedFilter, setSelectedFilter] = useState('all-time');
  const [leaderboardData, setLeaderboardData] = useState<Record<string, any[]>>({});
  const [expandedBrands, setExpandedBrands] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const brands = [
    { key: 'all-brands', label: 'All', color: 'blue' },
    { key: 'skyline', label: 'Skyline', color: 'red' },
    { key: 'gold-star', label: 'Gold Star', color: 'gold' },
    { key: 'dixie', label: 'Dixie', color: 'orange' },
    { key: 'camp-washington', label: 'Camp Washington', color: 'green' },
    { key: 'empress', label: 'Empress', color: 'purple' },
    { key: 'price-hill', label: 'Price Hill', color: 'cyan' },
    { key: 'pleasant-ridge', label: 'Pleasant Ridge', color: 'magenta' },
    { key: 'blue-ash', label: 'Blue Ash', color: 'blue' },
    { key: 'other', label: 'Other', color: 'default' }
  ];

  useEffect(() => {
    fetchAllLeaderboardData();
  }, [selectedFilter]);

  const fetchAllLeaderboardData = async () => {
    try {
      setLoading(true);
      const allData: Record<string, any[]> = {};
      
      // Fetch data for each brand
      for (const brand of brands) {
        const params = new URLSearchParams({
          filter: selectedFilter,
          brand: brand.key,
        });
        
        const response = await fetch(`/api/leaderboard?${params}`);
        if (response.ok) {
          const data = await response.json();
          allData[brand.key] = data.leaderboard || [];
        }
      }
      
      setLeaderboardData(allData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (brandKey: string) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brandKey]: (prev[brandKey] || 20) + 20
    }));
  };

  const getVisibleUsers = (brandKey: string) => {
    const users = leaderboardData[brandKey] || [];
    const limit = expandedBrands[brandKey] || 20;
    return users.slice(0, limit);
  };

  const isCurrentUser = (user: any) => {
    return session?.user?.id === user.userId;
  };

  const getCurrentUserRank = (brandKey: string) => {
    const users = leaderboardData[brandKey] || [];
    return users.find(user => session?.user?.id === user.userId);
  };

  const shouldShowCurrentUserSeparately = (brandKey: string) => {
    const users = leaderboardData[brandKey] || [];
    const currentUser = getCurrentUserRank(brandKey);
    const limit = expandedBrands[brandKey] || 20;
    
    if (!currentUser) return false;
    
    // Show separately if user is not in the visible range and not already shown
    const userIndex = users.findIndex(user => user.userId === currentUser.userId);
    return userIndex >= limit && userIndex < users.length;
  };


  return (
    <div className="min-h-screen bg-white text-gray-900">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leaderboards...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Navigation Header */}
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/dashboard">
                  <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-red-500">
                    Back to Dashboard
                  </Button>
                </Link>
                <div className="flex-1 flex justify-center">
                  <img src="/ConeyCounterLogo_Medium.png" alt="Coney Counter" className="h-8 w-auto max-w-[200px]" />
                </div>
                <div className="w-32"></div> {/* Spacer to balance the back button */}
              </div>
            </div>
          </header>

          {/* Centered Filter */}
          <div className="bg-gray-50 border-b border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center">
                <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm border">
                  {[
                    { key: 'all-time', label: 'All Time' },
                    { key: 'this-month', label: 'This Month' },
                    { key: 'this-year', label: 'This Year' }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSelectedFilter(option.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedFilter === option.key
                          ? 'bg-red-500 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Brand Columns */}
          <div className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <Row gutter={[16, 16]}>
                {brands.map((brand) => {
                  const users = getVisibleUsers(brand.key);
                  const totalUsers = leaderboardData[brand.key]?.length || 0;
                  const hasMore = totalUsers > users.length;
                  
                  return (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8} key={brand.key}>
                      <Card className="h-full border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <Title level={4} className="mb-0">{brand.label}</Title>
                          <Tag color="default" className="text-xs bg-gray-100 text-gray-600 border-gray-200">
                            {totalUsers} players
                          </Tag>
                        </div>
                        
                        {/* Column Headers */}
                        <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 mb-2 pb-2 border-b">
                          <div className="text-left">Place</div>
                          <div className="text-center">Name</div>
                          <div className="text-right">Coneys</div>
                        </div>
                        
                        {/* User Rows */}
                        <div className="space-y-1">
                          {users.map((user, index) => (
                            <div 
                              key={user.userId || index}
                              className={`grid grid-cols-3 gap-2 py-1 px-2 rounded text-xs hover:bg-gray-50 ${
                                isCurrentUser(user) ? 'bg-blue-50 font-bold' : ''
                              }`}
                            >
                              <div className="text-left text-gray-600">
                                #{user.rank || index + 1}
                              </div>
                              <div className="text-center truncate">
                                {user.name || 'Anonymous'}
                              </div>
                              <div className="text-right font-semibold text-red-500">
                                {user.totalConeys || 0}
                              </div>
                            </div>
                          ))}
                          
                          {/* Show current user separately if not in top 20 */}
                          {shouldShowCurrentUserSeparately(brand.key) && (
                            <>
                              <div className="border-t border-gray-200 my-2"></div>
                              <div className="grid grid-cols-3 gap-2 py-1 px-2 rounded text-xs bg-blue-50 font-bold border border-blue-200">
                                <div className="text-left text-blue-600">
                                  #{getCurrentUserRank(brand.key)?.rank}
                                </div>
                                <div className="text-center truncate text-blue-900">
                                  {getCurrentUserRank(brand.key)?.name || 'You'}
                                </div>
                                <div className="text-right font-semibold text-blue-600">
                                  {getCurrentUserRank(brand.key)?.totalConeys || 0}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* Show More Button */}
                        {hasMore && (
                          <div className="mt-4 pt-3 border-t">
                            <Button 
                              type="link" 
                              size="small" 
                              className="w-full text-xs"
                              onClick={() => toggleExpand(brand.key)}
                            >
                              Show More ({totalUsers - users.length} more)
                            </Button>
                          </div>
                        )}
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
