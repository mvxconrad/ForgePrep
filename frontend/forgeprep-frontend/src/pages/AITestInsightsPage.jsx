import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Button } from "react-bootstrap";

const AITestInsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://forgeprep.net/api/ai/insights", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <Container className="mt-4">
      <h2>AI Test Insights</h2>
      {loading ? (
        <p>Loading insights...</p>
      ) : (
        <Card>
          <Card.Body>
            <ListGroup>
              {insights.map((insight, index) => (
                <ListGroup.Item key={index}>{insight}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AITestInsightsPage;