import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { 
  Paper, Typography, TextField, Button, Snackbar, Alert 
} from "@mui/material";
import axios from "axios";

export default function ViewSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/submissions")
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleGradeSubmission = () => {
    if (!grade) {
      setAlert({ open: true, message: "Please enter a grade!", severity: "error" });
      return;
    }

    axios.post("http://localhost:5000/api/admin/grade", {
      submissionId: selectedSubmission._id,
      grade,
    })
    .then(() => {
      setAlert({ open: true, message: "Grade submitted successfully!", severity: "success" });
      setGrade("");
    })
    .catch((err) => console.error(err));
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Student Submissions
          </Typography>
          {submissions.length === 0 ? (
            <Typography>No submissions yet.</Typography>
          ) : (
            <ul>
              {submissions.map((submission) => (
                <li 
                  key={submission._id} 
                  style={{ cursor: "pointer", marginBottom: 10 }}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  {submission.studentName} - {submission.assignmentTitle}
                </li>
              ))}
            </ul>
          )}
        </Paper>
      </Grid>

      {selectedSubmission && (
        <>
          {/* Left side - PDF Viewer */}
          <Grid xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>
                Submitted PDF
              </Typography>
              <iframe 
                src={`http://localhost:5000/uploads/${selectedSubmission.filePath}`} 
                width="100%" 
                height="500px"
                title="PDF Viewer"
              />
            </Paper>
          </Grid>

          {/* Right side - Grading Section */}
          <Grid xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h6" gutterBottom>
                Grade Submission
              </Typography>
              <TextField 
                label="Enter Grade" 
                type="number" 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)} 
                fullWidth 
                margin="normal"
              />
              <Button 
                onClick={handleGradeSubmission} 
                variant="contained" 
                color="primary" 
                fullWidth
              >
                Submit Grade
              </Button>
            </Paper>
          </Grid>
        </>
      )}

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