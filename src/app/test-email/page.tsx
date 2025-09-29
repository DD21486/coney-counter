'use client';

import { useState } from 'react';
import { Button, Card, Typography, Space, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function TestEmailPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testEmail = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'GET',
      });
      
      const data = await response.json();
      setResult(data);
      
      if (response.ok) {
        message.success('Test email sent successfully!');
      } else {
        message.error(data.error || 'Test failed');
      }
    } catch (error) {
      console.error('Test email error:', error);
      message.error('Failed to test email');
      setResult({ error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center">
          <MailOutlined className="text-4xl text-blue-500 mb-4" />
          <Title level={2}>Email Configuration Test</Title>
          <Paragraph className="text-gray-600 mb-6">
            Test if email notifications are working properly
          </Paragraph>
          
          <Button 
            type="primary" 
            size="large"
            loading={loading}
            onClick={testEmail}
            className="mb-6"
          >
            Send Test Email
          </Button>
          
          {result && (
            <Card className="text-left">
              <Title level={4}>Test Results:</Title>
              <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
}
