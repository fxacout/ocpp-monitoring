import React, { useEffect, useRef } from 'react';
import { Edge, Network, Node, Options } from 'vis-network';

export interface GraphProps {
    options: Options
}

export interface GraphState {
    nodes: Node[]
    edges: Edge[]
}

export class Graph extends React.Component<GraphProps, GraphState> {

    state = {
        nodes: [{ id: 1, label: 'Central System' }],
        edges: []
    } as GraphState

    addChargePoint = (id: number, responseTime: number) => {
        if (this.state.nodes.filter((node) => node.id === id).length > 0) {
            throw Error('Node already exists')
        }
        this.setState((state) => {
            state.nodes.push({ id, label: `Charge Point ${id}` })
            state.edges.push({ from: id, to: 1, label: this.responseTimeToString(responseTime) })
        })
    }

    deleteChargePoint = (id: number) => {
        if (this.state.nodes.filter((node) => node.id === id).length === 0) {
            throw Error('Node does not exist')
        }

        if (this.state.edges.filter((edge) => edge.from === id).length === 0) {
            throw Error('Edge does not exist')
        }

        this.setState((state) => {
            let edge = state.edges.find((edge) => edge.from === id)!
            edge.label = 'Disconnected'
            edge.color = '#FF0000'

            useEffect(() => {
                const timer = setTimeout(() => {
                    state.nodes.forEach( (node, index, array) => { if(node.id === id) array.splice(index,1); })
                }, 2000);
                return () => clearTimeout(timer);
              }, []);
        })
    }

    private responseTimeToString(responseTime: number) {
        return `Latency: ${responseTime}`
    }

    private colorHeartbeat(node: Node): void {
        node.color = '#76B947'
        useEffect(() => {
            const timer = setTimeout(() => {
                node.color = '#B1D8B7'
            }, 500);
            return () => clearTimeout(timer);
          }, []);
    }

    chargePointHeartbeat = (id: number, responseTime: number) => {
        if (this.state.nodes.filter((node) => node.id === id).length === 0) {
            throw Error('Node does not exist')
        }
        this.setState((state) => {
            let node = state.nodes.find((node) => node.id === id)!
            this.colorHeartbeat(node)
            node.label = this.responseTimeToString(responseTime)
        })
    }

    render(): React.ReactNode {
        const container = useRef(null);
        useEffect(() => {
            container.current &&
                new Network(container.current, { nodes: this.state.nodes, edges: this.state.edges }, this.props.options);
        }, [container, this.state.nodes, this.state.edges]);

        return <div ref={container} style={{ height: '500px', width: '800px' }} />;
    }

}
