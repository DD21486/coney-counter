'use client';

import { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Tag, Progress, Typography, Space, Button, DatePicker, Select, Dropdown, Menu } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, UserOutlined, FileImageOutlined, SettingOutlined, DownOutlined, BarChartOutlined } from '@ant-design/icons';
import Link from 'next/link';
// import { analytics } from '@/lib/analytics';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface OCRAnalyticsData {
  totalAttempts: number;
  successfulVerifications: number;
  failedVerifications: number;
  successRate: number;
  averageConfidence: number;
  coneyCountDistribution: { [key: number]: number };
  brandDistribution: { [key: string]: number };
  userStats: Array<{
    userId: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      username: string | null;
    };
    totalAttempts: number;
    totalConeys: number;
  }>;
  recentAttempts: Array<{
    id: string;
    timestamp: string;
    isCorrect: boolean;
    coneyCount: number | null;
    confidence: number;
    isValidReceipt: boolean;
    warnings: number;
    user: {
      id: string;
      name: string | null;
      email: string;
      username: string | null;
    };
    brand: string | null;
    location: string | null;
  }>;
}

export default function OCRAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<OCRAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [brandFilter, setBrandFilter] = useState<string>('all');

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange, brandFilter]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Track page view
      // try {
      //   analytics.track('ocr_analytics_page_viewed');
      // } catch (error) {
      //   console.warn('Analytics tracking failed:', error);
      // }

      // Fetch OCR analytics data
      const response = await fetch('/api/admin/ocr-analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        // Fallback to mock data if API fails
        const mockData: OCRAnalyticsData = {
          totalAttempts: 0,
          successfulVerifications: 0,
          failedVerifications: 0,
          successRate: 0,
          averageConfidence: 0,
          coneyCountDistribution: {},
          brandDistribution: {},
          recentAttempts: []
        };
        setAnalyticsData(mockData);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
      sorter: (a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => (
        <div>
          <div className="font-medium text-sm">
            {user.name || 'Unknown'}
            {user.username && (
              <span className="text-gray-500 font-normal"> ({user.username})</span>
            )}
          </div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      render: (brand: string | null) => brand || 'Not specified',
      filters: [
        { text: 'Skyline Chili', value: 'Skyline Chili' },
        { text: 'Gold Star Chili', value: 'Gold Star Chili' },
        { text: 'Not specified', value: null },
      ],
      onFilter: (value: string | null, record: any) => record.brand === value,
    },
    {
      title: 'Result',
      dataIndex: 'isCorrect',
      key: 'isCorrect',
      render: (isCorrect: boolean) => (
        <Tag color={isCorrect ? 'green' : 'red'} icon={isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {isCorrect ? 'Success' : 'Failed'}
        </Tag>
      ),
      filters: [
        { text: 'Success', value: true },
        { text: 'Failed', value: false },
      ],
      onFilter: (value: boolean, record: any) => record.isCorrect === value,
    },
    {
      title: 'Coney Count',
      dataIndex: 'coneyCount',
      key: 'coneyCount',
      render: (count: number | null) => count ? `${count} coneys` : 'Not detected',
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => (
        <Progress 
          percent={Math.round(confidence * 100)} 
          size="small" 
          strokeColor={confidence > 0.7 ? '#52c41a' : confidence > 0.5 ? '#faad14' : '#ff4d4f'}
        />
      ),
      sorter: (a: any, b: any) => a.confidence - b.confidence,
    },
    {
      title: 'Receipt Valid',
      dataIndex: 'isValidReceipt',
      key: 'isValidReceipt',
      render: (isValid: boolean) => (
        <Tag color={isValid ? 'blue' : 'orange'}>
          {isValid ? 'Valid' : 'Invalid'}
        </Tag>
      ),
    },
    {
      title: 'Warnings',
      dataIndex: 'warnings',
      key: 'warnings',
      render: (warnings: number) => warnings > 0 ? `${warnings} warnings` : 'None',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto mb-4"></div>
          <Text>Loading OCR Analytics...</Text>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Text type="danger">Failed to load analytics data</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between md:hidden">
            <Link href="/admin">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="flex items-center space-x-1">
              <EyeOutlined className="text-chili-red text-lg" />
              <Title level={5} className="text-chili-red mb-0">OCR Analytics</Title>
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
            <Link href="/admin">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <EyeOutlined className="text-chili-red text-xl" />
              <Title level={4} className="text-chili-red mb-0">OCR Analytics</Title>
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
          <Title level={2} className="text-gray-900 mb-2">OCR Performance Analytics</Title>
          <Text className="text-gray-600">
            Track the performance of our receipt OCR system and user verification results.
          </Text>
          {analyticsData && analyticsData.totalAttempts === 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Text className="text-blue-800">
                <strong>No OCR data yet.</strong> Upload receipt images through the "Log Coney" page to start collecting analytics data.
              </Text>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Space wrap>
            <div>
              <Text strong className="mr-2">Date Range:</Text>
              <RangePicker 
                value={dateRange}
                onChange={setDateRange}
                placeholder={['Start Date', 'End Date']}
              />
            </div>
            <div>
              <Text strong className="mr-2">Brand:</Text>
              <Select 
                value={brandFilter} 
                onChange={setBrandFilter}
                style={{ width: 150 }}
              >
                <Option value="all">All Brands</Option>
                <Option value="Skyline Chili">Skyline Chili</Option>
                <Option value="Gold Star Chili">Gold Star Chili</Option>
                <Option value="Unknown">Unknown</Option>
              </Select>
            </div>
            <Button onClick={loadAnalyticsData}>
              Refresh Data
            </Button>
          </Space>
        </Card>

        {/* Key Metrics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Attempts"
                value={analyticsData.totalAttempts}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Success Rate"
                value={analyticsData.successRate}
                suffix="%"
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Successful Verifications"
                value={analyticsData.successfulVerifications}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Failed Verifications"
                value={analyticsData.failedVerifications}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Additional Metrics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Average Confidence"
                value={Math.round(analyticsData.averageConfidence * 100)}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Most Common Count"
                value={Object.entries(analyticsData.coneyCountDistribution)
                  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                suffix="coneys"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Top Brand"
                value={Object.entries(analyticsData.brandDistribution)
                  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                valueStyle={{ color: '#13c2c2' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Training Images Saved"
                value={analyticsData.successfulVerifications}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
        </Row>

        {/* User Analytics */}
        <Card className="mb-6">
          <Title level={4} className="mb-4">User Analytics</Title>
          <Table
            columns={[
              {
                title: 'User',
                dataIndex: 'user',
                key: 'user',
                render: (user: any) => (
                  <div>
                    <div className="font-medium text-sm">
                      {user.name || 'Unknown'}
                      {user.username && (
                        <span className="text-gray-500 font-normal"> ({user.username})</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                ),
              },
              {
                title: 'Total Attempts',
                dataIndex: 'totalAttempts',
                key: 'totalAttempts',
                sorter: (a: any, b: any) => a.totalAttempts - b.totalAttempts,
                render: (attempts: number) => (
                  <span className="font-medium">{attempts}</span>
                ),
              },
              {
                title: 'Total Coneys',
                dataIndex: 'totalConeys',
                key: 'totalConeys',
                sorter: (a: any, b: any) => a.totalConeys - b.totalConeys,
                render: (coneys: number) => (
                  <span className="font-medium text-chili-red">{coneys}</span>
                ),
              },
            ]}
            dataSource={analyticsData.userStats}
            rowKey="userId"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            }}
            scroll={{ x: 600 }}
          />
        </Card>

        {/* Recent Attempts Table */}
        <Card>
          <Title level={4} className="mb-4">Recent OCR Attempts</Title>
          <Table
            columns={columns}
            dataSource={analyticsData.recentAttempts}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} attempts`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </main>
    </div>
  );
}
