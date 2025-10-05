'use client';

import { Button, Card, Form, Input, Typography, Space, Avatar, message } from 'antd';
import { UserOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Paragraph } = Typography;

// Username validation function (same as onboarding)
const validateUsername = (username: string): { type: 'inappropriate' | 'formatting' | null, message: string | null } => {
  const lowerUsername = username.toLowerCase()
  
  // List of inappropriate words/phrases
  const inappropriateWords = [
    // Profanity and vulgar terms
    'fuck', 'shit', 'damn', 'bitch', 'ass', 'bastard', 'whore', 'slut',
    'piss', 'crap', 'dick', 'cock', 'pussy', 'tits', 'boobs', 'fag', 'faggot',
    'nigger', 'nigga', 'chink', 'kike', 'spic', 'wetback', 'retard', 'retarded',
    'gay', 'lesbian', 'homo', 'tranny', 'dyke', 'faggy', 'poop',
    
    // Sexual content
    'sex', 'porn', 'xxx', 'nude', 'naked', 'orgasm', 'masturbat', 'penis', 'vagina',
    'breast', 'nipple', 'clitoris', 'ejaculat', 'erotic', 'fetish', 'bondage',
    
    // Violence and hate
    'kill', 'murder', 'suicide', 'bomb', 'terrorist', 'nazi', 'hitler', 'killer',
    'rape', 'molest', 'abuse', 'torture', 'violence', 'blood', 'death', 'die',
    
    // Drugs and alcohol
    'cocaine', 'heroin', 'marijuana', 'weed', 'drug', 'alcohol', 'beer', 'wine',
    'liquor', 'drunk', 'high', 'stoned', 'crack', 'meth', 'ecstasy', 'lsd',
    
    // Scam/fraud terms
    'scam', 'fraud', 'fake', 'phishing', 'hack', 'virus', 'malware', 'spam',
    'admin', 'moderator', 'official', 'staff', 'support', 'help', 'system',
    
    // Reserved/system terms
    'coneycounter', 'counter', 'app', 'website', 'site', 'www', 'http',
    'api', 'database', 'server', 'root', 'guest', 'user', 'test', 'demo',
    
    // Common inappropriate patterns
    'hate', 'stupid', 'idiot', 'moron', 'dumb', 'ugly', 'fat', 'skinny', 'loser'
  ]
  
  // Check for inappropriate words
  for (const word of inappropriateWords) {
    if (lowerUsername.includes(word)) {
      return { type: 'inappropriate', message: 'Crushing coneys doesn\'t require you to be rude. Choose a different username.' }
    }
  }
  
  // Check for repeated characters (like aaa, bbb, etc.)
  if (/(.)\1{2,}/.test(username)) {
    return { type: 'formatting', message: 'Even the best coney spots don\'t repeat themselves that much. Try something more unique!' }
  }
  
  // Check for all numbers
  if (/^\d+$/.test(username)) {
    return { type: 'formatting', message: 'Your coney journey needs some personality! Add some letters to your username.' }
  }
  
  // Check for common patterns that might be problematic
  const problematicPatterns = [
    /^test\d*$/i,
    /^user\d*$/i,
    /^admin\d*$/i,
    /^guest\d*$/i,
    /^demo\d*$/i,
    /^temp\d*$/i
  ]
  
  for (const pattern of problematicPatterns) {
    if (pattern.test(username)) {
      return { type: 'formatting', message: 'That username is reserved for the coney kitchen staff. Pick something more personal!' }
    }
  }
  
  return { type: null, message: null } // Username is valid
}

