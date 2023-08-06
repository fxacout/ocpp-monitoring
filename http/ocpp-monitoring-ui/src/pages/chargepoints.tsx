/* eslint-disable react-hooks/rules-of-hooks */
import { Audit } from "@/components/Audit";
import { CustomMap } from "@/components/Map";
import { NavBar } from "@/components/NavBar";
import { NodeStatus } from "@/components/NodeStatus";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { Col, Container, Row } from 'react-bootstrap';
import { PageSkeleton } from '../components/PageSkeleton';

export default function Index() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <PageSkeleton authenticated={true}>
      <Container fluid>
        <Row>
        <Col className='col-md-10'>
          <CustomMap></CustomMap>
        </Col>
        <Col>
          <Row>
            <NodeStatus></NodeStatus>
            </Row>
          
        </Col>
        </Row>
      </Container>
      </PageSkeleton>
  );
}
