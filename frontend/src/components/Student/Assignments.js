import React, { useEffect, useState } from "react";
import { 
  Container, Paper, Typography, CircularProgress, 
  List, ListItem, ListItemText, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions 
} from "@mui/material";
import Grid2 from "@mui/material/Grid2"; // Grid2 from MUI
import useStudentStore from "../../store/useStudentStore";

const Assignments = () => {
  const [loading, setLoading] = useState(true);
  const { assignments, fetchAssignments } = useStudentStore();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  useEffect(() => {
    const loadAssignments = async () => {
      await fetchAssignments();
      setLoading(false);
    };
    
    loadAssignments();
  }, []); // Avoid unnecessary re-fetches

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
  };

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
        <Grid2 container spacing={2}>
          <Grid2 xs={12}>
            <List>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <ListItem key={assignment._id} divider>
                    <ListItemText
                      primary={assignment.title}
                      secondary={`Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    />
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleViewAssignment(assignment)}
                    >
                      View
                    </Button>
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                  No assignments available.
                </Typography>
              )}
            </List>
          </Grid2>
        </Grid2>
      </Paper>

      {/* Assignment Details Modal */}
      <Dialog open={!!selectedAssignment} onClose={handleCloseModal} fullWidth maxWidth="sm">
        {selectedAssignment && (
          <>
            <DialogTitle>{selectedAssignment.title}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Description:</strong> {selectedAssignment.description}
              </Typography>
              <Typography variant="body2">
                <strong>Due Date:</strong> {new Date(selectedAssignment.dueDate).toLocaleDateString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="secondary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Assignments;