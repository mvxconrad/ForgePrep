import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Card } from "react-bootstrap";

const StudySetsPage = () => {
  const [studySets, setStudySets] = useState([]);
  const [newStudySet, setNewStudySet] = useState({ title: "", description: "" });

  useEffect(() => {
    fetch("https://forgeprep.net/study_sets/")
      .then((res) => res.json())
      .then((data) => setStudySets(data))
      .catch((err) => console.error("Error fetching study sets:", err));
  }, []);

  const handleAddStudySet = async (e) => {
    e.preventDefault();
    if (!newStudySet.title || !newStudySet.description) return;

    try {
      const response = await fetch("https://forgeprep.net/study_sets/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudySet),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedStudySet = await response.json();
      setStudySets([...studySets, addedStudySet]);
      setNewStudySet({ title: "", description: "" });
    } catch (err) {
      console.error("Error adding study set:", err);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h2>Add New Study Set</h2>
              <Form onSubmit={handleAddStudySet}>
                <Form.Group controlId="formStudySetTitle" className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={newStudySet.title}
                    onChange={(e) => setNewStudySet({ ...newStudySet, title: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formStudySetDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    value={newStudySet.description}
                    onChange={(e) => setNewStudySet({ ...newStudySet, description: e.target.value })}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Add Study Set</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2>Study Sets</h2>
              <ListGroup>
                {studySets.length > 0 ? (
                  studySets.map((set) => (
                    <ListGroup.Item key={set.id}>
                      {set.title} - {set.description}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No study sets available</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudySetsPage;