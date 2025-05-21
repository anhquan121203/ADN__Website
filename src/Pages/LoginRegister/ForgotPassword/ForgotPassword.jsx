import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import useStaff from '../../../Hooks/useStaff';
import logo from "../../../assets/images/logo.png";
import './ForgotPassword.css';

const ForgotPassword = () => {
  const { forgotPasswords, loading } = useStaff();
  const [emailSent, setEmailSent] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await forgotPasswords(values.email);
        if (result.success) {
          setEmailSent(true);
          toast.success('Password reset instructions have been sent to your email');
        } else {
          toast.error(result.error || 'Failed to send reset email');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
    },
  });

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-left">
        <div className="forgot-password-logo">
          <img src={logo} alt="logo page" />
        </div>
      </div>

      <div className="forgot-password-right">
        <h2>Forgot Password</h2>
        {!emailSent ? (
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email address"
                required
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error-message">{formik.errors.email}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="reset-button"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>

            <div className="form-footer">
              <Link to="/login" className="back-to-login">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="success-message">
            <h3>Check Your Email</h3>
            <p>We have sent password reset instructions to your email.</p>
            <Link to="/login" className="back-to-login">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;