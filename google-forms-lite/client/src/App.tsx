import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import FormBuilderPage from './pages/FormBuilderPage/FormBuilderPage';
import ResponsesPage from './pages/ResponsesPage/ResponsesPage';
import FormFillPage from './pages/FormFillPage/FormFillPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/forms/new' element={<FormBuilderPage />} />
        <Route path='/forms/:formId/edit' element={<FormBuilderPage />} />
        <Route path='/forms/:formId/responses' element={<ResponsesPage />} />
        <Route path='/forms/:formId/fill' element={<FormFillPage />} />
      </Routes>
    </div>
  );
}

export default App;
