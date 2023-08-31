import React from 'react';
// node.js library that concatenates classes (strings)

// reactstrap components
import { Container } from 'reactstrap';
import CardHomePage from './Components/Card';

// core components
import CardsHeader from 'components/Headers/CardsHeader.js';
import * as ActionType from 'modules/LoginAmes_AiModule/actions/types';
import StudentChoiceAccountModal from 'components/Modal/StudentChoiceAccount'
import { useDispatch, useSelector } from 'react-redux';

const Dashboard = (props) => {

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

  return (
    <>
      <CardsHeader
        {...props}
        showCard={false}
        parentName="HomePage"
        parentHref="/ames"
      />
      <Container className="mt--6" fluid>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
          <CardHomePage
            {...props}
            title="Practice with AI"
            titleVN="Luyện tập với AI"
            detail="Let's start"
            linkTo="/ames/classes"
            color="default"
            imgLink={require('assets/img/home/assignment.svg')}
          />

          <CardHomePage
            {...props}
            title="Vocabulary Practice"
            titleVN="Luyện tập từ vựng"
            detail="Let's start"
            linkTo="/ames/choose"
            color="info"
            imgLink={require('assets/img/home/assignment.svg')}
          />
          <CardHomePage
            {...props}
            title="VOA Special English"
            titleVN="Luyện nghe với VOA"
            detail="Let's start"
            linkTo="/ames/VOA-itemList"
            color="danger"
            imgLink={require('assets/img/home/assignment.svg')}
          // imgLink={require('assets/img/home/assignment.svg')}
          />
        </div>
      </Container>
      <StudentChoiceAccountModal
        users={state.users}
        toggleModal={toggleModal}
        saveAccount={saveAccount}
        isVisibled={state.isVisibled}
      />
    </>
  );

}

export default Dashboard;


