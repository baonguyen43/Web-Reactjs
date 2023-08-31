import React from 'react';
import { Button, Card, CardHeader, CardBody, Modal } from 'reactstrap';
import { Form, Input } from 'antd';
import { BarcodeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as ActionTypes from 'modules/LoginAmes_AiModule/actions/types';
import openNotificationWithIcon from 'components/Notification';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const ForgotPasswordModal = ({ toggleModal, isVisibled }) => {
  const [state, setState] = React.useState({
    stepResetPassword: false,
    phone: null,
  });
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const dispatch = useDispatch();
  
  const handleSubmitStep1 = React.useCallback( (values) => {
    setState((prevState) => ({
      ...prevState,
      phone: values.phone,
    }));
    dispatch({ type: ActionTypes.POST_RESET_PASS, values });
  },[dispatch])

  const status = useSelector((rootState) => rootState.loginReducer.error);

  React.useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      stepResetPassword: status,
    }));
  }, [status]);

  const handleSubmitStep2 = React.useCallback(
    async (values) => {
      const { otp, password } = values;
      const phone = state.phone;

      let request = {
        uri:
          'https://cloud.softech.cloud/mobile/ames/api/myames/ResetPasswordConfirmation',
        configs: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            AppName: 'WEB_MY_AMES',
          },
          body: JSON.stringify({
            userName: phone,
            otp,
            password,
          }),
        },
      };
      let response = await fetch(request.uri, request.configs)
        .then((j) => j.json())
        .then((v) => {
          return v;
        });

      if (response.message === 'OK') {
        openNotificationWithIcon('success', 'Thông báo', response.description);
        toggleModal();
      } else {
        openNotificationWithIcon('danger', 'Thông báo', response.description);
      }
    },
    [state.phone, toggleModal]
  );

  const step1 = React.useCallback(() => {
    return (
      <>
        <div className="text-center text-muted mb-4">
          <small>Nhập số điện thoại đã đăng ký để lấy lại mật khẩu</small>
        </div>
        <Form autoComplete="off" form={form1} onFinish={handleSubmitStep1}>
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
                <i
                  style={{ color: 'rgba(0,0,0,.25)' }}
                  className="fas fa-phone"
                ></i>
              }
            />
          </FormItem>
          <div className="text-center">
            <Button className="btn-icon" color="primary" type="submit">
              <span className="btn-inner--icon mr-0">
                <i className="fas fa-paper-plane"></i>
              </span>
              <span className="btn-inner--text">Gởi</span>
            </Button>
          </div>
        </Form>
      </>
    );
  }, [form1, handleSubmitStep1]);

  const step2 = React.useCallback(() => {
    return (
      <>
        <div className="text-center text-muted mb-4">
          <small>Vui lòng điền thông tin để lấy lại mật khẩu</small>
        </div>
        <Form autoComplete="off" form={form2} onFinish={handleSubmitStep2}>
          <FormItem
            name="otp"
            rules={[{ required: true, message: 'Vui lòng nhập mã code' }]}
          >
            <Input
              style={{
                borderRadius: 5,
              }}
              allowClear
              size="large"
              prefix={<BarcodeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Mã code"
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
                <i
                  style={{ color: 'rgba(0,0,0,.25)' }}
                  className="fas fa-lock"
                ></i>
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
                <i
                  style={{ color: 'rgba(0,0,0,.25)' }}
                  className="fas fa-lock"
                ></i>
              }
              placeholder="Nhập lại mật khẩu (*)"
            />
          </FormItem>

          <div className="text-center">
            <Button className="btn-icon" color="primary" type="submit">
              <span className="btn-inner--icon mr-0">
                <i className="fas fa-paper-plane"></i>
              </span>
              <span className="btn-inner--text">Gởi</span>
            </Button>
          </div>
        </Form>
      </>
    );
  }, [form2, handleSubmitStep2]);

  return (
    <>
      <Modal
        className="modal-dialog-centered"
        size="sm"
        isOpen={isVisibled}
        toggle={toggleModal}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-4 mb-2">
                <span style={{ fontSize: 25, fontWeight: '700' }}>
                  LẤY LẠI MẬT KHẨU
                </span>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={toggleModal}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              {!state.stepResetPassword ? step1() : step2()}
            </CardBody>
          </Card>
        </div>
      </Modal>
    </>
  );
};

ForgotPasswordModal.propTypes = {
  isVisibled: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}
export default ForgotPasswordModal;
