# Coney Verification System - Developer Quick Reference

## Quick Start

### 1. Install Dependencies
```bash
npm install tesseract.js
```

### 2. Import Services
```typescript
import { extractTextFromImage, OCRProgress } from '@/lib/ocr-service';
import { processReceiptText, ReceiptData } from '@/lib/receipt-processor';
```

### 3. Basic Usage
```typescript
// Process uploaded image
const handleImageUpload = async (file: File) => {
  const ocrResult = await extractTextFromImage(file, (progress) => {
    console.log('OCR Progress:', progress);
  });
  
  const receiptData = processReceiptText(ocrResult.text);
  
  if (receiptData.confidence > 0.5) {
    // Auto-populate form
    form.setFieldsValue({
      brand: receiptData.brand,
      quantity: receiptData.quantity
    });
  }
};
```

## API Reference

### OCR Service

#### `extractTextFromImage(file: File, onProgress?: (progress: OCRProgress) => void): Promise<OCRResult>`

Extracts text from an image file using Tesseract.js.

**Parameters:**
- `file`: Image file to process
- `onProgress`: Optional progress callback

**Returns:**
```typescript
interface OCRResult {
  text: string;           // Extracted text
  confidence: number;     // OCR confidence (0-1)
  processingTime: number; // Processing time in ms
}
```

**Example:**
```typescript
const result = await extractTextFromImage(imageFile, (progress) => {
  console.log(`${progress.status}: ${Math.round(progress.progress * 100)}%`);
});
```

### Receipt Processor

#### `processReceiptText(text: string): ReceiptData`

Processes OCR text to extract receipt data.

**Parameters:**
- `text`: Raw OCR text from receipt

**Returns:**
```typescript
interface ReceiptData {
  brand?: string;         // Detected brand name
  quantity?: number;     // Number of coneys
  date?: string;         // Receipt date (YYYY-MM-DD)
  time?: string;         // Receipt time
  total?: number;        // Total amount
  checkNumber?: string;  // Check/order number
  items?: string[];      // Individual items (future)
  confidence: number;    // Overall confidence (0-1)
  rawText: string;       // Original OCR text
}
```

**Example:**
```typescript
const receiptData = processReceiptText(ocrText);
console.log(`Found ${receiptData.quantity} coneys from ${receiptData.brand}`);
```

## Brand Detection Patterns

### Supported Brands
```typescript
const BRAND_PATTERNS = {
  'Skyline Chili': ['skyline', 'chili'],
  'Gold Star Chili': ['gold star', 'goldstar'],
  'Dixie Chili': ['dixie'],
  'Camp Washington Chili': ['camp washington'],
  'Empress Chili': ['empress'],
  'Price Hill Chili': ['price hill'],
  'Pleasant Ridge Chili': ['pleasant ridge'],
  'Blue Ash Chili': ['blue ash']
};
```

### Adding New Brands
```typescript
// In receipt-processor.ts
const BRAND_PATTERNS = {
  // ... existing brands
  'New Brand': {
    keywords: ['new', 'brand'],
    aliases: ['new brand chili', 'newbrand']
  }
};
```

## Quantity Detection Patterns

### Supported Patterns
```typescript
const CONEY_PATTERNS = [
  /(\d+)\s*(?:cheese\s*)?coney/i,     // "2 Cheese Coney"
  /(\d+)\s*coneys/i,                   // "3 Coneys"
  /(\d+)\s*(?:way|ways)/i,             // "3-Way" = 1 coney
  /(\d+)\s*(?:small|medium|large)\s*(?:chili|coney)/i, // "1 Small Chili"
];
```

### Adding New Patterns
```typescript
// Add to CONEY_PATTERNS array
/(\d+)\s*your-pattern/i,  // Your custom pattern
```

## Date/Time Patterns

