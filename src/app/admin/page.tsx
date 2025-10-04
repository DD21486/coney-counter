'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Dropdown, Menu, Statistic, Segmented } from 'antd';
import { UserOutlined, EyeOutlined, BarChartOutlined, SettingOutlined, DownOutlined, ArrowLeftOutlined, ClockCircleOutlined, ExperimentOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Paragraph } = Typography;

interface AdminStats {
  users: {
    total: number;
    approved: number;
    pending: number;
  };
  coneys: {
    total: number;
  };
  ocr: {
    totalAttempts: number;
    successfulAttempts: number;
    successRate: number;
  };
}

interface AnalyticsData {
  totalConeys: number;
  totalUsers: number;
  chartData: Array<{
    period: string;
    coneys: number;
    users: number;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('year');

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch admin stats');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        console.error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between md:hidden">
            <Link href="/dashboard">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="flex items-center space-x-1">
              <SettingOutlined className="text-chili-red text-lg" />
              <Title level={5} className="text-chili-red mb-0">Admin Dashboard</Title>
            </div>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="dashboard" icon={<SettingOutlined />}>
                    <Link href="/admin">Dashboard</Link>
                  </Menu.Item>
                  <Menu.Item key="users" icon={<UserOutlined />}>
                    <Link href="/admin/users">User Management</Link>
                  </Menu.Item>
                  <Menu.Item key="ocr-analytics" icon={<EyeOutlined />}>
                    <Link href="/admin/ocr-analytics">OCR Analytics</Link>
                  </Menu.Item>
                  <Menu.Item key="activity-log" icon={<ClockCircleOutlined />}>
                    <Link href="/admin/activity-log">Activity Log</Link>
                  </Menu.Item>
                  <Menu.Item key="brand-training" icon={<ExperimentOutlined />}>
                    <Link href="/admin/brand-training">Brand Training</Link>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
            >
              <Button type="primary" size="small" className="bg-chili-red hover:bg-red-700 border-chili-red hover:border-red-700">
                <SettingOutlined />
              </Button>
            </Dropdown>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <SettingOutlined className="text-chili-red text-xl" />
                <Title level={4} className="text-chili-red mb-0">Admin Dashboard</Title>
              </div>
            </div>
            
            {/* Admin Navigation Menu */}
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="dashboard" icon={<SettingOutlined />}>
                    <Link href="/admin">Dashboard</Link>
                  </Menu.Item>
                  <Menu.Item key="users" icon={<UserOutlined />}>
                    <Link href="/admin/users">User Management</Link>
                  </Menu.Item>
                  <Menu.Item key="ocr-analytics" icon={<EyeOutlined />}>
                    <Link href="/admin/ocr-analytics">OCR Analytics</Link>
                  </Menu.Item>
                  <Menu.Item key="activity-log" icon={<ClockCircleOutlined />}>
                    <Link href="/admin/activity-log">Activity Log</Link>
                  </Menu.Item>
                  <Menu.Item key="brand-training" icon={<ExperimentOutlined />}>
                    <Link href="/admin/brand-training">Brand Training</Link>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
            >
              <Button type="primary" className="bg-chili-red hover:bg-red-700 border-chili-red hover:border-red-700">
                Admin Sections <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Title level={2} className="text-gray-900 mb-2">Admin Dashboard</Title>
          <Paragraph className="text-gray-600">
            Manage your Coney Counter application and monitor system performance.
          </Paragraph>
        </div>

        {/* Analytics Dashboard */}
        <Card className="mb-8 shadow-sm border-0">
          <div className="flex justify-between items-start mb-4">
            {/* Metrics Display */}
            <div className="flex space-x-8">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats?.coneys.total || 0}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  CONEYS LOGGED
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats?.users.total || 0}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  TOTAL USERS
                </div>
              </div>
            </div>
            
            {/* Time Range Toggles */}
            <Segmented
              options={[
                { label: 'WEEK', value: 'week' },
                { label: 'MONTH', value: 'month' },
                { label: 'YEAR', value: 'year' }
              ]}
              value={timeRange}
              onChange={(value) => setTimeRange(value as 'week' | 'month' | 'year')}
              className="bg-gray-100"
            />
          </div>
          
          {/* Line Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="period" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="coneys" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  animationDuration={300}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className="flex justify-end space-x-6 mt-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Coneys</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Users</span>
            </div>
          </div>
        </Card>

        {/* Admin Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Link href="/admin/users">
              <Card hoverable className="h-24 cursor-pointer">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center">
                    <UserOutlined className="text-2xl text-blue-500 mr-3" />
                    <div>
                      <Title level={5} className="mb-0">User Management</Title>
                      <Paragraph className="text-gray-600 text-xs mb-0">
                        Manage user accounts and permissions
                      </Paragraph>
                    </div>
                  </div>
                  <div className="text-right">
                    {stats?.users.pending && stats.users.pending > 0 && (
                      <div className="text-red-600 font-bold text-lg">
                        {stats.users.pending}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={8}>
            <Link href="/admin/ocr-analytics">
              <Card hoverable className="h-24 cursor-pointer">
                <div className="flex items-center h-full">
                  <EyeOutlined className="text-2xl text-green-500 mr-3" />
                  <div>
                    <Title level={5} className="mb-0">OCR Analytics</Title>
                    <Paragraph className="text-gray-600 text-xs mb-0">
                      Monitor OCR performance and success rates
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={8}>
            <Link href="/admin/activity-log">
              <Card hoverable className="h-24 cursor-pointer">
                <div className="flex items-center h-full">
                  <ClockCircleOutlined className="text-2xl text-purple-500 mr-3" />
                  <div>
                    <Title level={5} className="mb-0">Activity Log</Title>
                    <Paragraph className="text-gray-600 text-xs mb-0">
                      View global coney logging activity
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link href="/admin/brand-training">
              <Card hoverable className="h-24 cursor-pointer">
                <div className="flex items-center h-full">
                  <ExperimentOutlined className="text-2xl text-green-500 mr-3" />
                  <div>
                    <Title level={5} className="mb-0">Brand Training</Title>
                    <Paragraph className="text-gray-600 text-xs mb-0">
                      Upload training images for OCR
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
        </Row>

      </main>
      
      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}
