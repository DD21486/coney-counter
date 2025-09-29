'use client';

import { Button, Card, Form, Input, Select, InputNumber, Typography, Space, Row, Col, Divider, message, Modal, Segmented, Upload } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, CheckCircleOutlined, EnvironmentOutlined, MailOutlined, CameraOutlined, UploadOutlined, FileImageOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { extractTextFromImage, OCRProgress } from '@/lib/ocr-service';
import { processReceiptText, ReceiptData } from '@/lib/receipt-processor';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// Restaurant location data structure - Real Cincinnati Chili Brands Only
const restaurantLocations = {
  'Skyline Chili': [
    { name: 'Downtown Cincinnati', address: '7th & Vine St, Cincinnati, OH' },
    { name: 'Clifton', address: '2800 Vine St, Cincinnati, OH' },
    { name: 'Oakley', address: '3010 Madison Rd, Cincinnati, OH' },
    { name: 'Montgomery', address: '9460 Montgomery Rd, Cincinnati, OH' },
    { name: 'West Chester', address: '7800 Tylersville Rd, West Chester, OH' },
    { name: 'Kenwood', address: '7800 Montgomery Rd, Cincinnati, OH' },
    { name: 'Blue Ash', address: '10900 Reed Hartman Hwy, Cincinnati, OH' },
    { name: 'Norwood', address: '4600 Montgomery Rd, Cincinnati, OH' },
    { name: 'Sharonville', address: '11000 Reading Rd, Sharonville, OH' },
    { name: 'Springdale', address: '12000 Springfield Pike, Springdale, OH' },
    { name: 'Fairfield', address: '5000 Dixie Hwy, Fairfield, OH' },
    { name: 'Hamilton', address: '1000 Main St, Hamilton, OH' },
    { name: 'Middletown', address: '2800 Towne Blvd, Middletown, OH' },
    { name: 'Mason', address: '5200 Tylersville Rd, Mason, OH' },
    { name: 'Mason - Bardes Rd', address: '5214 Bardes Rd, Mason, OH 45040' },
    { name: 'Loveland', address: '120 W Loveland Ave, Loveland, OH' },
    { name: 'Milford', address: '1000 Main St, Milford, OH' },
    { name: 'Anderson Township', address: '7800 Beechmont Ave, Cincinnati, OH' },
    { name: 'Colerain', address: '9500 Colerain Ave, Cincinnati, OH' },
    { name: 'Forest Park', address: '1200 W Kemper Rd, Forest Park, OH' },
    { name: 'Tri-County', address: '11700 Princeton Pike, Cincinnati, OH' },
    { name: 'Beechmont', address: '7800 Beechmont Ave, Cincinnati, OH' },
    { name: 'Reading', address: '12000 Reading Rd, Cincinnati, OH' },
    { name: 'Harrison', address: '10000 Harrison Ave, Harrison, OH' },
    { name: 'Delhi', address: '5000 Delhi Pike, Cincinnati, OH' },
    { name: 'Cheviot', address: '3800 Harrison Ave, Cincinnati, OH' },
    { name: 'Mount Washington', address: '2000 Beechmont Ave, Cincinnati, OH' },
    { name: 'Hyde Park', address: '2700 Erie Ave, Cincinnati, OH' },
    { name: 'Mount Lookout', address: '3200 Linwood Ave, Cincinnati, OH' },
    { name: 'Eastgate', address: '4300 Eastgate Blvd, Cincinnati, OH' },
    { name: 'Florence', address: '8000 Mall Rd, Florence, KY' },
    { name: 'Newport', address: '1 Levee Way, Newport, KY' },
    { name: 'Covington', address: '50 E 3rd St, Covington, KY' },
    { name: 'Erlanger', address: '3000 Dixie Hwy, Erlanger, KY' },
    { name: 'Fort Wright', address: '2000 Dixie Hwy, Fort Wright, KY' },
    { name: 'Independence', address: '2000 Independence Station Way, Independence, KY' },
    { name: 'Burlington', address: '1000 Burlington Pike, Burlington, KY' },
    { name: 'Hebron', address: '3000 North Bend Rd, Hebron, KY' },
    { name: 'Dry Ridge', address: '1000 Dry Ridge Rd, Dry Ridge, KY' },
    { name: 'Alexandria', address: '8000 Alexandria Pike, Alexandria, KY' },
    { name: 'Cold Spring', address: '4000 Alexandria Pike, Cold Spring, KY' }
  ],
  'Gold Star Chili': [
    { name: 'Downtown Cincinnati', address: '28 W 4th St, Cincinnati, OH' },
    { name: 'Clifton', address: '2700 Vine St, Cincinnati, OH' },
    { name: 'Oakley', address: '3000 Madison Rd, Cincinnati, OH' },
    { name: 'Montgomery', address: '9400 Montgomery Rd, Cincinnati, OH' },
    { name: 'West Chester', address: '7800 Tylersville Rd, West Chester, OH' },
    { name: 'Kenwood', address: '7700 Montgomery Rd, Cincinnati, OH' },
    { name: 'Blue Ash', address: '10800 Reed Hartman Hwy, Cincinnati, OH' },
    { name: 'Norwood', address: '4500 Montgomery Rd, Cincinnati, OH' },
    { name: 'Sharonville', address: '10900 Reading Rd, Sharonville, OH' },
    { name: 'Springdale', address: '11900 Springfield Pike, Springdale, OH' },
    { name: 'Fairfield', address: '4900 Dixie Hwy, Fairfield, OH' },
    { name: 'Hamilton', address: '900 Main St, Hamilton, OH' },
    { name: 'Middletown', address: '2700 Towne Blvd, Middletown, OH' },
    { name: 'Mason', address: '5100 Tylersville Rd, Mason, OH' },
    { name: 'Loveland', address: '110 W Loveland Ave, Loveland, OH' },
    { name: 'Milford', address: '900 Main St, Milford, OH' },
    { name: 'Anderson Township', address: '2231 Beechmont Ave, Cincinnati, OH 45230' },
    { name: 'Colerain', address: '9400 Colerain Ave, Cincinnati, OH' },
    { name: 'Forest Park', address: '1100 W Kemper Rd, Forest Park, OH' },
    { name: 'Tri-County', address: '11600 Princeton Pike, Cincinnati, OH' },
    { name: 'Beechmont', address: '7716 Beechmont Ave, Cincinnati, OH 45255' },
    { name: 'Reading', address: '4544 Reading Rd, Cincinnati, OH 45229' },
    { name: 'Harrison', address: '9900 Harrison Ave, Harrison, OH' },
    { name: 'Delhi', address: '4900 Delhi Pike, Cincinnati, OH' },
    { name: 'Cheviot', address: '3700 Harrison Ave, Cincinnati, OH' },
    { name: 'Mount Washington', address: '1900 Beechmont Ave, Cincinnati, OH' },
    { name: 'Hyde Park', address: '2600 Erie Ave, Cincinnati, OH' },
    { name: 'Mount Lookout', address: '3100 Linwood Ave, Cincinnati, OH' },
    { name: 'Eastgate', address: '4200 Eastgate Blvd, Cincinnati, OH' },
    { name: 'Winton Road', address: '6531 Winton Rd, Cincinnati, OH 45224' },
    { name: 'Glenway Avenue', address: '5791 Glenway Ave, Cincinnati, OH 45238' },
    { name: 'Ridge Avenue', address: '5420 Ridge Ave, Cincinnati, OH 45213' },
    { name: 'Florence', address: '7900 Mall Rd, Florence, KY' },
    { name: 'Newport', address: '1 Levee Way, Newport, KY' },
    { name: 'Covington', address: '49 E 3rd St, Covington, KY' },
    { name: 'Erlanger', address: '2900 Dixie Hwy, Erlanger, KY' },
    { name: 'Fort Wright', address: '1900 Dixie Hwy, Fort Wright, KY' },
    { name: 'Independence', address: '1900 Independence Station Way, Independence, KY' },
    { name: 'Burlington', address: '900 Burlington Pike, Burlington, KY' },
    { name: 'Hebron', address: '2900 North Bend Rd, Hebron, KY' },
    { name: 'Dry Ridge', address: '900 Dry Ridge Rd, Dry Ridge, KY' },
    { name: 'Alexandria', address: '7900 Alexandria Pike, Alexandria, KY' },
    { name: 'Cold Spring', address: '3900 Alexandria Pike, Cold Spring, KY' }
  ],
  'Dixie Chili': [
    { name: 'Newport', address: '733 Monmouth St, Newport, KY 41071' },
    { name: 'Covington', address: '2421 Madison Ave, Covington, KY 41014' },
    { name: 'Erlanger', address: '3716 Dixie Hwy, Erlanger, KY 41018' }
  ],
  'Camp Washington Chili': [
    { name: 'Main Location', address: '3005 Colerain Ave, Cincinnati, OH 45225' }
  ],
  'Empress Chili': [
    { name: 'Alexandria', address: '7934 Alexandria Pike, Alexandria, KY 41001' }
  ],
  'Price Hill Chili': [
    { name: 'Main Location', address: '4920 Glenway Ave, Cincinnati, OH 45238' }
  ],
  'Pleasant Ridge Chili': [
    { name: 'Main Location', address: '6032 Montgomery Rd, Cincinnati, OH 45213' }
  ],
  'Blue Ash Chili': [
    { name: 'Springdale', address: '11711 Princeton Pike # 231, Springdale, OH 45246' },
    { name: 'Blue Ash', address: '9525 Kenwood Rd Suite 5, Blue Ash, OH 45242' }
  ],
  'Other': []
};

