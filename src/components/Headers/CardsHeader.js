import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Row,
  Col,
  CardBody,
  CardTitle,
  Container,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
import * as Color from 'configs/color'

const data = [
  {
    title: 'Thời gian truy cập trong tuần',
    count: '350,897',
    percent: '3.48%',
    note: 'Since last week',
    classNameIcon: 'icon icon-shape bg-gradient-red text-white rounded-circle shadow',
    icon: 'ni ni-active-40'
  },
  {
    title: 'Thời gian truy cập trong tháng',
    count: '2,356',
    percent: '3.48%',
    note: 'Since last month',
    classNameIcon: 'icon icon-shape bg-gradient-orange text-white rounded-circle shadow',
    icon: 'ni ni-chart-pie-35'
  },
  {
    title: ' Số bài học đã hoàn thành',
    count: '924',
    percent: '3.48%',
    note: 'Since last month',
    classNameIcon: 'icon icon-shape bg-gradient-green text-white rounded-circle shadow',
    icon: 'ni ni-money-coins'
  },
  {
    title: ' Số từ đã học được',
    count: '1024',
    percent: '3.48%',
    note: 'Since last month',
    classNameIcon: 'icon icon-shape bg-gradient-primary text-white rounded-circle shadow',
    icon: 'ni ni-chart-bar-32'
  },
]
class CardsHeader extends React.Component {

  cardRender = () => {
    return data.map((item, index) => {
      return (
        <Col key={index} xl={3} lg={6} md={6} sm={12} xs={12}>
          <Card className="card-stats">
            <CardBody>
              <Row>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                    style={{ minHeight: 50 }}
                  >
                    {item.title}
                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">{item.count}</span>
                </div>
                <Col className="col-auto">
                  <div className={item.classNameIcon}>
                    <i className={item.icon} />
                  </div>
                </Col>
              </Row>
              <p className="mt-3 mb-0 text-sm">
                <span className="text-success mr-2">
                  <i className="fa fa-arrow-up" />
                  {item.percent}
                </span>
                <span className="text-nowrap">{item.note}</span>
              </p>
            </CardBody>
          </Card>
        </Col>
      )
    })
  }
  render() {
    const defautColor = `header bg-${Color.PRIMARY} pb-6`
    return (
      <>
        <div className={defautColor}>
          <Container fluid>
            <div className="header-body">
              <Row className="align-items-center py-4">
                <Col lg="6" xs="7">
                  <h6 className="h2 text-white d-inline-block mb-0">
                    {this.props.name}
                  </h6>{' '}
                  <Breadcrumb
                    className="d-none d-md-inline-block ml-md-4"
                    listClassName="breadcrumb-links breadcrumb-dark"
                  >
                    <BreadcrumbItem>
                      <a href="#pablo" onClick={(e) => e.preventDefault()} >
                        <i style={{ fontSize: 18 }} className="fas fa-home" />
                      </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <h6 className="h5 text-white d-inline-block mb-0" style={{ fontSize: 15 }}>
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => this.props.history.push(this.props.parentHref)}
                        >
                          {this.props.parentName}
                        </span>
                      </h6>
                    </BreadcrumbItem>
                    <BreadcrumbItem style={{ fontSize: 15 }} aria-current="page" className="active">
                      {this.props.name}
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Col>
                <Col className="text-right" lg="6" xs="5">
                  {/* <Button
                    className="btn-neutral"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    New
                  </Button>
                  <Button
                    className="btn-neutral"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Filters
                  </Button> */}
                </Col>
              </Row>
              {this.props.showCard && (
                <Row>
                  {this.cardRender()}
                </Row>
              )}
            </div>
          </Container>
        </div>
      </>
    );
  }
}

CardsHeader.propTypes = {
  name: PropTypes.string,
  parentName: PropTypes.string,
  parentHref: PropTypes.string,
  showCard: PropTypes.bool,
  history: PropTypes.instanceOf(Object)
};

export default CardsHeader;
