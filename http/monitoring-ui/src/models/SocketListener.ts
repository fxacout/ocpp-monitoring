import type { Socket } from 'socket.io-client';
import { ChargePointConnected, ChargePointDisconnected, ChargePointLatency } from './ChargePoint';

export enum AvailableProtocols {
    Connection = 'connection',
    CpConnect = 'cp_connect',
    CpHeartbeat = 'cp_heartbeat',
    CpDisconnect = 'cp_disconnect'
}

export class SocketListener {

    private handlers: Map<AvailableProtocols, Array<(...args: any) => any>> = new Map();

    constructor(
        private socket: Socket
    ) {
        this.initHandlers()
    }


    addHandler(protocol: AvailableProtocols, handler: any) {
        this.handlers.set(protocol, (this.handlers.get(protocol)? [...this.handlers.get(protocol)!, handler]: [handler]))
    }

    initHandlers(){
        this.socket.on('connection', () => {
            let handlers = this.handlers.get(AvailableProtocols.Connection)
            if (handlers) {
                handlers.forEach((handler) => handler())
            }
        })

        this.socket.on('cp_connect', (chargePointConnected: ChargePointConnected) => {
            let handlers = this.handlers.get(AvailableProtocols.CpConnect)
            if (handlers) {
                handlers.forEach((handler) => handler(chargePointConnected))
            }
        })

        this.socket.on('cp_heartbeat',(cpLatencyUpdate: ChargePointLatency) => {
            let handlers = this.handlers.get(AvailableProtocols.CpHeartbeat)
            if (handlers) {
                handlers.forEach((handler) => handler(cpLatencyUpdate))
            }
        })

        this.socket.on('cp_disconnect', (chargePointDisconnected: ChargePointDisconnected) => {
            let handlers = this.handlers.get(AvailableProtocols.CpDisconnect)
            if (handlers) {
                handlers.forEach((handler) => handler(chargePointDisconnected))
            }
        })
    }
}