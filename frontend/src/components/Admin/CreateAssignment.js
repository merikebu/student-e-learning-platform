import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import {
  Paper,
  Button,
  Typography,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import useAdminStore from "../../store/useAdminStore";

export default function CreateAssignment() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  const { assignments, fetchAssignments, createAssignment, updateAssignment, deleteAssignment } = useAdminStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleOpen = (assignment = null) => {
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description);
      setDueDate(assignment.dueDate.split("T")[0]);
      setEditingId(assignment._id);
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate) {
      setAlert({ open: true, message: "All fields are required!", severity: "error" });
      return;
    }

    try {
      if (editingId) {
        await updateAssignment(editingId, { title, description, dueDate });
        setAlert({ open: true, message: "Assignment updated successfully!", severity: "success" });
      } else {
        await createAssignment({ title, description, dueDate });
        setAlert({ open: true, message: "Assignment created successfully!", severity: "success" });
      }
      setOpen(false);
    } catch (error) {
      setAlert({ open: true, message: "Error saving assignment!", severity: "error" });
    }
  };

  const handleDelete = async (id) => {
    await deleteAssignment(id);
    setAlert({ open: true, message: "Assignment deleted!", severity: "success" });
  };

  return (
    <Grid2 container spacing={3} justifyContent="center">
      {/* Create New Assignment Button */}
      <Grid2 xs={12} textAlign="center">
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} color="primary">
          Create New Assignment
        </Button>
      </Grid2>

      {/* Assignment List */}
      <Grid2 xs={12} md={6}>
        <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
            Existing Assignments
          </Typography>
          {assignments.length > 0 ? (
            <List>
              {assignments.map((assignment, index) => (
                <React.Fragment key={assignment._id}>
                  <ListItem
                    secondaryAction={
                      <>
                        <IconButton onClick={() => handleOpen(assignment)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(assignment._id)} color="error">
                          <Delete />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={assignment.title}
                      secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < assignments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography textAlign="center" sx={{ mt: 2 }}>
              No assignments available.
            </Typography>
          )}
        </Paper>
      </Grid2>

      {/* Assignment Form Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit Assignment" : "Create Assignment"}</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Grid2>
  );
}