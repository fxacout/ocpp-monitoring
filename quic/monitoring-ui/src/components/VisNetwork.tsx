import React, { createRef } from 'react';
import { Edge, Network, Node, Options } from 'vis-network/peer';
import { DataSet } from 'vis-data/peer'
import type { Socket } from 'socket.io-client';
import {ChargePointConnected, ChargePointDisconnected, ChargePointLatency, UpdateAllNodes} from '../models/ChargePoint';


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

    private socket: Socket

    state = {
        nodes: new DataSet([{ id: 1, label: 'Central System', color: '#76B947' }], {}),
        edges: new DataSet(),
        heartbeat: false
    } as GraphState


    constructor(props: GraphProps) {
        super(props)
        this.socket = props.socket
        this.container = createRef<HTMLDivElement>()
    }

    addChargePoint = (id: number, responseTime: number) => {
        this.setState((state) => {
            if (state.nodes.get(id)) {
                console.log('Node already created')
                return state
            }
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
        fetch("http://localhost:3001/getAllNodesId", {
            method: 'get'
        }).then((response) =>{
            return response.json()
        }).then((idsList: Array<number | string>) => {
            console.log(idsList)
            idsList.forEach((nodeId) => this.addChargePoint(Number(nodeId), 0));
        })

        // Set listeners from WebSocket

        this.socket.on('connection', () => console.log('Connected!'))

        this.socket.on('cp_connect', (chargePointConnected: ChargePointConnected) => {
            console.log('Something connected')
            this.addChargePoint(Number(chargePointConnected.id), Number(chargePointConnected.latency))
        })

        this.socket.on('cp_heartbeat',(cpLatencyUpdate: ChargePointLatency) => {
            console.log("Heartbeat! <3")
            console.log(cpLatencyUpdate)
            this.updateLatency(cpLatencyUpdate)
        })

        this.socket.on('cp_disconnect', (chargePointDisconnected: ChargePointDisconnected) => {
            this.deleteChargePoint(Number(chargePointDisconnected.id))
        })

        this.socket.connect()
    }

    componentWillUnmount() {
        clearInterval(this.interval!);
      }

    deleteChargePoint = (id: number) => {

        this.setState((state) => {
            this.removeEdgesForNode(id, state.edges)
            state.nodes.remove(id)
            return state
        })
    }
    
    private removeEdgesForNode(id: number, edges: DataSet<Edge>) {
    edges.forEach((edge) => {
        if (edge.from === id) {
            edges.remove(id)
        }
    })
}

    private responseTimeToString(responseTime: number) {
        return `Latency: ${Math.trunc(responseTime * 10e5)/100} ms`
    }

    private updateLatency(chargePointLatency: ChargePointLatency) {
        this.setState((prevState: GraphState): GraphState => {
            prevState.edges.forEach((edge) => {
                console.dir(edge)
                if (edge.from !== 1) {
                    console.log('Llego?')
                    prevState.edges.update({id: edge.id, label: this.responseTimeToString(Number(chargePointLatency.latency))})
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
        return <div ref={this.container} style={{ height: '500px', width: '800px' }} />;
    }

}
