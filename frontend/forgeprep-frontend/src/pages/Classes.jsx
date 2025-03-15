import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Card } from "react-bootstrap";
import classesImage from "../assets/classroom.jpg"; // Import the image

const Classes = () => {
  const [classes, setClasses] = useState([]); // Initialize as an empty array
  const [newClass, setNewClass] = useState("");
  const [syllabus, setSyllabus] = useState(null);

  useEffect(() => {
    // Mock data for testing
    const mockClasses = [
      { id: 1, name: "Math 101" },
      { id: 2, name: "Science 101" },
      { id: 3, name: "History 101" },
    ];

    setClasses(mockClasses);
  }, []);

  const handleAddClass = async () => {
    if (!newClass) return;

    const formData = new FormData();
    formData.append("name", newClass);
    if (syllabus) formData.append("syllabus", syllabus);

    try {
      const response = await fetch("https://ec2-18-221-47-222.us-east-2.compute.amazonaws.com/api/classes", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedClass = await response.json();
      setClasses([...classes, addedClass]);
      setNewClass("");
      setSyllabus(null);
    } catch (err) {
      console.error("Error adding class:", err);
    }
  };

  const handleRemoveClass = async (id) => {
    try {
      const response = await fetch(`https://ec2-18-221-47-222.us-east-2.compute.amazonaws.com/api/classes/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setClasses(classes.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error removing class:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Classes</h2>
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
                      <Button variant="danger" size="sm" onClick={() => handleRemoveClass(c.id)} className="float-end">Remove</Button>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No classes available</ListGroup.Item>
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
