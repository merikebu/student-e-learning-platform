import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import Grid from '@mui/material/Grid2'; // Import Grid2
import axios from "axios";
import Cookies from "js-cookie";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/student/submissions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
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
        Submissions
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <List>
              {submissions.map((submission) => (
                <ListItem key={submission._id} divider>
                  <ListItemText primary={submission.assignmentTitle} secondary={`Status: ${submission.status}`} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Submissions;