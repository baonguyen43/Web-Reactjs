import React from 'react';
import { getStudentId } from 'components/functions';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  Col as ColTrap,
  Row as RowTrap,
  // Col,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
import Loading from 'components/Loading';

import { useDispatch, useSelector } from 'react-redux';
import { BackTop, Col, Row } from 'antd';
import { useHistory } from 'react-router';

const ViewResult = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.classReducer.data);
  const loading = useSelector((state) => state.classReducer.loading);

  const getClasses = React.useCallback(async () => {
    const userId = getStudentId();
    if (userId) {
      const { MyAmesStudentId, MyAiUserId } = userId;
      dispatch({ type: 'FETCH_CLASS', MyAmesStudentId, MyAiUserId })
      return;
    }
    history.push('/ames/homepage')
  }, [dispatch, history]);

  React.useEffect(() => {
    getClasses();
  }, [getClasses])

  const renderTitle = () => {
    return (
      <RowTrap>
        <ColTrap>
          <Card className="bg-primary bg-radiant-danger" style={{ fontSize: 15 }} >
            <CardBody className="text-white" tag="h2">
              <span>
                <h5 className="h2 text-white d-inline-block mb-0">KẾT QUẢ BÀI LÀM</h5>
              </span>
              <Breadcrumb
                className="d-none d-md-inline-block ml-md-4"
                listClassName="breadcrumb-links breadcrumb-dark"
              >
                <BreadcrumbItem aria-current="page" className="active" style={{ fontSize: 16 }} >
                  Danh sách khóa học
                </BreadcrumbItem>
              </Breadcrumb>
            </CardBody>
          </Card>
        </ColTrap>
      </RowTrap>
    );
  };

  const renderClass = (data) => {
    return data?.map((item, index) => {
      let imageUrl = require('assets/img/classes/ames.png');
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
          <Card style={{ cursor: 'pointer', minWidth: 230 }}
            onClick={() => history.push(`/ames/view-results/${classId}/${index}`)}
          >
            <CardImg style={{ maxHeight: 350 }} alt="..." src={imageUrl} top />
            <CardBody className="text-center">
              <CardTitle
                style={{ fontSize: 15, fontWeight: '500', backgroundColor: color === 'default' ? '#021F63' : '#f5365c', color: 'white', borderRadius: 10, paddingLeft: 5, paddingRight: 5 }}
              >
                {nameClass}
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
                  onClick={() => history.push(`/ames/view-results/${classId}/${index}`)}
                >
                  Xem kết quả
                </Button>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      );
    });
  };
  if (loading) return <Loading />
  return (
    <Card>
      <CardBody>
        {renderTitle()}
        <Row gutter={[16, 16]}>
          {
            renderClass(data)
          }
        </Row>
      </CardBody>
      <BackTop />
    </Card>
  );
};

export default ViewResult;