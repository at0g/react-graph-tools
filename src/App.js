import React, {useContext} from 'react';
import logo from './logo.svg';
import './App.css';
import Container from "./moveable/Container";
import context from './moveable/context'
import useMouseContainer from "./moveable/useMouseContainer";

function Window() {
    const globalState = useContext(context);
    const [setRef, localState] = useMouseContainer();
    const [x, y] = [globalState.position.x - localState.offset.x, globalState.position.y - localState.offset.y]

    const style = {
        background: '#fff',
        boxShadow: 'rgba(0,0,0,0.3) 0 2px 0',
        display: 'block',
        position: 'absolute',
        cursor: 'move',
        transform: `translate(${x}px, ${y}px)`
    };

    return (
        <div style={style}>
        <div ref={setRef} >
            <code><pre>{JSON.stringify(globalState, null, 2)}</pre></code>
            <hr />
            <code><pre>{JSON.stringify(localState, null, 2)}</pre></code>
        </div>
        </div>
    )
}

function App() {
  return (
        <div className="App">

          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>


            <div className="App-content">
                <Container>
                <Window />
            </Container>
            </div>

        </div>
  );
}

export default App;
