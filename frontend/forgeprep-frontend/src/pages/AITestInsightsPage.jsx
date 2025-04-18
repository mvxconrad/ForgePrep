import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import axios from "axios";

const AITestInsightsPage = () => {
  const [insights, setInsights] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState([]);

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("https://forgeprep.net/api/ai/insights", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Ensure the response is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setInsights(data);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setError("Failed to fetch AI insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/admin/analytics");
      setAnalytics(response.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
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
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
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
      )}
    </Container>
  );
};

export default AITestInsightsPage;