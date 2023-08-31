import React, { useEffect, useState, useRef } from 'react';
import ExcercisePage from 'components/CanvasToolPlus/ExcercisePage';
import { useParams } from 'react-router-dom';
import { get } from 'helpers/QueryHelper';
import NotData from 'components/Error/NotData';
import Loading from 'components/Loading';
import { CardFooter } from 'reactstrap'
import { Row, Col, Button } from 'antd';

const fetcher = (attachmentsId) => {
  if (!attachmentsId) return [];
  return get('Attachments', '*', { id: attachmentsId, entityName: 't_AMES247_Sessions' }, 'CreatedDate DESC', 'SHARE');
};

const LiveWorkSheetReview = () => {
  let { id } = useParams();
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [tryAgain, setTryAgain] = useState(false);
  const refSubmit = useRef({});

  useEffect(() => {
    fetcher(id).then((res) => {
      if (res[0] === undefined) return;
      const { id, fileName, jsonData } = res[0];
      setFile({ id, fileName, jsonData });
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
    return () => {
      setFile();
    };
  }, [id]);
  if (isLoading) return <Loading />
  if (!file) return <NotData />
  return (
    <div>
      <div style={{ height: 'calc(100vh - 61px)' }}>
        <ExcercisePage file={file} refSubmit={refSubmit} isTeacher={true} />
      </div>
      <CardFooter style={{ textAlign: 'end', padding: 10 }}>
        <Row>
          <Col span={8}>
            <div />
          </Col>
          <Col span={8} className='d-flex justify-content-center align-items-center'>
            <div id='Footer-ExcercisePage-Audio' />
          </Col>
          <Col span={8}>
            {tryAgain ?
              <Button onClick={() => {
                refSubmit.current.tryAgain();
                setTryAgain(false);
              }} type='primary'>Làm lại</Button> :
              <Button onClick={() => {
                refSubmit.current.submit();
                setTryAgain(true);
              }} type='primary'>Nộp bài</Button>
            }
          </Col>
        </Row>
      </CardFooter>
    </div >
  );
};

export default LiveWorkSheetReview;
