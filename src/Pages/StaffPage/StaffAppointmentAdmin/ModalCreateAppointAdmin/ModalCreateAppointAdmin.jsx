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
import useStaffProfile from "../../../../Hooks/useStaffProfile";
import useAppointment from "../../../../Hooks/useAppoinment";
import useAuth from "../../../../Hooks/useAuth";

import { AutoComplete } from "antd";
import debounce from "lodash.debounce";
import useAppointmentAdmin from "../../../../Hooks/useAppointmentAdmin";

const ModalCreateAppointAdmin = ({ isModalOpen, handleCancel, handleAdd, caseId }) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const { services, searchListService } = useService();
  const { availableLabTechs, getAvailableLabTechs } = useAppointment();

  const [searchOptions, setSearchOptions] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  const { searchListCustomer } = useAppointmentAdmin();

  const { firstName, lastName, userId } = useAuth();

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      setSelectedFile(null);
      getAvailableLabTechs();
      searchListService({
        is_active: true,
        pageNum: 1,
        pageSize: 10,
        sort_by: "created_at",
        sort_order: "desc",
      });
    }

    if (caseId) {
        form.setFieldsValue({ caseId }); 
      }
  }, [isModalOpen]);

  // Debounce tìm kiếm người dùng
  const handleSearchCustomer = debounce(async (value) => {
    if (!value) return;
    const result = await searchListCustomer({ searchTerm: value });
    if (result.success) {
      const customer = result.message?.data;
      if (customer?._id) {
        setCustomerId(customer._id);
        setSearchOptions([
            {
              value: customer.email || customer.phone_number.toString(),
              label: `${customer.first_name} ${customer.last_name} (${customer.email})`,
              customerId: customer._id,
            },
          ]);
          
      } else {
        setCustomerId(null);
        setSearchOptions([]);
      }
    }
  }, 500);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("🚀 Form Values:", values);

      const response = await handleAdd(values);

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Tạo đặt lịch hồ sơ thành công");
      }
    } catch (error) {
      toast.error("Tạo đặt lịch không thành công!");
    }
  };

  return (
    <Modal
      title="Tạo đặt lịch hành chính"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Tạo đặt lịch
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã hồ sơ hành chính"
          name="caseId"
          rules={[{ required: true, message: "Vui lòng nhập Service ID" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Dịch vụ"
          name="service_id"
          rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
        >
          <Select placeholder="Chọn dịch vụ">
            {services
              ?.filter(
                (service) =>
                  (!service.parent_service_id ||
                    !service.parent_service_id._id) &&
                  service.type === "administrative"
              )
              .map((service) => (
                <Select.Option key={service._id} value={service._id}>
                  {service.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="Tìm người dùng (email hoặc số điện thoại)">
          <AutoComplete
            onSearch={handleSearchCustomer}
            options={searchOptions}
            onSelect={(value, option) => {
                form.setFieldsValue({ user_id: option.customerId });
              }}
            placeholder="Nhập email hoặc số điện thoại..."
            filterOption={false}
          />
        </Form.Item>

        <Form.Item
          name="user_id"
        />

        <Form.Item
          label="Địa chỉ thu mẫu"
          name="collection_address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ thu mẫu" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nhân viên"
          rules={[{ required: true, message: "Vui lòng nhập Staff ID" }]}
        >
          <Input value={`${firstName} ${lastName}`} disabled />
        </Form.Item>

        <Form.Item name="staff_id" initialValue={userId} hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Chọn người xét nghiệm"
          name="laboratory_technician_id"
          rules={[{ required: true, message: "Vui lòng nhập Technician ID" }]}
        >
          <Select
            placeholder="Chọn người xét nghiệm"
            optionFilterProp="children"
          >
            {availableLabTechs?.map((labTech) => (
              <Select.Option key={labTech._id} value={labTech._id.toString()}>
                {`${labTech.first_name || ""} ${labTech.last_name || ""}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateAppointAdmin;
