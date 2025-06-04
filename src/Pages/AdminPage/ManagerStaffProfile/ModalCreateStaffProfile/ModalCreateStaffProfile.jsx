import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  TimePicker,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAdmin from "../../../../Hooks/useAdmin";
import useDepartment from "../../../../Hooks/useDepartment";

const ModalCreateStaffProfile = ({ isModalOpen, handleCancel, handleAdd }) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const { accounts, searchUserPag } = useAdmin();
  const { departments, searchListDepartment } = useDepartment();

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      setSelectedFile(null);
      //   list staff
      searchUserPag({
        pageInfo: {
          pageNum: 1,
          pageSize: 100,
        },
        searchCondition: {
          role: ["staff", "laboratory_technician"],
          is_verified: true,
          status: true,
          is_deleted: false,
        },
      });

      //   list department
      searchListDepartment({
        is_deleted: false,
        is_active: true,
        pageNum: 1,
        pageSize: 100,
        sort_by: "created_at",
        sort_order: "desc",
      });
    }
  }, [isModalOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Ép chắc chắn về string, phòng trường hợp không phải string (nhưng thường không cần)
      values.user_id = String(values.user_id);
      values.department_id = String(values.department_id);

      const response = await handleAdd(values);

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Tạo hồ sơ nhân viên mới thành công");
      } else {
        toast.error(
          response.message || "Tạo hồ sơ nhân viên mới không thành công!"
        );
      }
    } catch (error) {
      toast.error("Tạo hồ sơ nhân viên mới không thành công!");
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
          label="Nhân viên"
          name="user_id"
          rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
        >
          <Select placeholder="Chọn nhân viên">
            {accounts?.map((staff) => (
              <Select.Option key={staff._id} value={String(staff._id)}>
                {`${staff.first_name} ${staff.last_name}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Phòng ban"
          name="department_id"
          rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}
        >
          <Select placeholder="Chọn phòng ban">
            {departments?.map((depart) => (
              <Select.Option key={depart._id} value={String(depart._id)}>
                {depart.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Công việc"
          name="job_title"
          rules={[{ required: true, message: "Vui lòng viết công việc!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tiền"
          name="salary"
          rules={[{ required: true, message: "Vui lòng chọn tiền!" }]}
        >
          <InputNumber />
        </Form.Item>

        {/* Chọn ngày */}
        <Form.Item
          label="Ngày"
          name="hire_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
        >
          <DatePicker />
        </Form.Item>

        {/* list chứng chỉ */}
        <Form.List name="qualifications">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: 16,
                    border: "1px solid #ccc",
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <Form.Item
                    {...restField}
                    label="Tên chứng chỉ"
                    name={[name, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên chứng chỉ!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Tổ chức cấp"
                    name={[name, "institution"]}
                    rules={[
                      { required: true, message: "Vui lòng nhập tổ chức cấp!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Ngày cấp"
                    name={[name, "issue_date"]}
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày cấp!" },
                    ]}
                  >
                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Ngày hết hạn"
                    name={[name, "expiry_date"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày hết hạn!",
                      },
                    ]}
                  >
                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Mô tả"
                    name={[name, "description"]}
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>
                  <Button onClick={() => remove(name)} danger>
                    Xóa
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Thêm chứng chỉ
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ModalCreateStaffProfile;
