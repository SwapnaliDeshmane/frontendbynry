// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProfileList from './components/ProfileList';
import ProfileDetails from './components/ProfileDetails';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<ProfileList />} />
        <Route path="/profile/:id" element={<ProfileDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;