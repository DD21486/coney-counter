'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Table, Tag, Space, Typography, message, Input, Select, Tooltip, Dropdown, Menu } from 'antd';
import { CheckOutlined, CloseOutlined, ReloadOutlined, SearchOutlined, ArrowLeftOutlined, CrownOutlined, UserOutlined, StopOutlined, PlayCircleOutlined, MoreOutlined, DeleteOutlined, EyeOutlined, FileImageOutlined, SettingOutlined, DownOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;
const { Option } = Select;

interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  isApproved: boolean;
  role: string;
  isBanned: boolean;
  approvedAt: string | null;
  bannedAt: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const fetchUsers = async (search = '', filter = 'all') => {
    try {
      const response = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
      if (response.ok) {
        const data = await response.json();
        let filteredUsers = data.users;
        
        // Apply client-side filtering
        switch (filter) {
          case 'approved':
            filteredUsers = data.users.filter((u: User) => u.isApproved);
            break;
          case 'pending':
            filteredUsers = data.users.filter((u: User) => !u.isApproved);
            break;
          case 'banned':
            filteredUsers = data.users.filter((u: User) => u.isBanned);
            break;
          case 'all':
          default:
            filteredUsers = data.users;
            break;
        }
        
        setUsers(filteredUsers);
      } else {
        message.error('Failed to fetch users');
      }
    } catch (error) {
      message.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (email: string, action: string, role?: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, action, role }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message);
        fetchUsers(searchTerm, activeFilter); // Refresh the list
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to update user');
      }
    } catch (error) {
      message.error('Error updating user');
    }
  };

  const deleteUser = async (email: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, action: 'delete' }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message);
        fetchUsers(searchTerm, activeFilter);
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to delete user');
      }
    } catch (error) {
      message.error('Error deleting user');
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    fetchUsers(searchTerm, filter);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchUsers(value, activeFilter);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'red';
      case 'admin': return 'purple';
      default: return 'blue';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <CrownOutlined />;
      case 'admin': return <CrownOutlined />;
      default: return <UserOutlined />;
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (email: string) => (
        <div className="min-w-0">
          <div className="font-medium text-sm break-all">{email}</div>
          {users.find(u => u.email === email)?.name && (
            <div className="text-xs text-gray-500 truncate">
              {users.find(u => u.email === email)?.name}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (username: string | null) => (
        <span className="text-sm break-all">{username || 'N/A'}</span>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => (
        <Tag color={getRoleColor(role)} icon={getRoleIcon(role)} className="text-xs">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: any, record: User) => (
        <Space direction="vertical" size={[0, 2]}>
          <Tag color={record.isApproved ? 'green' : 'orange'} className="text-xs">
            {record.isApproved ? 'Approved' : 'Pending'}
          </Tag>
          {record.isBanned && (
            <Tag color="red" className="text-xs">Banned</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Dates',
      key: 'dates',
      width: 140,
      render: (_: any, record: User) => (
        <div className="text-xs">
          <div className="break-words">Joined: {new Date(record.createdAt).toLocaleDateString()}</div>
          {record.approvedAt && (
            <div className="text-green-600 break-words">
              Approved: {new Date(record.approvedAt).toLocaleDateString()}
            </div>
          )}
          {record.bannedAt && (
            <div className="text-red-600 break-words">
              Banned: {new Date(record.bannedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: User) => {
        const menuItems = [];

        // Approval actions
        if (!record.isApproved) {
          menuItems.push({
            key: 'approve',
            label: 'Approve',
            icon: <CheckOutlined />,
            onClick: () => updateUser(record.email, 'approve'),
          });
        } else if (record.isApproved && record.role !== 'owner') {
          menuItems.push({
            key: 'unapprove',
            label: 'Unapprove',
            icon: <CloseOutlined />,
            onClick: () => updateUser(record.email, 'unapprove'),
          });
        }

        // Ban actions
        if (!record.isBanned && record.role !== 'owner') {
          menuItems.push({
            key: 'ban',
            label: 'Ban',
            icon: <StopOutlined />,
            danger: true,
            onClick: () => updateUser(record.email, 'ban'),
          });
        } else if (record.isBanned) {
          menuItems.push({
            key: 'unban',
            label: 'Unban',
            icon: <PlayCircleOutlined />,
            onClick: () => updateUser(record.email, 'unban'),
          });
        }

        // Role actions
        if (record.role !== 'owner') {
          menuItems.push({
            key: 'role-user',
            label: 'Set Role: User',
            icon: <UserOutlined />,
            onClick: () => updateUser(record.email, 'setRole', 'user'),
          });
          menuItems.push({
            key: 'role-admin',
            label: 'Set Role: Admin',
            icon: <CrownOutlined />,
            onClick: () => updateUser(record.email, 'setRole', 'admin'),
          });
        }

        // Delete action (only for non-owners)
        if (record.role !== 'owner') {
          menuItems.push({
            type: 'divider' as const,
          });
          menuItems.push({
            key: 'delete',
            label: 'Delete User',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              if (window.confirm(`Are you sure you want to delete ${record.email}? This action cannot be undone.`)) {
                deleteUser(record.email);
              }
            },
          });
        }

        const menu = <Menu items={menuItems} />;

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button size="small" icon={<MoreOutlined />}>
              Actions
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button icon={<ArrowLeftOutlined />} type="text" size="small">
                  Back to Admin
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <UserOutlined className="text-chili-red text-xl" />
                <Title level={2} className="mb-0 text-lg md:text-2xl text-chili-red">User Management</Title>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => fetchUsers(searchTerm, activeFilter)}
                loading={loading}
                size="small"
              >
                Refresh
              </Button>
              
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
                <Button type="primary" className="bg-chili-red hover:bg-red-700 border-chili-red hover:border-red-700" size="small">
                  Admin Sections <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md">
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => handleSearch(searchTerm)}
              allowClear
              size="small"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              activeFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('all')}
            size="small"
          >
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-xs md:text-sm text-gray-600">Total</div>
            </div>
          </Card>
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              activeFilter === 'approved' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('approved')}
            size="small"
          >
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-green-600">
                {users.filter(u => u.isApproved).length}
              </div>
              <div className="text-xs md:text-sm text-gray-600">Approved</div>
            </div>
          </Card>
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              activeFilter === 'pending' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('pending')}
            size="small"
          >
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-orange-600">
                {users.filter(u => !u.isApproved).length}
              </div>
              <div className="text-xs md:text-sm text-gray-600">Pending</div>
            </div>
          </Card>
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              activeFilter === 'banned' ? 'ring-2 ring-red-500 bg-red-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('banned')}
            size="small"
          >
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold text-red-600">
                {users.filter(u => u.isBanned).length}
              </div>
              <div className="text-xs md:text-sm text-gray-600">Banned</div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            size="small"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: false,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} users`,
              pageSizeOptions: ['10', '20', '50', '100'],
              simple: true
            }}
            scroll={{ x: 800 }}
            className="mobile-table"
          />
        </Card>
      </div>
    </div>
  );
}