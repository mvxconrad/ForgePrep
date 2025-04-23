import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, ListGroup, Alert, Spinner } from "react-bootstrap";
import api from "../util/apiService";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get("/templates/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data && response.data.length > 0) {
          setTemplates(response.data);
        } else {
          setError("No templates available.");
        }
      } catch (err) {
        console.error("Error fetching templates:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load templates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleAddTemplate = async () => {
    if (!newTemplate.trim()) {
      setError("Template name cannot be empty.");
      return;
    }

    try {
      const response = await api.post("/templates/", { name: newTemplate }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTemplates([...templates, response.data]);
      setNewTemplate("");
      setMessage("Template added successfully!");
      setError("");
    } catch (err) {
      console.error("Error adding template:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add template. Please try again.");
    }
  };

  const handleRemoveTemplate = async (id) => {
    try {
      await api.delete(`/templates/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTemplates(templates.filter((t) => t.id !== id));
      setMessage("Template removed successfully!");
    } catch (err) {
      console.error("Error removing template:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to remove template. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Templates</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
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
              <ListGroup.Item className="text-muted">No templates available.</ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Templates;
