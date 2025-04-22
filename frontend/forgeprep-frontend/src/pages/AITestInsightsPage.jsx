import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import axios from "axios";

const AITestInsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("https://forgeprep.net/api/ai/insights", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInsights(response.data);
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setError("Failed to load AI insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <h2>AI Test Insights</h2>
      {error && <p className="text-danger">{error}</p>}
      <Card>
        <Card.Body>
          <ListGroup>
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <ListGroup.Item key={index}>
                  <strong>Topic:</strong> {insight.topic || "Unknown"} <br />
                  <strong>Created At:</strong> {new Date(insight.created_at).toLocaleString()} <br />
                  <strong>Questions:</strong> {insight.questions.length} questions
                </ListGroup.Item>
              ))
            ) : (
              <p>No insights available.</p>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AITestInsightsPage;