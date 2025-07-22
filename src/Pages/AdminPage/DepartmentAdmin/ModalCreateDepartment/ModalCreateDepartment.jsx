import React, { useEffect, useRef } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import { Editor } from "@tinymce/tinymce-react";
// import { API_TINY_URL } from "../../../../Constants/apiConstants";

const ModalCreateDepartment = ({
  isModalOpen,
  handleCancel,
  handleAdd,
  managers = [],
  loadingManagers = false,
}) => {
  const editorRef = useRef(null);
  const [form] = Form.useForm();
  const API_TINY_URL = import.meta.env.VITE_TINY;

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      editorRef.current?.setContent("");
    }
  }, [isModalOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const description = editorRef.current?.getContent();

      await handleAdd({
        name: values.name,
        description,
        manager_id: values.manager_id,
      });

      form.resetFields();
      editorRef.current?.setContent("");
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Modal
      title="Tạo phòng ban mới"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Tạo phòng ban
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

        <Form.Item label="Mô tả" required tooltip="Nhập mô tả cho phòng ban">
          <Editor
            apiKey={API_TINY_URL}
            onInit={(evt, editor) => (editorRef.current = editor)}
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
              placeholder: "Nhập mô tả phòng ban...",
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

export default ModalCreateDepartment;
