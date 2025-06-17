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
  };  return (    
    <Card 
      title={
        <span className="text-base text-gray-800">
          Tìm kiếm và lọc
        </span>
      }
      className="w-full"
      bodyStyle={{ padding: '16px' }}
    >        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="w-full"
        >          
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[250px]">
              <Form.Item name="search_term" label="Tên khách hàng" className="mb-0">
                <Input placeholder="Nhập tên khách hàng" className="w-full" />
              </Form.Item>
            </div>

            <div className="flex-1 min-w-[250px]">
              <Form.Item name="status" label="Trạng thái" className="mb-0">
                <Select placeholder="Chọn trạng thái" allowClear className="w-full">
                  <Select.Option value="PENDING">Đang chờ</Select.Option>
                  <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
                  <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
                  <Select.Option value="CANCELLED">Đã hủy</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="flex-1 min-w-[250px]">
              <Form.Item name="type" label="Loại" className="mb-0">
                <Select placeholder="Chọn loại" allowClear className="w-full">
                  <Select.Option value="facility">Tại phòng khám</Select.Option>
                  <Select.Option value="home">Tại nhà</Select.Option>
                  <Select.Option value="self">Tự lấy mẫu</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="flex-1 min-w-[250px]">
              <Form.Item name="date" label="Khoảng thời gian" className="mb-0">
                <DatePicker.RangePicker format="DD/MM/YYYY" className="w-full" />
              </Form.Item>
            </div>
          </div>

          <Form.Item className="mb-0 mt-4">
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
                  className="bg-[#00a9a4] hover:bg-[#1c6b68]"
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
