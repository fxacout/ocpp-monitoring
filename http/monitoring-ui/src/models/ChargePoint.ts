export interface ChargePointConnected {
    id: string
    latency: string
}

export interface ChargePointDisconnected {
    id: string
}

export interface ChargePointLatency {
    id: string
    latency: number
}

export interface UpdateAllNodes {
    id: string
}