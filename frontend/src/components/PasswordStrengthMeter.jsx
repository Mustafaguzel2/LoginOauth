import { Check, X } from "lucide-react";
import React from "react";

export const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains at least one number", met: /\d/.test(password) },
    {
      label: "Contains at least one uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Contains at least one lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "Contains at least one special character",
      met: /[!@#$%^&*]/.test(password),
    },
  ];
  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.met ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <X className="size-4 text-red-500" />
          )}
          <span
            className={`ml-2 ${item.met ? "text-green-500" : "text-red-500"}`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

function PasswordStrengthMeter({ password }) {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[A-Z]/)) strength++;
    if (pass.match(/[0-9]/)) strength++;
    if (pass.match(/[!@#$%^&*]/)) strength++;
    return strength;
  };
  const strength = getStrength(password);

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };
  const getStrengthColor = (strength) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-400";
    return "bg-green-500";
  };
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-400">Password Strength:</span>
        <span className="text-gray-400">{getStrengthText(strength)}</span>
      </div>
      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 
            ${index < strength ? getStrengthColor(strength) : "bg-gray-700"}`}
          ></div>
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
}
export default PasswordStrengthMeter;
