import { SocketEvents } from "@/domain/SocketEvents"
import axios from "axios";
import { DefaultUser } from "next-auth";
import { io } from "socket.io-client";

class SocketService {
  socketIoClient
  url: string
  constructor() {
    this.url = (typeof window === 'undefined')? 'http://monitoring_log:3000' :'http://localhost:3001'
    console.log(this.url)
    this.socketIoClient = io(this.url)
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

  addUserHandler(handler: (user: DefaultUser) => void) {
    this.socketIoClient.on(SocketEvents.USER, handler)
  }

  async emitUserLogin(user: DefaultUser) {
    return axios.post(`${this.url}/user`, {id: user.id, image: user.image, name: user.name, email: user.email})
  }

  async getAllNodesId(): Promise<string[]> {
    return (await axios.get<string[]>('http://localhost:3001/getAllNodesId')).data
  }
}


export const socketServiceInstance = new SocketService()