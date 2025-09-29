'use client';

import { Button, Card, Typography, Space, Input, message } from 'antd';
import { MailOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { analytics } from '@/lib/analytics';

const { Title, Paragraph } = Typography;

export default function UnapprovedPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email || '');
  const [loading, setLoading] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);

  const handleWaitlistSignup = async () => {
    if (!email) {
      message.error('Please enter your email address');
      return;
    }

    setLoading(true);
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
        setIsOnWaitlist(true);
        analytics.joinWaitlist(email);
        message.success('You\'ve been added to the waitlist!');
      } else {
        message.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            Thanks for your interest in Coney Counter! You need alpha access to start tracking your coney adventures.
          </Paragraph>
          
          <Space direction="vertical" size="large" className="w-full">
            {session?.user?.email && (
              <div className="text-sm text-gray-500 mb-4">
                <UserOutlined className="mr-2" />
                Signed in as: {session.user.email}
              </div>
            )}
            
            {!isOnWaitlist ? (
              <>
                <div className="text-sm text-gray-600 mb-2">
                  Join the waitlist to get notified when alpha access becomes available:
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onPressEnter={handleWaitlistSignup}
                    prefix={<MailOutlined className="text-gray-400" />}
                    className="flex-1"
                  />
                  <Button 
                    type="primary" 
                    onClick={handleWaitlistSignup}
                    loading={loading}
                    className="px-6"
                  >
                    Join Waitlist
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center">
                  <MailOutlined className="text-green-500 text-lg mr-3" />
                  <div>
                    <div className="text-green-800 font-semibold">You're on the waitlist!</div>
                    <div className="text-green-700 text-sm mt-1">
                      We'll notify you when alpha access becomes available.
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <Link href="/">
              <Button type="default" className="w-full">
                Back to Homepage
              </Button>
            </Link>
          </Space>
        </div>
      </Card>
    </div>
  );
}
