import React, { useState } from "react";
import axios from "axios";

const TestGenerator = () => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);

  const handleGenerate = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/tests/generate`, {
        num_questions: numQuestions,
        difficulty,
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Test generation failed", error);
      alert("Error generating test");
    }
  };

  return (
    <div>
      <label>
        Number of Questions:
        <input
          type="number"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
        />
      </label>
      <label>
        Difficulty:
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <button onClick={handleGenerate}>Generate Test</button>

      <ul>
        {questions.map((q, index) => (
          <li key={index}>{q.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestGenerator;

