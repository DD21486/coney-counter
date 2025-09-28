'use client';

import { Button, Card, Typography, Space } from 'antd';
import { MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function UnapprovedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <div className="py-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClockCircleOutlined className="text-3xl text-orange-500" />
          </div>
          
          <Title level={2} className="mb-4 text-gray-900">
            Alpha Access Required
          </Title>
          
          <Paragraph className="text-gray-600 mb-6">
            Thanks for your interest in Coney Counter! You're currently on the waitlist. 
            We'll send you an invite when alpha access becomes available.
          </Paragraph>
          
          <Space direction="vertical" size="large" className="w-full">
            <div className="text-sm text-gray-500">
              <MailOutlined className="mr-2" />
              Check your email for updates
            </div>
            
            <Link href="/">
              <Button type="primary" className="w-full">
                Back to Homepage
              </Button>
            </Link>
          </Space>
        </div>
      </Card>
    </div>
  );
}
