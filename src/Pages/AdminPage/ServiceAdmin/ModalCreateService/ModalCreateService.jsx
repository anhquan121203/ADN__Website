import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useService from "../../../../Hooks/useService";

const ModalCreateService = ({ isModalOpen, handleCancel, handleAdd }) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const { services, searchListService } = useService();

  useEffect(() => {
    searchListService({
      is_active: true,
      pageNum: 1,
      pageSize: 10,
      sort_by: "created_at",
      sort_order: "desc",
    });
  });

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      setSelectedFile(null);
    }
  }, [isModalOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await handleAdd(values);

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Tạo thiết bị mới thành công");
      } else {
        toast.error(response.message || "Tạo thiết bị mới không thành công!");
      }
    } catch (error) {
      toast.error("Tạo thiết bị mới không thành công!");
    }
  };

  return (
    <Modal
      title="Tạo tài khoản mới"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Tạo tài khoản
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng mô tả thiết bị!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Dịch vụ cha" name="parent_service_id">
          <Select placeholder="Chọn dịch vụ cha">
            {services
              ?.filter((service) => !service.parent_service_id)
              .map((service) => (
                <Select.Option key={service._id} value={service._id}>
                  {service.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá tiền"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Loại"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn loại">
            <Select.Option value="civil">Dân sự</Select.Option>
            <Select.Option value="administrative">Hành chính</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Phương thức"
          name="sample_method"
          rules={[{ required: true, message: "Vui lòng chọn phương thức!" }]}
        >
          <Select placeholder="Chọn phương thức">
            <Select.Option value="self_collected">Tự thu hồi</Select.Option>
            <Select.Option value="facility_collected">
              Cơ sở thu hồi
            </Select.Option>
            <Select.Option value="home_collected">
              Thu hồi tại nhà
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Thời gian"
          name="estimated_time"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian ước tính!" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateService;
