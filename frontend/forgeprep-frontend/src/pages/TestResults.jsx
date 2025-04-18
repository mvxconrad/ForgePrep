import React, { useEffect, useState } from "react";
import axios from "axios";
import PerformanceChart from "../components/PerformanceChart";
import { Container, Table, Card } from "react-bootstrap";
import api from "../utils/apiService"; // Import the centralized API service

const TestResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [performanceData, setPerformanceData] = useState({
    dates: [],
    correct: [],
    incorrect: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTestResults = async (page = 1) => {
    try {
      const response = await api.get(`/test-results/?page=${page}`);
      setTestResults(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error("Error fetching test results:", err);
      setError("Failed to load test results. Please try again.");
    }
  };

  useEffect(() => {
    fetchTestResults();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTestResults(page);
  };

  const filteredResults = testResults.filter((test) =>
    test.testName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p>Loading test results...</p>;
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Test Results</h1>

      {error && (
        <div className="alert alert-danger">
          {error} <br />
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      <Card className="mb-4 p-3">
        <h3>Performance Overview</h3>
        <PerformanceChart performanceData={performanceData} />
      </Card>

      <Card className="p-3 mb-4">
        <h3>Recent Test Results</h3>
        <input
          type="text"
          placeholder="Search by test name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-3 form-control"
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Test Name</th>
              <th>Score</th>
              <th>Correct</th>
              <th>Incorrect</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map((test, index) => (
                <tr key={index}>
                  <td>{new Date(test.date).toLocaleDateString()}</td>
                  <td>{test.testName}</td>
                  <td>{test.score}%</td>
                  <td>{test.correctAnswers}</td>
                  <td>{test.incorrectAnswers}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No test results available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </Container>
  );
};

export default TestResults;