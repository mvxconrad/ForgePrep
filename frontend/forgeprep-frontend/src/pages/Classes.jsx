import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Card } from "react-bootstrap";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState("");
  const [syllabus, setSyllabus] = useState(null);

  useEffect(() => {
    fetch("https://forgeprep.net/api/auth/classes/")  // ✅ Fix API URL
      .then((res) => res.json())
      .then((data) => setClasses(data))
      .catch((err) => console.error("Error fetching classes:", err));
  }, []);

  const handleAddClass = async () => {
    if (!newClass) return;

    const formData = new FormData();
    formData.append("name", newClass);
    if (syllabus) formData.append("syllabus", syllabus);

    const response = await fetch("https://forgeprep.net/api/auth/classes/", {  // ✅ Fix API URL
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const addedClass = await response.json();
      setClasses([...classes, addedClass]);
      setNewClass("");
      setSyllabus(null);
    }
  };

  const handleRemoveClass = async (id) => {
    await fetch(`https://forgeprep.net/api/auth/classes/${id}`, { method: "DELETE" });
    setClasses(classes.filter((c) => c.id !== id));
  };

  return (
    <Container className="mt-4">
      <h2>Classes</h2>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
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
                {classes.map((c) => (
                  <ListGroup.Item key={c.id}>
                    {c.name}
                    <Button variant="danger" size="sm" onClick={() => handleRemoveClass(c.id)} className="float-end">Remove</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Classes;
