
import React from 'react';

import {
  Col,
  Row,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ListGroupItem,
  ListGroup
} from 'reactstrap';
import Loading from 'components/Loading';
import NotData from 'components/Error/NotData';
import * as ActionTypes from '../actions/types';
import { connect } from 'react-redux';
import * as Color from 'configs/color';
import PropTypes from 'prop-types'

class VOAComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.data) {
      return {
        data: props.data,
      };
    }
    return null;
  }

  componentDidMount() {
    this.props.fetchVOAList();
  }

  renderItem = () => {
    const { data } = this.state;

    return data.map((item, index) => {
      const link = `/ames/VOA-itemList/${item.id}`;
      return (
        <ListGroupItem key={index} style={{ cursor: 'pointer' }} className="px-0" onClick={() => this.props.history.push(link)}>
          <Row className="align-items-center ml-2 mr-2">
            <Col className="col-auto">

              {/* <a
                className="avatar"
                href="#pablo"
                onClick={e => e.preventDefault()}
              > */}
                <img alt={item.title} src={item.imageUrl} />
              {/* </a> */}
            </Col>
            <div className="col ml--2">
              <h4 className="mb-0">
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  {item.title}
                </a>
              </h4>
              {/* <span className="text-success">●</span> */}
              {/* <small>{item.exercise}{'. '}{item.exerciseName}</small> */}
            </div>
            <Col className="col-auto">
              <Button color="default" size="sm" type="button">
                Chi tiết
            </Button>
            </Col>
          </Row>
        </ListGroupItem>

      );
    });
  };

  render = () => {
    const { data } = this.state;
    const defautColor = `header bg-${Color.PRIMARY} pb-6`;
    if (this.props.loading) {
      return <Loading />;
    }

    if (data.length === 0) {
      return <NotData />;
    }

    return (
      <>
        <div className={defautColor}>
          <Container fluid>
            <div className="header-body">
              <Row className="align-items-center py-4">
                <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
                  <h5 className="h2 text-white d-inline-block mb-0">VOA</h5>{' '}
                  <Breadcrumb
                    className="d-none d-md-inline-block ml-md-4"
                    listClassName="breadcrumb-links breadcrumb-dark"
                  >
                    <BreadcrumbItem>
                      <span>
                        <i  style={{ fontSize: 15 }} className="fas fa-book-open" />
                      </span>
                    </BreadcrumbItem>
                    <BreadcrumbItem  style={{ fontSize: 15 }}>
                      <span style={{cursor: 'pointer' }} onClick={() => this.props.history.push('/ames')}>
                        HomePage
                      </span>
                    </BreadcrumbItem>
                    <BreadcrumbItem  style={{ fontSize: 15 }} aria-current="page" className="active">
                      VOA
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
        <Container className="mt--6" fluid>
          <Row>
            <Col>
              <ListGroup> {this.renderItem()}</ListGroup>
            </Col>
          </Row>
        </Container>
      </>
    );
  };
}

const mapStateToProps = (state) => ({
  data: state.VOAReducer.data,
  loading: state.VOAReducer.loading,
});

const mapDispatchToProps = (dispatch) => ({
  fetchVOAList: () => dispatch({ type: ActionTypes.FETCH_VOA_LIST }),
});

VOAComponent.propTypes = {
  // ARRAY , ObJect
  data: PropTypes.instanceOf(Array).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool,
  fetchVOAList: PropTypes.func.isRequired,
}
export default connect(mapStateToProps, mapDispatchToProps)(VOAComponent);
