'use client';

import { Button, Card, Typography, Row, Col, Space, Statistic, Divider } from 'antd';
import { CheckCircleOutlined, TrophyOutlined, CalendarOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import Confetti from 'react-confetti';
import { useSearchParams } from 'next/navigation';
import AchievementCard from '@/components/AchievementCard';
import { getAchievementXPWithTier, getTotalXPForLevel } from '@/lib/xp-system';

const { Title, Paragraph, Text } = Typography;

// Helper function to get total XP needed for next level
function getTotalXPForNextLevel(currentLevel: number): number {
  return getTotalXPForLevel(currentLevel + 1);
}

function LogConeySuccessContent() {
  const searchParams = useSearchParams();
  const [userStats, setUserStats] = useState({
    totalConeys: 0,
    thisMonthConeys: 0,
    brandsTried: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [randomFact, setRandomFact] = useState('');
  const [brandStats, setBrandStats] = useState({ brand: '', count: 0 });
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<any[]>([]);
  const [xpData, setXpData] = useState<any>(null);
  
  // Get the quantity that was just logged
  const loggedQuantity = searchParams.get('quantity') || '0';
  
  // Animation states
  const [showLogo, setShowLogo] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showAchievementsTitle, setShowAchievementsTitle] = useState(false);
  const [showAchievementCards, setShowAchievementCards] = useState<boolean[]>([]);
  const [showXPBreakdown, setShowXPBreakdown] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    fetchUserStats();
    fetchNewlyUnlockedAchievements();
    fetchXPData();
  }, []);

  // Animation sequence
  useEffect(() => {
    // Debug XP data
    console.log('XP Data Debug:', {
      leveledUp: xpData?.leveledUp,
      oldLevel: xpData?.oldLevel,
      newLevel: xpData?.newLevel,
      level: xpData?.level,
      totalXP: xpData?.totalXP,
      currentLevelXP: xpData?.currentLevelXP,
      nextLevelXP: xpData?.nextLevelXP
    });

    const overlayTimer = setTimeout(() => setShowOverlay(false), 500);
    const timer1 = setTimeout(() => setShowLogo(true), 600);
    const timer2 = setTimeout(() => setShowTitle(true), 900);
    const timer3 = setTimeout(() => setShowSubtitle(true), 1700);
    const timer4 = setTimeout(() => setShowButton(true), 1900);
    const timer5 = setTimeout(() => setShowAchievementsTitle(true), 2100);
    
    // Animate achievement cards one by one
    const achievementTimers = newlyUnlockedAchievements.map((_, index) => 
      setTimeout(() => {
        setShowAchievementCards(prev => {
          const newCards = [...prev];
          newCards[index] = true;
          return newCards;
        });
      }, 2300 + (index * 200))
    );
    
    // Show XP breakdown after achievements
    const timerXP = setTimeout(() => setShowXPBreakdown(true), 2500 + (newlyUnlockedAchievements.length * 200));
    
    const timer6 = setTimeout(() => setShowFunFact(true), 3000 + (newlyUnlockedAchievements.length * 200));

    return () => {
      clearTimeout(overlayTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timerXP);
      achievementTimers.forEach(clearTimeout);
      clearTimeout(timer6);
    };
  }, [newlyUnlockedAchievements]);

  useEffect(() => {
    // Set window dimensions for confetti
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(confettiTimer);
    };
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/coney-logs');
      if (response.ok) {
        const data = await response.json();
        setUserStats(data.statistics);
        setRecentLogs(data.coneyLogs.slice(0, 5)); // Get last 5 logs
        
        // Calculate brand-specific stats from most recent log
        if (data.coneyLogs.length > 0) {
          const mostRecentBrand = data.coneyLogs[0].brand;
          const brandCount = data.coneyLogs.filter((log: any) => log.brand === mostRecentBrand).length;
          setBrandStats({ brand: mostRecentBrand, count: brandCount });
        }
        
        // Generate random fact based on most recent log
        generateRandomFact(data.coneyLogs);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchXPData = async () => {
    try {
      // Get XP data from URL params
      const xpParam = searchParams.get('xp');
      if (xpParam) {
        const xpResult = JSON.parse(decodeURIComponent(xpParam));
        setXpData(xpResult);
        console.log('XP data:', xpResult);
      }
    } catch (error) {
      console.error('Error parsing XP data:', error);
    }
  };

  const fetchNewlyUnlockedAchievements = async () => {
    try {
      // Get the newly unlocked achievements from URL params
      const achievementsParam = searchParams.get('achievements');
      console.log('Achievements param:', achievementsParam);
      
      if (achievementsParam) {
        const achievementIds = JSON.parse(decodeURIComponent(achievementsParam));
        console.log('Parsed achievement IDs:', achievementIds);
        
        // Fetch full achievement details from the API
        const response = await fetch('/api/achievements', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          const allAchievements = data.achievements || [];
          
          // Filter to only the newly unlocked achievements
          const newlyUnlocked = allAchievements.filter((achievement: any) => 
            achievementIds.includes(achievement.id) && achievement.unlocked
          );
          
          console.log('Newly unlocked achievements with full data:', newlyUnlocked);
          setNewlyUnlockedAchievements(newlyUnlocked);
        } else {
          console.error('Failed to fetch achievements');
          setNewlyUnlockedAchievements([]);
        }
      } else {
        // No achievements in URL params - this means no new achievements were unlocked
        console.log('No achievements in URL params - no new achievements unlocked');
        setNewlyUnlockedAchievements([]);
      }
    } catch (error) {
      console.error('Error fetching newly unlocked achievements:', error);
      setNewlyUnlockedAchievements([]);
    }
  };

  const generateRandomFact = (logs: any[]) => {
    // General facts
    const generalFacts = [
      "The Cincinnati coney was invented in 1922 by Greek immigrants who adapted their traditional meat sauce recipe to local tastes.",
      "Cincinnati has over 200 chili parlors - more chili restaurants per capita than any other city in the United States.",
      "The coney is Cincinnati's official dish and is so beloved that locals often eat it for breakfast, lunch, and dinner.",
      "Cincinnati-style chili is never called 'chili' by locals - it's always just 'coney' or 'coneys' when referring to the dish.",
      "The traditional Cincinnati coney order is '3-way' (chili, cheese, onions), but locals often customize with '4-way' (add beans) or '5-way' (add beans and spaghetti).",
      "Cincinnati coneys are typically served over spaghetti - a unique preparation that sets them apart from other regional chili styles.",
      "The city consumes over 2 million pounds of chili annually across all the local parlors and restaurants.",
      "Cincinnati chili has a distinctive sweet and spicy flavor due to the addition of cinnamon, allspice, and chocolate in the recipe.",
      "Many Cincinnati chili parlors are open 24/7 because locals crave coneys at all hours of the day and night.",
      "The coney has inspired countless variations including vegetarian options, turkey chili, and even dessert versions like chili-flavored ice cream."
    ];

    // Brand-specific facts
    const brandFacts: { [key: string]: string[] } = {
      'Skyline Chili': [
        "Skyline Chili was founded in 1949 by Greek immigrant Nicholas Lambrinides, who brought his family recipe from Greece.",
        "Skyline serves over 1 million pounds of chili annually across their 100+ locations in Ohio, Kentucky, Indiana, and Florida.",
        "The original Skyline location on Glenway Avenue in Price Hill is still operating today, serving the same recipe for over 70 years.",
        "Skyline's signature '3-Way' (chili, cheese, onions) was so popular it became the standard way to order coneys throughout Cincinnati.",
        "Skyline Chili is publicly traded on the NASDAQ stock exchange under the ticker symbol 'SKY' since 2015."
      ],
      'Gold Star Chili': [
        "Gold Star Chili was founded in 1965 by four Greek brothers who wanted to create a more refined version of Cincinnati chili.",
        "Gold Star was the first Cincinnati chili chain to offer drive-through service, revolutionizing how locals could get their coney fix.",
        "The company's name comes from the gold star that appeared on the original restaurant's sign, symbolizing quality and excellence.",
        "Gold Star Chili operates over 100 locations primarily in Ohio, Kentucky, and Indiana, making it one of the largest regional chili chains.",
        "Gold Star was acquired by Frisch's Big Boy in 2008, but continues to operate as a separate brand maintaining its unique chili recipe."
      ],
      'Dixie Chili': [
        "Dixie Chili was founded in 1929 by Greek immigrant Nicholas Sarakatsannis, making it one of the oldest continuously operating chili parlors in Cincinnati.",
        "The original Dixie Chili location on Monmouth Street in Newport, Kentucky, is still serving customers today after nearly 95 years.",
        "Dixie Chili is famous for its 'Coney Island' - a unique variation that includes mustard and onions, creating a distinctive flavor profile.",
        "The restaurant has been featured in numerous food documentaries and is considered a must-visit destination for chili enthusiasts visiting the region.",
        "Dixie Chili maintains its original family recipe with no corporate modifications, preserving the authentic taste that has made it legendary."
      ],
      'Camp Washington Chili': [
        "Camp Washington Chili opened in 1940 and is one of Cincinnati's most iconic chili parlors, known for its authentic atmosphere and traditional preparation.",
        "The restaurant is located in the historic Camp Washington neighborhood and has been serving the same family recipe for over 80 years.",
        "Camp Washington Chili is famous for its 'Coney Special' - a unique preparation that includes their signature chili sauce and traditional toppings.",
        "The restaurant has won numerous awards including being named one of the 'Best Chili Parlors in America' by various food publications.",
        "Camp Washington Chili operates 24/7 and is a favorite late-night destination for locals craving authentic Cincinnati-style coneys."
      ]
    };

    // 50% chance for general fact, 50% chance for brand-specific fact
    const isGeneralFact = Math.random() < 0.5;
    
    if (isGeneralFact || logs.length === 0) {
      // Show general fact
      const randomIndex = Math.floor(Math.random() * generalFacts.length);
      setRandomFact(generalFacts[randomIndex]);
    } else {
      // Show brand-specific fact based on most recent log
      const mostRecentBrand = logs[0]?.brand;
      if (mostRecentBrand && brandFacts[mostRecentBrand]) {
        const brandFactArray = brandFacts[mostRecentBrand];
        const randomIndex = Math.floor(Math.random() * brandFactArray.length);
        setRandomFact(brandFactArray[randomIndex]);
      } else {
        // Fallback to general fact if brand not found
        const randomIndex = Math.floor(Math.random() * generalFacts.length);
        setRandomFact(generalFacts[randomIndex]);
      }
    }
  };

  const getCelebrationMessage = () => {
    const total = userStats.totalConeys;
    if (total >= 100) return "Coney Legend! You're in the hall of fame!";
    if (total >= 50) return "Coney Master! You're crushing it!";
    if (total >= 25) return "Coney Enthusiast! Keep it up!";
    return "Your coneys have been counted!";
  };

  const getMotivationalMessage = () => {
    const total = userStats.totalConeys;
    if (total >= 100) return "You're officially a Cincinnati coney legend!";
    if (total >= 50) return "You're well on your way to coney mastery!";
    if (total >= 25) return "You're building quite the coney reputation!";
    return "Every coney counts toward your Cincinnati legacy!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* White Overlay */}
      <div className={`overlay ${!showOverlay ? 'fade-out' : ''}`}></div>
      
      <style jsx>{`
        .logo-container {
          opacity: 0;
        }
        
        .title-container {
          opacity: 0;
        }
        
        .subtitle-container {
          opacity: 0;
          transform: translateY(20px);
        }
        
        .button-container {
          opacity: 0;
          transform: translateY(20px);
        }
        
        .achievements-title-container {
          opacity: 0;
        }
        
        .achievement-card-container {
          opacity: 0;
        }
        
        .xp-breakdown-container {
          opacity: 0;
          transform: translateY(20px);
        }
        
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          z-index: 9999;
          opacity: 1;
          transition: opacity 2s ease-out;
        }
        
        .overlay.fade-out {
          opacity: 0;
          pointer-events: none;
        }
        
        .animate-logo {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        
        .animate-title {
          animation: typewriter 0.8s ease-in-out forwards;
        }
        
        .animate-subtitle {
          animation: slideUp 0.2s ease-out forwards;
        }
        
        .animate-button {
          animation: slideUp 0.2s ease-out forwards;
        }
        
        .animate-achievements-title {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        
        .animate-achievement-card {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        
        .animate-xp-breakdown {
          animation: slideUp 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        @keyframes typewriter {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          50% {
            opacity: 0.5;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {/* Confetti Animation */}
      {showConfetti && windowDimensions.width > 0 && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#B22222', '#FFD447', '#1C3FAA', '#F5F5F5', '#7C3AED', '#059669']}
        />
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          {/* Coney Counter Logo */}
          <div className={`mb-6 logo-container ${showLogo ? 'animate-logo' : ''}`}>
            <img 
              src="/ConeyCounterLogo_Medium.png" 
              alt="Coney Counter" 
              className="mx-auto"
              style={{ height: '30px' }}
            />
          </div>
          
          <Title level={1} className={`text-4xl text-gray-900 mb-4 title-container ${showTitle ? 'animate-title' : ''}`} style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 950, letterSpacing: '-0.02em' }}>
            You just crushed {loggedQuantity} coneys!
          </Title>
          
          <Paragraph className={`text-xl text-gray-600 mb-8 max-w-2xl mx-auto subtitle-container ${showSubtitle ? 'animate-subtitle' : ''}`}>
            You've eaten {userStats.thisMonthConeys} coneys this month, {userStats.totalConeys} coneys all time, and {brandStats.count} coneys all time @ {brandStats.brand}.
          </Paragraph>

          {/* Back to Dashboard Button */}
          <div className={`mb-12 mt-12 button-container ${showButton ? 'animate-button' : ''}`}>
            <Link href="/dashboard">
              <Button 
                type="primary" 
                size="large" 
                icon={<ArrowLeftOutlined />}
                className="coney-button-primary h-12 px-8 text-lg"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Newly Unlocked Achievements */}
        {newlyUnlockedAchievements.length > 0 && (
          <div className="mb-12">
            <Title level={3} className={`text-center text-gray-800 mb-6 achievements-title-container ${showAchievementsTitle ? 'animate-achievements-title' : ''}`}>
              🏆 You've unlocked these new achievements
            </Title>
            <div className="flex justify-center">
              <Row gutter={[24, 24]} justify="center">
                {newlyUnlockedAchievements.map((achievement, index) => (
                  <Col key={achievement.id} xs={24} sm={24} md={12} lg={12} xl={8}>
                    <div className={`achievement-card-container ${showAchievementCards[index] ? 'animate-achievement-card' : ''}`}>
                      <AchievementCard
                        title={achievement.title}
                        description={achievement.description}
                        isAchieved={true}
                        className="h-full hover:shadow-xl"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        )}

        {/* Detailed XP Breakdown */}
        {xpData && (
          <div className={`mb-12 xp-breakdown-container ${showXPBreakdown ? 'animate-xp-breakdown' : ''}`}>
            <Card className="max-w-2xl mx-auto shadow-sm border-0 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="text-center">
                <Title level={3} className="text-gray-800 mb-6">🎮 XP Breakdown</Title>
                
                <div className="space-y-3 text-left">
                  {/* Coney XP */}
                  <div className="flex justify-between items-center py-2 px-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <span className="text-lg">🌭</span>
                      <span className="ml-2 font-medium">Coneys x{loggedQuantity} (10 XP each)</span>
                    </div>
                    <span className="font-bold text-blue-600">+{parseInt(loggedQuantity) * 10} XP</span>
                  </div>
                  
                  {/* Achievement XP */}
                  {newlyUnlockedAchievements.map((achievement, index) => {
                    const { xp, tier } = getAchievementXPWithTier(achievement.id);
                    return (
                      <div key={achievement.id} className="flex justify-between items-center py-2 px-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <span className="text-lg">🏆</span>
                          <div className="ml-2">
                            <div className="font-medium">{achievement.title}</div>
                            <div className="text-sm text-gray-500">{tier} Achievement</div>
                          </div>
                        </div>
                        <span className="font-bold text-purple-600">+{xp} XP</span>
                      </div>
                    );
                  })}
                  
                  <Divider className="my-4" />
                  
                  {/* Total XP */}
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                    <span className="text-lg font-bold">Total XP Gained</span>
                    <span className="text-xl font-bold text-blue-700">
                      +{parseInt(loggedQuantity) * 10 + newlyUnlockedAchievements.reduce((sum, achievement) => sum + getAchievementXPWithTier(achievement.id).xp, 0)} XP
                    </span>
                  </div>
                  
                  {/* Level Information */}
                  <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800 mb-2">
                        {xpData.leveledUp && xpData.oldLevel !== undefined ? (
                          <>Level {xpData.oldLevel} → Level {xpData.newLevel}</>
                        ) : (
                          <>Level {xpData.newLevel}</>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-3 flex justify-between items-center">
                        <span>{xpData.totalXP || 0} / {getTotalXPForNextLevel(xpData.newLevel)}</span>
                        <span>{xpData.nextLevelXP - xpData.currentLevelXP} XP To Next Level</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(xpData.currentLevelXP / xpData.nextLevelXP) * 100}%` 
                          }}
                        ></div>
                      </div>
                      
                      {xpData.leveledUp && (
                        <div className="mt-3 text-lg font-bold text-green-600 animate-pulse">
                          🎉 LEVEL UP! 🎉
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Did You Know Section */}
        <div className={`mt-16 text-center fun-fact-container ${showFunFact ? 'animate-fun-fact' : ''}`}>
          <Title level={3} className="text-gray-700 mb-6">Did You Know? 🤓</Title>
          <div className="flex justify-center">
            <Card className="max-w-2xl shadow-sm border-0">
              <Paragraph className="text-lg text-gray-600 italic">
                "{randomFact}"
              </Paragraph>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LogConeySuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogConeySuccessContent />
    </Suspense>
  );
}
