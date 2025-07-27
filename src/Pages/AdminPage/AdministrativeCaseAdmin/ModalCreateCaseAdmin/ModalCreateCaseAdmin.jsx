import { Button, Divider, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalCreateCaseAdmin = ({ isModalOpen, handleCancel, handleAdd }) => {
  const [form] = Form.useForm();
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        expected_participants: Number(values.expected_participants),
      };

      const response = await handleAdd(payload); // Gửi JSON đơn giản

      if (response.success === true) {
        form.resetFields();
        handleCancel();
        toast.success("Tạo hồ sơ thành công");
      }
    } catch (error) {
      toast.error("Tạo hồ sơ không thành công!");
    }
  };

  return (
    <Modal
      title="Tạo hồ sơ mới"
      open={isModalOpen}
      onCancel={handleCancel}
      style={{ width: "1400px" }}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Tạo hồ sơ
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Loại hồ sơ"
          name="case_type"
          rules={[{ required: true, message: "Vui lòng chọn loại hồ sơ!" }]}
        >
          <Select placeholder="Chọn loại hồ sơ">
            <Select.Option value="paternity">Quan hệ cha con</Select.Option>
            <Select.Option value="maternity">Quan hệ mẹ con</Select.Option>
            <Select.Option value="sibling">
              Quan hệ anh chị em ruột
            </Select.Option>
            <Select.Option value="kinship">Quan hệ họ hàng</Select.Option>
            <Select.Option value="immigration">Nhập cư</Select.Option>
            <Select.Option value="inheritance">Thừa kế</Select.Option>
            <Select.Option value="criminal_case">Vụ án hình sự</Select.Option>
            <Select.Option value="civil_case">Vụ án dân sự</Select.Option>
            <Select.Option value="missing_person">Người mất tích</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Mức độ khẩn cấp"
          name="urgency"
          rules={[{ required: true, message: "Vui lòng chọn loại hồ sơ!" }]}
        >
          <Select placeholder="Chọn loại hồ sơ">
            <Select.Option value="low">Thấp</Select.Option>
            <Select.Option value="normal">Bình thường</Select.Option>
            <Select.Option value="high">Cao</Select.Option>
            <Select.Option value="urgent">Khẩn cấp</Select.Option>
          </Select>
        </Form.Item>

        {/* Số hồ sơ ============================================================================================================= */}
        {/* <Form.Item
          label="Số hồ sơ"
          name="case_number"
          rules={[
            { required: true, message: "Vui lòng nhập mã hồ sơ!" },
            {
              pattern: /^PL-\d{4}-\d{3}$/,
              message:
                "Mã hồ sơ phải theo định dạng PL-YYYY-XXX (VD: PL-2024-001)",
            },
          ]}
        >
          <Input placeholder="PL-YYYY-XXX" />
        </Form.Item> */}

        {/* Thông tin pháp lý============================================================================================================= */}
        <Divider orientation="left">Thông tin pháp lý</Divider>
        <Form.Item
          label="Mã phép"
          name="authorization_code"
          rules={[
            { required: true, message: "Vui lòng nhập mã phép!" },
            {
              pattern: /^QD-\d{4}-\d{3}$/,
              message:
                "Mã hồ sơ phải theo định dạng QD-YYYY-XXX (VD: QD-2024-001)",
            },
          ]}
        >
          <Input placeholder="QD-YYYY-XXX" />
        </Form.Item>

        <Form.Item
          label="Số quyết định"
          name="court_order_number"
          placeholder="SO-XXX/YYYY"
          rules={[
            { required: true, message: "Vui lòng nhập mã phép!" },
            {
              pattern: /^SO-\d{3}\/\d{4}$/,
              message: "Định dạng hợp lệ là SO-XXX/YYYY (VD: SO-001/2024)",
            },
          ]}
        >
          <Input placeholder="SO-XXX/YYYY" />
        </Form.Item>

        <Form.Item
          label="Tên cơ quan yêu cầu"
          name="requesting_agency"
          rules={[
            { required: true, message: "Vui lòng nhập tên cơ quan yêu cầu!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ cơ quan"
          name="agency_address"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ cơ quan!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên người liên hệ cơ quan"
          name="agency_contact_name"
          rules={[
            { required: true, message: "Vui lòng nhập tên người liên hệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email cơ quan"
          name="agency_contact_email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email cơ quan!",
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại cơ quan"
          name="agency_contact_phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^0\d{9}$/,
              message: "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0",
            },
          ]}
        >
          <Input
            maxLength={10}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault(); // chặn không cho nhập ký tự không phải số
              }
            }}
            onChange={(e) => {
              // chỉ giữ lại số, giới hạn 10 ký tự
              const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
              e.target.value = onlyNums;
            }}
          />
        </Form.Item>

        <Form.Item
          label="Mô tả xét nghiệm"
          name="case_description"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mô tả xét nghiệm!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mục đích pháp lý"
          name="legal_purpose"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mục đích pháp lý!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Số  lượng người tham gia======================================*/}
        <Form.Item
          label="Số lượng người xét nghiệm"
          name="expected_participants"
          rules={[{ required: true, message: "Vui lòng số người xét nghiệm!" }]}
        >
          <Input
            type="number"
            min={0}
            onChange={(e) => setParticipantCount(Number(e.target.value || 0))}
          />
        </Form.Item>

        <Divider orientation="left">Thông tin người xét nghiệm</Divider>

        {Array.from({ length: participantCount }).map((_, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: 16,
              marginBottom: 12,
              borderRadius: 8,
            }}
          >
            <h4>Người xét nghiệm #{index + 1}</h4>

            <Form.Item
              label="Họ tên"
              name={["participants", index, "name"]}
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mối quan hệ"
              name={["participants", index, "relationship"]}
              rules={[
                { required: true, message: "Vui lòng nhập mối quan hệ!" },
              ]}
            >
              <Input placeholder="VD: Cha, Con, Mẹ..." />
            </Form.Item>

            <Form.Item
              label="CMND/CCCD"
              name={["participants", index, "id_number"]}
              rules={[
                { required: true, message: "Vui lòng nhập số CMND/CCCD!" },
              ]}
            >
              <Input maxLength={12}/>
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name={["participants", index, "phone"]}
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^0\d{9}$/,
                  message:
                    "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0",
                },
              ]}
            >
              <Input
                maxLength={10}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault(); // chặn không cho nhập ký tự không phải số
                  }
                }}
                onChange={(e) => {
                  // chỉ giữ lại số, giới hạn 10 ký tự
                  const onlyNums = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  e.target.value = onlyNums;
                }}
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name={["participants", index, "address"]}
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Bắt buộc tham gia?"
              name={["participants", index, "is_required"]}
              valuePropName="checked"
            >
              <Select>
                <Select.Option value={true}>Có</Select.Option>
                <Select.Option value={false}>Không</Select.Option>
              </Select>
            </Form.Item>
          </div>
        ))}

        {/* Tài liệu đính kèm=============================================================================================== */}
        <Divider orientation="left">Tài liệu đính kèm</Divider>
        <Form.List name="documents">
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
                    label="Tên tài liệu"
                    name={[name, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên tài liệu!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Loại tài liệu"
                    name={[name, "type"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập loại tài  liệu!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Link tài liệu"
                    name={[name, "file_url"]}
                  >
                    <Input />
                  </Form.Item>
                  <Button onClick={() => remove(name)} danger>
                    Xóa
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Thêm tài liệu đính kèm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ModalCreateCaseAdmin;
