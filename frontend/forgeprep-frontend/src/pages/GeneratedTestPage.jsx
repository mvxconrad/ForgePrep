import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

const GeneratedTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { test } = location.state || {};

  if (!test) {
    return <p>No test data available.</p>;
  }

  const handleStartTest = () => {
    navigate("/take-test", { state: { test } });
  };

  return (
    <Container className="mt-4">
      <h1>Generated Test</h1>
      <ul>
        {test.questions.map((question, index) => (
          <li key={index}>
            <strong>{question.questionText}</strong>
            <ul>
              {question.options.map((option, idx) => (
                <li key={idx}>{option}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Button onClick={handleStartTest} variant="primary">
        Start Test
      </Button>
    </Container>
  );
};

export default GeneratedTestPage;