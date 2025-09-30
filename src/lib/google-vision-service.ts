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
  private usageStats: UsageStats = {
    requestsThisMonth: 0,
    lastResetDate: new Date().toISOString().substring(0, 7), // YYYY-MM format
    freeTierLimit: 1000
  };

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
      // Simulate progress updates
      if (onProgress) {
        onProgress({ status: 'Uploading image...', progress: 0.2 });
      }

      // Create FormData to send to API route
      const formData = new FormData();
      formData.append('image', imageFile);

      if (onProgress) {
        onProgress({ status: 'Processing with Google Vision...', progress: 0.5 });
      }

      // Call our API route
      const response = await fetch('/api/vision', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      if (onProgress) {
        onProgress({ status: 'Extracting text...', progress: 0.8 });
      }

      const result = await response.json();
      const processingTime = Date.now() - startTime;

      // Update usage stats
      this.updateUsageStats();

      console.log('Google Vision processing completed:', {
        textLength: result.text.length,
        confidence: result.confidence,
        processingTime,
        usageThisMonth: this.usageStats.requestsThisMonth
      });

      if (onProgress) {
        onProgress({ status: 'Complete!', progress: 1.0 });
      }

      return {
        text: result.text,
        confidence: result.confidence,
        processingTime
      };

    } catch (error: any) {
      console.error('Google Vision processing failed:', error);
      throw new Error(`Failed to process image: ${error.message}`);
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
