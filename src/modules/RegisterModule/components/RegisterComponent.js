
import React from 'react';
// nodejs library that concatenates classes
// reactstrap components
import {
  // Button,
  Card,
  CardBody,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { Form, Input, Button } from 'antd';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import * as ActionTypes from '../actions/types';
import AuthHeader from 'components/Headers/AuthHeader.js';
import NotificationModal from 'components/Modal/NotificationModal'
import Notification from 'components/Notification';
const FormItem = Form.Item;
const RegisterStudent = (props) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [state, setState] = React.useState({
    divisionList: [],
    isVisibled: false, description: null,
    loading:false
  });

  const handleSubmit = React.useCallback(async (values) => {
    const history = props.history;
    dispatch({ type: ActionTypes.FETCH_REGISTER_REQUEST, values, history });
    let { email, password, phone } = values;
    setState((prevState) => ({ ...prevState, loading: true  }))
    let request = {
      uri: 'https://cloud.softech.vn/mobile/ames247/api/ames-register',
      configs: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'AppName': 'WEB_MY_AMES',
        },
        body: JSON.stringify({
          email,
          phone,
          password: CryptoJS.MD5(password).toString(),
        })
      }
    };
    try {
      let response = await fetch(request.uri, request.configs).then(j => j.json())
      if (response.message === 'OK') {
        setState((prevState) => ({ ...prevState, isVisibled: !prevState.isVisibled, description: response.description, loading: false }))
      } else {
        Notification('danger', 'Đăng ký thất bại', response.description);
        setState((prevState) => ({ ...prevState, loading: false  }))
      }
    } catch (error) {
      console.log('error',error)
      setState((prevState) => ({ ...prevState, loading: false  }))
    }

  }, [dispatch, props.history])

  React.useEffect(() => {
    const getData = async () => {
      const divisionList = await axios.get('https://cloud.softech.cloud/mobile/ames/api/WebAmes/EBM/Divisions')
        .then(function (response) {
          

          return response.data.items;
        })
        .catch(function (error) {

        })
        .finally(function () {
        });
      setState((prevState) => ({
        ...prevState,
        divisionList: divisionList,
      }));
    };
    // return () => {
    // componentwillUnmount
    // };
    getData();
  }, []);

  // const onChangeCityValue = React.useCallback(async (cityId) => {
  //   // form.resetFields();
  //   form.setFieldsValue({
  //     districtId: null,
  //     schoolId: null,
  //   });
  //   setState((prevState) => ({ ...prevState, districts: [], schools: [] }));
  //   const districtResponse = await dynamicApiAxios.query.post('', {
  //     sqlCommand: '[dbo].[p_SGK_District_By_City_OPTIONS]',
  //     parameters: { cityId },
  //   });
  //   setState((prevState) => ({
  //     ...prevState,
  //     districts: districtResponse.data.items,
  //   }));
  // }, [form]);

  const toggleModal = React.useCallback(() => {
    form.resetFields();
    setState((prevState) => ({
      ...prevState,
      isVisibled: !state.isVisibled
    }));
    props.history.push('/auth/login')
  }, [form, props.history, state.isVisibled]);

  // const listSelect = React.useMemo(() => {
  //   return state.divisionList.map((item) => (
  //     <Select.Option value={item.id}>{item.divisionFullName}</Select.Option>
  //   ));
  // }, [state.divisionList]);

  return (
    <>
      <AuthHeader
        {...props}
        title="Đăng ký"
      // lead="Học sinh đăng ký tài khoản để sử dụng"
      />
      <Container className="section section-lg pt-lg-0 mt--9">
        <Row className="justify-content-center">
          <Col lg="6" md="8">
            <Card className="bg-secondary border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <Form
                  autoComplete="off"
                  form={form}
                  onFinish={handleSubmit}
                  style={{ minWidth: 100 }}
                >
                  {/* <FormItem
                    name="code"
                    rules={[{ required: false, message: 'Vui lòng nhập mã Voucher' }]}
                  >
                    <Input
                      style={{

                        borderRadius: 5,
                      }}
                      allowClear
                      size="large"
                      prefix={
                        <BarcodeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                      }
                      placeholder="Mã Voucher"
                    />
                  </FormItem> */}

                  <FormItem
                    hasFeedback
                    name="email"
                    rules={[
                      {
                        type: 'email',
                        message: 'Vui lòng nhập đúng định dạng E-mail!',
                      },
                      { required: true, message: 'Vui lòng nhập E-mail!' },
                    ]}
                    maxLength={250}
                  >
                    <Input
                      style={{

                        borderRadius: 5,
                      }}
                      allowClear
                      size="large"
                      prefix={
                        // <MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                        <i style={{ color: 'rgba(0,0,0,.25)' }} className="fas fa-envelope"></i>
                      }
                      placeholder="E-mail (*)"
                    />
                  </FormItem>

                  {/* <FormItem
                    hasFeedback
                    name="fullname"
                    rules={[
                      {
                        whitespace: true,
                        message: 'Vui lòng nhập Họ và tên',
                      },
                      { required: true, message: 'Vui lòng nhập Họ và tên' },
                    ]}
                  >
                    <Input
                      style={{

                        borderRadius: 5,
                      }}
                      allowClear
                      size="large"
                      prefix={
                        <FormOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                      }
                      placeholder="Họ tên (*)"
                    />
                  </FormItem> */}

                  <FormItem
                    hasFeedback
                    name="phone"
                    rules={[
                      () => ({
                        validator(rule, value) {
                          if (!isNaN(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject('Vui lòng chỉ nhập số!');
                        },
                      }),
                      { min: 10, message: 'Tối thiểu 10 ký tự!' },
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại!',
                      },
                    ]}
                  >
                    <Input
                      style={{

                        borderRadius: 5,
                      }}
                      allowClear
                      size="large"
                      prefix={
                        // <PhoneOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                        <i style={{ color: 'rgba(0,0,0,.25)' }} className="fas fa-phone"></i>
                      }
                      placeholder="Số điện thoại"
                    />
                  </FormItem>

                  <FormItem
                    hasFeedback
                    name="password"
                    rules={[
                      { min: 6, message: 'Tối thiểu 6 ký tự!' },
                      {
                        whitespace: true,
                        message: 'Vui lòng nhập mật khẩu!',
                      },
                      { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    ]}
                  >
                    <Input.Password
                      style={{

                        borderRadius: 5,
                      }}
                      allowClear
                      size="large"
                      prefix={
                        <i style={{ color: 'rgba(0,0,0,.25)' }} className="fas fa-lock"></i>
                      }
                      placeholder="Mật khẩu (*)"
                    />
                  </FormItem>

                  <FormItem
                    dependencies={['password']}
                    hasFeedback
                    name="repassword"
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
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject('Mật khẩu không trùng khớp!');
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      style={{

                        borderRadius: 5,
                      }}
                      allowClear
                      size="large"
                      prefix={
                        // <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                        <i style={{ color: 'rgba(0,0,0,.25)' }} className="fas fa-lock"></i>
                      }
                      placeholder="Nhập lại mật khẩu (*)"
                    />
                  </FormItem>

                  {/* <FormItem
                    name="divisionId"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn Chi nhánh gần bạn!',
                      },
                    ]}
                  >
                    <Select
                      style={{

                        borderRadius: 5,
                      }}
                      size="large"
                      allowClear
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLocaleLowerCase()) >= 0
                      }
                      showSearch
                      prefix={<PhoneOutlined />}
                      placeholder="Chọn chi nhánh gần bạn nhất"
                      onChange={onChangeCityValue}
                    >
                      {listSelect}
                    </Select>
                  </FormItem> */}

                  <FormItem>
                    {/* <a href='' style={{ float: 'right' }}>
                  Forgot password
                </a> */}
                    <Button
                      className="mt-4"
                      disabled={state.loading}
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
                      Đăng ký
                    </Button>
                    <NotificationModal {...props} isVisibled={state.isVisibled} content={state.description} title='Đăng ký thành công' toggleModal={toggleModal} />
                  </FormItem>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

RegisterStudent.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
}
export default RegisterStudent;
