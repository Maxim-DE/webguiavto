import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-tooltip/dist/react-tooltip.css'
import App from './App';
import { MemoryRouter } from 'react-router-dom';

import { store } from './store/store';
import { Provider } from 'react-redux';

export const GRAPH_MODE_TEST = true;
export const GRAPH_MODE_TEST_PORT = 6060;
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <MemoryRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </MemoryRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
