'use client';

import { Button, Card, Typography, Row, Col, Space, Select, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Add CSS for styling
const stylingCSS = `
  .floating-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  }
  
  .analytics-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: none !important;
    border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }

  .analytics-card:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.15);
  }

  .analytics-card:active {
    transform: translateY(0px) scale(0.98);
    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* White text for all content inside analytics cards */
  .analytics-card .ant-statistic-title,
  .analytics-card .ant-statistic-content,
  .analytics-card .ant-statistic-content-value,
  .analytics-card .ant-statistic-content-suffix,
  .analytics-card .ant-statistic-content-prefix,
  .analytics-card h1,
  .analytics-card h2,
  .analytics-card h3,
  .analytics-card h4,
  .analytics-card h5,
  .analytics-card h6,
  .analytics-card p,
  .analytics-card span,
  .analytics-card div,
  .analytics-card .ant-table,
  .analytics-card .ant-table-thead > tr > th,
  .analytics-card .ant-table-tbody > tr > td,
  .analytics-card .ant-collapse,
  .analytics-card .ant-collapse-header,
  .analytics-card .ant-collapse-content,
  .analytics-card .ant-collapse-content-box {
    color: white !important;
  }

  /* Force all section titles to be white */
  .ant-typography h1,
  .ant-typography h2,
  .ant-typography h3,
  .ant-typography h4,
  .ant-typography h5,
  .ant-typography h6,
  h1, h2, h3, h4, h5, h6,
  .ant-typography,
  .ant-typography-title {
    color: white !important;
  }

  /* Specific targeting for Ant Design Typography components */
  .ant-typography.ant-typography-h1,
  .ant-typography.ant-typography-h2,
  .ant-typography.ant-typography-h3,
  .ant-typography.ant-typography-h4,
  .ant-typography.ant-typography-h5,
  .ant-typography.ant-typography-h6 {
    color: white !important;
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = stylingCSS;
  document.head.appendChild(style);
}

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
    <div 
      className="min-h-screen text-white"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E40AF 15%, #0C4A6E 30%, #064E3B 45%, #022C22 60%, #7F1D1D 75%, #450A0A 100%)' }}
    >
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading leaderboards...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Navigation Header */}
          <header className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="floating-card p-4">
                <div className="flex items-center justify-between relative">
                  <Link href="/dashboard">
                    <Button type="text" icon={<ArrowLeftOutlined />} className="text-white hover:text-white">
                      Back
                    </Button>
                  </Link>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <img src="/ConeyCounter_LogoWordmark_White.png" alt="Coney Counter" className="h-8 w-auto max-w-[200px]" />
                  </div>
                  <div className="w-32"></div> {/* Spacer to balance the back button */}
                </div>
              </div>
            </div>
          </header>

          {/* Centered Filter */}
          <div className="pt-24 pb-4">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg border border-white/20">
                  {[
                    { key: 'this-month', label: 'This Month' },
                    { key: 'this-year', label: 'This Year' },
                    { key: 'all-time', label: 'All Time' }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSelectedFilter(option.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedFilter === option.key
                          ? 'bg-red-500 text-white'
                          : 'text-white hover:text-white hover:bg-white/20'
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
          <div className="pt-4 pb-8">
            <div className="max-w-7xl mx-auto px-4">
              <Row gutter={[16, 16]}>
                {brands.map((brand) => {
                  const users = getVisibleUsers(brand.key);
                  const totalUsers = leaderboardData[brand.key]?.length || 0;
                  const hasMore = totalUsers > users.length;
                  
                  return (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8} key={brand.key}>
                      <Card className="analytics-card h-full">
                        <div className="flex items-center justify-between mb-4">
                          <Title level={4} className="mb-0 text-white">{brand.label}</Title>
                          <Tag color="default" className="text-xs bg-white/20 text-white border-white/30">
                            {totalUsers} players
                          </Tag>
                        </div>
                        
                        {/* Column Headers */}
                        <div className="grid grid-cols-[40px_1fr_50px] gap-1 text-xs font-semibold text-white/70 mb-2 pb-2 border-b border-white/20">
                          <div className="text-left">Place</div>
                          <div className="text-left">Name</div>
                          <div className="text-right">Coneys</div>
                        </div>
                        
                        {/* User Rows */}
                        <div className="space-y-1">
                          {users.map((user, index) => (
                            <div 
                              key={user.userId || index}
                              className={`grid grid-cols-[40px_1fr_50px] gap-1 py-1 px-2 rounded text-xs hover:bg-white/10 ${
                                isCurrentUser(user) ? 'bg-blue-500/20 font-bold' : ''
                              }`}
                            >
                              <div className="text-left text-white/80">
                                #{user.rank || index + 1}
                              </div>
                              <div className="text-left">
                                <div className="flex items-center">
                                  <div className="truncate max-w-[80px] text-white">
                                    {user.name || 'Anonymous'}
                                  </div>
                                  {user.currentLevel && (
                                    <span className="text-white/60 ml-1 flex-shrink-0">(Lv. {user.currentLevel})</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right font-semibold text-white">
                                {user.totalConeys || 0}
                              </div>
                            </div>
                          ))}
                          
                          {/* Show current user separately if not in top 20 */}
                          {shouldShowCurrentUserSeparately(brand.key) && (
                            <>
                              <div className="border-t border-white/20 my-2"></div>
                              <div className="grid grid-cols-[40px_1fr_50px] gap-1 py-1 px-2 rounded text-xs bg-blue-500/20 font-bold border border-blue-400/30">
                                <div className="text-left text-blue-300">
                                  #{getCurrentUserRank(brand.key)?.rank}
                                </div>
                                <div className="text-left">
                                  <div className="flex items-center">
                                    <div className="truncate max-w-[80px] text-white">
                                      {getCurrentUserRank(brand.key)?.name || 'You'}
                                    </div>
                                    {getCurrentUserRank(brand.key)?.currentLevel && (
                                      <span className="text-blue-300 ml-1 flex-shrink-0">(Lv. {getCurrentUserRank(brand.key)?.currentLevel})</span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right font-semibold text-blue-300">
                                  {getCurrentUserRank(brand.key)?.totalConeys || 0}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* Show More Button */}
                        {hasMore && (
                          <div className="mt-4 pt-3 border-t border-white/20">
                            <Button 
                              type="link" 
                              size="small" 
                              className="w-full text-xs text-white hover:text-white"
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
