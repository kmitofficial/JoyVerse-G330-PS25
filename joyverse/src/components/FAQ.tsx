import React, { useState } from 'react';
import { CSSProperties } from 'react';

const FAQ = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [question,setQuestion] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const response = await fetch('/api/add-faq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, question }),
        });
  
        if (response.ok) {
          alert('Feedback submitted successfully!');
          setName('');
          setEmail('');
          setQuestion('');
        } else {
          alert('Failed to submit feedback.');
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('An error occurred while submitting feedback.');
      }
    };
  
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
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'question') {
      setQuestion(value);
    }
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
            <h2 style={styles.question}> How does JoyVerse ensure personalized learning experiences for each child?</h2>
            <p style={styles.answer}>
            JoyVerse tailors gameplay based on both therapist-assigned themes and real-time emotional feedback. It adjusts puzzle complexity, visual environments, and reinforcement mechanisms to each child's needs, promoting better retention and minimizing cognitive overload.
            </p>
          </div>

          <div style={styles.questionBlock}>
            <h2 style={styles.question}>Can the game be replayed multiple times without losing its novelty for children?</h2>
            <p style={styles.answer}>
            Yes. JoyVerse randomizes theme assignments and puzzle content on every replay, and it uses emotional context to vary visual feedback and challenge levels. This ensures novelty and keeps the child engaged with fresh stimuli each session.
            </p>
          </div>

          <div style={styles.questionBlock}>
            <h2 style={styles.question}>How are therapists supported in analyzing a child’s progress on JoyVerse?</h2>
            <p style={styles.answer}>
            Therapists have access to a secure dashboard that displays child progress, emotional trends over time, and game performance. This helps them make informed decisions about intervention strategies and theme adjustments.
            </p>
          </div>

          <div style={styles.questionBlock}>
            <h2 style={styles.question}> What are the future scalability plans for JoyVerse?</h2>
            <p style={styles.answer}>
            JoyVerse plans to expand its AI capabilities to include speech recognition and personalized reading feedback. Additionally, it will introduce multi-language support, integrate with school LMS platforms, and offer predictive analytics for therapist insights.
            </p>
          </div>

          <div style={styles.questionBlock}>
            <h2 style={styles.question}>What age groups do you support?</h2>
            <p style={styles.answer}>
            JoyVerse is designed primarily for children aged 6 to 10, especially those with dyslexia or related learning differences. The game mechanics, vocabulary, visual design, and emotional feedback system are all optimized to support early literacy and cognitive development within this age range. Future versions aim to extend support to older children and early teens through adaptive difficulty and advanced game modules.
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
                value={name}
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
                value={email}
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
                value={question}
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