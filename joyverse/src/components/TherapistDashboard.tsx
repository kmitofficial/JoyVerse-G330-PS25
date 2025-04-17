import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface Child {
  username: string;
  joinedAt: string;
  assignedThemes: string[];
}

const TherapistDashboard: React.FC = () => {
  const [therapistUsername, setTherapistUsername] = useState('');
  const [therapistCode, setTherapistCode] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [newChildUsername, setNewChildUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem('therapistUsername');
    const code = sessionStorage.getItem('therapistCode');

    if (!username || !code) {
      navigate('/');
      return;
    }

    setTherapistUsername(username);
    setTherapistCode(code);
    fetchTherapistData(username);
  }, [navigate]);

  const fetchTherapistData = async (username: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/get-therapist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (response.ok) {
        setChildren(data.children || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch therapist data');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async () => {
    if (!newChildUsername.trim()) {
      setError('Enter a child username');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/add-child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapistCode: therapistCode,
          childName: newChildUsername
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchTherapistData(therapistUsername);
        setNewChildUsername('');
        setError(null);
      } else {
        setError(data.message || 'Failed to add child');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error adding child:', err);
    }
  };

  const handleAssignThemes = (childUsername: string) => {
    sessionStorage.setItem('selectedChild', childUsername);
    sessionStorage.setItem('selectedChildTherapistCode', therapistCode);
    navigate('/theme-assignment');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>Error: {error}</Container>;

  return (
    <Container>
      <Header>
        <Title>Therapist Dashboard</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <InfoSection>
        <InfoCard>
          <h3>Your Therapist Code</h3>
          <CodeDisplay>{therapistCode}</CodeDisplay>
          <small>Share this code with your patients to let them join</small>
        </InfoCard>
      </InfoSection>

      <Section>
        <SectionHeader>
          <h2>Your Children</h2>
        </SectionHeader>

        <AddChildSection>
          <InputGroup>
            <Input
              type="text"
              value={newChildUsername}
              onChange={(e) => setNewChildUsername(e.target.value)}
              placeholder="Enter child username"
            />
            <Button onClick={handleAddChild}>Add Child</Button>
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </AddChildSection>

        {children.length === 0 ? (
          <EmptyState>No children added yet</EmptyState>
        ) : (
          <ChildrenGrid>
            {children.map((child) => (
              <ChildCard key={child.username}>
                <h3>{child.username}</h3>
                <p>Joined: {new Date(child.joinedAt).toLocaleDateString()}</p>
                <p>Assigned Themes: {child.assignedThemes?.length || 0}</p>
                <ActionButton onClick={() => handleAssignThemes(child.username)}>
                  Assign Themes
                </ActionButton>
              </ChildCard>
            ))}
          </ChildrenGrid>
        )}
      </Section>
    </Container>
  );
};

const Container = styled.div`padding: 20px; max-width: 1200px; margin: 0 auto;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;`;
const Title = styled.h1`color: #333; margin: 0;`;
const LogoutButton = styled.button`
  padding: 8px 16px; background-color: #ff4444; color: white;
  border: none; border-radius: 4px; cursor: pointer;
  &:hover { background-color: #cc0000; }
`;
const InfoSection = styled.div`margin-bottom: 30px;`;
const InfoCard = styled.div`
  background-color: #f8f9fa; padding: 20px; border-radius: 8px;
  text-align: center;
`;
const CodeDisplay = styled.div`
  font-size: 24px; font-weight: bold; color: #4CAF50; margin: 10px 0;
`;
const Section = styled.div`margin-bottom: 30px;`;
const SectionHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
`;
const AddChildSection = styled.div`margin-bottom: 20px;`;
const InputGroup = styled.div`display: flex; gap: 10px; margin-bottom: 10px;`;
const Input = styled.input`
  padding: 10px; border: 1px solid #ddd; border-radius: 4px; flex: 1;
`;
const Button = styled.button`
  padding: 10px 20px; background-color: #4CAF50;
  color: white; border: none; border-radius: 4px; cursor: pointer;
  &:hover { background-color: #45a049; }
`;
const ErrorMessage = styled.div`
  color: #e74c3c; background: #fdeaea; padding: 0.8rem;
  border-radius: 8px; text-align: center;
`;
const EmptyState = styled.div`
  text-align: center; padding: 40px; background-color: #f8f9fa;
  border-radius: 8px; color: #666;
`;
const ChildrenGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;
const ChildCard = styled.div`
  background-color: white; padding: 20px; border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  h3 { margin: 0 0 10px 0; color: #333; }
  p { margin: 5px 0; color: #666; }
`;
const ActionButton = styled.button`
  padding: 8px 16px; background-color: #6e8efb; color: white;
  border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; width: 100%;
  &:hover { background-color: #5a7af0; }
`;

export default TherapistDashboard;
