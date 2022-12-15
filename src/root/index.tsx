import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import Navbar from '../navbar';

const Root: FC = () => (
  <Container fluid>
    <Row>
      <Col>
        <Navbar />
      </Col>
    </Row>
    <Row>
      <Col>
        <Container>
          <Outlet />
        </Container>
      </Col>
    </Row>
  </Container>
);

export default Root;
