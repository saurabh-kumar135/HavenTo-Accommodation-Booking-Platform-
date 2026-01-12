import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import ErrorAlert from '../../components/ErrorAlert';

const VerifyPhone = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const phoneNumber = location.state?.phoneNumber;
  const firstName = location.state?.firstName;

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/signup');
    }
  }, [phoneNumber, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setErrors(['Please enter all 6 digits']);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3009/api/verify-phone/verify-otp',
        {
          phoneNumber,
          otp: otpCode
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Redirect to home page after successful verification
        navigate('/');
      } else {
        setErrors(response.data.errors || ['Verification failed']);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setErrors([error.response?.data?.errors?.[0] || 'An error occurred']);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setErrors([]);

    try {
      const response = await axios.post(
        'http://localhost:3009/api/verify-phone/resend-otp',
        { phoneNumber },
        { withCredentials: true }
      );

      if (response.data.success) {
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      } else {
        setErrors(response.data.errors || ['Failed to resend code']);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setErrors([error.response?.data?.errors?.[0] || 'An error occurred']);
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Navbar currentPage="signup" />
      <main className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#A67C52] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-mobile-alt text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Phone</h1>
          <p className="text-gray-600">
            We sent a verification code to<br />
            <span className="font-semibold text-gray-800">{phoneNumber}</span>
          </p>
        </div>

        <ErrorAlert errors={errors} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter 6-digit code
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:border-[#A67C52] transition"
                  required
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A67C52] text-white py-3 rounded-md hover:bg-[#8B6F47] focus:ring-4 focus:ring-[#D4B896] font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Verifying...
              </>
            ) : (
              <>
                <i className="fas fa-check mr-2"></i>
                Verify Phone
              </>
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend code in {countdown}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-[#A67C52] hover:text-[#8B6F47] font-medium text-sm disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>

          {/* Back to Signup */}
          <div className="text-center pt-4 border-t">
            <Link
              to="/signup"
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Sign Up
            </Link>
          </div>
        </form>
      </main>
    </>
  );
};

export default VerifyPhone;
