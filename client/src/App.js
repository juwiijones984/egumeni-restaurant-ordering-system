import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UsersDashboard from './pages/UsersDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Egumeni Restaurant</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<UsersDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
