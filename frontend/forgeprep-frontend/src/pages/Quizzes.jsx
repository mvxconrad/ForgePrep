import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Card } from "react-bootstrap";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState("");
  const [className, setClassName] = useState("");
  const [template, setTemplate] = useState("");

  useEffect(() => {
    fetch("https://forgeprep.net/api/quizzes/")  // ✅ Fix API URL
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((err) => console.error("Error fetching quizzes:", err));
  }, []);

  const handleAddQuiz = async () => {
    if (!newQuiz || !className || !template) return;

    const response = await fetch("https://forgeprep.net/api/quizzes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newQuiz, className, template }),
    });

    if (response.ok) {
      const addedQuiz = await response.json();
      setQuizzes([...quizzes, addedQuiz]);
      setNewQuiz("");
      setClassName("");
      setTemplate("");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Quizzes</h2>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Add New Quiz</Card.Title>
              <Form>
                <Form.Group controlId="formQuizName" className="mb-3">
                  <Form.Label>Quiz Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter quiz name"
                    value={newQuiz}
                    onChange={(e) => setNewQuiz(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formClassName" className="mb-3">
                  <Form.Label>Class Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter class name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formTemplate" className="mb-3">
                  <Form.Label>Template</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter template"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  />
                </Form.Group>
                <Button onClick={handleAddQuiz}>Add Quiz</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Quiz List</Card.Title>
              <ListGroup>
                {quizzes.map((q) => (
                  <ListGroup.Item key={q.id}>
                    {q.name} - {q.className} ({q.template})
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

export default Quizzes;
