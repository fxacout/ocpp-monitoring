import React, { createRef } from 'react';
import { Edge, Network, Node, Options } from 'vis-network/peer';
import { DataSet } from 'vis-data/peer'
import type { Socket } from 'socket.io-client';
import { ChargePointConnected, ChargePointDisconnected, ChargePointLatency } from '../models/ChargePoint';


export interface GraphProps {
    options: Options
    socket: Socket
}

export interface GraphState {
    nodes: DataSet<Node>
    edges: DataSet<Edge>
    heartbeat: boolean
}

export class Graph extends React.Component<GraphProps, GraphState> {

    private container: any

    private interval: NodeJS.Timer | undefined

    state = {
        nodes: new DataSet([{ id: 1, label: 'Central System', color: '#76B947' }, { id: 2, label: 'Charge Point 1' }], {}),
        edges: new DataSet(),
        heartbeat: false
    } as GraphState
    

    constructor(props: GraphProps) {
        super(props)
        this.container = createRef<HTMLDivElement>()
    }

    addChargePoint = (id: number, responseTime: number) => {
        this.setState((state) => {
            state.nodes.add({ id, label: `Charge Point ${id}` })
            state.edges.add({ from: id, to: 1, label: this.responseTimeToString(responseTime) })
            return state
        })
    }

    tick() {
        this.state.nodes.map(node => this.colorHeartbeat(node))
        this.setState({
            heartbeat: !this.state.heartbeat,
            nodes: this.state.nodes,
            edges: this.state.edges
        })
    }

    componentDidMount() {
        this.container.current && new Network(this.container.current, { nodes: this.state.nodes, edges: this.state.edges }, this.props.options);
        this.interval = setInterval(() => this.tick(), 1000);

        // Set listeners from WebSocket

        this.props.socket.on('cp_connect', (chargePointConnected: ChargePointConnected) => {
            this.addChargePoint(Number(chargePointConnected.id), 0)
        })

        this.props.socket.on('cp_disconnect', (chargePointDisconnected: ChargePointDisconnected) => {
            this.deleteChargePoint(Number(chargePointDisconnected.id))
        })
        
        this.props.socket.on('cp_latency', (chargePointLatency: ChargePointLatency) => {
            this.updateLatency(chargePointLatency)
        })
        this.props.socket.connect()
    }

    componentWillUnmount() {
        clearInterval(this.interval!);
      }

    deleteChargePoint = (id: number) => {

        this.setState((state) => {
            let edge = state.edges.forEach((edge) => {
                if (edge.from === id) {
                    state.edges.remove(id)
                }
            })
            state.nodes.remove(id)
            return state
        })
    }

    private responseTimeToString(responseTime: number) {
        return `Latency: ${responseTime}`
    }

    private updateLatency(chargePointLatency: ChargePointLatency) {
        this.setState((prevState: GraphState): GraphState => {
            prevState.edges.forEach((edge) => {
                if (edge.from === chargePointLatency.id) {
                    prevState.edges.update({id: edge.id, label: this.responseTimeToString(chargePointLatency.latency)})
                }
            })
            return prevState
        })
    }

    private colorHeartbeat(node: Node): void {
        const { id } = node
        this.setState((prevState) => {
            prevState.nodes.update({id, color: (this.state.heartbeat)? '#76B947' : '#B1D8B7'})
            return prevState
        })
    }

    render(): React.ReactNode {
        console.log(JSON.stringify(this.state.nodes))
        return <div ref={this.container} style={{ height: '500px', width: '800px' }} />;
    }

}
