
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import { Gamepad } from 'lucide-react';
import Home from './components/Home';
import Game from './components/Game';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:theme/:level" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;