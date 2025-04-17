import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface ChildData {
  username: string;
  assignedThemes: string[];
}

const Landing: React.FC = () => {
  const [childData, setChildData] = useState<ChildData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = sessionStorage.getItem('childData');
    if (!storedData) {
      navigate('/child-login');
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setChildData(data);
    } catch (err) {
      console.error('Error parsing child data:', err);
      navigate('/child-login');
    }
  }, [navigate]);

  const handlePlayGames = () => {
    if (childData?.assignedThemes && childData.assignedThemes.length > 0) {
      // Navigate to the first assigned theme
      navigate(`/game/${childData.assignedThemes[0]}`);
    } else {
      setError('No games have been assigned to you yet. Please ask your therapist to assign some games.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('childData');
    navigate('/child-login');
  };

  if (!childData) return <Container>Loading...</Container>;

  return (
    <Container>
      <Content>
        <WelcomeMessage>
          Welcome, {childData.username}! 
          <span role="img" aria-label="star">✨</span>
        </WelcomeMessage>
        
        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            <GameInfo>
              You have {childData.assignedThemes.length} game theme{childData.assignedThemes.length !== 1 ? 's' : ''} to play!
            </GameInfo>
            <PlayButton onClick={handlePlayGames}>
              Let's Play! <span role="img" aria-label="rocket">🚀</span>
            </PlayButton>
          </>
        )}
        
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  padding: 1rem;
`;

const Content = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const WelcomeMessage = styled.h1`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  
  span {
    display: inline-block;
    margin-left: 8px;
    animation: float 2s ease-in-out infinite;
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

const GameInfo = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const PlayButton = styled.button`
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
  }

  span {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  &:hover span {
    transform: translateX(4px);
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #6e8efb;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

export default Landing; 