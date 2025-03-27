import React, { useEffect } from "react";
import Grid from "@mui/material/Grid2";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useAdminStore from "../../store/useAdminStore"; // Import Zustand store

export default function ManageStudents() {
  const { students, getStudents, removeStudent } = useAdminStore();
  const [alert, setAlert] = React.useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    getStudents();
  }, [getStudents]);

  const handleRemoveStudent = async (id) => {
    await removeStudent(id);
    setAlert({ open: true, message: "Student removed successfully!", severity: "info" });
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid xs={12}>
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: "auto" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Manage Students
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          <Typography variant="h6" align="center">
            Student List
          </Typography>

          <List>
            {students.length > 0 ? (
              students.map((student) => (
                <ListItem
                  key={student._id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveStudent(student._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                >
                  <ListItemText primary={student.name} secondary={student.email} />
                </ListItem>
              ))
            ) : (
              <Typography align="center" color="textSecondary">
                No students available
              </Typography>
            )}
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