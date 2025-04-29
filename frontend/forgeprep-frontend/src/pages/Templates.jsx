import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, ListGroup, Alert, Spinner } from "react-bootstrap";
import api from "../util/apiService";
import styles from "./Dashboard.module.css"; // For glassCard styling
import backgroundImage from "../assets/background_abstract2.png";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState("");
  const [error, setError] = useState("");
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
    } catch (err) {
      console.error("Error removing template:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to remove template. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        className="bg-dark text-light"
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container className="mt-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </div>
    );
  }

  return (
    <div
      className="bg-dark text-light"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container className="py-5">
        <Card className={`${styles.glassCard} p-4 border-0 shadow-lg`}>
          <h2 className="fw-bold text-white mb-4">📄 Manage Templates</h2>
          {error && <Alert variant="danger" className="fw-semibold">{error}</Alert>}

          <Card className={`${styles.glassCard} p-4 border-0 shadow-lg mb-4`}>
            <Card.Body>
              <Card.Title className="text-white fw-bold">Add New Template</Card.Title>
              <Form>
                <Form.Group controlId="formTemplateName" className="mb-3">
                  <Form.Label className="text-white fw-semibold">Template Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter template name"
                    value={newTemplate}
                    onChange={(e) => setNewTemplate(e.target.value)}
                  />
                </Form.Group>
                <Button onClick={handleAddTemplate} className="w-100 fw-semibold btn-light text-dark">
                  Add Template
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className={`${styles.glassCard} p-4 border-0 shadow-lg`}>
            <Card.Body>
              <Card.Title className="text-white fw-bold">Template List</Card.Title>
              <ListGroup>
                {templates.length > 0 ? (
                  templates.map((t) => (
                    <ListGroup.Item key={t.id} className="bg-transparent text-white">
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
                  <ListGroup.Item className="text-muted">No templates available</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Card>
      </Container>
    </div>
  );
};

export default Templates;
