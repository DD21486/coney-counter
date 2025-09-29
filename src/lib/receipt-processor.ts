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

    for (const pattern of CONEY_PATTERNS) {
      const matches = this.rawText.match(pattern);
      if (matches) {
        const quantity = parseInt(matches[1]);
        if (!isNaN(quantity)) {
          totalQuantity += quantity;
          confidence += 0.7;
        }
      }
    }

    // If no direct matches, look for any number followed by coney-related terms
    if (totalQuantity === 0) {
      const fallbackPattern = /(\d+)\s*(?:chili|coney|way)/i;
      const fallbackMatch = this.rawText.match(fallbackPattern);
      if (fallbackMatch) {
        totalQuantity = parseInt(fallbackMatch[1]);
        confidence = 0.4; // Lower confidence for fallback
      }
    }

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
    const brand = this.detectBrand();
    const quantity = this.detectConeyQuantity();
    const date = this.detectDate();
    const time = this.detectTime();
    const total = this.detectTotal();
    const checkNumber = this.detectCheckNumber();

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
      rawText: this.rawText
    };
  }
}

// Utility function to create processor instance
export function processReceiptText(text: string): ReceiptData {
  const processor = new ReceiptProcessor(text);
  return processor.processReceipt();
}
