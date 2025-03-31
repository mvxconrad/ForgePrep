import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [studySets, setStudySets] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch("https://forgeprep.net/api/admin/data", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setUsers(data.users);
        setStudySets(data.studySets);
        setFiles(data.files);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <Container className="mt-4">
      <h1>Admin Dashboard</h1>
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
      {/* Add similar sections for study sets and files */}
    </Container>
  );
};

export default AdminDashboard;