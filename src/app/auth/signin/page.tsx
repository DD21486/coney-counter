'use client';

import { signIn, getSession } from "next-auth/react"
import { Button, Card, Typography, Space } from 'antd'
import { GoogleOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const { Title, Paragraph } = Typography

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [coneys, setConeys] = useState<Array<{id: number, position: number, left: number, velocity: number, rotation: number, rotationVelocity: number, isDragging: boolean, isColored: boolean}>>([])
  const [draggedConey, setDraggedConey] = useState<number | null>(null)
  const router = useRouter()

  // Remove automatic redirect - let users sign in manually
  // useEffect(() => {
  //   // Check if user is already signed in
  //   getSession().then((session) => {
  //     if (session) {
  //       router.push('/dashboard')
  //     }
  //   })
  // }, [router])

  // Physics animation for multiple coneys falling
  useEffect(() => {
    let coneyId = 0
    const gravity = 0.8
    const bounce = 0.6
    const ground = window.innerHeight - 100
    
    const spawnConey = () => {
      // 10% chance for colored coney
      const isColored = Math.random() < 0.1
      
      const newConey = {
        id: coneyId++,
        position: -100,
        left: Math.random() * 200 - 100,
        velocity: 0,
        rotation: 0,
        rotationVelocity: (Math.random() - 0.5) * 10,
        isDragging: false,
        isColored: isColored
      }
      
      setConeys(prev => [...prev, newConey])
    }
    
    let animationId: number
    
    const animateConeys = () => {
      setConeys(prev => {
        const updatedConeys = prev.map(coney => {
          let newPosition = coney.position
          let newVelocity = coney.velocity
          let newRotation = coney.rotation
          let newRotationVelocity = coney.rotationVelocity
          
          // Skip physics if being dragged
          if (!coney.isDragging) {
            // Apply physics
            if (newVelocity !== 0 || newPosition < ground) {
              newVelocity += gravity
              newPosition += newVelocity
              
              // Apply rotation with self-correction
              if (newVelocity !== 0) {
                // Add random rotation while falling
                newRotation += newRotationVelocity
              } else {
                // When settled, gradually rotate back to 0 degrees
                const rotationDiff = newRotation % 360
                const shortestPath = rotationDiff > 180 ? rotationDiff - 360 : rotationDiff
                newRotation += shortestPath * 0.1 // Gradual correction
                
                // Stop when close to 0
                if (Math.abs(newRotation) < 1) {
                  newRotation = 0
                }
              }
              
              // Collision with ground
              if (newPosition >= ground) {
                newPosition = ground
                newVelocity = -newVelocity * bounce
                
                if (Math.abs(newVelocity) < 2) {
                  newVelocity = 0
                  newPosition = ground
                  newRotationVelocity = 0
                }
              }
            }
          }
          
          return {
            ...coney,
            position: newPosition,
            velocity: newVelocity,
            rotation: newRotation,
            rotationVelocity: newRotationVelocity
          }
        })
        
        return updatedConeys
      })
      
      animationId = requestAnimationFrame(animateConeys)
    }
    
    // Start animation
    animateConeys()
    
    // Spawn coneys
    const initialTimer = setTimeout(spawnConey, 1000)
    const spawnInterval = setInterval(spawnConey, 3000)
    
    return () => {
      clearTimeout(initialTimer)
      clearInterval(spawnInterval)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Drag and throw functionality
  const handleMouseDown = (e: React.MouseEvent, coneyId: number) => {
    e.preventDefault()
    
    setDraggedConey(coneyId)
    setConeys(prev => prev.map(coney => 
      coney.id === coneyId 
        ? { ...coney, isDragging: true }
        : coney
    ))
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedConey !== null) {
      const containerRect = e.currentTarget.getBoundingClientRect()
      
      // For dragged coneys, use absolute positioning relative to container
      const newLeft = e.clientX - containerRect.left - 32 // Center the coney (32px is half width)
      const newTop = e.clientY - containerRect.top - 32   // Center the coney (32px is half height)
      
      setConeys(prev => prev.map(coney => 
        coney.id === draggedConey 
          ? { ...coney, left: newLeft, position: newTop }
          : coney
      ))
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (draggedConey !== null) {
      const containerRect = e.currentTarget.getBoundingClientRect()
      
      // Convert absolute position back to centered position for physics
      const centerX = containerRect.width / 2
      const centerY = containerRect.height / 2
      
      // Calculate throw velocity based on mouse movement
      const throwVelocity = Math.random() * 8 + 2 // Random throw strength between 2-10
      
      setConeys(prev => prev.map(coney => 
        coney.id === draggedConey 
          ? { 
              ...coney, 
              isDragging: false, 
              // Convert absolute position back to relative position for physics
              left: coney.left - centerX, // Convert back to relative positioning
              position: coney.position, // Keep current Y position
              velocity: -throwVelocity, // Negative for upward throw
              rotationVelocity: (Math.random() - 0.5) * 20 // Add spin when thrown
            }
          : coney
      ))
      setDraggedConey(null)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dark */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-chili-red items-center justify-center relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {coneys.map((coney) => (
          <div 
            key={coney.id}
            className="absolute transition-transform duration-75 ease-out cursor-pointer select-none"
            style={{ 
              top: coney.isDragging ? `${coney.position}px` : `${coney.position}px`,
              left: coney.isDragging ? `${coney.left}px` : `calc(50% + ${coney.left}px)`,
              transform: coney.isDragging 
                ? `rotate(${coney.rotation}deg)` 
                : `translateX(-50%) rotate(${coney.rotation}deg)`,
              width: '64px',
              height: '64px',
              zIndex: coney.isDragging ? 1000 : 1
            }}
            onMouseDown={(e) => handleMouseDown(e, coney.id)}
          >
            <img 
              src={coney.isColored ? "/Coney_color.svg" : "/Coney_BW.svg"} 
              alt="Coney Counter" 
              style={{ 
                width: '64px', 
                height: '64px',
                filter: coney.isDragging 
                  ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' 
                  : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                transform: coney.isDragging ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }} 
            />
          </div>
        ))}
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/">
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                className="text-white hover:text-chili-red mb-4"
                style={{ color: 'white' }}
              >
                Back to Home
              </Button>
            </Link>
            <Title level={2} className="text-white mb-2" style={{ color: 'white' }}>Welcome</Title>
            <Paragraph className="text-white text-lg opacity-90" style={{ color: 'white' }}>
              Sign in or create an account
            </Paragraph>
          </div>

          {/* Sign In Card */}
          <Card className="shadow-lg border-0 bg-white">
            <div className="text-center py-6">
              <Button
                type="primary"
                size="large"
                icon={<GoogleOutlined />}
                onClick={handleGoogleSignIn}
                loading={loading}
                className="coney-button-primary w-full mb-4"
              >
                Continue with Google
              </Button>

              <Paragraph className="text-sm text-gray-500 mb-0">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </Paragraph>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
