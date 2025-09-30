# Google Cloud Vision API Setup

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Vision API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"

## 2. Set Up Authentication

### Option A: Service Account (Recommended for Production)
1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name: `coney-counter-vision`
4. Role: `Cloud Vision API User`
5. Create and download JSON key file
6. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/key.json"
   ```

### Option B: Application Default Credentials (Development)
1. Install Google Cloud CLI: `gcloud auth application-default login`
2. This automatically sets up credentials for local development

## 3. Environment Variables

Add to your `.env.local` file:
```bash
# Google Cloud Vision API
GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
# OR use gcloud auth for development
```

## 4. Billing Setup

**IMPORTANT**: Google Cloud Vision API requires billing to be enabled, even for free tier usage.

1. Go to "Billing" in Google Cloud Console
2. Link a billing account (credit card required)
3. Set up billing alerts:
   - Go to "Billing" > "Budgets & Alerts"
   - Create budget with alerts at $1, $5, $10
   - Set automatic shutdown at $10

## 5. Free Tier Limits

- **1,000 requests per month** (free)
- **$1.50 per 1,000 requests** after free tier
- **10MB max image size**
- **No daily limits** (only monthly)

## 6. Testing

The app will automatically:
- Track usage within free tier limits
- Show usage stats in the UI
- Block requests when limit reached
- Display warnings at 80% usage

## 7. Cost Protection

Built-in safeguards:
- ✅ Monthly usage tracking
- ✅ Automatic blocking at free tier limit
- ✅ UI warnings at 80% usage
- ✅ No surprise charges (hard limit)

## Troubleshooting

**"Authentication failed"**
- Check `GOOGLE_APPLICATION_CREDENTIALS` path
- Verify service account has Vision API access

**"Billing account required"**
- Enable billing in Google Cloud Console
- Link a credit card (required even for free tier)

**"API quota exceeded"**
- Check if you've hit the 1,000 request monthly limit
- Wait for next month or upgrade plan
