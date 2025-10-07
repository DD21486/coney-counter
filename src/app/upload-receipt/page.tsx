'use client';

import { useState, useRef } from 'react';
import { Button, Card, Typography, message, Progress, Select } from 'antd';
import { ArrowLeftOutlined, CameraOutlined, FileImageOutlined, EditOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { extractTextFromImage, OCRProgress, processReceiptText, SimpleReceiptData } from '@/lib/simple-ocr-service';

const { Title, Paragraph } = Typography;

// Add CSS for styling
const stylingCSS = `
  .floating-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  }
  
  .analytics-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: none !important;
    border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }

  .analytics-card:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.15);
  }

  .analytics-card:active {
    transform: translateY(0px) scale(0.98);
    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* White text for all content inside analytics cards */
  .analytics-card .ant-statistic-title,
  .analytics-card .ant-statistic-content,
  .analytics-card .ant-statistic-content-value,
  .analytics-card .ant-statistic-content-suffix,
  .analytics-card .ant-statistic-content-prefix,
  .analytics-card h1,
  .analytics-card h2,
  .analytics-card h3,
  .analytics-card h4,
  .analytics-card h5,
  .analytics-card h6,
  .analytics-card p,
  .analytics-card span,
  .analytics-card div,
  .analytics-card .ant-table,
  .analytics-card .ant-table-thead > tr > th,
  .analytics-card .ant-table-tbody > tr > td,
  .analytics-card .ant-collapse,
  .analytics-card .ant-collapse-header,
  .analytics-card .ant-collapse-content,
  .analytics-card .ant-collapse-content-box {
    color: white !important;
  }

  /* Force all section titles to be white - only on upload receipt page */
  .upload-receipt-page .ant-typography h1,
  .upload-receipt-page .ant-typography h2,
  .upload-receipt-page .ant-typography h3,
  .upload-receipt-page .ant-typography h4,
  .upload-receipt-page .ant-typography h5,
  .upload-receipt-page .ant-typography h6,
  .upload-receipt-page h1, 
  .upload-receipt-page h2, 
  .upload-receipt-page h3, 
  .upload-receipt-page h4, 
  .upload-receipt-page h5, 
  .upload-receipt-page h6,
  .upload-receipt-page .ant-typography,
  .upload-receipt-page .ant-typography-title {
    color: white !important;
  }

  /* Specific targeting for Ant Design Typography components - only on upload receipt page */
  .upload-receipt-page .ant-typography.ant-typography-h1,
  .upload-receipt-page .ant-typography.ant-typography-h2,
  .upload-receipt-page .ant-typography.ant-typography-h3,
  .upload-receipt-page .ant-typography.ant-typography-h4,
  .upload-receipt-page .ant-typography.ant-typography-h5,
  .upload-receipt-page .ant-typography.ant-typography-h6 {
    color: white !important;
  }

  /* Dark mode dropdown styling for upload receipt page */
  .upload-receipt-page .ant-select {
    color: white !important;
  }

  .upload-receipt-page .ant-select .ant-select-selector {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
  }

  .upload-receipt-page .ant-select .ant-select-selection-placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .upload-receipt-page .ant-select .ant-select-selection-item {
    color: white !important;
  }

  .upload-receipt-page .ant-select:hover .ant-select-selector {
    border-color: rgba(255, 255, 255, 0.5) !important;
  }

  .upload-receipt-page .ant-select-focused .ant-select-selector {
    border-color: rgba(255, 255, 255, 0.7) !important;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
  }

  /* Dropdown menu styling */
  .upload-receipt-page .ant-select-dropdown {
    background-color: rgba(15, 23, 42, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
  }

  .upload-receipt-page .ant-select-item {
    color: white !important;
  }

  .upload-receipt-page .ant-select-item:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  .upload-receipt-page .ant-select-item-option-selected {
    background-color: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
  }

  .upload-receipt-page .ant-select-item-option-active {
    background-color: rgba(255, 255, 255, 0.15) !important;
  }

  /* Ensure dropdown height adjusts for multi-line content */
  .upload-receipt-page .ant-select .ant-select-selection-item {
    height: auto !important;
    min-height: 40px !important;
    padding: 8px 12px !important;
    display: flex !important;
    align-items: center !important;
  }

  .upload-receipt-page .ant-select .ant-select-selection-item-content {
    width: 100% !important;
  }

  /* Style for selected content */
  .upload-receipt-page .ant-select .ant-select-selection-item {
    color: white !important;
    font-weight: 500 !important;
  }

  /* Button styling for upload receipt page */
  .upload-receipt-page .ant-btn-default {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
  }

  .upload-receipt-page .ant-btn-default:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
    color: white !important;
  }

  .upload-receipt-page .ant-btn-default:focus {
    background-color: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.7) !important;
    color: white !important;
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = stylingCSS;
  document.head.appendChild(style);
}

export default function UploadReceiptPage() {
  const { data: session } = useSession();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<OCRProgress | null>(null);
  const [extractedData, setExtractedData] = useState<SimpleReceiptData | null>(null);
  const [rawOcrText, setRawOcrText] = useState<string>('');
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const coneyBrands = [
    'Skyline Chili',
    'Gold Star Chili', 
    'Dixie Chili',
    'Camp Washington Chili',
    'Empress Chili',
    'Price Hill Chili',
    'Pleasant Ridge Chili',
    'Blue Ash Chili',
    'Other'
  ];

  // Restaurant location data structure - Real Cincinnati Chili Brands Only
  const restaurantLocations = {
    'Skyline Chili': [
      { name: 'Downtown Cincinnati', address: '7th & Vine St, Cincinnati, OH' },
      { name: 'Clifton', address: '2800 Vine St, Cincinnati, OH' },
      { name: 'Oakley', address: '3010 Madison Rd, Cincinnati, OH' },
      { name: 'Montgomery', address: '9460 Montgomery Rd, Cincinnati, OH' },
      { name: 'Kenwood', address: '7800 Montgomery Rd, Cincinnati, OH' },
      { name: 'West Chester', address: '7800 Tylersville Rd, West Chester, OH' },
      { name: 'Mason', address: '5225 Tylersville Rd, Mason, OH' },
      { name: 'Florence', address: '7625 Mall Rd, Florence, KY' },
      { name: 'Covington', address: '35 W 5th St, Covington, KY' },
      { name: 'Newport', address: '1 Levee Way, Newport, KY' },
      { name: 'Other Skyline Location', address: 'Custom Location' }
    ],
    'Gold Star Chili': [
      { name: 'Downtown Cincinnati', address: '441 Vine St, Cincinnati, OH' },
      { name: 'Clifton', address: '2700 Vine St, Cincinnati, OH' },
      { name: 'Oakley', address: '3020 Madison Rd, Cincinnati, OH' },
      { name: 'Montgomery', address: '9450 Montgomery Rd, Cincinnati, OH' },
      { name: 'Kenwood', address: '7810 Montgomery Rd, Cincinnati, OH' },
      { name: 'West Chester', address: '7810 Tylersville Rd, West Chester, OH' },
      { name: 'Mason', address: '5235 Tylersville Rd, Mason, OH' },
      { name: 'Florence', address: '7635 Mall Rd, Florence, KY' },
      { name: 'Covington', address: '36 W 5th St, Covington, KY' },
      { name: 'Newport', address: '2 Levee Way, Newport, KY' },
      { name: 'Other Gold Star Location', address: 'Custom Location' }
    ],
    'Dixie Chili': [
      { name: 'Main Location', address: '733 Monmouth St, Newport, KY' },
      { name: 'Other Dixie Location', address: 'Custom Location' }
    ],
    'Camp Washington Chili': [
      { name: 'Main Location', address: '3005 Colerain Ave, Cincinnati, OH' },
      { name: 'Other Camp Washington Location', address: 'Custom Location' }
    ],
    'Empress Chili': [
      { name: 'Main Location', address: '834 E McMillan St, Cincinnati, OH' },
      { name: 'Other Empress Location', address: 'Custom Location' }
    ],
    'Price Hill Chili': [
      { name: 'Main Location', address: '4920 Glenway Ave, Cincinnati, OH' },
      { name: 'Other Price Hill Location', address: 'Custom Location' }
    ],
    'Pleasant Ridge Chili': [
      { name: 'Main Location', address: '6032 Montgomery Rd, Cincinnati, OH' },
      { name: 'Other Pleasant Ridge Location', address: 'Custom Location' }
    ],
    'Blue Ash Chili': [
      { name: 'Main Location', address: '9565 Kenwood Rd, Blue Ash, OH' },
      { name: 'Other Blue Ash Location', address: 'Custom Location' }
    ],
    'Other': [
      { name: 'Custom Location', address: 'Specify Location' }
    ]
  };

  const handleImageUpload = async (file: File) => {
    console.log('=== HANDLE IMAGE UPLOAD START ===');
    console.log('File:', file);
    console.log('File name:', file.name);
    console.log('File size:', file.size);
    console.log('File type:', file.type);
    
    setIsProcessingImage(true);
    setUploadedImage(file);
    setOcrProgress(null);
    setExtractedData(null);
    setShowVerification(false);
    
    try {
      console.log('Starting receipt processing...');
      message.loading('Processing receipt...', 0);
      
      console.log('Calling extractTextFromImage...');
      const ocrResult = await extractTextFromImage(file, (progress) => {
        console.log('OCR Progress:', progress);
        setOcrProgress(progress);
      });
      
      console.log('OCR completed:', ocrResult);
      message.destroy();
      
      // Store raw OCR text for admin debugging
      setRawOcrText(ocrResult.rawText);
      
      console.log('Processing receipt text...');
      const receiptData = processReceiptText(ocrResult.rawText);
      console.log('Receipt data processed:', receiptData);
      setExtractedData(receiptData);
      
      if (receiptData.coneyCount) {
        console.log('Coneys found! Showing success message...');
        message.success(`Found ${receiptData.coneyCount} coneys! Please verify the information below.`);
        setShowVerification(true);
      } else {
        console.log('No coneys found, showing special no-coneys state...');
        // Set a special state to show the no-coneys message
        setExtractedData({ ...receiptData, coneyCount: 0, noConeysDetected: true });
      }
      
    } catch (error) {
      console.error('=== ERROR IN HANDLE IMAGE UPLOAD ===');
      console.error('Error:', error);
      message.error(`Failed to process receipt: ${error.message}. Please try again.`);
    } finally {
      console.log('=== HANDLE IMAGE UPLOAD FINALLY ===');
      setIsProcessingImage(false);
      setOcrProgress(null);
      console.log('=== HANDLE IMAGE UPLOAD COMPLETE ===');
    }
  };

  const handleVerification = async (isCorrect: boolean) => {
    if (!uploadedImage || !extractedData) return;
    
    setIsSavingImage(true);
    
    try {
      if (isCorrect && extractedData.coneyCount) {
        // Save training data and log coneys
        const formData = new FormData();
        formData.append('image', uploadedImage);
        formData.append('coneyCount', extractedData.coneyCount?.toString() || '');
        formData.append('date', extractedData.date || '');
        formData.append('isCorrect', isCorrect.toString());
        formData.append('brand', selectedBrand || 'Unknown');
        formData.append('location', selectedLocation || '');
        
        const response = await fetch('/api/save-training-image', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          // Auto-log the coneys and redirect to success page
          try {
            const logResponse = await fetch('/api/coney-logs', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                brand: selectedBrand || 'Unknown',
                quantity: extractedData.coneyCount,
                location: null, // No location from OCR
                timezoneOffset: new Date().getTimezoneOffset() * -1, // Convert to positive offset (EST = -300 becomes 300)
                method: 'receipt', // Mark as receipt scan
              }),
            });

            const logResult = await logResponse.json();

            if (logResponse.ok) {
              message.success('Training data saved and coneys logged! Thank you for helping improve our pattern recognition.');
              
              // Redirect to success page
              const achievementsParam = logResult.newlyUnlockedAchievements?.length > 0 
                ? encodeURIComponent(JSON.stringify(logResult.newlyUnlockedAchievements))
                : null;
              
              const xpParam = logResult.xpResult ? encodeURIComponent(JSON.stringify(logResult.xpResult)) : null;
              
              const titlesParam = logResult.newlyUnlockedTitles?.length > 0 
                ? encodeURIComponent(JSON.stringify(logResult.newlyUnlockedTitles))
                : null;
              
              let successUrl = `/log-coney/success?quantity=${extractedData.coneyCount}`;
              if (achievementsParam) successUrl += `&achievements=${achievementsParam}`;
              if (xpParam) successUrl += `&xp=${xpParam}`;
              if (titlesParam) successUrl += `&titles=${titlesParam}`;
              
              router.push(successUrl);
            } else {
              message.error('Failed to log coneys. Please try again.');
            }
          } catch (error) {
            console.error('Error logging coneys:', error);
            message.error('Failed to log coneys. Please try again.');
          }
        } else {
          message.error('Failed to save training data. Please try again.');
        }
      } else {
        // User said the data was incorrect - still save for training but don't log coneys
        const formData = new FormData();
        formData.append('image', uploadedImage);
        formData.append('coneyCount', extractedData.coneyCount?.toString() || '');
        formData.append('date', extractedData.date || '');
        formData.append('isCorrect', isCorrect.toString());
        formData.append('brand', selectedBrand || 'Unknown');
        formData.append('location', selectedLocation || '');
        
        const response = await fetch('/api/save-training-image', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          message.info('Thank you for the feedback! This helps us improve our OCR accuracy.');
        } else {
          message.error('Failed to save feedback. Please try again.');
        }
        
        // Reset for new upload
        setUploadedImage(null);
        setExtractedData(null);
        setShowVerification(false);
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error in verification:', error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setIsSavingImage(false);
    }
  };

  return (
    <div 
      className="min-h-screen text-white upload-receipt-page"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E40AF 15%, #0C4A6E 30%, #064E3B 45%, #022C22 60%, #7F1D1D 75%, #450A0A 100%)' }}
    >
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="floating-card p-4">
            <div className="flex items-center justify-between relative">
              <Link href="/dashboard">
                <Button type="text" icon={<ArrowLeftOutlined />} className="text-white hover:text-white">
                  Back
                </Button>
              </Link>
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <img src="/ConeyCounter_LogoWordmark_White.png" alt="Coney Counter" className="h-8 w-auto max-w-[200px]" />
              </div>
              <div className="w-32"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-36 pb-8">
        <div className="text-center mb-8">
          <Title level={2} className="text-white mb-4">Scan Your Receipt</Title>
          <Paragraph className="text-base text-white/80 max-w-2xl mx-auto mb-6">
            Take a photo of your receipt and we'll automatically detect your coney count.
          </Paragraph>
          
          {/* Manual Entry Option */}
          <div className="flex justify-center mb-6">
            <Link href="/log-coney">
              <Button 
                type="default" 
                size="large"
                icon={<EditOutlined />}
                className="border-white/30 text-white hover:border-white hover:text-white hover:bg-white/10"
              >
                Upload Manually Instead
              </Button>
            </Link>
          </div>
          
          {/* Alpha Testing Notice */}
          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <div>
              <h4 className="text-sm font-medium text-yellow-200 mb-2">
                Alpha Testing Reminder
              </h4>
              <p className="text-sm text-yellow-100">
                Thanks for helping me test! The images you share during alpha may be used to train our OCR system—but only when the coney count is correct, and a receipt is detected.
              </p>
              <p className="text-sm text-yellow-100 mt-2">
                If you have any concerns feel free to shoot me a text. The only way to help the pattern recognition get better is to train it on real images of receipts.
              </p>
            </div>
          </div>

          {/* Brand Selection */}
          <div className="mb-6 max-w-md mx-auto">
            <Title level={4} className="text-white mb-4">🏪 Choose your coney brand</Title>
            <Select
              placeholder="Select your coney brand"
              size="large"
              value={selectedBrand}
              onChange={(value) => {
                setSelectedBrand(value);
                setSelectedLocation(''); // Reset location when brand changes
              }}
              className="w-full"
              style={{ width: '100%' }}
            >
              {coneyBrands.map((brand) => (
                <Select.Option key={brand} value={brand}>
                  {brand}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Location Selection */}
          {selectedBrand && (
            <div className="mb-6 max-w-md mx-auto">
              <Title level={4} className="text-chili-red mb-4">📍 Choose your location (optional)</Title>
              <Select
                placeholder="Select your location"
                size="large"
                value={selectedLocation}
                onChange={setSelectedLocation}
                className="w-full"
                style={{ width: '100%' }}
              >
                {restaurantLocations[selectedBrand as keyof typeof restaurantLocations]?.map((location) => (
                  <Select.Option key={location.name} value={location.name}>
                    <div>
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-gray-500">{location.address}</div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="analytics-card">
            <div className="text-center">
              {/* Picture Taking Tips */}
              {selectedBrand && !uploadedImage && (
                <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📸</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-200 mb-2">
                        📸 Picture Taking Tips
                      </h3>
                      <div className="text-sm text-blue-100 space-y-1">
                        <p>• <strong>Get close:</strong> Make sure your camera is close enough to the receipt - far away shots are harder for the tech to recognize</p>
                        <p>• <strong>Center the coneys:</strong> Make sure the "X Coneys" part of the receipt is near the center of your photo</p>
                        <p>• <strong>Good lighting:</strong> Ensure the receipt is well-lit and text is clearly readable</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Area - Only show if brand is selected and no image uploaded */}
              {selectedBrand && !uploadedImage && (
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        console.log('=== FILE INPUT CHANGE EVENT ===');
                        console.log('Event:', e);
                        console.log('Target:', e.target);
                        console.log('Files:', e.target.files);
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log('File selected:', file.name, file.size, file.type);
                          handleImageUpload(file);
                        } else {
                          console.log('No file selected');
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CameraOutlined className="text-xl" />
                      <span>Take A Photo or Select A Photo</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Brand Required Message */}
              {!selectedBrand && (
                <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    Please select a brand to continue.
                  </p>
                </div>
              )}

              {/* Combined Image Status and OCR Progress - Show during/after processing */}
              {(uploadedImage || ocrProgress) && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
                  {uploadedImage && (
                    <div className="mb-4">
                      <FileImageOutlined className="text-4xl text-green-400 mb-2" />
                      <div>
                        <div className="text-lg font-medium text-white">
                          {uploadedImage.name}
                        </div>
                        <div className="text-sm text-white/70">
                          {isProcessingImage ? 'Processing receipt...' : 'Image successfully uploaded and scanned!'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OCR Progress */}
                  {ocrProgress && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-400"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-green-200">
                            {ocrProgress.status}
                          </div>
                          <div className="text-xs text-green-100">
                            Processing your receipt...
                          </div>
                        </div>
                      </div>
                      <Progress 
                        percent={Math.round(ocrProgress.progress * 100)} 
                        size="small"
                        strokeColor="#10b981"
                        trailColor="#d1fae5"
                        showInfo={true}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Extracted Data Display */}
              {extractedData && (
                <div className={`mb-6 border rounded-lg p-4 ${
                  extractedData.isValidReceipt 
                    ? 'bg-green-500/20 border-green-400/30' 
                    : 'bg-yellow-500/20 border-yellow-400/30'
                }`}>
                  {extractedData.noConeysDetected ? (
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-4">
                        Our image scan wasn't able to identify any coney crushing.
                      </h3>
                      <p className="text-white/80 mb-4">
                        Try again, and if the issue persists, let derek know!
                      </p>
                      <Button 
                        size="large"
                        onClick={() => {
                          // Reset the form for a new upload
                          setUploadedImage(null);
                          setIsProcessingImage(false);
                          setOcrProgress(null);
                          setExtractedData(null);
                          setShowVerification(false);
                          
                          // Clear the file input
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-white mb-3">The Scan Found:</h3>
                      <div className="space-y-2 text-left">
                        <div>
                          <span className="font-medium text-white">Coneys:</span> 
                          <span className="ml-2 text-white">{extractedData.coneyCount || 'Not detected'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-white">Confidence:</span> 
                          <span className="ml-2 text-white">{Math.round(extractedData.confidence * 100)}%</span>
                        </div>
                      </div>
                      
                      {extractedData.warnings.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-yellow-200">Warnings:</div>
                          <ul className="text-sm text-yellow-100 mt-1">
                            {extractedData.warnings.map((warning, index) => (
                              <li key={index}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Admin Debug Section - Raw OCR Output */}
              {session?.user?.role === 'admin' || session?.user?.role === 'owner' ? (
                rawOcrText && (
                  <div className="mb-6 bg-gray-500/20 border border-gray-400/30 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-3">🔧 Admin Debug - Raw OCR Output</h3>
                    <div className="bg-white/10 border border-white/20 rounded p-3 max-h-64 overflow-y-auto">
                      <pre className="text-xs text-white/90 whitespace-pre-wrap font-mono">
                        {rawOcrText}
                      </pre>
                    </div>
                    <div className="mt-2 text-xs text-white/70">
                      Character count: {rawOcrText.length} | Lines: {rawOcrText.split('\n').length}
                    </div>
                  </div>
                )
              ) : null}

              {/* Verification Section */}
              {showVerification && (
                <div className="mb-6 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-3">Is the coney count correct?</h3>
                  
                  {/* Privacy Reassurance Text */}
                  <div className="mb-4 p-3 bg-white/10 rounded border border-white/20">
                    <p className="text-sm text-white/90">
                      <strong>What's happening:</strong> Clicking "Correct Count" will upload your receipt 
                      to our training library to help us improve pattern recognition. No personal data 
                      is viewable or saved - only the image and detected coney count are stored.
                    </p>
                  </div>
                  
                  <div className="space-x-4">
                    <Button 
                      type="primary" 
                      size="large"
                      loading={isSavingImage}
                      onClick={() => handleVerification(true)}
                      className="bg-green-600 hover:bg-green-700 border-green-600"
                    >
                      ✅ Correct Count - Log Coneys
                    </Button>
                    <Button 
                      size="large"
                      loading={isSavingImage}
                      onClick={() => handleVerification(false)}
                      className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
                    >
                      ❌ Wrong Count - Try Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
            <div className="flex items-center">
              <img src="/ConeyCounter_LogoWordmark_White.png" alt="Coney Counter" className="h-8 w-auto" />
            </div>
              <p className="text-gray-300 text-sm">
                Track your coney consumption, earn achievements, and compete with other coney crushers in Cincinnati.
              </p>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Legal</h4>
              <div className="space-y-2">
                <Link href="/terms" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-chili-red transition-colors text-sm">
                  Terms & Conditions
                </Link>
                <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-chili-red transition-colors text-sm">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Coney Counter. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mt-2 md:mt-0">
                Made with ❤️ for Cincinnati's coney community
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
