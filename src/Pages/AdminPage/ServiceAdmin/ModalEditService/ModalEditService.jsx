import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const ModalEditService = ({
  isModalOpen,
  handleCancel,
  handleEdit,
  editService,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editService) {
      form.setFieldsValue({
        ...editService,
      });
    }
  }, [isModalOpen, editService]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await handleEdit(values);
      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Cập nhật tài khoản thành công");
      } else {
        toast.error(response.message || "Cập nhật tài khoản không thành công!");
      }
    } catch (error) {
      toast.error("Cập nhật tài khoản không thành công!");
    }
  };

  return (
    <Modal
      title="Chỉnh sửa tài khoản"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Cập nhật
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical">

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

export default ModalEditService;
