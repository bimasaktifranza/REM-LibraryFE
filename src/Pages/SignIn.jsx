import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGoogle, FaFacebookF, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

function SignIn({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);
  const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://rem-library.up.railway.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      alert("Login berhasil!");
      localStorage.setItem("token", data.token);
      onLogin(data.user.role);

      if (data.user.role === "admin") {
        navigate("/");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://rem-library.up.railway.app/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      alert("Registrasi berhasil. Silakan login.");
      setIsSignUp(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: { duration: 0.3 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefae0] px-4 py-8 relative overflow-hidden">
      {/* Subtle background pattern/texture */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d4c6a6\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px 30px' }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl mx-auto relative z-10"
      >
        <div className="flex bg-white rounded-3xl shadow-2xl border border-[#d4c6a6] overflow-hidden flex-col md:flex-row">
          
          {/* Left side - Form */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-[#fefae0]">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-[#4a2515] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <FaUser className="text-2xl text-[#fefae0]" />
              </motion.div>
              <h1 className="text-2xl font-bold text-[#2D1E17] mb-1">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-[#2D1E17]/70 text-sm">
                {isSignUp
                  ? "Join our library community today"
                  : "Sign in to access your library"
                }
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={isSignUp ? "signup" : "signin"}
                onSubmit={isSignUp ? handleSignUpSubmit : handleSignInSubmit}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <motion.div variants={itemVariants} className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-[#2D1E17]/60 group-focus-within:text-[#4a2515] transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={isSignUp ? signupUsername : username}
                    onChange={(e) =>
                      isSignUp
                        ? setSignupUsername(e.target.value)
                        : setUsername(e.target.value)
                    }
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#d4c6a6] rounded-xl text-[#2D1E17] placeholder-[#2D1E17]/60 outline-none focus:border-[#4a2515] focus:ring-1 focus:ring-[#4a2515] transition-all duration-300 shadow-sm"
                  />
                </motion.div>

                {isSignUp && (
                  <motion.div variants={itemVariants} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-[#2D1E17]/60 group-focus-within:text-[#4a2515] transition-colors" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#d4c6a6] rounded-xl text-[#2D1E17] placeholder-[#2D1E17]/60 outline-none focus:border-[#4a2515] focus:ring-1 focus:ring-[#4a2515] transition-all duration-300 shadow-sm"
                    />
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-[#2D1E17]/60 group-focus-within:text-[#4a2515] transition-colors" />
                  </div>
                  <input
                    type={
                      isSignUp
                        ? showPasswordSignUp
                          ? "text"
                          : "password"
                        : showPasswordSignIn
                          ? "text"
                          : "password"
                    }
                    placeholder="Password"
                    value={isSignUp ? signupPassword : password}
                    onChange={(e) =>
                      isSignUp
                        ? setSignupPassword(e.target.value)
                        : setPassword(e.target.value)
                    }
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white border border-[#d4c6a6] rounded-xl text-[#2D1E17] placeholder-[#2D1E17]/60 outline-none focus:border-[#4a2515] focus:ring-1 focus:ring-[#4a2515] transition-all duration-300 shadow-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#2D1E17]/60 hover:text-[#2D1E17]/80 transition-colors"
                    onClick={() =>
                      isSignUp
                        ? setShowPasswordSignUp(!showPasswordSignUp)
                        : setShowPasswordSignIn(!showPasswordSignIn)
                    }
                  >
                    {isSignUp
                      ? showPasswordSignUp
                        ? <FaEyeSlash className="h-5 w-5" />
                        : <FaEye className="h-5 w-5" />
                      : showPasswordSignIn
                        ? <FaEyeSlash className="h-5 w-5" />
                        : <FaEye className="h-5 w-5" />}
                  </button>
                </motion.div>

                {!isSignUp && (
                  <motion.div variants={itemVariants} className="flex justify-end">
                    <a
                      href="#"
                      className="text-sm text-[#2D1E17]/70 hover:text-[#4a2515] transition-colors duration-300"
                    >
                      Lupa Password?
                    </a>
                  </motion.div>
                )}

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(74, 37, 21, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 bg-[#4a2515] text-[#fefae0] font-semibold rounded-xl shadow-md hover:bg-[#3e1f0d] transition-all duration-300 ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-[#fefae0]/30 border-t-[#fefae0] rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    isSignUp ? "Create Account" : "Sign In"
                  )}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-[#2D1E17]/70 text-sm mb-2">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </p>
              <motion.button
                onClick={() => setIsSignUp(!isSignUp)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#4a2515] hover:text-[#3e1f0d] font-semibold transition-colors duration-300 relative group"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4a2515] transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right side - Decoration / Image / Quote */}
          <div className="hidden md:flex w-1/2 bg-[#2D1E17] text-[#fefae0] flex-col items-center justify-center p-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">📚 Perpustakaan Digital</h2>
              <p className="text-[#fefae0]/80">
                "A room without books is like a body without a soul." <br />- Cicero
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignIn;
