import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, register as registerThunk } from "./features/authSlice";
import api from "./api/api.js";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
   
try {
  if (isLogin) {
    // Login: username & password

   const res = await dispatch(
                          login({ username: data.username, password: data.password })           
                          );


if (res.type === "auth/login/fulfilled") {
  navigate("/");
} else if (res.type === "auth/login/rejected") {
  const error = res.payload;
  if (error?.status === 404) {
    alert("User not found. Please register.");
  } else if (error?.status === 401) {
    alert("Invalid credentials. Please try again.");
  } else if (error?.status === 500) {
    alert("Server error. Please try again later.");
  } else if (error?.status === 400) {
    alert("Username or email is required.");
  } else {
    console.log(error?.message || "Something went wrong.");
  }
}


  } else {
    // Registration
    const regData = {
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      password: data.password,
    };

    
      const response = await api.post("users/register", regData);
      const resStatus = response.status;

      if (resStatus === 201) {
        alert("Registration successful! Please login.");
        setIsLogin(true);
        reset();
      }
    
      if (error?.response?.status === 409) {
        alert("Username or email already exists. Please try again.");
      } else if (error?.response?.status === 400) {
        alert("Invalid request. Please check your input.");
      } else if (error?.response?.status === 500) {
        alert("Server error. Please try again later.");
      }
    
  }

  reset();

} catch (err) {
  alert(err?.response?.status || "Something went wrong");
}

   
   
  };

  const inputStyle = {
    width: "100%",
    padding: 8,
    marginTop: 4,
    border: "1px solid #ccc",
    borderRadius: 4,
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>{isLogin ? "Login" : "Register"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {!isLogin && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                {...register("fullName", { required: "Full Name is required" })}
                style={inputStyle}
              />
              {errors.fullName && (
                <p style={{ color: "red" }}>{errors.fullName.message}</p>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email address",
                  },
                })}
                style={inputStyle}
              />
              {errors.email && (
                <p style={{ color: "red" }}>{errors.email.message}</p>
              )}
            </div>
          </>
        )}

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            {...register("username", { required: "Username is required" })}
            style={inputStyle}
          />
          {errors.username && (
            <p style={{ color: "red" }}>{errors.username.message}</p>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            style={inputStyle}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isLogin
            ? isSubmitting
              ? "Logging in..."
              : "Login"
            : isSubmitting
            ? "Registering..."
            : "Register"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 16 }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            reset();
          }}
          style={{
            color: "#007bff",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
            fontSize: "inherit",
          }}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}
