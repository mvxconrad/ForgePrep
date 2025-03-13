import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import axios from "axios";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({ email: "", username: "", password: "", confirmPassword: "" });

  useEffect(() => {
    // Fetch user data when the page loads
    const fetchUserData = async () => {
      const response = await axios.get("https://forgeprep.net/api/user-profile/", { // Updated API URL
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserData(response.data);
      setFormData({ email: response.data.email, username: response.data.username, password: "", confirmPassword: "" });
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setEditable(!editable);
  };

  const handleSave = async () => {
    // Save updated data
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await axios.put(
      "https://forgeprep.net/api/update-profile/", // Updated API URL
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
            {editable && (
              <>
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </Form.Group>
              </>
            )}
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
