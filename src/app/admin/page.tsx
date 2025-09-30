'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Dropdown, Menu, Statistic, Segmented } from 'antd';
import { UserOutlined, EyeOutlined, BarChartOutlined, SettingOutlined, FileImageOutlined, DownOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <SettingOutlined className="text-chili-red text-xl" />
                <Title level={4} className="text-chili-red mb-0 whitespace-nowrap">Admin Dashboard</Title>
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
                  <Menu.Item key="training-data" icon={<FileImageOutlined />}>
                    <Link href="/admin/training-data">Training Data</Link>
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
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-48 relative"
              actions={[
                <Link href="/admin/users" key="view">
                  <Button type="primary" icon={<UserOutlined />}>
                    Manage Users
                  </Button>
                </Link>
              ]}
            >
              {/* Pending Users Indicator */}
              {stats?.users.pending && stats.users.pending > 0 && (
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <UserOutlined className="text-3xl text-blue-500 mb-3" />
                <Title level={4} className="mb-2">User Management</Title>
                <Paragraph className="text-gray-600 text-sm">
                  View and manage user accounts, roles, and permissions.
                  {stats?.users.pending && stats.users.pending > 0 && (
                    <span className="block text-red-600 font-medium mt-1">
                      {stats.users.pending} user{stats.users.pending !== 1 ? 's' : ''} pending approval
                    </span>
                  )}
                </Paragraph>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-48"
              actions={[
                <Link href="/admin/ocr-analytics" key="view">
                  <Button type="primary" icon={<EyeOutlined />}>
                    View OCR Analytics
                  </Button>
                </Link>
              ]}
            >
              <div className="text-center">
                <EyeOutlined className="text-3xl text-green-500 mb-3" />
                <Title level={4} className="mb-2">OCR Analytics</Title>
                <Paragraph className="text-gray-600 text-sm">
                  Monitor OCR performance, success rates, and training data quality.
                </Paragraph>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-48"
              actions={[
                <Link href="/admin/training-data" key="view">
                  <Button type="primary" icon={<FileImageOutlined />}>
                    Manage Training Data
                  </Button>
                </Link>
              ]}
            >
              <div className="text-center">
                <FileImageOutlined className="text-3xl text-purple-500 mb-3" />
                <Title level={4} className="mb-2">Training Data</Title>
                <Paragraph className="text-gray-600 text-sm">
                  View, export, and manage receipt images collected for OCR training.
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row gutter={[24, 24]} className="mt-8">
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="Total Users"
                value={stats?.users.total || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="Coneys Logged"
                value={stats?.coneys.total || 0}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="OCR Attempts"
                value={stats?.ocr.totalAttempts || 0}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="OCR Success Rate"
                value={stats?.ocr.successRate || 0}
                suffix="%"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
}
