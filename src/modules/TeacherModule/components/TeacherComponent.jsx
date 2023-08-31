import React from 'react';
import AuthHeader from 'components/Headers/AuthHeader.js';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from 'reactstrap';
import GoogleLogin from 'react-google-login';
import { dynamicApiAxios } from 'configs/api';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import * as actionTypes from '../actions/types';
import { Redirect } from 'react-router';
import openNotificationWithIcon from 'components/Notification';

const isTeacherExisted = async (email) => {
  const response = await dynamicApiAxios.query.post('', {
    sqlCommand: '[SmartEducation].[dbo].[p_API_AMESTEACHER_Login_v2]',
    parameters: { email },
  });
  const result = response.data;
  return result;
};

function TeacherComponent(props) {
  const CLIENT_ID =
    '998589637411-bi2g2md2p2jq5cc5jtuehq6as340m132.apps.googleusercontent.com';
  const dispatch = useDispatch();

  const responseGoogle = async (response) => {
    console.log(response);
    if (response.profileObj) {
      const email = response.profileObj.email;
      const result = await isTeacherExisted(email);
      if (result.items.length === 0) {
        openNotificationWithIcon(
          'danger',
          'Thông báo',
          'Tài khoản này không có quyền truy cập!'
        );
        return <Redirect to='/' />;
      }
      result.items[0] = { ...response.profileObj, ...result.items[0] };
      const history = props.history;
      dispatch({
        type: actionTypes.POST_TEACHER_LOGIN_REQUEST,
        result,
        history,
      });
    }
  };

  return (
    <>
      <AuthHeader
        {...props}
        title='Giáo viên'
        // lead='Giáo viên đăng ký tài khoản để sử dụng'
      />
      <Container>
        <Row>
          <Col md={{ offset: 4, size: 4 }}>
            <Card tag='h2' className='mt--5'>
              <CardHeader className='text-center'>
                Đăng nhập tài khoản
              </CardHeader>
              <CardBody>
                <GoogleLogin
                  clientId={CLIENT_ID}
                  render={(renderProps) => (
                    <Button
                      block
                      color='danger'
                      size='lg'
                      onClick={renderProps.onClick}
                      style={{
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i
                        className='fab fa-google-plus-g'
                        style={{ fontSize: 24 }}
                      ></i>
                      &ensp;Sign in using AMES email
                    </Button>
                  )}
                  buttonText='Login'
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TeacherComponent;

TeacherComponent.propTypes = {
  history: PropTypes.object,
};
