import {
    Button,
    Form,
    Image,
    Input,
    InputNumber,
    Modal,
    Select,
    Typography,
  } from "antd";
  import { useEffect } from "react";
  
  const ModalDetailService = ({ isModalOpen, handleCancel, selectedService }) => {
    const [form] = Form.useForm();
  
    useEffect(() => {
      if (selectedService) {
        form.setFieldsValue(selectedService);
      }
    }, [selectedService, form]);
  
    return (
      <Modal
        title="Chi tiết sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        <Form form={form}>
          <Form.Item label="Tên">
            <Typography.Text>{selectedService?.name ?? "N/A"}</Typography.Text>
          </Form.Item>
  
          <Form.Item label="Email">
            <Typography.Text>{selectedService?.description ?? "N/A"}</Typography.Text>
          </Form.Item>
  
          <Form.Item label="Số điện thoại">
            <Typography.Text>
              {selectedService?.phone_number ?? "N/A"}
            </Typography.Text>
          </Form.Item>
  
          <Form.Item label="Giới tính">
            <Typography.Text>{selectedService?.gender ?? "N/A"}</Typography.Text>
          </Form.Item>
  
          <Form.Item label="Vai trò">
            <Typography.Text>{selectedService?.role ?? "N/A"}</Typography.Text>
          </Form.Item>
  
          <Form.Item label="Trạng thái">
            <Typography.Text>
              {selectedService?.status ? "Hoạt động" : "Bị khóa"}
            </Typography.Text>
          </Form.Item>
  
          <Form.Item label="Ảnh đại diện">
            <Image
              style={{ width: 100, height: 100, objectFit: "cover" }}
              src={selectedService?.avatar_url || "https://via.placeholder.com/100"}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  
  export default ModalDetailService;
  