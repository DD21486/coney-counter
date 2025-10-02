'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Image, Typography, Space, Button, Tag, Statistic, List, Empty, Table, Modal, message, Select, Input, Dropdown, Menu } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, DownloadOutlined, FileImageOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, ExportOutlined, UserOutlined, SettingOutlined, DownOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface TrainingImage {
  id: string;
  filename: string;
  blobUrl: string;
  coneyCount: number | null;
  date: string | null;
  brand: string | null;
  location: string | null;
  confidence: number;
  isValidReceipt: boolean;
  warnings: number;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  };
}

interface UserStats {
  userId: string;
  uploadCount: number;
  totalSize: number;
  user: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  };
}

export default function TrainingDataPage() {
  const [trainingImages, setTrainingImages] = useState<TrainingImage[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string>('all');

  // Debug: Log when trainingImages state changes
  useEffect(() => {
    console.log('Training images state changed:', {
      count: trainingImages.length,
      users: trainingImages.map(img => ({ id: img.userId, name: img.user.name, email: img.user.email }))
    });
  }, [trainingImages]);

  useEffect(() => {
    setCurrentPage(1);
    loadTrainingData();
  }, [selectedUser]);

  useEffect(() => {
    loadTrainingData();
  }, [currentPage]);

  const loadTrainingData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      
      if (selectedUser !== 'all') {
        params.append('userId', selectedUser);
      }

      const response = await fetch(`/api/admin/training-images?${params}`);
      const data = await response.json();

      if (response.ok) {
        console.log('Training data loaded:', {
          images: data.images.length,
          userStats: data.userStats.length,
          pagination: data.pagination,
          selectedUser,
          currentPage
        });
        console.log('Images data:', data.images.map(img => ({
          id: img.id,
          userId: img.userId,
          userName: img.user.name,
          userEmail: img.user.email,
          brand: img.brand
        })));
        console.log('Full images data:', data.images);
        setTrainingImages(data.images);
        setUserStats(data.userStats);
        setTotalPages(data.pagination.pages);
        
        // Debug: Log the state after setting
        console.log('State after setting:', {
          trainingImagesCount: data.images.length,
          userStatsCount: data.userStats.length
        });
      } else {
        message.error('Failed to load training data');
      }
    } catch (error) {
      console.error('Error loading training data:', error);
      message.error('Failed to load training data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/admin/training-images?id=${imageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        message.success('Image deleted successfully');
        loadTrainingData();
      } else {
        message.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      message.error('Failed to delete image');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const response = await fetch('/api/admin/training-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'bulk-delete',
          imageIds: selectedImages
        })
      });

      if (response.ok) {
        message.success(`${selectedImages.length} images deleted successfully`);
        setSelectedImages([]);
        setShowDeleteModal(false);
        loadTrainingData();
      } else {
        message.error('Failed to delete images');
      }
    } catch (error) {
      console.error('Error bulk deleting images:', error);
      message.error('Failed to delete images');
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/admin/training-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'export-data'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `training-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        message.success('Data exported successfully');
      } else {
        message.error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      message.error('Failed to export data');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'blobUrl',
      key: 'blobUrl',
      render: (url: string) => (
        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
          <FileImageOutlined className="text-xl text-gray-400" />
        </div>
      ),
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => (
        <div>
          <div className="font-medium text-sm">
            {user.name || 'Unknown'}
            {user.username && (
              <span className="text-gray-500 font-normal"> ({user.username})</span>
            )}
          </div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      render: (brand: string | null) => brand || 'Not specified',
    },
    {
      title: 'Coneys',
      dataIndex: 'coneyCount',
      key: 'coneyCount',
      render: (count: number | null) => count ? `${count} coneys` : 'Not detected',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string | null) => date || 'Not detected',
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => `${Math.round(confidence * 100)}%`,
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: 'Uploaded',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: TrainingImage) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => window.open(record.blobUrl, '_blank')}
          >
            View
          </Button>
          <Button 
            size="small" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteImage(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const userStatsColumns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => (
        <div>
          <div className="font-medium">{user.name || user.username || 'Unknown'}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      title: 'Uploads',
      dataIndex: 'uploadCount',
      key: 'uploadCount',
      sorter: (a: UserStats, b: UserStats) => a.uploadCount - b.uploadCount,
    },
    {
      title: 'Total Size',
      dataIndex: 'totalSize',
      key: 'totalSize',
      render: (size: number) => formatFileSize(size),
      sorter: (a: UserStats, b: UserStats) => a.totalSize - b.totalSize,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: UserStats) => (
        <Button 
          size="small"
          onClick={() => {
            setSelectedUser(record.userId);
            setCurrentPage(1);
          }}
        >
          View Images
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chili-red mx-auto mb-4"></div>
          <Text>Loading training data...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-chili-red">
                Back to Admin
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileImageOutlined className="text-chili-red text-xl" />
              <Title level={4} className="text-chili-red mb-0 whitespace-nowrap">Training Data</Title>
            </div>
            
            {/* Admin Navigation Menu */}
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="dashboard" icon={<SettingOutlined />}>
                    <Link href="/admin">Dashboard</Link>
                  </Menu.Item>
                  <Menu.Item key="users" icon={<UserOutlined />}>
                    <Link href="/admin/users">User Management</Link>
                  </Menu.Item>
                  <Menu.Item key="ocr-analytics" icon={<EyeOutlined />}>
                    <Link href="/admin/ocr-analytics">OCR Analytics</Link>
                  </Menu.Item>
                  <Menu.Item key="training-data" icon={<FileImageOutlined />}>
                    <Link href="/admin/training-data">Training Data</Link>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
            >
              <Button type="primary" className="bg-chili-red hover:bg-red-700 border-chili-red hover:border-red-700">
                Admin Sections <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Title level={2} className="text-gray-900 mb-2">OCR Training Data</Title>
          <Paragraph className="text-gray-600">
            View and manage the receipt images collected for training our OCR system.
          </Paragraph>
        </div>

        {/* Stats */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Images"
                value={trainingImages.length}
                prefix={<FileImageOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Users"
                value={userStats.length}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Size"
                value={userStats.reduce((sum, stat) => sum + stat.totalSize, 0)}
                formatter={(value) => formatFileSize(value as number)}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* User Upload Stats */}
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="mb-0">User Upload Statistics</Title>
          </div>
          <Table
            columns={userStatsColumns}
            dataSource={userStats}
            rowKey="userId"
            pagination={false}
            size="small"
          />
        </Card>

        {/* Training Images */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <Title level={4} className="mb-0">Training Images</Title>
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                style={{ width: 200 }}
              >
                <Option value="all">All Users</Option>
                {userStats.map(stat => (
                  <Option key={stat.userId} value={stat.userId}>
                    {stat.user.name || stat.user.username || stat.user.email}
                  </Option>
                ))}
              </Select>
            </div>
            <Space>
              <Button 
                icon={<ExportOutlined />}
                onClick={handleExportData}
              >
                Export Data
              </Button>
              <Button 
                danger
                icon={<DeleteOutlined />}
                disabled={selectedImages.length === 0}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Selected ({selectedImages.length})
              </Button>
              <Button onClick={loadTrainingData}>
                Refresh
              </Button>
            </Space>
          </div>

          {/* Debug: Log trainingImages before table */}
          {console.log('About to render table with trainingImages:', trainingImages.length, trainingImages.map(img => ({ id: img.id, userId: img.userId, userName: img.user.name })))}

          <Table
            columns={columns}
            dataSource={trainingImages}
            rowKey="id"
            size="small"
            className="training-images-table"
            pagination={{
              current: currentPage,
              total: totalPages * 20,
              pageSize: 20,
              onChange: setCurrentPage,
            }}
            rowSelection={{
              selectedRowKeys: selectedImages,
              onChange: setSelectedImages,
            }}
            scroll={{ x: 800 }}
            onRow={(record) => {
              console.log('Table row data:', record);
              console.log('User info:', record.user);
              return {};
            }}
          />
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Delete Training Images"
          open={showDeleteModal}
          onOk={handleBulkDelete}
          onCancel={() => setShowDeleteModal(false)}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete {selectedImages.length} training images?</p>
          <p className="text-red-600">This action cannot be undone.</p>
        </Modal>
      </main>
    </div>
  );
}