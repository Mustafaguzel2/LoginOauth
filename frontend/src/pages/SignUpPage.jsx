"use client";
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Input from "../components/Input";
import { User, Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate("/email-verification");
      toast.success("Sign up successful");
    } catch (error) {
      console.error("Sign up failed:", error);
      toast.error(error.response.data.error);
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
          Create an account
        </h2>
        <form onSubmit={handleSignUp} className="w-full">
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            className="mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

          <PasswordStrengthMeter password={password} />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <motion.button
            type="submit"
            className="mt-5 w-full py-3 px-4 rounded-lg 
            bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold
            hover:from-green-600 hover:to-emerald-700 transition duration-300 
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
            focus:ring-offset-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl justify-center">
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-green-400 hover:text-emerald-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default SignUpPage;
