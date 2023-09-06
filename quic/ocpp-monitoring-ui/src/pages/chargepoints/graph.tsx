import { Col, Container, Row } from "react-bootstrap";
import { PageSkeleton } from "../../components/PageSkeleton";
import { NodeGraphV2 } from "../../components/NodeGraphV2";
import ChargepointDetail from "../../components/ChargepointDetail";
import { useState } from 'react';

export default function Index() {
  const [selectedId, setSelectedId] = useState(-1);
  return (
    <PageSkeleton>
      <Container fluid>
        <Row>
          <Col style={{position: 'relative'}} className=''>
            <NodeGraphV2 setSelectedId={setSelectedId}></NodeGraphV2>
          </Col>
          <Col className='col-md-4'>
            <ChargepointDetail itemId={selectedId}></ChargepointDetail>
          </Col>
        </Row>
      </Container>
    </PageSkeleton>
  );
}
