import React, { useEffect, useRef } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import { Editor } from "@tinymce/tinymce-react";

const ModalCreateDepartment = ({
  isModalOpen,
  handleCancel,
  handleAdd,
  managers = [],
  loadingManagers = false,
}) => {
  const editorRef = useRef(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      editorRef.current?.setContent(""); //  reset mô tả khi mở modal
    }
  }, [isModalOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const description = editorRef.current?.getContent({ format: "text" }); //Lấy plain text

      // console.log("Dữ liệu gửi lên tạo phòng ban:", values);
      // console.log(
      //   "manager_id gửi lên:",
      //   values.manager_id,
      //   typeof values.manager_id
      // );

      await handleAdd({
        name: values.name,
        description,
        manager_id: values.manager_id,
      });

      form.resetFields();
      editorRef.current?.setContent(""); //  reset mô tả sau khi tạo
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
            apiKey="kbwlwa1zq81ve1dux2j21b9fp7dfn1pmhzn70qnoiajaousx"
            onInit={(evt, editor) => (editorRef.current = editor)}
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

export default ModalCreateDepartment;
