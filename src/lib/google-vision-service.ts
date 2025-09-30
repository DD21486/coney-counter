import { ImageAnnotatorClient } from '@google-cloud/vision';

export interface OCRProgress {
  status: string;
  progress: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
}

export interface UsageStats {
  requestsThisMonth: number;
  lastResetDate: string;
  freeTierLimit: number;
}

class GoogleVisionService {
  private client: ImageAnnotatorClient | null = null;
  private isInitialized = false;
  private usageStats: UsageStats = {
    requestsThisMonth: 0,
    lastResetDate: new Date().toISOString().substring(0, 7), // YYYY-MM format
    freeTierLimit: 1000
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Starting Google Cloud Vision initialization...');
      
      // Initialize client (will use default credentials or GOOGLE_APPLICATION_CREDENTIALS)
      this.client = new ImageAnnotatorClient();
      
      this.isInitialized = true;
      console.log('Google Cloud Vision initialized successfully');
    } catch (error: any) {
      console.error('Failed to initialize Google Cloud Vision:', error);
      throw new Error(`Google Vision initialization failed: ${error.message}`);
    }
  }

  // Check if we're within free tier limits
  private checkUsageLimits(): boolean {
    const currentMonth = new Date().toISOString().substring(0, 7);
    
    // Reset counter if new month
    if (this.usageStats.lastResetDate !== currentMonth) {
      this.usageStats.requestsThisMonth = 0;
      this.usageStats.lastResetDate = currentMonth;
      console.log('Usage counter reset for new month');
    }

    // Check if we've exceeded free tier
    if (this.usageStats.requestsThisMonth >= this.usageStats.freeTierLimit) {
      console.warn(`⚠️ Free tier limit reached: ${this.usageStats.requestsThisMonth}/${this.usageStats.freeTierLimit}`);
      return false;
    }

    return true;
  }

  // Update usage stats
  private updateUsageStats(): void {
    this.usageStats.requestsThisMonth++;
    console.log(`📊 Usage: ${this.usageStats.requestsThisMonth}/${this.usageStats.freeTierLimit} requests this month`);
  }

  async processImage(
    imageFile: File, 
    onProgress?: (progress: OCRProgress) => void
  ): Promise<OCRResult> {
    if (!this.isInitialized) {
      console.log('Google Vision not initialized, initializing now...');
      await this.initialize();
    }

    // Check usage limits before processing
    if (!this.checkUsageLimits()) {
      throw new Error('Free tier limit reached. Please try again next month or upgrade your plan.');
    }

    const startTime = Date.now();
    console.log('Starting Google Vision image processing...', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });

    if (imageFile.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Image file too large. Please use an image smaller than 10MB.');
    }

    try {
      // Convert File to Buffer for Google Vision API
      const arrayBuffer = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);

      // Simulate progress updates
      if (onProgress) {
        onProgress({ status: 'Uploading image...', progress: 0.2 });
      }

      // Call Google Vision API
      if (onProgress) {
        onProgress({ status: 'Processing with Google Vision...', progress: 0.5 });
      }

      const [result] = await this.client!.textDetection({
        image: { content: imageBuffer }
      });

      if (onProgress) {
        onProgress({ status: 'Extracting text...', progress: 0.8 });
      }

      const detections = result.textAnnotations;
      if (!detections || detections.length === 0) {
        throw new Error('No text detected in image');
      }

      // Get the full text (first detection contains all text)
      const fullText = detections[0].description || '';
      
      // Calculate average confidence from all text detections
      const confidenceScores = detections.slice(1).map(detection => 
        detection.score || 0
      );
      const averageConfidence = confidenceScores.length > 0 
        ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
        : 0.9; // Default high confidence if no individual scores

      const processingTime = Date.now() - startTime;

      // Update usage stats
      this.updateUsageStats();

      console.log('Google Vision processing completed:', {
        textLength: fullText.length,
        confidence: averageConfidence,
        processingTime,
        usageThisMonth: this.usageStats.requestsThisMonth
      });

      if (onProgress) {
        onProgress({ status: 'Complete!', progress: 1.0 });
      }

      return {
        text: fullText,
        confidence: averageConfidence,
        processingTime
      };

    } catch (error: any) {
      console.error('Google Vision processing failed:', error);
      
      // Check for specific Google Cloud errors
      if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error.message.includes('authentication') || error.message.includes('credentials')) {
        throw new Error('Authentication failed. Please check your Google Cloud credentials.');
      } else if (error.message.includes('billing')) {
        throw new Error('Billing account required. Please set up billing for Google Cloud Vision API.');
      } else {
        throw new Error(`Failed to process image: ${error.message}`);
      }
    }
  }

  // Get current usage stats
  getUsageStats(): UsageStats {
    return { ...this.usageStats };
  }

  // Reset usage stats (for testing)
  resetUsageStats(): void {
    this.usageStats.requestsThisMonth = 0;
    this.usageStats.lastResetDate = new Date().toISOString().substring(0, 7);
    console.log('Usage stats reset');
  }
}

// Create singleton instance
const googleVisionService = new GoogleVisionService();

// Export functions that match the Tesseract interface
export async function extractTextFromImage(
  imageFile: File, 
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  return googleVisionService.processImage(imageFile, onProgress);
}

export function getUsageStats(): UsageStats {
  return googleVisionService.getUsageStats();
}

export function resetUsageStats(): void {
  googleVisionService.resetUsageStats();
}

export default googleVisionService;
