'use client';

import { Button, Card, Form, Input, Select, InputNumber, Typography, Space, Row, Col, Divider, message, Modal } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, CheckCircleOutlined, EnvironmentOutlined, MailOutlined, CameraOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

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
  'Pleasant Ridge Chili': [
    { name: 'Main Location', address: '6032 Montgomery Rd, Cincinnati, OH' },
    { name: 'Other Pleasant Ridge Location', address: 'Custom Location' }
  ],
  'Blue Ash Chili': [
    { name: 'Main Location', address: '9565 Kenwood Rd, Blue Ash, OH' },
    { name: 'Other Blue Ash Location', address: 'Custom Location' }
  ],
  'Other': [
    { name: 'Custom Location', address: 'Custom Location' }
  ]
};

export default function LogConeyPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [showCustomLocation, setShowCustomLocation] = useState<boolean>(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState<boolean>(false);
  const [locationSuggestion, setLocationSuggestion] = useState<string>('');

  const coneyBrands = [
    'Skyline Chili',
    'Gold Star Chili', 
    'Dixie Chili',
    'Camp Washington Chili',
    'Pleasant Ridge Chili',
    'Blue Ash Chili',
    'Other'
  ];

  useEffect(() => {
    // Safe analytics tracking
    // try {
    //   analytics.track('log_coney_page_viewed');
    // } catch (error) {
    //   console.warn('Analytics tracking failed:', error);
    // }
  }, []);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setShowCustomLocation(false);
    setCustomLocation('');
  };

  const handleLocationChange = (value: string) => {
    if (value === 'Custom Location') {
      setShowCustomLocation(true);
    } else {
      setShowCustomLocation(false);
      setCustomLocation('');
    }
  };

  const handleLocationSuggestion = async () => {
    if (!locationSuggestion.trim()) {
      message.warning('Please enter location details before submitting.');
      return;
    }

    try {
      const response = await fetch('/api/location-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          suggestion: locationSuggestion,
          brand: selectedBrand
        }),
      });

      if (response.ok) {
        message.success('Thank you for your suggestion! We\'ll review it and add it to our database.');
        setLocationSuggestion('');
        setIsLocationModalVisible(false);
      } else {
        message.error('Failed to submit suggestion. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting location suggestion:', error);
      message.error('Failed to submit suggestion. Please try again.');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/coney-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: values.brand,
          quantity: values.quantity,
          location: showCustomLocation ? customLocation : values.location,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        message.success('Coneys logged successfully!')
        
        // Track analytics event
        // try {
        //   analytics.logConeys(values.quantity, values.brand);
        // } catch (error) {
        //   console.warn('Analytics tracking failed:', error);
        // }
        
        console.log('API result:', result);
        console.log('Newly unlocked achievements:', result.newlyUnlockedAchievements);
        
        // Pass newly unlocked achievements to success page
        const achievementsParam = result.newlyUnlockedAchievements?.length > 0 
          ? encodeURIComponent(JSON.stringify(result.newlyUnlockedAchievements))
          : null;
        
        const successUrl = achievementsParam 
          ? `/log-coney/success?achievements=${achievementsParam}&quantity=${values.quantity}`
          : `/log-coney/success?quantity=${values.quantity}`;
        
        router.push(successUrl);
      } else {
        message.error(result.error || 'Failed to log coneys. Please try again.')
      }
    } catch (error) {
      console.error('Error logging coneys:', error)
      message.error('Failed to log coneys. Please try again.')
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
              <CheckCircleOutlined className="text-chili-red text-xl" />
              <Title level={4} className="text-chili-red mb-0 whitespace-nowrap">Log Your Coneys</Title>
            </div>
            <div className="w-32"></div>
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
          
          {/* Upload Option */}
          <div className="flex justify-center mb-8">
            <Link href="/upload-receipt">
              <Button 
                type="primary" 
                size="large"
                icon={<CameraOutlined />}
                className="bg-chili-red hover:bg-red-700 border-chili-red hover:border-red-700"
              >
                Upload Receipt Instead
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm border-0">
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
                  rules={[{ required: true, message: 'Please select a coney brand!' }]}
                >
                  <Select
                    placeholder="Select your coney brand"
                    size="large"
                    onChange={handleBrandChange}
                    className="w-full"
                  >
                    {coneyBrands.map((brand) => (
                      <Option key={brand} value={brand}>
                        {brand}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Location Selection */}
              {selectedBrand && (
                <div>
                  <Title level={4} className="text-chili-red mb-4">📍 Choose your location (optional)</Title>
                  <Form.Item
                    name="location"
                  >
                    <Select
                      placeholder="Select your location"
                      size="large"
                      onChange={handleLocationChange}
                      className="w-full"
                    >
                      {restaurantLocations[selectedBrand as keyof typeof restaurantLocations]?.map((location) => (
                        <Option key={location.name} value={location.name}>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-gray-500">{location.address}</div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Custom Location Input */}
                  {showCustomLocation && (
                    <Form.Item
                      name="customLocation"
                      rules={[{ required: true, message: 'Please enter your custom location!' }]}
                    >
                      <Input
                        placeholder="Enter your custom location"
                        size="large"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        className="w-full"
                      />
                    </Form.Item>
                  )}

                  {/* Location Suggestion Button */}
                  <div className="text-center mt-4">
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      onClick={() => setIsLocationModalVisible(true)}
                      className="text-chili-red hover:text-red-700"
                    >
                      Don't see your location? Suggest it!
                    </Button>
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <Title level={4} className="text-chili-red mb-4">🌶️ How many coneys did you eat?</Title>
                <Form.Item
                  name="quantity"
                  rules={[
                    { required: true, message: 'Please enter the number of coneys!' },
                    { type: 'number', min: 1, message: 'Must be at least 1 coney!' },
                    { type: 'number', max: 50, message: 'That\'s a lot of coneys! Max is 50.' }
                  ]}
                >
                  <InputNumber
                    placeholder="Number of coneys"
                    size="large"
                    min={1}
                    max={50}
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
          </Card>
        </div>
      </main>

      {/* Location Suggestion Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <EnvironmentOutlined className="text-chili-red" />
            <span>Suggest a Location</span>
          </div>
        }
        open={isLocationModalVisible}
        onCancel={() => setIsLocationModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsLocationModalVisible(false)}>
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