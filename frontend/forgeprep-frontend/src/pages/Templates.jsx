import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Card } from "react-bootstrap";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState("");

  useEffect(() => {
    fetch("http://your-backend-url/api/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => console.error("Error fetching templates:", err));
  }, []);

  const handleAddTemplate = async () => {
    if (!newTemplate) return;

    const response = await fetch("http://your-backend-url/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTemplate }),
    });

    if (response.ok) {
      const addedTemplate = await response.json();
      setTemplates([...templates, addedTemplate]);
      setNewTemplate("");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Templates</h2>
      <Row>
        <Col md={6}>
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
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Template List</Card.Title>
              <ListGroup>
                {templates.map((t) => (
                  <ListGroup.Item key={t.id}>{t.name}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Templates;
