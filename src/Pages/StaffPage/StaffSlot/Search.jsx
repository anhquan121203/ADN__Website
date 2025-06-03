import React from 'react';
import { Form, Select, DatePicker, Button, Row, Col, Space, InputNumber } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Search = ({ onSearch }) => {
  const [form] = Form.useForm();

  const handleSearch = (values) => {
    const searchParams = {
      status: values.status,
      appointment_limit: values.appointment_limit,
      date_range: values.date_range && [
        values.date_range[0]?.format('YYYY-MM-DD'),
        values.date_range[1]?.format('YYYY-MM-DD')
      ],
      staff_email: values.staff_email,
      employee_id: values.employee_id,
      department_id: values.department_id,
      sort_by: values.sort_by || 'created_at',
      sort_order: values.sort_order || 'desc'
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
      initialValues={{
        sort_by: 'created_at',
        sort_order: 'desc'
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="available">Có sẵn</Select.Option>
              <Select.Option value="booked">Đã đặt</Select.Option>
              <Select.Option value="unavailable">Không khả dụng</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="appointment_limit" label="Giới hạn lịch hẹn">
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập giới hạn" />
          </Form.Item>
        </Col>

        {/* <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="staff_email" label="Email nhân viên">
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn email nhân viên"
              style={{ width: '100%' }}
            >
              <Select.Option value="staff@gmail.com">staff@gmail.com</Select.Option>
              <Select.Option value="hdk18112003@gmail.com">hdk18112003@gmail.com</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="employee_id" label="Mã nhân viên">
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn mã nhân viên"
              style={{ width: '100%' }}
            >
              <Select.Option value="EMP25001">EMP25001</Select.Option>
              <Select.Option value="EMP25002">EMP25002</Select.Option>
            </Select>
          </Form.Item>
        </Col> */}

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="date_range" label="Khoảng ngày">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="sort_by" label="Sắp xếp theo">
            <Select placeholder="Sắp xếp theo">
              <Select.Option value="created_at">Ngày tạo</Select.Option>
              <Select.Option value="updated_at">Ngày cập nhật</Select.Option>
              <Select.Option value="appointment_limit">Giới hạn lịch hẹn</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="sort_order" label="Thứ tự">
            <Select placeholder="Thứ tự">
              <Select.Option value="asc">Tăng dần</Select.Option>
              <Select.Option value="desc">Giảm dần</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <div className="flex justify-end">
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Đặt lại
              </Button>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                Tìm kiếm
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default Search;