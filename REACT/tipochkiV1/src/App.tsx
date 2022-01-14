import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import ListPage from './pages/ListPage';
import EditPage from './pages/EditPage';
import CreatePage from './pages/CreatePage';

function App() {
  return (
    <div className="App">
      <div className="Header">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/:id/edit" element={<EditPage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
