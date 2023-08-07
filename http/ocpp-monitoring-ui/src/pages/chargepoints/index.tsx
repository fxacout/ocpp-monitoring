import React, { useState, useEffect } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { PageSkeleton } from "../../components/PageSkeleton";
import axios from "axios";
import Notiflix from 'notiflix';

interface ChargePoint {
  id: number;
  location: string;
  centralSystemName: string;
  lastPingTime: string;
  status: "connected" | "disconnected" | "monitoring-stopped";
  hasPlugin: boolean;
}

const ChargePointTable = () => {
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([]);

  const refresh = async () => {
    const chargePoints: any[] = (
      await axios.get("http://localhost:3001/chargepoint")
    ).data;
    setChargePoints(
      chargePoints.map((chargePoint: any) => {
        return {
          id: chargePoint.id,
          location: `https://maps.google.com/?q=${chargePoint.location.lat},${chargePoint.location.lng}`,
          centralSystemName: chargePoint.centralSystem,
          lastPingTime: new Date(chargePoint.lastPing * 1000).toUTCString(),
          status: chargePoint.status,
          hasPlugin: chargePoint.hasPlugin,
        } as ChargePoint;
      })
    );
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
          resolve(true);
        });
      }, 10_000);
    });
    promise.then(() => {
      refreshAfterWait();
    });
  };

  const handleToggle = (id: number, action: 'stopped' | 'activated') => {
    axios
      .put(`http://localhost:3001/chargepoint/${id}/toggle`)
      .then(() => {
        refresh();
        Notiflix.Notify.success(`Chargepoint ${action}`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const handleMonitoring = (id: number, action: 'resumed' | 'stopped') => {
    axios
      .put(`http://localhost:3001/chargepoint/${id}`, {
        status: action === 'resumed' ? 'connected' : 'monitoring-stopped'
      })
      .then(() => {
        refresh();
        Notiflix.Notify.success(`Chargepoint ${action}`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <PageSkeleton>
      <Container>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Central System Name</th>
            <th>Last Ping Time</th>
            <th>Status</th>
            <th>Plugin Actions</th>
            <th>Monitoring Actions</th>
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
                  className='btn btn-link'
                >
                  View on Google Maps
                </a>
              </td>
              <td>{chargePoint.centralSystemName}</td>
              <td>{chargePoint.lastPingTime}</td>
              <td>
                {chargePoint.status === "connected" ? (
                  <i className="bi bi-check-circle"></i>
                ) : chargePoint.status === "disconnected" ? (
                  <i className="bi bi-sign-stop-fill"></i>
                ) : (
                  <a>Stopped Monitoring</a>
                )}
              </td>
              <td>
                {chargePoint.hasPlugin ? (
                  // Create a button to activate or deactivate the pluggin, based on the status. Only do the html tags
                  chargePoint.status === "connected" ? (
                    <Button variant="danger" onClick={() => handleToggle(chargePoint.id, 'stopped')}>
                      <i className="bi bi-sign-stop-fill"></i> Stop chargepoint
                    </Button>
                  ) : chargePoint.status === "disconnected" ? (
                    <Button variant="success" onClick={() => handleToggle(chargePoint.id, 'activated')}>
                      <i className="bi bi-check-circle-fill"></i> Start
                      chargepoint
                    </Button>
                  ) : (
                    <a>Stopped Monitoring</a>
                  )
                ) : (
                  <a>Plugin not Installed</a>
                )}
              </td>
              <td>
              {
                (chargePoint.status === 'disconnected') ? (
                  <a>Disconnected</a>
                ) : (
                  chargePoint.status === "monitoring-stopped" ? (
                    <Button variant="info" onClick={() => handleMonitoring(chargePoint.id, 'resumed')}>
                      <i className="bi bi-check-circle-fill"></i> Resume monitoring
                    </Button>
                  ) : (
                    <Button variant="danger" onClick={() => handleMonitoring(chargePoint.id, 'stopped')}>
                      <i className="bi bi-sign-stop-fill"></i> Stop monitoring
                    </Button>
                  )
                )
              }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </Container>
    </PageSkeleton>
  );
};

export default ChargePointTable;
