import React, { useEffect, useState, useRef } from 'react';
import { Edge, Network, Node, Options } from 'vis-network/peer';
import { DataSet } from 'vis-data/peer';
import { ChargePointConnected, ChargePointDisconnected, ChargePointLatency, UpdateAllNodes } from '../models/ChargePoint';
import { AvailableProtocols, SocketListener } from '../models/SocketListener';

export interface GraphProps {
  options: Options;
  socketListener: SocketListener;
}

interface GraphState {
  nodes: DataSet<Node>;
  edges: DataSet<Edge>;
  heartbeat: boolean;
}

const Graph: React.FC<GraphProps> = (props) => {
  const [nodes, setNodes] = useState<DataSet<Node>>(new DataSet([{ id: 1, label: 'Central System', color: '#76B947' }]));
  const [edges, setEdges] = useState<DataSet<Edge>>(new DataSet());
  const [heartbeat, setHeartbeat] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const socketListener = useRef<SocketListener>(props.socketListener);

  const addChargePoint = (id: number, responseTime: number) => {
    setNodes((prevNodes) => {
      if (prevNodes.get(id)) {
        return prevNodes;
      }
      prevNodes.add({ id, label: `Charge Point ${id}` });
      setEdges((prevEdges) => prevEdges.add({ from: id, to: 1, label: responseTimeToString(responseTime) }));
      return prevNodes;
    });
  };

  const tick = () => {
    setNodes((prevNodes) => {
      prevNodes.forEach((node) => colorHeartbeat(node));
      return prevNodes;
    });
    setHeartbeat((prevHeartbeat) => !prevHeartbeat);
  };

  useEffect(() => {
    const networkOptions = { nodes, edges };
    const networkInstance = new Network(containerRef.current!, networkOptions, props.options);
    const interval = setInterval(tick, 1000);

    // Cleanup
    return () => {
      clearInterval(interval);
      networkInstance.destroy();
    };
  }, [nodes, edges, props.options]);

  useEffect(() => {
    fetch('http://localhost:3001/getAllNodesId', {
      method: 'get',
    })
      .then((response) => response.json())
      .then((idsList: Array<number | string>) => {
        idsList.forEach((nodeId) => addChargePoint(Number(nodeId), 0));
      });

    // Set listeners from WebSocket
    socketListener.current.addHandler(AvailableProtocols.Connection, () => console.log('Connected!'));

    socketListener.current.addHandler(AvailableProtocols.CpConnect, (chargePointConnected: ChargePointConnected) => {
      addChargePoint(Number(chargePointConnected.id), Number(chargePointConnected.latency));
    });

    socketListener.current.addHandler(AvailableProtocols.CpHeartbeat, (cpLatencyUpdate: ChargePointLatency) => {
      updateLatency(cpLatencyUpdate);
    });

    socketListener.current.addHandler(AvailableProtocols.CpDisconnect, (chargePointDisconnected: ChargePointDisconnected) => {
      deleteChargePoint(Number(chargePointDisconnected.id));
    });

    // Cleanup
    return () => {
      socketListener.current.removeAllHandlers();
    };
  }, []);

  const deleteChargePoint = (id: number) => {
    setNodes((prevNodes) => {
      removeEdgesForNode(id, edges);
      prevNodes.remove(id);
      return prevNodes;
    });
  };

  const removeEdgesForNode = (id: number, edges: DataSet<Edge>) => {
    edges.forEach((edge) => {
      if (edge.from === id) {
        edges.remove(id);
      }
    });
  };

  const responseTimeToString = (responseTime: number) => {
    return `Latency: ${Math.trunc(responseTime * 10e5) / 100} ms`;
  };

  const updateLatency = (chargePointLatency: ChargePointLatency) => {
    setEdges((prevEdges) => {
      prevEdges.forEach((edge) => {
        if (edge.from === Number(chargePointLatency.id)) {
          prevEdges.update({ id: edge.id, label: responseTimeToString(Number(chargePointLatency.latency)) });
        }
      });
      return prevEdges;
    });
  };

  const colorHeartbeat = (node: Node): void => {
    const { id } = node;
    setNodes((prevNodes) => {
      prevNodes.update({ id, color: heartbeat ? '#76B947' : '#B1D8B7' });
      return prevNodes;
    });
  };

  return <div ref={containerRef} style={{ height: '500px', width: '800px' }} />;
};

export default Graph;
