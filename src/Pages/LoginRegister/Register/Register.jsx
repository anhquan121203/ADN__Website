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
import { Modal } from "antd";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Validate schema
  const validationSchema = Yup.object({
    first_name: Yup.string().required("Tên phải bắt buộc"),
    last_name: Yup.string().required("Họ phải bắt buộc"),
    dob: Yup.date().required("Ngày sinh phải bắt buộc"),
    phone_number: Yup.string()
      .matches(/^\d+$/, "Số điện thoại phải là số hợp lệ")
      .required("Số điện thoại bắt buộc nhập"),
    // address: Yup.string().required("Địa chỉ bắt buộc nhập"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email bắt buộc nhập"),
    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu bắt buộc nhập"),
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
      // address: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await registerUser(values);

        if (response.status === 200) {
          console.log("đăng ký thành công!!!!");

          const { token } = response.data;
          localStorage.setItem("accessToken", token);

          dispatch(login({ token }));
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
                style={{ width: "190px" }}
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <span className="error-text">{formik.errors.first_name}</span>
              )}
            </div>
          </div>

          <div className="form-row-register">
            <div className="form-group-register">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.dob && formik.errors.dob ? "error" : ""
                }
                {...formik.getFieldProps("dob")}
                style={{ maxWidth: "400px" }}
              />
              {formik.touched.dob && formik.errors.dob && (
                <span className="error-text">{formik.errors.dob}</span>
              )}
            </div>

            <div className="form-group-register">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone_number"
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.phone_number && formik.errors.phone_number
                    ? "error"
                    : ""
                }
                placeholder="Số điện thoại của bạn..."
                {...formik.getFieldProps("phone_number")}
              />
              {formik.touched.phone_number && formik.errors.phone_number && (
                <span className="error-text">{formik.errors.phone_number}</span>
              )}
            </div>
          </div>

          {/* <div className="form-group-register">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              placeholder="Nhập địa chỉ của bạn..."
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.address && formik.errors.address ? "error" : ""
              }
              {...formik.getFieldProps("address")}
            />
            {formik.touched.address && formik.errors.address && (
              <span className="error-text">{formik.errors.address}</span>
            )}
          </div> */}

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

          <div className="form-row-register">
            <div className="form-group-register">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.password && formik.errors.password
                    ? "error"
                    : ""
                }
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="error-text">{formik.errors.password}</span>
              )}
            </div>

            <div className="form-group-register">
              <label>Nhập lại mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="********"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "error"
                    : ""
                }
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <span className="error-text">
                    {formik.errors.confirmPassword}
                  </span>
                )}
            </div>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
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
            Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </form>

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
