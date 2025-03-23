import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import { 
  Paper, TextField, Button, Typography, Snackbar, Alert 
} from "@mui/material";
import axios from "axios";

export default function CreateAssignment() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !dueDate) {
      setAlert({ open: true, message: "All fields are required!", severity: "error" });
      return;
    }

    axios.post("http://localhost:5000/api/admin/create-assignment", 
      { title, description, dueDate },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } } // Attach token
    )
    .then(() => {
      setAlert({ open: true, message: "Assignment created successfully!", severity: "success" });
      setTitle("");
      setDescription("");
      setDueDate("");
    })
    .catch((err) => console.error(err));
  };

  return (
    <Grid container justifyContent="center">
      <Grid xs={12} md={6}>
        <Paper 
          elevation={4} 
          sx={{ padding: 4, borderRadius: 2, backgroundColor: "#f9f9f9" }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            Create New Assignment
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              label="Assignment Title" 
              fullWidth 
              variant="outlined" 
              margin="normal" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField 
              label="Description" 
              fullWidth 
              multiline 
              rows={3} 
              variant="outlined" 
              margin="normal" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField 
              label="Due Date" 
              type="date" 
              fullWidth 
              variant="outlined" 
              margin="normal"
              InputLabelProps={{ shrink: true }} 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ marginTop: 2 }}
            >
              Create Assignment
            </Button>
          </form>
        </Paper>
      </Grid>

      <Snackbar 
        open={alert.open} 
        autoHideDuration={3000} 
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert 
          onClose={() => setAlert({ ...alert, open: false })} 
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}