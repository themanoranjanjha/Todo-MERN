import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Register from './components/register.jsx';
import Login from './components/login.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Todo from './components/todo.jsx';

import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/todo" element={<PrivateRoute element={<Todo />} />} />

    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
