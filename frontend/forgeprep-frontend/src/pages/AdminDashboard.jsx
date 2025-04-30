import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert, Card } from "react-bootstrap";
import axios from "axios";
import styles from "./Dashboard.module.css"; // For glassCard styling
import backgroundImage from "../assets/background_abstract2.png";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true); // Start loading as true initially
  const [error, setError] = useState("");

  // Check if the user is an admin
  const checkAdmin = async () => {
    try {
      const response = await axios.get("/api/auth/me", { withCredentials: true });
      if (!response.data.is_admin) {
        window.location.href = "/login"; // Redirect if not admin
      }
    } catch (err) {
      console.error("Authorization error:", err);
      window.location.href = "/login"; // Redirect on error
    }
  };

  // Fetch data after confirming admin status
  const fetchAdminData = async () => {
    try {
      const response = await axios.get("/api/admin/data", { withCredentials: true });
      setUsers(response.data.users || []);
      setFiles(response.data.files || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to load admin data. Please try again.");
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  useEffect(() => {
    checkAdmin(); // Check if the user is an admin
  }, []);

  useEffect(() => {
    if (!loading) fetchAdminData(); // Fetch admin data only after the user has been confirmed as admin
  }, [loading]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/users/${userId}`, { withCredentials: true });
        setUsers(users.filter((user) => user.id !== userId)); // Remove user from state
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`/api/files/${fileId}`, { withCredentials: true });
      setFiles(files.filter((file) => file.id !== fileId)); // Remove file from state
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file. Please try again.");
    }
  };

  return (
    <div
      className="bg-dark text-light"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container className="py-5">
        <Card className={`${styles.glassCard} p-4 border-0 shadow-lg`}>
          <h1 className="fw-bold text-white mb-4">Admin Dashboard</h1>
          {error && <Alert variant="danger" className="fw-semibold">{error}</Alert>}

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {/* Manage Users */}
              <Card className={`${styles.glassCard} p-4 border-0 shadow-lg mb-4`}>
                <Card.Body>
                  <Card.Title className="text-white fw-bold">Manage Users</Card.Title>
                  <Table striped bordered hover variant="dark" className="mt-3">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Manage Files */}
              <Card className={`${styles.glassCard} p-4 border-0 shadow-lg`}>
                <Card.Body>
                  <Card.Title className="text-white fw-bold">Manage Files</Card.Title>
                  <Table striped bordered hover variant="dark" className="mt-3">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Filename</th>
                        <th>Uploaded At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file) => (
                        <tr key={file.id}>
                          <td>{file.id}</td>
                          <td>{file.filename}</td>
                          <td>{new Date(file.uploaded_at).toLocaleString()}</td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default AdminDashboard;
