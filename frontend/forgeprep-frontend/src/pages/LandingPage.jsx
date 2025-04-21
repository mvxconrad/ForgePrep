// LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import background1 from '../assets/background_abstract.png';
import background2 from '../assets/background_abstract2.png';
import logo from '../assets/forgepreplogo.png';

const features = [
  { title: "Upload & Transform", desc: "Supports PDF only, more to come in the future!" },
  { title: "Question Generation", desc: "Create MCQs, essays, short answers using GPT-4." },
  { title: "Custom Parameters", desc: "Set difficulty, length, and question types." },
  { title: "Instant Feedback", desc: "Get your results instantly and improve." },
  { title: "Progress Analytics", desc: "Track your performance over time." },
  { title: "Target Weak Areas", desc: "Focus on the topics you struggle with." }
];

const LandingPage = () => {
  return (
    <div className="position-relative bg-dark text-light overflow-hidden" style={{ minHeight: '100vh' }}>

      {/* Top Background Image */}
      <img
        src={background1}
        alt="Top Background"
        className="bg-abstract position-absolute w-100"
        style={{ top: 0, height: '100vh', zIndex: 0 }}
      />

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark px-4 py-2 position-fixed w-100"
        style={{ zIndex: 10, backgroundColor: 'rgba(13, 17, 23, 0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="ForgePrep Logo" height="64" />
          </Link>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-light btn-sm text-dark fw-semibold">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="d-flex align-items-center justify-content-center text-center"
        style={{ minHeight: '90vh', position: 'relative', zIndex: 2, paddingTop: '80px' }}>
        <div className="container">
          <div className="glass p-5 rounded-4 mx-auto shadow-lg" style={{ maxWidth: '720px' }}>
            <h1 className="display-4 fw-bold text-white mb-3 text-shadow">
              Turn Notes Into <br /> <span className="text-primary"
                style={{ fontWeight: '900', textShadow: '0 0 6px rgba(255,255,255,0.8)' }}>Practice</span>
            </h1>
            <p className="lead text-white mb-4 text-shadow">
              ForgePrep converts your study materials into AI-powered quizzes instantly.
            </p>
            <Link to="/register" className="btn btn-light btn-lg px-4 fw-semibold btn-glow text-dark">
              Get Started <ArrowRight className="ms-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Half Grey / Half Normal Section */}
      <div className="w-100 position-relative" style={{ backgroundColor: '#1c1f26', zIndex: 2 }}>
        <img
          src={background2}
          alt="Bottom Background"
          className="bg-abstract position-absolute w-100"
          style={{ top: 0, height: '100%', opacity: 0.25, zIndex: 0 }}
        />

        {/* Core Features Section */}
        <section className="py-5 position-relative" style={{ zIndex: 2 }}>
          <div className="container">
            <h2 className="display-6 fw-bold text-center mb-5 text-white text-shadow">Core Features</h2>
            <div className="row g-4">
              {features.map((f, i) => (
                <div className="col-md-4" key={i}>
                  <div className="glass h-100 p-4 rounded-3 text-start">
                    <h5 className="fw-bold text-white">{f.title}</h5>
                    <p className="text-white small">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5 text-center position-relative" style={{ zIndex: 2 }}>
          <div className="container text-white">
            <h2 className="display-6 fw-bold mb-3 text-white text-shadow">Start Acing Exams Today</h2>
            <p className="lead mb-4 text-white">Join thousands of students using ForgePrep to study smarter and faster.</p>
            <Link to="/register" className="btn btn-light btn-lg text-dark fw-semibold px-5 btn-glow">
              Create Free Account <ArrowRight className="ms-2" size={18} />
            </Link>
          </div>
        </section>
      </div>

      {/* Footer (Purple, No Glass) */}
      <footer className="py-4 text-center text-white-50"
        style={{ background: 'linear-gradient(135deg, #6f42c1, #4b0082)', zIndex: 2 }}>
        <div className="container">
          <p className="mb-0">&copy; {new Date().getFullYear()} ForgePrep. All rights reserved.</p>
          <p className="mt-1 small">Maxwell Conrad, Joey Barto, Anders Jensen @ Stetson University</p>
          <div className="mt-2">
            <a href="#" className="text-white-50 text-decoration-none me-2">Privacy</a>
            <span>|</span>
            <a href="#" className="text-white-50 text-decoration-none ms-2">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;