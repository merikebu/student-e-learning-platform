import React, { useEffect, useState } from "react";
import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import axios from "axios";
import Cookies from "js-cookie";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/student/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
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
        Notifications
      </Typography>

      <Grid container spacing={2}>
        {notifications.length > 0 ? (
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={notification.message} secondary={new Date(notification.date).toLocaleString()} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No new notifications.</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default Notifications;