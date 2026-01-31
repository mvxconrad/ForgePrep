import React, { useState, useEffect } from "react";
import { Container, Card, Button, ListGroup, ProgressBar, Alert } from "react-bootstrap";
import api from "../util/apiService";
import PageWrapper from "../components/PageWrapper";

const StudySetDetailsPage = ({ studySetId }) => {
  const [studySet, setStudySet] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudySet = async () => {
      try {
        const response = await api.get(`/study_sets/${studySetId}`);
        setStudySet(response.data);
      } catch (err) {
        console.error("Error fetching study set:", err);
        setError("Failed to load study set details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudySet();
  }, [studySetId]);

  const handleGenerateQuestions = async () => {
    try {
      const prompt = `Generate questions for study set ID: ${studySetId}`;
      const response = await api.post("/gpt/generate", { prompt });
      setGeneratedQuestions(response.data.questions);
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Failed to generate questions. Please try again.");
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container className="mt-4">
          <p>Loading study set details...</p>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container className="mt-4">
        {error && <Alert variant="danger">{error}</Alert>}
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
          <p>No study set details available.</p>
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
    </PageWrapper>
  );
};

export default StudySetDetailsPage;