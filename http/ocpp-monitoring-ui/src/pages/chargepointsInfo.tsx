import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { PageSkeleton } from '../components/PageSkeleton';
import axios from 'axios';

interface ChargePoint {
  id: number;
  location: string;
  centralSystemName: string;
  lastPingTime: string;
  status: "connected" | "disconnected";
}

const ChargePointTable = () => {
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([]);

  const refresh = async () => {
    const chargePoints: any[] = (await axios.get('http://localhost:3001/chargepoint')).data
    setChargePoints(chargePoints.map(
      (chargePoint: any) => {
        return {
          id: chargePoint.id,
          location: `https://maps.google.com/?q=${chargePoint.location.lat},${chargePoint.location.lng}`,
          centralSystemName: chargePoint.centralSystem,
          lastPingTime: new Date(chargePoint.lastPing * 1000).toUTCString(),
          status: chargePoint.status
        } as ChargePoint
      }
    ))
  };

  // Simulate fetching data from an API or use a real API call here
  useEffect(() => {
    // Replace this with your API endpoint
    // For demonstration purposes, we use mock data here
    refresh();
    refreshAfterWait();
  }, []);
  
  const refreshAfterWait = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        refresh().then(() => { 
          resolve(true)
          });
      }, 10_000);
    });
    promise.then(() => {
      refreshAfterWait()
    } )
  }

  return (
    <PageSkeleton>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Central System Name</th>
            <th>Last Ping Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {chargePoints.map((chargePoint) => (
            <tr key={chargePoint.id}>
              <td>{chargePoint.id}</td>
              <td>
                <a
                  href={chargePoint.location}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </a>
              </td>
              <td>{chargePoint.centralSystemName}</td>
              <td>{chargePoint.lastPingTime}</td>
              <td>
                {chargePoint.status === "connected" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                  </svg>
                ) : chargePoint.status === "disconnected" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-x-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-sign-stop"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.16 10.08c-.931 0-1.447-.493-1.494-1.132h.653c.065.346.396.583.891.583.524 0 .83-.246.83-.62 0-.303-.203-.467-.637-.572l-.656-.164c-.61-.147-.978-.51-.978-1.078 0-.706.597-1.184 1.444-1.184.853 0 1.386.475 1.436 1.087h-.645c-.064-.32-.352-.542-.797-.542-.472 0-.77.246-.77.6 0 .261.196.437.553.522l.654.161c.673.164 1.06.487 1.06 1.11 0 .736-.574 1.228-1.544 1.228Zm3.427-3.51V10h-.665V6.57H4.753V6h3.006v.568H6.587Z" />
                    <path
                      fill-rule="evenodd"
                      d="M11.045 7.73v.544c0 1.131-.636 1.805-1.661 1.805-1.026 0-1.664-.674-1.664-1.805V7.73c0-1.136.638-1.807 1.664-1.807 1.025 0 1.66.674 1.66 1.807Zm-.674.547v-.553c0-.827-.422-1.234-.987-1.234-.572 0-.99.407-.99 1.234v.553c0 .83.418 1.237.99 1.237.565 0 .987-.408.987-1.237Zm1.15-2.276h1.535c.82 0 1.316.55 1.316 1.292 0 .747-.501 1.289-1.321 1.289h-.865V10h-.665V6.001Zm1.436 2.036c.463 0 .735-.272.735-.744s-.272-.741-.735-.741h-.774v1.485h.774Z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M4.893 0a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146A.5.5 0 0 0 11.107 0H4.893ZM1 5.1 5.1 1h5.8L15 5.1v5.8L10.9 15H5.1L1 10.9V5.1Z"
                    />
                  </svg>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageSkeleton>
  );
};

export default ChargePointTable;
