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
import useDepartment from "../../../../Hooks/useDepartment";
import moment from "moment";

const ModalEditStaffProfile = ({
  isModalOpen,
  handleCancel,
  handleEdit,
  editStaffProfile,
}) => {
  const [form] = Form.useForm();
  const { departments, searchListDepartment } = useDepartment();

  useEffect(() => {
    if (isModalOpen) {
      // danh sách phòng ban
      searchListDepartment({
        is_deleted: false,
        is_active: true,
        pageNum: 1,
        pageSize: 100,
        sort_by: "created_at",
        sort_order: "desc",
      });

      if (editStaffProfile) {
        // fomat date
        const formattedData = {
          ...editStaffProfile,
          //   id user
          user_id:
            editStaffProfile.user_id?._id || editStaffProfile.user_id || null,
          // id depart
          department_id:
            editStaffProfile.department_id?._id ||
            editStaffProfile.department_id,

          hire_date: editStaffProfile.hire_date
            ? moment(editStaffProfile.hire_date)
            : null,

          qualifications: editStaffProfile.qualifications?.map((q) => ({
            ...q,
            issue_date: q.issue_date ? moment(q.issue_date) : null,
            expiry_date: q.expiry_date ? moment(q.expiry_date) : null,
          })),
        };
        form.setFieldsValue(formattedData);
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, editStaffProfile]);

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
          Cập nhật tài khoản
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Phòng ban"
          name="department_id"
          rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}
        >
          <Select placeholder="Chọn phòng ban" allowClear>
            {departments
              ?.filter((depart) => depart._id)
              .map((depart) => (
                <Select.Option key={depart._id} value={depart._id}>
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
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ngày"
          name="hire_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

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
                    <DatePicker style={{ width: "100%" }} />
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
                    <DatePicker style={{ width: "100%" }} />
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

export default ModalEditStaffProfile;
