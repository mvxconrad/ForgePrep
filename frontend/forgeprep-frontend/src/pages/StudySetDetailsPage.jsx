import React, { useState, useEffect } from "react";
import { Container, Card, Button, ListGroup, ProgressBar } from "react-bootstrap";
import axios from "axios";

const StudySetDetailsPage = ({ studySetId }) => {
  const [studySet, setStudySet] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudySet = async () => {
      const response = await fetch(`https://forgeprep.net/api/study_sets/${studySetId}`);
      const data = await response.json();
      setStudySet(data);
    };

    fetchStudySet();
  }, [studySetId]);

  const handleGenerateQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const prompt = `Generate questions for study set ID: ${studySetId}`;
      const questions = await axios.post(
        "/api/gpt/generate",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGeneratedQuestions(questions.data.questions);
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Failed to generate questions. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      {studySet ? (
        <>
          <h2>{studySet.title}</h2>
          <p>{studySet.description}</p>
          <ProgressBar now={studySet.progress} label={`${studySet.progress}%`} className="mb-4" />
          <Card>
            <Card.Header>Flashcards</Card.Header>
            <Card.Body>
              <ListGroup>
                {studySet.flashcards.map((card) => (
                  <ListGroup.Item key={card.id}>
                    <strong>Q:</strong> {card.question} <br />
                    <strong>A:</strong> {card.answer}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </>
      ) : (
        <p>Loading study set details...</p>
      )}

      <Card className="p-3 mb-4">
        <h3>Generate Questions for this Study Set</h3>
        <Button onClick={handleGenerateQuestions} variant="primary">
          Generate Questions
        </Button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </Card>

      {generatedQuestions.length > 0 && (
        <Card className="p-3">
          <h3>Generated Questions</h3>
          <ListGroup>
            {generatedQuestions.map((question, index) => (
              <ListGroup.Item key={index}>{question}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </Container>
  );
};

export default StudySetDetailsPage;