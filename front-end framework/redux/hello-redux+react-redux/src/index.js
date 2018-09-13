import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from 'redux';
import Rootreducer from './reducers';
import { Provider } from 'react-redux';

const store = createStore(Rootreducer);

// store.subscribe(() => console.log("State updated!", store.getState()));

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
);
