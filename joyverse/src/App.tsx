// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// //import { Gamepad } from 'lucide-react';
// import Home from './components/Home';
// import Game from './components/Game';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/game/:theme/:level" element={<Game />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './components/Home';
// import Game from './components/Game';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import TherapistDashboard from './components/Therapist';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} /> {/* Login is root */}
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<TherapistDashboard />} />
//         <Route path="/game/:theme/:level" element={<Game />} />
//         <Route path="/home" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// WITH CHILD LOGIN AND HOMEPAGE

// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TherapistSignup from './components/TherapistSignup';
import TherapistLogin from './components/TherapistLogin';
import TherapistDashboard from './components/TherapistDashboard';
import ChildLogin from './components/ChildLogin';
import Landing from './components/Landing';
import Game from './components/Game';
import ThemeAssignment from './components/ThemeAssignment';
import styled from 'styled-components';

const App: React.FC = () => {
  return (
    <AppContainer>
      <Router>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<TherapistLogin />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          
          {/* Therapist Routes */}
          <Route path="/signup" element={<TherapistSignup />} />
          <Route path="/dashboard" element={<TherapistDashboard />} />
          <Route path="/theme-assignment" element={<ThemeAssignment />} />
          
          {/* Child Routes */}
          <Route path="/child-login" element={<ChildLogin />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/game/:theme/:level" element={<Game />} />

        </Routes>
      </Router>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
`;

export default App;
