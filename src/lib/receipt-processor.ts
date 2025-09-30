// Receipt Processing Library for Coney Counter
// Handles OCR text extraction and flexible data parsing

export interface ReceiptData {
  brand?: string;
  quantity?: number;
  date?: string;
  time?: string;
  total?: number;
  checkNumber?: string;
  items?: string[];
  confidence: number;
  rawText: string;
  isValidReceipt: boolean;
  receiptWarnings: string[];
}

export interface BrandPattern {
  keywords: string[];
  aliases?: string[];
}

// Brand detection patterns - flexible keyword matching
const BRAND_PATTERNS: Record<string, BrandPattern> = {
  'Skyline Chili': {
    keywords: ['skyline', 'chili'],
    aliases: ['skyline chili', 'skylinechili']
  },
  'Gold Star Chili': {
    keywords: ['gold star', 'goldstar'],
    aliases: ['gold star chili', 'goldstar chili']
  },
  'Dixie Chili': {
    keywords: ['dixie'],
    aliases: ['dixie chili']
  },
  'Camp Washington Chili': {
    keywords: ['camp washington'],
    aliases: ['camp washington chili']
  },
  'Empress Chili': {
    keywords: ['empress'],
    aliases: ['empress chili']
  },
  'Price Hill Chili': {
    keywords: ['price hill'],
    aliases: ['price hill chili']
  },
  'Pleasant Ridge Chili': {
    keywords: ['pleasant ridge'],
    aliases: ['pleasant ridge chili']
  },
  'Blue Ash Chili': {
    keywords: ['blue ash'],
    aliases: ['blue ash chili']
  }
};

// Coney quantity patterns - flexible matching
const CONEY_PATTERNS = [
  // Direct coney mentions
  /(\d+)\s*(?:cheese\s*)?coney/i,
  /(\d+)\s*coneys/i,
  /coney\s*(\d+)/i,
  
  // Ways (count as 1 coney each)
  /(\d+)\s*(?:way|ways)/i,
  /(\d+)\s*way/i,
  
  // Chili items (count as 1 coney each)
  /(\d+)\s*(?:small|medium|large)\s*(?:chili|coney)/i,
  /(\d+)\s*(?:chili|coney)\s*(?:small|medium|large)/i,
];

// Date patterns - flexible date matching
const DATE_PATTERNS = [
  /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
  /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
  /(\d{1,2})\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{2,4})/i,
];

// Time patterns
const TIME_PATTERNS = [
  /(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)?/i,
  /(\d{1,2}):(\d{2})\s*(am|pm)/i,
];

// Price patterns
const PRICE_PATTERNS = [
  /\$?(\d+\.\d{2})/g,
  /total[:\s]*\$?(\d+\.\d{2})/i,
  /amount[:\s]*\$?(\d+\.\d{2})/i,
];

// Check/Order number patterns
const CHECK_PATTERNS = [
  /check[:\s]*(\d+)/i,
  /order[:\s]*(\d+)/i,
  /receipt[:\s]*(\d+)/i,
  /#(\d+)/,
];

export class ReceiptProcessor {
  private rawText: string = '';

  constructor(rawText: string) {
    this.rawText = rawText.toLowerCase();
  }

