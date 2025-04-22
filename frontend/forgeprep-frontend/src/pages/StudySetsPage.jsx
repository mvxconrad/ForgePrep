import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Alert } from "react-bootstrap";
import api from "../utils/apiService";
import PageWrapper from "../components/PageWrapper";

const StudySetsPage = () => {
  const [studySets, setStudySets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      <PageWrapper>
        <Container className="mt-4">
          <p>Loading study sets...</p>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
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
    </PageWrapper>
  );
};

export default StudySetsPage;