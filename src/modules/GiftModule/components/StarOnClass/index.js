import React from 'react';
import *as functions from 'components/functions';
import { dynamicApiAxios } from 'configs/api'
import Loading from 'components/Loading';
import { ListGroup, ListGroupItem, Row, Col, Button } from 'reactstrap';
import moment from 'moment';

const StartOnClass = () => {
  const [state, setState] = React.useState({
    listData: [],
    loading: true
  })
  React.useEffect(() => {
    const onGetListData = async () => {
      let StudentId = functions.getUser().StudentId;

      const stateModel = {};
      let total = 0;
      try {
        const response = await dynamicApiAxios.query.post('', {
          sqlCommand: '[EBM.SOFTECH.EDU.VN].[dbo].[p_MyAmes_StudentStar]',
          parameters: {
            StudentId,
          },
        });

        if (response.data.ok) {
          stateModel.listData = response.data.items;
          stateModel.loading = false;
        }
      } catch (error) {
        console.log(error);
      }
      for (let i = 0; i < stateModel.listData.length; i++) {
        total += stateModel.listData[i].star;
      }
      setState((prevState) => ({ ...prevState, totalStar: total, ...stateModel }));
    }
    onGetListData();
  }, [])

  const renderItem = React.useCallback(() => {
    return state.listData.map((item, index) => {
      // const iconColor = item.star < 0 ? 'text-danger' : 'text-success';
      const iconName = item.star < 0 ? 'far fa-calendar-minus text-danger' : 'far fa-calendar-plus text-success';
      return (
        <ListGroupItem key={index} className="px-0">
          <Row className="align-items-center">
            <Col className="col-auto">
              <a
                className="avatar rounded-circle"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <img
                  alt="..."
                  src='https://image.freepik.com/free-vector/start_53876-25533.jpg'
                />
              </a>
            </Col>
            <div className="col ml--2">
              <p style={{fontSize:13, fontWeight: '500'}} className="mb-0 text-primary">
                
                  {moment(item.date).format('DD/MM/YYYY hh:mm:ss a')}
              
              </p>

              <small><i style={{ fontSize: 15 }} className={iconName} /></small>
            </div>
            <Col className="col-auto">
              <Button color="primary" type="button">
                {item.star}
                <span className="fas fa-star ml-2" />
              </Button>
            </Col>
          </Row>
        </ListGroupItem>
      )
    })
  }, [state.listData])

  if (state.loading) return <Loading />;

  return (
    <div>
      <ListGroup className="list my--3" flush>
        {renderItem()}
      </ListGroup>
    </div>
  );

}

export default StartOnClass;