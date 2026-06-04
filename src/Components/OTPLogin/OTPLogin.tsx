import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "../../Store/userSlice";
import { requestOTPAPI, verifyOTPAPI } from "../../API/OTPLoginAPI";
import useAuth from "../../customHooks/useAuth";
import Spinner from "../Animation/Spinner";
import { FiArrowLeft, FiMail, FiLock, FiCheckCircle } from "react-icons/fi";
import "./OTPLogin.css";

const OTPLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [step, setStep] = useState<1 | 2>(1); // 1: Enter Email, 2: Enter OTP
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useAuth();

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/home");
    }
  }, [loading, isAuthenticated, navigate]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle requesting OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError("");
    setSuccessMessage("");
    setIsSending(true);

    try {
      const response = await requestOTPAPI({ emailId: email });
      if (response.status === 200 && response.data) {
        setSuccessMessage("OTP sent to your email successfully!");
        setStep(2);
        setTimer(60);
      } else {
        setError(response.error || "Failed to send OTP. Please check your email.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // only allow digits

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle key down for Backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const pasteOtp = pasteData.split("");
      setOtp(pasteOtp);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Handle verifying OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsVerifying(true);

    try {
      const response = await verifyOTPAPI({ emailId: email, otp: otpCode });
      if (response.status === 200 && response.data) {
        setSuccessMessage("Logged in successfully!");
        
        // Save to Redux store
        dispatch(
          updateUserDetails({
            userID: response.data.userID,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            photourl: response.data.photourl,
          })
        );
        
        setTimeout(() => {
          navigate("/home");
        }, 800);
      } else {
        setError(response.error || "Verification failed. Try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (timer > 0) return;
    setError("");
    setSuccessMessage("");
    setIsSending(true);

    try {
      const response = await requestOTPAPI({ emailId: email });
      if (response.status === 200 && response.data) {
        setSuccessMessage("A fresh OTP has been sent to your email!");
        setTimer(60);
        setOtp(Array(6).fill(""));
        otpInputsRef.current[0]?.focus();
      } else {
        setError(response.error || "Failed to resend OTP.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="otp-loading-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="otp-login-page">
      <div className="otp-glow-circle primary"></div>
      <div className="otp-glow-circle secondary"></div>

      <div className="otp-card-container">
        <Link to="/login" className="otp-back-link">
          <FiArrowLeft size={18} />
          <span>Back to Password Login</span>
        </Link>

        <div className="otp-card">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="otp-step-content"
              >
                <div className="otp-header">
                  <div className="icon-wrapper">
                    <FiMail size={28} />
                  </div>
                  <h2>Request OTP</h2>
                  <p>Enter your registered email address to receive a secure login code.</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="otp-error"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleRequestOTP} className="otp-form">
                  <div className="otp-form-group">
                    <label className="otp-label">Email Address</label>
                    <div className="input-with-icon">
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        className="otp-input-field"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="otp-submit-btn"
                  >
                    {isSending ? "Sending OTP..." : "Send OTP"}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="otp-step-content"
              >
                <div className="otp-header">
                  <div className="icon-wrapper">
                    <FiLock size={28} />
                  </div>
                  <h2>Verify OTP</h2>
                  <p>
                    We sent a 6-digit code to <span className="highlight-email">{email}</span>. 
                    <button 
                      className="edit-email-btn"
                      onClick={() => {
                        setStep(1);
                        setError("");
                        setSuccessMessage("");
                        setOtp(Array(6).fill(""));
                      }}
                    >
                      Change
                    </button>
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="otp-error"
                  >
                    {error}
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="otp-success"
                  >
                    <FiCheckCircle size={16} />
                    <span>{successMessage}</span>
                  </motion.div>
                )}

                <form onSubmit={handleVerifyOTP} className="otp-form">
                  <div className="otp-form-group">
                    <label className="otp-label center">Enter Verification Code</label>
                    <div className="otp-digit-inputs">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          type="text"
                          pattern="\d*"
                          maxLength={1}
                          value={digit}
                          ref={(el) => (otpInputsRef.current[idx] = el)}
                          onChange={(e) => handleOtpChange(e.target.value, idx)}
                          onKeyDown={(e) => handleKeyDown(e, idx)}
                          onPaste={idx === 0 ? handlePaste : undefined}
                          className="otp-digit-input"
                          required
                        />
                      ))}
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isVerifying || otp.join("").length !== 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="otp-submit-btn"
                  >
                    {isVerifying ? "Verifying..." : "Verify & Login"}
                  </motion.button>

                  <div className="otp-resend-container">
                    {timer > 0 ? (
                      <p className="timer-text">Resend code in <span>{timer}s</span></p>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleResendOTP} 
                        className="resend-btn"
                        disabled={isSending}
                      >
                        {isSending ? "Sending..." : "Resend Code"}
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;
