import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import placeholderImg from "../../assets/listingPlaceholder.png";
import "../../stylesheets/ListingCard.css";

const ListingCard = ({ listing, handleImageLoad }) => {
  if (!listing || !listing.listingImages) return null;
  const thumbnailUrl = listing.listingImages.length ? listing.listingImages[0].imageUrl : placeholderImg;

  return (
    <Row>
      <Col sm="4" className="d-flex">
        <Link className="listing-card-link" to={`/listings/${listing.id}`}>
          <Card className="listing-card">
            <CardBody className="listing-card-body d-flex flex-column align-items-center">
              <img src={thumbnailUrl} onLoad={handleImageLoad} alt={`${listing.title}`}/>
              <CardTitle className="listing-card-title font-weight-bold text-left">
                <p>{listing.title}</p>
              </CardTitle>
              <CardText className="listing-card-text font-italic text-left">
                {`${listing.city}, ${listing.state}`}
              </CardText>
            </CardBody>
          </Card>
        </Link>
      </Col>
    </Row>
  );
};

export default ListingCard;
