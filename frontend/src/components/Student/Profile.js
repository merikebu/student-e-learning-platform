import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, CircularProgress } from "@mui/material";
import Grid from '@mui/material/Grid2'; // Import Grid2
import axios from "axios";
import Cookies from "js-cookie";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        Profile
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Typography variant="h6">Name: {profile?.name}</Typography>
          </Grid>
          <Grid xs={12}>
            <Typography variant="h6">Email: {profile?.email}</Typography>
          </Grid>
          <Grid xs={12}>
            <Typography variant="h6">Enrolled Courses: {profile?.courses?.length}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;