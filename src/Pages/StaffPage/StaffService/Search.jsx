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
            <Select placeholder="Service Type" allowClear>
              <Option value="civil">Civil</Option>
              <Option value="administrative">Administrative</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="sample_method" className="mb-0">
            <Select placeholder="Sample Method" allowClear>
              <Option value="self_collected">Self Collected</Option>
              <Option value="facility_collected">Facility Collected</Option>
              <Option value="home_collected">Home Collected</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="is_active" className="mb-0">
            <Select placeholder="Status">
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
              <Option value="">All</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="keyword" className="mb-0">
            <Input placeholder="Search by..." />
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="min_price" className="mb-0">
            <Input placeholder="Min price..." />
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="max_price" className="mb-0">
            <Input placeholder="Max price..." />
          </Form.Item>
        </Col>
      </Row>
      <div className="flex justify-end">
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
              >
                Search
              </Button>
            </Space>
          </div>
    </Form>
  );
};

export default Search;