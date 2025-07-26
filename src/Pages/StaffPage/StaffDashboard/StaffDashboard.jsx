import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import useDashboard from '../../../Hooks/useDashboard';

const StaffDashboard = () => {
  const { staffSummary, loading, error, listDashboardStaffSummary } = useDashboard();

  useEffect(() => {
    listDashboardStaffSummary();
  }, [listDashboardStaffSummary]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải dữ liệu dashboard"
        type="error"
        showIcon
      />
    );
  }

  const stats = [
    {
      title: 'Tổng số lịch hẹn được phân công',
      value: staffSummary.total_assigned || 0,
      icon: <UserOutlined className="text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      valueColor: 'text-blue-600'
    },
    {
      title: 'Lịch hẹn đã hoàn thành',
      value: staffSummary.completed || 0,
      icon: <CheckCircleOutlined className="text-green-600" />,
      color: 'bg-green-50 border-green-200',
      valueColor: 'text-green-600'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bảng điều khiển nhân viên
        </h1>
        <p className="text-gray-600">
          Chào mừng bạn đến với bảng điều khiển. Theo dõi hiệu suất công việc của bạn.
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className={`${stat.color} border hover:shadow-lg transition-shadow duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.valueColor}`}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className="text-4xl opacity-60">
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Welcome Card */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Chào mừng đến với hệ thống quản lý</h2>
              <p className="text-blue-100 mb-6">
                Hệ thống giúp bạn quản lý các lịch hẹn, theo dõi tiến độ công việc và báo cáo hiệu suất một cách hiệu quả.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <CalendarOutlined className="text-2xl mb-2" />
                  <h3 className="font-semibold mb-1 text-blue-900">Quản lý lịch hẹn</h3>
                  <p className="text-sm text-blue-900">
                    Xem và quản lý các lịch hẹn được phân công cho bạn
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <CheckCircleOutlined className="text-2xl mb-2" />
                  <h3 className="font-semibold mb-1 text-blue-900">Theo dõi tiến độ</h3>
                  <p className="text-sm text-blue-900">
                    Cập nhật trạng thái và theo dõi tiến độ hoàn thành công việc
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StaffDashboard;