  // Validate if the text looks like a receipt
  validateReceipt(): { isValidReceipt: boolean; warnings: string[] } {
    const warnings: string[] = [];
    let isValidReceipt = true;

    // Check for minimum text length (receipts should have substantial text)
    if (this.rawText.length < 50) {
      warnings.push('Text is very short - receipts typically have more content');
      isValidReceipt = false;
    }

    // Check for receipt-like keywords
    const receiptKeywords = [
      'total', 'subtotal', 'tax', 'amount', 'price', 'cost',
      'receipt', 'invoice', 'bill', 'check', 'order',
      'date', 'time', 'server', 'cashier', 'table',
      'thank you', 'visit', 'restaurant', 'chili', 'coney'
    ];

    const foundKeywords = receiptKeywords.filter(keyword => 
      this.rawText.includes(keyword)
    );

    if (foundKeywords.length < 3) {
      warnings.push('Missing common receipt keywords (total, date, etc.)');
      isValidReceipt = false;
    }

    // Check for price patterns (receipts should have prices)
    const pricePattern = /\$?\d+\.\d{2}/g;
    const prices = this.rawText.match(pricePattern);
    if (!prices || prices.length < 2) {
      warnings.push('No price information found - receipts typically show item costs');
      isValidReceipt = false;
    }

    // Check for date/time patterns
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/;
    const timePattern = /\d{1,2}:\d{2}/;
    
    if (!datePattern.test(this.rawText) && !timePattern.test(this.rawText)) {
      warnings.push('No date or time found - receipts typically show transaction time');
    }

    // Check for restaurant/food related terms
    const foodKeywords = [
      'chili', 'coney', 'restaurant', 'diner', 'cafe', 'food',
      'skyline', 'gold star', 'dixie', 'camp washington',
      'empress', 'price hill', 'pleasant ridge', 'blue ash'
    ];

    const foundFoodKeywords = foodKeywords.filter(keyword => 
      this.rawText.includes(keyword)
    );

    if (foundFoodKeywords.length === 0) {
      warnings.push('No restaurant or food-related terms found');
    }

    // Check for suspicious content (not receipt-like)
    const suspiciousPatterns = [
      /selfie|photo|picture|image/i,
      /social media|facebook|instagram|twitter/i,
      /email|message|text|chat/i,
      /document|file|attachment/i
    ];

    const suspiciousMatches = suspiciousPatterns.filter(pattern => 
      pattern.test(this.rawText)
    );

    if (suspiciousMatches.length > 0) {
      warnings.push('Content appears to be from social media or messaging, not a receipt');
      isValidReceipt = false;
    }

    // If we have very few warnings and some good indicators, it's probably a receipt
    if (warnings.length <= 2 && (foundKeywords.length >= 2 || prices.length >= 1)) {
      isValidReceipt = true;
    }

    return { isValidReceipt, warnings };
  }

  // Extract brand from receipt text
  detectBrand(): { brand: string; confidence: number } {
    let bestMatch = { brand: '', confidence: 0 };

    for (const [brandName, pattern] of Object.entries(BRAND_PATTERNS)) {
      let confidence = 0;
      
      // Check keywords
      for (const keyword of pattern.keywords) {
        if (this.rawText.includes(keyword.toLowerCase())) {
          confidence += 0.5;
        }
      }
      
      // Check aliases
      if (pattern.aliases) {
        for (const alias of pattern.aliases) {
          if (this.rawText.includes(alias.toLowerCase())) {
            confidence += 0.8;
          }
        }
      }

      if (confidence > bestMatch.confidence) {
        bestMatch = { brand: brandName, confidence };
      }
    }

    return bestMatch;
  }

