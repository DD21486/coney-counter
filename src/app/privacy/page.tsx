'use client';

import { Typography, Card, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                Back
              </Button>
            </Link>
            <Title level={4} className="text-chili-red mb-0">Privacy Policy</Title>
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-sm">
          <div className="prose prose-lg max-w-none">
            <Title level={1} className="text-gray-900 mb-6">Privacy Policy</Title>
            
            <Paragraph className="text-gray-600 mb-6">
              <Text strong>Last updated:</Text> January 1, 2025
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">1. Introduction</Title>
            <Paragraph className="text-gray-700 mb-6">
              Coney Counter ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">2. Information We Collect</Title>
            
            <Title level={3} className="text-gray-800 mt-6 mb-3">2.1 Personal Information</Title>
            <Paragraph className="text-gray-700 mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </Paragraph>
            <ul className="text-gray-700 mb-6 ml-6">
              <li>Register for an account (name, email address, username)</li>
              <li>Use our receipt scanning feature (receipt images)</li>
              <li>Contact us for support</li>
              <li>Participate in surveys or feedback forms</li>
            </ul>

            <Title level={3} className="text-gray-800 mt-6 mb-3">2.2 Automatically Collected Information</Title>
            <Paragraph className="text-gray-700 mb-4">
              We may automatically collect certain information about your device and usage patterns:
            </Paragraph>
            <ul className="text-gray-700 mb-6 ml-6">
              <li>Device information (browser type, operating system, IP address)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Log files and analytics data</li>
            </ul>

            <Title level={2} className="text-gray-900 mt-8 mb-4">3. How We Use Your Information</Title>
            <Paragraph className="text-gray-700 mb-4">
              We use the information we collect for various purposes, including:
            </Paragraph>
            <ul className="text-gray-700 mb-6 ml-6">
              <li><Text strong>Service Provision:</Text> To provide, maintain, and improve our services</li>
              <li><Text strong>Account Management:</Text> To create and manage your user account</li>
              <li><Text strong>Receipt Processing:</Text> To process and analyze receipt images using OCR technology</li>
              <li><Text strong>Machine Learning:</Text> To improve our OCR algorithms using verified receipt data</li>
              <li><Text strong>Communication:</Text> To send you updates, notifications, and support messages</li>
              <li><Text strong>Analytics:</Text> To understand usage patterns and improve user experience</li>
              <li><Text strong>Security:</Text> To protect against fraud, abuse, and security threats</li>
            </ul>

            <Title level={2} className="text-gray-900 mt-8 mb-4">4. Receipt Image Processing</Title>
            <Paragraph className="text-gray-700 mb-4">
              <Text strong>Important:</Text> When you upload receipt images to our service:
            </Paragraph>
            <ul className="text-gray-700 mb-4 ml-6">
              <li><Text strong>OCR Processing:</Text> Images are processed using optical character recognition to extract coney quantities and other relevant information</li>
              <li><Text strong>Training Data:</Text> Only receipt images that you verify as accurate are used to improve our OCR algorithms</li>
              <li><Text strong>Secure Storage:</Text> Images are stored securely on our servers for processing and training purposes</li>
              <li><Text strong>No Personal Data Extraction:</Text> We do not extract or store personal information from receipts (names, addresses, payment details)</li>
              <li><Text strong>Anonymized Usage:</Text> Receipt images may be used in anonymized form for research and development</li>
            </ul>
            <Paragraph className="text-gray-700 mb-6">
              <Text strong>Verification Process:</Text> You have control over which images are used for training. Only images you confirm as accurate will be used to improve our OCR technology.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">5. Information Sharing and Disclosure</Title>
            <Paragraph className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
            </Paragraph>
            <ul className="text-gray-700 mb-6 ml-6">
              <li><Text strong>Service Providers:</Text> We may share information with trusted third-party service providers who assist us in operating our service</li>
              <li><Text strong>Legal Requirements:</Text> We may disclose information when required by law or to protect our rights and safety</li>
              <li><Text strong>Business Transfers:</Text> In the event of a merger, acquisition, or sale of assets, user information may be transferred</li>
              <li><Text strong>Consent:</Text> We may share information with your explicit consent</li>
            </ul>

            <Title level={2} className="text-gray-900 mt-8 mb-4">6. Data Security</Title>
            <Paragraph className="text-gray-700 mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">7. Data Retention</Title>
            <Paragraph className="text-gray-700 mb-6">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. Receipt images may be retained for training purposes as long as they contribute to improving our OCR technology. You may request deletion of your account and associated data at any time.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">8. Cookies and Tracking Technologies</Title>
            <Paragraph className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to:
            </Paragraph>
            <ul className="text-gray-700 mb-6 ml-6">
              <li>Remember your preferences and settings</li>
              <li>Analyze usage patterns and improve our service</li>
              <li>Provide personalized content and features</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
            <Paragraph className="text-gray-700 mb-6">
              You can control cookie settings through your browser preferences, but disabling cookies may affect the functionality of our service.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">9. Your Rights and Choices</Title>
            <Paragraph className="text-gray-700 mb-4">
              You have the following rights regarding your personal information:
            </Paragraph>
            <ul className="text-gray-700 mb-6 ml-6">
              <li><Text strong>Access:</Text> Request access to your personal information</li>
              <li><Text strong>Correction:</Text> Request correction of inaccurate information</li>
              <li><Text strong>Deletion:</Text> Request deletion of your personal information</li>
              <li><Text strong>Portability:</Text> Request a copy of your data in a portable format</li>
              <li><Text strong>Opt-out:</Text> Opt out of certain data processing activities</li>
              <li><Text strong>Withdraw Consent:</Text> Withdraw consent for data processing where applicable</li>
            </ul>

            <Title level={2} className="text-gray-900 mt-8 mb-4">10. Third-Party Services</Title>
            <Paragraph className="text-gray-700 mb-6">
              Our service may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to review the privacy policies of any third-party services you access through our platform.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">11. Children's Privacy</Title>
            <Paragraph className="text-gray-700 mb-6">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us to have the information removed.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">12. International Data Transfers</Title>
            <Paragraph className="text-gray-700 mb-6">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">13. Changes to This Privacy Policy</Title>
            <Paragraph className="text-gray-700 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our service after any changes constitutes acceptance of the updated Privacy Policy.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">14. Contact Us</Title>
            <Paragraph className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </Paragraph>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <Paragraph className="mb-0">
                <Text strong>Email:</Text> daleyvisuals@gmail.com
              </Paragraph>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <Paragraph className="text-gray-500 text-sm text-center">
                By using Coney Counter, you acknowledge that you have read and understood this Privacy Policy.
              </Paragraph>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
