import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Alert } from "react-bootstrap";
import api from "../utils/apiService"; // Centralized API service

const StudySetsPage = () => {
  const [studySets, setStudySets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFilteredStudySets = async (query) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.STUDY_SETS}?search=${query}`);
      setStudySets(response.data);
    } catch (err) {
      console.error("Error fetching filtered study sets:", err);
      setError("Failed to load study sets. Please try again.");
    }
  };

  useEffect(() => {
    const fetchStudySets = async () => {
      try {
        const response = await api.get("/study_sets/");
        setStudySets(response.data);
      } catch (err) {
        console.error("Error fetching study sets:", err);
        setError("Failed to load study sets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudySets();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4">
        <p>Loading study sets...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Study Sets</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Body>
          <Card.Title>Available Study Sets</Card.Title>
          <ListGroup>
            {studySets.length > 0 ? (
              studySets.map((set) => (
                <ListGroup.Item key={set.id}>{set.name}</ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No study sets available</ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudySetsPage;