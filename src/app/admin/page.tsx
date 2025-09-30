'use client';

import { Card, Row, Col, Button, Typography, Space } from 'antd';
import { UserOutlined, EyeOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SettingOutlined className="text-chili-red text-xl" />
              <Title level={4} className="text-chili-red mb-0 whitespace-nowrap">Admin Dashboard</Title>
            </div>
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
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">1,247</div>
                <div className="text-gray-600">Total Users</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">8,432</div>
                <div className="text-gray-600">Coneys Logged</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">47</div>
                <div className="text-gray-600">OCR Attempts</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">68.1%</div>
                <div className="text-gray-600">OCR Success Rate</div>
              </div>
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
}
