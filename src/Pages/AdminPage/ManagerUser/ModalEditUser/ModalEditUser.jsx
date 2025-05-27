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

const ModalEditUser = ({
  isModalOpen,
  handleCancel,
  handleEdit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dob: initialValues.dob ? dayjs(initialValues.dob) : null,
      });
    }
    if (!isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const updatedValues = {
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        avatar_url: values.avatar_url,
        dob:
          values.dob && values.dob.format
            ? values.dob.format("YYYY-MM-DD")
            : null,
        address: values.address,
        gender: values.gender,
      };
      const response = await handleEdit(updatedValues);
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
        layout="vertical"
        initialValues={{
          ...initialValues,
          dob: initialValues?.dob ? dayjs(initialValues.dob) : null,
        }}
      >
        <Form.Item
          label="Tên"
          name="first_name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Họ"
          name="last_name"
          rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone_number"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Avatar URL"
          name="avatar_url"
          rules={[{ required: true, message: "Vui lòng nhập avatar URL!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="dob"
          rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
        >
          <DatePicker placeholder="Ngày sinh" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select placeholder="Chọn giới tính">
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
            <Select.Option value="other">Khác</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditUser;
