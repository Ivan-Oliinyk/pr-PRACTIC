import React from 'react';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import PostsPage from './pages/PostsPage';

function App() {
  return (
    <div className="App">
      <div className="Header">
        <Routes>
          <Route path="/users/*" element={<UsersPage />} />
          <Route path="/posts/*" element={<PostsPage />} />
          <Route path="/" element={<Navigate to="/users" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
