import React from 'react';
import moment from 'moment';
import { DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, ListGroupItem, Row, Col, UncontrolledTooltip } from 'reactstrap';
import { dynamicApiAxios } from 'configs/api';
import { useSelector } from 'react-redux';
import './style.css';

const Notification = (props) => {
  const loggedInUser = useSelector((rootState) => rootState.loginReducer.loggedInUser)
  const [state, setState] = React.useState({ loading: true, notifiList: [], mock: [] })

  React.useEffect(() => {
    const getNotification = async () => {
      let UserId = '';
      if (loggedInUser?.typeLogin.includes('ames')) {
        UserId = loggedInUser?.userMyames?.UserId;
      } else {
        UserId = loggedInUser?.userMyai?.UserId
      }
      const listResponse = await dynamicApiAxios.query.post('', {
        sqlCommand: 'dbo.p_AMES247_GET_Notification_History',
        parameters: {
          UserId,
          Page: 0,
        },
      });
      const mock = listResponse.data.items.slice(0, 4);

      setState((prevState) => ({ ...prevState, notifiList: listResponse.data.items, loading: false, mock }))
    }
    getNotification();
  }, [loggedInUser])

  return (
    <UncontrolledDropdown nav>
      <DropdownToggle className='nav-link' color='' tag='a' style={{ cursor: 'pointer' }}>
        <i id='tooltipNotification' className="ni ni-notification-70"></i>

        <UncontrolledTooltip
          delay={0}
          placement="top"
          target="tooltipNotification"
        >
          Thông báo
        </UncontrolledTooltip>
      </DropdownToggle>
      <DropdownMenu className='dropdown-menu-xl py-0 overflow-hidden' right>
        <div className='px-3 py-3'>
          <h6 className='text-sm text-muted m-0'>
            You have <strong className='text-info'>{state.notifiList.length}</strong> notifications.
          </h6>
        </div>

        {state.mock.map((data) => {
          return (
            <ListGroupItem key={data.id} className='list-group-item-action' href='#pablo' onClick={() => props.history.push('/ames/Notifications')} tag='a'>
              <Row className='align-items-center'>
                <Col className='col-auto'>
                  <img alt='...' className='avatar rounded-circle' src='https://img.freepik.com/free-vector/teacher-concept-illustration_114360-1638.jpg?size=338&ext=jpg&ga=GA1.2.142961050.1599635043' />
                </Col>
                <div className='col ml--2'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <h4 className='mb-0 text-sm'>{data.title}</h4>
                    </div>
                    <div className='text-right text-muted'>
                      <small>{moment(data.createdDate).format('DD/MM/YYYY')}</small>
                    </div>
                  </div>
                  <p className='text-sm mb-0'>{data.subTitle}</p>
                </div>
              </Row>
            </ListGroupItem>
          );
        })}

        <DropdownItem className='text-center text-info font-weight-bold py-3' onClick={() => props.history.push('/ames/Notifications')}>
          View all
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

export default Notification;
