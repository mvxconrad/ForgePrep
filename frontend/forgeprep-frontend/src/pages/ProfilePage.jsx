import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import axios from "axios";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({ email: "", username: "" });

  useEffect(() => {
    // Fetch user data when the page loads
    const fetchUserData = async () => {
      const response = await axios.get("/api/user-profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserData(response.data);
      setFormData({ email: response.data.email, username: response.data.username });
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setEditable(!editable);
  };

  const handleSave = async () => {
    // Save updated data
    await axios.put(
      "/api/update-profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setEditable(false);
  };

  return (
    <Container className="mt-4">
      <h1>Profile</h1>
      <Card className="p-3">
        <Card.Body>
          <Card.Title>{editable ? "Edit Profile" : "Profile"}</Card.Title>
          <Form>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editable ? formData.username : userData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!editable}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editable ? formData.email : userData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editable}
              />
            </Form.Group>
            <Button variant="primary" onClick={editable ? handleSave : handleEdit}>
              {editable ? "Save" : "Edit"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
