import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../Layout';
import { ImageLayout } from '../ImageLayout';
import AuthModal from '../pages/auth/AuthModal';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
  },
  {
    path: '/layout',
    element: <Layout />,
  },
  {
    path: '/image',
    element: <ImageLayout />,
  },
  {
    path: '/auth',
    element: <AuthModal />,
  },
]);
