'use client';

import { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Tag, Progress, Typography, Space, Button, DatePicker, Select } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { analytics } from '@/lib/analytics';

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
  recentAttempts: Array<{
    id: string;
    timestamp: string;
    isCorrect: boolean;
    coneyCount: number | null;
    confidence: number;
    isValidReceipt: boolean;
    warnings: number;
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
      try {
        analytics.track('ocr_analytics_page_viewed');
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }

      // For now, we'll simulate the data since we don't have a backend API yet
      // In a real implementation, this would fetch from your analytics service
      const mockData: OCRAnalyticsData = {
        totalAttempts: 47,
        successfulVerifications: 32,
        failedVerifications: 15,
        successRate: 68.1,
        averageConfidence: 0.78,
        coneyCountDistribution: {
          1: 12,
          2: 18,
          3: 8,
          4: 5,
          5: 2,
          6: 1,
          7: 1
        },
        brandDistribution: {
          'Skyline Chili': 28,
          'Gold Star Chili': 12,
          'Unknown': 7
        },
        recentAttempts: [
          {
            id: '1',
            timestamp: '2024-01-15T14:30:00Z',
            isCorrect: true,
            coneyCount: 2,
            confidence: 0.85,
            isValidReceipt: true,
            warnings: 0
          },
          {
            id: '2',
            timestamp: '2024-01-15T13:45:00Z',
            isCorrect: false,
            coneyCount: null,
            confidence: 0.45,
            isValidReceipt: false,
            warnings: 3
          },
          {
            id: '3',
            timestamp: '2024-01-15T12:20:00Z',
            isCorrect: true,
            coneyCount: 3,
            confidence: 0.92,
            isValidReceipt: true,
            warnings: 0
          },
          {
            id: '4',
            timestamp: '2024-01-15T11:15:00Z',
            isCorrect: true,
            coneyCount: 1,
            confidence: 0.78,
            isValidReceipt: true,
            warnings: 1
          },
          {
            id: '5',
            timestamp: '2024-01-15T10:30:00Z',
            isCorrect: false,
            coneyCount: 4,
            confidence: 0.62,
            isValidReceipt: true,
            warnings: 2
          }
        ]
      };

      setAnalyticsData(mockData);
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
          <div className="flex items-center justify-between">
            <Link href="/admin">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                Back to Admin
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <EyeOutlined className="text-chili-red text-xl" />
              <Title level={4} className="text-chili-red mb-0 whitespace-nowrap">OCR Analytics</Title>
            </div>
            <div className="w-32"></div> {/* Spacer to balance the layout */}
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
                prefix={<TrendingUpOutlined />}
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