  // Extract coney quantity from receipt text
  detectConeyQuantity(): { quantity: number; confidence: number } {
    let totalQuantity = 0;
    let confidence = 0;
    const foundMatches: string[] = []; // Track what we've already counted

    console.log('🔍 Starting quantity detection...');
    console.log('Raw text:', this.rawText);

    // ONLY look for explicit "coney" mentions - no 3-ways, small chili, etc.
    const coneyPatterns = [
      /(\d+)\s*cheese\s*coney/i,  // "2 Cheese Coney"
      /(\d+)\s*coneys/i,          // "2 Coneys"
      /coney\s*(\d+)/i,           // "Coney 2"
    ];

    for (const pattern of coneyPatterns) {
      const matches = this.rawText.match(pattern);
      if (matches) {
        const quantity = parseInt(matches[1]);
        if (!isNaN(quantity)) {
          // Check if we've already counted this match
          const matchText = matches[0];
          if (!foundMatches.includes(matchText)) {
            totalQuantity += quantity;
            confidence += 0.8;
            foundMatches.push(matchText);
            console.log(`✅ Found coney pattern: "${matchText}" -> ${quantity} coneys (total: ${totalQuantity})`);
          } else {
            console.log(`⚠️ Skipping duplicate match: "${matchText}"`);
          }
        }
      }
    }

    // ONLY Skyline coney patterns - no 3-ways, small chili, etc.
    const skylinePatterns = [
      /(\d+)\s*cheese\s*coney\s*pl/i,      // "2 Cheese Coney PL"
      /(\d+)\s*cheese\s*coney\s*:\s*\d+\.\d{2}/i, // "2 Cheese Coney: 6.30"
      /(\d+)\s*cheese\s*coney\s*seat\s*\d+/i,     // "2 Cheese Coney Seat 1"
      // Common OCR misreads for coneys only
      /(\d+)\s*cheese\s*coney\s*[a-z]+/i,  // "2 Cheese Coney abc" (any suffix)
      /(\d+)\s*cheese\s*[a-z]*\s*coney/i,  // "2 Cheese abc Coney" (misread middle)
      /(\d+)\s*[a-z]*\s*cheese\s*coney/i,  // "2 abc Cheese Coney" (misread prefix)
    ];

    // If we haven't found anything yet, try Skyline-specific patterns
    if (totalQuantity === 0) {
      console.log('🔍 Trying Skyline-specific patterns...');
      for (const pattern of skylinePatterns) {
        const matches = this.rawText.match(pattern);
        if (matches) {
          const quantity = parseInt(matches[1]);
          if (!isNaN(quantity)) {
            const matchText = matches[0];
            if (!foundMatches.includes(matchText)) {
              totalQuantity += quantity;
              confidence += 0.9; // Higher confidence for Skyline-specific patterns
              foundMatches.push(matchText);
              console.log(`✅ Found Skyline pattern: "${matchText}" -> ${quantity} coneys (total: ${totalQuantity})`);
            } else {
              console.log(`⚠️ Skipping duplicate Skyline match: "${matchText}"`);
            }
          }
        }
      }
    }

    // Special handling for multi-seat receipts (like Fairborn receipt)
    // Look for patterns like "Seat 1: 2 Cheese Coney" and "Seat 2: 2 Cheese Coney"
    if (totalQuantity === 0) {
      console.log('🔍 Trying multi-seat patterns...');
      const seatPattern = /seat\s*\d+.*?(\d+)\s*cheese\s*coney/gi;
      let seatMatch;
      let seatTotal = 0;
      
      while ((seatMatch = seatPattern.exec(this.rawText)) !== null) {
        const quantity = parseInt(seatMatch[1]);
        if (!isNaN(quantity)) {
          seatTotal += quantity;
          console.log(`✅ Found seat pattern: "${seatMatch[0]}" -> ${quantity} coneys`);
        }
      }
      
      if (seatTotal > 0) {
        totalQuantity = seatTotal;
        confidence = 0.8;
        console.log(`✅ Multi-seat total: ${seatTotal} coneys`);
      }
    }

    // If we found explicit coneys, don't count ways or other items
    if (totalQuantity > 0) {
      console.log(`🎯 Final result: ${totalQuantity} coneys (confidence: ${confidence})`);
      console.log(`📝 All matches found:`, foundMatches);
      return { quantity: totalQuantity, confidence };
    }

    // ONLY count explicit coneys - no 3-ways, small chili, or other items
    console.log('🎯 Only counting explicit coneys - skipping 3-ways, small chili, etc.');

    console.log(`Final quantity detection: ${totalQuantity} coneys (confidence: ${confidence})`);
    return { quantity: totalQuantity, confidence };
  }

