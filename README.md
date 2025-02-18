# **ForgePrep - AI Practice Test Generator**

## **Project Overview**
ForgePrep AI is an **AI-driven platform** designed to help students **generate practice tests** based on their study materials. The project focuses on **customizability, ease of use, and security**, leveraging **FastAPI, PostgreSQL, OpenAI's GPT-4, and React.js (Vite)** to provide a scalable and efficient solution.

This application allows users to **upload study materials, generate practice questions**, and **track their progress** through an intuitive dashboard. 

---

## **Features**
- **Upload and Process Study Materials**  
  Users can upload **PDF, Word, and plain text files**, which are parsed for test generation.  
- **AI-Powered Test Generation** *(In Progress)*  
  The application uses **GPT-4** to generate **multiple-choice, short-answer, and essay** questions based on the provided materials. The AI integration is currently being refined for better accuracy and customization.  
- **User Authentication** *(In Progress)*  
  OAuth 2.0 is being implemented to allow users to log in via **Google and GitHub**. JWT is used for **secure session management**, ensuring only authorized users access their tests and data.  
- **Frontend-Backend Integration**  
  The **React (Vite) frontend** is fully connected to the **FastAPI backend**, allowing seamless interaction with the PostgreSQL database.  
- **User Dashboard for Test Management**  
  Users have access to a dashboard where they can manage their study materials and tests. Authentication ensures that only logged-in users can access this page.  
- **Frontend Optimization and UI Enhancements** *(Ongoing)*  
  The UI is being refined to improve user experience, with a focus on **responsiveness and modern design**.  

---

## **Development Progress**

| **Feature**                          | **Status**        | **Details** |
|--------------------------------------|------------------|-----------------------------------------------------------------|
| Define project scope                 | Completed        | The initial scope, features, and technical architecture were defined. |
| GitHub Repository & Version Control  | Completed        | Repository was initialized, and a branching strategy was established. |
| Frontend Upgrade to Vite              | Completed        | Switched to Vite for better performance. |
| OAuth 2.0 & JWT Authentication        | In Progress      | Google and GitHub login authentication is being implemented, JWT session management is partially completed. |
| AI-Powered Test Generation            | In Progress      | GPT-4 integration is functional but requires fine-tuning for better question accuracy. |
| File Upload and Parsing               | In Progress      | Text extraction from PDFs, Word, and plain text is working; OCR support for scanned documents is still in development. |
| Frontend-Backend Integration          | Completed        | The frontend is fully linked with the backend and PostgreSQL database. |
| User Dashboard                        | Completed        | Authentication-protected dashboard for managing tests is implemented. |
| UI and Frontend Enhancements          | Ongoing         | The UI is being refined for a modern, user-friendly experience. |
| Deployment Planning                    | Not Yet Started | AWS deployment will be handled after core functionalities are complete. |

---

## **Technology Stack & Dependencies**

### **Frontend**
- **React.js (Vite)** – Chosen for its **fast build times and optimized performance** compared to traditional React setups. Vite provides **hot module replacement** and significantly improves local development speeds.
- **Tailwind CSS** – Used for styling due to its **flexibility, utility-first approach, and responsiveness**.

### **Backend**
- **FastAPI** – Selected for its **speed, built-in async support, and automatic OpenAPI documentation**. It integrates well with modern frontend frameworks and provides high-performance API endpoints.
- **Python** – The core backend language due to its **robust ecosystem, AI/ML support, and extensive libraries**.

### **Database**
- **PostgreSQL (Amazon RDS)** – Chosen for its **scalability, reliability, and strong ACID compliance**. PostgreSQL is well-suited for handling structured data and integrating with AI-based applications.

### **Authentication**
- **OAuth 2.0 (Google, GitHub)** – Provides a secure and convenient login system, eliminating the need for users to remember separate credentials.
- **JWT (JSON Web Tokens)** – Used for secure session management and authentication of API requests.

### **AI Integration**
- **OpenAI GPT-4** – Used for generating practice test questions. The API allows customization of prompts to create **context-aware and relevant** study questions.

### **Additional Dependencies**
- **PyPDF2, pdfplumber, python-docx** – For parsing text from uploaded study materials.
- **Tesseract OCR** *(Planned)* – Will be integrated to process scanned PDFs and extract text.
- **GitHub Actions** *(Planned)* – Will be implemented for CI/CD automation.

---

## **Getting Started**

### **Prerequisites**
Ensure you have the following installed:
- Python 3.10+
- PostgreSQL
- Node.js
- OpenAI API Key

### **Setup Instructions**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ForgePrep-AI.git
   cd ForgePrep-AI
   ```

2. **Set up a virtual environment and install dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate      # Windows
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add:
   ```
   DATABASE_URL=your_postgres_url
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Set up the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## **Next Steps**
- **Finalize OAuth 2.0 & JWT authentication** to ensure smooth user authentication.
- **Improve AI-generated test questions** by refining prompt engineering and response filtering.
- **Redesign the frontend UI** to enhance usability and improve responsiveness.
- **Add support for OCR-based document parsing** to handle scanned PDFs.
- **Set up CI/CD pipelines** for automated testing and deployment.
- **Deploy the application on AWS (Elastic Beanstalk & RDS).**

---

## **Future Enhancements**
- **Mobile App Support** – Potential React Native or Flutter integration.
- **Gamification Features** – Achievement badges, study streaks, and leaderboards.
- **Performance Analytics** – Insights into user progress and study efficiency.
- **Multilingual Support** – Expand accessibility to non-English speakers.

---

## **Contributing**
Contributions are welcome! Developers should follow the **Git branching strategy** and ensure all changes are tested before submitting pull requests.

---

## **License**
This project is licensed under the MIT License. See the LICENSE file for details.
