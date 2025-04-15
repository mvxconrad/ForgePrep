import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import axios from "axios";

const StudySetsPage = () => {
  const [studySets, setStudySets] = useState([]);
  const [error, setError] = useState("");

  const fetchStudySets = async () => {
    try {
      const response = await axios.get("https://forgeprep.net/api/study_sets/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStudySets(response.data);
    } catch (err) {
      console.error("Error fetching study sets:", err);
      setError("Failed to load study sets. Please try again.");
    }
  };

  useEffect(() => {
    fetchStudySets();
  }, []);

  return (
    <Container className="mt-4">
      <h1>Study Sets</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studySets.length > 0 ? (
            studySets.map((set) => (
              <tr key={set.id}>
                <td>{set.title}</td>
                <td>{set.description}</td>
                <td>
                  <Button variant="primary" className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger">Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No study sets available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default StudySetsPage;