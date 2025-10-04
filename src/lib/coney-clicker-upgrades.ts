export interface Upgrade {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  priceGrowth?: number; // For repeatable upgrades (15% increase each time)
  category: 'base-click' | 'generator' | 'multiplier' | 'special';
  effect: number;
  isRepeatable: boolean;
  maxPurchases?: number; // For limited upgrades
  unlocksAt?: number; // CPS or total money requirement
}

export const UPGRADES: Upgrade[] = [
  // 1. Base Click Power (One-Time)
  {
    id: 'extra-cheese',
    name: 'Extra Cheese',
    description: '+1 per click',
    basePrice: 10,
    category: 'base-click',
    effect: 1,
    isRepeatable: false
  },
  {
    id: 'double-mustard',
    name: 'Double Mustard',
    description: '+2 per click',
    basePrice: 50,
    category: 'base-click',
    effect: 2,
    isRepeatable: false
  },
  {
    id: 'onion-surge',
    name: 'Onion Surge',
    description: '+5 per click',
    basePrice: 250,
    category: 'base-click',
    effect: 5,
    isRepeatable: false,
    unlocksAt: 200 // Unlocks after $200 earned
  },
  {
    id: 'chili-flood',
    name: 'Chili Flood',
    description: '+10 per click',
    basePrice: 1000,
    category: 'base-click',
    effect: 10,
    isRepeatable: false,
    unlocksAt: 1000
  },
  {
    id: 'mega-coney-bite',
    name: 'Mega Coney Bite',
    description: '+25 per click',
    basePrice: 5000,
    category: 'base-click',
    effect: 25,
    isRepeatable: false,
    unlocksAt: 5000
  },

  // 2. Auto-Generators (Repeatable)
  {
    id: 'kitchen-helper',
    name: 'Kitchen Helper',
    description: '+1 CPS',
    basePrice: 100,
    priceGrowth: 1.15,
    category: 'generator',
    effect: 1,
    isRepeatable: true,
    unlocksAt: 100
  },
  {
    id: 'coney-cart',
    name: 'Coney Cart',
    description: '+5 CPS',
    basePrice: 500,
    priceGrowth: 1.15,
    category: 'generator',
    effect: 5,
    isRepeatable: true,
    unlocksAt: 500
  },
  {
    id: 'line-cook',
    name: 'Line Cook',
    description: '+15 CPS',
    basePrice: 2500,
    priceGrowth: 1.15,
    category: 'generator',
    effect: 15,
    isRepeatable: true,
    unlocksAt: 2500
  },
  {
    id: 'coney-factory',
    name: 'Coney Factory',
    description: '+50 CPS',
    basePrice: 12500,
    priceGrowth: 1.15,
    category: 'generator',
    effect: 50,
    isRepeatable: true,
    unlocksAt: 12500
  },
  {
    id: 'automated-grill',
    name: 'Automated Grill',
    description: '+150 CPS',
    basePrice: 50000,
    priceGrowth: 1.15,
    category: 'generator',
    effect: 150,
    isRepeatable: true,
    unlocksAt: 50000
  },

  // 3. Multipliers & Efficiency (One-Time)
  {
    id: 'shredded-cheddar-multiplier',
    name: 'Shredded Cheddar Multiplier',
    description: 'All click power ×2',
    basePrice: 25000,
    category: 'multiplier',
    effect: 2,
    isRepeatable: false,
    unlocksAt: 25000
  },
  {
    id: 'chili-river',
    name: 'Chili River',
    description: 'All generators ×2',
    basePrice: 100000,
    category: 'multiplier',
    effect: 2,
    isRepeatable: false,
    unlocksAt: 100000
        },
  {
    id: 'perfect-technique',
    name: 'Perfect Technique',
    description: '10% chance for ×10 payout',
    basePrice: 250000,
    category: 'multiplier',
    effect: 10,
    isRepeatable: false,
    unlocksAt: 250000
  },
  {
    id: 'efficiency-boost',
    name: 'Efficiency Boost',
    description: 'Generators output +20%',
    basePrice: 500000,
    category: 'multiplier',
    effect: 1.2,
    isRepeatable: false,
    unlocksAt: 500000
  },
  {
    id: 'coney-mania',
    name: 'Coney Mania',
    description: 'Next 100 clicks give ×3 payout',
    basePrice: 1000000,
    category: 'special',
    effect: 3,
    isRepeatable: false,
    unlocksAt: 1000000
  },

  // 4. Special / Flavor Unlocks (One-Time)
  {
    id: 'three-way-spillover',
    name: '3-Way Spillover',
    description: '+5% global production',
    basePrice: 2000000,
    category: 'special',
    effect: 1.05,
    isRepeatable: false,
    unlocksAt: 2000000
  },
  {
    id: 'festival-booth',
    name: 'Festival Booth',
    description: '10× CPS bonus chance',
    basePrice: 5000000,
    category: 'special',
    effect: 10,
    isRepeatable: false,
    unlocksAt: 5000000
  },
  {
    id: 'celebrity-endorsement',
    name: 'Celebrity Endorsement',
    description: '+10% boost to all earnings',
    basePrice: 10000000,
    category: 'special',
    effect: 1.1,
    isRepeatable: false,
    unlocksAt: 10000000
  },
  {
    id: 'cult-classic',
    name: 'Cult Classic',
    description: 'Cosmetic unlocks +2% boost',
    basePrice: 25000000,
    category: 'special',
    effect: 1.02,
    isRepeatable: false,
    unlocksAt: 25000000
  },
  {
    id: 'hall-of-fame-coney',
    name: 'Hall of Fame Coney',
    description: 'Permanent ×10 global multiplier',
    basePrice: 100000000,
    category: 'special',
    effect: 10,
    isRepeatable: false,
    unlocksAt: 100000000
  }
];

