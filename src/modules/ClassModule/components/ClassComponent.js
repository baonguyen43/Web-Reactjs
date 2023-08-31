import Loading from 'components/Loading';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem, Button,
  Card,
  CardBody,
  CardImg, CardText, CardTitle, Col as ColTrap,
  // Col,
  Container, Row as RowTrap
} from 'reactstrap';

import { BackTop, Col, Row } from 'antd';

// import { getUserTrial } from 'components/functions';
import NotData from 'components/Error/NotData';
import { getStudentId } from 'components/functions';
import * as Colors from 'configs/color';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as ActionTypes from '../actions/types';
import AssignmentComponent from './AssignmentComponent';

const colorHeaderProcess = `bg-${Colors.PRIMARY}`;
const colorHeaderFinish = 'bg-gradient-danger';
const classProcessName = ' Classes - Khóa đang học';
const classFinishName = ' Classes - Khóa đã hoàn thành';

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userTrial: false,
      data: [],
      array_process: [],
      array_finish: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.data) {
      let array_finish = [];
      let array_process = [];

      if (props.data.length > 0) {
        array_finish = props.data.filter((item) => {
          return item.type === 'FINISHED';
        });

        // Id = 88933 là tài khoản koala house (tài khoản: koalademo, mật khẩu: koalahouse), chỉ riêng tài khoản đó là ẩn sách 'Luyện tập câu chuyện'.
        const { MyAiUserId } = getStudentId()
        array_process = props.data.filter((item) => {
          return MyAiUserId === 88933
            ? item.type !== 'FINISHED' && item.className !== 'Luyện tập câu chuyện'
            : item.type !== 'FINISHED'
          // return item.type !== 'FINISHED';
        });
      }
      return {
        data: props.data,
        array_finish,
        array_process,
      };
    }
    return null;
  }

  componentDidMount = async () => {
    this.getClasses();
  };

  getClasses = async () => {
    const userId = getStudentId();
    if (userId) {
      const { fetchClass } = this.props;
      const { MyAmesStudentId, MyAiUserId } = userId;
      fetchClass({ MyAmesStudentId, MyAiUserId });
      return;
    }
    this.props.history.push('/ames/homepage')
  };

  renderClass = (data) => {
    return data?.map((item, index) => {
      let imageUrl = require('../../../assets/img/classes/ames.png');
      const nameClass = item.className || item.courseName;
      const classId =
        item.courseType === 'AMES' ? item.classId : item.amesCourseId;
      const className =
        item.courseType === 'AMES'
          ? 'Khoá học Ames English'
          : 'Khoá học tiếng anh với A.I';
      const color = item.courseType === 'AMES' ? 'default' : 'danger';
      // const textColor = `text-${color}`;

      if (nameClass.includes('SS')) {
        imageUrl = require('assets/img/classes/ss.png');
      }
      if (nameClass.includes('BS')) {
        imageUrl = require('assets/img/classes/bs.png');
      }
      return (
        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4} key={index}>
          <Card style={{ cursor: 'pointer' }} onClick={() => this.moveToSession(item, classId)}>
            <CardImg style={{ maxHeight: 350 }} alt="..." src={imageUrl} top />
            <CardBody className="text-center">
              <CardTitle
                style={{ fontSize: 15, fontWeight: '500', backgroundColor: color === 'default' ? '#021F63' : '#f5365c', color: 'white', borderRadius: 10, paddingLeft: 5, paddingRight: 5 }}
              >
                {item.className || item.courseName}
              </CardTitle>
              <CardText
                style={{ fontSize: 13, fontWeight: '500' }}
                className="text-default"
              >
                {className}
              </CardText>
              <CardText>
                <Button
                  // className="text-right"
                  type="primary"
                  // size="sm"
                  color={color}
                  outline
                  onClick={() => this.moveToSession(item, classId)}
                >
                  Bắt đầu
                </Button>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      );
    });
  };

  moveToSession = (item, classId) => {
    const link = `/ames/class/${classId}/sessions`;
    const { dispatch } = this.props
    // localStorage.setItem("selectedClass", itemString);
    dispatch({
      type: ActionTypes.SAVE_SELECTED_CLASS,
      selectedClass: item,
    });
    this.props.history.push(link);
  };

  renderTitle = (color, className) => {
    return (
      <RowTrap>
        <ColTrap>
          <Card className={color} style={{ fontSize: 15 }} >
            <CardBody className="text-white" tag="h2">
              <Link to="/ames" style={{ fontSize: 15 }} >
                <h5 className="h2 text-white d-inline-block mb-0">HOME PAGE</h5>
              </Link>
              <Breadcrumb
                className="d-none d-md-inline-block ml-md-4"
                listClassName="breadcrumb-links breadcrumb-dark"
              >
                {/* <BreadcrumbItem>
                  <a href="#pablo" onClick={(e) => e.preventDefault()} style={{ fontSize: 16 }}>
                    <i className="fas fa-book-open" />
                  </a>
                </BreadcrumbItem> */}
                <BreadcrumbItem aria-current="page" className="active" style={{ fontSize: 16 }} >
                  {className}
                </BreadcrumbItem>
              </Breadcrumb>
            </CardBody>
          </Card>
        </ColTrap>
      </RowTrap>
    );
  };

  render() {
    const { loading } = this.props;
    const { data, array_finish, array_process } = this.state;

    if (loading) {
      return <Loading />;
    }
    if (data.length === 0) {
      return <NotData />;
    }

    return (
      <>
        <Container className="mt-4" fluid>
          <AssignmentComponent userId={getStudentId()} />
          {array_process.length > 0 && (
            <>
              {this.renderTitle(colorHeaderProcess, classProcessName)}
              <Row gutter={[16, 16]}>
                {this.renderClass(array_process)}
              </Row>
            </>
          )}
          {array_finish.length > 0 && (
            <>
              {this.renderTitle(colorHeaderFinish, classFinishName)}
              <Row gutter={[16, 16]}>
                {this.renderClass(array_finish)}
              </Row>
            </>
          )}
        </Container>
        <BackTop />
      </>
    );
  }
}

const mapStateToProps = (state) => {

  return {
    data: state.classReducer.data,
    loading: state.classReducer.loading,
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchClass: ({ MyAmesStudentId, MyAiUserId }) =>
    dispatch({ type: ActionTypes.FETCH_CLASS, MyAmesStudentId, MyAiUserId }),
  dispatch,
});

ClassComponent.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  fetchClass: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassComponent);
