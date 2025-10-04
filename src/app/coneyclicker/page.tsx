'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Spin } from 'antd';
import { UPGRADES, Upgrade, UpgradeProgress, canPurchased, getUpgradePrice, purchaseUpgrade, calculateTotalCPS, calculateClickValue } from '@/lib/coney-clicker-upgrades';

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

  @keyframes fadeUp {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -150px);
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
  baseClickPower: number;
  generators: Record<string, number>;
  multipliers: Record<string, boolean>;
  specialUpgrades: string[];
  totalCPS: number;
}

export default function ConeyClickerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [progress, setProgress] = useState<ClickerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [money, setMoney] = useState(0);
  const [clicking, setClicking] = useState(false);
  const [clickAnimations, setClickAnimations] = useState<Array<{id: number, x: number, y: number}>>([]);

  // Fetch initial progress
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchProgress();
  }, [session, status]);

  // Auto-generator income loop
  useEffect(() => {
    if (!progress) return;
    
    const incomeInterval = setInterval(() => {
      const cps = calculateTotalCPS({
        baseClickPower: progress.baseClickPower || 1,
        generators: progress.generators || {},
        multipliers: progress.multipliers || {},
        specialUpgrades: progress.specialUpgrades || [],
        totalCPS: progress.totalCPS || 0,
        totalMoney: progress.totalMoney || 0
      });
      
      if (cps > 0) {
        const newMoney = money + cps / 10; // CPS * 0.1 second interval
        setMoney(newMoney);
        
        // Save progress every second
        if (Date.now() % 1000 < 100) { // Approximate once per second
          fetch('/api/coneyclicker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clicks: progress.totalClicks || 0,
              money: newMoney,
              baseClickPower: progress.baseClickPower || 1,
              generators: progress.generators || {},
              multipliers: progress.multipliers || {},
              specialUpgrades: progress.specialUpgrades || [],
              totalCPS: progress.totalCPS || 0
            })
          });
        }
      }
    }, 100); // Update every 100ms for smooth income
    
    return () => clearInterval(incomeInterval);
  }, [progress, money]);

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

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (clicking) return;
    
    setClicking(true);
    const clickValue = progress ? calculateClickValue({
      baseClickPower: progress.baseClickPower || 1,
      generators: progress.generators || {},
      multipliers: progress.multipliers || {},
      specialUpgrades: progress.specialUpgrades || [],
      totalCPS: progress.totalCPS || 0,
      totalMoney: progress.totalMoney || 0
    }) : 1;
    
    const newMoney = money + clickValue;
    setMoney(newMoney);

    // Special handling for Perfect Technique (10% chance for ×10)
    let finalClickValue = clickValue;
    if (progress?.specialUpgrades?.includes('perfect-technique') && Math.random() < 0.1) {
      finalClickValue = clickValue * 10;
      setMoney(money + finalClickValue);
    }

    // Add click animation
    const rect = event.currentTarget.getBoundingClientRect();
    const animationId = Date.now();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setClickAnimations(prev => [...prev, { id: animationId, x, y }]);
    
    // Remove animation after duration
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== animationId));
    }, 1000);

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

  const handlePurchase = async (upgrade: Upgrade) => {
    if (!progress) return;
    
    const upgradeProgress = {
      baseClickPower: progress.baseClickPower || 1,
      generators: progress.generators || {},
      multipliers: progress.multipliers || {},
      specialUpgrades: progress.specialUpgrades || [],
      totalCPS: progress.totalCPS || 0,
      totalMoney: progress.totalMoney || 0
    };
    
    const price = getUpgradePrice(upgrade, upgradeProgress, money);
    
    if (money < price) return;
    
    const newMoney = money - price;
    setMoney(newMoney);
    
    // Update progress with purchase
    const newProgress = purchaseUpgrade(upgrade, upgradeProgress);
    
    try {
      await fetch('/api/coneyclicker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clicks: progress.totalClicks || 0,
          money: newMoney,
          baseClickPower: newProgress.baseClickPower,
          generators: newProgress.generators,
          multipliers: newProgress.multipliers,
          specialUpgrades: newProgress.specialUpgrades,
          totalCPS: calculateTotalCPS(newProgress)
        })
      });
      
      // Update local progress
      setProgress({
        ...progress,
        currentMoney: newMoney,
        totalMoney: newMoney,
        baseClickPower: newProgress.baseClickPower,
        generators: newProgress.generators,
        multipliers: newProgress.multipliers,
        specialUpgrades: newProgress.specialUpgrades,
        totalCPS: calculateTotalCPS(newProgress)
      });
    } catch (error) {
      console.error('Failed to save purchase:', error);
    }
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
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
        <div className="relative">
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
          
          {/* Click Animation Container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {clickAnimations.map(animation => (
              <div
                key={animation.id}
                className="absolute animate-bounce text-green-500 font-bold text-sm pointer-events-none"
                style={{
                  left: `${animation.x}px`,
                  top: `${animation.y}px`,
                  transform: 'translate(-50%, -50%)',
                  animation: 'fadeUp 1s ease-out forwards'
                }}
              >
                +${progress?.clickMultiplier || 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrades Panel */}
      <div className="fixed left-2 top-1/2 transform -translate-y-1/2 p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg max-w-[180px] border border-white/20 max-h-[80vh] overflow-y-auto">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-700 text-center mb-3 sticky top-0 bg-white/95 rounded py-1">
            Upgrades
          </div>
          
          {/* CPS Display */}
          <div className="text-xs text-center bg-green-50 rounded p-2 mb-3">
            <div className="font-semibold text-green-700">
              CPS: {progress ? Math.floor(calculateTotalCPS({
                baseClickPower: progress.baseClickPower || 1,
                generators: progress.generators || {},
                multipliers: progress.multipliers || {},
                specialUpgrades: progress.specialUpgrades || [],
                totalCPS: progress.totalCPS || 0,
                totalMoney: progress.totalMoney || 0
              })) : 0}
            </div>
          </div>
          
          {UPGRADES.map(upgrade => {
            const upgradeProgress = progress ? {
              baseClickPower: progress.baseClickPower || 1,
              generators: progress.generators || {},
              multipliers: progress.multipliers || {},
              specialUpgrades: progress.specialUpgrades || [],
              totalCPS: progress.totalCPS || 0,
              totalMoney: progress.totalMoney || 0
            } : {
              baseClickPower: 1,
              generators: {},
              multipliers: {},
              specialUpgrades: [],
              totalCPS: 0,
              totalMoney: 0
            };
            
            const canBuy = canPurchased(upgrade, upgradeProgress, money);
            const price = getUpgradePrice(upgrade, upgradeProgress, money);
            const isLocked = upgrade.unlocksAt && upgradeProgress.totalMoney < upgrade.unlocksAt;
            
            return (
              <button
                key={upgrade.id}
                onClick={() => handlePurchase(upgrade)}
                disabled={!canBuy || isLocked}
                className={`
                  w-full px-2 py-2 rounded text-xs transition-colors text-left
                  ${canBuy ? 'bg-green-200 hover:bg-green-300 text-green-800' : 
                    isLocked ? 'bg-gray-200 text-gray-400' : 
                    'bg-gray-200 text-gray-500'}
                `}
              >
                <div className="font-semibold">
                  {upgrade.name}
                </div>
                <div className="text-xs opacity-80">
                  ${price.toLocaleString()}
                </div>
                {upgrade.isRepeatable && upgradeProgress.generators[upgrade.id] > 0 && (
                  <div className="text-xs opacity-70">
                    Owned: {upgradeProgress.generators[upgrade.id]}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
