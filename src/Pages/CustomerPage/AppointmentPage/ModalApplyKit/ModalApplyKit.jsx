import React, { useEffect, useState } from "react";
import { Modal, Select, Input, Button, Form, Space, message } from "antd";
import useSample from "../../../../Hooks/useSample";
import { toast } from "react-toastify";

const sampleTypeOptions = [
  { label: "Máu", value: "blood" },
  { label: "Nước bọt", value: "saliva" },
  { label: "Tóc", value: "hair" },
];

const ModalApplyKit = ({ open, onClose, appointmentId }) => {
  const { addSamples } = useSample();

  const [form] = Form.useForm();
  const [personInfoList, setPersonInfoList] = useState([{ key: Date.now() }]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddPerson = () => {
    setPersonInfoList([...personInfoList, { key: Date.now() }]);
  };

  const handleRemovePerson = (index) => {
    setPersonInfoList(personInfoList.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        appointment_id: appointmentId,
        sample_types: values.sample_types,
        notes: values.notes,
        person_info_list: values.person_info_list,
      };
      setSubmitting(true);
      const res = await addSamples(payload);
      if (res.success) {
        toast.success("Yêu cầu bộ kit thành công!");
        onClose();
        form.resetFields();
        setPersonInfoList([{ key: Date.now() }]);
      } else {
        toast.error("Yêu cầu bộ kit thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Yêu cầu bộ kit"
      onOk={handleSubmit}
      okText="Gửi yêu cầu"
      confirmLoading={submitting}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Loại mẫu"
          name="sample_types"
          rules={[{ required: true, message: "Vui lòng chọn loại mẫu" }]}
        >
          <Select
            mode="multiple"
            options={sampleTypeOptions}
            placeholder="Chọn loại mẫu"
          />
        </Form.Item>
        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea placeholder="Ghi chú (không bắt buộc)" />
        </Form.Item>
        <div>
          <b>Danh sách người lấy mẫu</b>
          {personInfoList.map((person, idx) => (
            <div key={person.key} style={{ marginBottom: 16, borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>
              <Form.Item
                name={["person_info_list", idx, "name"]}
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Họ và Tên" />
              </Form.Item>
              <Form.Item
                name={["person_info_list", idx, "dob"]}
                rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
                style={{ marginBottom: 8 }}
              >
                <Input type="date" placeholder="Ngày/Tháng/Năm sinh" />
              </Form.Item>
              <Form.Item
                name={["person_info_list", idx, "relationship"]}
                rules={[{ required: true, message: "Vui lòng nhập mối quan hệ" }]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Mối quan hệ" />
              </Form.Item>
              <Form.Item
                name={["person_info_list", idx, "birth_place"]}
                rules={[{ required: true, message: "Vui lòng nhập nơi sinh" }]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Nơi sinh" />
              </Form.Item>
              <Form.Item
                name={["person_info_list", idx, "nationality"]}
                rules={[{ required: true, message: "Vui lòng nhập quốc tịch" }]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Quốc tịch" />
              </Form.Item>
              <Button danger onClick={() => handleRemovePerson(idx)} disabled={personInfoList.length === 1}>
                Xóa
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={handleAddPerson} style={{ width: "100%" }}>
            Thêm người lấy mẫu
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalApplyKit;