import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import FormBuilderPage from './pages/FormBuilderPage/FormBuilderPage';
import ResponsesPage from './pages/ResponsesPage/ResponsesPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/forms/new' element={<FormBuilderPage />} />
        <Route path='/forms/:formId/responses' element={<ResponsesPage />} />
      </Routes>

    </div>
  );
}

export default App;
