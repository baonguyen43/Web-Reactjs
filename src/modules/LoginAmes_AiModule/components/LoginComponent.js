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
import React from 'react';
// nodejs library that concatenates classes
// reactstrap components
import { Card, CardHeader, CardBody, Container, Row, Col } from 'reactstrap';
import { Form, Input, Button } from 'antd';
// core components
import AuthHeader from 'components/Headers/AuthHeader.js';
import { useDispatch } from 'react-redux';
import * as ActionTypes from '../actions/types';
import ForgotPasswordModal from 'components/Modal/ForgotPassword';
import PropTypes from 'prop-types'

const FormItem = Form.Item;

const Login = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    isVisibled: false,
  });
  const [form] = Form.useForm();
  const handleSubmit = (values) => {
 
    const history = props.history;
    dispatch({ type: ActionTypes.POST_LOGIN_REQUEST, values, history });
  };

  const toggleModal = React.useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isVisibled: !state.isVisibled,
    }));
  }, [state.isVisibled]);
  return (
    <>
      <AuthHeader
        {...props}
        title="MY AMES"
        // lead="Đăng nhập để tham gia các khóa học."
      />
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="bg-secondary border-0 mb-0">
              <CardHeader className="bg-transparent pb-3">
                <div className="text-muted text-center mt-2 mb-1">
                  <span style={{ fontSize: 30, fontWeight: '700' }}>LOGIN</span>
                </div>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <Form
                  autoComplete="off"
                  form={form}
                  onFinish={handleSubmit}
                  style={{ minWidth: 100 }}
                >
                  <FormItem
                    hasFeedback
                    name="username"
                    rules={[
                      {
                        whitespace: true,
                        message: 'Vui lòng nhập Username',
                      },
                      {
                        required: true,
                        message: 'Vui lòng nhập E-mail hoặc Username!',
                      },
                    ]}
                    maxLength={250}
                  >
                    <Input
                      style={{
                        boxShadow:
                          '0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02)',
                        borderRadius: 3,
                      }}
                      allowClear
                      size="large"
                      prefix={
                        <i
                          style={{ color: 'rgba(0,0,0,.25)' }}
                          className="fas fa-user"
                        />
                      }
                      placeholder="Username (*)"
                    />
                  </FormItem>

                  <FormItem
                    hasFeedback
                    name="password"
                    rules={[
                      // { min: 6, message: "Tối thiểu 6 ký tự!" },
                      {
                        whitespace: true,
                        message: 'Vui lòng nhập mật khẩu!',
                      },
                      { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    ]}
                  >
                    <Input.Password
                      style={{
                        boxShadow:
                          '0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02)',
                        borderRadius: 3,
                      }}
                      allowClear
                      size="large"
                      prefix={
                        <i
                          style={{ color: 'rgba(0,0,0,.25)' }}
                          className="fas fa-lock"
                        />
                      }
                      placeholder="Mật khẩu (*)"
                    />
                  </FormItem>
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id=" customCheckLogin"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor=" customCheckLogin"
                    >
                      <span className="text-muted">Lưu đăng nhập</span>
                    </label>
                  </div>
                  <div className="text-center">
                    <Button
                      className="mt-4"
                      color="info"
                      type="button"
                      htmlType="submit"
                      style={{
                        width: '100%',
                        padding: 10,
                        height: 'auto',
                        margin: '0px 0px 10px 0px',
                        backgroundColor: '#11CDEF',
                        fontSize: 15,
                        color: 'white',
                        fontWeight: '500',
                        borderRadius: 5,
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </div>
                  <div className="text-center">
                    <Button
                      // className="mt-4"
                      color="info"
                      type="button"
                      // htmlType="submit"
                      onClick={()=>props.history.push('/auth/register')}
                      style={{
                        margin: 0,
                        width: '100%',
                        padding: 10,
                        height: 'auto',
                        backgroundColor: '#11CDEF',
                        fontSize: 15,
                        color: 'white',
                        fontWeight: '500',
                        borderRadius: 5,
                      }}
                    >
                      Đăng ký
                    </Button>
                  </div>
                </Form>

                <Row className="mt-2">
                  <Col sm="5">
                    <span style={{cursor: 'pointer'}} className="text-black" onClick={toggleModal}>
                      <small style={{fontSize: 15 }}>Quên mật khẩu?</small>
                    </span>
                    <ForgotPasswordModal
                      toggleModal={toggleModal}
                      isVisibled={state.isVisibled}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

Login.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
}
export default Login;