  // Extract date from receipt text
  detectDate(): { date: string; confidence: number } {
    for (const pattern of DATE_PATTERNS) {
      const match = this.rawText.match(pattern);
      if (match) {
        // Try to parse the date
        let dateStr = '';
        if (pattern === DATE_PATTERNS[0]) {
          // MM/DD/YYYY or MM-DD-YYYY
          const [, month, day, year] = match;
          dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (pattern === DATE_PATTERNS[1]) {
          // YYYY/MM/DD or YYYY-MM-DD
          const [, year, month, day] = match;
          dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        if (dateStr && !isNaN(Date.parse(dateStr))) {
          return { date: dateStr, confidence: 0.8 };
        }
      }
    }

    return { date: '', confidence: 0 };
  }

  // Extract time from receipt text
  detectTime(): { time: string; confidence: number } {
    for (const pattern of TIME_PATTERNS) {
      const match = this.rawText.match(pattern);
      if (match) {
        const [, hour, minute, second, ampm] = match;
        let timeStr = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
        
        if (second) {
          timeStr += `:${second.padStart(2, '0')}`;
        }
        
        if (ampm) {
          timeStr += ` ${ampm.toUpperCase()}`;
        }
        
        return { time: timeStr, confidence: 0.7 };
      }
    }

    return { time: '', confidence: 0 };
  }

  // Extract total amount from receipt text
  detectTotal(): { total: number; confidence: number } {
    // Look for "total" first
    const totalMatch = this.rawText.match(/total[:\s]*\$?(\d+\.\d{2})/i);
    if (totalMatch) {
      return { total: parseFloat(totalMatch[1]), confidence: 0.9 };
    }

    // Look for any price patterns
    const priceMatches = this.rawText.match(PRICE_PATTERNS[0]);
    if (priceMatches && priceMatches.length > 0) {
      // Take the largest price as likely the total
      const prices = priceMatches.map(match => parseFloat(match.replace('$', '')));
      const maxPrice = Math.max(...prices);
      return { total: maxPrice, confidence: 0.5 };
    }

    return { total: 0, confidence: 0 };
  }

  // Extract check/order number
  detectCheckNumber(): { checkNumber: string; confidence: number } {
    for (const pattern of CHECK_PATTERNS) {
      const match = this.rawText.match(pattern);
      if (match) {
        return { checkNumber: match[1], confidence: 0.8 };
      }
    }

    return { checkNumber: '', confidence: 0 };
  }

  // Extract all receipt data
  processReceipt(): ReceiptData {
    // First validate if this looks like a receipt
    const validation = this.validateReceipt();
    
    const brand = this.detectBrand();
    const quantity = this.detectConeyQuantity();
    const date = this.detectDate();
    const time = this.detectTime();
    const total = this.detectTotal();
    const checkNumber = this.detectCheckNumber();

    // Debug logging
    console.log('Receipt Processing Debug:', {
      rawText: this.rawText.substring(0, 200) + '...',
      validation: validation,
      brand: brand,
      quantity: quantity,
      date: date,
      time: time,
      total: total,
      checkNumber: checkNumber
    });

    // Additional debugging for quantity detection
    console.log('Full OCR Text for debugging:', this.rawText);
    console.log('Quantity detection result:', quantity);

    // Calculate overall confidence
    const confidence = (
      brand.confidence * 0.3 +
      quantity.confidence * 0.3 +
      date.confidence * 0.2 +
      time.confidence * 0.1 +
      total.confidence * 0.05 +
      checkNumber.confidence * 0.05
    );

    return {
      brand: brand.brand || undefined,
      quantity: quantity.quantity || undefined,
      date: date.date || undefined,
      time: time.time || undefined,
      total: total.total || undefined,
      checkNumber: checkNumber.checkNumber || undefined,
      items: [], // TODO: Extract individual items
      confidence,
      rawText: this.rawText,
      isValidReceipt: validation.isValidReceipt,
      receiptWarnings: validation.warnings
    };
  }
}

// Utility function to create processor instance
export function processReceiptText(text: string): ReceiptData {
  const processor = new ReceiptProcessor(text);
  return processor.processReceipt();
}

// Test function for Skyline receipt patterns
export function testSkylinePatterns(): void {
  const testTexts = [
    "2 Cheese Coney: 6.30",
    "2 Cheese Coney PL: 5.98",  // Norwood receipt pattern
    "Seat 1: 2 Cheese Coney",
    "Seat 2: 2 Cheese Coney", 
    "2 Cheese Coney PL",
    "3 Cheese Coney Small",
    // These should NOT count as coneys:
    "1 Small 4 Way Onion: 7.05",
    "1 Chilito-EX: 3.79",
    "1 MED Coke: 2.89",
  ];

  console.log("🧪 Testing ONLY Coney Patterns (no 3-ways, small chili, etc.):");
  testTexts.forEach(text => {
    const processor = new ReceiptProcessor(text);
    const quantity = processor.detectConeyQuantity();
    console.log(`Text: "${text}"`);
    console.log(`Detected Quantity: ${quantity.quantity} coneys (confidence: ${quantity.confidence})`);
    console.log('---');
  });
}

// Test function for non-receipt content
export function testNonReceiptValidation(): ReceiptData {
  const testText = "This is a selfie photo from Instagram. #food #yummy #delicious";
  return processReceiptText(testText);
}
