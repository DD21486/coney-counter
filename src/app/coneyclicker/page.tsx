'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Spin } from 'antd';

// Add CSS for animated gradient background
const gradientAnimationCSS = `
  .animated-gradient-bg {
    background: linear-gradient(-45deg, #ef4444, #3b82f6, #8b5cf6, #06b6d4, #10b981, #f59e0b);
    background-size: 400% 400%;
    animation: gradientShift 3s ease infinite;
  }
  
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = gradientAnimationCSS;
  document.head.appendChild(style);
}

interface ClickerProgress {
  id: string;
  totalClicks: number;
  totalMoney: number;
  currentMoney: number;
  autoClickers: number;
  clickMultiplier: number;
  upgrades: any[];
}

export default function ConeyClickerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [progress, setProgress] = useState<ClickerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [money, setMoney] = useState(0);
  const [clicking, setClicking] = useState(false);

  // Fetch initial progress
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchProgress();
  }, [session, status]);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/coneyclicker');
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
        setMoney(Number(data.currentMoney) || 0);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (clicking) return;
    
    setClicking(true);
    const newMoney = money + (progress?.clickMultiplier || 1);
    setMoney(newMoney);

    // Update backend
    try {
      await fetch('/api/coneyclicker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clicks: (progress?.totalClicks || 0) + 1,
          money: newMoney,
          autoClickers: progress?.autoClickers || 0,
          clickMultiplier: progress?.clickMultiplier || 1,
          upgrades: progress?.upgrades || []
        })
      });
      
      // Update local progress
      setProgress(prev => prev ? {
        ...prev,
        totalClicks: prev.totalClicks + 1,
        currentMoney: newMoney,
        totalMoney: newMoney
      } : null);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
    
    setTimeout(() => setClicking(false), 50);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to play Coney Clicker!</h1>
          <Button type="primary" onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient-bg">
      {/* Header */}
      <div className="w-full px-4 py-3 border-b border-white/20 bg-white/10 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="w-8 h-8" /> {/* Spacer */}
          
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-white drop-shadow-lg">Coney Clicker</h1>
          </div>
          
          <Button 
            type="link"
            onClick={() => router.push('/dashboard')}
            className="text-white hover:text-gray-200 drop-shadow-lg"
          >
            ← Back to ConeyTracker
          </Button>
        </div>
      </div>

      {/* Funds Display */}
      <div className="text-center py-6">
        <div className="text-4xl font-bold text-white drop-shadow-lg">
          Funds: ${money.toLocaleString()}
        </div>
        <div className="text-sm text-white/80 mt-2 drop-shadow">
          Total Clicks: {progress?.totalClicks || 0}
        </div>
      </div>

      {/* Main Clicker Button */}
      <div className="flex justify-center items-center py-12">
        <button
          onClick={handleClick}
          disabled={clicking}
          className={`
            transition-opacity duration-0 hover:opacity-80
            ${clicking ? 'opacity-60' : 'opacity-100'}
            disabled:opacity-75
          `}
        >
          <img
            src="/Coney_color.svg"
            alt="Coney Dog"
            width={200}
            height={200}
            className="drop-shadow-lg"
          />
        </button>
      </div>

      {/* Upgrades Panel */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg max-w-[140px] border border-white/20">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-700 text-center mb-2">
            Upgrades
          </div>
          
          {/* Auto Clicker Upgrade */}
          <button 
            className="w-full px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded text-xs text-gray-600 transition-colors"
            disabled={money < 10}
          >
            Auto Clicker - $10
            <br />
            <span className="text-xs text-gray-500">
              {progress?.autoClickers || 0} owned
            </span>
          </button>
          
          {/* Click Power Upgrade */}
          <button 
            className="w-full px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded text-xs text-gray-600 transition-colors"
            disabled={money < 50}
          >
            Click Power - $50
            <br />
            <span className="text-xs text-gray-500">
              +{progress?.clickMultiplier || 1} per click
            </span>
          </button>
          
          {/* More upgrade slots */}
          <button className="w-full px-2 py-2 bg-gray-200 rounded text-xs text-gray-400">
            Upgrade (Locked)
          </button>
          <button className="w-full px-2 py-2 bg-gray-200 rounded text-xs text-gray-400">
            Upgrade (Locked)
          </button>
          <button className="w-full px-2 py-2 bg-gray-200 rounded text-xs text-gray-400">
            Upgrade (Locked)
          </button>
          <button className="w-full px-2 py-2 bg-gray-200 rounded text-xs text-gray-400">
            Upgrade (Locked)
          </button>
        </div>
      </div>
    </div>
  );
}
