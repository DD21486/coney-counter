'use client';

import { Button, Card, Typography, Space } from 'antd';
import { StopOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <div className="py-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <StopOutlined className="text-3xl text-red-500" />
          </div>
          
          <Title level={2} className="mb-4 text-gray-900">
            Account Suspended
          </Title>
          
          <Paragraph className="text-gray-600 mb-6">
            Your account has been suspended. If you believe this is an error, 
            please contact support for assistance.
          </Paragraph>
          
          <Space direction="vertical" size="large" className="w-full">
            <div className="text-sm text-gray-500">
              Contact: daleyvisuals@gmail.com
            </div>
            
            <Link href="/">
              <Button type="primary" className="w-full">
                Back
              </Button>
            </Link>
          </Space>
        </div>
      </Card>
    </div>
  );
}
