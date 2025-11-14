import React, { useContext, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaImage,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaUserPlus,
  FaChartLine,
  FaShieldAlt,
  FaRegChartBar,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { useTheme } from "../../context/ThemeContext/ThemeContext";

const Signup = () => {
  const { createUser, signInWithGoogle, setLoading } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const navigate = useNavigate();

  // Email/password registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoadingState(true);

    const displayName = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photoURL = e.target.photo.value;

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must include uppercase, lowercase, and a number (min 6 characters)"
      );
      setLoadingState(false);
      return;
    }

    try {
      const result = await createUser(email, password);
      await updateProfile(result.user, { displayName, photoURL });

      toast.success("Sign Up successful!");
      e.target.reset();
      setLoading(true);
      navigate("/");
    } catch (error) {
      console.error("SignUp error:", error.message);
      toast.error("Invalid email or password!");
    } finally {
      setLoadingState(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setLoadingState(true);
    try {
      const result = await signInWithGoogle();
      const newUser = {
        name: result.user.displayName,
        email: result.user.email,
        image: result.user.photoURL,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (data.message) toast.info(data.message);
      else toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Google login failed!");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center p-5 transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-r from-sky-100 via-white to-[#E0F8F5]"
      }`}
    >
      <div
        className={`w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 transition-all duration-500 ${
          isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        {/* Left Feature Panel */}
        <div
          className={`hidden md:flex flex-col justify-center items-center p-10 space-y-6 transition-all duration-500 ${
            isDarkMode
              ? "bg-gradient-to-r from-green-700 to-teal-700 text-gray-100"
              : "bg-gradient-to-r from-green-600 to-teal-600 text-white"
          }`}
        >
          <h2 className="text-4xl font-extrabold">FinEase</h2>
          <p className="text-center text-lg leading-relaxed max-w-md">
            Create an account to start tracking your finances, manage budgets,
            and achieve your goals with FinEase.
          </p>

          <div className="space-y-4 w-full max-w-sm">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <FaChartLine className="text-2xl" />
              <div>
                <p className="font-semibold">Track Everything</p>
                <p className="text-sm opacity-90">
                  Monitor expenses and income in one place.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <FaRegChartBar className="text-2xl" />
              <div>
                <p className="font-semibold">Data Insights</p>
                <p className="text-sm opacity-90">
                  Visualize your spending patterns easily.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <FaShieldAlt className="text-2xl" />
              <div>
                <p className="font-semibold">100% Secure</p>
                <p className="text-sm opacity-90">
                  Your data stays protected with FinEase.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-center">Create Account</h2>
          <p
            className={`text-center mb-6 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Join FinEase and take control of your finances today
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <div
                className={`flex items-center rounded-lg p-3 border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <FaUser className="text-green-600 mr-3" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className={`w-full outline-none bg-transparent ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block mb-1 font-medium">Photo URL</label>
              <div
                className={`flex items-center rounded-lg p-3 border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <FaImage className="text-green-600 mr-3" />
                <input
                  type="text"
                  name="photo"
                  required
                  placeholder="Enter your photo URL"
                  className={`w-full outline-none bg-transparent ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <div
                className={`flex items-center rounded-lg p-3 border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <FaEnvelope className="text-green-600 mr-3" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className={`w-full outline-none bg-transparent ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div
                className={`flex items-center rounded-lg p-3 border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <FaLock className="text-green-600 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Create a password"
                  className={`w-full outline-none bg-transparent ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loadingState}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2.5 rounded-lg font-medium hover:opacity-95 hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <FaUserPlus /> {loadingState ? "Signing Up..." : "Sign Up"}
            </button>

            {/* Google Login */}
            <div className="w-full flex items-center justify-center mt-4">
              <button
                onClick={handleGoogleLogin}
                type="button"
                disabled={loadingState}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-700 text-green-400 hover:bg-gray-600"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                } disabled:opacity-50`}
              >
                <FaGoogle /> {loadingState ? "Processing..." : "Continue with Google"}
              </button>
            </div>

            {/* Login Link */}
            <p
              className={`text-center text-sm mt-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Already have an account?{" "}
              <a
                href="/login"
                className="text-green-700 dark:text-green-400 font-semibold hover:underline"
              >
                Login Now
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
