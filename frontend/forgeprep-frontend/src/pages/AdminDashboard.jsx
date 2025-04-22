import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [studySets, setStudySets] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("https://forgeprep.net/api/admin/data", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setUsers(response.data.users || []);
        setStudySets(response.data.studySets || []);
        setFiles(response.data.files || []);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    setError("");
    fetchAdminData();
  }, []);

  return (
    <PageWrapper>
      <Container className="mt-4">
        <h1>Admin Dashboard</h1>
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <h2>Manage Users</h2>
            <Table striped bordered hover>
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
                      <Button variant="danger" size="sm">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </PageWrapper>
  );
};

export default AdminDashboard;