import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // Use Grid2 from MUI v6
import useStudentStore from "../../store/useStudentStore";

const Submissions = () => {
  const { submissions, fetchSubmissions, submitAssignment, deleteSubmission } = useStudentStore();
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [assignmentId, setAssignmentId] = useState("");

  useEffect(() => {
    const loadSubmissions = async () => {
      await fetchSubmissions();
      setLoading(false);
    };

    loadSubmissions();
  }, [fetchSubmissions]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !assignmentId) {
      alert("Please select a PDF and enter an assignment ID.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("assignmentId", assignmentId);

    try {
      await submitAssignment(formData);
      alert("Submission successful!");
      setSelectedFile(null);
      setAssignmentId("");
      await fetchSubmissions(); // Refresh submissions after upload
    } catch (error) {
      console.error("Error uploading submission:", error);
    }
  };

  const handleDelete = async (submissionId) => {
    try {
      await deleteSubmission(submissionId);
      alert("Submission deleted successfully!");
      await fetchSubmissions(); // Refresh submissions after delete
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
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
        Submit Assignment
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <TextField
              fullWidth
              label="Assignment ID"
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpload}>
              Upload PDF
            </Button>
          </Grid>

          <Grid xs={12} sx={{ mt: 3 }}>
            <Typography variant="h6">Your Submissions</Typography>
            <List>
              {submissions.length > 0 ? (
                submissions.map((submission) => (
                  <ListItem key={submission._id} divider>
                    <ListItemText
                      primary={`Assignment: ${submission.assignment?.title || "Unknown"}`}
                      secondary={`Submitted At: ${new Date(submission.submittedAt).toLocaleString()}`}
                    />
                    <Button variant="contained" color="secondary" href={submission.fileUrl} target="_blank" sx={{ mr: 1 }}>
                      View PDF
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(submission._id)}>
                      Delete
                    </Button>
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                  No submissions yet.
                </Typography>
              )}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Submissions;