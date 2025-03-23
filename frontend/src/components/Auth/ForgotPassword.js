import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Container, TextField, Button, Typography, Box, Alert, CircularProgress } from "@mui/material";

// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const [serverMessage, setServerMessage] = useState(""); // Stores success or error messages
  const [loading, setLoading] = useState(false);

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Handle Password Reset Request
  const onSubmit = async (data) => {
    setLoading(true);
    setServerMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", data);
      setServerMessage(response.data.message); // Display success message from backend
    } catch (error) {
      setServerMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} textAlign="center">
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>

        {serverMessage && <Alert severity="info">{serverMessage}</Alert>}

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

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Reset Password"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