export default function AccountSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('coneyyellow');
  const [usernameError, setUsernameError] = useState('');
  const [errorType, setErrorType] = useState<'inappropriate' | 'formatting' | null>(null);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    name: '',
    image: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/signin');
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
      fetchAvatar();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        form.setFieldsValue({
          username: data.username || '',
          email: data.email || '',
          name: data.name || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAvatar = async () => {
    try {
      const response = await fetch('/api/user/avatar');
      if (response.ok) {
        const data = await response.json();
        setSelectedAvatar(data.selectedAvatar || 'coneyyellow');
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Clear error when user starts typing
    if (usernameError) {
      setUsernameError('')
      setErrorType(null)
    }
    
    // Real-time validation for basic issues
    if (value.length > 0 && value.length < 3) {
      setUsernameError('Your coney journey needs at least 3 characters to get started!')
      setErrorType('formatting')
    } else if (value.length > 20) {
      setUsernameError('Even the longest coney line doesn\'t need that many characters!')
      setErrorType('formatting')
    } else if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError('Keep it simple - just letters, numbers, and underscores for your coney name!')
      setErrorType('formatting')
    } else if (value) {
      // Check for inappropriate content in real-time
      const validationResult = validateUsername(value)
      if (validationResult.message) {
        setUsernameError(validationResult.message)
        setErrorType(validationResult.type)
      } else {
        setUsernameError('')
        setErrorType(null)
      }
    } else {
      setUsernameError('')
      setErrorType(null)
    }
  };

  const handleSave = async (values: any) => {
    // Validate username before submitting
    const validationResult = validateUsername(values.username);
    if (validationResult.message) {
      message.error(validationResult.message);
      setUsernameError(validationResult.message);
      setErrorType(validationResult.type);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        message.success('Username updated successfully!');
        setUserData(prev => ({ ...prev, username: values.username }));
        setUsernameError('');
        setErrorType(null);
      } else {
        message.error(result.error || 'Failed to update username');
      }
    } catch (error) {
      console.error('Error updating username:', error);
      message.error('Failed to update username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account settings...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E40AF 15%, #0C4A6E 30%, #064E3B 45%, #022C22 60%, #7F1D1D 75%, #450A0A 100%)'
    }}>
      {/* Navigation Header */}
      <header className="fixed top-4 z-50 w-full px-4">
        <div className="max-w-7xl mx-auto">
          <div className="floating-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard">
                <Button type="text" icon={<ArrowLeftOutlined />} className="text-white hover:text-white hover:bg-white/10 font-semibold">
                  Back
                </Button>
              </Link>
              <div className="flex-1 flex justify-center">
                <img src="/ConeyCounter_LogoWordmark_White.png" alt="Coney Counter" className="h-8 w-auto" />
              </div>
              <div className="w-32"></div> {/* Spacer to balance the back button */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        <style jsx global>{`
          .floating-card {
            background: rgba(255, 255, 255, 0.1);
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
          }
        `}</style>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
          {/* Profile Card - Hidden */}
          {/* <Card className="shadow-sm border-0 mb-6">
            <div className="text-center mb-6">
              <img 
                src={`/avatars/${selectedAvatar}.png`} 
                alt="Profile"
                className="w-20 h-20 rounded-full mb-4 object-cover"
                onError={(e) => {
                  console.log('Profile image failed to load, using fallback');
                  e.currentTarget.src = '/Coney_color.svg';
                }}
              />
              <Title level={4} className="text-gray-900 mb-2">
                {userData.name || 'Coney Enthusiast'}
              </Title>
              <Paragraph className="text-gray-600 mb-0">
                {userData.email}
              </Paragraph>
            </div>
          </Card> */}

          {/* Settings Form */}
          <div className="floating-card rounded-xl p-6 mb-6">
            <Title level={4} className="text-white mb-6">Profile Settings</Title>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              className="space-y-6"
            >
              {/* Username Field */}
              <Form.Item
                label={<span className="text-white">Username</span>}
                name="username"
                rules={[
                  { required: true, message: 'Please enter a username!' },
                  { min: 3, message: 'Username must be at least 3 characters!' },
                  { max: 20, message: 'Username must be less than 20 characters!' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores!' }
                ]}
                extra={
                  <div className="space-y-1">
                    <div className="text-white/80">This username will be displayed on leaderboards and throughout the app.</div>
                    <div className="text-orange-400 font-medium">
                      ⚠️ You can only change your username once every 7 days. Choose carefully!
                    </div>
                    {usernameError && (
                      <div className={`text-xs ${
                        errorType === 'inappropriate' ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {usernameError}
                      </div>
                    )}
                  </div>
                }
              >
                <Input
                  size="large"
                  placeholder="Enter your username"
                  prefix="@"
                  onChange={handleUsernameChange}
                  status={usernameError ? 'error' : ''}
                />
              </Form.Item>

              {/* Read-only Fields */}
              <Form.Item label="Email" name="email">
                <Input
                  size="large"
                  disabled
                  className="bg-gray-50"
                />
              </Form.Item>

              <Form.Item label="Full Name" name="name">
                <Input
                  size="large"
                  disabled
                  className="bg-gray-50"
                />
              </Form.Item>

              {/* Save Button */}
              <div className="text-center pt-6">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  className="coney-button-primary h-12 px-8 text-lg"
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </div>

          {/* Info Card */}
          <div className="floating-card rounded-xl p-6">
            <Title level={5} className="text-white mb-4">About Usernames</Title>
            <div className="space-y-2 text-sm text-white/80">
              <div>• Your username will be displayed on leaderboards instead of your real name</div>
              <div>• Usernames must be 3-20 characters long</div>
              <div>• Only letters, numbers, and underscores are allowed</div>
              <div>• You can only change your username once every 7 days</div>
              <div>• Your email and real name remain private</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
            <div className="flex items-center">
              <img src="/ConeyCounter_LogoWordmark_White.png" alt="Coney Counter" className="h-8 w-auto" />
            </div>
              <p className="text-gray-300 text-sm">
                Track your coney consumption, earn achievements, and compete with other coney crushers in Cincinnati.
              </p>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Legal</h4>
              <div className="space-y-2">
                <Link href="/terms" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-chili-red transition-colors text-sm">
                  Terms & Conditions
                </Link>
                <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-chili-red transition-colors text-sm">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Coney Counter. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mt-2 md:mt-0">
                Made with ❤️ for Cincinnati's coney community
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
