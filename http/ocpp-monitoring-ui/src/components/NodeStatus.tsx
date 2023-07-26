import { Dispatch, SetStateAction, useState } from "react";
import LatencySVG from "./LatencySVG";
import type { NodeInfo } from "@/domain/NodeInfo";
import { socketServiceInstance } from "@/service/SocketService";
import { Col, Container, Row } from 'react-bootstrap';


export let nodeInfoHook: Dispatch<SetStateAction<NodeInfo | undefined>> | undefined;

export function NodeStatus() {

  const [latencyMap, updateLatencyMap] = useState<Record<string, number>>({})

  socketServiceInstance.addHeartbeatHandler(({id, latency}) => {
    updateLatencyMap((oldValue) => {
      oldValue[id] = Number(latency) * 10e3
      return oldValue
    })
  })

  const [nodeInfo, setNodeInfo] = useState<NodeInfo>()
  nodeInfoHook = setNodeInfo
    if (nodeInfo){
      
    return (
      <Container>
        {/* Tile 2 */}
        <Row>
          <a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-award" viewBox="0 0 16 16">
  <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
  <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
</svg> Name: {nodeInfo.id === '0'? 'Central Point': `Chargepoint: ${nodeInfo.id}`}</a>
        </Row>
        {/* Tile 3 */}
        <Row>
          <a> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
</svg> Position: {`Latitude ${nodeInfo.position.latitute}\n Longitude ${nodeInfo.position.longitude}`}</a>
        </Row>
        {/* Tile 1 */}
        <Row>
          <Col>
            <p> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-activity" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>
</svg> Latency: {latencyMap[nodeInfo.id]?.toFixed(2) || '∞'}ms</p>
          </Col>
        </Row>
      </Container>
    );
    } else {
      return (
        <div className="">
          <a>Select a node to see it&apos;s info</a>
        </div>
      )
    }
}
