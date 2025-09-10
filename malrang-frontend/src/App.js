import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyPage from './pages/MyPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Donate from './pages/Donate';
import Support from './pages/Support';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;