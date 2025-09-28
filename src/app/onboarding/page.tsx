'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Card, Typography, message } from 'antd'
import { UserOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const { Title, Paragraph } = Typography

// Username validation function
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

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [errorType, setErrorType] = useState<'inappropriate' | 'formatting' | null>(null)

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) router.push('/auth/signin') // Not authenticated
    if (session?.user?.username) router.push('/dashboard') // Already has username
  }, [session, status, router])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
    
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
  }

  const handleSubmit = async () => {
    if (!username.trim()) {
      message.error('Please enter a username')
      return
    }

    if (username.length < 3) {
      message.error('Username must be at least 3 characters long')
      return
    }

    if (username.length > 20) {
      message.error('Username must be 20 characters or less')
      return
    }

    // Basic validation - alphanumeric and underscores only
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      message.error('Username can only contain letters, numbers, and underscores')
      return
    }

    // Check for inappropriate content
    const validationResult = validateUsername(username)
    if (validationResult.message) {
      message.error(validationResult.message)
      setUsernameError(validationResult.message)
      setErrorType(validationResult.type)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      })

      if (response.ok) {
        message.success('Welcome to Coney Counter!')
        // Use window.location to force a full page refresh and session update
        window.location.href = '/dashboard';
      } else {
        const error = await response.json()
        message.error(error.error || 'Failed to set username')
      }
    } catch (error) {
      console.error('Error setting username:', error)
      message.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to sign-in
  }

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
      
      <div className="max-w-md w-full relative z-10">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mx-auto mb-6">
              <img src="/ConeyCounterLogo_Medium.png" alt="Coney Counter" className="h-10 w-auto" />
            </div>
            <Title level={2} className="mb-2">Welcome to Coney Counter!</Title>
            <Paragraph className="text-gray-600">
              Let's get you set up with your Coney Counter username. This will be how other users see you on leaderboards and in the community.
            </Paragraph>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Your Username
              </label>
              <Input
                size="large"
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
                onPressEnter={handleSubmit}
                maxLength={20}
                className="text-center"
                status={usernameError ? 'error' : ''}
              />
              {usernameError && (
                <div className={`text-xs mt-2 text-center ${
                  errorType === 'inappropriate' ? 'text-red-500' : 'text-blue-500'
                }`}>
                  {usernameError}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2 text-center">
                3-20 characters, letters, numbers, and underscores only
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              loading={loading}
              disabled={!username.trim()}
              className="w-full coney-button-primary"
              icon={<ArrowRightOutlined />}
            >
              Start Counting Coneys
            </Button>

            <div className="text-center">
              <Paragraph className="text-sm text-gray-500 mb-0">
                Don't worry, you can change this later in your account settings.
              </Paragraph>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
