import React, { useState } from "react";
import { Modal, Select, Input, Button, Form, Space, message, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import useSample from "../../../../Hooks/useSample";

const sampleTypeOptions = [
  { label: "Máu", value: "blood" },
  { label: "Nước bọt", value: "saliva" },
  { label: "Tóc", value: "hair" },
  { label: "Khác", value: "other" }
];

const ModalRequestKitAdmin = ({ open, onClose, appointment, onSuccess }) => {
  const { collectSample, loading } = useSample();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const payload = {
        appointment_id: appointment,
        type: values.type,
        // person_info: values.person_info
      };

      setSubmitting(true);
      const res = await collectSample(appointment, values.type);
      
      if (res.success) {
        message.success("Thu thập mẫu tại cơ sở thành công!");
        form.resetFields();
        onClose();
        if (onSuccess) onSuccess();
      } else {
        message.error(res.error || "Có lỗi xảy ra khi thu thập mẫu");
      }
    } catch (error) {
      message.error("Vui lòng kiểm tra lại thông tin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title="Thu thập mẫu hành chính tại cơ sở"
      onOk={handleSubmit}
      okText="Thu thập mẫu"
      cancelText="Hủy"
      confirmLoading={submitting || loading}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Loại mẫu"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại mẫu" }]}
        >
          <Select
            mode="multiple"
            options={sampleTypeOptions}
            placeholder="Chọn loại mẫu"
          />
        </Form.Item>

        {/* <Form.List
          name="person_info"
          rules={[
            {
              validator: async (_, person_info) => {
                if (!person_info || person_info.length < 1) {
                  return Promise.reject(new Error('Cần ít nhất một thông tin người'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4>Thông tin người</h4>
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  icon={<PlusOutlined />}
                >
                  Thêm người
                </Button>
              </div>

              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ 
                  marginBottom: 24, 
                  padding: 16, 
                  border: '1px solid #f0f0f0', 
                  borderRadius: 8,
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h5>Người thứ {name + 1}</h5>
                    {fields.length > 1 && (
                      <Button 
                        type="text" 
                        icon={<MinusCircleOutlined />} 
                        onClick={() => remove(name)}
                        danger
                      >
                        Xóa
                      </Button>
                    )}
                  </div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                      >
                        <Input placeholder="Nhập họ và tên" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'dob']}
                        label="Ngày sinh"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                      >
                        <Input type="date" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'relationship']}
                        label="Mối quan hệ"
                        rules={[{ required: true, message: 'Vui lòng nhập mối quan hệ' }]}
                      >
                        <Input placeholder="Ví dụ: Bản thân, Con, Cha, Mẹ..." />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'gender']}
                        label="Giới tính"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                      >
                        <Select placeholder="Chọn giới tính">
                          <Select.Option value="Male">Nam</Select.Option>
                          <Select.Option value="Female">Nữ</Select.Option>
                          <Select.Option value="Other">Khác</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'phone_number']}
                        label="Số điện thoại"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số điện thoại' },
                          { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="Nhập số điện thoại" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'birth_place']}
                        label="Nơi sinh"
                        rules={[{ required: true, message: 'Vui lòng nhập nơi sinh' }]}
                      >
                        <Input placeholder="Nhập nơi sinh" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'nationality']}
                        label="Quốc tịch"
                        rules={[{ required: true, message: 'Vui lòng nhập quốc tịch' }]}
                      >
                        <Input placeholder="Nhập quốc tịch" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'identity_document']}
                        label="Số CMND/CCCD"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số CMND/CCCD' },
                          { pattern: /^[0-9]{9,12}$/, message: 'Số CMND/CCCD không hợp lệ' }
                        ]}
                      >
                        <Input placeholder="Nhập số CMND/CCCD" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}

              <Form.ErrorList errors={errors} />
            </>
          )}
        </Form.List> */}
      </Form>
    </Modal>
  );
};

export default ModalRequestKitAdmin;
