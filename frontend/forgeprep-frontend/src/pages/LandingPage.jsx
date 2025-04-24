import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Settings, BarChart, HelpCircle } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import background1 from '../assets/background_abstract.png';
import background2 from '../assets/background_abstract2.png';
import logo from '../assets/forgepreplogo.png';
import styles from './LandingPage.module.css';

const features = [
  { icon: <FileText size={24} />, title: "Upload & Transform", desc: "Supports PDF only, more to come in the future!" },
  { icon: <Settings size={24} />, title: "Question Generation", desc: "Create MCQs, essays, short answers using GPT-4." },
  { icon: <HelpCircle size={24} />, title: "Custom Parameters", desc: "Set difficulty, length, and question types." },
  { icon: <BarChart size={24} />, title: "Progress Analytics", desc: "Track your performance over time." }
];

const testimonials = [
  { quote: "ForgePrep helped me crush my midterms! I converted my entire study guide in seconds.", name: "Jordan L.", school: "Stetson University" },
  { quote: "The best study tool I’ve ever used. The feedback system is 🔥.", name: "Emily R.", school: "FSU" }
];

const LandingPage = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <div className={styles['landing-page']}>
      <div
        className={styles['bg-top-image']}
        style={{ backgroundImage: `url(${background1})` }}
      ></div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top blur-nav">
        <div className="container-fluid justify-content-between px-4">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="ForgePrep Logo" height="48" />
          </Link>
          <div>
            <Link to="/login" className="btn btn-outline-light btn-sm me-2">Log In</Link>
            <Link to="/register" className="btn btn-light btn-sm fw-semibold text-dark">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section text-center d-flex align-items-center justify-content-center">
        <div className="container" data-aos="fade-up">
          <div className="glass p-5 rounded-4 shadow-lg mx-auto" style={{ maxWidth: '720px' }}>
            <h1 className="display-4 fw-bold mb-3 text-white text-shadow">
              Turn Notes Into <span className="highlight-text">Practice</span>
            </h1>
            <p className="lead mb-4">ForgePrep converts your study materials into AI-powered quizzes instantly.</p>
            <Link to="/register" className="btn btn-glow btn-lg fw-semibold text-dark">
              Get Started <ArrowRight className="ms-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <div
        className={styles['bg-bottom-image']}
        style={{ backgroundImage: `url(${background2})` }}
      ></div>

      {/* Features */}
      <section className="features-section py-5" data-aos="fade-up">
        <div className="container">
          <h2 className="text-white text-center fw-bold mb-5">Core Features</h2>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="glass p-4 h-100 rounded-4 text-start">
                  <div className="mb-2 text-primary">{f.icon}</div>
                  <h5 className="fw-bold text-white">{f.title}</h5>
                  <p className="text-white small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section py-5 bg-black bg-opacity-50" data-aos="fade-up">
        <div className="container text-center">
          <h2 className="text-white fw-bold mb-4">What Students Are Saying</h2>
          <div className="row justify-content-center">
            {testimonials.map((t, i) => (
              <div key={i} className="col-md-5">
                <blockquote className="blockquote text-white-50 mb-4">
                  <p className="mb-3">“{t.quote}”</p>
                  <footer className="blockquote-footer text-white-50">
                    {t.name}, <cite title="School">{t.school}</cite>
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="cta-section text-center py-5">
        <div className="container">
          <h2 className="fw-bold text-white mb-3">Start Acing Exams Today</h2>
          <p className="text-white-50 mb-4">Join thousands of students using ForgePrep to study smarter and faster.</p>
          <Link to="/register" className="btn btn-light btn-lg fw-semibold text-dark btn-glow px-5">
            Create Free Account <ArrowRight className="ms-2" size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-4 text-center text-white-50">
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
