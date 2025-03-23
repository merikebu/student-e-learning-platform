import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Typography, Container, Box, Alert, CircularProgress } from "@mui/material";
import useAuthStore from "../../store/useAuthStore"; // ✅ Zustand store for authentication

// ✅ Validation Schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser); // ✅ Get setUser from Zustand
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Debug Zustand
  console.log("setUser from Zustand:", setUser);
  if (typeof setUser !== "function") {
    console.error("❌ setUser is not a function! Check Zustand store.");
  }

  // ✅ React Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // ✅ Handle Login Submission
  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
        const response = await axios.post("http://localhost:5000/api/auth/login", data, { withCredentials: true });

        console.log("✅ Login successful. Response:", response.data);

        if (response.data && response.data.user) {
            setUser(response.data.user);
            console.log("User role:", response.data.user.role);

            if (response.data.user.role === "tutor") {
                navigate("/admin/dashboard");
            } else {
                navigate("/student/dashboard");
            }
        } else {
            console.error("❌ Invalid response:", response.data);
            setServerError("Invalid response from server.");
        }
    } catch (error) {
        console.error("❌ Login error:", error.response?.data || error.message);
        setServerError(error.response?.data?.message || "Login failed");
    } finally {
        setLoading(false);
    }
};

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} textAlign="center">
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {serverError && <Alert severity="error">{serverError}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>

        {/* ✅ Forgot Password */}
        <Typography variant="body2" mt={2}>
          <Button onClick={() => navigate("/forgot-password")}>Forgot Password?</Button>
        </Typography>

        <Typography variant="body2" mt={2}>
          Don't have an account? <Button onClick={() => navigate("/register")}>Register</Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;