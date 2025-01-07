# ForgePrep AI - Practice Test Generator

## Project Overview
ForgePrep AI is a state-of-the-art application designed to help students prepare for exams by generating customizable practice tests using AI. This project leverages modern technologies like FastAPI, PostgreSQL, and OpenAI's GPT-4, following scalable, secure, and user-centric design principles.

---

## Features
- Upload study materials (PDF, Word, plain text) and parse content for test generation.
- AI-powered test generation with customizable question types (e.g., multiple-choice, short-answer, essays).
- User authentication and secure session management.
- Responsive and intuitive user interface designed with modern tools.
- Advanced features like performance analytics, collaboration, and gamification (planned).

---

## Development Workflow

### **Phase 1: Foundation**
- Define project scope and architecture.
- Identify core technologies:
  - **Frontend**: React.js
  - **Backend**: FastAPI
  - **Database**: PostgreSQL
  - **AI**: OpenAI GPT-4
- Set up a GitHub repository with version control and Git branching strategies.

### **Phase 2: User Database and Authentication**
- Implement OAuth 2.0 for third-party logins (Google, GitHub).
- Create a database schema for users, study materials, and tests.
- Develop secure authentication endpoints with hashed passwords and encrypted data.

### **Phase 3: File Upload and Material Parsing**
- Support file uploads for PDF, Word, and plain text files.
- Use libraries like PyPDF2, pdfplumber, and python-docx for text extraction.
- Incorporate OCR for scanned documents using Tesseract.

### **Phase 4: AI-Powered Test Generation**
- Integrate OpenAI GPT-4 API for generating questions.
- Customize test generation (difficulty levels, question types, etc.).
- Save generated tests to the database with metadata.

### **Phase 5: Frontend Development**
- Design wireframes for:
  - Login/Signup pages
  - Dashboard for managing study materials and tests
  - Test generation and preview pages
- Use Tailwind CSS for responsive, modern design.

### **Phase 6: Advanced Features**
- Analytics dashboard to provide insights into user performance.
- Collaborative tools for sharing and editing study materials.
- Gamification elements (badges, streaks, leaderboards).

### **Phase 7: Testing and Deployment**
- Unit and integration testing for all modules.
- Set up CI/CD pipeline using GitHub Actions.
- Deploy on a scalable cloud platform (AWS Elastic Beanstalk, Render, or Firebase).

---

## Current Progress
| **Feature/Task**                | **Status**       | **Notes**                                               |
|----------------------------------|------------------|--------------------------------------------------------|
| Define project scope             | Completed        | Initial draft completed.                              |
| User authentication system       | In Progress      | Password hashing with bcrypt is implemented. JWT planned. |
| File upload and parsing          | Not Started      |                                                        |
| GPT-4 API integration            | Not Started      |                                                        |
| Frontend wireframe design        | Not Started      |                                                        |
| Responsive UI implementation     | Not Started      |                                                        |
| Deployment                       | Not Started      |                                                        |

---

## Future Enhancements
- Add mobile app support using React Native or Flutter.
- Integrate auto-grading for subjective questions using AI.
- Explore multilingual support for international users.

## Getting Started
### Prerequisites
- Python 3.10+
- PostgreSQL
- Node.js (for frontend development)
- OpenAI API Key

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ForgePrep-AI.git
   cd ForgePrep-AI
   ```
2. Set up a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate   # For Linux/Mac
   venv\Scripts\activate      # For Windows
   pip install -r requirements.txt
   ```
3. Set up your environment variables (e.g., `DATABASE_URL` and `OPENAI_API_KEY`).
4. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

---

## Contributing
Contributions are welcome! Please create a new branch for your feature or bug fix and submit a pull request.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.
