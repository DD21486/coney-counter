'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Dropdown, Menu, Statistic } from 'antd';
import { UserOutlined, EyeOutlined, BarChartOutlined, SettingOutlined, FileImageOutlined, DownOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

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

        {/* Admin Cards */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-full"
              actions={[
                <Link href="/admin/users" key="view">
                  <Button type="primary" icon={<UserOutlined />}>
                    Manage Users
                  </Button>
                </Link>
              ]}
            >
              <div className="text-center">
                <UserOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={4} className="mb-2">User Management</Title>
                <Paragraph className="text-gray-600">
                  View and manage user accounts, roles, and permissions.
                </Paragraph>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-full"
              actions={[
                <Link href="/admin/ocr-analytics" key="view">
                  <Button type="primary" icon={<EyeOutlined />}>
                    View OCR Analytics
                  </Button>
                </Link>
              ]}
            >
              <div className="text-center">
                <EyeOutlined className="text-4xl text-green-500 mb-4" />
                <Title level={4} className="mb-2">OCR Analytics</Title>
                <Paragraph className="text-gray-600">
                  Monitor OCR performance, success rates, and training data quality.
                </Paragraph>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable
              className="h-full"
              actions={[
                <Link href="/admin/training-data" key="view">
                  <Button type="primary" icon={<FileImageOutlined />}>
                    Manage Training Data
                  </Button>
                </Link>
              ]}
            >
              <div className="text-center">
                <FileImageOutlined className="text-4xl text-purple-500 mb-4" />
                <Title level={4} className="mb-2">Training Data</Title>
                <Paragraph className="text-gray-600">
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
