import React from 'react';
import *as functions from 'components/functions';
import { dynamicApiAxios } from 'configs/api'
import Loading from 'components/Loading';
import { Collapse, Card, CardBody, CardHeader, Button, ListGroupItem, Row, Col } from 'reactstrap';
import moment from 'moment';
import _ from 'lodash';


const StartAmes = () => {
  const [state, setState] = React.useState({
    listData: [],
    loading: true,
    openedCollapses: []
  })

  React.useEffect(() => {
    const onGetListData = async () => {
      let StudentId = functions.getUser().StudentId;
      const stateModel = {};
      let total = 0;
      let listData = [];

      try {
        const response = await dynamicApiAxios.query.post('', {
          sqlCommand: '[dbo].[p_AMES247_AMES247_Session_Student_Star_Select_V2]',
          parameters: {
            StudentId,
          },
        });
       
        if (response.data.ok && response.data.items[0].sessionStudentStar !== null) {

          const arrData = JSON.parse(response.data.items[0].sessionStudentStar);
          const itemSessionId = _.uniqBy(arrData, function (e) {
            return e.sessionId;
          });

          itemSessionId.forEach((item) => {
            // listCourse.push(item.courseId);
            const arrCourse = _.filter(arrData, function (o) { return item.sessionId === o.sessionId; });
            listData.push(arrCourse);
          });

          for (let i = 0; i < arrData.length; i++) {
            total += arrData[i].star;
          }
          stateModel.listData = listData;
          stateModel.loading = false;
        }
    
        setState((prevState) => ({
          ...prevState,
          ...stateModel,
          totalStar: total
        }));
      } catch (error) {
        console.log(error);
        stateModel.loading = false;
      }
    }
    onGetListData();
  }, [])

  const collapsesToggle = React.useCallback((collapsesName) => {
    if (state.openedCollapses.includes(collapsesName)) {
      setState((prevState) => ({
        ...prevState,
        openedCollapses: []
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        openedCollapses: [collapsesName]
      }))
    }
  },[state.openedCollapses])

  const renderItem = React.useCallback(() => {
    return state.listData.map((item, index) => {
      let isTypePlus = false;
      let title = '';
      item.forEach((x) => {
        if (x.type.includes('PLUS')) {
          isTypePlus = true
          title = `    ${x.courseTitle} ${x.sessionTitle}`
        } else {
          title = '    Đổi quà'
        }

      });
      const iconName = isTypePlus ? 'far fa-calendar-plus text-success' : 'far fa-calendar-minus text-danger';
      const collapsesName = `collapse${index}`
     
      return (

        <Card key={index} className="card-plain">
          <CardHeader
            role="tab"
            onClick={() => collapsesToggle(collapsesName)}
            aria-expanded={state.openedCollapses.includes(collapsesName)}
          >
            <h5 className="mb-0 text-primary"><i fontSize={15} className={iconName} />{title}</h5>
          </CardHeader>
          <Collapse
            role="tabpanel"
            isOpen={state.openedCollapses.includes(collapsesName)}
          >
            <CardBody>
              {item.map((itemDetail, itemIndex) => {
                return (
                  <ListGroupItem key={itemIndex} className="px-0">
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
                        <h5 className="mb-0">
                          <a href="#pablo" onClick={e => e.preventDefault()}>
                            {moment(itemDetail.createdDate).format('DD/MM/YYYY hh:mm:ss a')}
                          </a>
                        </h5>
                      </div>
                      <Col className="col-auto">
                        <Button className='mr-2' color="primary" type="button">
                          {itemDetail.star}
                          <span className="fas fa-star ml-2" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                )
              })}
            </CardBody>
          </Collapse>
        </Card>
      )
    })
  }, [collapsesToggle, state.listData, state.openedCollapses])

  if (state.loading) return <Loading />;

  return (
    <div>
      <div className="accordion">
        {renderItem()}
      </div>

    </div >
  );

}

export default StartAmes;