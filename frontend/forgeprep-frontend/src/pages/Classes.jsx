import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Card, Alert, Spinner } from "react-bootstrap";
import api from "../util/apiService";
import classesImage from "../assets/classroom.jpg";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState("");
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get("/classes/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data && response.data.length > 0) {
          setClasses(response.data);
        } else {
          setError("No classes available.");
        }
      } catch (err) {
        console.error("Error fetching classes:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    if (!newClass.trim()) {
      setError("Class name cannot be empty.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newClass);
    if (syllabus) formData.append("syllabus", syllabus);

    try {
      const response = await api.post("/classes/", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClasses([...classes, response.data]);
      setNewClass("");
      setSyllabus(null);
      setMessage("Class added successfully!");
      setError("");
    } catch (err) {
      console.error("Error adding class:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add class. Please try again.");
    }
  };

  const handleRemoveClass = async (id) => {
    try {
      await api.delete(`/classes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClasses(classes.filter((c) => c.id !== id));
      setMessage("Class removed successfully!");
    } catch (err) {
      console.error("Error removing class:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to remove class. Please try again.");
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
      <h2>Classes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <img src={classesImage} alt="Classes" style={{ width: "150px" }} />
              </div>
              <Card.Title>Add New Class</Card.Title>
              <Form>
                <Form.Group controlId="formClassName" className="mb-3">
                  <Form.Label>New Class Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter class name"
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formSyllabus" className="mb-3">
                  <Form.Label>Syllabus</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setSyllabus(e.target.files[0])}
                  />
                </Form.Group>
                <Button onClick={handleAddClass}>Add Class</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Class List</Card.Title>
              <ListGroup>
                {classes.length > 0 ? (
                  classes.map((c) => (
                    <ListGroup.Item key={c.id}>
                      {c.name}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveClass(c.id)}
                        className="float-end"
                      >
                        Remove
                      </Button>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-muted">No classes available.</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Classes;
