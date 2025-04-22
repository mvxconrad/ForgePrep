// import React, { useState, useEffect } from "react";
// import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
// import api from "../utils/apiService";
// import { useNavigate } from "react-router-dom";

// const TestGeneratorPage = () => {
//   const [topic, setTopic] = useState("");
//   const [difficulty, setDifficulty] = useState("Easy");
//   const [numQuestions, setNumQuestions] = useState(5);
//   const [selectedFileId, setSelectedFileId] = useState("");
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const response = await fetch("https://forgeprep.net/api/files/", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         const data = await response.json();
//         setUploadedFiles(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to fetch uploaded files:", err);
//       }
//     };

//     fetchFiles();
//   }, []);

//   const handleGenerateTest = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const prompt = `Generate a ${difficulty} test on the topic \"${topic}\" with ${numQuestions} questions based on the selected study material.`;

//       const response = await api.post("/gpt/generate", {
//         topic,
//         difficulty,
//         num_questions: numQuestions,
//         study_material_id: selectedFileId,
//         prompt,
//       });

//       const testId = response.data.test_id;
//       navigate("/take-test", { state: { testId } });
//     } catch (err) {
//       console.error("Error generating test:", err);
//       setError("Failed to generate test. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="mt-4">
//       <h2 className="mb-4">Generate a Custom Test</h2>
//       {error && <Alert variant="danger">{error}</Alert>}
//       <Form onSubmit={handleGenerateTest}>
//         <Form.Group className="mb-3" controlId="formTopic">
//           <Form.Label>Topic</Form.Label>
//           <Form.Control
//             type="text"
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//             placeholder="e.g. World War I, Calculus"
//             required
//           />
//         </Form.Group>

//         <Form.Group className="mb-3" controlId="formDifficulty">
//           <Form.Label>Difficulty</Form.Label>
//           <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
//             <option>Easy</option>
//             <option>Medium</option>
//             <option>Hard</option>
//             <option>Mixed</option>
//           </Form.Select>
//         </Form.Group>

//         <Form.Group className="mb-3" controlId="formNumQuestions">
//           <Form.Label>Number of Questions</Form.Label>
//           <Form.Control
//             type="number"
//             value={numQuestions}
//             onChange={(e) => setNumQuestions(parseInt(e.target.value))}
//             min="1"
//             max="50"
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="selectFile" className="mb-3">
//           <Form.Label>Select Study Material</Form.Label>
//           <Form.Select
//             value={selectedFileId}
//             onChange={(e) => setSelectedFileId(e.target.value)}
//             required
//           >
//             <option value="">-- Select a file --</option>
//             {uploadedFiles.map((file) => (
//               <option key={file.file_id} value={file.file_id}>
//                 {file.filename}
//               </option>
//             ))}
//           </Form.Select>
//           {selectedFileId && (
//             <p className="text-muted mt-2">
//               Selected: {uploadedFiles.find(f => f.file_id === selectedFileId)?.filename || "File"}
//             </p>
//           )}
//         </Form.Group>

//         <Button type="submit" disabled={loading} className="w-100">
//           {loading ? <><Spinner animation="border" size="sm" /> Generating...</> : "Generate Test"}
//         </Button>
//       </Form>
//     </Container>
//   );
// };

// export default TestGeneratorPage;

import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import api from "../utils/apiService";
import { useNavigate } from "react-router-dom";

const TestGeneratorPage = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("https://forgeprep.net/api/files/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setUploadedFiles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch uploaded files:", err);
      }
    };

    fetchFiles();
  }, []);

  const handleGenerateTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (numQuestions < 1 || numQuestions > 50) {
      setError("Please select between 1 and 50 questions.");
      setLoading(false);
      return;
    }

    try {
      const prompt = `Generate a ${difficulty.toLowerCase()} test on the topic "${topic}" with ${numQuestions} questions based on the selected study material.`;

      const response = await api.post("/gpt/generate", {
        topic,
        difficulty: difficulty.toLowerCase(),
        num_questions: numQuestions,
        file_id: selectedFileId,
        study_material_id: selectedFileId, // optional for backend, added for safety
        prompt,
      });

      const testId = response.data.test_id;
      navigate("/take-test", { state: { testId } });
    } catch (err) {
      console.error("Error generating test:", err);
      setError("Failed to generate test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Generate a Custom Test</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleGenerateTest}>
        <Form.Group className="mb-3" controlId="formTopic">
          <Form.Label>Topic</Form.Label>
          <Form.Control
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. World War I, Calculus"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDifficulty">
          <Form.Label>Difficulty</Form.Label>
          <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
            <option>Mixed</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formNumQuestions">
          <Form.Label>Number of Questions: {numQuestions}</Form.Label>
          <Form.Range
            min={1}
            max={50}
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          />
        </Form.Group>

        <Form.Group controlId="selectFile" className="mb-3">
          <Form.Label>Select Study Material</Form.Label>
          <Form.Select
            value={selectedFileId}
            onChange={(e) => setSelectedFileId(e.target.value)}
            required
          >
            <option value="">-- Select a file --</option>
            {uploadedFiles.map((file) => (
              <option key={file.file_id} value={file.file_id}>
                {file.filename}
              </option>
            ))}
          </Form.Select>
          {selectedFileId && (
            <p className="text-muted mt-2">
              Selected: {uploadedFiles.find(f => f.file_id === selectedFileId)?.filename || "File"}
            </p>
          )}
        </Form.Group>

        <Button type="submit" disabled={loading} className="w-100">
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Generating...</span>
            </>
          ) : (
            "Generate Test"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default TestGeneratorPage;
