import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response = await fetch("https://forgeprep.net/api/admin/analytics");
      const data = await response.json();
      setAnalytics(data);
    };

    fetchAnalytics();
  }, []);

  return (
    <Container className="mt-4">
      <h2>Admin Analytics</h2>
      {analytics ? (
        <Card>
          <Card.Body>
            <p><strong>Active Users:</strong> {analytics.activeUsers}</p>
            <p><strong>Tests Taken:</strong> {analytics.testsTaken}</p>
            <p><strong>Files Uploaded:</strong> {analytics.filesUploaded}</p>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading analytics...</p>
      )}
    </Container>
  );
};

export default AdminAnalyticsPage;