'use client';

import { Button, Card, Form, Input, Select, InputNumber, Typography, Space, Row, Col, Divider, message, Modal } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, CheckCircleOutlined, EnvironmentOutlined, MailOutlined, CameraOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

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

  /* Force all section titles to be white - only on log coney page */
  .log-coney-page .ant-typography h1,
  .log-coney-page .ant-typography h2,
  .log-coney-page .ant-typography h3,
  .log-coney-page .ant-typography h4,
  .log-coney-page .ant-typography h5,
  .log-coney-page .ant-typography h6,
  .log-coney-page h1, 
  .log-coney-page h2, 
  .log-coney-page h3, 
  .log-coney-page h4, 
  .log-coney-page h5, 
  .log-coney-page h6,
  .log-coney-page .ant-typography,
  .log-coney-page .ant-typography-title {
    color: white !important;
  }

  /* Specific targeting for Ant Design Typography components - only on log coney page */
  .log-coney-page .ant-typography.ant-typography-h1,
  .log-coney-page .ant-typography.ant-typography-h2,
  .log-coney-page .ant-typography.ant-typography-h3,
  .log-coney-page .ant-typography.ant-typography-h4,
  .log-coney-page .ant-typography.ant-typography-h5,
  .log-coney-page .ant-typography.ant-typography-h6 {
    color: white !important;
  }

  /* Dark mode dropdown styling for log coney page */
  .log-coney-page .ant-select {
    color: white !important;
  }

  .log-coney-page .ant-select .ant-select-selector {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
  }

  .log-coney-page .ant-select .ant-select-selection-placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .log-coney-page .ant-select .ant-select-selection-item {
    color: white !important;
  }

  .log-coney-page .ant-select:hover .ant-select-selector {
    border-color: rgba(255, 255, 255, 0.5) !important;
  }

  .log-coney-page .ant-select-focused .ant-select-selector {
    border-color: rgba(255, 255, 255, 0.7) !important;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
  }

  /* Dropdown menu styling */
  .log-coney-page .ant-select-dropdown {
    background-color: rgba(15, 23, 42, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
  }

  .log-coney-page .ant-select-item {
    color: white !important;
  }

  .log-coney-page .ant-select-item:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  .log-coney-page .ant-select-item-option-selected {
    background-color: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
  }

  .log-coney-page .ant-select-item-option-active {
    background-color: rgba(255, 255, 255, 0.15) !important;
  }

  /* Ensure dropdown height adjusts for multi-line content */
  .log-coney-page .ant-select .ant-select-selection-item {
    height: auto !important;
    min-height: 40px !important;
    padding: 8px 12px !important;
    display: flex !important;
    align-items: center !important;
  }

  .log-coney-page .ant-select .ant-select-selection-item-content {
    width: 100% !important;
  }

  /* Style for selected location content */
  .log-coney-page .ant-select .ant-select-selection-item .font-medium {
    color: white !important;
    font-weight: 500 !important;
  }

  .log-coney-page .ant-select .ant-select-selection-item .text-sm {
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: 12px !important;
    margin-top: 2px !important;
  }

  /* Input styling for log coney page */
  .log-coney-page .ant-input {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
  }

  .log-coney-page .ant-input::placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .log-coney-page .ant-input:hover {
    border-color: rgba(255, 255, 255, 0.5) !important;
  }

  .log-coney-page .ant-input:focus {
    border-color: rgba(255, 255, 255, 0.7) !important;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
  }

  /* InputNumber styling for log coney page */
  .log-coney-page .ant-input-number {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
  }

  .log-coney-page .ant-input-number .ant-input-number-input {
    background-color: transparent !important;
    color: white !important;
  }

  .log-coney-page .ant-input-number .ant-input-number-input::placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  /* Additional InputNumber styling for better text visibility */
  .log-coney-page .ant-input-number input {
    color: white !important;
  }

  .log-coney-page .ant-input-number .ant-input-number-handler-wrap {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-left: 1px solid rgba(255, 255, 255, 0.3) !important;
  }

  .log-coney-page .ant-input-number .ant-input-number-handler {
    color: white !important;
  }

  .log-coney-page .ant-input-number .ant-input-number-handler:hover {
    color: white !important;
  }

  .log-coney-page .ant-input-number:hover {
    border-color: rgba(255, 255, 255, 0.5) !important;
  }

  .log-coney-page .ant-input-number:focus {
    border-color: rgba(255, 255, 255, 0.7) !important;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
  }

  /* Modal styling for log coney page */
  .log-coney-page .ant-modal-content {
    background-color: rgba(15, 23, 42, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
  }

  .log-coney-page .ant-modal-header {
    background-color: transparent !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
  }

  .log-coney-page .ant-modal-title {
    color: white !important;
  }

  .log-coney-page .ant-modal-body {
    color: white !important;
  }

  .log-coney-page .ant-modal-footer {
    background-color: transparent !important;
    border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = stylingCSS;
  document.head.appendChild(style);
}

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
    'Empress Chili',
    'Price Hill Chili',
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
          timezoneOffset: new Date().getTimezoneOffset() * -1, // Convert to positive offset (EST = -300 becomes 300)
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
        
        // Pass newly unlocked achievements and XP data to success page
        const achievementsParam = result.newlyUnlockedAchievements?.length > 0 
          ? encodeURIComponent(JSON.stringify(result.newlyUnlockedAchievements))
          : null;
        
        const xpParam = result.xpResult ? encodeURIComponent(JSON.stringify(result.xpResult)) : null;
        
        const titlesParam = result.newlyUnlockedTitles?.length > 0 
          ? encodeURIComponent(JSON.stringify(result.newlyUnlockedTitles))
          : null;
        
        let successUrl = `/log-coney/success?quantity=${values.quantity}`;
        if (achievementsParam) successUrl += `&achievements=${achievementsParam}`;
        if (xpParam) successUrl += `&xp=${xpParam}`;
        if (titlesParam) successUrl += `&titles=${titlesParam}`;
        
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
    <div 
      className="min-h-screen text-white log-coney-page"
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
          <Title level={2} className="text-white mb-4">Log Your Cheese Coneys</Title>
          <Paragraph className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
            Manually enter your coney details below.
          </Paragraph>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="analytics-card">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-6"
            >
              {/* Brand Selection */}
              <div>
                <Title level={4} className="text-white mb-4">🏪 Choose your coney brand</Title>
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
                  <Title level={4} className="text-white mb-4">📍 Choose your location (optional)</Title>
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
                            <div className="text-sm text-white/60">{location.address}</div>
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
                      className="text-white hover:text-white hover:bg-white/10"
                    >
                      Don't see your location? Suggest it!
                    </Button>
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <Title level={4} className="text-white mb-4">🌶️ How many coneys did you eat?</Title>
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
            <EnvironmentOutlined className="text-white" />
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
          <p className="text-white/80">
            Help us expand our location database! Tell us about a Cincinnati chili parlor that&apos;s missing from our list.
          </p>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Location Details
            </label>
            <Input.TextArea
              rows={4}
              placeholder="Please include: Restaurant name, address, city, state, zip code, and any other helpful details..."
              value={locationSuggestion}
              onChange={(e) => setLocationSuggestion(e.target.value)}
            />
          </div>
          <div className="text-xs text-white/60">
            <MailOutlined className="mr-1" />
            Your suggestion will be sent to our team for review.
          </div>
        </div>
      </Modal>

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