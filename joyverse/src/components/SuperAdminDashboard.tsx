import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SuperAdminDashboard: React.FC = () => {
  const [therapists, setTherapists] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch all therapists
  const fetchTherapists = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/superadmin/therapists', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('superAdminToken')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTherapists(data);
      } else {
        setError(data.message || 'Failed to fetch therapists');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  // Register a new therapist
  const handleRegisterTherapist = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/superadmin/register-therapist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('superAdminToken')}`,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Therapist registered successfully!');
        setUsername('');
        setPassword('');
        fetchTherapists(); // Refresh the list
      } else {
        setError(data.message || 'Failed to register therapist');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  // Delete a therapist
  const handleDeleteTherapist = async (id: string) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/superadmin/delete-therapist/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('superAdminToken')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Therapist deleted successfully!');
        fetchTherapists(); // Refresh the list
      } else {
        setError(data.message || 'Failed to delete therapist');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('superAdminToken');
    window.location.href = '/superadmin/login';
  };

  return (
    <Container>
      <Header>
        <Title>Super Admin Dashboard</Title>
        <Subtitle>Manage Therapists</Subtitle>
      </Header>

      <Form onSubmit={handleRegisterTherapist}>
        <FormTitle>Register Therapist</FormTitle>
        <InputGroup>
          <Label>Username</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter therapist username"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter therapist password"
            required
          />
        </InputGroup>
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Register Therapist</Button>
      </Form>

      <TherapistList>
        <ListTitle>All Therapists</ListTitle>
        {therapists.length === 0 ? (
          <EmptyState>No therapists found</EmptyState>
        ) : (
          <CardGrid>
            {therapists.map((therapist: any) => (
              <TherapistCard key={therapist._id}>
                <CardContent>
                  <CardTitle>{therapist.username}</CardTitle>
                  <CardSubtitle>Code: {therapist.code}</CardSubtitle>
                </CardContent>
                <DeleteButton onClick={() => handleDeleteTherapist(therapist._id)}>
                  Delete
                </DeleteButton>
              </TherapistCard>
            ))}
          </CardGrid>
        )}
      </TherapistList>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: #f4f7fc;
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 10px 0 0;
`;

const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin-bottom: 40px;
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #5a7af0;
    box-shadow: 0 0 0 3px rgba(90, 122, 240, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #5a7af0;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4a67cc;
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(90, 122, 240, 0.3);
  }
`;

const TherapistList = styled.div`
  width: 100%;
  max-width: 800px;
`;

const ListTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const TherapistCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const CardContent = styled.div`
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
`;

const CardSubtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 5px 0 0;
`;

const DeleteButton = styled.button`
  padding: 10px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #cc0000;
    transform: translateY(-2px);
  }
`;

const SuccessMessage = styled.div`
  color: green;
  margin-bottom: 10px;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
  font-weight: 500;
`;

const EmptyState = styled.p`
  text-align: center;
  color: #666;
  font-size: 1rem;
`;

export default SuperAdminDashboard;