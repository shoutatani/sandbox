import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux';
import { enthusiasm } from './reducers/index';
import { StoreState } from './types/index';
import Hello from './containers/Hello';
import { Provider } from 'react-redux';
import { EnthusiasmAction } from "./actions/index";

const initialState = {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
}
const store = createStore<StoreState, EnthusiasmAction, undefined, undefined>(enthusiasm, initialState);

ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
