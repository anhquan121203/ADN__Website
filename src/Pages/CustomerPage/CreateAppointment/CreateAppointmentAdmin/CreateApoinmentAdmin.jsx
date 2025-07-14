import React, { use, useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import useSlot from '../../../../Hooks/useSlot';
import useService from '../../../../Hooks/useService';
import useApp from 'antd/es/app/useApp';
import useAppointment from '../../../../Hooks/useAppoinment';

const { Option } = Select;

const CreateAppointmentAdmin = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const { slots, fetchAvailableSlots } = useSlot();
  const { services, searchListService } = useService();
  const { createAppointment } = useAppointment();
  const [availableSlots, setAvailableSlots] = useState([]);

  const [range, setRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  ]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    searchListService({
      is_active: true,
      pageNum: 1,
      pageSize: 100,
      sort_by: "created_at",
      sort_order: "desc",
    });
  }, []);

  useEffect(() => {
    const getSlots = async () => {
      if (startDate && endDate) {
        const result = await fetchAvailableSlots({
          start_date: startDate,
          end_date: endDate
        });
        if (result.success && result.data?.data?.pageData) {
          const slots = result.data.data.pageData;
          setAvailableSlots(slots);
        }
      }
    };
    getSlots();
  }, [startDate, endDate]);

  const administrativeServices = services?.filter(service => service.type === 'administrative');
  const serviceId = administrativeServices?.length > 0 ? administrativeServices[0]._id : null;


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Lấy ngày hiện tại theo real time
      const currentDate = new Date().toISOString().split('T')[0];

      await createAppointment({
        service_id: serviceId,
        ...(selectedSlot && { slot_id: selectedSlot }),
        appointment_date: currentDate,
        type: "facility",
        collection_address: type === 'home'
      });
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Tạo lịch hẹn xét nghiệm"
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Tạo lịch"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        name="createAppointmentForm"
        initialValues={{
          type: 'self',
        }}
      >
        <Form.Item
          name="service_id"
          label="Service ID"
          rules={[{ required: true, message: 'Vui lòng nhập Service ID' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="slot_id"
          label="Slot ID"
          rules={[{ required: true, message: 'Vui lòng nhập Slot ID' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="type"
          label="Loại lấy mẫu"
          rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
        >
          <Select>
            <Option value="self">Tự lấy mẫu</Option>
            <Option value="facility">Tại cơ sở</Option>
            <Option value="home">Tại nhà</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="collection_address"
          label="Địa chỉ lấy mẫu"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ lấy mẫu' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="case_number"
          label="Mã hồ sơ (case number)"
          rules={[
            {
              pattern: /^AC-\d{8}-\d{4}$/,
              message: 'Định dạng phải là AC-YYYYMMDD-XXXX',
            },
          ]}
        >
          <Input placeholder="VD: AC-20240711-0001" />
        </Form.Item>

        <Form.Item
          name="authorization_code"
          label="Mã ủy quyền (authorization code)"
          rules={[
            {
              pattern: /^AUTH-[A-Z0-9]{6}$/,
              message: 'Định dạng phải là AUTH-XXXXXX',
            },
          ]}
        >
          <Input placeholder="VD: AUTH-1A2B3C" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAppointmentAdmin;
