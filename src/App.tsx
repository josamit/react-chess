import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css';
import './reset.css';
import Game from './game';

const App: React.FC = () => (
  <div className='app'>
    <Provider store={store}>
      <Game />
    </Provider>
  </div>
);

export default App;
