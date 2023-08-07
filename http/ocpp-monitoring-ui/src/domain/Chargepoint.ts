export interface Chargepoint {
  id: string;
  ip: string;
  lastPing: string;
  centralSystem: string;
  status: "connected" | "disconnected" | "monitoring-stopped";
  location: {lat: number, lng: number};
  hasPlugin: boolean;
}