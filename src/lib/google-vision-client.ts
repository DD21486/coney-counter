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

// Client-side usage tracking
function getUsageStats(): UsageStats {
  if (typeof window === 'undefined') {
    return {
      requestsThisMonth: 0,
      lastResetDate: new Date().toISOString().substring(0, 7),
      freeTierLimit: 1000
    };
  }

  const stored = localStorage.getItem('google-vision-usage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const currentMonth = new Date().toISOString().substring(0, 7);
      
      // Reset if new month
      if (parsed.lastResetDate !== currentMonth) {
        const newStats = {
          requestsThisMonth: 0,
          lastResetDate: currentMonth,
          freeTierLimit: 1000
        };
        localStorage.setItem('google-vision-usage', JSON.stringify(newStats));
        return newStats;
      }
      
      return parsed;
    } catch (e) {
      console.warn('Failed to parse stored usage stats');
    }
  }
  
  return {
    requestsThisMonth: 0,
    lastResetDate: new Date().toISOString().substring(0, 7),
    freeTierLimit: 1000
  };
}

function updateUsageStats(): void {
  if (typeof window === 'undefined') return;
  
  const stats = getUsageStats();
  stats.requestsThisMonth++;
  localStorage.setItem('google-vision-usage', JSON.stringify(stats));
  console.log(`📊 Usage: ${stats.requestsThisMonth}/${stats.freeTierLimit} requests this month`);
}

// Main function to extract text from image using our API route
export async function extractTextFromImage(
  imageFile: File, 
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
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
    updateUsageStats();

    console.log('Google Vision processing completed:', {
      textLength: result.text.length,
      confidence: result.confidence,
      processingTime
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

// Export the functions
export { getUsageStats };
export function resetUsageStats(): void {
  if (typeof window === 'undefined') return;
  
  const stats = {
    requestsThisMonth: 0,
    lastResetDate: new Date().toISOString().substring(0, 7),
    freeTierLimit: 1000
  };
  localStorage.setItem('google-vision-usage', JSON.stringify(stats));
  console.log('Usage stats reset');
}
