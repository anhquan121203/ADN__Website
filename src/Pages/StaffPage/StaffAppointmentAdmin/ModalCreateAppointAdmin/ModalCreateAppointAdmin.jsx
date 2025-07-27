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

import useAppointmentAdmin from "../../../../Hooks/useAppointmentAdmin";
import { AutoComplete } from "antd";
import debounce from "lodash.debounce";

const ModalCreateAppointAdmin = ({
  isModalOpen,
  handleCancel,
  handleAdd,
  caseId,
}) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const { services, searchListService } = useService();
  const { availableLabTechs, getAvailableLabTechs } = useAppointment();

  const { searchListCustomer } = useAppointmentAdmin();
  const [userOptions, setUserOptions] = useState([]);
  const [fetching, setFetching] = useState(false);

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

  const handleSearchUser = debounce(async (value) => {
    if (!value) return;

    setFetching(true);
    const result = await searchListCustomer({ searchTerm: value });

    console.log("✅ User Result", result);

    if (result.success && result.message === "Customer found successfully") {
      const user = result.data;

      setUserOptions([
        {
          value: user._id,
          label: `${user.first_name} ${user.last_name} - ${
            user.email || user.phone_number
          }`,
        },
      ]);
    } else {
      setUserOptions([]);
    }
    setFetching(false);
  }, 500);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        user_id: values.user_id.value,
      };

      const response = await handleAdd(payload);

      console.log(response)

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

      {/* Thông tin khách hàng=========================================================== */}
      <Form form={form} layout="vertical">
        <Form.Item
          label="Thông tin khách hàng (email/sđt)"
          name="user_id"
          rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
        >
          <AutoComplete
            options={userOptions}
            onSearch={handleSearchUser}
            placeholder="Nhập email hoặc số điện thoại"
            filterOption={false}
            notFoundContent={fetching ? "Đang tìm..." : "Không tìm thấy"}
            onSelect={(value, option) => {
              form.setFieldsValue({ user_id: option });
            }}
            labelInValue
          />
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

        <Form.Item
          label="Địa chỉ thu mẫu"
          name="collection_address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ thu mẫu" }]}
        >
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
