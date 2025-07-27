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
import { FaPlus } from "react-icons/fa";
import useAppointmentAdmin from "../../../../Hooks/useAppointmentAdmin";

const ModalCreateService = ({ isModalOpen, handleCancel, handleAdd }) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const { services, searchListService } = useService();
  const {searchListCustomer} = useAppointmentAdmin();

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      setSelectedFile(null);
      searchListService({
        is_active: true,
        pageNum: 1,
        pageSize: 10,
        sort_by: "created_at",
        sort_order: "desc",
      });
    }
  }, [isModalOpen]);

  const handleUploadImage = ({ file }) => {
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      values.price = Number(values.price);
      values.estimated_time = Number(values.estimated_time);

      // Append all normal fields
      Object.keys(values).forEach((key) => {
        // xử lý ảnh ở dưới
        if (key !== "service_image") {

          if (key === "parent_service_id" && !values[key]) return;
          formData.append(key, values[key]);
        }
      });

      // Append image file nếu có
      if (selectedFile) {
        formData.append("service_image", selectedFile);
      }

      const response = await handleAdd(formData);

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Tạo thiết bị mới thành công");
      }
    } catch (error) {
      toast.error("Tạo thiết bị mới không thành công!");
    }
  };

  return (
    <Modal
      title="Tạo dịch vụ mới"
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
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Dịch vụ cha" name="parent_service_id">
          <Select placeholder="Chọn dịch vụ cha">
            {services
              ?.filter(
                (service) =>
                  !service.parent_service_id || !service.parent_service_id._id
              )
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
          rules={[
            { required: true, message: "Vui lòng nhập số giá tiền!" },
            {
              pattern: /^[0-9]+$/,
              message: "Số tiền chỉ được chứa chữ số!",
            },
          ]}
        >
          <Input
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ price: onlyNums });
            }}
          />
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
          label="Thời gian ước tính"
          name="estimated_time"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian ước tính!" },
            {
              pattern: /^[0-9]+$/,
              message: "Thời gian ước tính chỉ được chứa chữ số!",
            },
          ]}
        >
          <Input
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ estimated_time: onlyNums });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Ảnh sản phẩm"
          name="service_image"
          rules={[
            { required: true, message: "Vui lòng tải lên ảnh sản phẩm!" },
          ]}
        >
          <Upload
            beforeUpload={() => false}
            showUploadList={true}
            accept="image/*"
            onChange={handleUploadImage}
          >
            <Button icon={<FaPlus />}> Chọn ảnh </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateService;
