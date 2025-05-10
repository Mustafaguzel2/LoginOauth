import React, { useState } from "react";
import { Mail, Lock, Loader } from "lucide-react";
import Input from "../components/Input";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error: loginError } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Login successful");
    } catch (error) {
      console.error(error);
      toast.error(loginError);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl min-w-[375px] w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl w-full font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Login
        </h2>
        <form onSubmit={handleLogin} className="w-full">
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center">
            <Link
              to="/forgot-password"
              className="text-green-400 hover:text-green-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          {loginError && (
            <p className="text-red-500 text-start mt-2">{loginError}</p>
          )}
          <motion.button
            type="submit"
            className="mt-4 w-full py-3 px-4 rounded-lg 
            bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold
            hover:from-green-600 hover:to-emerald-700 transition duration-300 
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
            focus:ring-offset-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={20} />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl justify-center">
        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            to={"/signup"}
            className="text-green-400 hover:text-emerald-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
