import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index.jsx';
//import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import { Layout } from './Layout';
//import { ImageLayout } from './ImageLayout';
//import AuthModal from './pages/auth';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/*   <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthModal />} />
          <Route path="/layout" element={<Layout />} />
          <Route path="/image" element={<ImageLayout />} />
        </Routes>
      </BrowserRouter>
    } */}
  </React.StrictMode>
);
