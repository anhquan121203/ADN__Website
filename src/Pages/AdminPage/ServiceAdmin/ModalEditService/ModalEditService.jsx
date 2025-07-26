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
import dayjs from "dayjs";
import useService from "../../../../Hooks/useService";
import { FaPlus } from "react-icons/fa";

const ModalEditService = ({
  isModalOpen,
  handleCancel,
  handleEdit,
  editService,
}) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { services, searchListService } = useService();

  useEffect(() => {
    if (editService) {
      form.setFieldsValue({
        ...editService,

        parent_service_id:
          typeof editService.parent_service_id === "object"
            ? editService.parent_service_id?._id
            : editService.parent_service_id ?? null,
      });

      setPreviewImage(editService.image_url || null);
      setSelectedFile(null);

      searchListService({
        is_active: true,
        pageNum: 1,
        pageSize: 10,
        sort_by: "created_at",
        sort_order: "desc",
      });
    }
  }, [isModalOpen, editService]);

  const handleUploadImage = ({ file }) => {
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      values.price = Number(values.price);
      values.estimated_time = Number(values.estimated_time);

      Object.keys(values).forEach((key) => {
        const value = values[key];

        //nếu là parent_service_id null -> undefined
        if (
          key === "parent_service_id" &&
          (value === null || value === undefined)
        ) {
          return;
        }

        if (key !== "service_image") {
          formData.append(key, value);
        }
      });

      if (selectedFile) {
        formData.append("service_image", selectedFile);
      } else if (editService?.service_image) {
        formData.append("service_image", editService.service_image);
      }

      const response = await handleEdit(formData);

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Cập nhật dịch vụ thành công");
      } else {
        toast.error(response.message || "Cập nhật dịch vụ không thành công!");
      }
    } catch (error) {
      toast.error("Cập nhật dịch vụ không thành công!");
    }
  };

  return (
    <Modal
      title="Chỉnh sửa dịch vụ"
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

        <Form.Item label="Hình ảnh">
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                marginBottom: 10,
              }}
            />
          )}
          <Upload
            beforeUpload={() => false}
            showUploadList={false}
            accept="image/*"
            onChange={handleUploadImage}
          >
            <Button icon={<FaPlus />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditService;
