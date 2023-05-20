import { Dispatch, SetStateAction, useState } from "react";
import LatencySVG from "./LatencySVG";
import type { NodeInfo } from "@/domain/NodeInfo";
import { socketServiceInstance } from "@/service/SocketService";


export let nodeInfoHook: Dispatch<SetStateAction<NodeInfo | undefined>> | undefined;

export function NodeStatus() {

  const [latencyMap, updateLatencyMap] = useState<Record<string, number>>({})

  socketServiceInstance.addHeartbeatHandler(({id, latency}) => {
    console.log(`Heartbeat ${id}, ${latency}`)
    updateLatencyMap((oldValue) => {
      oldValue[id] = Number(latency) * 10e6
      return oldValue
    })
  })

  const [nodeInfo, setNodeInfo] = useState<NodeInfo>()
  nodeInfoHook = setNodeInfo
    if (nodeInfo){
      
    return (
      <div className="grid lg:grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Tile 2 */}
        <div className="flex items-center p-4 bg-white rounded">
          <a>Name: {nodeInfo.id === '0'? 'Central Point': `Chargepoint: ${nodeInfo.id}`}</a>
        </div>
        {/* Tile 3 */}
        <div className="flex items-center p-4 bg-white rounded">
          <a>Position: {`Latitude ${nodeInfo.position.latitute}\n Longitude ${nodeInfo.position.longitude}`}</a>
        </div>
        {/* Tile 1 */}
        <div className="flex items-center p-4 bg-white rounded">
          <div className="flex flex-shrink-0 items-center justify-center h-12 w-12 rounded">
            <LatencySVG/>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">{latencyMap[nodeInfo.id]?.toFixed(2) || '∞'}ms</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Latency</span>
            </div>
          </div>
        </div>
      </div>
    );
    } else {
      return (
        <div className="flex items-center p-4 bg-white rounded">
          <a>Select a node to see it&apos;s info</a>
        </div>
      )
    }
}