export default function LogConeyPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [showCustomLocation, setShowCustomLocation] = useState<boolean>(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState<boolean>(false);
  const [locationSuggestion, setLocationSuggestion] = useState<string>('');
  
  // New state for entry mode toggle
  const [entryMode, setEntryMode] = useState<'manual' | 'upload'>('manual');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<OCRProgress | null>(null);
  const [extractedData, setExtractedData] = useState<ReceiptData | null>(null);

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

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setShowCustomLocation(false);
    setCustomLocation('');
    form.setFieldsValue({ location: undefined }); // Clear location when brand changes
  };

  const handleLocationChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomLocation(true);
      form.setFieldsValue({ location: undefined });
    } else {
      setShowCustomLocation(false);
      setCustomLocation('');
    }
  };

  const handleLocationSuggestion = async () => {
    if (!locationSuggestion.trim()) {
      message.error('Please enter a location suggestion!');
      return;
    }

    try {
      const response = await fetch('/api/location-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          suggestion: locationSuggestion,
          brand: selectedBrand,
        }),
      });

      if (response.ok) {
        message.success('Thanks for the suggestion! We\'ll add it soon.');
        setIsLocationModalVisible(false);
        setLocationSuggestion('');
      } else {
        message.error('Failed to send suggestion. Please try again.');
      }
    } catch (error) {
      message.error('Failed to send suggestion. Please try again.');
    }
  };

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    setIsProcessingImage(true);
    setUploadedImage(file);
    setOcrProgress(null);
    setExtractedData(null);
    
    try {
      message.loading('Processing receipt...', 0);
      
      // Extract text using OCR
      const ocrResult = await extractTextFromImage(file, (progress) => {
        setOcrProgress(progress);
      });
      
      message.destroy(); // Clear loading message
      
      // Process the extracted text
      const receiptData = processReceiptText(ocrResult.text);
      setExtractedData(receiptData);
      
      // Auto-populate form if we have good data
      if (receiptData.confidence > 0.5) {
        const formData: any = {};
        
        if (receiptData.brand) {
          formData.brand = receiptData.brand;
          setSelectedBrand(receiptData.brand);
        }
        
        if (receiptData.quantity) {
          formData.quantity = receiptData.quantity;
        }
        
        form.setFieldsValue(formData);
        
        message.success(`Receipt processed! Found ${receiptData.quantity || 0} coneys from ${receiptData.brand || 'unknown brand'}`);
      } else {
        message.warning('Receipt processed but data extraction was uncertain. Please verify the information below.');
      }
      
    } catch (error) {
      console.error('Error processing image:', error);
      message.error('Failed to process receipt. Please try again or use manual entry.');
    } finally {
      setIsProcessingImage(false);
      setOcrProgress(null);
    }
    
    return false; // Prevent default upload behavior
  };

  // Reset form when switching modes
  const handleModeChange = (mode: 'manual' | 'upload') => {
    setEntryMode(mode);
    form.resetFields();
    setUploadedImage(null);
    setIsProcessingImage(false);
    setOcrProgress(null);
    setExtractedData(null);
    setSelectedBrand('');
    setCustomLocation('');
    setShowCustomLocation(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      let locationData = null;
      
      if (values.location && values.location !== 'custom') {
        // Find the selected location from the restaurant data
        const locations = restaurantLocations[selectedBrand as keyof typeof restaurantLocations] || [];
        const selectedLocation = locations.find(loc => `${loc.name} - ${loc.address}` === values.location);
        locationData = selectedLocation;
      } else if (showCustomLocation && customLocation) {
        // Use custom location
        locationData = {
          name: 'Custom Location',
          address: customLocation
        };
      }

      const response = await fetch('/api/coney-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: values.brand,
          quantity: values.quantity,
          location: locationData,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        message.success('Coneys logged successfully!')
        
        // Track analytics event
        analytics.logConeys(values.quantity, values.brand);
        
        console.log('API result:', result);
        console.log('Newly unlocked achievements:', result.newlyUnlockedAchievements);
        
        // Pass newly unlocked achievements to success page
        const achievementsParam = result.newlyUnlockedAchievements?.length > 0 
          ? encodeURIComponent(JSON.stringify(result.newlyUnlockedAchievements))
          : null;
        
        console.log('Achievements param:', achievementsParam);
        
        const successUrl = achievementsParam 
          ? `/log-coney/success?achievements=${achievementsParam}&quantity=${values.quantity}`
          : `/log-coney/success?quantity=${values.quantity}`;
          
        console.log('Success URL:', successUrl);
        router.push(successUrl)
      } else {
        message.error(result.error || 'Failed to log coneys')
      }
    } catch (error) {
      console.error('Error logging coneys:', error)
      message.error('Failed to log coneys. Please try again.')
    }
  }

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
              <img src="/Coney_color.svg" alt="Coney" className="w-5 h-5" />
              <Title level={4} className="text-chili-red mb-0 whitespace-nowrap">Log a Coney</Title>
            </div>
            <div className="w-32"></div> {/* Spacer to balance the layout */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-900 mb-4">Log Your Cheese Coneys</Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Time to log your crushed coneys. Choose how you want to log them.
          </Paragraph>
          
          {/* Entry Mode Toggle */}
          <div className="flex justify-center mb-8">
            <Segmented
              size="large"
              options={[
                { 
                  label: (
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <CheckCircleOutlined />
                      <span>Manual Entry</span>
                    </div>
                  ), 
                  value: 'manual' 
                },
                { 
                  label: (
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <CameraOutlined />
                      <span>Upload Receipt</span>
                    </div>
                  ), 
                  value: 'upload' 
                }
              ]}
              value={entryMode}
              onChange={handleModeChange}
              className="bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm border-0">
            {entryMode === 'manual' ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-6"
              >
              {/* Brand Selection */}
              <div>
                <Title level={4} className="text-chili-red mb-4">🏪 Choose your coney brand</Title>
                <Form.Item
                  name="brand"
                  rules={[{ required: true, message: 'Please select a brand!' }]}
                >
                  <Select
                    size="large"
                    placeholder="Choose your coney brand"
                    className="w-full"
                    onChange={handleBrandChange}
                  >
                    {coneyBrands.map((brand) => (
                      <Option key={brand} value={brand}>
                        {brand}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Location Selection - Only show if brand is selected */}
              {selectedBrand && (
                <>
                  <Divider />
                  <div>
                    <Title level={4} className="text-skyline-blue mb-4">
                      📍 Choose location (optional)
                    </Title>
                    <Form.Item
                      name="location"
                      rules={[]}
                    >
                      <Select
                        size="large"
                        placeholder="Select a location or add custom"
                        className="w-full"
                        onChange={handleLocationChange}
                        showSearch
                        filterOption={(input, option) => {
                          const text = option?.children?.toString() || '';
                          return text.toLowerCase().includes(input.toLowerCase());
                        }}
                      >
                        {restaurantLocations[selectedBrand as keyof typeof restaurantLocations]
                          ?.sort((a, b) => a.name.localeCompare(b.name))
                          ?.map((location) => (
                          <Option key={`${location.name} - ${location.address}`} value={`${location.name} - ${location.address}`}>
                            {location.name} ({location.address})
                          </Option>
                        ))}
                        <Option value="custom">
                          <div className="flex items-center space-x-2">
                            <PlusOutlined />
                            <span>Add custom location</span>
                          </div>
                        </Option>
                      </Select>
                    </Form.Item>
                    
                    {/* Custom Location Input */}
                    {showCustomLocation && (
                      <div className="mt-4">
                        <Form.Item
                          name="customLocation"
                          rules={[{ required: showCustomLocation, message: 'Please enter a custom location!' }]}
                        >
                          <Input
                            size="large"
                            placeholder="Enter custom location (e.g., 123 Main St, Cincinnati, OH)"
                            value={customLocation}
                            onChange={(e) => setCustomLocation(e.target.value)}
                            prefix={<EnvironmentOutlined className="text-gray-400" />}
                          />
                        </Form.Item>
                      </div>
                    )}
                    
                    {/* Location Suggestion Button */}
                    <div className="mt-4 text-center">
                      <Button
                        type="link"
                        icon={<MailOutlined />}
                        onClick={() => setIsLocationModalVisible(true)}
                        className="text-gray-500 hover:text-chili-red"
                      >
                        Don&apos;t see the location you&apos;re crushing coneys at?
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <Divider />

              {/* Quantity */}
              <div>
                <Title level={4} className="text-skyline-blue mb-4">🌭 How many cheese coneys did you crush?</Title>
                <Form.Item
                  name="quantity"
                  rules={[
                    { required: true, message: 'Please enter quantity!' },
                    { type: 'number', min: 1, max: 20, message: 'Quantity must be between 1 and 20!' }
                  ]}
                >
                  <InputNumber
                    size="large"
                    min={1}
                    max={20}
                    placeholder="1"
                    className="w-full"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  icon={<CheckCircleOutlined />}
                  className="coney-button-primary h-14 px-12 text-lg"
                >
                  Log This Coney
                </Button>
              </div>
            </Form>
            ) : (
              /* Upload Mode */
              <div className="space-y-6">
                <div className="text-center">
                  <Title level={4} className="text-chili-red mb-4">📸 Upload Your Receipt</Title>
                  <Paragraph className="text-gray-600 mb-6">
                    Take a photo of your receipt or upload an existing image. We'll automatically extract the coney information.
                  </Paragraph>
                </div>

                {/* Upload Component */}
                <div className="text-center">
                  <Upload
                    accept="image/*"
                    beforeUpload={handleImageUpload}
                    showUploadList={false}
                    className="w-full"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-chili-red transition-colors cursor-pointer">
                      {uploadedImage ? (
                        <div className="space-y-4">
                          <FileImageOutlined className="text-4xl text-green-500" />
                          <div>
                            <div className="text-lg font-medium text-gray-900">
                              {uploadedImage.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {isProcessingImage ? 'Processing receipt...' : 'Receipt uploaded successfully!'}
                            </div>
                          </div>
                          {isProcessingImage && (
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-chili-red"></div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <CameraOutlined className="text-4xl text-gray-400" />
                          <div>
                            <div className="text-lg font-medium text-gray-900">
                              Click to upload receipt
                            </div>
                            <div className="text-sm text-gray-500">
                              Take a photo or select from your device
                            </div>
                          </div>
                          <Button 
                            type="primary" 
                            icon={<UploadOutlined />}
                            className="coney-button-primary"
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </Upload>
                </div>

                {/* Extracted Data Display */}
                {extractedData && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <CheckCircleOutlined className="text-green-500 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-green-800 mb-2">
                          Receipt Data Extracted
                        </h4>
                        <div className="text-sm text-green-700 space-y-1">
                          {extractedData.brand && (
                            <div><strong>Brand:</strong> {extractedData.brand}</div>
                          )}
                          {extractedData.quantity && (
                            <div><strong>Quantity:</strong> {extractedData.quantity} coneys</div>
                          )}
                          {extractedData.date && (
                            <div><strong>Date:</strong> {extractedData.date}</div>
                          )}
                          {extractedData.time && (
                            <div><strong>Time:</strong> {extractedData.time}</div>
                          )}
                          {extractedData.total && (
                            <div><strong>Total:</strong> ${extractedData.total}</div>
                          )}
                          {extractedData.checkNumber && (
                            <div><strong>Check #:</strong> {extractedData.checkNumber}</div>
                          )}
                          <div className="text-xs text-green-600 mt-2">
                            Confidence: {Math.round(extractedData.confidence * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* OCR Progress */}
                {ocrProgress && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                      <div>
                        <div className="text-sm font-medium text-yellow-800">
                          {ocrProgress.status}
                        </div>
                        <div className="text-xs text-yellow-700">
                          Progress: {Math.round(ocrProgress.progress * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">i</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 mb-2">
                        Tips for best results:
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Ensure the receipt is well-lit and in focus</li>
                        <li>• Make sure all text is clearly visible</li>
                        <li>• Include the entire receipt in the photo</li>
                        <li>• Avoid shadows or glare on the receipt</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Manual Override */}
                {uploadedImage && !isProcessingImage && (
                  <div className="text-center pt-4">
                    <Button
                      type="default"
                      size="large"
                      onClick={() => handleModeChange('manual')}
                      className="border-gray-300 text-gray-600 hover:border-chili-red hover:text-chili-red"
                    >
                      Manual Entry Instead
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </main>
      
      {/* Location Suggestion Modal */}
      <Modal
        title="Suggest a New Location"
        open={isLocationModalVisible}
        onCancel={() => {
          setIsLocationModalVisible(false);
          setLocationSuggestion('');
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsLocationModalVisible(false);
            setLocationSuggestion('');
          }}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleLocationSuggestion}>
            Send Suggestion
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Help us expand our location database! Tell us about a Cincinnati chili parlor that&apos;s missing from our list.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Details
            </label>
            <Input.TextArea
              rows={4}
              placeholder="Please include: Restaurant name, address, city, state, zip code, and any other helpful details..."
              value={locationSuggestion}
              onChange={(e) => setLocationSuggestion(e.target.value)}
            />
          </div>
          <div className="text-xs text-gray-500">
            <MailOutlined className="mr-1" />
            Your suggestion will be sent to our team for review.
          </div>
        </div>
      </Modal>
    </div>
  );
}
