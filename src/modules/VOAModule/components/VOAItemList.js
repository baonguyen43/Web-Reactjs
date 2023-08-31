import React from 'react';
import classNames from 'classnames';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import * as Color from 'configs/color';
import { Modal, Form, Button as AntdButton } from 'antd';
import {
  Container,
  Col,
  Row,
  Button,
  ListGroup,
  Card,
  ListGroupItem,
  Input
} from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import NotData from 'components/Error/NotData';
import { dynamicApiAxios } from 'configs/api';
import Loading from 'components/Loading';

const defautColor = `active bg-${Color.PRIMARY} text-center`;

const inputTag = '........'
const VOAItemList = () => {
  const [state, setState] = React.useState({
    page: 0,
    isShowPopup: false,
    loading: false,
    VOAInfo: [],
    data: [],
    boolArray: [],
    loadingMore: false,
    isPointed: false,
    isCorrect: false,
  })

  const submitButton = React.useRef();
  const inputCount = React.useRef(0);
  const [form] = Form.useForm();

  const getData = React.useCallback(async () => {
    let data  = state.data
    setState((prevState) => ({ ...prevState, loadingMore: true }))
    const response = await dynamicApiAxios.query.post('', {
      sqlCommand: 'p_VOA_GetArticles_Paging_V2',
      parameters: { page:state.page },
    });

    data = !state.page ? response.data.items : data?.concat(response.data.items)

    setState((prevState) => ({ ...prevState, data, page: state.page + 1, loadingMore: false }))
  }, [state.data, state.page])

  React.useEffect(() => {
    getData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const Loadmore = React.useCallback(() => {
    getData()
  }, [getData])

  const transform = React.useCallback((node, index) => {
    if (node?.type === 'text') {
      if (!node.data.includes(inputTag)) return;
      const elementArray = node.data.split(inputTag);
      let currentInputNo = 0;

      return (
        <span key={index} style={{ fontSize: 25 }}>
          {elementArray.map((item, index) => {
            let color = 'black'
            
            if (index > 0) {
              
              currentInputNo = inputCount.current;
              if (state.isPointed) {
                color = state.boolArray[currentInputNo] ? 'green' : 'red'
              }
              const VOAInfo = JSON.parse(state.VOAInfo.correctAnswer)
              const maxInput = VOAInfo.length
              inputCount.current++;
              if (inputCount.current >= maxInput) {
                inputCount.current = 0;
              }
            }

            return (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <Form.Item
                    className='ml-2 mr-2'
                    name={currentInputNo}
                    style={{ display: 'inline-block', marginBottom: 0 }}
                    rules={[{ required: true, message: 'Please fill the answer' },]}
                  >
                    <div>
                      <Input
                        autoComplete='off'
                        style={{
                          color,
                          width: 150,
                          height: 30,
                          fontSize: 15,
                          marginTop: 7,
                          borderWidth: 0,
                          borderRadius: 0,
                          fontWeight: '500',
                          display: 'inline',
                          borderBottomWidth: 1,
                          borderStyle: 'dotted',
                          backgroundColor: 'white',
                          boxShadow: 'none',
                          borderBottomColor: '#bdc3c7',
                          textAlign: 'center',
                        }}
                        id={currentInputNo}
                      // disabled={state.isPointed}
                      // className={!state.isPointed ? styles.input : styles.checkInput}
                      />
                      {state.isPointed && state.boolArray[currentInputNo] && (
                        <CheckCircleOutlined style={{ fontSize: 25, color: '#2ecc71' }} />
                      )}
                      {state.isPointed && !state.boolArray[currentInputNo] && (
                        <CloseCircleOutlined style={{ fontSize: 25, color: '#e74c3c' }} />
                      )}
                    </div>
                  </Form.Item>
                )}
                <span style={{ fontSize: 15 }}>
                  {item}
                </span>
              </React.Fragment>
            )
          })}
        </span>
      )
    }
  }, [state.VOAInfo, state.boolArray, state.isPointed])

  const onFinish = React.useCallback((values) => {
    const bbb = JSON.parse(state.VOAInfo?.correctAnswer)
    let boolArray = []
    for (let index = 0; index < bbb?.length; index++) {
      const element = values[index];
      const isCorrect = element?.trim().toLowerCase() === bbb[index].text.trim().toLowerCase();
      boolArray.push(isCorrect)
    }

    setState((prevState) => ({ ...prevState, isPointed: true, boolArray }))
  }, [state.VOAInfo])

  const retryExcercise = React.useCallback(() => {
    form.resetFields();
    setState((prevState) => ({ ...prevState, isPointed: false }))
  }, [form])

  const renderDetailPopup = React.useCallback(() => {

    const noContent =
      state.VOAInfo.content === '<strong>No transcript is available</strong>';
    return (
      <Modal
        width="80vh"
        footer={null}
        destroyOnClose
        afterClose={retryExcercise}
        visible={state.isShowPopup}
        title={state.VOAInfo.title || 'Không có tiêu đề'}
        bodyStyle={{ height: noContent ? 200 : '60vh' }}
        // keyboard
        onCancel={() => setState((prevState) => ({ ...prevState, isShowPopup: false }))}
      >
        {/* {noContent ? (
          <p
            style={{ textAlign: 'center' }}
            dangerouslySetInnerHTML={{ __html: VOAInfo.content }}
          />
        ) : (
            <p
              style={{ textAlign: 'left', height: '90%' }}
              className={classNames(['ames-scrollbar'])}
              dangerouslySetInnerHTML={{ __html: VOAInfo.content }}
            />
          )} */}
        <div
          style={{ textAlign: 'left', height: '90%', position: 'relative' }}
          className={classNames(['ames-scrollbar'])}
        // dangerouslySetInnerHTML={{ __html: VOAInfo.content }}
        >
          <Form
            autoComplete="off"
            onFinish={onFinish}
            form={form}
          >
            {ReactHtmlParser(state.VOAInfo.content, { transform })}
            <Form.Item>
              <AntdButton style={{ display: 'none' }} ref={submitButton} id='submitButton' htmlType="submit">Check</AntdButton>
            </Form.Item>
          </Form>
        </div>

        <div className='d-flex justify-content-between' style={{ textAlign: 'center', marginTop: 4 }}>
          <audio style={{ width: '100%' }} controls="controls" src={state.VOAInfo.audioUrl} />
          <Button
            // id='submitButton'
            className='ml-2'
            color='danger'
            disabled={!state.isPointed}
            onClick={retryExcercise}
          >
            Retry
          </Button>
          <Button
            // id='submitButton'
            disabled={state.isPointed}
            color='primary'
            onClick={() => submitButton.current?.click()}
          >
            Check
          </Button>
        </div>
      </Modal>
    );
  }, [form, onFinish, retryExcercise, state.VOAInfo, state.isPointed, state.isShowPopup, transform])

  const renderItem = React.useCallback(() => {
    return state.data.map((item, index) => {
      if (item.content === '........') return null
      return (
        <div key={index}>
          <ListGroupItem
            onClick={() => {
              setState((prevState) => ({ ...prevState, VOAInfo: item, isShowPopup: true }))

            }}
            style={{ cursor: 'pointer' }}
            className="px-0"
          >
            <Row className="align-items-center ml-2 mr-2">
              <Col className="col-auto">
                <img src={item.imageUrl} alt={item.title} />
              </Col>
              <div className="col ml--2">
                <h4 className="mb-0">{item.title}</h4>
                {/* <span className="text-success">●</span> */}
                <small>{item.summary}</small>
              </div>
              <Col className="col-auto">
                <Button
                  onClick={() => {
                    setState((prevState) => ({ ...prevState, VOAInfo: item, isShowPopup: true }))

                  }}
                  color="danger"
                  size="sm"
                  type="button"
                >
                  Chi tiết
                </Button>
              </Col>
            </Row>
          </ListGroupItem>
        </div>
      );
    });
  }, [state.data])

  if (state.loadingMore) return <Loading />;

  if (state.data.length === 0) return <NotData />;

  return (
    <>
      <Container fluid>
        <Row>
          <div className="col mt-4">
            <Card
              style={{
                marginTop: 25,
              }}
            >
              <ListGroup className="list my--3" flush>
                <ListGroupItem
                  style={{
                    // backgroundColor: "#F5365C",
                    borderWidth: 0,
                    fontSize: 20,
                    fontWeight: '500',
                  }}
                  className={defautColor}
                >
                  <div className="d-flex justify-content-center">
                    {/* <Button
                        type="primary"
                        size="sm"
                        // color='warning'
                        // outline
                        onClick={() => props.history.push('/ames/VOA')}
                      >
                        <span className="btn-inner--icon mr-2">
                          <i className="fas fa-angle-left"></i>
                        </span>
                        Quay lại
                      </Button> */}
                      Danh sách VOA
                    </div>
                </ListGroupItem>
                {/* <div
                    style={{
                      overflowY: "scroll",
                      maxHeight: "60vh",
                    }}
                  > */}
                {renderItem()}
                {/* </div> */}
              </ListGroup>
              <Button disabled={state.loadingMore} color="default" onClick={Loadmore}>
                Xem thêm
                </Button>
            </Card>
          </div>
        </Row>
      </Container>
      <div style={{ marginTop: 10, textAlign: 'center' }}></div>
      {renderDetailPopup()}
    </>
  );

}
export default VOAItemList;
