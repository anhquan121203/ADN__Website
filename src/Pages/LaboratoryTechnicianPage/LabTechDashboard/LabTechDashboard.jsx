import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert, Progress } from 'antd';
import { 
  ExperimentOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined 
} from '@ant-design/icons';
import useDashboard from '../../../Hooks/useDashboard';

const LabTechDashboard = () => {
  const { labTechSummary, loading, error, listDashboardLabTechSummary } = useDashboard();

  useEffect(() => {
    listDashboardLabTechSummary();
  }, [listDashboardLabTechSummary]);

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

  const totalAssigned = labTechSummary.total_assigned || 0;
  const testing = labTechSummary.testing || 0;
  const completed = labTechSummary.completed || 0;
  
  const completedPercentage = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;
  const testingPercentage = totalAssigned > 0 ? Math.round((testing / totalAssigned) * 100) : 0;

  const stats = [
    {
      title: 'Tổng số mẫu được phân công',
      value: totalAssigned,
      icon: <ExperimentOutlined className="text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
      valueColor: 'text-purple-600'
    },
    {
      title: 'Mẫu đang xét nghiệm',
      value: testing,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: 'bg-orange-50 border-orange-200',
      valueColor: 'text-orange-600'
    },
    {
      title: 'Mẫu đã hoàn thành',
      value: completed,
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
          Bảng điều khiển kỹ thuật viên xét nghiệm
        </h1>
        <p className="text-gray-600">
          Theo dõi tiến độ xét nghiệm và quản lý mẫu bệnh phẩm.
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
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

      {/* Progress Overview */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} lg={12}>
          <Card title="Tiến độ hoàn thành" className="h-full">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Hoàn thành</span>
                  <span className="font-semibold text-green-600">{completedPercentage}%</span>
                </div>
                <Progress 
                  percent={completedPercentage} 
                  strokeColor="#10b981"
                  showInfo={false}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {completed} trên {totalAssigned} mẫu đã hoàn thành
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Đang xét nghiệm</span>
                  <span className="font-semibold text-orange-600">{testingPercentage}%</span>
                </div>
                <Progress 
                  percent={testingPercentage} 
                  strokeColor="#f59e0b"
                  showInfo={false}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {testing} mẫu đang trong quá trình xét nghiệm
                </p>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Tổng quan công việc" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ExperimentOutlined className="text-purple-600 text-xl" />
                  <span className="font-medium">Tổng mẫu</span>
                </div>
                <span className="text-xl font-bold text-purple-600">{totalAssigned}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ClockCircleOutlined className="text-orange-600 text-xl" />
                  <span className="font-medium">Đang xử lý</span>
                </div>
                <span className="text-xl font-bold text-orange-600">{testing}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircleOutlined className="text-green-600 text-xl" />
                  <span className="font-medium">Hoàn thành</span>
                </div>
                <span className="text-xl font-bold text-green-600">{completed}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Welcome Card */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 border-0">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Phòng xét nghiệm hiện đại</h2>
              <p className="text-purple-100 mb-6">
                Hệ thống quản lý mẫu xét nghiệm giúp bạn theo dõi tiến độ, quản lý quy trình và đảm bảo chất lượng kết quả.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <ExperimentOutlined className="text-2xl mb-2" />
                  <h3 className="font-semibold mb-1 text-purple-900">Quản lý mẫu</h3>
                  <p className="text-sm text-purple-900">
                    Theo dõi và quản lý tất cả mẫu bệnh phẩm
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <BulbOutlined className="text-2xl mb-2" />
                  <h3 className="font-semibold mb-1 text-purple-900">Quy trình xét nghiệm</h3>
                  <p className="text-sm text-purple-900">
                    Thực hiện quy trình xét nghiệm chuẩn
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <CheckCircleOutlined className="text-2xl mb-2" />
                  <h3 className="font-semibold mb-1 text-purple-900">Báo cáo kết quả</h3>
                  <p className="text-sm text-purple-900">
                    Xuất báo cáo kết quả xét nghiệm chi tiết
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

export default LabTechDashboard;
