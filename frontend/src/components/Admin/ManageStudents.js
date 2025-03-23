import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { 
  Button, TextField, List, ListItem, ListItemText, IconButton, 
  Paper, Typography, Divider, Snackbar, Alert 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddStudent = () => {
    if (!name || !email) {
      setAlert({ open: true, message: "Name and Email are required!", severity: "error" });
      return;
    }

    axios.post("http://localhost:5000/api/admin/students", { name, email })
      .then((res) => {
        setStudents([...students, res.data]);
        setName("");
        setEmail("");
        setAlert({ open: true, message: "Student added successfully!", severity: "success" });
      })
      .catch((err) => console.error(err));
  };

  const handleRemoveStudent = (id) => {
    axios.delete("http://localhost:5000/api/admin/students/${id}")
      .then(() => {
        setStudents(students.filter((s) => s._id !== id));
        setAlert({ open: true, message: "Student removed successfully!", severity: "info" });
      })
      .catch((err) => console.error(err));
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid xs={12}>
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: "auto" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Manage Students
          </Typography>
          
          <TextField 
            label="Student Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            fullWidth 
            margin="normal" 
          />
          
          <TextField 
            label="Student Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            fullWidth 
            margin="normal" 
          />
          
          <Button 
            onClick={handleAddStudent} 
            variant="contained" 
            color="primary" 
            fullWidth
          >
            Add Student
          </Button>

          <Divider sx={{ marginY: 2 }} />

          <Typography variant="h6" align="center">
            Student List
          </Typography>

          <List>
            {students.map((student) => (
              <ListItem key={student._id} 
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemoveStudent(student._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <ListItemText 
                  primary={student.name} 
                  secondary={student.email} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      <Snackbar 
        open={alert.open} 
        autoHideDuration={3000} 
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}