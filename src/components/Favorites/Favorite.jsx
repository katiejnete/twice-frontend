import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";
import placeholderImg from "../../assets/listingPlaceholder.png";
import "../../stylesheets/Favorite.css";

const Favorite = ({ favorite, handleImageLoad, removeFavorite }) => {
  const navigate = useNavigate();

  // use first listing image if avail, otherwise use placeholder
  const thumbnailUrl = favorite.listingImages.length
    ? favorite.listingImages[0].imageUrl
    : placeholderImg;

  // remove favorite and navigate back to favorites list
  const handleRemove = async () => {
    await removeFavorite(favorite.id);
    return navigate("/account/favorites");
  };

  return (
    <Row>
      <Col sm="4" className="d-flex">
        <Link className="listing-card-link" to={`/listings/${favorite.id}`}>
          <Card className="listing-card">
            <CardBody className="listing-card-body d-flex flex-column align-items-center">
              <img src={thumbnailUrl} onLoad={handleImageLoad} />
              <CardTitle className="listing-card-title font-weight-bold text-left">
                <p>{favorite.title}</p>
              </CardTitle>
              <CardText className="listing-card-text font-italic text-left">
                {`${favorite.city}, ${favorite.state}`}
                <button type="submit" onClick={handleRemove}>
                  Remove
                </button>
              </CardText>
            </CardBody>
          </Card>
        </Link>
      </Col>
    </Row>
  );
};

export default Favorite;
