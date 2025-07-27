import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import useAddress from "../../../../Hooks/useAdress";

const ModalCreateUser = ({ isModalOpen, handleCancel, handleAdd }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const { cities, wards, getCities, getWards, resetWards } = useAddress();
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    getCities();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
      setFileList([]);
    }
  }, [isModalOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      // Append đúng tên field theo yêu cầu backend
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("password", String(values.password));
      formData.append("role", values.role);
      formData.append("phone_number", String(values.phone_number));
      formData.append("gender", values.gender);
      formData.append("dob", dayjs(values.dob).format("YYYY-MM-DD"));

      if (values.street && values.city && values.district && values.ward) {
        const selectedCityName = cities.find(c => c.code === values.city)?.name || "";
        const selectedDistrictName = districts.find(d => d.code === values.district)?.name || "";
        const fullAddress = {
          street: values.street,
          ward: values.ward,
          district: selectedDistrictName,
          city: selectedCityName,
          country: "Việt Nam"
        };
        formData.append("address", JSON.stringify(fullAddress));
      }
      

      if (fileList.length > 0) {
        formData.append("avatar_image", fileList[0].originFileObj);
      }

      const response = await handleAdd(formData);
      console.log(response);

      if (response.success === true) {
        form.resetFields();
        setFileList([]);
        handleCancel();
        toast.success("Tạo tài khoản thành công");
      } else {
        toast.error(response.message || "Tạo tài khoản không thành công!");
      }
    } catch (error) {
      toast.error("Tạo tài khoản không thành công!");
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên"
              name="first_name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Họ"
              name="last_name"
              rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Radio.Group>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
            <Radio value="other">Khác</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
                if (!regex.test(value)) {
                  return Promise.reject(
                    new Error(
                      "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và ký tự đặc biệt!"
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone_number"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Số điện thoại chỉ được chứa chữ số!",
                },
              ]}
            >
              <Input
                maxLength={10}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  form.setFieldsValue({ phone_number: onlyNums });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày sinh"
              name="dob"
              rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
            >
              <DatePicker
                style={{ width: "100%", height: "40px" }}
                placeholder="Ngày sinh"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn vai trò">
            <Select.Option value="customer">Khách hàng</Select.Option>
            <Select.Option value="manager">Quản lý</Select.Option>
            <Select.Option value="staff">Nhân viên</Select.Option>
            <Select.Option value="laboratory_technician">
              Xét nghiệm viên
            </Select.Option>
          </Select>
        </Form.Item>

        {/* address form========================================================= */}

            <Form.Item
              label="Tỉnh / Thành phố"
              name="city"
              rules={[{ required: true, message: "Chọn tỉnh/thành!" }]}
            >
              <Select
                placeholder="Chọn tỉnh"
                onChange={(value) => {
                  const city = cities.find((c) => c.code === value);
                  setSelectedCity(city);
                  setDistricts(city.districts || []);
                  form.setFieldsValue({ district: null, ward: null });
                  resetWards();
                }}
              >
                {cities.map((city) => (
                  <Select.Option key={city.code} value={city.code}>
                    {city.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          

         
            <Form.Item
              label="Quận / Huyện"
              name="district"
              rules={[{ required: true, message: "Chọn quận/huyện!" }]}
            >
              <Select
                placeholder="Chọn quận"
                onChange={(value) => {
                  setSelectedDistrictCode(value);
                  form.setFieldsValue({ ward: null });
                  getWards(value);
                }}
                disabled={!districts.length}
              >
                {districts.map((district) => (
                  <Select.Option key={district.code} value={district.code}>
                    {district.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          

          
            <Form.Item
              label="Phường / Xã"
              name="ward"
              rules={[{ required: true, message: "Chọn phường/xã!" }]}
            >
              <Select placeholder="Chọn phường" disabled={!wards.length}>
                {wards.map((ward) => (
                  <Select.Option key={ward.code} value={ward.name}>
                    {ward.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          

        <Form.Item
          label="Số nhà, đường..."
          name="street"
          rules={[{ required: true, message: "Nhập địa chỉ chi tiết!" }]}
        >
          <Input placeholder="Số nhà, tên đường..." />
        </Form.Item>

        {/* =============================================================================== */}

        <Form.Item label="Ảnh đại diện">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            listType="picture-card"
            onChange={({ fileList }) => setFileList(fileList)}
            accept="image/*"
            maxCount={1}
            onPreview={async (file) => {
              let src = file.url;
              if (!src && file.originFileObj) {
                src = await new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file.originFileObj);
                  reader.onload = () => resolve(reader.result);
                });
              }
              const imgWindow = window.open(src);
              if (imgWindow) {
                const image = new Image();
                image.src = src;
                imgWindow.document.write(image.outerHTML);
              }
            }}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Chọn ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateUser;
