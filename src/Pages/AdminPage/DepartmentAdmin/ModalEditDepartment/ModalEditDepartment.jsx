import React, { useEffect, useRef } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import { Editor } from "@tinymce/tinymce-react";
// import { API_TINY_URL } from "../../../../Constants/apiConstants";

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
  const API_TINY_URL = import.meta.env.VITE_TINY_API_KEY;

  useEffect(() => {
    if (isModalOpen && editDepartment) {
      form.setFieldsValue({
        name: editDepartment.name,
        description: editDepartment.description, 
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
      const editorContent = editorRef.current?.getContent();
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
            apiKey={API_TINY_URL}
            onInit={(evt, editor) => {
              editorRef.current = editor;
              const desc = form.getFieldValue("description");
              if (desc) editor.setContent(desc);
            }}
            init={{
              height: 200,
              menubar: false,
              plugins:
                "advlist autolink lists link image charmap preview anchor " +
                "searchreplace visualblocks code fullscreen " +
                "insertdatetime table help wordcount",
              toolbar:
                "undo redo | blocks | bold italic forecolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | link image | removeformat | fullscreen | help",
              branding: false,
              promotion: false,
              resize: false,
              statusbar: false,
              paste_data_images: false,
              automatic_uploads: false,
              file_picker_types: "image",
              valid_elements:
                "p,br,strong,b,em,i,u,ul,ol,li,h1,h2,h3,h4,h5,h6,blockquote," +
                "a[href|title],img[src|alt|title|width|height|style]",
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
