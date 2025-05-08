// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';

// const TherapistSignup: React.FC = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }
//     try {
//       const response = await fetch('http://localhost:5000/api/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: formData.username, password: formData.password })
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         navigate('/login');
//       } else {
//         setError(data.message || 'Signup failed');
//       }
//     } catch (err) {
//       setError('Network error');
//     }
//   };

//   return (
//     <Container>
      
//       <FormCard>
//         <Title>Therapist Signup</Title>
//         <Form onSubmit={handleSubmit}>
//           <InputGroup>
//             <Label>Username</Label>
//             <Input
//               type="text"
//               value={formData.username}
//               onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//               required
//               placeholder="Enter your username"
//             />
//           </InputGroup>
//           <InputGroup>
//             <Label>Password</Label>
//             <Input
//               type="password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               required
//               placeholder="Enter your password"
//             />
//           </InputGroup>
//           <InputGroup>
//             <Label>Confirm Password</Label>
//             <Input
//               type="password"
//               value={formData.confirmPassword}
//               onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//               required
//               placeholder="Confirm your password"
//             />
//           </InputGroup>
//           {error && <ErrorMessage>{error}</ErrorMessage>}
//           <Button type="submit">Sign Up</Button>
//         </Form>
//         <LoginLink onClick={() => navigate('/login')}>
//           Already have an account? Login
//         </LoginLink>
//       </FormCard>
//     </Container>
//   );
// };

// const Container = styled.div`
//   min-height: 100vh;
//   width: 100%;
//   height: 100%;
//   position: fixed;
//   top: 0;
//   left: 0;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: url('/images/bg-1.jpg');
//   background-size: 100% 100%;
//   background-position: center;
//   background-repeat: no-repeat;
//   padding: 1rem;
//   overflow-y: auto;
// `;

// const DateTimeInfo = styled.div`
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   text-align: right;
//   color: #000000;
//   font-size: 1rem;
//   font-weight: 500;
//   z-index: 2;
// `;

// const FormCard = styled.div`
//   background: rgba(255, 255, 255, 0.9);
//   padding: 2rem;
//   border-radius: 15px;
//   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//   width: 100%;
//   max-width: 400px;
//   position: relative;
//   z-index: 1;
// `;

// const Title = styled.h1`
//   color: #2c3e50;
//   text-align: center;
//   margin-bottom: 2rem;
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
// `;

// const InputGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const Label = styled.label`
//   color: #2c3e50;
//   font-weight: 500;
// `;

// const Input = styled.input`
//   padding: 0.8rem;
//   border: 2px solid #e2e8f0;
//   border-radius: 8px;
//   font-size: 1rem;
//   &:focus {
//     outline: none;
//     border-color: #6e8efb;
//   }
//   &::placeholder {
//     color: #aaa;
//   }
// `;

// const Button = styled.button`
//   background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
//   color: white;
//   padding: 1rem;
//   border: none;
//   border-radius: 8px;
//   font-size: 1rem;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.3s ease;
//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 12px rgba(110, 142, 251, 0.2);
//   }
// `;

// const ErrorMessage = styled.div`
//   color: #e74c3c;
//   background: #fdeaea;
//   padding: 0.8rem;
//   border-radius: 8px;
//   text-align: center;
// `;

// const LoginLink = styled.button`
//   background: none;
//   border: none;
//   color: #6e8efb;
//   margin-top: 1rem;
//   cursor: pointer;
//   width: 100%;
//   text-align: center;
//   font-size: 0.9rem;
//   transition: all 0.3s ease;
//   &:hover {
//     text-decoration: underline;
//     color: #a777e3;
//   }
// `;

// export default TherapistSignup;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TherapistSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    invitationCode: '' // Added invitation code field
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.username, 
          password: formData.password,
          invitationCode: formData.invitationCode // Send invitation code to server
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <Container>
      
      <FormCard>
        <Title>Therapist Signup</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Username</Label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="Enter your username"
            />
          </InputGroup>
          <InputGroup>
            <Label>Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter your password"
            />
          </InputGroup>
          <InputGroup>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="Confirm your password"
            />
          </InputGroup>
          <InputGroup>
            <Label>Invitation Code</Label>
            <Input
              type="password"
              value={formData.invitationCode}
              onChange={(e) => setFormData({ ...formData, invitationCode: e.target.value })}
              required
              placeholder="Enter your invitation code"
            />
            <InvitationInfo>
              An invitation code is required to register as a therapist
            </InvitationInfo>
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Sign Up</Button>
        </Form>
        <LoginLink onClick={() => navigate('/login')}>
          Already have an account? Login
        </LoginLink>
      </FormCard>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('/images/bg-1.jpg');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 1rem;
  overflow-y: auto;
`;

const DateTimeInfo = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: right;
  color: #000000;
  font-size: 1rem;
  font-weight: 500;
  z-index: 2;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
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
`;

const Label = styled.label`
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #6e8efb;
  }
  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(110, 142, 251, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background: #fdeaea;
  padding: 0.8rem;
  border-radius: 8px;
  text-align: center;
`;

const LoginLink = styled.button`
  background: none;
  border: none;
  color: #6e8efb;
  margin-top: 1rem;
  cursor: pointer;
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  &:hover {
    text-decoration: underline;
    color: #a777e3;
  }
`;

const InvitationInfo = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.2rem;
  font-style: italic;
`;

export default TherapistSignup;