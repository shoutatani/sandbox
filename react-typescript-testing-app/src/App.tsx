import * as React from 'react';
import './App.css';
// import Hello from "./components/Hello";
import Hello from "./components/StatefulHello";

import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Hello name="TypeScript"></Hello>
        </header>
      </div>
    );
  }
}

export default App;
