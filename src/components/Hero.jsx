import React, { useContext } from "react";
import { Container, Row, Col, Button, Card, CardBody } from "reactstrap";
import ModalContext from "../context/ModalContext";
import ImpactContext from "../context/ImpactContext";
import "../stylesheets/Hero.css"

const Hero = () => {
  const { toggleSignup } = useContext(ModalContext);
  const { itemsGivenAway } = useContext(ImpactContext);

  return (
    <Container className="hero text-center my-5">
      <Card className="p-4">
        <CardBody>
          <h1 className="display-4">
            <b>Empower Your Community by Sharing Free Items!</b>
          </h1>
          <p className="lead">
            Join us in reducing waste and fostering connections by giving away
            items you no longer need. Together, we can create a sustainable
            future and help those in need.
          </p>
          <h2 className="mt-2">
            Total Items Given Away and Saved from Landfill:{" "}
            <strong>{itemsGivenAway}</strong>
          </h2>
          <Row className="justify-content-center">
            <Col md="auto">
              <Button className="hero-btn" onClick={toggleSignup} color="info" size="lg">
                <p>Sign up now to start sharing and discovering free items near
                you!</p>
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Hero;
