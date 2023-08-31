import React from 'react';
import Axios from 'axios';
import {
  Row,
  Button,
  Container,
} from 'reactstrap';
import { Form, Input } from 'antd';
import Notifications from 'components/Notification'
import { useDispatch, useSelector } from 'react-redux';
import * as ActionType from 'modules/LoginAmes_AiModule/actions/types';



const Share = () => {

  const [form] = Form.useForm();

  const [loading, setLoading] = React.useState(false)

  const [shareContent] = React.useState()



  const [state, setState] = React.useState({
    isVisibled: false,
    users: [],
  });

  const dispatch = useDispatch();

  const loggedInUser = useSelector((rootState) => {
    return rootState.loginReducer.loggedInUser
  })

  //Kiểm tra tài khoản login có bao nhiêu người dùng
  React.useEffect(() => {
    const isSetItem = localStorage.getItem('loggedInUser');
    if (isSetItem) return;
    if (loggedInUser.typeLogin.includes('ames')) {
      if (loggedInUser.userMyames.length > 1) {
        setState((previousState) => ({ ...previousState, isVisibled: !state.isVisibled, users: loggedInUser.userMyames }));
      } else {
        const userMyamesNew = loggedInUser.userMyames[0];
        const userInfo = { ...loggedInUser, userMyames: userMyamesNew };
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify(userInfo)
        );
        dispatch({ type: ActionType.POST_LOGIN_SUCCESS, payload: userInfo })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const onFinish = React.useCallback(async ({ fullname, phone, address }) => {

    if (!fullname.length) {
      Notifications('danger', 'Thông báo', 'Vui lòng nhập mã kích hoạt');
      return;
    }

    setLoading(true)

    const StudentId = loggedInUser.userMyai.Id;

    try {
      const params = {
        VoucherCode: fullname,
        UserId: StudentId,
      }
      const {data} = await Axios.post('https://cloud.softech.vn/mobile/myames/api/AddCourseByVoucher', params);

      if (data.message === 'OK') {
        Notifications('success', 'Thông báo', data.description);

      } else {
        Notifications('danger', data.description);

      }

    } catch (error) {
      console.log('error', error);
        Notifications('danger', 'ERROR');

    }
    setLoading(false)
  }, [loggedInUser])


  return (
    <Container fluid>
      <Row className='d-flex justify-content-center'>
        <Row>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', padding: 10, }}>
            <p style={{ fontSize: 18, fontWeight: 600, padding: 15 }}>
              Nhập mã kích hoạt
              </p>
          </div>
        </Row>
      </Row>
      <Row style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>

        <Form style={{ minWidth: 300 }} ref={form} onFinish={onFinish}>
          {shareContent !== 3 && (
            <div>
              <Form.Item name="fullname">
                <Input style={{ borderRadius: 5 }} size='large' disabled={loading} placeholder="Mã kích hoạt" />
              </Form.Item>
            </div>
          )}


          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Button color='primary' disabled={loading} onClick={() => form.current.submit()}>Xác nhận</Button>
          </div>
        </Form>
      </Row>
    </Container>
  );
}

export default Share;
