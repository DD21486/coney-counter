# Analytics Setup for Coney Counter

## Vercel Analytics Integration

This project uses **Vercel Analytics** for lightweight, privacy-focused analytics tracking.

### What's Tracked

#### User Actions
- **Log Coneys**: When users log coneys (quantity + brand)
- **Join Waitlist**: When users sign up for the waitlist
- **Sign Up/Sign In**: Authentication events
- **Page Views**: Dashboard, Leaderboard, Coneylytics, Achievements

#### Admin Actions
- **User Approval**: When admins approve users
- **User Banning**: When admins ban users

#### Achievement Events
- **Achievement Unlocks**: When users unlock new achievements

### Privacy Features

- **No Personal Data**: Only tracks anonymous usage patterns
- **Email Privacy**: Only tracks email domain (not full email)
- **Clean Data**: Achievement names are cleaned of special characters
- **Admin Privacy**: Admin actions only track admin email domain

### Analytics Dashboard

Once deployed to Vercel, you can view analytics at:
- **Vercel Dashboard** → Your Project → Analytics tab
- **Real-time data** on page views, user actions, and custom events

### Custom Events Available

```typescript
import { analytics } from '@/lib/analytics';

// Track user actions
analytics.logConeys(3, 'Skyline Chili');
analytics.joinWaitlist('user@example.com');
analytics.viewDashboard();

// Track admin actions
analytics.approveUser('admin@example.com');
analytics.banUser('admin@example.com');

// Track achievements
analytics.unlockAchievement('weekly-champion', 'Weekly Champion');
```

### Benefits

✅ **Lightweight**: Minimal impact on page load times
✅ **Privacy-Focused**: No cookies, GDPR compliant
✅ **Real-time**: Data appears immediately in Vercel dashboard
✅ **Custom Events**: Track specific user behaviors
✅ **Free**: Included with Vercel hosting
✅ **No Setup**: Works automatically once deployed

### Data Retention

- **Vercel Analytics**: Data retained for 30 days
- **Custom Events**: Same retention policy
- **No Personal Data**: Only anonymous usage patterns stored
