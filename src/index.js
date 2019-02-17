import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './animations.css';
import * as serviceWorker from './serviceWorker';
import App from './components/App';
import index from './js/index'

// Add these lines:
if (process.env.NODE_ENV !== 'production') {
  localStorage.setItem('debug', 'henry-1-0:*');
}


ReactDOM.render( 
    <App />,
    document.getElementById('root')
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
