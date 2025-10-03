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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 via-indigo-800/20 to-purple-800/20 animate-gradient-shift"></div>
      
      {/* Tiled coney pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div 
              key={i} 
              className="flex items-center justify-center shimmer-coney"
              style={{ 
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            >
              <img 
                src="/Coney_BW.svg" 
                alt="" 
                className="w-8 h-8 opacity-40"
              />
            </div>
          ))}
        </div>
      </div>
      
      <Card className="max-w-md w-full text-center shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-10">
        <div className="py-8">
          <div className="flex items-center justify-center mx-auto mb-6">
            <img src="/ConeyCounterLogo_Medium.png" alt="Coney Counter" className="h-12 w-auto" />
          </div>
          
          <Title level={2} className="mb-4 text-gray-900">
            Alpha Access Required
          </Title>
          
          <Paragraph className="text-gray-600 mb-6">
            Thanks for your interest in Coney Counter! You need alpha access to start crushing coneys.
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
                  Join the waitlist to get notified when you are approved to access ConeyCounter.
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
                Back
              </Button>
            </Link>
          </Space>
        </div>
      </Card>
    </div>
  );
}
