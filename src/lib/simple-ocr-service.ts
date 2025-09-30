import Tesseract from 'tesseract.js';

export interface OCRProgress {
  status: string;
  progress: number;
}

export interface SimpleOCRResult {
  coneyCount: number | null;
  date: string | null;
  confidence: number;
  rawText: string;
  processingTime: number;
}

export interface SimpleReceiptData {
  coneyCount: number | null;
  date: string | null;
  confidence: number;
  isValidReceipt: boolean;
  warnings: string[];
  noConeysDetected?: boolean; // Special flag for when no coneys are found
  isLikelyFake?: boolean; // Flag for detecting fake/mock receipts
}

class SimpleOCRService {
  private worker: Tesseract.Worker | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing Tesseract.js worker...');
      // New API: createWorker with language directly
      this.worker = await Tesseract.createWorker('eng');
      this.isInitialized = true;
      console.log('Tesseract.js worker initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Tesseract worker:', error);
      throw new Error('OCR service initialization failed');
    }
  }

  async extractTextFromImage(
    imageFile: File,
    onProgress?: (progress: OCRProgress) => void
  ): Promise<SimpleOCRResult> {
    const startTime = Date.now();
    console.log('Starting OCR processing...', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });

    try {
      // Simulate progress updates
      if (onProgress) {
        onProgress({ status: 'Processing image...', progress: 0.1 });
      }

      // Use the new Tesseract.js API directly
      const { data } = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m) => {
          console.log('Tesseract progress:', m);
          if (onProgress && m.status) {
            onProgress({ 
              status: m.status, 
              progress: m.progress || 0.5 
            });
          }
        }
      });

      const processingTime = Date.now() - startTime;

      console.log('OCR completed:', {
        textLength: data.text.length,
        confidence: data.confidence,
        processingTime
      });

      if (onProgress) {
        onProgress({ status: 'Extracting data...', progress: 0.8 });
      }

      // Extract only coney count and date
      const extractedData = this.extractConeyCountAndDate(data.text);

      if (onProgress) {
        onProgress({ status: 'Complete!', progress: 1.0 });
      }

      return {
        coneyCount: extractedData.coneyCount,
        date: extractedData.date,
        confidence: data.confidence / 100, // Convert to 0-1 scale
        rawText: data.text,
        processingTime
      };

    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  private extractConeyCountAndDate(text: string): { coneyCount: number | null; date: string | null } {
    console.log('🔍 Extracting coney count and date from text...');
    console.log('Raw text:', text);

    let coneyCount: number | null = null;
    let date: string | null = null;

    // Extract coney count - ONLY look for explicit "coney" mentions
    const coneyPatterns = [
      /(\d+)\s*cheese\s*coney/i,  // "2 Cheese Coney"
      /(\d+)\s*coneys/i,          // "2 Coneys"
      /coney\s*(\d+)/i,           // "Coney 2"
      /(\d+)\s*cheese\s*coney\s*pl/i,      // "2 Cheese Coney PL"
      /(\d+)\s*cheese\s*coney\s*:\s*\d+\.\d{2}/i, // "2 Cheese Coney: 6.30"
      /(\d+)\s*cheese\s*coney\s*seat\s*\d+/i,     // "2 Cheese Coney Seat 1"
    ];

    for (const pattern of coneyPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        const quantity = parseInt(matches[1]);
        if (!isNaN(quantity)) {
          coneyCount = quantity;
          console.log(`✅ Found coney count: ${coneyCount} from pattern: "${matches[0]}"`);
          break; // Take the first match
        }
      }
    }

    // Extract date - look for common date patterns
    const datePatterns = [
      /(\d{1,2}\/\d{1,2}\/\d{2,4})/i,  // MM/DD/YYYY or MM/DD/YY
      /(\d{1,2}-\d{1,2}-\d{2,4})/i,    // MM-DD-YYYY or MM-DD-YY
      /(\d{4}-\d{1,2}-\d{1,2})/i,       // YYYY-MM-DD
      /(\d{1,2}\/\d{1,2})/i,            // MM/DD (current year assumed)
    ];

    for (const pattern of datePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        date = matches[1];
        console.log(`✅ Found date: ${date} from pattern: "${matches[0]}"`);
        break; // Take the first match
      }
    }

    console.log(`🎯 Final extraction: ${coneyCount} coneys, date: ${date}`);
    return { coneyCount, date };
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      console.log('Tesseract worker terminated');
    }
  }
}

// Create singleton instance
const simpleOCRService = new SimpleOCRService();

