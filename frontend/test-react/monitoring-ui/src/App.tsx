import React from 'react';
import './App.css';
import {Graph} from './components/VisNetwork';
import io from 'socket.io-client'

function App() {

  const socket = io('http://monitoring_log:3000/ws')


  return (
    <div className="App">
      <Graph options={{}} socket={socket}></Graph>
      <h1>Test</h1>
    </div>
  );
}

export default App;