export interface UpgradeProgress {
  baseClickPower: number;
  generators: Record<string, number>; // ID -> purchase count
  multipliers: Record<string, boolean>; // ID -> purchased
  specialUpgrades: string[]; // IDs purchased
  baseClickPurchases: Record<string, boolean>; // Track base-click upgrades purchased
  totalCPS: number;
  totalMoney: number;
}

export function getUpgradePrice(upgrade: Upgrade, progress: UpgradeProgress, currentMoney: number): number {
  if (upgrade.isRepeatable && upgrade.priceGrowth) {
    const timesPurchased = progress.generators[upgrade.id] || 0;
    return Math.floor(upgrade.basePrice * Math.pow(upgrade.priceGrowth, timesPurchased));
  }
  return upgrade.basePrice;
}

export function canPurchased(upgrade: Upgrade, progress: UpgradeProgress, currentMoney: number): boolean {
  // Check unlock requirement
  if (upgrade.unlocksAt && progress.totalMoney < upgrade.unlocksAt) {
    console.log(`🔒 ${upgrade.name} locked: totalMoney ${progress.totalMoney} < ${upgrade.unlocksAt}`);
    return false;
  }
  
  // Check if already purchased (for one-time upgrades)
  if (!upgrade.isRepeatable) {
    if (upgrade.category === 'multiplier' && progress.multipliers[upgrade.id]) {
      console.log(`✅ ${upgrade.name} already purchased (multiplier)`);
      return false;
    }
    if (upgrade.category === 'special' && progress.specialUpgrades.includes(upgrade.id)) {
      console.log(`✅ ${upgrade.name} already purchased (special)`);
      return false;
    }
    // Check base-click upgrades
    if (upgrade.category === 'base-click' && progress.baseClickPurchases?.[upgrade.id]) {
      console.log(`✅ ${upgrade.name} already purchased (base-click)`);
      return false;
    }
  }
  
  // Check price
  const price = getUpgradePrice(upgrade, progress, currentMoney);
  const canAfford = currentMoney >= price;
  
  console.log(`💳 ${upgrade.name}: money ${currentMoney} >= price ${price} = ${canAfford}`);
  
  return canAfford;
}

export function purchaseUpgrade(upgrade: Upgrade, progress: UpgradeProgress): UpgradeProgress {
  const newProgress = { ...progress };
  
  switch (upgrade.category) {
    case 'base-click':
      if (!newProgress.baseClickPurchases) {
        newProgress.baseClickPurchases = {};
      }
      newProgress.baseClickPurchases[upgrade.id] = true;
      newProgress.baseClickPower += upgrade.effect;
      break;
      
    case 'generator':
      const currentCount = newProgress.generators[upgrade.id] || 0;
      newProgress.generators[upgrade.id] = currentCount + 1;
      break;
      
    case 'multiplier':
      newProgress.multipliers[upgrade.id] = true;
      break;
      
    case 'special':
      newProgress.specialUpgrades.push(upgrade.id);
      break;
  }
  
  return newProgress;
}

export function calculateTotalCPS(progress: UpgradeProgress): number {
  let totalCPS = 0;
  
  // Sum all generators
  for (const [upgradeId, count] of Object.entries(progress.generators)) {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (upgrade) {
      totalCPS += upgrade.effect * count;
    }
  }
  
  // Apply generator multipliers
  for (const [multiplierId, purchased] of Object.entries(progress.multipliers)) {
    if (purchased) {
      const upgrade = UPGRADES.find(u => u.id === multiplierId);
      if (upgrade && upgrade.category === 'multiplier') {
        totalCPS *= upgrade.effect;
      }
    }
  }
  
  // Apply special upgrade effects
  for (const specialId of progress.specialUpgrades) {
    const upgrade = UPGRADES.find(u => u.id === specialId);
    if (upgrade) {
      if (upgrade.id === 'efficiency-boost') {
        totalCPS *= upgrade.effect;
      }
      if (upgrade.id === 'three-way-spillover') {
        totalCPS *= upgrade.effect;
      }
    }
  }
  
  return totalCPS;
}

export function calculateClickValue(progress: UpgradeProgress): number {
  let clickValue = progress.baseClickPower;
  
  // Apply click multipliers
  for (const [multiplierId, purchased] of Object.entries(progress.multipliers)) {
    if (purchased) {
      const upgrade = UPGRADES.find(u => u.id === multiplierId);
      if (upgrade && upgrade.category === 'multiplier') {
        clickValue *= upgrade.effect;
      }
    }
  }
  
  // Apply global multipliers
  for (const specialId of progress.specialUpgrades) {
    const upgrade = UPGRADES.find(u => u.id === specialId);
    if (upgrade && upgrade.category === 'special') {
      if (upgrade.id === 'three-way-spillover') {
        clickValue *= upgrade.effect;
      }
      if (upgrade.id === 'celebrity-endorsement') {
        clickValue *= upgrade.effect;
      }
      if (upgrade.id === 'cult-classic') {
        clickValue *= upgrade.effect;
      }
      if (upgrade.id === 'hall-of-fame-coney') {
        clickValue *= upgrade.effect;
      }
    }
  }
  
  return clickValue;
}
