import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage/HomePage';
import FormBuilderPage from './pages/FormBuilderPage/FormBuilderPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/forms/new' element={<FormBuilderPage />} />
      </Routes>

    </div>
  );
}

export default App;
