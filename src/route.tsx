import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ForbiddenPage from '$pages/forbidden';
import HomePage from '$pages/home';
import LoginPage from '$pages/login';
import App from './app';
import ManagePage from '$pages/manage';
import ManageRedirect from '$pages/manage/redirect';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: 'home',
          element: <HomePage />
        },
        {
          path: 'forbidden',
          element: <ForbiddenPage />
        },
        {
          path: 'manage/:domainName/record',
          element: <ManagePage />
        },
        {
          path: 'manage/:domainName',
          element: <ManageRedirect />
        },
        {
          path: 'manage',
          element: <ManageRedirect />
        }
      ]
    },
    {
      path: 'setting',
      element: <LoginPage />
    },
    {
      path: '*',
      element: <ForbiddenPage />
    }
  ],
  {
    basename: '/newpod'
  }
);

const RouteList: React.FC = () => <RouterProvider router={router} />;

export default RouteList;
