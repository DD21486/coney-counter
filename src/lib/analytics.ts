import { track } from '@vercel/analytics';

// Custom analytics events for Coney Counter
export const analytics = {
  // User actions
  logConeys: (quantity: number, brand: string) => {
    track('log-coneys', { quantity, brand });
  },
  
  joinWaitlist: (email: string) => {
    track('join-waitlist', { email: email.split('@')[0] }); // Only track domain part for privacy
  },
  
  signUp: (method: string) => {
    track('sign-up', { method });
  },
  
  signIn: (method: string) => {
    track('sign-in', { method });
  },
  
  // Page views
  viewDashboard: () => {
    track('view-dashboard');
  },
  
  viewLeaderboard: () => {
    track('view-leaderboard');
  },
  
  viewConeylytics: () => {
    track('view-coneylytics');
  },
  
  viewAchievements: () => {
    track('view-achievements');
  },
  
  // Admin actions
  approveUser: (adminEmail: string) => {
    track('admin-approve-user', { admin: adminEmail.split('@')[0] });
  },
  
  banUser: (adminEmail: string) => {
    track('admin-ban-user', { admin: adminEmail.split('@')[0] });
  },
  
  // Achievement unlocks
  unlockAchievement: (achievementId: string, achievementName: string) => {
    track('unlock-achievement', { 
      achievementId, 
      achievementName: achievementName.replace(/[^a-zA-Z0-9\s]/g, '') // Clean name for privacy
    });
  }
};

export default analytics;
