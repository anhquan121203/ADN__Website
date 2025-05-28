import React from 'react';
import { Input, Button, Space, Form, Row, Col, Select } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

const Search = ({ onSearch, currentParams }) => {
  const [form] = Form.useForm();

  const handleSearch = (values) => {
    const cleanedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        if (value === '') return [key, undefined];
        return [key, value];
      })
    );
    onSearch({
      ...cleanedValues,
      is_deleted: cleanedValues.is_deleted ?? false,
      sort_by: cleanedValues.sort_by || 'created_at',
      sort_order: cleanedValues.sort_order || 'desc'
    });
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({
      is_deleted: false,
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  };

  return (
    <Form
      form={form}
      onFinish={handleSearch}
      initialValues={{
        is_deleted: false,
        sort_by: 'created_at',
        sort_order: 'desc'
      }}
      className="bg-white p-4 mb-4 w-full max-w-[1200px] mx-auto"
    >
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item name="keyword" className="mb-0">
            <Input placeholder="Search by name or description..." />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item name="sort_by" className="mb-0">
            <Select placeholder="Sort by">
              <Option value="name">Name</Option>
              <Option value="created_at">Created Date</Option>
              <Option value="updated_at">Updated Date</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item name="sort_order" className="mb-0">
            <Select placeholder="Sort order">
              <Option value="asc">Ascending</Option>
              <Option value="desc">Descending</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item name="is_deleted" className="mb-0">
            <Select placeholder="Status">
              <Option value={false}>Active</Option>
              <Option value={true}>Deleted</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={24}>
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
        </Col>
      </Row>
    </Form>
  );
};

export default Search;