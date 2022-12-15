import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './errorpage';
import Root from './root';
import Game from './game';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'game',
        element: <Game />,
      },
    ],
  },
]);
