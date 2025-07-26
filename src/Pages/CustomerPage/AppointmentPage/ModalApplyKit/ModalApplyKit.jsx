import React, { useEffect, useState } from "react";
import { Modal, Select, Input, Button, Form, Space, message } from "antd";
import useSample from "../../../../Hooks/useSample";

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
        message.success("Request kit successfully!");
        onClose();
        form.resetFields();
        setPersonInfoList([{ key: Date.now() }]);
      } else {
        message.error("Failed to request kit");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Request Kit"
      onOk={handleSubmit}
      okText="Submit"
      confirmLoading={submitting}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Sample Types"
          name="sample_types"
          rules={[{ required: true, message: "Please select sample types" }]}
        >
          <Select
            mode="multiple"
            options={sampleTypeOptions}
            placeholder="Select sample types"
          />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea placeholder="Optional notes" />
        </Form.Item>
        <div>
          <b>Person Info List</b>
          {personInfoList.map((person, idx) => (
            <div key={person.key} style={{ marginBottom: 16, borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>
              <Form.Item
                name={["person_info_list", idx, "name"]}
                rules={[{ required: true, message: "Name required" }]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Họ và Tên" />
              </Form.Item>
              <Form.Item
                name={["person_info_list", idx, "dob"]}
                rules={[{ required: true, message: "DOB required" }]}
                style={{ marginBottom: 8 }}
              >
                <Input type="date" placeholder="Ngày/Tháng/Năm sinh" />
              </Form.Item>
              <Form.Item
                name={["person_info_list", idx, "relationship"]}
                rules={[{ required: true, message: "Relationship required" }]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Mối quan hệ" />
              </Form.Item>
              <Form.Item
                name={["person_info_list", idx, "birth_place"]}
                rules={[{ required: true, message: "Birth place required" }]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Nơi sinh" />
              </Form.Item>
              <Form.Item
                name={["person_info_list", idx, "nationality"]}
                rules={[{ required: true, message: "Nationality required" }]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Quốc Tịch" />
              </Form.Item>
              <Button danger onClick={() => handleRemovePerson(idx)} disabled={personInfoList.length === 1}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={handleAddPerson} style={{ width: "100%" }}>
            Add Person
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalApplyKit;