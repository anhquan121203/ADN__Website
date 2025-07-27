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
import useCase from "../../../../Hooks/useCase";

const ModalCreateService = ({ isModalOpen, handleCancel, handleAdd }) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const { cases, searchListCase } = useCase();

  const type = Form.useWatch("type", form);

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      setSelectedFile(null);
      searchListCase({
        is_deleted: false,
      });
    }
  }, [isModalOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await handleAdd(values);

      if (response.success === true) {
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      toast.error("Tạo dụng cụ y tế mới không thành công!");
    }
  };

  return (
    <Modal
      title="Tạo dụng cụ y tế mới"
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
          label="Cơ quan thẩm quyền"
          name="agency_authority"
          rules={[
            { required: true, message: "Vui lòng chọn cơ quan thẩm quyền!" },
          ]}
        >
          <Select placeholder="Chọn cơ quan">
            <Select.Option value="Tòa án nhân dân TP.HCM">
              Tòa án nhân dân TP.HCM
            </Select.Option>
            <Select.Option value="Viện kiểm sát nhân dân tối cao">
              Viện kiểm sát nhân dân tối cao
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Loại"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn loại">
            <Select.Option value="regular">Dụng cụ dân sự</Select.Option>
            <Select.Option value="administrative">
              Dụng cụ pháp lý
            </Select.Option>
          </Select>
        </Form.Item>

        {type === "administrative" && (
          <Form.Item
            label="Chọn hồ sơ"
            name="administrative_case_id"
            rules={[{ required: true, message: "Vui lòng chọn hồ sơ!" }]}
          >
            <Select placeholder="Chọn hồ sơ">
              {cases
                ?.filter((caseAdmin) => caseAdmin.status === "approved")
                .map((caseAdmin) => (
                  <Select.Option key={caseAdmin._id} value={caseAdmin._id}>
                    {caseAdmin.case_number}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateService;
