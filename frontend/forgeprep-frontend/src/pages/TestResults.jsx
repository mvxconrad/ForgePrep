import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";

const TestResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await fetch("https://forgeprep.net/api/tests/results", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchTestResults();
  }, []);

  return (
    <Container className="mt-4">
      <h1>Test Results</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Score</th>
            <th>Time Taken</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{result.name}</td>
              <td>{result.score}%</td>
              <td>{result.timeTaken} mins</td>
              <td>{new Date(result.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TestResults;