import React from 'react';
import Axios from 'axios';
import {
  Row,
  Button,
  Container,
  UncontrolledTooltip,
} from 'reactstrap';
import { Form, Input } from 'antd';
import utils from 'constants/utils';
import { dynamicApiAxios } from 'configs/api';
import image from './assets/sharingiscaring.png';
import Notifications from 'components/Notification'
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as ActionType from 'modules/LoginAmes_AiModule/actions/types';
import StudentChoiceAccountModal from 'components/Modal/StudentChoiceAccount';


const Share = () => {
  // form = React.createRef();

  const [form] = Form.useForm();

  const [loading, setLoading] = React.useState(false)

  const [shareContent, setShareContent] = React.useState()

  const referralCode = React.useRef()

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

  const toggleModal = React.useCallback(() => {
    setState((previousState) => ({ ...previousState, isVisibled: !previousState.isVisibled }));
  }, [])

  // Lưu tài khoản mới
  const saveAccount = (index) => {
    const userMyamesNew = loggedInUser.userMyames[index];
    const userInfo = { ...loggedInUser, userMyames: userMyamesNew };

    localStorage.setItem(
      'loggedInUser',
      JSON.stringify(userInfo)
    );
    setState((previousState) => ({ ...previousState, isVisibled: !state.isVisibled }))
    dispatch({ type: ActionType.POST_LOGIN_SUCCESS, payload: userInfo })
  }

  React.useEffect(() => {
    getGiftCode();
    getContentSharing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUser])

  const getGiftCode = React.useCallback(async () => {

    const userId = loggedInUser.userMyames?.[0]?.UserId || loggedInUser.userMyames?.UserId;
    const userCode = loggedInUser.userMyames?.[0]?.UserCode || loggedInUser.userMyames?.UserCode;

    let giftcode = await utils.getGiftCodeStudent(userId, userCode);

    giftcode = giftcode[0]?.Code;

    referralCode.current = giftcode;
  }, [loggedInUser])

  const getContentSharing = React.useCallback(async () => {

    const StudentId = loggedInUser.userMyames?.[0]?.StudentId || loggedInUser.userMyames?.StudentId;

    const response = await dynamicApiAxios.query.post('', {
      sqlCommand: 'p_AMES247_SharingIsCaringContentType_Get',
      parameters: { StudentId },
    });

    setShareContent(response.data.items[0].shareContentType)

  }, [loggedInUser])

  const onFinish = React.useCallback(async ({ fullname, phone, address }) => {

    if (!fullname.length || !phone.length || !address.length) {
      Notifications('danger', 'Thông báo', 'Vui lòng nhập đầy đủ thông tin người giới thiệu');
      return;
    }

    setLoading(true)

    const StudentId = loggedInUser.userMyames[0]?.StudentId || loggedInUser.userMyames?.StudentId;

    try {
      const params = {
        Name: fullname,
        Phone: phone,
        Area: address,
        ReferralCode: referralCode.current,
        StudentId,
      }
      await Axios.post('https://cloud.softech.vn/mobile/ames/api/IntroduceFriend', params);

      Notifications('success', 'Thông báo', 'Hệ thống đã ghi nhận dữ liệu');
    } catch (error) {
      console.log('error', error);
      // alert('Thông báo', error.response.data.description);
      Notifications('danger', 'Error');

    }
    setLoading(false)
  }, [loggedInUser])



  const StudentId = loggedInUser?.userMyames?.[0]?.StudentId || loggedInUser.userMyames?.StudentId;

  const textCopy = 'https://ames.edu.vn/tienganhonline?mkt=' + StudentId;

  return (
    <Container fluid>
      <Row className='d-flex justify-content-center'>
        <Row style={{ display: 'flex', justifyContent: 'center' }}>

          <img src={image} alt="" style={{ width: '100%' }} />

        </Row>
        <Row>
          {shareContent === 1 && (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', padding: 10, }}>
              <p style={{ fontSize: 18, fontWeight: 600, padding: 15 }}>
                Giới thiệu bạn mình đến học thử hoặc làm bài kiểm tra tại <span className='text-primary' style={{ fontSize: 18 }}>AMES English</span> bạn sẽ nhận được 1 thẻ điện thoại hoặc voucher mua sắm Urbox trị giá <span style={{ color: '#002958', fontSize: 18 }}>50,000 đ. </span>
              </p>
              <p style={{ fontSize: 18, fontWeight: 600, padding: 15 }}> Khi người được giới thiệu đăng ký học các khóa học tại các trung  tâm <span className='text-primary'>AMES English,</span> bạn sẽ nhận được thẻ điện thoại hoặc voucher mua sắm Urbox trị giá <span className='text-primary' style={{ fontSize: 18 }}>500,000 đ.</span></p>
            </div>
          )}
          {shareContent === 2 && (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 600, padding: 15 }}>
                Giới thiệu bạn đăng ký học. Khi người được giới thiệu đăng ký học với khóa học từ 80 buổi trở lên, bạn sẽ nhận được thẻ điện thoại hoặc voucher mua sắm Urbox trị giá <span style={{ color: '#002958', fontSize: 18 }}>500,000 đ. </span>
              </p>
            </div>
          )}
          {shareContent === 3 && (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 600, padding: 15 }}>
                Hãy copy đường dẫn này và gửi cho bạn bè của mình, khi người được giới thiệu đăng ký khóa học thì <span className='text-primary' style={{ fontSize: 18 }}>AMES</span> sẽ tặng bạn <span style={{ color: '#002958', fontSize: 18 }}>100,000 đ. </span>
                Chỉ cần 3 người bạn đăng ký thì khóa học này là miễn phí với bạn rồi!
              </p>
              {/* <p style={{ fontSize: 18, fontWeight: 600 }}> Chỉ cần 3 người bạn đăng ký thì khóa học này là miễn phí với bạn rồi!</p> */}
            </div>
          )}
        </Row>
      </Row>
      <Row style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>

        <Form style={{ minWidth: 300 }} form={form} onFinish={onFinish}>
          {shareContent !== 3 && (
            <div>
              <Form.Item name="fullname">
                <Input style={{ borderRadius: 5 }} size='large' disabled={loading} placeholder="Tên người được giới thiệu" />
              </Form.Item>

              <Form.Item
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
                  { max: 11, message: 'Tối đa 11 ký tự!' },
                  {
                    required: true,
                    message: 'Vui lòng nhập số điện thoại!',
                  },
                ]}
              >
                <Input style={{ borderRadius: 5 }} size='large' disabled={loading} placeholder="Số điện thoại" />
              </Form.Item>

              <Form.Item name="address">
                <Input style={{ borderRadius: 5 }} size='large' disabled={loading} placeholder="Khu vực (quận, huyện)" />
              </Form.Item>
            </div>
          )}

          {shareContent === 3 && (
            <Form.Item name="off">
              <Input style={{ borderRadius: 5 }} size='large' placeholder={textCopy} disabled />
            </Form.Item>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            {shareContent === 3 && (
              <div>
                <CopyToClipboard
                  text={textCopy}
                  onCopy={() => setState((prevState) => ({ ...prevState, copiedText: 'active-40' }))}
                >
                  <Button
                    color='primary'
                    id="tooltip982655500"
                  >
                    <div>
                      {/* <i className="ni ni-active-40" /> */}
                      <span>{state.copiedText === 'active-40' ? 'Copied' : 'Copy'}</span>
                    </div>
                  </Button>
                </CopyToClipboard>
                <UncontrolledTooltip
                  delay={0}
                  trigger="hover focus"
                  target="tooltip982655500"
                >
                  {state.copiedText === 'active-40'
                    ? 'Copied'
                    : 'Copy To Clipboard'}
                </UncontrolledTooltip>
              </div>
            )}
            {shareContent !== 3 && (

              <Button color='primary' disabled={loading} onClick={() => form.current.submit()}>Xác nhận</Button>
            )}
          </div>
        </Form>
      </Row>
      <StudentChoiceAccountModal
        users={state.users}
        toggleModal={toggleModal}
        saveAccount={saveAccount}
        isVisibled={state.isVisibled}
      />
    </Container>
  );
}

export default Share;
