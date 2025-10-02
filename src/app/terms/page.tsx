'use client';

import { Typography, Card, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                Back to Home
              </Button>
            </Link>
            <Title level={4} className="text-chili-red mb-0">Terms & Conditions</Title>
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-sm">
          <div className="prose prose-lg max-w-none">
            <Title level={1} className="text-gray-900 mb-6">Terms and Conditions</Title>
            
            <Paragraph className="text-gray-600 mb-6">
              <Text strong>Last updated:</Text> January 1, 2025
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">1. Acceptance of Terms</Title>
            <Paragraph className="text-gray-700 mb-6">
              By accessing and using Coney Counter ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">2. Description of Service</Title>
            <Paragraph className="text-gray-700 mb-6">
              Coney Counter is a web application that allows users to track their coney consumption, earn achievements, and compete with other users through leaderboards. The service includes receipt scanning functionality that uses optical character recognition (OCR) technology to automatically detect coney quantities from uploaded receipt images.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">3. User Accounts and Registration</Title>
            <Paragraph className="text-gray-700 mb-4">
              To use certain features of the Service, you must register for an account. You agree to:
            </Paragraph>
            <ul className="text-gray-700 mb-6 ml-6">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information to keep it accurate and current</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <Title level={2} className="text-gray-900 mt-8 mb-4">4. Receipt Upload and Data Processing</Title>
            <Paragraph className="text-gray-700 mb-4">
              <Text strong>Important:</Text> By uploading receipt images to the Service, you grant Coney Counter the following rights and permissions:
            </Paragraph>
            <ul className="text-gray-700 mb-4 ml-6">
              <li><Text strong>Training Data Permission:</Text> You expressly consent to the use of your successfully verified receipt images for machine learning and pattern recognition training purposes</li>
              <li><Text strong>Data Processing:</Text> We may process, analyze, and store your receipt images to improve our OCR technology and service accuracy</li>
              <li><Text strong>Anonymized Usage:</Text> Receipt images may be used in anonymized form for research, development, and improvement of our OCR algorithms</li>
              <li><Text strong>Storage:</Text> Images may be stored securely on our servers for training and verification purposes</li>
            </ul>
            <Paragraph className="text-gray-700 mb-6">
              <Text strong>Verification Process:</Text> Only receipt images that you have verified as accurate (by confirming the detected coney count is correct) will be used for training purposes. Images marked as incorrect will not be used for training.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">5. User Content and Intellectual Property</Title>
            <Paragraph className="text-gray-700 mb-4">
              You retain ownership of any content you upload to the Service, including receipt images. However, by uploading content, you grant Coney Counter a non-exclusive, royalty-free, worldwide license to:
            </Paragraph>
            <ul className="text-gray-700 mb-6 ml-6">
              <li>Use, reproduce, and process your content for the purpose of providing the Service</li>
              <li>Use verified receipt images for machine learning and OCR improvement</li>
              <li>Store and backup your content on our servers</li>
              <li>Display your content as part of the Service functionality</li>
            </ul>

            <Title level={2} className="text-gray-900 mt-8 mb-4">6. Privacy and Data Protection</Title>
            <Paragraph className="text-gray-700 mb-6">
              Your privacy is important to us. We collect and process personal information in accordance with our Privacy Policy. Receipt images are processed securely and are not shared with third parties except as necessary to provide the Service or as required by law. Personal information extracted from receipts (such as names, addresses, or payment information) is not stored or used beyond what is necessary for OCR processing.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">7. Prohibited Uses</Title>
            <Paragraph className="text-gray-700 mb-4">
              You may not use the Service:
            </Paragraph>
            <ul className="text-gray-700 mb-6 ml-6">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            </ul>

            <Title level={2} className="text-gray-900 mt-8 mb-4">8. Service Availability</Title>
            <Paragraph className="text-gray-700 mb-6">
              We strive to maintain the Service's availability but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">9. Disclaimers and Limitations of Liability</Title>
            <Paragraph className="text-gray-700 mb-4">
              <Text strong>Service Disclaimer:</Text> The Service is provided "as is" and "as available" without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </Paragraph>
            <Paragraph className="text-gray-700 mb-4">
              <Text strong>OCR Accuracy:</Text> While we strive for accuracy, our OCR technology may not always correctly identify coney quantities or other information from receipt images. Users are responsible for verifying the accuracy of detected information.
            </Paragraph>
            <Paragraph className="text-gray-700 mb-6">
              <Text strong>Limitation of Liability:</Text> In no event shall Coney Counter be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">10. Indemnification</Title>
            <Paragraph className="text-gray-700 mb-6">
              You agree to defend, indemnify, and hold harmless Coney Counter and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from your use of the Service or violation of these Terms.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">11. Termination</Title>
            <Paragraph className="text-gray-700 mb-6">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">12. Changes to Terms</Title>
            <Paragraph className="text-gray-700 mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">13. Governing Law</Title>
            <Paragraph className="text-gray-700 mb-6">
              These Terms shall be interpreted and governed by the laws of the State of Ohio, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Hamilton County, Ohio.
            </Paragraph>

            <Title level={2} className="text-gray-900 mt-8 mb-4">14. Contact Information</Title>
            <Paragraph className="text-gray-700 mb-6">
              If you have any questions about these Terms and Conditions, please contact us at:
            </Paragraph>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <Paragraph className="mb-2">
                <Text strong>Email:</Text> support@coneycounter.com
              </Paragraph>
              <Paragraph className="mb-0">
                <Text strong>Address:</Text> Cincinnati, Ohio, United States
              </Paragraph>
            </div>

            <Title level={2} className="text-gray-900 mt-8 mb-4">15. Severability</Title>
            <Paragraph className="text-gray-700 mb-6">
              If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </Paragraph>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <Paragraph className="text-gray-500 text-sm text-center">
                By using Coney Counter, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </Paragraph>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
