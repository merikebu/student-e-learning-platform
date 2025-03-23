import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import Grid from '@mui/material/Grid2';
import axios from "axios";
import Cookies from "js-cookie";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/student/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
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
        Assignments
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <List>
              {assignments.map((assignment) => (
                <ListItem key={assignment._id} divider>
                  <ListItemText primary={assignment.title} secondary={`Due: ${assignment.dueDate}`} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Assignments;