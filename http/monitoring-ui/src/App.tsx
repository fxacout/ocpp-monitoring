import React from 'react';
import './App.css';
import {Graph} from './components/VisNetwork';
import io from 'socket.io-client'
import { SocketListener } from './models/SocketListener';
import { DataGraph } from './components/DataGraph';
import { Col, Container, Row } from 'react-bootstrap';
import { DataTable } from './components/DataTable';

function App() {

    const socket = io('http://localhost:3001', {
        autoConnect: true
    })

    const socketListener = new SocketListener(socket);


  return (
    <div className='gradient-bonito'>
    <div className='flex-container'>
        <div className="flex-items">
          <Graph options={{}} socketListener={socketListener}></Graph>
          </div>
          <div className="flex-items bordered">
            <h1>OCPP Monitoring</h1>
            <DataGraph socketListener={socketListener}></DataGraph>
            <DataTable socketListener={socketListener}></DataTable>
            </div>
    </div>
    </div>
  );
}

export default App;
