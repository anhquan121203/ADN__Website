import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";
import "./Register.css";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { registerUser } from "../../../Api/authApi";
import { toast } from "react-toastify";
import { login } from "../../../Feartures/user/authSlice";
import * as Yup from "yup";
import { GoogleLogin } from "@react-oauth/google";
import { registerWithGoogle } from "../../../Api/authApi";
import { Form, Modal, Select } from "antd";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAddress from "../../../Hooks/useAdress";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { cities, wards, getCities, getWards, resetWards } = useAddress();
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getCities();
  }, []);

  // Validate schema
  const validationSchema = Yup.object({
    first_name: Yup.string().required("Tên phải bắt buộc"),
    last_name: Yup.string().required("Họ phải bắt buộc"),
    dob: Yup.date()
      .required("Ngày sinh phải bắt buộc")
      .max(new Date(), "Ngày sinh không được ở tương lai")
      .min(
        new Date(new Date().setFullYear(new Date().getFullYear() - 70)),
        "Tuổi tối đa là 70"
      ),
    phone_number: Yup.string()
      .matches(/^\d{10}$/, "Số điện thoại phải có đúng 10 chữ số")
      .required("Số điện thoại bắt buộc nhập"),
    address: Yup.object({
      street: Yup.string().required("Địa chỉ cụ thể bắt buộc nhập"),
      ward: Yup.string().required("Phường / xã bắt buộc nhập"),
      district: Yup.string().required("Quận / huyện bắt buộc nhập"),
      city: Yup.string().required("Tỉnh / thành phố bắt buộc nhập"),
      country: Yup.string().required("Quốc gia bắt buộc nhập"),
    }),

    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email bắt buộc nhập"),
    password: Yup.string()
      .required("Mật khẩu bắt buộc nhập")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .matches(/^\S*$/, "Mật khẩu không được chứa khoảng trắng")
      .matches(/[a-z]/, "Mật khẩu phải có ít nhất một chữ thường")
      .matches(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ hoa")
      .matches(/[0-9]/, "Mật khẩu phải có ít nhất một chữ số")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Mật khẩu phải có ít nhất một ký tự đặc biệt"
      )
      .notOneOf(
        [
          "123456789",
          "12345678",
          "password",
          "1234567890",
          "admin123456",
          "abcdefgh",
          "abc123",
          "admin",
        ],
        "Mật khẩu quá đơn giản, hãy chọn mật khẩu mạnh hơn"
      ),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
      .required("Nhập lại mật khẩu bắt buộc"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      dob: "",
      phone_number: "",
      address: {
        street: "",
        ward: "",
        district: "",
        city: "",
        country: "Việt Nam",
      },
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const fullAddress = `${values.address.street}, ${values.address.ward}, ${values.address.district}, ${values.address.city}, ${values.address.country}`;

        const payload = {
          ...values,
          address: fullAddress, 
        };

        const response = await registerUser(payload);
        console.log(response);

        if (
          response.status === 200 ||
          response.status === 201 ||
          response.data?.success
        ) {
          console.log("đăng ký thành công!!!!");

          // dispatch(login({ token }));
          const { token } = response.data;
          if (token) {
            localStorage.setItem("accessToken", token);
            dispatch(login({ token }));
          }
          navigate("/login");
          toast.success("Đăng kí thành công!!!", { autoClose: 1000 });
        } else {
          toast.error(response.data.message || "Đăng kí thất bại!!!");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi trong quá trình đăng ký");
      }
    },
  });

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <h2> Chào mừng bạn đến với</h2>
        <h2> BLOODLINE DNA TESTING!</h2>
        <p>
          Bằng cách đăng ký với chúng tôi, bạn đang thực hiện bước đầu tiên để
          hiểu rõ hơn về bản thân thông qua xét nghiệm DNA. Dù bạn muốn tìm hiểu
          về sức khỏe, nguồn gốc hay các đặc điểm di truyền, chúng tôi luôn đồng
          hành cùng bạn!
        </p>
      </div>

      <div className="register-right">
        <h2>Đăng ký</h2>
        <p>Tạo tài khoản mới của bạn</p>
        <form className="form-register" onSubmit={formik.handleSubmit}>
          <div className="form-row-register">
            <div className="form-group-register">
              <label>Họ</label>
              <input
                type="text"
                name="last_name"
                placeholder="Họ..."
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.last_name && formik.errors.last_name
                    ? "error"
                    : ""
                }
                {...formik.getFieldProps("last_name")}
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <span className="error-text">*{formik.errors.last_name}</span>
              )}
            </div>

            <div className="form-group-register">
              <label>Tên</label>
              <input
                type="text"
                name="first_name"
                placeholder="Tên..."
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.first_name && formik.errors.first_name
                    ? "error"
                    : ""
                }
                {...formik.getFieldProps("first_name")}
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <span className="error-text">{formik.errors.first_name}</span>
              )}
            </div>
          </div>

          {/* <div className="form-row-register"> */}
          <div className="form-group-register">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="dob"
              value={formik.values.dob}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.dob && formik.errors.dob ? "error" : ""}
              {...formik.getFieldProps("dob")}
              max={new Date().toISOString().split("T")[0]} // không chọn được ngày tương lai
            />
            {formik.touched.dob && formik.errors.dob && (
              <span className="error-text">{formik.errors.dob}</span>
            )}
          </div>

          <div className="form-group-register">
            <label>Số điện thoại</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              name="phone_number"
              value={formik.values.phone_number}
              onChange={(e) => {
                const onlyNumbers = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);
                formik.setFieldValue("phone_number", onlyNumbers);
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("Text");
                if (!/^\d+$/.test(pasted)) {
                  e.preventDefault();
                }
              }}
              onBlur={formik.handleBlur}
              className={
                formik.touched.phone_number && formik.errors.phone_number
                  ? "error"
                  : ""
              }
            />

            {formik.touched.phone_number && formik.errors.phone_number && (
              <span className="error-text">{formik.errors.phone_number}</span>
            )}
          </div>
          {/* </div> */}

          {/* Address ====================================================================*/}
          <Form.Item label="Thành phố">
            <Select
              showSearch
              placeholder="Chọn thành phố"
              onChange={(cityCode) => {
                const city = cities.find((c) => c.code === cityCode);
                setSelectedCity(city);
                resetWards();
                setSelectedDistrictCode(null);
                setSelectedWard(null);

                formik.setFieldValue("address.city", city?.name || "");
                formik.setFieldValue("address.district", "");
                formik.setFieldValue("address.ward", "");
              }}
              value={selectedCity?.code || undefined}
            >
              {cities.map((city) => (
                <Select.Option key={city.code} value={city.code}>
                  {city.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Quận / Huyện">
            <Select
              showSearch
              placeholder="Chọn quận"
              value={selectedDistrictCode || undefined}
              onChange={(districtCode) => {
                setSelectedDistrictCode(districtCode);
                const district = selectedCity?.districts.find(
                  (d) => d.code === districtCode
                );
                getWards(districtCode);
                setSelectedWard(null);

                formik.setFieldValue("address.district", district?.name || "");
                formik.setFieldValue("address.ward", "");
              }}
              disabled={!selectedCity}
            >
              {selectedCity?.districts.map((district) => (
                <Select.Option key={district.code} value={district.code}>
                  {district.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Phường / Xã">
            <Select
              showSearch
              placeholder="Chọn phường"
              value={selectedWard?.code || undefined}
              onChange={(wardCode) => {
                const ward = wards.find((w) => w.code === wardCode);
                setSelectedWard(ward);

                formik.setFieldValue("address.ward", ward?.name || "");
              }}
              disabled={!selectedDistrictCode}
            >
              {wards.map((ward) => (
                <Select.Option key={ward.code} value={ward.code}>
                  {ward.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Địa chỉ cụ thể">
            <input
              type="text"
              name="address.street"
              placeholder="Số nhà, tên đường..."
              value={formik.values.address.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.address?.street && formik.errors.address?.street
                  ? "error"
                  : ""
              }
            />
            {formik.touched.address?.street &&
              formik.errors.address?.street && (
                <span className="error-text">
                  {formik.errors.address.street}
                </span>
              )}
          </Form.Item>

          {formik.touched.address && formik.errors.address && (
            <span className="error-text">{formik.errors.address}</span>
          )}

          <div className="form-group-register">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="demo@gmail.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.email && formik.errors.email ? "error" : ""
              }
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <span className="error-text">{formik.errors.email}</span>
            )}
          </div>

          <div className="form-group-register">
            <label>Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="********"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.password && formik.errors.password ? "error" : ""
              }
              {...formik.getFieldProps("password")}
            />
            <span
              className="toggle-password-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
            {formik.touched.password && formik.errors.password && (
              <span className="error-text">{formik.errors.password}</span>
            )}
          </div>

          <div className="form-group-register">
            <label>Nhập lại mật khẩu</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="********"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "error"
                  : ""
              }
              {...formik.getFieldProps("confirmPassword")}
            />
            <span
              className="toggle-password-icon"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <span className="error-text">
                  {formik.errors.confirmPassword}
                </span>
              )}
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p style={{ marginBottom: "-5px" }}>Hoặc đăng ký với Google</p>
        <div className="social-login">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const id_token = credentialResponse.credential;
              try {
                const response = await registerWithGoogle(id_token);
                const token = response.token;

                localStorage.setItem("accessToken", token);
                dispatch(login({ token }));
                toast.success("Đăng ký Google thành công ✅");
                showLoading();
                setTimeout(() => {
                  navigate("/login");
                }, 4000);
              } catch (error) {
                toast.error("Đăng ký thất bại!!!");
              }
            }}
            onError={() => {
              toast.error("Google login failed");
            }}
          />
        </div>

        <p>
          Bạn đã có tài khoản?{" "}
          <Link to="/login">
            <span
              style={{
                fontWeight: "bold",
                color: "black",
                textDecoration: "underline",
              }}
            >
              Đăng nhập
            </span>
          </Link>
        </p>

        <Modal
          title={
            <p>
              <IoMdNotificationsOutline />
              Thông báo
            </p>
          }
          footer={null}
          open={open}
          onCancel={() => setOpen(false)}
        >
          {loading ? (
            <p>Đang xử lý đăng ký...</p>
          ) : (
            <p>Vui lòng kiểm tra email để xác nhận!</p>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Register;
