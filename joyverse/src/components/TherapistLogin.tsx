import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const TherapistLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTherapistLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok) {
          sessionStorage.setItem('therapistUsername', data.username);
          sessionStorage.setItem('therapistCode', data.code);
          navigate('/dashboard');
        } else {
          setError(data.message || 'Invalid username or password');
        }
      } else {
        setError('Server error. Please try again later.');
        console.error('Server returned non-JSON response');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Login error:', err);
    }
  };

  const handleChildLogin = () => {
    navigate('/child-login');
  };

  return (
    <Container>
      <LoginContainer>
        <Title>Welcome to JoyVerse</Title>
        <Subtitle>A therapeutic gaming platform for children and therapists</Subtitle>
        
        <LoginOptions>
          <LoginCard>
            <LoginTitle>Therapist Login</LoginTitle>
            <LoginForm onSubmit={handleTherapistLogin}>
              <InputGroup>
                <Label>Username</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </InputGroup>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <Button type="submit">Login as Therapist</Button>
            </LoginForm>
            <SignupLink>
              Don't have an account? <Link onClick={() => navigate('/signup')}>Sign up</Link>
            </SignupLink>
          </LoginCard>

          <LoginCard>
            <LoginTitle>Child Login</LoginTitle>
            <ChildLoginDescription>
              Enter your therapist's magic code and your name to start playing
            </ChildLoginDescription>
            <ChildLoginButton onClick={handleChildLogin}>
              Login as Child
            </ChildLoginButton>
          </LoginCard>
        </LoginOptions>
      </LoginContainer>
    </Container>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  padding: 1rem;
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 900px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
  text-align: center;
  color: white;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  font-size: 1.2rem;
`;

const LoginOptions = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const LoginTitle = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #666;
  font-size: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6e8efb;
    box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  padding: 1rem;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }
`;

const SignupLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
`;

const Link = styled.span`
  color: #6e8efb;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(255, 68, 68, 0.1);
  animation: ${fadeIn} 0.3s ease-out;
`;

const ChildLoginDescription = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
`;

const ChildLoginButton = styled.button`
  padding: 1rem;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(110, 142, 251, 0.2);
  }
`;

export default TherapistLogin; 