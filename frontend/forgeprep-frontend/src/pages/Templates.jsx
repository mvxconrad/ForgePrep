import React, { useState, useEffect } from "react";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState("");

  useEffect(() => {
    fetch("http://your-backend-url/api/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => console.error("Error fetching templates:", err));
  }, []);

  const handleAddTemplate = async () => {
    if (!newTemplate) return;

    const response = await fetch("http://your-backend-url/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTemplate }),
    });

    if (response.ok) {
      const addedTemplate = await response.json();
      setTemplates([...templates, addedTemplate]);
      setNewTemplate("");
    }
  };

  return (
    <div>
      <h2>Templates</h2>
      <ul>
        {templates.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
      <input type="text" placeholder="New Template Name" value={newTemplate} onChange={(e) => setNewTemplate(e.target.value)} />
      <button onClick={handleAddTemplate}>Add Template</button>
    </div>
  );
};

export default Templates;
