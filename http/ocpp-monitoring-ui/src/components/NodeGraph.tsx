import React, { useEffect, useState, useRef } from 'react';
import { Edge, Network, Node, Options } from 'vis-network/peer';
import { DataSet } from 'vis-data/peer';
import { socketServiceInstance } from '../service/SocketService';

export interface GraphProps {
  options: Options;
}

interface GraphState {
  nodes: DataSet<Node>;
  edges: DataSet<Edge>;
  heartbeat: boolean;
}

const NodeGraph: React.FC<GraphProps> = (props) => {
  const [nodes, setNodes] = useState<DataSet<Node>>(new DataSet([{ id: 1, label: 'Central System', color: '#76B947' }]));
  const [edges, setEdges] = useState<DataSet<Edge>>(new DataSet());
  const [heartbeat, setHeartbeat] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const addChargePoint = (id: number, responseTime: number) => {
    setNodes((prevNodes) => {
      if (prevNodes.get(id)) {
        return prevNodes;
      }
      prevNodes.add({ id, label: `Charge Point ${id}` });
      setEdges((prevEdges) => {prevEdges.add({ from: id, to: 1, label: responseTimeToString(responseTime) }); return prevEdges});
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
    socketServiceInstance.getAllNodesId().then((idsList: Array<number | string>) => {
      idsList.forEach((nodeId) => addChargePoint(Number(nodeId), 0));
    });
    // Set listeners from WebSocket

    socketServiceInstance.addConnectHandler(({id, latency}) => {
      addChargePoint(Number(id), Number(latency));
    });

    socketServiceInstance.addHeartbeatHandler((cpLatencyUpdate) => {
      updateLatency(cpLatencyUpdate);
    });

    socketServiceInstance.addDisconnectHandler((chargePointDisconnected) => {
      deleteChargePoint(Number(chargePointDisconnected.id));
    });
  });

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

  const updateLatency = (chargePointLatency: {id: string; latency: string}) => {
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

  return <div ref={containerRef} style={{ height: '300px', width: '500px' }} />;
};

export default NodeGraph ;
