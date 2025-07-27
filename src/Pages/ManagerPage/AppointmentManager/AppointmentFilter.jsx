import { Card, Form, Input, Select, DatePicker, Row, Col, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const AppointmentFilter = ({ onFilter }) => {
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
    const filters = {
      pageNum: 1,
      pageSize: 10
    };
    
    Object.keys(values).forEach(key => {
      if (values[key]) {
        if (key === 'date') {
          if (values[key]?.[0] && values[key]?.[1]) {
            filters.start_date = values[key][0].format('YYYY-MM-DD');
            filters.end_date = values[key][1].format('YYYY-MM-DD');
          }
        } else {
          filters[key] = values[key];
        }
      }
    });
    onFilter(filters);
  };
    const handleReset = () => {
    form.resetFields();
    // Reset all filters including type
    onFilter({
      pageNum: 1,
      pageSize: 10,
      type: undefined,
      status: undefined,
      search_term: undefined,
      start_date: undefined,
      end_date: undefined
    });
  };  
  
  return (    
     <Card className="w-full" bodyStyle={{ padding: 16 }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className='max-w-[1200px] mx-auto'
      >
        <Row gutter={[16, 16]}>
          {/* Tên khách hàng */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="search_term"
              label="Tên khách hàng"
              className="mb-0"
              style={{ width: '100%' }}               // <- thêm đây
            >
              <Input
                placeholder="Nhập tên khách hàng"
                className="w-full"                   // <- và đây
              />
            </Form.Item>
          </Col>

          {/* Trạng thái */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="status"
              label="Trạng thái"
              className="mb-0"
              style={{ width: '100%' }}               // <- thêm đây
            >
              <Select
                placeholder="Chọn trạng thái"
                allowClear
                   // <- và đây
                >
                <Select.Option value="pending">Chờ xác nhận</Select.Option>
                <Select.Option value="confirmed">Đã xác nhận</Select.Option>
                <Select.Option value="sample_assigned">Đã phân mẫu</Select.Option>
                <Select.Option value="sample_collected">Đã thu mẫu</Select.Option>
                <Select.Option value="sample_received">Đã nhận mẫu</Select.Option>
                <Select.Option value="testing">Đang xét nghiệm</Select.Option>
                <Select.Option value="completed">Hoàn thành</Select.Option>
                <Select.Option value="cancelled">Đã hủy</Select.Option>
                <Select.Option value="awaiting_authorization">Chờ phê duyệt</Select.Option>
                <Select.Option value="authorized">Đã phê duyệt</Select.Option>
                <Select.Option value="ready_for_collection">Sẵn sàng trả kết quả</Select.Option>
                </Select>
              </Form.Item>
              </Col>

              {/* Loại */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="type"
              label="Loại"
              className="mb-0"
              style={{ width: '100%' }}               // <- thêm đây
            >
              <Select
                placeholder="Chọn loại"
                allowClear
                className="w-full"                   // <- và đây
              >
                <Select.Option value="facility">Tại phòng khám</Select.Option>
                <Select.Option value="home">Tại nhà</Select.Option>
                <Select.Option value="self">Tự lấy mẫu</Select.Option>
                <Select.Option value="administrative">Hành chính</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Khoảng thời gian */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="date"
              label="Khoảng thời gian"
              className="mb-0"
              style={{ width: '100%' }}               // <- thêm đây
            >
              <DatePicker.RangePicker
                format="DD/MM/YYYY"
                className="w-full"                   // <- và đây
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Buttons */}
        <Form.Item className="mt-4 mb-0">
          <Row justify="end" gutter={12}>
            <Col>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                Đặt lại
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                style={{ background: '#00a9a4', borderColor: '#00a9a4' }}
              >
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AppointmentFilter;
