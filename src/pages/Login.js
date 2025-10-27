import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({ ...preve, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      await fetchUserDetails();
      await fetchUserAddToCart();
      navigate("/");
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  return (
    <section
      id="login"
      className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-full bg-red-50 text-red-600 text-6xl">
            <FaUserCircle />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-2 text-slate-700">
          Welcome Back
        </h2>
        <p className="text-center text-slate-500 mb-6 text-sm">
          Please login to your account
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-slate-600 text-sm font-medium">Email</label>
            <div className="relative mt-1">
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                placeholder="Enter your email"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 text-sm font-medium">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition pr-10"
              />
              <div
                className="absolute right-3 top-2.5 text-lg text-slate-500 cursor-pointer hover:text-red-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <Link
              to="/forgot-password"
              className="block w-fit ml-auto text-sm text-slate-500 hover:text-red-600 hover:underline mt-1"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-xl transition-transform transform hover:scale-[1.03] mt-4"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/sign-up"
            className="text-red-600 hover:text-red-700 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
