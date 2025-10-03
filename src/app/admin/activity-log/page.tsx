'use client';

import { Button, Card, Typography, Row, Col, Table, Tag, Space, Tooltip } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  quantity: number;
  brand: string;
  isReceiptScanned: boolean;
  receiptImageUrl?: string;
  location?: string;
}

interface ActivityLogData {
  entries: ActivityLogEntry[];
  total: number;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

const brandColors: { [key: string]: string } = {
  'Skyline Chili': 'red',
  'Gold Star Chili': '#FFD700',
  'Dixie Chili': 'orange',
  'Camp Washington Chili': 'green',
  'Empress Chili': 'purple',
  'Price Hill Chili': 'cyan',
  'Pleasant Ridge Chili': 'magenta',
  'Blue Ash Chili': 'blue',
  'Other': 'default'
};

export default function AdminActivityLogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<ActivityLogData>({
    entries: [],
    total: 0,
    pagination: { page: 1, pageSize: 20, total: 0 }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    if (status === 'loading') return;
    
    // Check if user is admin/owner
    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'owner')) {
      router.push('/dashboard');
      return;
    }

    fetchActivityLog();
  }, [session, status, router, currentPage, pageSize]);

  const fetchActivityLog = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await fetch(`/api/admin/activity-log?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setActivityData(data);
      } else {
        console.error('Error fetching activity log');
      }
    } catch (error) {
      console.error('Error fetching activity log:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      width: 200,
      render: (_: any, record: ActivityLogEntry) => (
        <div>
          <div className="font-medium">{record.userName}</div>
          <div className="text-xs text-gray-500">{record.userEmail}</div>
        </div>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'time',
      width: 180,
      render: (date: string) => (
        <div className="flex items-center space-x-1">
          <ClockCircleOutlined className="text-gray-400" />
          <span className="text-sm">
            {new Date(date).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (quantity: number) => (
        <div className="text-center">
          <span className="text-lg font-bold text-blue-600">{quantity}</span>
        </div>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 150,
      render: (brand: string) => (
        <Tag color={brandColors[brand] || 'default'} className="font-medium">
          {brand}
        </Tag>
      ),
    },

    {
      title: 'Method',
      key: 'method',
      width: 120,
      render: (_: any, record: ActivityLogEntry) => (
        <Tooltip title={record.isReceiptScanned ? 'Receipt scanned' : 'Manual entry'}>
          <div className="flex items-center space-x-1">
            {record.isReceiptScanned ? (
              <>
                <ShoppingCartOutlined className="text-green-500" />
                <span className="text-xs text-green-600">Receipt</span>
              </>
            ) : (
              <>
                <UserOutlined className="text-blue-500" />
                <span className="text-xs text-blue-600">Manual</span>
              </>
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 150,
      render: (location: string) => (
        <div className="text-sm text-gray-600">
          {location || '-'}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin">
              <Button type="text" icon={<ArrowLeftOutlined />} className="text-gray-600 hover:text-red-500">
                Back to Admin
              </Button>
            </Link>
            <div className="flex-1 flex justify-center">
              <img src="/ConeyCounterLogo_Medium.png" alt="Coney Counter" className="h-8 w-auto max-w-[200px]" />
            </div>
            <div className="w-32"></div> {/* Spacer to balance the back button */}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Title level={2} className="!mb-2">Global Activity Log</Title>
          <Text type="secondary">
            View all coney logging activity across the platform
          </Text>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {activityData.total}
              </div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {activityData.entries.filter(entry => entry.isReceiptScanned).length}
              </div>
              <div className="text-sm text-gray-600">Receipt Scans</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {activityData.entries.filter(entry => !entry.isReceiptScanned).length}
              </div>
              <div className="text-sm text-gray-600">Manual Entries</div>
            </Card>
          </Col>
        </Row>

        {/* Activity Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={activityData.entries}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: activityData.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} entries`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
            size="middle"
          />
        </Card>
      </div>
    </div>
  );
}
