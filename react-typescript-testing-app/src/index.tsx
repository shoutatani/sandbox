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

const obj1 = {
  name: "Bob",
  callName: function() {
    console.log(`hello, I'm ${this.name}!`);
  }
};

obj1.callName();

const obj2 = {
  name: "Alice",
  callName() {
    // callName: () => {と、Arrow Functionにはできない。
    // なぜなら、このArrow Function内のthisは上のレベルのthisに左右されるが、
    // この場合だとthisはトップレベルまで参照しにいってしまうから。
    // 通常の関数宣言であれば、実行時のcontextがthisになるため問題ない。
    console.log(`hello, I'm ${this.name}!`);
  }
};

obj2.callName();
