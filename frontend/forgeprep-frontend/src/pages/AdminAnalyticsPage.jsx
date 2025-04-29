import React, { useEffect, useState } from "react";
import { Container, Card, Alert, Spinner } from "react-bootstrap";
import api from "../util/apiService";
import PageWrapper from "../components/PageWrapper";

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/admin/analytics");
        setAnalytics(response.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <Container className="mt-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container className="mt-4">
        <h2>Admin Analytics</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {analytics ? (
          <Card>
            <Card.Body>
              <p><strong>Active Users:</strong> {analytics?.activeUsers || "N/A"}</p>
              <p><strong>Tests Taken:</strong> {analytics?.testsTaken || "N/A"}</p>
              <p><strong>Files Uploaded:</strong> {analytics?.filesUploaded || "N/A"}</p>
            </Card.Body>
          </Card>
        ) : (
          <p>No analytics data available.</p>
        )}
      </Container>
    </PageWrapper>
  );
};

export default AdminAnalyticsPage;