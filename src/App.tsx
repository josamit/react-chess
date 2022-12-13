import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Board from './board';
import './index.css';

const App: React.FC = () => (
  <div className='app'>
    <Provider store={store}>
      <Board />
    </Provider>
    <div className='app-bg'></div>
  </div>
);

export default App;