### Supported Formats
```typescript
const DATE_PATTERNS = [
  /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,  // MM/DD/YYYY
  /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,   // YYYY/MM/DD
  /(\d{1,2})\s+(?:jan|feb|mar...)\w*\s+(\d{2,4})/i, // "28 Sep 2025"
];

const TIME_PATTERNS = [
  /(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)?/i,  // 1:11:24 PM
  /(\d{1,2}):(\d{2})\s*(am|pm)/i,          // 1:11 PM
];
```

## Error Handling

### Common Error Scenarios
```typescript
try {
  const ocrResult = await extractTextFromImage(file);
  const receiptData = processReceiptText(ocrResult.text);
  
  if (receiptData.confidence < 0.3) {
    throw new Error('Low confidence extraction');
  }
  
} catch (error) {
  if (error.message.includes('Low confidence')) {
    // Show warning, allow manual entry
    message.warning('Receipt processed but data extraction was uncertain');
  } else {
    // Show error, suggest manual entry
    message.error('Failed to process receipt. Please use manual entry.');
  }
}
```

### Fallback Strategies
```typescript
// Always provide manual entry fallback
const handleImageUpload = async (file: File) => {
  try {
    // Try OCR processing
    const receiptData = await processReceipt(file);
    
    if (receiptData.confidence > 0.5) {
      // Auto-populate form
      populateForm(receiptData);
    } else {
      // Show extracted data for manual verification
      showExtractedData(receiptData);
    }
    
  } catch (error) {
    // Fallback to manual entry
    message.error('OCR failed. Please use manual entry.');
    setEntryMode('manual');
  }
};
```

## Performance Tips

### 1. Initialize OCR Worker Once
```typescript
// Initialize worker when component mounts
useEffect(() => {
  const initOCR = async () => {
    await ocrService.initialize();
  };
  initOCR();
}, []);
```

### 2. Show Progress Feedback
```typescript
const [ocrProgress, setOcrProgress] = useState<OCRProgress | null>(null);

const handleImageUpload = async (file: File) => {
  const result = await extractTextFromImage(file, (progress) => {
    setOcrProgress(progress);
  });
  
  setOcrProgress(null); // Clear progress
};
```

### 3. Clean Up Resources
```typescript
// Clean up OCR worker when component unmounts
useEffect(() => {
  return () => {
    ocrService.cleanup();
  };
}, []);
```

## Testing

### Test Receipt Data
```typescript
const testReceiptText = `
Skyline Chili
Norwood
4588 Montgomery Rd. Cincinnati, OH 45212

Date: 9/28/2025
Time: 1:11:24 PM
Check: 646190

2 Cheese Coney PL      5.98
1 MED Coke             2.89

Total: 17.16
`;

const receiptData = processReceiptText(testReceiptText);
// Should extract: brand="Skyline Chili", quantity=2, date="2025-09-28"
```

### Mock OCR Service
```typescript
// For testing without actual OCR
const mockOCRService = {
  async processImage(file: File): Promise<OCRResult> {
    return {
      text: testReceiptText,
      confidence: 0.9,
      processingTime: 1000
    };
  }
};
```

## Troubleshooting

### Common Issues

**OCR Worker Fails to Initialize**
```typescript
// Check if running in browser environment
if (typeof window === 'undefined') {
  throw new Error('OCR service requires browser environment');
}
```

**Low Confidence Scores**
```typescript
// Check OCR text quality
console.log('OCR Text:', ocrResult.text);
console.log('Confidence:', ocrResult.confidence);

// May need better image preprocessing
```

**Pattern Matching Fails**
```typescript
// Debug pattern matching
const processor = new ReceiptProcessor(text);
console.log('Brand detection:', processor.detectBrand());
console.log('Quantity detection:', processor.detectConeyQuantity());
```

### Debug Mode
```typescript
// Enable debug logging
const processor = new ReceiptProcessor(text);
const receiptData = processor.processReceipt();

console.log('Raw OCR Text:', receiptData.rawText);
console.log('Extracted Data:', receiptData);
console.log('Confidence:', receiptData.confidence);
```

---

*This quick reference is part of the Coney Verification System documentation.*
