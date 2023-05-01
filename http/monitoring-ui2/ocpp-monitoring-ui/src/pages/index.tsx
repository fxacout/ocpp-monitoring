import { Audit } from "@/components/Audit";
import { CustomMap } from "@/components/Map";
import { NavBar } from "@/components/NavBar";
import { NodeStatus } from "@/components/NodeStatus";

export default function Index() {
  return (
    <div>
      <NavBar></NavBar>
       <div className="flex flex-row">
      <div className="basis-3/4">
      <CustomMap></CustomMap>
      </div>
      <div className="basis-1/4">
      <div className="flex flex-col">
        <NodeStatus></NodeStatus>
        <hr
  className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-80" />
        <Audit></Audit>
      </div>
      </div>
      
    </div>
    </div>
    
  )
}