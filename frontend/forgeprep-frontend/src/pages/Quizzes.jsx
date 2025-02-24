import React, { useState, useEffect } from "react";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState("");
  const [className, setClassName] = useState("");
  const [template, setTemplate] = useState("");

  useEffect(() => {
    fetch("http://your-backend-url/api/quizzes")
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((err) => console.error("Error fetching quizzes:", err));
  }, []);

  const handleAddQuiz = async () => {
    if (!newQuiz || !className || !template) return;

    const response = await fetch("http://your-backend-url/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newQuiz, className, template }),
    });

    if (response.ok) {
      const addedQuiz = await response.json();
      setQuizzes([...quizzes, addedQuiz]);
      setNewQuiz("");
      setClassName("");
      setTemplate("");
    }
  };

  return (
    <div>
      <h2>Quizzes</h2>
      <ul>
        {quizzes.map((q) => (
          <li key={q.id}>
            {q.name} - {q.className} ({q.template})
          </li>
        ))}
      </ul>
      <input type="text" placeholder="Quiz Name" value={newQuiz} onChange={(e) => setNewQuiz(e.target.value)} />
      <input type="text" placeholder="Class Name" value={className} onChange={(e) => setClassName(e.target.value)} />
      <input type="text" placeholder="Template" value={template} onChange={(e) => setTemplate(e.target.value)} />
      <button onClick={handleAddQuiz}>Add Quiz</button>
    </div>
  );
};

export default Quizzes;
