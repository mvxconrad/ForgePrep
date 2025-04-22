import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, ListGroup, Alert } from "react-bootstrap";
import api from "../util/apiService"; // Centralized API service

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get("/templates/");
        setTemplates(response.data);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to load templates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleAddTemplate = async () => {
    if (!newTemplate) return;

    try {
      const response = await api.post("/templates/", { name: newTemplate });
      setTemplates([...templates, response.data]);
      setNewTemplate("");
    } catch (err) {
      console.error("Error adding template:", err);
      setError("Failed to add template. Please try again.");
    }
  };

  const handleRemoveTemplate = async (id) => {
    try {
      await api.delete(`/templates/${id}`);
      setTemplates(templates.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error removing template:", err);
      setError("Failed to remove template. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <p>Loading templates...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Templates</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Add New Template</Card.Title>
          <Form>
            <Form.Group controlId="formTemplateName" className="mb-3">
              <Form.Label>New Template Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter template name"
                value={newTemplate}
                onChange={(e) => setNewTemplate(e.target.value)}
              />
            </Form.Group>
            <Button onClick={handleAddTemplate}>Add Template</Button>
          </Form>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Template List</Card.Title>
          <ListGroup>
            {templates.length > 0 ? (
              templates.map((t) => (
                <ListGroup.Item key={t.id}>
                  {t.name}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveTemplate(t.id)}
                    className="float-end"
                  >
                    Remove
                  </Button>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No templates available</ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Templates;
