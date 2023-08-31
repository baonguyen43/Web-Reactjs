/*!

=========================================================
* Argon Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from 'react';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { Tabs, Form, Input } from 'antd';
import CrypteJs from 'crypto-js';
import openNotificationWithIcon from 'components/Notification';
// core components
import ProfileHeader from 'components/Headers/ProfileHeader.js';
import moment from 'moment';
import { axiosMYAMESPUT, ames247Axios } from 'configs/api';
const FormItem = Form.Item;
const { TabPane } = Tabs;

const Profile = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [defaultValue] = useState(
    loggedInUser.typeLogin === 'teacher'
      ? loggedInUser.userTeacher
      : loggedInUser.userMyames
  );

  const [form] = Form.useForm();
  const handleSubmit = async (values) => {
    const { oldPassword, password } = values;
    const encryptOldPassword = CrypteJs.MD5(oldPassword).toString();
    const encryptNewPassword = CrypteJs.MD5(password).toString();

    if (loggedInUser.typeLogin.includes('ames')) {
      const UserId = defaultValue.UserId;
      const UserCode = defaultValue.UserCode;

      try {
        const param = `type=UPDATEPASSWORD&Password=${encryptOldPassword}&UserId=${UserId}&UserCode=${UserCode}&NewPassword=${encryptNewPassword}`;
        const response = await axiosMYAMESPUT.post('/put', param);

        const { data: json } = response;
        if (json.status === 'success') {
          openNotificationWithIcon(
            'success',
            'Thông báo',
            'Đổi mật khẩu thành công'
          );
        } else {
          openNotificationWithIcon('danger', 'Có lỗi xảy ra', json.message);
        }
      } catch (error) {}
    } else {
      try {
        const UserId = loggedInUser.userMyai.UserId;
        const params = {
          userId: UserId,
          password: encryptOldPassword,
          newPassword: encryptNewPassword,
        };
        const response = await ames247Axios.post('/ChangePasswordMyAi', params);

        // console.log('TCL: function*updatePassword -> response', response);
        const { data: json } = response;

        if (json.status === 'success') {
          openNotificationWithIcon(
            'success',
            'Thông báo',
            'Đổi mật khẩu thành công'
          );
        } else {
          openNotificationWithIcon('danger', 'Có lỗi xảy ra', json.message);
        }
      } catch (error) {}
    }
  };

  return (
    <>
      <ProfileHeader loggedInUser={loggedInUser} />
      <Container className='mt--5' fluid>
        <Row className='justify-content-center'>
          <Col className='order-xl-1' xl='10'>
            <Tabs
              type='line'
              tabBarStyle={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: '10px 40px',
              }}
              animated
              tabPosition='top'
              defaultActiveKey='1'
              size='large'
              style={{ marginBottom: 32 }}
            >
              <TabPane tab='Tài khoản' key='1'>
                <Card className='mt-5'>
                  <CardHeader>
                    <Row className='justify-content-center'>
                      <Col className='order-lg-2' lg='3'>
                        <div className='card-profile-image'>
                          <label htmlFor='upload-button'>
                            <img
                              alt='...'
                              className='rounded-circle'
                              style={{ backgroundSize: 'cover' }}
                              src={
                                defaultValue.imageUrl ??
                                require('assets/img/avatar.PNG')
                              }
                            />
                          </label>
                          <input
                            type='file'
                            id='upload-button'
                            style={{ display: 'none' }}
                          />
                        </div>
                      </Col>
                    </Row>
                    {loggedInUser.typeLogin !== 'teacher' && (
                      <Row className='align-items-center'>
                        <Col xs='8'>
                          <h3 className='mb-0'>Cập nhật thông tin</h3>
                        </Col>
                        <Col className='text-right' xs='4'>
                          <Button
                            color='primary'
                            href='#pablo'
                            onClick={(e) => e.preventDefault()}
                            size='sm'
                          >
                            Cập nhật
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <h6 className='heading-small text-muted mb-4'>
                        Thông tin người dùng
                      </h6>
                      <div className='pl-lg-4'>
                        <Row>
                          <Col lg='6'>
                            <FormGroup>
                              <label
                                className='form-control-label'
                                htmlFor='input-username'
                              >
                                Họ tên
                              </label>
                              <Input
                                style={{ borderRadius: 5 }}
                                size='large'
                                defaultValue={
                                  defaultValue.name ?? defaultValue.StudentName
                                }
                                id='input-username'
                                placeholder='Username'
                                type='text'
                                disabled
                              />
                            </FormGroup>
                          </Col>
                          <Col lg='6'>
                            <FormGroup>
                              <label
                                className='form-control-label'
                                htmlFor='input-email'
                              >
                                Email address
                              </label>
                              <Input
                                style={{ borderRadius: 5 }}
                                size='large'
                                defaultValue={
                                  defaultValue.email ?? defaultValue.Email
                                }
                                id='input-email'
                                placeholder='jesse@example.com'
                                type='email'
                                disabled
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg='6'>
                            <FormGroup>
                              <label
                                className='form-control-label'
                                htmlFor='input-first-name'
                              >
                                Ngày sinh
                              </label>
                              <Input
                                style={{ borderRadius: 5 }}
                                size='large'
                                defaultValue={moment(
                                  defaultValue.Birthday
                                ).format('DD/MM/YYYY')}
                                id='input-first-name'
                                placeholder='First name'
                                type='text'
                                disabled
                              />
                            </FormGroup>
                          </Col>
                          <Col lg='6'>
                            <FormGroup>
                              <label
                                className='form-control-label'
                                htmlFor='input-last-name'
                              >
                                Số điện thoại
                              </label>
                              <Input
                                style={{ borderRadius: 5 }}
                                size='large'
                                defaultValue={defaultValue.Phone}
                                id='input-last-name'
                                placeholder='Last name'
                                type='text'
                                disabled
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      {/* <hr className='my-4' /> */}
                    </Form>
                  </CardBody>
                </Card>
              </TabPane>
              {/* //////////////////////////////////////////////////////////////////////////// */}
              {/* //////////////////////////////////////////////////////////////////////////// */}
              {/* //////////////////////////////////////////////////////////////////////////// */}
              {loggedInUser.typeLogin !== 'teacher' && (
                <TabPane tab='Mật khẩu' key='2'>
                  <Card className='mt-1'>
                    <CardBody>
                      <Form form={form} onFinish={handleSubmit}>
                        <h6 className='heading-small text-muted mb-4'>
                          Đổi mật khẩu
                        </h6>
                        {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-username'
                          >
                            Mật khẩu cũ
                          </label>
                          <FormItem
                            hasFeedback
                            name='oldPassword'
                            rules={[
                              { min: 6, message: 'Tối thiểu 6 ký tự!' },
                              {
                                whitespace: true,
                                message: 'Vui lòng nhập mật khẩu cũ!',
                              },
                              {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu cũ!',
                              },
                            ]}
                          >
                            <Input.Password
                              style={{
                                borderRadius: 5,
                              }}
                              allowClear
                              size='large'
                            />
                          </FormItem>
                        </FormGroup>
                        {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-username'
                          >
                            Mật khẩu mới
                          </label>
                          <FormItem
                            hasFeedback
                            name='password'
                            rules={[
                              { min: 6, message: 'Tối thiểu 6 ký tự!' },
                              {
                                whitespace: true,
                                message: 'Vui lòng nhập mật khẩu!',
                              },
                              {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                              },
                            ]}
                          >
                            <Input.Password
                              style={{
                                borderRadius: 5,
                              }}
                              allowClear
                              size='large'
                            />
                          </FormItem>
                        </FormGroup>
                        {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                        <FormGroup>
                          <label
                            className='form-control-label'
                            htmlFor='input-username'
                          >
                            Xác nhận khẩu mới
                          </label>
                          <FormItem
                            dependencies={['password']}
                            hasFeedback
                            name='rePassword'
                            rules={[
                              {
                                whitespace: true,
                                message: 'Vui lòng xác nhận lại nhập mật khẩu!',
                              },
                              {
                                required: true,
                                message: 'Vui lòng xác nhận lại nhập mật khẩu!',
                              },
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (
                                    !value ||
                                    getFieldValue('password') === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    'Mật khẩu không trùng khớp!'
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              style={{
                                borderRadius: 3,
                              }}
                              allowClear
                              size='large'
                            />
                          </FormItem>
                        </FormGroup>

                        <Button type='submit' color='primary'>
                          <span className='btn-inner--icon mr-2'>
                            <i className='fas fa-edit' />
                          </span>
                          <span className='btn-inner--text'>Cập nhật</span>
                        </Button>

                        {/* <hr className='my-4' /> */}
                      </Form>
                    </CardBody>
                  </Card>
                </TabPane>
              )}
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
