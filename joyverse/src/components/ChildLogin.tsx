import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const ChildLogin: React.FC = () => {
  const [code, setCode] = useState('');
  const [childName, setChildName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code || !childName) {
      setError('Both therapist code and child name are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/child-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, childName }),
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok) {
          sessionStorage.setItem('childData', JSON.stringify({
            username: childName,
            assignedThemes: data.assignedThemes || []
          }));
          
          navigate('/landing');
        } else {
          setError(data.message || 'Login failed');
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

  return (
    <Container>
      <FormCard>
        <Title>
          Welcome, Young Explorer! 
          <span role="img" aria-label="star">✨</span>
        </Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Magic Code</Label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your therapist's magic code"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Your Hero Name</Label>
            <Input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="What should we call you?"
              required
            />
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">
            Begin Adventure 
            <span role="img" aria-label="rocket">🚀</span>
          </Button>
        </Form>
      </FormCard>
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

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  padding: 1rem;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  
  span {
    display: inline-block;
    margin-left: 8px;
    animation: ${float} 2s ease-in-out infinite;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: ${fadeIn} 0.6s ease-out;
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
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  span {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  &:hover span {
    transform: translateX(4px);
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

export default ChildLogin;
