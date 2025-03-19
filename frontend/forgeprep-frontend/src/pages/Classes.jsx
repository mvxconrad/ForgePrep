import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Card } from "react-bootstrap";
import classesImage from "../assets/classroom.jpg"; // Import the image

const Classes = () => {
  const [classes, setClasses] = useState([]); // Initialize as an empty array
  const [newClass, setNewClass] = useState("");
  const [syllabus, setSyllabus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("https://forgeprep.net/study_sets/"); // Updated API URL

        if (!response.ok) {
          const errorText = await response.text(); // Read the response as text
          console.error("Error response:", errorText); // Log the error response
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setClasses(data);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError(err.message);
      }
    };

    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    if (!newClass) return;

    const formData = new FormData();
    formData.append("title", newClass);
    formData.append("description", ""); // Add description if needed
    if (syllabus) formData.append("syllabus", syllabus);

    try {
      const response = await fetch("https://forgeprep.net/study_sets/", { // Updated API URL
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        console.error("Error response:", errorText); // Log the error response
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedClass = await response.json();
      setClasses([...classes, addedClass]);
      setNewClass("");
      setSyllabus(null);
    } catch (err) {
      console.error("Error adding class:", err);
      setError(err.message);
    }
  };

  const handleRemoveClass = async (id) => {
    try {
      const response = await fetch(`https://forgeprep.net/study_sets/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        console.error("Error response:", errorText); // Log the error response
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setClasses(classes.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error removing class:", err);
      setError(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Classes</h2>
      {error && <p className="text-danger">{error}</p>}
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
                      {c.title}
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
}

export default Classes;
