'use client';

import { useState } from 'react';
import { Button, Card, Typography, message, Progress } from 'antd';
import { ArrowLeftOutlined, CameraOutlined, FileImageOutlined } from '@ant-design/icons';
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
  const router = useRouter();

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
        console.log('No coneys found, showing error message...');
        message.error('Could not detect any coneys on this receipt. Please try uploading a clearer image.');
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
    
    try {
      if (isCorrect && extractedData.coneyCount) {
        // Redirect to log-coney page with pre-filled data
        const params = new URLSearchParams({
          brand: 'Unknown', // User can select brand on the log page
          quantity: extractedData.coneyCount.toString(),
          fromUpload: 'true'
        });
        
        message.success('Receipt processed successfully! Redirecting to log page...');
        router.push(`/log-coney?${params.toString()}`);
      } else {
        message.info('Please try uploading a clearer receipt.');
        // Reset for new upload
        setUploadedImage(null);
        setExtractedData(null);
        setShowVerification(false);
      }
    } catch (error) {
      console.error('Error in verification:', error);
      message.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/log-coney">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                Back to Log Coney
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <CameraOutlined className="text-chili-red text-xl" />
              <Title level={4} className="text-chili-red mb-0 whitespace-nowrap">Upload Receipt</Title>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-900 mb-4">Upload Your Receipt</Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Take a photo of your receipt and we'll automatically detect your coney count and date.
          </Paragraph>
          
          {/* Alpha Testing Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⚠</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                  Alpha Testing Notice
                </h4>
                <p className="text-sm text-yellow-700">
                  Images uploaded during alpha testing will be used to train our OCR for better pattern recognition. 
                  We only save the image and detected coney count/date - no personal data is stored.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm border-0">
            <div className="text-center">
              {/* Upload Area */}
              <div className="mb-6">
                <input
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
                  style={{ 
                    padding: '20px',
                    border: '2px dashed #dc2626',
                    borderRadius: '10px',
                    backgroundColor: '#fef2f2',
                    cursor: 'pointer',
                    fontSize: '16px',
                    width: '100%',
                    textAlign: 'center'
                  }}
                />
              </div>

              {/* File Status */}
              {uploadedImage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <FileImageOutlined className="text-4xl text-green-500 mb-2" />
                  <div>
                    <div className="text-lg font-medium text-gray-900">
                      {uploadedImage.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {isProcessingImage ? 'Processing receipt...' : 'Receipt uploaded successfully!'}
                    </div>
                  </div>
                </div>
              )}

              {/* OCR Progress */}
              {ocrProgress && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-800">
                          {ocrProgress.status}
                        </div>
                        <div className="text-xs text-blue-700">
                          Processing your receipt...
                        </div>
                      </div>
                    </div>
                    <Progress 
                      percent={Math.round(ocrProgress.progress * 100)} 
                      size="small"
                      strokeColor="#3b82f6"
                      trailColor="#dbeafe"
                      showInfo={true}
                    />
                  </div>
                </div>
              )}

              {/* Extracted Data Display */}
              {extractedData && (
                <div className={`mb-6 border rounded-lg p-4 ${
                  extractedData.isValidReceipt 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Detected Information:</h3>
                  <div className="space-y-2 text-left">
                    <div>
                      <span className="font-medium">Coneys:</span> 
                      <span className="ml-2">{extractedData.coneyCount || 'Not detected'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> 
                      <span className="ml-2">{extractedData.date || 'Not detected'}</span>
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
                </div>
              )}

              {/* Verification Section */}
              {showVerification && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Is this information correct?</h3>
                  <div className="space-x-4">
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={() => handleVerification(true)}
                      className="bg-green-600 hover:bg-green-700 border-green-600"
                    >
                      Yes, Continue to Log
                    </Button>
                    <Button 
                      size="large"
                      onClick={() => handleVerification(false)}
                    >
                      No, Try Again
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
