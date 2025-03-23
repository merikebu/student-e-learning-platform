import React, { useEffect, useState } from "react";
import { Container, Typography, Button, CircularProgress } from "@mui/material";
import Grid from '@mui/material/Grid2'; // Using Grid2 as requested
import axios from "axios";
import Cookies from "js-cookie";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/student/results", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResults(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Student Results", 20, 10);

    const tableColumn = ["Subject", "Score", "Grade"];
    const tableRows = results.map((result) => [
      result.subject,
      result.score,
      result.grade,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Student_Results.pdf");
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
        Student Results
      </Typography>

      <Grid container spacing={2}>
        {results.length > 0 ? (
          results.map((result, index) => (
            <Grid key={index} xs={12} sm={6} md={4}>
              <Typography variant="h6">{result.subject}</Typography>
              <Typography>Score: {result.score}</Typography>
              <Typography>Grade: {result.grade}</Typography>
            </Grid>
          ))
        ) : (
          <Typography>No results available.</Typography>
        )}
      </Grid>

      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={downloadPDF}>
        Download PDF
      </Button>
    </Container>
  );
};

export default Results;