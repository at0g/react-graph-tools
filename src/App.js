import React, {useContext} from 'react';
import logo from './logo.svg';
import './App.css';
import Container from "./moveable/Container";
import context from './moveable/context'

function Window() {
    const state = useContext(context);

    return (
        <div>
            <code><pre>{JSON.stringify(state, null, 2)}</pre></code>
        </div>
    )
}

function App() {
  return (
      <Container>
        <div className="App">
            <Window/>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </Container>
  );
}

export default App;
