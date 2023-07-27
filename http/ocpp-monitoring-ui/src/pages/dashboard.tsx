import React from "react";
import LatencyGraph from "../components/dashboard/LatencyGraph";
import HealthGraph from "../components/dashboard/SystemHealth";
import UsageGraph from "../components/dashboard/UsageGraph";
import { PageSkeleton } from "../components/PageSkeleton";
import { Card, Col, Container, Row } from "react-bootstrap";
import TotalHealth from '../components/dashboard/TotalHealth';

const Dashboard = () => {
  return (
    <PageSkeleton>
      <Container className='container-sm' fluid>
        <Row>
          <Card className='bg-dark border-info mb-3'>
            <Card.Header className="text-white text-center">
              System health
            </Card.Header>
            <Card.Body>
              <TotalHealth health={100} />
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <Col>
            <Card className='bg-dark border-info mb-3'>
              <Card.Header className="text-white text-center">
                Latency over time for each node
              </Card.Header>
              <Card.Body>
                <LatencyGraph />
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='bg-dark border-info mb-3'>
              <Card.Header className="text-white text-center">
                System health (number of nodes connected)
              </Card.Header>
              <Card.Body>
                <HealthGraph />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
          <Card className='bg-dark border-info mb-3'>
              <Card.Header className="text-white text-center">
              Usage of pages by user over time
              </Card.Header>
              <Card.Body>
              <UsageGraph />
              </Card.Body>
            </Card></Col>
        </Row>
      </Container>
    </PageSkeleton>
  );
};

export default Dashboard;
