import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 