import { SocketEvents } from "@/domain/SocketEvents"
import axios from "axios";
import { io } from "socket.io-client";

class SocketService {
  socketIoClient
  constructor() {
    this.socketIoClient = io('http://localhost:3001')
    this.socketIoClient.on('connect', () => console.log('Socket connected!'))
  }
  addConnectHandler(handler: ({id, latency}: {id: string, latency: string}) => void) {
    this.socketIoClient.on(SocketEvents.CONNECT, handler)
  }
  addHeartbeatHandler(handler: ({id, latency}: {id: string, latency: string}) => void) {
    this.socketIoClient.on(SocketEvents.HEARTBEAT, handler)
  }
  addDisconnectHandler(handler: ({id}: {id: string}) => void) {
    this.socketIoClient.on(SocketEvents.DISCONNECT, handler)
  }

  async getAllNodesId(): Promise<string[]> {
    return (await axios.get<string[]>('http://localhost:3001/getAllNodesId')).data
  }
}


export const socketServiceInstance = new SocketService()