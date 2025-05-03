import React, { useState } from 'react';
import { CSSProperties } from 'react';

const FAQ = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: ''
  });

  const styles: Record<string, CSSProperties> = {
    container: {
      backgroundImage: `url('/images/bg-4.jpg')`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      width: '100%',
      height: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      padding: '4rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      textAlign: 'center',
      overflowY: 'auto',
    },
    contentWrapper: {
      position: 'relative',
      width: '100%',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    dateTimeInfo: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      textAlign: 'right',
      color: '#000000',
      fontSize: '1rem',
      fontWeight: '500',
      zIndex: 2
    },
    mainHeading: {
      fontSize: '3rem',
      marginBottom: '1.5rem',
      fontWeight: 700,
      color: '#00008B',
      textShadow: '2px 2px 4px rgba(255,255,255,0.3)',
      textAlign: 'center'
    },
    intro: {
      fontSize: '1.2rem',
      maxWidth: '900px',
      marginBottom: '3rem',
      lineHeight: 1.6,
      color: '#00008B',
      textAlign: 'center'
    },
    faqSection: {
      textAlign: 'center',
      maxWidth: '800px',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: '15px',
      padding: '2rem',
      marginBottom: '3rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    questionBlock: {
      marginBottom: '2.5rem',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      padding: '1rem',
      borderRadius: '8px',
      width: '100%',
      textAlign: 'center',
      ':hover': {
        transform: 'translateX(10px)',
        backgroundColor: 'rgba(30, 144, 255, 0.1)'
      }
    },
    question: {
      fontSize: '1.8rem',
      marginBottom: '1rem',
      color: '#1E90FF',
      fontWeight: 600,
      textAlign: 'center'
    },
    answer: {
      fontSize: '1.2rem',
      lineHeight: 1.8,
      color: '#333333',
      textAlign: 'center',
      padding: '0 1rem'
    },
    formSection: {
      maxWidth: '600px',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: '15px',
      padding: '2rem',
      marginTop: '2rem'
    },
    formTitle: {
      fontSize: '2rem',
      marginBottom: '2rem',
      color: '#00008B'
    },
    formGroup: {
      marginBottom: '1.5rem',
      textAlign: 'left'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '1.1rem',
      color: '#1E90FF',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      borderRadius: '8px',
      border: '1px solid #1E90FF',
      backgroundColor: '#ffffff',
      color: '#1E90FF',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
      outline: 'none',
    },
    textarea: {
      width: '100%',
      padding: '0.8rem',
      borderRadius: '8px',
      border: '1px solid #1E90FF',
      backgroundColor: '#ffffff',
      color: '#1E90FF',
      fontSize: '1rem',
      minHeight: '150px',
      transition: 'border-color 0.3s ease',
      outline: 'none',
      resize: 'vertical'
    },
    submitButton: {
      padding: '1rem 2rem',
      backgroundColor: '#1E90FF',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1rem',
      ':hover': {
        backgroundColor: '#1876D0',
        transform: 'translateY(-2px)'
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', question: '' });
  };

  return (
    <div style={styles.container}>
      
      
      <div style={styles.contentWrapper}>
        <h1 style={styles.mainHeading}>
          Got Questions? We've Got Answers! 
        </h1>

        <p style={styles.intro}>
          Explore our frequently asked questions below. Can't find what you're looking for?
          Drop us a question at the bottom of the page - we're here to help! ✨
        </p>

        <div style={styles.faqSection}>
          <div style={styles.questionBlock}>
            <h2 style={styles.question}>🎯 How does virtual therapy work on your platform?</h2>
            <p style={styles.answer}>
              Our platform provides secure video sessions, interactive tools, and engaging activities 
              designed specifically for children's therapy. Sessions are conducted in real-time with 
              licensed therapists using child-friendly interfaces and activities.
            </p>
          </div>

          <div style={styles.questionBlock}>
            <h2 style={styles.question}>🔒 What security measures are in place?</h2>
            <p style={styles.answer}>
              We implement bank-level encryption, HIPAA-compliant video sessions, and strict data 
              protection protocols. All therapists undergo thorough background checks, and we regularly 
              audit our security systems to ensure the highest level of protection.
            </p>
          </div>

          <div style={styles.questionBlock}>
            <h2 style={styles.question}>🎨 What types of activities are available?</h2>
            <p style={styles.answer}>
              We offer a wide range of therapeutic activities including art therapy, music interaction, 
              storytelling, emotional recognition games, and mindfulness exercises. All activities are 
              age-appropriate and can be customized by therapists.
            </p>
          </div>

          <div style={styles.questionBlock}>
            <h2 style={styles.question}>📱 Can we access sessions from multiple devices?</h2>
            <p style={styles.answer}>
              Yes! Our platform works seamlessly across desktop computers, tablets, and mobile devices. 
              You can switch devices during a session if needed, and all progress is automatically saved.
            </p>
          </div>

          <div style={styles.questionBlock}>
            <h2 style={styles.question}>🌈 What age groups do you support?</h2>
            <p style={styles.answer}>
              Our platform is designed for children aged 6-10, with age-appropriate activities and 
              interfaces for different developmental stages. We also provide special resources for 
              parents and guardians.
            </p>
          </div>
        </div>

        <div style={styles.formSection}>
          <h2 style={styles.formTitle}>Ask Us Anything! 💫</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                style={styles.input}
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                style={styles.input}
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="question">Your Question</label>
              <textarea
                id="question"
                name="question"
                style={styles.textarea}
                value={formData.question}
                onChange={handleInputChange}
                required
                placeholder="Type your question here..."
              />
            </div>

            <button type="submit" style={styles.submitButton}>
              Send Question 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FAQ;