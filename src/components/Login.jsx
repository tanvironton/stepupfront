import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLoginUserMutation } from "../redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/auth/authSlice";
import useSweetAlert from "@/hooks/useSweetAlert";
import toast from "react-hot-toast";

const Login = () => {
  const params = useSearchParams();
  const p = new URLSearchParams(params[0]);
  const { showSuccess } = useSweetAlert();

  const from = p.get("from");

  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const onSubmit = async (data) => {
    // console.log(data)
    try {
      const response = await loginUser(data).unwrap();

      const { token, user } = response;
      dispatch(setUser({ user }));

      if (user) {
        toast.success("Login successfuly");
        // showSuccess(undefined, "Login Successfuly", undefined);

        if (user?.role === "admin") {
          navigate("/dashboard/admin");
          window.location.reload();
        } else {
          navigate(from ? from : "/dashboard");
        }
      }
    } catch (error) {
      setMessage("Please Provide a valid email and password!");
    }
  };
  return (
    <section className="h-screen flex items-center justify-center p-2">
      <div className="shadow bg-white p-8 max-w-sm mx-auto">
        <h2 className="text-2xl font-semibold pt-5">Please Login!</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 max-w-sm mx-auto pt-6"
        >
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email"
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
          />
          {errors.email && <p className="text-red-500">Email is required</p>}
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
          />

          {errors.password && (
            <p className="text-red-500">Password is required</p>
          )}

          {message && <p className="text-red-500">{message}</p>}
          <button className="w-full mt-5 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-md">
            Login
          </button>
        </form>
        <div className="my-5 italic text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link
            to={`/register`}
            className="text-red-700 px-1 underline cursor-pointer"
          >
            Register
          </Link>{" "}
          here.
        </div>
      </div>
    </section>
  );
};

export default Login;
