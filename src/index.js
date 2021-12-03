import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { Kinetic } from './Kinetic';
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Kinetic/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'));

reportWebVitals();