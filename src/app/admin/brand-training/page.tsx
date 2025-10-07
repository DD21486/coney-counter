'use client';

import { Button, Card, Typography, Row, Col, Upload, message, Space, Tag, Alert } from 'antd';
import { ArrowLeftOutlined, UploadOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const brands = [
  { key: 'skyline', name: 'Skyline Chili', color: 'red' },
  { key: 'gold-star', name: 'Gold Star Chili', color: 'gold' },
  { key: 'dixie', name: 'Dixie Chili', color: 'orange' },
  { key: 'camp-washington', name: 'Camp Washington Chili', color: 'green' },
  { key: 'empress', name: 'Empress Chili', color: 'purple' },
  { key: 'price-hill', name: 'Price Hill Chili', color: 'cyan' },
  { key: 'pleasant-ridge', name: 'Pleasant Ridge Chili', color: 'magenta' },
  { key: 'blue-ash', name: 'Blue Ash Chili', color: 'blue' },
];

export default function BrandTrainingPage() {
  const { data: session } = useSession();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Record<string, any[]>>({});

  if (!session?.user?.role || (session.user?.role !== 'admin' && session.user?.role !== 'owner')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">This page is for administrators only.</p>
            <Link href="/dashboard">
              <Button type="primary">Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const handleUpload = (info: any) => {
    const { status } = info.file;
    
    if (status === 'done') {
      message.success(`${info.file.name} uploaded successfully.`);
      // Store the uploaded file info for analysis
      setUploadedImages(prev => ({
        ...prev,
        [selectedBrand!]: [...(prev[selectedBrand!] || []), info.file]
      }));
    } else if (status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    accept: 'image/*',
    beforeUpload: () => false, // Prevent automatic upload
    onChange: handleUpload,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button icon={<ArrowLeftOutlined />} type="text">
                  <span className="hidden sm:inline">Back to Admin</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div className="h-8 w-1 bg-gray-200"></div>
              <img src="/ConeyCounterLogo_Medium.png" alt="Coney Counter" className="h-8" />
            </div>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1}>Brand Training System</Title>
          <Paragraph className="text-gray-600 max-w-3xl mx-auto">
            Upload example receipt images for each brand to analyze OCR patterns and improve detection accuracy.
            The AI will learn what patterns to look for from your examples.
          </Paragraph>
        </div>

        {/* Alert */}
        <Alert
          message="How It Works"
          description="Upload 3-5 receipt examples per brand. The system will analyze the OCR text patterns and automatically improve brand detection and coney counting for that brand."
          type="info"
          showIcon
          className="mb-8"
        />

        {/* Brand Selection */}
        <Card className="mb-6">
          <Title level={3} className="mb-4">Select Brand</Title>
          <Row gutter={[16, 16]}>
            {brands.map((brand) => (
              <Col key={brand.key} xs={12} sm={8} lg={6}>
                <Card
                  hoverable
                  className={`text-center cursor-pointer transition-all ${
                    selectedBrand === brand.key 
                      ? 'border-red-500 shadow-md' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedBrand(brand.key)}
                >
                  <Tag color={brand.color} className="mb-2 text-sm">
                    {brand.name}
                  </Tag>
                  <div className="text-xs text-gray-500">
                    {uploadedImages[brand.key]?.length || 0} training images
                  </div>
                  {uploadedImages[brand.key]?.length && uploadedImages[brand.key].length > 0 && (
                    <CheckCircleOutlined className="text-green-500 mt-1" />
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Upload Section */}
        {selectedBrand && (
          <Card>
            <Title level={3} className="mb-4">
              Upload Training Images for {brands.find(b => b.key === selectedBrand)?.name}
            </Title>
            
            <Dragger {...uploadProps} className="mb-6">
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag receipt images here to upload
              </p>
              <p className="ant-upload-hint">
                Upload 3-5 clear receipt examples. Supported formats: JPG, PNG, WebP
              </p>
            </Dragger>

            {/* Current Training Images */}
            {uploadedImages[selectedBrand] && uploadedImages[selectedBrand].length > 0 && (
              <div>
                <Title level={4} className="mb-3">Current Training Images</Title>
                <Row gutter={[16, 16]}>
                  {uploadedImages[selectedBrand].map((file, index) => (
                    <Col key={index} xs={12} sm={8} lg={6}>
                      <Card 
                        size="small" 
                        cover={
                          <img 
                            alt={file.name}
                            src={URL.createObjectURL(file)}
                            className="h-32 object-cover"
                          />
                        }
                        actions={[
                          <Button 
                            type="text" 
                            icon={<EyeOutlined />}
                            onClick={() => {
                              // Open image in new tab for analysis
                              window.open(URL.createObjectURL(file), '_blank');
                            }}
                          >
                            Analyze
                          </Button>
                        ]}
                      >
                        <div className="text-xs text-gray-600">{file.name}</div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card>
        )}

        {/* Training Instructions */}
        <Card className="mt-8">
          <Title level={3}>Instructions</Title>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Select a brand from the grid above</li>
            <li>Upload 3-5 example receipt images that clearly show the brand name and coney items</li>
            <li>Click "Analyze" on uploaded images to see OCR text extraction for pattern analysis</li>
            <li>The system will automatically learn improved pattern matching for each brand</li>
          </ol>
          
          <Alert
            message="Analysis Process"
            description="Once you upload images, provide me with the OCR-extracted text from a few examples and I'll analyze the patterns to improve the brand detection and coney counting algorithms."
            type="info"
            className="mt-4"
          />
        </Card>
      </div>
    </div>
  );
}


