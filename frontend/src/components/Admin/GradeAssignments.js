import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";

export default function GradeAssignments() {
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/submissions")
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleGrade = (id) => {
    axios.post("http://localhost:5000/api/admin/grade", { id, grade: grades[id] })
      .then(() => alert("Grade submitted successfully!"))
      .catch((err) => console.error(err));
  };

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <h2>Grade Assignments</h2>
        <List>
          {submissions.map((submission) => (
            <ListItem key={submission._id}>
              <ListItemText primary={`Student: ${submission.studentName} - ${submission.assignmentTitle}`} />
              <TextField type="number" label="Grade" onChange={(e) => setGrades({ ...grades, [submission._id]: e.target.value })} />
              <Button onClick={() => handleGrade(submission._id)} variant="contained" color="primary">Submit</Button>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}