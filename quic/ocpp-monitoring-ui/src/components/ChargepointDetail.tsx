import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faClock,
  faServer,
  faInfoCircle,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // for API calls
import { Chargepoint } from '../domain/Chargepoint';

const ChargepointDetail = ({ itemId } = { itemId: -1 }) => {
  const [statusData, setStatusData] = useState<{
    id: string;
    lastPing: string;
    status: string;
    centralSystemName: string;
    location: string;
    logs: string[];
  } | null>(null);

  useEffect(() => {
    if (itemId === -1) {
      return;
    }
    axios.get<Chargepoint>(`http://localhost:3001/chargepoint/${itemId}`)
      .then(response => {
        setStatusData({
          id: response.data.id,
          lastPing: response.data.lastPing,
          status: response.data.status,
          centralSystemName: response.data.centralSystem,
          location: `https://maps.google.com/?q=${response.data.location.lat},${response.data.location.lng}`,
          logs: [
            "2021-10-01 12:00:00: Chargepoint 1 started charging",
            "2021-10-01 12:00:00: Chargepoint 1 stopped charging",
            "2021-10-01 12:00:00: Chargepoint 1 started charging",
            "2021-10-01 12:00:00: Chargepoint 1 stopped charging",
            "2021-10-01 12:00:00: Chargepoint 1 started charging",
            "2021-10-01 12:00:00: Chargepoint 1 stopped charging",
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching status data:', error);
      });
  }, [itemId]);

  if (!statusData) {
    return (
      <div className="status-card">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              <FontAwesomeIcon icon={faInfoCircle} /> Loading...
            </h5>
          </div>
        </div>
      </div>
    );
  }

  const { id, lastPing, status, centralSystemName, location, logs } =
    statusData;

  return (
    <div className="status-card">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            <FontAwesomeIcon icon={faInfoCircle} /> {id}
          </h5>
          <p className="card-text">
            <FontAwesomeIcon icon={faClock} /> Last Ping: {lastPing}
          </p>
          <p className="card-text">
            <FontAwesomeIcon icon={faServer} /> Status: {status}
          </p>
          <p className="card-text">
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Central System Name:{" "}
            {centralSystemName}
          </p>
          <p className="card-text">
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Location:{" "}
            <a href={location} target="_blank" rel="noopener noreferrer">
              Google Maps
            </a>
          </p>
          <div className="logs-console">
            <FontAwesomeIcon icon={faClipboardList} /> Last Logs:
            <pre>
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargepointDetail;
