import React from 'react';
// import ReactDOM from 'react-dom/client'; // react v18 버전용
import ReactDOM from 'react-dom'; // react v17 버전용

import reportWebVitals from './reportWebVitals';
import App from './App';
import './index.css';

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
