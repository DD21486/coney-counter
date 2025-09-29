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
      // Dynamic import to avoid SSR issues
      const Tesseract = await import('tesseract.js');
      
      this.worker = await Tesseract.createWorker({
        logger: (m: any) => {
          console.log('OCR Progress:', m);
        }
      });

      await this.worker.load();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
      
      this.isInitialized = true;
      console.log('OCR Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OCR service:', error);
      throw new Error('OCR initialization failed');
    }
  }

  // Process image and extract text
  async processImage(
    imageFile: File, 
    onProgress?: (progress: OCRProgress) => void
  ): Promise<OCRResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const startTime = Date.now();

    try {
      const result = await this.worker.recognize(imageFile, {
        logger: (m: any) => {
          if (onProgress) {
            onProgress({
              status: m.status,
              progress: m.progress || 0
            });
          }
        }
      });

      const processingTime = Date.now() - startTime;

      return {
        text: result.data.text,
        confidence: result.data.confidence / 100, // Convert to 0-1 scale
        processingTime
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error('Failed to process image');
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
