import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";

export default function ViewResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/results")
      .then((res) => setResults(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <h2>View Results</h2>
        <List>
          {results.map((result) => (
            <ListItem key={result._id}>
              <ListItemText primary={`Student: ${result.studentName} - Marks: ${result.marks}`} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}