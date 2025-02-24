import React, { useState, useEffect } from "react";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState("");
  const [syllabus, setSyllabus] = useState(null);

  useEffect(() => {
    fetch("http://your-backend-url/api/classes") // Update with actual API
      .then((res) => res.json())
      .then((data) => setClasses(data))
      .catch((err) => console.error("Error fetching classes:", err));
  }, []);

  const handleAddClass = async () => {
    if (!newClass) return;

    const formData = new FormData();
    formData.append("name", newClass);
    if (syllabus) formData.append("syllabus", syllabus);

    const response = await fetch("http://your-backend-url/api/classes", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const addedClass = await response.json();
      setClasses([...classes, addedClass]);
      setNewClass("");
      setSyllabus(null);
    }
  };

  const handleRemoveClass = async (id) => {
    await fetch(`http://your-backend-url/api/classes/${id}`, { method: "DELETE" });
    setClasses(classes.filter((c) => c.id !== id));
  };

  return (
    <div>
      <h2>Classes</h2>
      <ul>
        {classes.map((c) => (
          <li key={c.id}>
            {c.name} 
            <button onClick={() => handleRemoveClass(c.id)}>⋮</button>
          </li>
        ))}
      </ul>
      <input type="text" placeholder="New Class Name" value={newClass} onChange={(e) => setNewClass(e.target.value)} />
      <input type="file" onChange={(e) => setSyllabus(e.target.files[0])} />
      <button onClick={handleAddClass}>Add Class</button>
    </div>
  );
};

export default Classes;
