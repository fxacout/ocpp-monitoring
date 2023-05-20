import { useMemo, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  MarkerProps,
} from "@react-google-maps/api";
import { nodeInfoHook } from "./NodeStatus";
import { socketServiceInstance } from "@/service/SocketService";

export type MarkerPropsEnhanced = MarkerProps & { id: string };

export function CustomMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "EMPTY",
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

const randomizeLocation = (point: {lat: number, lng: number}) => {
  return {
    lat: point.lat + Math.random() * 0.1,
    lng: point.lng + Math.random() * 0.1,
  }
}

const getPodInfo = (id: string, position: google.maps.LatLngLiteral) => {
  if (nodeInfoHook) {
    nodeInfoHook({
      id,
      position: {
        latitute: position.lat,
        longitude: position.lng,
      },
    });
  }
};

function Map() {
  const center = useMemo(() => ({ lat: 36.7150286, lng: -4.4738605 }), []);

  const [markersReady, setAreMarkersReady] = useState<MarkerPropsEnhanced[]>([]);
  if (markersReady.length === 0) {
    socketServiceInstance.getAllNodesId().then((value) => {
      const newMarkers = value.map(
        (elem) => ({
          position: randomizeLocation(center),
          visible: true,
          id: elem
        })
        )
      setAreMarkersReady(
        newMarkers
      )
      updateMarkers((oldValue) => {
        if (!oldValue.find((elem) => newMarkers.some((newElem) => newElem.id === elem.id))) {
          return oldValue.concat(...newMarkers)
        }
        return oldValue
      })
    })
  }
  console.dir(markersReady)

  const [markers, updateMarkers] = useState<MarkerPropsEnhanced[]>([
    {
      position: center,
      visible: true,
      id: "0",
    },
  ]);

  socketServiceInstance.addConnectHandler(({ id }) => {
    updateMarkers((oldState) => {
      oldState.push({
        id,
        position: randomizeLocation(center),
        visible: true,
      });
      return oldState;
    });
  });
  socketServiceInstance.addDisconnectHandler(({ id }) => {
    updateMarkers((oldState) => {
      const index = oldState.findIndex((elem) => elem.id === id);
      if (index > -1) {
        oldState.splice(index, 1);
      }
      return oldState;
    });
  });
  if (markersReady.length === 0) {
    return (
      <div>Loading...</div>
    );
  }
  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
      {...markers.map((markerProps) => (
        <MarkerF
          position={markerProps.position}
          visible={markerProps.visible}
          icon={
            markerProps.id === "0"
              ? "http://localhost:3000/centralSystem.png"
              : "http://localhost:3000/chargePointIcon.png"
          }
          onClick={() =>
            getPodInfo(
              markerProps.id,
              markerProps.position as google.maps.LatLngLiteral
            )
          }
          key={markerProps.id}
        />
      ))}
    </GoogleMap>
  );
}
