import React, { useState, useRef } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../../services/api/userApi";

export default function LoginSignupModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cardRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const response = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        console.log("Login successful:", response);
      } else {
        const response = await registerUser({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        });
        console.log("Signup successful:", response);
      }
      onClose();
      navigate("/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLogin = () => {
    setIsLogin(!isLogin);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotationY: isLogin ? 180 : 0,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Card Container with 3D perspective */}
      <div
        ref={cardRef}
        className="relative w-full max-w-4xl h-[480px] mx-4 flex rounded-3xl shadow-2xl bg-transparent border border-gray-600 perspective-[1500px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front - Login */}
        <div
          className="absolute inset-0 w-full h-full flex overflow-hidden rounded-3xl bg-black"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Left Image */}
          <div className="hidden md:flex w-1/2 bg-black relative">
            <img
              src="/robo1.png"
              alt="Login Illustration"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/20 clip-path-[polygon(100%_0,85%_0,100%_100,100%_100)]"></div>
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Welcome Back
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-9 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 hover:cursor-pointer text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <p className="text-gray-400 text-sm text-center mt-2">
                Don't have an account?{" "}
                <button
                  onClick={toggleLogin}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Back - Signup */}
        <div
          className="absolute inset-0 w-full h-full flex overflow-hidden rounded-3xl rotate-y-180 bg-black"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Right Image */}
          <div className="hidden md:flex w-1/2  relative order-2">
            <img
              src="/robot2.png"
              alt="Signup Illustration"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/20 clip-path-[polygon(0_0,15%_0,0_100,0_100)]"></div>
          </div>

          {/* Left Form */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative order-1">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Join CipherStudio
              </h2>
              <p className="text-gray-400 text-sm md:text-base ">
                Create your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-9 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:cursor-pointer text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-gray-400 text-sm text-center mt-2">
                Already have an account?{" "}
                <button
                  onClick={toggleLogin}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
