import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Rate, BackTop } from 'antd';
import {
  Row,
  Col,
  Button,
  Card,
  CardImg,
  Progress,
  CardBody,
  CardTitle,
  Container,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';

import Loading from 'components/Loading';
import NotData from 'components/Error/NotData';

import { connect } from 'react-redux';
import * as ActionTypes from '../actions/types';

import * as Colors from 'configs/color.js'
import PropTypes from 'prop-types';
import PartsModal from 'components/Modal/PartsModal';

class SessionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkTypeNext: false,
      classId: props.match.params.classId,
      data: [],
      loggedInUser: [],
      classItem: [],
      isVisibled: false,
      groupPart: [],
      item: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.data) {
      return {
        data: props.data,
        classItem: props.selectedClass,
        loggedInUser: props.loggedInUser,
        //Kiểm tra khóa học loại nào để chuyển đến trang Assignments hay questions
        checkTypeNext: props.checkTypeNext,
      };
    }
    return null;
  }

  componentDidMount = () => {
    this.getSessions();
  };

  getSessions = async () => {

    const { fetchSessions } = this.props;

    const { classId, loggedInUser, classItem } = this.state;

    const typeClass = classItem.courseType;
    const note = classItem.note;
    const studentId =
      typeClass === 'AMES'
        ? loggedInUser.userMyames.StudentId
        : loggedInUser.userMyai.StudentId;

    const payload = {
      classId,
      studentId,
      typeClass,
      note,
      classItem
    };
    fetchSessions(payload);
  };

  //Render Card Item
  renderItem = () => {
    const { data } = this.state;
    const imageUrl = require('assets/img/English_bg.svg');
    // 'https://image.freepik.com/free-photo/english-lettering-blue-wooden-background_23-2148293461.jpg';

    return data.map((item, index) => {
      const title = item.title || item.sessionName;
      return (
        <Col xs={12} sm={6} md={4} lg={4} xl={4} xxl={4} key={index}>
          {/* <Link to={linkNext}> */}
          <Card style={{ cursor: 'pointer' }} onClick={() => this.moveToNextPage(item)}>
            <CardImg alt="..." src={imageUrl} top />
            <CardBody>
              <CardTitle
                className="mb-3 text-info"
                style={{ fontWeight: '700', fontSize: 15 }}
              >
                <Avatar
                  style={{
                    backgroundColor: '#11cdef',
                    fontWeight: '700',
                    marginRight: 10,
                  }}
                >
                  {index < 9 ? `0${index + 1}` : `${index + 1}`}
                </Avatar>
                {title}
              </CardTitle>
              <span style={{ fontWeight: '500', fontSize: 13 }}>
                Đánh giá:
                <Rate
                  style={{ marginLeft: 15 }}
                  disabled
                  allowHalf
                  value={item.star / 20}
                />
              </span>

              <div className="progress-wrapper">
                <div className="progress-info">
                  <div className="progress-label">
                    <span className='text-info'>Hoàn thành</span>
                  </div>
                  <div className="progress-percentage">
                    <span>{item.completedPercent}%</span>
                  </div>
                </div>
                <Progress
                  max="100"
                  value={item.completedPercent}
                  color="info"
                />
              </div>
              <div className="text-right">
                <Button
                  outline
                  color="info"
                  // href="#pablo"
                  onClick={() => this.moveToNextPage(item)}
                >
                  Learn more ...
                </Button>
              </div>
            </CardBody>
          </Card>
          {/* </Link> */}
        </Col>
      );
    });
  };

  moveToNextPage = (item) => {
    const { classId, checkTypeNext } = this.state;
    const { history, dispatch } = this.props;
    const groupPart = item.groupPart ? JSON.parse(item.groupPart) : [];

    // Lưu session được chọn
    dispatch({
      type: ActionTypes.SAVE_SELECTED_SESSION,
      selectedSession: item,
    });

    let linkTo = `/ames/class/${classId}/session/${item.id || item.sessionId || item.level}/assignments`;

    let linkToQuestion_new = `/ames/class/${classId}/session/${item.id || item.sessionId || item.level}/questionsMix`;

    const checkMix = groupPart.length > 1 && groupPart[0].GroupName;

    //Check TYPE
    //chuyển đến QUESTIONMODULE - Index
    if (!checkTypeNext) {

      return history.push(linkTo);
    }

    if (!checkMix) {
      dispatch({ type: ActionTypes.SAVE_SELECTED_PART, selectedPart: null, groupPart: null, partQuestion: false })

      return history.push(linkToQuestion_new);
    }
    //Chuyển đến PART MODAL
    return this.toggleModal(groupPart, item);
  };

  //Bật tắt Part Modal
  toggleModal = (groupPart, item) => {
    const { isVisibled } = this.state;
    this.setState({ isVisibled: !isVisibled, groupPart, item });
  };

  render = () => {
    const { loading, history, selectedClass } = this.props;

    const isAmes = selectedClass.courseType === 'AMES';
    const { data, isVisibled, groupPart, item, classId } = this.state;
    const color = `header bg-${Colors.PRIMARY} pb-6`

    if (loading) {
      return <Loading />;
    }

    if (!data || data === 'Error') {
      return <NotData />;
    }

    return (
      <>
        <div className={color}>
          <Container fluid>
            <div className="header-body">
              <Row className="align-items-center py-4">
                <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
                  <Link to="/ames">
                    <h6 className="h2 text-white d-inline-block mb-0">
                      HOME PAGE
                    </h6>
                  </Link>
                  <Breadcrumb
                    className="d-none d-md-inline-block ml-md-4"
                    listClassName="breadcrumb-links breadcrumb-dark"
                  >
                    <BreadcrumbItem>
                      <a href="#pablo" onClick={(e) => e.preventDefault()} style={{ fontSize: 15 }}>
                        <i className="fas fa-book-open" />
                      </a>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                      <Link to="/ames/classes" style={{ fontSize: 15 }}>{isAmes ? selectedClass.className : selectedClass.courseName}</Link>
                    </BreadcrumbItem>


                    <BreadcrumbItem aria-current="page" className="active">
                      <span style={{ fontSize: 15 }}>Sessions</span>
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
        <Container className="mt--6" fluid>
          <Row>{this.renderItem()}</Row>
        </Container>
        <PartsModal
          isVisibled={isVisibled}
          toggleModal={this.toggleModal}
          groupPart={groupPart}
          sessionItem={item}
          history={history}
          classId={classId}
        />
        <BackTop />
      </>
    );
  };
}

const mapStateToProps = (state) => {

  return {
    data: state.sessionReducer.data,
    checkTypeNext: state.sessionReducer.checkTypeNext,
    loading: state.sessionReducer.loading,
    selectedClass: state.classReducer.selectedClass,
    loggedInUser: state.loginReducer.loggedInUser,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchSessions: (payload) =>
    dispatch({ type: ActionTypes.FETCH_SESSION, payload }),
  dispatch,
});

SessionComponent.propTypes = {
  history: PropTypes.instanceOf(Object),
  dispatch: PropTypes.instanceOf(Object),
  match: PropTypes.instanceOf(Object),
  data: PropTypes.instanceOf(Object),
  checkTypeNext: PropTypes.bool,
  loggedInUser: PropTypes.instanceOf(Object),
  selectedClass: PropTypes.instanceOf(Object),
  loading: PropTypes.bool,
  fetchSessions: PropTypes.func,
  classId: PropTypes.string,
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionComponent);
