import { useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

export function CustomMap() {
 const { isLoaded } = useLoadScript({
   googleMapsApiKey: 'EMPTY',
 });

 if (!isLoaded) return <div>Loading...</div>;
 return <Map />;
}

const onClick = (...args: any[]) => {
  console.log(JSON.stringify(args))
}


function Map() {
 const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

 return (
   <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
     <MarkerF position={center} visible={true} icon={'http://localhost:3000/chargePointIcon.png'} onClick={onClick}/>
   </GoogleMap>
 );
}