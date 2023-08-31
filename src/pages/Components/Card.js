import React from 'react';
import { CardImg, Card, CardBody, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class CardHomePage extends React.Component {
  render() {
    const { color, linkTo, detail, title,titleVN, imgLink, type } = this.props;
    const nameColor = `bg-${color} text-white text-right p-3`;
    return (
      <Col xs={12} sm={6} md={6} lg={4} xl={type === 'choose' ? 3 : 4} xxl={4}>
        <Card>
          <Link to={linkTo}>
            <CardImg alt="..." src={imgLink} top />
            <CardBody className={nameColor}>
              <blockquote className="blockquote mb-0">
                <div style={{ fontSize: 18, fontWeight: '500' }}>{title}</div>
                <div style={{ fontSize: 15, fontWeight: '400',fontStyle:'italic',marginTop:3,marginBottom:3 }}>{titleVN}</div>
                <footer className="blockquote-footer text-white">
                  <small>{detail}</small>
                </footer>
              </blockquote>
            </CardBody>
          </Link>
        </Card>
      </Col>
    );
  }
}

CardHomePage.propTypes = {
  color: PropTypes.string,
  type: PropTypes.string,
  linkTo: PropTypes.string,
  detail: PropTypes.string,
  title: PropTypes.string,
  imgLink: PropTypes.string,
  titleVN:PropTypes.string
}

export default CardHomePage;
