'use client';

import { useState, useRef } from 'react';
import { Button, Card, Typography, message, Progress, Select } from 'antd';
import { ArrowLeftOutlined, CameraOutlined, FileImageOutlined, EditOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { extractTextFromImage, OCRProgress, processReceiptText, SimpleReceiptData } from '@/lib/simple-ocr-service';

const { Title, Paragraph } = Typography;

export default function UploadReceiptPage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<OCRProgress | null>(null);
  const [extractedData, setExtractedData] = useState<SimpleReceiptData | null>(null);
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
              
              let successUrl = `/log-coney/success?quantity=${extractedData.coneyCount}`;
              if (achievementsParam) successUrl += `&achievements=${achievementsParam}`;
              if (xpParam) successUrl += `&xp=${xpParam}`;
              
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <CameraOutlined className="text-chili-red text-xl" />
              <Title level={4} className="text-chili-red mb-0 whitespace-nowrap">Scan Receipt</Title>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-900 mb-4">Scan Your Receipt</Title>
          <Paragraph className="text-base text-gray-600 max-w-2xl mx-auto mb-6">
            Take a photo of your receipt and we'll automatically detect your coney count.
          </Paragraph>
          
          {/* Manual Entry Option */}
          <div className="flex justify-center mb-6">
            <Link href="/log-coney">
              <Button 
                type="default" 
                size="large"
                icon={<EditOutlined />}
                className="border-gray-300 text-gray-600 hover:border-chili-red hover:text-chili-red"
              >
                Upload Manually Instead
              </Button>
            </Link>
          </div>
          
          {/* Alpha Testing Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                Alpha Testing Reminder
              </h4>
              <p className="text-sm text-yellow-700">
                Thanks for helping me test! The images you share during alpha may be used to train our OCR system—but only when the coney count is correct, and a receipt is detected.
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                If you have any concerns feel free to shoot me a text. The only way to help the pattern recognition get better is to train it on real images of receipts.
              </p>
            </div>
          </div>

          {/* Brand Selection */}
          <div className="mb-6 max-w-md mx-auto">
            <Title level={4} className="text-chili-red mb-4">🏪 Choose your coney brand</Title>
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
          <Card className="shadow-sm border-0">
            <div className="text-center">
              {/* Picture Taking Tips */}
              {selectedBrand && !uploadedImage && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📸</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">
                        📸 Picture Taking Tips
                      </h3>
                      <div className="text-sm text-blue-700 space-y-1">
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
                      className="bg-chili-red hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3"
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
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Please select a brand to continue.
                  </p>
                </div>
              )}

              {/* Combined Image Status and OCR Progress - Show during/after processing */}
              {(uploadedImage || ocrProgress) && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  {uploadedImage && (
                    <div className="mb-4">
                      <FileImageOutlined className="text-4xl text-green-500 mb-2" />
                      <div>
                        <div className="text-lg font-medium text-gray-900">
                          {uploadedImage.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {isProcessingImage ? 'Processing receipt...' : 'Image successfully uploaded and scanned!'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OCR Progress */}
                  {ocrProgress && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-green-800">
                            {ocrProgress.status}
                          </div>
                          <div className="text-xs text-green-700">
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
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  {extractedData.noConeysDetected ? (
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Our image scan wasn't able to identify any coney crushing.
                      </h3>
                      <p className="text-gray-700 mb-4">
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
                      <h3 className="text-lg font-medium text-gray-900 mb-3">The Scan Found:</h3>
                      <div className="space-y-2 text-left">
                        <div>
                          <span className="font-medium">Coneys:</span> 
                          <span className="ml-2">{extractedData.coneyCount || 'Not detected'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Confidence:</span> 
                          <span className="ml-2">{Math.round(extractedData.confidence * 100)}%</span>
                        </div>
                      </div>
                      
                      {extractedData.warnings.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-yellow-800">Warnings:</div>
                          <ul className="text-sm text-yellow-700 mt-1">
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

              {/* Verification Section */}
              {showVerification && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Is the coney count correct?</h3>
                  
                  {/* Privacy Reassurance Text */}
                  <div className="mb-4 p-3 bg-white rounded border border-blue-100">
                    <p className="text-sm text-gray-700">
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
    </div>
  );
}