// Export functions
export async function extractTextFromImage(
  imageFile: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<SimpleOCRResult> {
  const startTime = Date.now();
  console.log('Starting OCR processing...', {
    fileName: imageFile.name,
    fileSize: imageFile.size,
    fileType: imageFile.type
  });

  try {
    // Simulate progress updates
    if (onProgress) {
      onProgress({ status: 'Processing image...', progress: 0.1 });
    }

    // Use the new Tesseract.js API directly
    const { data } = await Tesseract.recognize(imageFile, 'eng', {
      logger: (m) => {
        console.log('Tesseract progress:', m);
        if (onProgress && m.status) {
          onProgress({ 
            status: m.status, 
            progress: m.progress || 0.5 
          });
        }
      }
    });

    const processingTime = Date.now() - startTime;

    console.log('OCR completed:', {
      textLength: data.text.length,
      confidence: data.confidence,
      processingTime
    });

    if (onProgress) {
      onProgress({ status: 'Extracting data...', progress: 0.8 });
    }

    // Extract only coney count and date
    const extractedData = simpleOCRService['extractConeyCountAndDate'](data.text);

    if (onProgress) {
      onProgress({ status: 'Complete!', progress: 1.0 });
    }

    return {
      coneyCount: extractedData.coneyCount,
      date: extractedData.date,
      confidence: data.confidence / 100, // Convert to 0-1 scale
      rawText: data.text,
      processingTime
    };

  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
}

/**
 * Detect if a receipt is likely fake/mock
 */
function detectFakeReceipt(rawText: string): boolean {
  const text = rawText.toLowerCase();
  
  // Check for common fake receipt indicators
  const fakeIndicators = [
    'figma',           // Design tool
    'mockup',          // Mock receipt
    'template',        // Template
    'sample',          // Sample receipt
    'test receipt',    // Test data
    'fake',            // Explicitly fake
    'demo',            // Demo receipt
    'placeholder',     // Placeholder text
    'lorem ipsum',     // Lorem ipsum text
    'design',          // Design-related
    'prototype',       // Prototype
    'wireframe'        // Wireframe
  ];
  
  // Check for suspiciously perfect formatting
  const suspiciousPatterns = [
    /^\s*skyline\s*$/i,           // Just "Skyline" alone
    /^\s*\d{2}\/\d{2}\/\d{2}\s*$/i, // Just date alone
    /^\s*\d+\s*coneys?\s*$/i,      // Just "X coneys" alone
    /^\s*\$\d+\s*$/i              // Just amount alone
  ];
  
  // Check for fake indicators
  for (const indicator of fakeIndicators) {
    if (text.includes(indicator)) {
      console.log(`Fake receipt detected: contains "${indicator}"`);
      return true;
    }
  }
  
  // Check for suspicious patterns (too clean/simple)
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length <= 4) {
    // Very short receipt might be fake
    let suspiciousLines = 0;
    for (const line of lines) {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(line)) {
          suspiciousLines++;
          break;
        }
      }
    }
    
    // If most lines match suspicious patterns, likely fake
    if (suspiciousLines >= lines.length * 0.75) {
      console.log('Fake receipt detected: suspiciously simple format');
      return true;
    }
  }
  
  // Check for unrealistic amounts
  const amountMatches = text.match(/\$\d+/g);
  if (amountMatches) {
    for (const amount of amountMatches) {
      const value = parseInt(amount.replace('$', ''));
      if (value > 1000 || value < 1) { // Unrealistic amounts
        console.log(`Fake receipt detected: unrealistic amount ${amount}`);
        return true;
      }
    }
  }
  
  return false;
}

export function processReceiptText(text: string): SimpleReceiptData {
  const { coneyCount, date } = simpleOCRService['extractConeyCountAndDate'](text);
  
  const warnings: string[] = [];
  let isValidReceipt = true;

  // Check if receipt is likely fake
  const isLikelyFake = detectFakeReceipt(text);
  if (isLikelyFake) {
    warnings.push('This appears to be a mock or fake receipt');
    isValidReceipt = false;
  }

  // Check if this looks like a receipt
  const receiptIndicators = [
    /total/i,
    /subtotal/i,
    /tax/i,
    /receipt/i,
    /check/i,
    /order/i,
    /\$\d+\.\d{2}/, // Dollar amounts
    /\d{1,2}:\d{2}/, // Time format
  ];

  const hasReceiptIndicators = receiptIndicators.some(pattern => pattern.test(text));
  
  if (!hasReceiptIndicators && !isLikelyFake) {
    isValidReceipt = false;
    warnings.push('No receipt indicators found (total, tax, receipt, etc.)');
  }

  if (!coneyCount) {
    warnings.push('No coney count detected');
  }

  if (!date) {
    warnings.push('No date detected');
  }

  // Calculate overall confidence
  let confidence = 0.5; // Base confidence
  if (coneyCount) confidence += 0.3;
  if (date) confidence += 0.2;
  if (isValidReceipt) confidence += 0.2;

  return {
    coneyCount,
    date,
    confidence: Math.min(confidence, 1.0),
    isValidReceipt,
    warnings,
    isLikelyFake
  };
}
