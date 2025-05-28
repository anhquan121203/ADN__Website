import React from 'react';
import { Form, Select, DatePicker, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const Search = ({ onSearch }) => {
  const [form] = Form.useForm();

  const handleSearch = (values) => {
    const { date_range, ...rest } = values;
    const searchParams = {
      ...rest,
      date_from: date_range?.[0]?.format('YYYY-MM-DD'),
      date_to: date_range?.[1]?.format('YYYY-MM-DD'),
    };
    onSearch(searchParams);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <Form
      form={form}
      onFinish={handleSearch}
      className="bg-white p-4 mb-4 rounded shadow-sm w-full max-w-[1200px] mx-auto"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="status">
            <Select placeholder="Select status">
              <Select.Option value="available">Available</Select.Option>
              <Select.Option value="booked">Booked</Select.Option>
              <Select.Option value="unavailable">Unavailable</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="pattern">
            <Select placeholder="Select pattern">
              <Select.Option value="daily">Daily</Select.Option>
              <Select.Option value="weekly">Weekly</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={16} lg={12}>
          <Form.Item name="date_range">
            <RangePicker 
              style={{ width: '100%' }}
              placeholder={['Start Date', 'End Date']}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <div className="flex justify-end">
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Reset
              </Button>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
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