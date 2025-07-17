import React, { useEffect, useRef } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import { Editor } from "@tinymce/tinymce-react";

const ModalEditDepartment = ({
  isModalOpen,
  handleCancel,
  handleEdit,
  editDepartment,
  managers = [],
  loadingManagers = false,
}) => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);

  useEffect(() => {
    if (isModalOpen && editDepartment) {
      form.setFieldsValue({
        name: editDepartment.name,
        description: editDepartment.description, // Sẽ set lại vào editor sau
        manager_id:
          typeof editDepartment.manager_id === "object"
            ? editDepartment.manager_id._id
            : editDepartment.manager_id,
      });
    }
    if (!isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, editDepartment, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const editorContent = editorRef.current?.getContent({ format: "text" });
      await handleEdit({
        name: values.name,
        description: editorContent,
        manager_id: values.manager_id,
      });
      form.resetFields();
    } catch (error) {}
  };

  return (
    <Modal
      title="Chỉnh sửa phòng ban"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Lưu thay đổi
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên phòng ban"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng ban!" }]}
        >
          <Input placeholder="Nhập tên phòng ban" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Editor
            apiKey="your-kbwlwa1zq81ve1dux2j21b9fp7dfn1pmhzn70qnoiajaousx-api-key"
            onInit={(evt, editor) => {
              editorRef.current = editor;
              const desc = form.getFieldValue("description");
              if (desc) editor.setContent(desc);
            }}
            init={{
              menubar: false,
              branding: false,
              statusbar: false,
              height: 300,
              plugins: [
                "link",
                "lists",
                "wordcount",
                "fullscreen",
                "table",
                "autolink",
                "paste",
                "code",
                "preview",
                "charmap",
                "anchor",
                "visualblocks",
                "formatselect",
                "fontselect",
                "fontsizeselect",
                "help",
              ],
              toolbar:
                "undo redo | formatselect fontselect fontsizeselect | bold italic underline | \
       alignleft aligncenter alignright alignjustify | \
       bullist numlist outdent indent | link table | fullscreen preview code | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </Form.Item>

        <Form.Item
          label="Quản lý phòng ban"
          name="manager_id"
          rules={[{ required: true, message: "Vui lòng chọn quản lý!" }]}
        >
          <Select
            placeholder="Chọn quản lý"
            loading={loadingManagers}
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {managers.map((manager) => (
              <Select.Option key={manager._id} value={manager._id}>
                {manager.first_name} {manager.last_name} ({manager.email})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditDepartment;
