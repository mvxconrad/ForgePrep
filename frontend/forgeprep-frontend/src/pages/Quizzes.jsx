import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Card } from "react-bootstrap";
import quizzesImage from "../assets/quiz.png"; // Import the image

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]); // Initialize as an empty array
  const [newQuiz, setNewQuiz] = useState("");
  const [className, setClassName] = useState("");
  const [template, setTemplate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("https://forgeprep.net/quizzes/"); // ✅ Fix API URL

        if (!response.ok) {
          const errorText = await response.text(); // Read the response as text
          console.error("Error response:", errorText); // Log the error response
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError(err.message);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAddQuiz = async () => {
    if (!newQuiz || !className || !template) return;

    try {
      const response = await fetch("https://forgeprep.net/quizzes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newQuiz, className, template }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        console.error("Error response:", errorText); // Log the error response
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedQuiz = await response.json();
      setQuizzes([...quizzes, addedQuiz]);
      setNewQuiz("");
      setClassName("");
      setTemplate("");
    } catch (err) {
      console.error("Error adding quiz:", err);
      setError(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Quizzes</h2>
      {error && <p className="text-danger">{error}</p>}
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <img src={quizzesImage} alt="Quizzes" style={{ width: "150px" }} />
              </div>
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
                {quizzes.length > 0 ? (
                  quizzes.map((q) => (
                    <ListGroup.Item key={q.id}>
                      {q.name} - {q.className} ({q.template})
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No quizzes available</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Quizzes;
