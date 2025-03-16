import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Card } from "react-bootstrap";
import templatesImage from "../assets/template.jpg"; // Import the image

const Templates = () => {
  const [templates, setTemplates] = useState([]); // Initialize as an empty array
  const [newTemplate, setNewTemplate] = useState("");

  useEffect(() => {
    fetch("https://forgeprep.net/templates/")
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => console.error("Error fetching templates:", err));
  }, []);

  const handleAddTemplate = async () => {
    if (!newTemplate) return;

    const response = await fetch("https://forgeprep.net/templates/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTemplate }),
    });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedTemplate = await response.json();
      setTemplates([...templates, addedTemplate]);
      setNewTemplate("");
    } catch (err) {
      console.error("Error adding template:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Templates</h2>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <img src={templatesImage} alt="Templates" style={{ width: "150px" }} />
              </div>
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
                {templates.length > 0 ? (
                  templates.map((t) => (
                    <ListGroup.Item key={t.id}>{t.name}</ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No templates available</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Templates;
