# Coney Verification System Wiki

## Overview

The Coney Verification System is an AI-powered receipt processing feature that automatically extracts coney purchase data from uploaded receipt images. It uses OCR (Optical Character Recognition) technology to read receipt text and intelligently parse relevant information like brand, quantity, date, and pricing.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [How It Works](#how-it-works)
3. [Data Extraction Process](#data-extraction-process)
4. [Supported Receipt Formats](#supported-receipt-formats)
5. [User Interface](#user-interface)
6. [Technical Implementation](#technical-implementation)
7. [Error Handling](#error-handling)
8. [Future Enhancements](#future-enhancements)

## System Architecture

### Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Upload   │───▶│   OCR Service   │───▶│ Receipt Processor│
│   (Camera/File) │    │  (Tesseract.js) │    │ (Pattern Matching)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │  Form Auto-Fill │
                                               │  & Validation   │
                                               └─────────────────┘
```

### Key Files

- **`/src/lib/ocr-service.ts`** - OCR processing using Tesseract.js
- **`/src/lib/receipt-processor.ts`** - Pattern matching and data extraction
- **`/src/app/log-coney/page.tsx`** - Main UI with upload interface

## How It Works

### 1. User Upload Process

1. **Mode Selection**: User toggles between "Manual Entry" and "Upload Receipt"
2. **Image Capture**: 
   - **Mobile**: Camera opens directly (`capture="environment"`)
   - **Desktop**: File picker opens
3. **Image Processing**: OCR extracts text from the image
4. **Data Extraction**: Pattern matching identifies relevant information
5. **Form Population**: Auto-fills form fields if confidence is high enough
6. **User Verification**: User can review and edit extracted data

### 2. OCR Processing Flow

```typescript
// 1. Initialize Tesseract worker
const worker = await Tesseract.createWorker();

// 2. Process image
const result = await worker.recognize(imageFile);

// 3. Extract text
const extractedText = result.data.text;

// 4. Process with pattern matching
const receiptData = processReceiptText(extractedText);
```

### 3. Data Extraction Pipeline

```
Raw OCR Text → Brand Detection → Quantity Extraction → Date/Time Parsing → Price Extraction → Confidence Scoring
```

## Data Extraction Process

### Brand Detection

The system uses flexible keyword matching to identify Cincinnati chili brands:

```typescript
const BRAND_PATTERNS = {
  'Skyline Chili': {
    keywords: ['skyline', 'chili'],
    aliases: ['skyline chili', 'skylinechili']
  },
  'Gold Star Chili': {
    keywords: ['gold star', 'goldstar'],
    aliases: ['gold star chili', 'goldstar chili']
  },
  // ... other brands
};
```

**Supported Brands:**
- Skyline Chili
- Gold Star Chili
- Dixie Chili
- Camp Washington Chili
- Empress Chili
- Price Hill Chili
- Pleasant Ridge Chili
- Blue Ash Chili

### Quantity Extraction

The system recognizes various coney quantity formats:

```typescript
const CONEY_PATTERNS = [
  /(\d+)\s*(?:cheese\s*)?coney/i,     // "2 Cheese Coney"
  /(\d+)\s*coneys/i,                   // "3 Coneys"
  /(\d+)\s*(?:way|ways)/i,             // "3-Way" = 1 coney
  /(\d+)\s*(?:small|medium|large)\s*(?:chili|coney)/i, // "1 Small Chili"
];
```

**Examples:**
- `"2 Cheese Coney"` → 2 coneys
- `"3-Way"` → 1 coney
- `"4 Coneys"` → 4 coneys
- `"1 Small Chili"` → 1 coney

### Date and Time Extraction

Supports multiple date formats:

```typescript
const DATE_PATTERNS = [
  /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,  // MM/DD/YYYY
  /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,   // YYYY/MM/DD
  /(\d{1,2})\s+(?:jan|feb|mar...)\w*\s+(\d{2,4})/i, // "28 Sep 2025"
];
```

### Price Extraction

Extracts total amounts for duplicate detection and future economics:

```typescript
const PRICE_PATTERNS = [
  /\$?(\d+\.\d{2})/g,                    // Any price format
  /total[:\s]*\$?(\d+\.\d{2})/i,         // "Total: $17.16"
  /amount[:\s]*\$?(\d+\.\d{2})/i,       // "Amount: $17.16"
];
```

### Check Number Extraction

Prevents duplicate uploads:

```typescript
const CHECK_PATTERNS = [
  /check[:\s]*(\d+)/i,    // "Check: 646190"
  /order[:\s]*(\d+)/i,    // "Order: 646190"
  /receipt[:\s]*(\d+)/i, // "Receipt: 646190"
  /#(\d+)/,              // "#646190"
];
```

## Supported Receipt Formats

### Skyline Chili Receipt Example

```
Skyline Chili
Norwood
4588 Montgomery Rd. Cincinnati, OH 45212
(513) 531-8381

Date: 9/28/2025
Time: 1:11:24 PM
Server: Mikayla
Check: 646190
Table: 2

1 Small 4 Way Onion    7.05
2 Cheese Coney PL      5.98
1 MED Coke             2.89

SubTotal: 15.92
Tax: 1.24
Total: 17.16
```

**Extracted Data:**
- **Brand**: Skyline Chili
- **Quantity**: 2 coneys
- **Date**: 2025-09-28
- **Time**: 1:11:24 PM
- **Total**: $17.16
- **Check Number**: 646190

### Flexible Format Support

The system is designed to handle variations in:
- **Receipt layouts** (different brands, formats)
- **Text positioning** (items in different locations)
- **Font styles** (different receipt printers)
- **Language variations** (abbreviations, typos)

## User Interface

### Upload Mode Features

1. **Toggle Switch**: Easy switching between manual and upload modes
2. **Drag & Drop Area**: Visual upload interface with hover effects
3. **Camera Integration**: Direct camera access on mobile devices
4. **Progress Indicators**: Real-time OCR processing status
5. **Extracted Data Display**: Shows parsed information with confidence scores
6. **Manual Override**: Always available fallback to manual entry

### Visual Feedback

- **Processing State**: Loading spinner with progress percentage
- **Success State**: Green confirmation with extracted data
- **Error State**: Red error message with retry options
- **Confidence Display**: Shows extraction confidence percentage

## Technical Implementation

### OCR Service (`ocr-service.ts`)

```typescript
class OCRService {
  async initialize(): Promise<void> {
    const Tesseract = await import('tesseract.js');
    this.worker = await Tesseract.createWorker();
    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
  }

  async processImage(file: File, onProgress?: (progress: OCRProgress) => void): Promise<OCRResult> {
    const result = await this.worker.recognize(file, {
      logger: (m) => onProgress?.(m)
    });
    return {
      text: result.data.text,
      confidence: result.data.confidence / 100,
      processingTime: Date.now() - startTime
    };
  }
}
```

### Receipt Processor (`receipt-processor.ts`)

```typescript
export class ReceiptProcessor {
  detectBrand(): { brand: string; confidence: number } {
    // Flexible keyword matching for brand detection
  }

  detectConeyQuantity(): { quantity: number; confidence: number } {
    // Pattern matching for quantity extraction
  }

  processReceipt(): ReceiptData {
    // Combines all detection methods with confidence scoring
  }
}
```

### Integration in Log-Coney Page

```typescript
const handleImageUpload = async (file: File) => {
  setIsProcessingImage(true);
  
  // Extract text using OCR
  const ocrResult = await extractTextFromImage(file, setOcrProgress);
  
  // Process the extracted text
  const receiptData = processReceiptText(ocrResult.text);
  
  // Auto-populate form if confident
  if (receiptData.confidence > 0.5) {
    form.setFieldsValue({
      brand: receiptData.brand,
      quantity: receiptData.quantity
    });
  }
};
```

## Error Handling

### OCR Failures

- **Network Issues**: Graceful fallback to manual entry
- **Image Quality**: User guidance for better photos
- **Processing Errors**: Clear error messages with retry options

### Low Confidence Results

- **Confidence < 50%**: Warning message, manual verification required
- **Missing Data**: Partial auto-fill with user completion
- **Invalid Data**: Form validation prevents submission

### User Experience Safeguards

- **Always Available Manual Entry**: Users can always fall back
- **Clear Instructions**: Tips for optimal photo quality
- **Progress Feedback**: Real-time processing status
- **Error Recovery**: Easy retry mechanisms

## Future Enhancements

### Planned Features

1. **Duplicate Detection**
   - Check number + date combination validation
   - Cross-reference with existing logs
   - Prevent duplicate receipt uploads

2. **Coney Economics**
   - Price tracking for analytics
   - Cost per coney calculations
   - Spending pattern analysis

3. **Advanced Item Recognition**
   - 3-Way = 1 coney conversion
   - 4-Way = 1 coney conversion
   - Other food item recognition

4. **Receipt Storage**
   - Temporary image storage for verification
   - Automatic cleanup after processing
   - Privacy-focused data handling

### Technical Improvements

1. **Performance Optimization**
   - Web Workers for OCR processing
   - Image preprocessing for better accuracy
   - Caching for repeated patterns

2. **Accuracy Improvements**
   - Machine learning for better pattern recognition
   - Brand-specific receipt templates
   - User feedback integration

3. **Mobile Optimization**
   - Better camera integration
   - Offline processing capabilities
   - Reduced data usage

## Best Practices

### For Users

1. **Photo Quality**
   - Ensure good lighting
   - Keep receipt flat and unfolded
   - Avoid shadows and glare
   - Include entire receipt in frame

2. **When to Use**
   - Clear, printed receipts work best
   - Handwritten receipts may have lower accuracy
   - Damaged or torn receipts may not process correctly

### For Developers

1. **Error Handling**
   - Always provide fallback options
   - Clear error messages for users
   - Graceful degradation when OCR fails

2. **Performance**
   - Process images client-side when possible
   - Show progress indicators for long operations
   - Clean up resources after processing

3. **Privacy**
   - Don't store images permanently
   - Process data locally when possible
   - Clear sensitive information after use

## Troubleshooting

### Common Issues

**Q: OCR processing is slow**
A: This is normal for the first use as Tesseract.js downloads language models. Subsequent uses will be faster.

**Q: Low confidence scores**
A: Try taking a clearer photo with better lighting. The system will still work but may require manual verification.

**Q: Wrong brand detected**
A: The system uses keyword matching. If a brand isn't recognized, use manual entry or suggest adding the brand to our database.

**Q: Quantity not detected**
A: The system looks for patterns like "2 Cheese Coney" or "3-Way". If your receipt uses different wording, manual entry may be needed.

### Getting Help

- **Technical Issues**: Check browser console for error messages
- **Feature Requests**: Contact the development team
- **Bug Reports**: Include receipt image (if possible) and error details

---

*This wiki is maintained by the Coney Counter development team. Last updated: December 2024*
