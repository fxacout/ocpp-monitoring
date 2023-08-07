/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { Data, Edge, Network, Node, Options } from "vis-network";

const centralSystemImg = "/centralSystem.png";
const chargePointImg = "/chargePointIcon.png";

export function NodeGraphV2({setSelectedId} : {setSelectedId: (id: number) => void}) {
  let [nodes, setNodes] = useState<Node[]>([]);
  let [edges, setEdges] = useState<Edge[]>([]);
  const [networkData, setNetworkData] = useState<any>({ nodes: [], edges: [] });
  const [networkOptions, setNetworkOptions] = useState<any>({});
  const refresh = refreshData(setNodes, setEdges);

  useEffect(() => {
    refresh(); // Fetch data immediately when the component mounts

    // Fetch data every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(() => {
      refresh();
    }, 5000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setNetworkData({ nodes, edges });
  }, [nodes, edges]);

  useEffect(() => {
    const container = document.getElementById("mynetwork");
    
    setNetworkOptions({
      autoResize: true,
      nodes: {
        borderWidth: 4,
        size: 30,
        color: {
          border: "#222222",
          background: "#666666",
        },
        font: { color: "#eeeeee" },
      },
      layout: {
        hierarchical: {
          direction: "DU",
          sortMethod: "directed",
        },
      },
      edges: {
        color: "lightgray",
      },
      groups: {
        centralSystem: {
          shape: "circularImage",
          image: centralSystemImg,
        },
        chargePoint: {
          shape: "circularImage",
          image: chargePointImg,
        },
      },
    });
    const network = new Network(container!, networkData, networkOptions);
    
    network.on("click", function (params) {
      const nodeId = network!.getNodeAt(params.pointer.DOM);
      console.log("ID: " + nodeId);
      if (nodeId) {
        setSelectedId(Number(nodeId));
      }
    });
    return () => {
      network?.destroy();
    }
  }, [nodes, edges]);

  return (
    <div 
    style={{
      width: "100%",
      height: "100%",
      position: "absolute",
    }}id="mynetwork">
      <a></a>
    </div>
  );
}

function refreshData(
  setNodes: { (value: SetStateAction<Node[]>): void; (arg0: Node[]): void },
  setEdges: { (value: SetStateAction<Edge[]>): void; (arg0: Edge[]): void }
) {
  return async () => {
    const chargepoints = (
      await axios.get<any[]>("http://localhost:3001/chargepoint")
    ).data;
    const centralSystems = new Set<string>();
    let counter = 1;
    const centralSystemMap = new Map<string, number>();
    const newNodes = chargepoints
      .map((chargepoint) => {
        centralSystems.add(chargepoint.centralSystem);
        return {
          id: chargepoint.id,
          group: "chargePoint",
          label: "ChargePoint " + chargepoint.id,
        } as Node;
      })
      .concat(
        ...Array.from(centralSystems).map((centralSystem) => {
          centralSystemMap.set(centralSystem, counter);
          const node = {
            id: counter,
            group: "centralSystem",
            label: centralSystem.replace("-", " "),
          } as Node;
          counter++;
          return node;
        })
      );
    setNodes(newNodes);

    const newEdges: Edge[] = chargepoints.map((chargepoint) => {
      return {
        from: chargepoint.id,
        to: centralSystemMap.get(chargepoint.centralSystem),
      } as Edge;
    });
    setEdges(newEdges);
  };
}
