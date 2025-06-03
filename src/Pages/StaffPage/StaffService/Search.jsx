import React from 'react';
import { Input, Select, Button, Space, Form, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

const Search = ({ onSearch }) => {
  const [form] = Form.useForm();

  const handleSearch = (values) => {
    const cleanedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        if (value === '') return [key, undefined];
        return [key, value];
      })
    );
    onSearch(cleanedValues);
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({ is_active: true });
    onSearch({ is_active: true });
  };

  return (
    <Form
      form={form}
      onFinish={handleSearch}
      initialValues={{ is_active: true }}
      className="bg-white p-4 mb-4 w-full max-w-[1200px] mx-auto"
    >
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item name="type" className="mb-0">
            <Select placeholder="Loại dịch vụ" allowClear>
              <Option value="civil">Dân sự</Option>
              <Option value="administrative">Hành chính</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="sample_method" className="mb-0">
            <Select placeholder="Phương thức lấy mẫu" allowClear>
              <Option value="self_collected">Tự lấy mẫu</Option>
              <Option value="facility_collected">Lấy tại cơ sở</Option>
              <Option value="home_collected">Lấy tại nhà</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="is_active" className="mb-0">
            <Select placeholder="Trạng thái">
              <Option value={true}>Đang hoạt động</Option>
              <Option value={false}>Ngừng hoạt động</Option>
              <Option value="">Tất cả</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="keyword" className="mb-0">
            <Input placeholder="Tìm kiếm theo..." />
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="min_price" className="mb-0">
            <Input placeholder="Giá tối thiểu..." />
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="max_price" className="mb-0">
            <Input placeholder="Giá tối đa..." />
          </Form.Item>
        </Col>
      </Row>
      <div className="flex justify-end">
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
              >
                Đặt lại
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button>
            </Space>
          </div>
    </Form>
  );
};

export default Search;