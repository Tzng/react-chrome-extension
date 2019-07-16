import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../../src/index';
import './index.css';
import createStore from '../../src/store/configureStore';

chrome.storage.local.get('state', async (obj) => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');
  ReactDOM.render(
    <Index store={createStore(initialState)} />,
    document.querySelector('#root')
  );
});
