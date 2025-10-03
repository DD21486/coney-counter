'use client';

import { Button, Card, Row, Col, Typography, Space, Avatar, Badge, Input, message, notification } from 'antd';
import { TrophyOutlined, BarChartOutlined, HeartOutlined, TeamOutlined, LoginOutlined, UserAddOutlined, CheckCircleOutlined, StarOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import ConeyPreloader from '@/components/ConeyPreloader';

const { Title, Paragraph, Text } = Typography;

interface PublicStats {
  totalUsers: number;
  totalConeys: number;
  totalLogs: number;
  recentActivity: number;
  topBrands: Array<{
    name: string;
    totalConeys: number;
    totalLogs: number;
  }>;
  topUsers: Array<{
    name: string;
    image?: string;
    totalConeys: number;
    currentLevel?: number;
  }>;
}

export default function LandingPage() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  // White overlay state
  const [showOverlay, setShowOverlay] = useState(true);

  // Get current month name (using UTC to match server-side filtering)
  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/public-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching public stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // White overlay timer
  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 1500); // Increased from 1000ms to 1500ms (added 500ms)
    return () => clearTimeout(timer);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setEmailLoading(true);
    try {
      const response = await fetch('/api/alpha-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setEmailSubmitted(true);
        setEmail('');
        // Track analytics event
        analytics.joinWaitlist(email);
      } else {
        message.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .animated-gradient {
          background: linear-gradient(-45deg, #ef4444, #3b82f6, #8b5cf6, #06b6d4, #10b981, #f59e0b);
          background-size: 400% 400%;
          animation: gradientShift 3s ease infinite;
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .white-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          z-index: 9999;
          opacity: 1;
          transition: opacity 1s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .white-overlay.fade-out {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>

      {/* Navigation */}
      <div className="min-h-screen bg-white">
      {/* Floating Pill Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-100 px-4 sm:px-8 py-3 flex items-center justify-between w-auto min-w-[320px] sm:min-w-[600px] z-50">
        <div className="flex items-center">
          <img src="/ConeyCounterLogo_Medium.png" alt="Coney Counter" className="h-6 sm:h-8" />
        </div>
        <div className="flex items-center">
          <Link href="/auth/signin">
            <Button type="primary" className="coney-button-animated px-4 sm:px-6 text-sm sm:text-base">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-20 lg:pt-16 pb-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-center max-w-2xl mx-auto lg:mx-0 lg:text-left">
            <Button size="small" className="bg-chili-red text-white border-chili-red mb-6">
              Alpha: Invite Only
            </Button>
            
            <Title level={1} className="text-8xl font-bold mb-6 text-gray-900 coney-logo" style={{ fontSize: '3rem', lineHeight: '1.1' }}>
              Crush, Count & Conquer
            </Title>
            
            <Paragraph className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track, stack, and earn coney achievements.
            </Paragraph>
            
            {/* Waitlist Form */}
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="text-sm text-gray-600 font-medium mb-4 text-center lg:text-left">
                Sign up to join the waitlist
              </div>
              <div className="text-xs text-gray-500 mb-3 text-center lg:text-left">
                Note: Email addresses are case sensitive
              </div>
              <div className="text-xs text-orange-600 mb-3 text-center lg:text-left font-medium">
                Alpha Testing: Google accounts only
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onPressEnter={handleEmailSubmit}
                  prefix={<MailOutlined className="text-gray-400" />}
                  className="flex-1"
                />
                <Button 
                  type="primary" 
                  onClick={handleEmailSubmit}
                  loading={emailLoading}
                  className="coney-button-animated px-6"
                >
                  Join Waitlist
                </Button>
              </div>
              
              {/* Success Message */}
              {emailSubmitted && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 text-lg mr-3" />
                    <div>
                      <div className="text-green-800 font-semibold">Welcome to the Waitlist!</div>
                      <div className="text-green-700 text-sm mt-1">
                        You've been added to our alpha waitlist. We'll notify you when access becomes available.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>
            
            {/* Large Coney SVG */}
            <div className="hidden lg:block relative w-[400px] h-[400px] flex items-center justify-center">
              <img 
                src="/Coney_color.svg" 
                alt="Coney Counter" 
                className="w-[350px] h-[350px] drop-shadow-2xl hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out coney-animated"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Title level={2} className="text-4xl font-bold text-gray-900 mb-4">How It Works</Title>
            <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track coneys through receipt verification, earn achievements, and compete with other coney crushers
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} lg={8}>
              <Card className="border-0 shadow-sm">
                <div className="text-center">
                  <div className="w-80 h-80 mx-auto">
                    <img src="/Leaderboards_illustration.png" alt="Compete & Win" className="w-full h-full object-contain" />
                  </div>
                  <div className="px-6">
                    <Title level={3} className="mb-4">Compete on Leaderboards</Title>
                  <Paragraph className="text-gray-600">
                    See how you stack up against other coney crushers in Cincinnati. 
                    Climb the rankings and prove you're the ultimate coney connoisseur!
                  </Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="border-0 shadow-sm">
                <div className="text-center">
                  <div className="w-80 h-80 mx-auto">
                    <img src="/Chart_illustration.png" alt="Track Your Journey" className="w-full h-full object-contain" />
                  </div>
                  <div className="px-6">
                    <Title level={3} className="mb-4">Earn Achievements</Title>
                  <Paragraph className="text-gray-600">
                    Unlock badges for visiting different chili parlors, crushing milestone coneys, 
                    and completing challenges. Show off your coney expertise!
                  </Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="border-0 shadow-sm">
                <div className="text-center">
                  <div className="w-80 h-80 mx-auto">
                    <img src="/Culture_illustration.png" alt="Celebrate Culture" className="w-full h-full object-contain" />
                  </div>
                  <div className="px-6">
                    <Title level={3} className="mb-4">Track Your Journey</Title>
                  <Paragraph className="text-gray-600">
                    See your coney consumption patterns, favorite brands, and personal milestones. 
                    Data-driven insights into your Cincinnati food adventure.
                  </Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[48, 24]} className="text-center">
            <Col xs={24} sm={8}>
              <div className="py-8">
                <Title level={1} className="text-4xl font-bold text-chili-red mb-2">
                  {loading ? '...' : stats ? `${stats.totalUsers.toLocaleString()}+` : '2,500+'}
                </Title>
                <Text className="text-lg text-gray-600">People Counting Coneys</Text>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="py-8">
                <Title level={1} className="text-4xl font-bold text-mustard-gold mb-2">
                  {loading ? '...' : stats ? `${stats.totalConeys.toLocaleString()}+` : '45,000+'}
                </Title>
                <Text className="text-lg text-gray-600">Coneys Logged</Text>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="py-8">
                <Title level={1} className="text-4xl font-bold text-skyline-blue mb-2">
                  {loading ? '...' : stats ? (stats.topBrands[0]?.name || 'Skyline Chili') : 'Skyline Chili'}
                </Title>
                <Text className="text-lg text-gray-600">This Month's Top Chili</Text>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Community Section */}
      {stats && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <Title level={2} className="text-4xl font-bold text-gray-900 mb-4">Join the Community</Title>
              <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto">
                See what's happening in the Cincinnati coney community
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <Card className="border-0 shadow-sm">
                  <Title level={3} className="mb-6 text-left flex items-center">
                    <img src="/Coney_color.svg" alt="Coney" className="w-6 h-6 mr-2" />
                    Top Parlours ({getCurrentMonth()})
                  </Title>
                  <div className="space-y-4">
                    {stats.topBrands.map((brand, index) => (
                      <div key={brand.name} className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 0 
                          ? 'animated-gradient' 
                          : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-white' : 'bg-chili-red'
                          }`}>
                            <span className={`font-bold text-sm ${
                              index === 0 ? 'text-gray-900' : 'text-white'
                            }`} style={index === 0 ? { fontFamily: 'Satoshi, sans-serif', fontWeight: 900 } : {}}>
                              {index === 0 ? '#1' : index + 1}
                            </span>
                          </div>
                          <span className={`font-semibold ${
                            index === 0 ? 'text-white' : 'text-gray-900'
                          }`}>{brand.name}</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            index === 0 ? 'text-white' : 'text-chili-red'
                          }`}>{brand.totalConeys}</div>
                          <div className={`text-xs ${
                            index === 0 ? 'text-gray-200' : 'text-gray-500'
                          }`}>coneys</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card className="border-0 shadow-sm">
                  <Title level={3} className="mb-6 text-left flex items-center">
                    <img src="/Coney_color.svg" alt="Coney" className="w-6 h-6 mr-2" />
                    Top Coney Counters ({getCurrentMonth()})
                  </Title>
                  <div className="space-y-4">
                    {stats.topUsers.map((user, index) => (
                      <div key={user.name} className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 0 
                          ? 'animated-gradient' 
                          : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-white' : 'bg-mustard-gold'
                          }`}>
                            <span className={`font-bold text-sm ${
                              index === 0 ? 'text-gray-900' : 'text-white'
                            }`} style={index === 0 ? { fontFamily: 'Satoshi, sans-serif', fontWeight: 900 } : {}}>
                              {index === 0 ? '#1' : index + 1}
                            </span>
                          </div>
                          <span className={`font-semibold ${
                            index === 0 ? 'text-white' : 'text-gray-900'
                          }`}>
                            {user.name}
                            {user.currentLevel && (
                              <span className={`ml-1 text-sm ${
                                index === 0 ? 'text-gray-200' : 'text-gray-500'
                              }`}>
                                ({user.currentLevel})
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            index === 0 ? 'text-white' : 'text-mustard-gold'
                          }`}>{user.totalConeys}</div>
                          <div className={`text-xs ${
                            index === 0 ? 'text-gray-200' : 'text-gray-500'
                          }`}>coneys</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
      )}

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
    
    {/* White Overlay */}
    <div className={`white-overlay ${!showOverlay ? 'fade-out' : ''}`}>
      <ConeyPreloader isVisible={showOverlay} />
    </div>
    </>
  );
}
