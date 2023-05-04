import LatencySVG from "./LatencySVG";

export function NodeStatus() {
  return (
    <div className="grid lg:grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
      {/* Tile 2 */}
      <div className="flex items-center p-4 bg-white rounded">
        <a>Name: </a>
      </div>
      {/* Tile 3 */}
      <div className="flex items-center p-4 bg-white rounded">
        <a>Position: </a>
      </div>
      {/* Tile 1 */}
      <div className="flex items-center p-4 bg-white rounded">
        <div className="flex flex-shrink-0 items-center justify-center h-12 w-12 rounded">
          <LatencySVG/>
        </div>
        <div className="flex-grow flex flex-col ml-4">
          <span className="text-xl font-bold">8.32ms</span>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Latency</span>
          </div>
        </div>
      </div>
    </div>
  );
}
