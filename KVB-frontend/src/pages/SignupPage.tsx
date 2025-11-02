import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, FieldErrors } from "react-hook-form";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  CustomerSignupFormData,
  WorkerSignupFormData,
  AdminSignupFormData,
  SalesSignupFormData,
} from "@/types";

type SignupFormData =
  | CustomerSignupFormData
  | WorkerSignupFormData
  | AdminSignupFormData
  | SalesSignupFormData;

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<
    "customer" | "worker" | "admin" | "sales"
  >("customer");
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data, userType);
      navigate(
        userType === "admin"
          ? "/admin"
          : userType === "worker"
            ? "/worker"
            : userType === "sales"
              ? "/sales"
              : "/crm"
      );
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Sign up as
            </label>
            <div className="flex flex-wrap gap-4">
              {(["customer", "worker", "admin", "sales"] as const).map(
                (type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      value={type}
                      checked={userType === type}
                      onChange={(e) =>
                        setUserType(e.target.value as typeof userType)
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-200 capitalize">
                      {type}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-200"
              >
                Full Name
              </label>
              <input
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                })}
                type="text"
                className="input mt-1"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="input mt-1"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Customer-specific fields */}
            {userType === "customer" && (
              <>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Phone Number
                  </label>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: "Invalid phone number",
                      },
                    })}
                    type="tel"
                    className="input mt-1"
                    placeholder="Enter your phone number"
                  />
                  {userType === "customer" &&
                    (errors as FieldErrors<CustomerSignupFormData>).phone && (
                      <p className="mt-1 text-sm text-red-400">
                        {
                          (errors as FieldErrors<CustomerSignupFormData>).phone
                            .message
                        }
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Address
                  </label>
                  <textarea
                    {...register("address", {
                      required: "Address is required",
                      minLength: {
                        value: 10,
                        message: "Address must be at least 10 characters",
                      },
                    })}
                    className="input mt-1 min-h-[80px] resize-none"
                    placeholder="Enter your address"
                  />
                  {userType === "customer" &&
                    (errors as FieldErrors<CustomerSignupFormData>).address && (
                      <p className="mt-1 text-sm text-red-400">
                        {
                          (errors as FieldErrors<CustomerSignupFormData>)
                            .address.message
                        }
                      </p>
                    )}
                </div>
              </>
            )}

            {/* Worker-specific fields */}
            {userType === "worker" && (
              <div>
                <label
                  htmlFor="specialization"
                  className="block text-sm font-medium text-gray-200"
                >
                  Specialization
                </label>
                <input
                  {...register("specialization", {
                    required: "Specialization is required",
                    minLength: {
                      value: 2,
                      message: "Specialization must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className="input mt-1"
                  placeholder="Enter your specialization"
                />
                {userType === "worker" &&
                  (errors as FieldErrors<WorkerSignupFormData>)
                    .specialization && (
                    <p className="mt-1 text-sm text-red-400">
                      {
                        (errors as FieldErrors<WorkerSignupFormData>)
                          .specialization.message
                      }
                    </p>
                  )}
              </div>
            )}

            {/* Sales-specific fields */}
            {userType === "sales" && (
              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-200"
                >
                  Region
                </label>
                <input
                  {...register("region", {
                    required: "Region is required",
                    minLength: {
                      value: 2,
                      message: "Region must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className="input mt-1"
                  placeholder="Enter your region"
                />
                {userType === "sales" &&
                  (errors as FieldErrors<SalesSignupFormData>).region && (
                    <p className="mt-1 text-sm text-red-400">
                      {
                        (errors as FieldErrors<SalesSignupFormData>).region
                          .message
                      }
                    </p>
                  )}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
