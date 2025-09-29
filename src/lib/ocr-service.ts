// OCR Service for Receipt Processing
// Uses Tesseract.js for client-side OCR processing

export interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
}

export interface OCRProgress {
  status: string;
  progress: number;
}

class OCRService {
  private isInitialized = false;
  private worker: any = null;

  // Initialize Tesseract worker
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Starting OCR initialization...');
      
      // Dynamic import to avoid SSR issues
      const Tesseract = await import('tesseract.js');
      console.log('Tesseract.js loaded');
      
      this.worker = await Tesseract.createWorker('eng');
      console.log('Worker created and initialized');
      
      this.isInitialized = true;
      console.log('OCR Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OCR service:', error);
      throw new Error(`OCR initialization failed: ${error.message}`);
    }
  }

  // Process image and extract text
  async processImage(
    imageFile: File, 
    onProgress?: (progress: OCRProgress) => void
  ): Promise<OCRResult> {
    if (!this.isInitialized) {
      console.log('OCR not initialized, initializing now...');
      await this.initialize();
    }

    const startTime = Date.now();
    console.log('Starting image processing...', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });

    // Check file size (warn if > 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      console.warn('Large image file detected:', imageFile.size, 'bytes');
    }

    // Simulate progress updates since we can't use logger callback
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      progressInterval = setInterval(() => {
        if (onProgress) {
          onProgress({
            status: 'Processing image...',
            progress: Math.min(0.9, (Date.now() - startTime) / 30000) // Simulate progress over 30 seconds
          });
        }
      }, 500);

      // Add timeout wrapper
      const processWithTimeout = Promise.race([
        this.worker.recognize(imageFile),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('OCR processing timeout after 60 seconds')), 60000)
        )
      ]);

      const result = await processWithTimeout as any;
      
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      const processingTime = Date.now() - startTime;

      console.log('OCR processing completed:', {
        textLength: result.data.text.length,
        confidence: result.data.confidence,
        processingTime
      });

      return {
        text: result.data.text,
        confidence: result.data.confidence / 100, // Convert to 0-1 scale
        processingTime
      };
    } catch (error) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      console.error('OCR processing failed:', error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  // Cleanup worker
  async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

// Singleton instance
export const ocrService = new OCRService();

// Utility function for easy usage
export async function extractTextFromImage(
  imageFile: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  return await ocrService.processImage(imageFile, onProgress);
}
