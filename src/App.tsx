import React from 'react';
import { Provider } from 'react-redux';
import './index.css';
import './reset.css';
import store from './redux/store';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';

const App: React.FC = () => (
  <div className='app'>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </div>
);

export default App;
