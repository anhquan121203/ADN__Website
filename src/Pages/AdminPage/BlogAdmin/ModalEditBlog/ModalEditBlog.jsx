import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  message,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const ModalEditBlog = ({
  isModalOpen,
  handleCancel,
  handleUpdate,
  blog,
  categories,
  services,
  loading,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        service_id: blog.service_id?._id || blog.service_id,
        blog_category_id: blog.blog_category_id?._id || blog.blog_category_id,
        is_published: blog.is_published,
      });

      if (Array.isArray(blog.images)) {
        const initialFiles = blog.images.map((img, index) => ({
          uid: `${index}`,
          name: img.name || `Image-${index + 1}`,
          status: "done",
          url: img.image_url || img.url,
        }));
        setFileList(initialFiles);
      }
    }
  }, [blog, form]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // const normFile = (e) => {
  //   return Array.isArray(e) ? e : e?.fileList;
  // };

  const onFinish = async (values) => {
    if (blog && blog._id) {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("content", values.content);
      formData.append("blog_category_id", values.blog_category_id);
      formData.append("service_id", values.service_id || "");
      formData.append("is_published", values.is_published);

      // 1. Convert ảnh cũ từ URL thành File rồi append
      // const convertUrlToFile = async (url, name = "old-image.jpg") => {
      //   const response = await fetch(url);
      //   const blob = await response.blob();
      //   const file = new File([blob], name, { type: blob.type });
      //   return file;
      // };

      // 2. Convert tất cả ảnh cũ thành file
      // const oldImagePromises = fileList
      //   .filter((file) => !file.originFileObj && file.url)
      //   .map((file, index) => convertUrlToFile(file.url, `old-${index}.jpg`));

      // 3. Append ảnh mới luôn (để khỏi đợi)
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      try {
        // const oldImageFiles = await Promise.all(oldImagePromises);
        // oldImageFiles.forEach((file) => {
        //   formData.append("images", file); // append ảnh cũ đã convert
        // });

        await handleUpdate(blog._id, formData);
      } catch (error) {
        console.error(error);
        message.error("Cập nhật blog thất bại!");
      }
    }
  };

  return (
    <Modal
      title="Cập nhật Blog"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Cập nhật
        </Button>,
      ]}
      width={700}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề blog" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: "Vui lòng nhập slug!" }]}
        >
          <Input placeholder="Nhập slug (không dấu, không khoảng trắng)" />
        </Form.Item>
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <TextArea placeholder="Nội dung blog..." rows={5} />
        </Form.Item>
        <Form.Item
          name="blog_category_id"
          label="Danh mục blog"
          rules={[{ required: true, message: "Vui lòng chọn danh mục blog!" }]}
        >
          <Select placeholder="Chọn danh mục">
            {categories.map((cat) => (
              <Select.Option key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Dịch vụ liên quan" name="service_id">
          <Select placeholder="Chọn dịch vụ (nếu có)" allowClear>
            {services.map((sv) => (
              <Select.Option key={sv._id || sv.id} value={sv._id || sv.id}>
                {sv.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="is_published"
          label="Công khai"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item label="Ảnh minh họa">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            multiple
          >
            {fileList.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditBlog;
